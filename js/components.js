// Component functions to render different sections of the website

// Navigation component
function renderNavigation(data) {
  const { logo, links } = data;
  const mainLinks = links.filter((link) => !link.cta);
  const cta = links.find((link) => link.cta);

  return `
    <div class="nav-pill">
      <a href="#hero" class="nav-brand" aria-label="Back to top">
        <span class="nav-brand-icon"><i class="${logo.icon}"></i></span>
        ${logo.name ? `<span class="nav-brand-name">${logo.name}</span>` : ""}
      </a>
      <ul class="nav-links">
        ${mainLinks
          .map(
            (link) => `
          <li>
            <a href="${link.href}" aria-label="${link.text}" title="${link.text}">
              <i class="${link.icon}" aria-hidden="true"></i>
              <span>${link.text}</span>
            </a>
          </li>`
          )
          .join("")}
      </ul>
      ${
        cta
          ? `<a href="${cta.href}" class="nav-cta" aria-label="${cta.text}" title="${cta.text}">
              <i class="${cta.icon}" aria-hidden="true"></i>
              <span>${cta.text}</span>
            </a>`
          : ""
      }
    </div>
  `;
}

// Hero component
function renderHero(data) {
  const { subtitle, title, description, buttons } = data;

  return `
    <div class="hero-content">
      <span class="hero-subtitle">${subtitle}</span>
      <h1>${title}</h1>
      <p class="hero-description">${description}</p>
      <div class="hero-buttons">
        ${buttons
          .map(
            (btn) => `
          <a href="${btn.url}" class="${btn.class}" ${
              btn.target ? `target="${btn.target}"` : ""
            }>
            <i class="${btn.icon}"></i> ${btn.text}
          </a>
        `
          )
          .join("")}
      </div>
    </div>
    <div class="hero-globe" id="hero-globe" aria-label="Rotating dot-matrix globe"></div>
    <div class="scroll-indicator">
      <span>Scroll Down</span>
      <i class="fas fa-chevron-down"></i>
    </div>
  `;
}

// About component
function renderAbout(data) {
  const { subtitle, title, description, paragraphs } = data;

  return `
    <div class="section-header">
      <span class="section-subtitle">${subtitle}</span>
      <h2 class="section-title">${title}</h2>
      <p class="section-description">${description}</p>
    </div>
    <div class="about-content">
      <div class="about-text">
        ${paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("")}
      </div>
    </div>
  `;
}

// Journey component (globe with pins)
function renderJourney(data) {
  const { subtitle, title, description, pins } = data;

  return `
    <div class="section-header">
      <span class="section-subtitle">${subtitle}</span>
      <h2 class="section-title">${title}</h2>
      <p class="section-description">${description}</p>
    </div>
    <div class="journey-content">
      <div class="journey-globe-wrap">
        <div class="journey-globe" id="journey-globe" aria-label="Interactive dot-matrix globe with career location pins"></div>
        <div class="journey-hint">
          <i class="fas fa-arrows-left-right-to-line"></i> Drag to spin &middot; hover a stop to focus
        </div>
      </div>
      <div class="journey-timeline">
        <div class="journey-route">
          ${pins.map((pin) => `<span>${pin.city}</span>`).join('<i class="fas fa-arrow-right"></i>')}
        </div>
        <div class="journey-pins-list">
          ${pins
            .map(
              (pin, index) => `
            <button type="button" class="journey-pin-item" data-index="${index}">
              <span class="journey-index">${String(index + 1).padStart(2, "0")}</span>
              <div class="journey-pin-info">
                <h4>${pin.company}</h4>
                <span class="period">${pin.period}</span>
                <span class="city"><i class="fas fa-location-dot"></i> ${pin.city}</span>
              </div>
            </button>
          `
            )
            .join("")}
        </div>
      </div>
    </div>
  `;
}

// Experience component
function renderExperience(data) {
  const { subtitle, title, description, jobs, companyLogo, companyName } = data;

  return `
    <div class="section-header">
      
        <span class="section-subtitle">${subtitle}</span>
        <h2 class="section-title">${title}</h2>
        <p class="section-description">${description}</p>
    
    </div>
    <div class="experience-timeline">
      ${jobs
        .map(
          (job) => `
        <div class="experience-card">
          <div class="experience-company">
           
           <div class="experience-company-info">
              <h3>${job.company}</h3>
              <span class="date">${job.period}</span>
           </div>
          </div>
          <div class="experience-content">
            <h4>${job.title}</h4>
            ${job.description ? `<p>${job.description}</p>` : ""}
            
            <div class="experience-body">
              <div class="experience-highlights-container">
                <ul class="experience-highlights">
                  ${job.highlights
                    .map((highlight) => `<li>${highlight}</li>`)
                    .join("")}
                </ul>
              </div>
              
              ${
                job.achievementImages && job.achievementImages.length > 0
                  ? `
                <div class="achievement-gallery stacked">
                  <div class="achievement-badge">Featured Achievements</div>
                  <div class="achievement-stack">
                    ${job.achievementImages
                      .map(
                        (img, index) => `
                      <div class="achievement-card" style="--index: ${index}">
                        <div class="achievement-image-wrapper">
                          <img src="${img}" alt="Achievement Award ${
                          index + 1
                        }" alt="Achievement Award" loading="lazy" decoding="async" />
                        </div>
                      </div>
                    `
                      )
                      .join("")}
                  </div>
                </div>
              `
                  : ""
              }
            </div>

            ${
              job.projects
                ? `
              <div class="projects-section">
                <h5>Projects</h5>
                ${job.projects
                  .map(
                    (project, index) => `
                  <div class="project-item">
                    <h6>${index + 1}. ${project.title}</h6>
                    <p><em>${project.tech}</em></p>
                    <ul>
                      ${project.achievements
                        .map((achievement) => `<li>${achievement}</li>`)
                        .join("")}
                    </ul>
                  </div>
                `
                  )
                  .join("")}
              </div>
            `
                : ""
            }
          </div>
        </div>
      `
        )
        .join("")}
    </div>
  `;
}

// Internships component
function renderInternships(data) {
  const { subtitle, title, items } = data;
  return `
    <div class="section-header">
      <span class="section-subtitle">${subtitle}</span>
      <h2 class="section-title">${title}</h2>
    </div>
    <div class="internships-list">
      ${items
        .map(
          (item) => `
        <div class="internship-card">
          <div class="internship-meta">
            <span class="internship-period">${item.period}</span>
            <span class="internship-title"><strong>${item.company}</strong> — <span>${item.title}</span></span>
          </div>
          <div class="internship-desc">${item.description}</div>
         <!-- <a href="${item.certificate.url}" class="internship-certificate" target="_blank">${item.certificate.text}</a> -->
        </div>
      `
        )
        .join("")}
    </div>
  `;
}

// Skills component
function renderSkills(data) {
  const { subtitle, title, description, categories } = data;

  return `
    <div class="section-header">
      <span class="section-subtitle">${subtitle}</span>
      <h2 class="section-title">${title}</h2>
      <p class="section-description">${description}</p>
    </div>
    <div class="skills-grid">
      ${categories
        .map(
          (category) => `
        <div class="skill-category">
          <h3>${category.title}</h3>
          <p>${category.description}</p>
          <div class="skills-container">
            ${category.skills
              .map((skill) => `<div class="skill-tag">${skill}</div>`)
              .join("")}
          </div>
        </div>
      `
        )
        .join("")}
    </div>
  `;
}

// Projects component
function renderProjects(data) {
  const { subtitle, title, description, items, moreProjectsLink } = data;

  return `
    <div class="section-header">
      <span class="section-subtitle">${subtitle}</span>
      <h2 class="section-title">${title}</h2>
      <p class="section-description">${description}</p>
    </div>
    <div class="projects-grid">
      ${items
        .map(
          (project) => `
        <div class="project-card">
         
          <div class="project-content">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <div class="project-links">
              <a href="${project.link}" class="project-link" target="_blank">View Project</a>
            </div>
          </div>
        </div>
      `
        )
        .join("")}
    </div>
    <div class="more-projects">
      <a href="${moreProjectsLink}" target="_blank" class="more-projects-btn">
        View More Projects <i class="fas fa-arrow-right"></i>
      </a>
    </div>
  `;
}

// Blogs component
function renderBlogs(data) {
  const { subtitle, title, description, items } = data;

  return `
    <div class="section-header">
      <span class="section-subtitle">${subtitle}</span>
      <h2 class="section-title">${title}</h2>
      <p class="section-description">${description}</p>
    </div>
    <div class="blog-grid">
      ${items
        .map(
          (blog) => `
        <div class="blog-card">
          ${blog.isLatest ? '<div class="blog-label">Latest</div>' : ""}
          <div class="blog-content">
            <div class="blog-meta">
              <span class="blog-date">${blog.date}</span>
              <span class="blog-category">${blog.category}</span>
            </div>
            <h3>${blog.title}</h3>
            <p>${blog.description}</p>
            <a href="${blog.link}" target="_blank" class="blog-link">Read on ${
            blog.platform
          } <i class="fas fa-external-link-alt"></i></a>
          </div>
        </div>
      `
        )
        .join("")}
    </div>
  `;
}

// Contact component
function renderContact(data) {
  const { subtitle, title, description, info, form } = data;

  return `
    <div class="section-header">
      <span class="section-subtitle">${subtitle}</span>
      <h2 class="section-title">${title}</h2>
      <p class="section-description">${description}</p>
    </div>
    <div class="contact-grid">
      <div class="contact-info">
        ${info
          .map(
            (item) => `
          <div class="contact-item">
            <i class="${item.icon}"></i>
            <div class="contact-item-content">
              <h4>${item.title}</h4>
              ${
                item.isLink
                  ? `<a href="${item.link}" ${
                      item.link.startsWith("http") ? 'target="_blank"' : ""
                    }>${item.value}</a>`
                  : `<p>${item.value}</p>`
              }
            </div>
          </div>
        `
          )
          .join("")}
      </div>
     
    </div>
  `;
}

// Footer component
function renderFooter(data) {
  const { logo, copyright } = data;
  const navLinks = siteData.navigation.links;

  return `
    <div class="footer-content">
      <div class="footer-logo">
        <i class="${logo.icon}"></i>
      </div>
      <div class="social-links">
        ${siteData.navigation.social
          .map(
            (item) => `
          <a href="${item.url}" target="_blank" aria-label="${item.platform}"><i class="${item.icon}"></i></a>
        `
          )
          .join("")}
      </div>
      <p class="copyright">${copyright}</p>
    </div>
  `;
}
