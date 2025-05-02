document.addEventListener("DOMContentLoaded", function () {
  // Initialize components
  initComponents();

  // Initialize AOS (Animate on Scroll)
  AOS.init({
    duration: 800,
    once: true,
  });

  // Add event listeners
  addEventListeners();
});

// Initialize all components with data from siteData object
function initComponents() {
  // Navigation
  document.getElementById("navigation").innerHTML = renderNavigation(
    siteData.navigation
  );

  // Hero
  document.getElementById("hero").innerHTML = renderHero(siteData.hero);

  // About
  document.getElementById("about").innerHTML = renderAbout(siteData.about);

  // Experience
  document.getElementById("experience").innerHTML = renderExperience(
    siteData.experience
  );

  // Internships
  if (siteData.internships && document.getElementById("internships")) {
    document.getElementById("internships").innerHTML = renderInternships(
      siteData.internships
    );
  }

  // Skills
  document.getElementById("skills").innerHTML = renderSkills(siteData.skills);

  // Projects
  document.getElementById("projects").innerHTML = renderProjects(
    siteData.projects
  );

  // Blogs
  document.getElementById("blogs").innerHTML = renderBlogs(siteData.blogs);

  // Contact
  document.getElementById("contact").innerHTML = renderContact(
    siteData.contact
  );

  // Footer
  document.getElementById("footer").innerHTML = renderFooter(siteData.footer);
}

// Add all event listeners for interactive elements
function addEventListeners() {
  // Mobile navigation toggle
  const mobileToggle = document.querySelector(".mobile-toggle");
  const nav = document.querySelector(".navigation");

  if (mobileToggle && nav) {
    mobileToggle.addEventListener("click", function () {
      nav.classList.toggle("active");
      this.innerHTML = nav.classList.contains("active")
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
    });
  }

  // Close mobile navigation when clicking outside
  document.addEventListener("click", function (event) {
    if (
      nav &&
      nav.classList.contains("active") &&
      !nav.contains(event.target) &&
      event.target !== mobileToggle
    ) {
      nav.classList.remove("active");
      if (mobileToggle) {
        mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
      }
    }
  });

  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll('a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      // Only if the link points to an ID on the page
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        e.preventDefault();

        // Close mobile menu if open
        if (nav && nav.classList.contains("active")) {
          nav.classList.remove("active");
          if (mobileToggle) {
            mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
          }
        }

        // Scroll to the target with offset for fixed navigation
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // Form validation
  const contactForm = document.getElementById("contact-form");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const nameInput = document.getElementById("name");
      const emailInput = document.getElementById("email");
      const messageInput = document.getElementById("message");
      let isValid = true;

      // Simple validation
      if (!nameInput.value.trim()) {
        showError(nameInput, "Name is required");
        isValid = false;
      } else {
        removeError(nameInput);
      }

      if (!emailInput.value.trim()) {
        showError(emailInput, "Email is required");
        isValid = false;
      } else if (!isValidEmail(emailInput.value)) {
        showError(emailInput, "Please enter a valid email");
        isValid = false;
      } else {
        removeError(emailInput);
      }

      if (!messageInput.value.trim()) {
        showError(messageInput, "Message is required");
        isValid = false;
      } else {
        removeError(messageInput);
      }

      if (isValid) {
        // Send form data (in a real app, this would be an API call)
        // For now, just show a success message
        contactForm.reset();

        const successMessage = document.createElement("div");
        successMessage.classList.add("success-message");
        successMessage.textContent = "Message sent successfully!";
        contactForm.appendChild(successMessage);

        setTimeout(() => {
          successMessage.remove();
        }, 3000);
      }
    });
  }

  // Animate geometric elements
  const geometricElements = document.querySelectorAll(".geometric-element");
  geometricElements.forEach((element) => {
    element.style.animationDelay = Math.random() * 2 + "s";
  });

  // Intersection Observer for section animations
  const sections = document.querySelectorAll(".section");

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("section-visible");
          highlightNavLink(entry.target.id);
        }
      });
    },
    { threshold: 0.2 }
  );

  sections.forEach((section) => {
    sectionObserver.observe(section);
    section.classList.add("section-hidden");
  });

  // Window resize handling for responsive layout
  window.addEventListener("resize", handleResize);
  handleResize(); // Call once on init
}

// Helper functions
function showError(input, message) {
  const formGroup = input.parentElement;
  const errorElement =
    formGroup.querySelector(".error-message") || document.createElement("div");

  errorElement.classList.add("error-message");
  errorElement.textContent = message;

  if (!formGroup.querySelector(".error-message")) {
    formGroup.appendChild(errorElement);
  }

  input.classList.add("error");
}

function removeError(input) {
  const formGroup = input.parentElement;
  const errorElement = formGroup.querySelector(".error-message");

  if (errorElement) {
    errorElement.remove();
  }

  input.classList.remove("error");
}

function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

function highlightNavLink(sectionId) {
  const navLinks = document.querySelectorAll(".navigation a");

  navLinks.forEach((link) => {
    const linkHref = link.getAttribute("href").substring(1); // Remove #

    if (linkHref === sectionId) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

// Handle responsive layout adjustments
function handleResize() {
  const isMobile = window.innerWidth < 768;
  const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

  // Add mobile-specific classes
  document.body.classList.toggle("is-mobile", isMobile);
  document.body.classList.toggle("is-tablet", isTablet);

  // Additional mobile optimizations can be added here
  if (isMobile) {
    // Skills grid adjustments
    const skillsGrid = document.querySelector(".skills-grid");
    if (skillsGrid) {
      skillsGrid.style.gridTemplateColumns = "1fr";
    }

    // Project grid adjustments
    const projectsGrid = document.querySelector(".projects-grid");
    if (projectsGrid) {
      projectsGrid.style.gridTemplateColumns = "1fr";
    }
  }
}
