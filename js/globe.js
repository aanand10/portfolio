// Stylized dot-matrix globe built with three.js.
//
// Landmasses come from the Natural Earth coastline rings in data/world-land.js.
// Those rings are rasterised once into an equirectangular bitmask, then a
// Fibonacci sphere (uniform point distribution) is sampled against that mask —
// so every dot sits on real land, with no texture image to download.
(function () {
  const DEG2RAD = Math.PI / 180;

  // Real coastlines: the Natural Earth rings are rasterised once into an
  // equirectangular bitmask, which is then a cheap O(1) lookup per sample point.
  const MASK_W = 1024;
  const MASK_H = 512;
  let landMask = null;

  function buildLandMask() {
    if (landMask !== null) return landMask;

    const rings = window.WORLD_LAND_RINGS;
    if (!rings || !rings.length) {
      landMask = false;
      return landMask;
    }

    const canvas = document.createElement("canvas");
    canvas.width = MASK_W;
    canvas.height = MASK_H;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    for (let r = 0; r < rings.length; r++) {
      const ring = rings[r];
      for (let i = 0; i < ring.length; i++) {
        const x = ((ring[i][0] + 180) / 360) * MASK_W;
        const y = ((90 - ring[i][1]) / 180) * MASK_H;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
    }
    // even-odd so interior rings (lakes) are punched out
    ctx.fill("evenodd");

    const data = ctx.getImageData(0, 0, MASK_W, MASK_H).data;
    const mask = new Uint8Array(MASK_W * MASK_H);
    for (let i = 0; i < mask.length; i++) {
      mask[i] = data[i * 4 + 3] > 128 ? 1 : 0;
    }
    landMask = mask;
    return landMask;
  }

  function isLand(lat, lon) {
    const mask = buildLandMask();
    if (!mask) return false;
    let x = Math.floor(((lon + 180) / 360) * MASK_W);
    let y = Math.floor(((90 - lat) / 180) * MASK_H);
    if (x < 0) x = 0;
    else if (x >= MASK_W) x = MASK_W - 1;
    if (y < 0) y = 0;
    else if (y >= MASK_H) y = MASK_H - 1;
    return mask[y * MASK_W + x] === 1;
  }

  function latLonToVector3(lat, lon, radius) {
    const phi = (90 - lat) * DEG2RAD;
    const theta = (lon + 180) * DEG2RAD;
    return new THREE.Vector3(
      -radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  }

  // Rotation that brings a given lat/lon to face the camera.
  // Group euler order is XYZ, so Y (longitude) is applied before X (latitude).
  function rotationForLatLon(lat, lon) {
    const p = latLonToVector3(lat, lon, 1);
    return { x: lat * DEG2RAD, y: Math.atan2(-p.x, p.z) };
  }

  function pointToLatLon(x, y, z) {
    const lat = 90 - Math.acos(Math.max(-1, Math.min(1, y))) * (180 / Math.PI);
    let thetaDeg = Math.atan2(z, -x) * (180 / Math.PI);
    let lon = thetaDeg - 180;
    if (lon < -180) lon += 360;
    return { lat, lon };
  }

  function fibonacciSphere(samples) {
    const points = [];
    const offset = 2 / samples;
    const increment = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < samples; i++) {
      const y = i * offset - 1 + offset / 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const phi = i * increment;
      points.push({ x: Math.cos(phi) * r, y, z: Math.sin(phi) * r });
    }
    return points;
  }

  function makeDotTexture(color) {
    const size = 64;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d");
    // Hard core with a short falloff — a soft gradient washes out at small dot sizes
    const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.45, color);
    grad.addColorStop(0.75, color);
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(canvas);
  }

  const SVG_NS = "http://www.w3.org/2000/svg";

  function createGlobe(container, options) {
    if (!window.THREE || !container) return null;
    options = options || {};

    const radius = options.radius || 1;
    const dotCount = options.dotCount || 5000;
    const accent = options.accentColor || "#ff5c8d";
    const pins = options.pins || [];
    const showArcs = options.showArcs !== false && pins.length > 1;
    const showLabels = options.showLabels === true && pins.length > 0;
    const interactive = options.interactive !== false;
    const autoRotate = options.autoRotate !== false;
    const sway = options.sway || 0;
    const glowScale = 1.15;
    const fitToView = options.fitToView === true;
    const glowStrength = options.glowStrength !== undefined ? options.glowStrength : 0.6;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = options.cameraZ || radius * 3.2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // Land dots
    const positions = [];
    fibonacciSphere(dotCount).forEach((p) => {
      const { lat, lon } = pointToLatLon(p.x, p.y, p.z);
      if (isLand(lat, lon)) {
        positions.push(p.x * radius, p.y * radius, p.z * radius);
      }
    });
    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    const dotMat = new THREE.PointsMaterial({
      size: options.dotSize || radius * 0.035,
      map: makeDotTexture(accent),
      color: options.dotColor || accent,
      transparent: true,
      depthWrite: false,
      sizeAttenuation: true,
      // Normal (not additive) blending: additive stacks up at the limb where the
      // sphere foreshortens, blowing out the rim while face-on land stays dim
      blending: THREE.NormalBlending,
      opacity: 1,
    });
    group.add(new THREE.Points(dotGeo, dotMat));

    // Faint lat/lon wireframe
    const wireMat = new THREE.MeshBasicMaterial({
      color: accent,
      wireframe: true,
      transparent: true,
      opacity: 0.06,
    });
    group.add(new THREE.Mesh(new THREE.SphereGeometry(radius * 0.995, 24, 16), wireMat));

    // Opaque occluder so far-side dots don't show through
    const occluderMat = new THREE.MeshBasicMaterial({ colorWrite: false });
    group.add(new THREE.Mesh(new THREE.SphereGeometry(radius * 0.99, 32, 32), occluderMat));

    // Outer atmosphere glow (cheap fresnel-style shader)
    const glowMat = new THREE.ShaderMaterial({
      uniforms: { glowColor: { value: new THREE.Color(accent) }, glowStrength: { value: glowStrength } },
      vertexShader: `
        varying float intensity;
        void main() {
          vec3 vNormal = normalize(normalMatrix * normal);
          // max() guards pow() against a negative base, and the lower exponent
          // spreads the rim into a softer, more diffuse halo
          float rim = max(0.0, 0.74 - dot(vNormal, vec3(0.0, 0.0, 1.0)));
          intensity = pow(rim, 2.2);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        uniform float glowStrength;
        varying float intensity;
        void main() {
          gl_FragColor = vec4(glowColor, clamp(intensity, 0.0, 1.0) * glowStrength);
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
    });
    group.add(new THREE.Mesh(new THREE.SphereGeometry(radius * glowScale, 32, 32), glowMat));

    // Starfield — three layers of differing size/brightness so the field reads
    // as depth rather than a flat sheet of identical specks
    if (options.starfield) {
      const total = options.starCount || 900;
      const starSprite = makeDotTexture("rgba(255,255,255,0.9)");
      const layers = [
        { n: Math.round(total * 0.58), size: radius * 0.014, opacity: 0.3 },
        { n: Math.round(total * 0.29), size: radius * 0.024, opacity: 0.52 },
        { n: Math.round(total * 0.13), size: radius * 0.038, opacity: 0.8 },
      ];

      // Spread stars through the camera's view cone instead of the whole
      // sphere — a uniform shell wastes ~90% of them outside the frustum
      const cosMax = Math.cos(52 * DEG2RAD);

      layers.forEach((layer) => {
        const starPos = [];
        for (let i = 0; i < layer.n; i++) {
          const u = cosMax + (1 - cosMax) * Math.random();
          const theta = Math.acos(u);
          const phi = Math.random() * Math.PI * 2;
          const sinT = Math.sin(theta);
          const dist = radius * (3.5 + Math.random() * 7);
          starPos.push(
            sinT * Math.cos(phi) * dist,
            sinT * Math.sin(phi) * dist,
            -u * dist
          );
        }
        const starGeo = new THREE.BufferGeometry();
        starGeo.setAttribute("position", new THREE.Float32BufferAttribute(starPos, 3));
        scene.add(
          new THREE.Points(
            starGeo,
            new THREE.PointsMaterial({
              size: layer.size,
              map: starSprite,
              color: "#ffffff",
              transparent: true,
              opacity: layer.opacity,
              depthWrite: false,
              sizeAttenuation: true,
            })
          )
        );
      });
    }

    // Label overlay (HTML labels + SVG leader lines projected from 3D pin positions)
    let overlay = null;
    let leaderSvg = null;
    if (showLabels) {
      overlay = document.createElement("div");
      overlay.className = "globe-overlay";
      leaderSvg = document.createElementNS(SVG_NS, "svg");
      leaderSvg.setAttribute("class", "globe-leaders");
      overlay.appendChild(leaderSvg);
      container.appendChild(overlay);
    }

    // Pins
    const pinMeshes = [];
    pins.forEach((pin, index) => {
      const pos = latLonToVector3(pin.lat, pin.lon, radius * 1.01);

      const pinMesh = new THREE.Mesh(
        new THREE.SphereGeometry(radius * 0.022, 12, 12),
        new THREE.MeshBasicMaterial({ color: "#ffffff" })
      );
      pinMesh.position.copy(pos);
      group.add(pinMesh);

      const ring = new THREE.Mesh(
        new THREE.RingGeometry(radius * 0.026, radius * 0.034, 32),
        new THREE.MeshBasicMaterial({
          color: accent,
          transparent: true,
          opacity: 0.85,
          side: THREE.DoubleSide,
        })
      );
      ring.position.copy(pos);
      group.add(ring);

      // Vertical beam so the pin reads even at small screen sizes
      const beamEnd = pos.clone().normalize().multiplyScalar(radius * 1.16);
      const beamGeo = new THREE.BufferGeometry().setFromPoints([pos, beamEnd]);
      const beam = new THREE.Line(
        beamGeo,
        new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.55 })
      );
      group.add(beam);

      let labelEl = null;
      let leaderEl = null;
      if (showLabels) {
        labelEl = document.createElement("div");
        labelEl.className = "globe-label";
        labelEl.innerHTML = `<span class="globe-label-city">${pin.city}</span>${
          pin.company ? `<span class="globe-label-company">${pin.company}</span>` : ""
        }`;
        overlay.appendChild(labelEl);

        leaderEl = document.createElementNS(SVG_NS, "line");
        leaderEl.setAttribute("class", "globe-leader");
        leaderSvg.appendChild(leaderEl);
      }

      pinMeshes.push({
        mesh: pinMesh,
        ring,
        beam,
        pos,
        data: pin,
        index,
        labelEl,
        leaderEl,
        offset: pin.labelOffset || [70, -10],
      });
    });

    // Career-path arcs between consecutive pins
    const arcLines = [];
    if (showArcs) {
      for (let i = 0; i < pins.length - 1; i++) {
        const start = latLonToVector3(pins[i].lat, pins[i].lon, radius * 1.01);
        const end = latLonToVector3(pins[i + 1].lat, pins[i + 1].lon, radius * 1.01);
        const mid = start.clone().add(end).multiplyScalar(0.5);
        // Close-together cities need a floor on arc height or the curve is invisible
        const altitude = Math.max(start.distanceTo(end) * 0.5, radius * 0.12);
        mid.normalize().multiplyScalar(radius + altitude);

        const curvePoints = new THREE.QuadraticBezierCurve3(start, mid, end).getPoints(64);
        const arcGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
        arcGeo.setDrawRange(0, 0);
        const arcLine = new THREE.Line(
          arcGeo,
          new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.9 })
        );
        group.add(arcLine);
        arcLines.push({ line: arcLine, total: curvePoints.length, delay: i * 600 });
      }
    }

    // Initial orientation
    const focus = options.focus;
    if (focus) {
      const r = rotationForLatLon(focus.lat, focus.lon);
      group.rotation.x = r.x;
      group.rotation.y = r.y;
    }
    const baseRotation = { x: group.rotation.x, y: group.rotation.y };
    let target = null; // {x, y} when animating toward a focused pin
    let spinBoost = 0; // extra spin fed in from scroll velocity, decays each frame
    let activeIndex = -1;

    // Sizing
    let width = 0;
    let height = 0;
    function resize() {
      width = container.clientWidth;
      height = container.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height);
      camera.aspect = width / height;

      if (fitToView) {
        // Pull the camera back far enough that the whole sphere *including its
        // glow shell* clears both axes, so it is never sliced by the canvas edge
        const vHalf = (camera.fov * DEG2RAD) / 2;
        const hHalf = Math.atan(Math.tan(vHalf) * camera.aspect);
        const half = Math.min(vHalf, hHalf);
        camera.position.z = (radius * glowScale * 1.03) / Math.sin(half);
      }

      camera.updateProjectionMatrix();
      if (leaderSvg) {
        leaderSvg.setAttribute("width", width);
        leaderSvg.setAttribute("height", height);
        leaderSvg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      }
    }
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    // Drag-to-rotate
    let isDragging = false;
    let userInteracted = false;
    let lastX = 0;
    let lastY = 0;
    let idleTimer = null;

    function pointerXY(e) {
      const t = e.touches ? e.touches[0] : e;
      return { x: t.clientX, y: t.clientY };
    }
    function onPointerDown(e) {
      isDragging = true;
      userInteracted = true;
      target = null;
      const p = pointerXY(e);
      lastX = p.x;
      lastY = p.y;
    }
    function onPointerMove(e) {
      if (!isDragging) return;
      const p = pointerXY(e);
      const dx = p.x - lastX;
      const dy = p.y - lastY;
      group.rotation.y += dx * 0.005;
      group.rotation.x = Math.max(-1, Math.min(1, group.rotation.x + dy * 0.005));
      lastX = p.x;
      lastY = p.y;
    }
    function onPointerUp() {
      if (!isDragging) return;
      isDragging = false;
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        userInteracted = false;
        // A non-spinning globe drifts back to its focus point after a while
        if (!autoRotate) target = { x: baseRotation.x, y: baseRotation.y };
      }, 3000);
    }

    if (interactive) {
      renderer.domElement.style.cursor = "grab";
      renderer.domElement.style.touchAction = "none";
      renderer.domElement.addEventListener("mousedown", onPointerDown);
      renderer.domElement.addEventListener("touchstart", onPointerDown, { passive: true });
      window.addEventListener("mousemove", onPointerMove);
      window.addEventListener("touchmove", onPointerMove, { passive: true });
      window.addEventListener("mouseup", onPointerUp);
      window.addEventListener("touchend", onPointerUp);
    }

    const clock = new THREE.Clock();
    const startTime = performance.now();
    const autoRotateSpeed = options.rotateSpeed || 0.0012;
    const tmpVec = new THREE.Vector3();
    let frameId;

    function animate() {
      frameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const now = performance.now();

      if (target) {
        group.rotation.x += (target.x - group.rotation.x) * 0.08;
        group.rotation.y += (target.y - group.rotation.y) * 0.08;
        if (
          Math.abs(target.x - group.rotation.x) < 0.001 &&
          Math.abs(target.y - group.rotation.y) < 0.001
        ) {
          target = null;
        }
      } else if (!userInteracted) {
        if (autoRotate) {
          group.rotation.y += (autoRotateSpeed + spinBoost) * delta * 60;
          spinBoost *= 0.92;
        } else if (sway) {
          // Gentle breathing motion so the globe never looks frozen
          group.rotation.y = baseRotation.y + Math.sin(now * 0.00022) * sway;
          group.rotation.x = baseRotation.x + Math.sin(now * 0.00016) * sway * 0.4;
        }
      }

      group.updateMatrixWorld(true);

      pinMeshes.forEach((p, i) => {
        const isActive = activeIndex === i;
        const pulse = (Math.sin(now * 0.003 + i * 1.7) + 1) / 2;

        p.ring.quaternion.copy(camera.quaternion);
        const scale = (isActive ? 1.6 : 1) * (1 + pulse * 0.4);
        p.ring.scale.setScalar(scale);
        p.ring.material.opacity = (isActive ? 1 : 0.9) - pulse * 0.5;
        p.mesh.scale.setScalar(isActive ? 1.6 : 1);
        p.beam.material.opacity = isActive ? 0.9 : 0.5;

        if (!p.labelEl) return;

        // Project the pin into screen space to place its HTML label
        tmpVec.copy(p.pos).applyMatrix4(group.matrixWorld);
        const facing = tmpVec.clone().normalize().z;
        const proj = tmpVec.clone().project(camera);
        const sx = (proj.x * 0.5 + 0.5) * width;
        const sy = (-proj.y * 0.5 + 0.5) * height;

        // Offsets are authored for a wide globe; scale them down on small
        // containers and clamp so labels never clip outside the canvas
        const s = Math.max(0.55, Math.min(1, width / 620));
        const halfW = p.labelEl.offsetWidth / 2 + 4;
        const halfH = p.labelEl.offsetHeight / 2 + 4;
        const lx = Math.max(halfW, Math.min(width - halfW, sx + p.offset[0] * s));
        const ly = Math.max(halfH, Math.min(height - halfH, sy + p.offset[1] * s));

        if (facing > 0.02) {
          const fade = Math.min(1, facing * 6);
          p.labelEl.style.opacity = fade;
          p.labelEl.style.left = lx + "px";
          p.labelEl.style.top = ly + "px";
          p.labelEl.classList.toggle("is-active", isActive);
          p.leaderEl.setAttribute("x1", sx);
          p.leaderEl.setAttribute("y1", sy);
          p.leaderEl.setAttribute("x2", lx);
          p.leaderEl.setAttribute("y2", ly);
          p.leaderEl.style.opacity = fade * (isActive ? 1 : 0.55);
        } else {
          p.labelEl.style.opacity = 0;
          p.leaderEl.style.opacity = 0;
        }
      });

      const elapsed = now - startTime;
      arcLines.forEach(({ line, total, delay }) => {
        const t = Math.max(0, Math.min(1, (elapsed - 800 - delay) / 1200));
        line.geometry.setDrawRange(0, Math.floor(total * t));
      });

      renderer.render(scene, camera);
    }
    animate();

    return {
      group,
      pins: pinMeshes,
      setActive(index) {
        activeIndex = typeof index === "number" ? index : -1;
      },
      focusOn(index) {
        const pin = pins[index];
        if (!pin) return;
        activeIndex = index;
        userInteracted = false;
        target = rotationForLatLon(pin.lat, pin.lon);
      },
      // Adds a burst of spin (e.g. from scroll velocity) on auto-rotating globes
      nudge(amount) {
        spinBoost = Math.max(-0.03, Math.min(0.03, spinBoost + amount));
      },
      reset() {
        activeIndex = -1;
        target = { x: baseRotation.x, y: baseRotation.y };
      },
      destroy() {
        cancelAnimationFrame(frameId);
        clearTimeout(idleTimer);
        resizeObserver.disconnect();
        window.removeEventListener("mousemove", onPointerMove);
        window.removeEventListener("touchmove", onPointerMove);
        window.removeEventListener("mouseup", onPointerUp);
        window.removeEventListener("touchend", onPointerUp);
        renderer.dispose();
        if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
        if (overlay && container.contains(overlay)) container.removeChild(overlay);
      },
    };
  }

  function initPortfolioGlobes(siteData) {
    const globes = { hero: null, journey: null };
    if (!window.THREE) return globes;
    const accent =
      getComputedStyle(document.documentElement).getPropertyValue("--accent-color").trim() ||
      "#ff5c8d";

    // Phones render both globes at once on far weaker GPUs — thin the dots out
    const detail = window.innerWidth < 768 ? 0.5 : 1;

    const heroEl = document.getElementById("hero-globe");
    if (heroEl) {
      globes.hero = createGlobe(heroEl, {
        radius: 1,
        dotCount: Math.round(62000 * detail),
        accentColor: accent,
        // Fixed distance (not fitToView) so the sphere fills its CSS circle —
        // the container's own gradient is what reads as the planet body here
        cameraZ: 2.6,
        dotSize: 0.0112,
        rotateSpeed: 0.0016,
        starfield: true,
        starCount: Math.round(700 * detail),
        glowStrength: 0.34,
        // Open on the land-rich hemisphere rather than an empty Pacific face
        focus: { lat: 12, lon: 45 },
      });
    }

    const journeyEl = document.getElementById("journey-globe");
    if (journeyEl && siteData.journey && siteData.journey.pins) {
      const pins = siteData.journey.pins;
      // Hold the globe on the region the pins live in instead of spinning it away
      const focus = {
        lat: pins.reduce((sum, p) => sum + p.lat, 0) / pins.length,
        lon: pins.reduce((sum, p) => sum + p.lon, 0) / pins.length,
      };

      const globe = (globes.journey = createGlobe(journeyEl, {
        radius: 1.35,
        dotCount: Math.round(70000 * detail),
        accentColor: accent,
        fitToView: true,
        dotSize: 0.014,
        pins: pins,
        showArcs: true,
        showLabels: true,
        autoRotate: false,
        sway: 0.09,
        starfield: true,
        starCount: Math.round(1600 * detail),
        glowStrength: 0.3,
        focus: focus,
      }));

      if (globe) {
        document.querySelectorAll(".journey-pin-item").forEach((card) => {
          const index = parseInt(card.dataset.index, 10);
          const activate = () => {
            globe.setActive(index);
            document
              .querySelectorAll(".journey-pin-item")
              .forEach((c) => c.classList.toggle("is-active", c === card));
          };
          const deactivate = () => {
            globe.setActive(-1);
            card.classList.remove("is-active");
          };
          card.addEventListener("mouseenter", activate);
          card.addEventListener("focus", activate);
          card.addEventListener("mouseleave", deactivate);
          card.addEventListener("blur", deactivate);
          card.addEventListener("click", () => globe.focusOn(index));
        });
      }
    }
    return globes;
  }

  window.PortfolioGlobe = { createGlobe, initPortfolioGlobes };
})();
