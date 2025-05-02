// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Mobile navigation toggle
  const mobileToggle = document.querySelector(".mobile-toggle");
  const navigation = document.querySelector(".navigation");

  if (mobileToggle && navigation) {
    mobileToggle.addEventListener("click", function () {
      navigation.classList.toggle("active");
    });
  }

  // Close mobile menu when clicking outside
  document.addEventListener("click", function (event) {
    if (
      navigation &&
      navigation.classList.contains("active") &&
      !navigation.contains(event.target) &&
      event.target !== mobileToggle
    ) {
      navigation.classList.remove("active");
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
        if (navigation && navigation.classList.contains("active")) {
          navigation.classList.remove("active");
        }

        // Scroll to the target
        window.scrollTo({
          top: targetElement.offsetTop,
          behavior: "smooth",
        });
      }
    });
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
    { threshold: 0.1 }
  );

  sections.forEach((section) => {
    sectionObserver.observe(section);
    // Add initial hidden class for animation
    section.classList.add("section-hidden");
  });

  // Highlight active navigation link
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
        // In a real application, you would submit the form data to a server
        // For this demo, we'll just show a success message
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

  function showError(input, message) {
    const formGroup = input.parentElement;
    const errorElement =
      formGroup.querySelector(".error-message") ||
      document.createElement("div");

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

  // Add animation class to the body after page load
  setTimeout(() => {
    document.body.classList.add("loaded");
  }, 300);
});
