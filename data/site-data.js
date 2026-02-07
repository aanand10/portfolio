// Site data in JSON format
const siteData = {
  // Meta data
  meta: {
    title: "Anand Suryawanshi : Frontend Engineer",
    description:
      "I'm Anand Suryawanshi, a top-notch frontend engineer and computer engineer specializing in modern web technologies. I'm a passionate software developer with a keen interest in building scalable and performant web applications.",
    email: "Anandsuryawanshi66@gmail.com",
    resumeLink:
      "https://drive.google.com/file/d/1MuCL8aNRkBvEJTc2OKzahVeF8fiQNIfv/view",
  },

  // Navigation
  navigation: {
    logo: {
      icon: "fas fa-code",
    },
    links: [
      { text: "Home", href: "#hero" },
      { text: "About", href: "#about" },
      { text: "Work", href: "#experience" },
      { text: "Skills", href: "#skills" },
      { text: "Projects", href: "#projects" },
      { text: "Blogs", href: "#blogs" },
      { text: "Contact", href: "#contact" },
    ],
    social: [
      {
        platform: "github",
        icon: "fab fa-github",
        url: "https://github.com/aanand10",
      },
      {
        platform: "linkedin",
        icon: "fab fa-linkedin",
        url: "https://www.linkedin.com/in/anand-suryawanshi-532a87155/",
      },
      {
        platform: "email",
        icon: "fas fa-envelope",
        url: "mailto:Anandsuryawanshi66@gmail.com",
      },
    ],
  },

  // Hero section
  hero: {
    subtitle: "Frontend Engineer",
    title: "Anand Suryawanshi",
    description:
      "A passionate software developer with a keen interest in building scalable and performant web applications.",
    profileImage: "images/square-profile-pic.jpg",
    buttons: [
      {
        text: "Contact Me",
        icon: "fas fa-envelope",
        url: "mailto:Anandsuryawanshi66@gmail.com",
        class: "contact-btn",
      },
      {
        text: "Resume",
        icon: "fas fa-file-alt",
        url: "https://drive.google.com/file/d/1MuCL8aNRkBvEJTc2OKzahVeF8fiQNIfv/view",
        class: "resume-btn",
        target: "_blank",
      },
    ],
  },

  // About section
  about: {
    subtitle: "Who I Am",
    title: "About Me",
    description:
      "A forward-thinking frontend engineer currently contributing to innovative fintech solutions.",
    paragraphs: [
      '🚀 Seeking a highly skilled <span class="highlight">frontend engineer</span> with a strong foundation in computer engineering? Look no further! 🥳',
      '👨‍💻 Driven by an insatiable curiosity and a commitment to mastery, I excel in the core web technologies – HTML, CSS, JavaScript, and TypeScript – alongside modern powerhouses like <span class="highlight-react">React</span> and <span class="highlight-tailwind">Svelte</span>. My toolkit is always evolving to meet the demands of cutting-edge development.',
      '🎨 I\'m passionate about architecting intuitive and visually captivating UI/UX experiences. Furthermore, my background includes practical application of geospatial data handling through libraries such as <span class="highlight-cesium">Cesium.js</span> and <span class="highlight-leaflet">Leaflet.js</span>. 🌏 This unique blend allows me to approach web development with a broader perspective on data interaction and presentation.',
      "💼 Currently, I'm a Frontend Engineer at <span class=\"highlight-razorpay\">Razorpay</span>, actively involved in shaping the user interfaces for impactful, scalable and performant fintech products. If you're looking for a collaborative frontend or React engineer with a proven ability to deliver and a keen eye for detail, I'd love to connect and explore how my skills can contribute to your team's success. 🤝",
    ],
  },

  // Experience section
  experience: {
    subtitle: "Career Path",
    title: "Work Experience",
    description: "My professional journey in Software Development Engineering.",
    jobs: [
      {
        company: "Razorpay",
        period: "January 2025 - Present",
        title: "Frontend Engineer",
        description:
          "Working as a Frontend Engineer at Razorpay, focusing on building scalable and performant web applications for fintech solutions.",
        highlights: [
          "Contributing in Razorpay's Checkout, Dashboard, and other products as a member of Cross Border team",
          "Collaborating with cross-functional teams to deliver high-quality user experiences",
        ],
        companyLogo: "images/razorpay.png",
        companyName: "Razorpay",
        achievementImages: [
          "images/achiever_award.jpg",
          "images/razorpay_achiever_award_2025_anand.jpg",
        ],
      },
      {
        company: "Indrones Solutions Pvt. Ltd.",
        period: "May 2023 - January 2025",
        title: "Frontend Developer",
        description:
          "Working as a Frontend Developer at Indrones.com, where I continue to be actively involved in various exciting projects.",
        highlights: [
          "Collaborating with cross-functional teams to design and develop user-friendly web applications",
          "Leading UI/UX efforts to create intuitive and visually appealing interfaces for users",
          "Working with cutting-edge technologies, including React, Cesium.js, and Tailwind CSS",
          "Utilizing expertise in handling geospatial data to enhance geospatial and data visualization applications",
          "Architected end-to-end products, achieving 30% improvement in 2D and 3D geospatial data visualization and 25% reduction in processing time",
        ],
        companyLogo: "images/indrones_logo.jpg",
        companyName: "Indrones Solutions Pvt. Ltd.",
        projects: [
          {
            title: "Geospatial Data Visualization, Analytics & Tooling",
            tech: "React.js, Node.js, AWS",
            achievements: [
              "Developed 2D and 3D geospatial visualizations and analytics tools, increasing client interactions by 40%",
              "Optimized performance using advanced React techniques, reducing rendering and load times by 40%",
              "Implemented PDF report generation with Node.js and Puppeteer, saving clients 200+ hours",
              "Deployed a point cloud visualization and analytics app on AWS Amplify, serving data via S3 and CloudFront",
            ],
          },
          {
            title: "Geospatial Data Processing",
            tech: "React.js, Figma",
            achievements: [
              "Created a reusable design system, cutting development time by 30%",
              "Independently built and designed the front-end, taking it from storyboard and Figma design to a scalable React application",
              "Led UI/UX design, improving user engagement by 40%",
            ],
          },
          {
            title: "Reporting Application",
            tech: "React.js, AWS SDK, Node.js",
            achievements: [
              "Constructed a production-grade application within a 4-hour sprint",
              "Created table visualizations by fetching and parsing large data from AWS S3",
            ],
          },
        ],
      },
      {
        company: "Sort-ed.in",
        period: "Apr 2021 - Mar 2023",
        title: "Frontend Developer",
        highlights: [
          "Contributed to the design of the landing page and form sections of the website",
          "Developed the entire website with a focus on code reusability",
          "Ensured full mobile responsiveness and optimized the site for different devices",
          "Mentored junior front-end developers, supporting their learning and onboarding process",
        ],
      },
    ],
  },

  internships: {
    subtitle: "Internships",
    title: "Internships",
    items: [
      {
        period: "MAR 2022 – APR 2022",
        company: "LetsGrowMore",
        title: "Web Developer",
        description: "Completed some project based tasks.",
        certificate: { text: "Internship Certificate", url: "#" },
      },
      {
        period: "FEB 2022 – MAR 2022",
        company: "Ethical PVT LTD",
        title: "Front-end Developer",
        description:
          "Worked as web developer. Contributed in wordpress website project.",
        certificate: { text: "Internship Certificate", url: "#" },
      },
      {
        period: "FEB 2022 – APR 2022",
        company: "ESPOTECH",
        title: "Front-end Developer",
        description:
          "Worked as a front-end developer. Created various web templates.",
        certificate: { text: "Internship Certificate", url: "#" },
      },
      {
        period: "APR 2020 – MAY 2021",
        company: "Grapevine",
        title: "Campus Ambassador",
        description:
          "Here in this program, I have learned teamwork skills and some different tasks.",
        certificate: { text: "Internship Certificate", url: "#" },
      },
      {
        period: "FEB 2020 – JUL 2020",
        company: "Woovly",
        title: "Campus Ambassador",
        description:
          "Here in this program, I have learned teamwork skills, how startup works in their initial stage, and some different tasks.",
        certificate: { text: "Internship Certificate", url: "#" },
      },
      {
        period: "SEP 2019 – FEB 2020",
        company: "Viacom18",
        title: "Campus Inc.",
        description:
          "In this internship I have learned team work and how to perform tasks.",
        certificate: { text: "Internship Certificate", url: "#" },
      },
    ],
  },

  // Skills section
  skills: {
    subtitle: "My Expertise",
    title: "Skills",
    description:
      "The technologies and tools I work with to bring ideas to life.",
    categories: [
      {
        title: "Frontend Development",
        description:
          "Building beautiful, responsive, and user-friendly interfaces",
        skills: [
          "JavaScript",
          "TypeScript",
          "React.js",
          "Svelte.js",
          "Redux",
          "Zustand",
          "HTML",
          "CSS",
          "SASS",
          "MUI",
          "11ty",
          "TailwindCSS",
        ],
      },
      {
        title: "Backend & Tools",
        description: "Supporting technologies to create complete solutions",
        skills: ["Node.js", "Express.js", "Puppeteer", "Postman"],
      },
      {
        title: "Geospatial Technologies",
        description: "Experience in 2D and 3D geospatial data visualization",
        skills: ["Leaflet.js", "Cesium.js", "Potree"],
      },
      {
        title: "Cloud Services",
        description:
          "Experience with AWS services for scalable application deployment",
        skills: ["AWS Amplify", "AWS SDK", "S3", "DynamoDB"],
      },
      {
        title: "Testing",
        description: "Expertise in testing frameworks",
        skills: ["Jest", "Vitest", "Playwright"],
      },
      {
        title: "Version Control",
        description: "Expertise in version control systems",
        skills: ["Git", "GitHub", "Bitbucket"],
      },
      {
        title: "Project Management",
        description: "Expertise in project management tools",
        skills: ["Jira", "DevRev"],
      },
      {
        title: "AI Tools",
        description: "AI tools compentency",
        skills: ["Cursor", "Claude", "Github Copilot"],
      },
    ],
  },

  // Projects section
  projects: {
    subtitle: "My Work",
    title: "Projects",
    description: "A selection of my recent work and personal projects.",
    items: [
      {
        title: "MovieBox",
        description:
          "Converted a template design using HTML, CSS, JavaScript, React.js, TailwindCSS and hosted using Vercel.",
        image: "https://source.unsplash.com/random/600x400/?website,dashboard",
        link: "https://bosleo.vercel.app/",
      },
      {
        title: "Digital Menu Card",
        description:
          "Converted traditional menu card to a digital menu card using React, HTML, CSS, JS, GitHub and Firebase.",
        image: "https://source.unsplash.com/random/600x400/?restaurant,menu",
        link: "https://eatsy10.web.app/rainbow",
      },
      {
        title: "Landing Page & Pre-register Website",
        description:
          "Worked on landing page and form pages with fully responsive website using HTML5, CSS3, JavaScript, GitHub.",
        image: "https://source.unsplash.com/random/600x400/?landing,webpage",
        link: "https://sort-ed.in/",
      },
    ],
    moreProjectsLink: "https://github.com/onlyanand10?tab=repositories",
  },

  // Blogs section
  blogs: {
    subtitle: "My Thoughts",
    title: "Blog",
    description:
      "Insights and articles about frontend development and technology.",
    items: [
      {
        title: "Zustand: A Deep Dive into Efficient State Management for React",
        description:
          "A comprehensive guide to Zustand, a state management library for React that offers a more efficient and flexible approach to state management.",
        date: "March 2025",
        category: "State Management",
        isLatest: true,
        link: "https://anandsuryawanshi.hashnode.dev/zustand-a-deep-dive-into-efficient-state-management-for-react",
        platform: "Hashnode",
      },

      {
        title: "Your git commit message will say everything",
        description:
          "A guide to writing effective git commit messages that improve teamwork and project tracking.",
        date: "Jan 2024",
        category: "Git",
        isLatest: false,
        link: "https://medium.com/@anandsuryawanshi66/your-git-commit-message-will-say-everything-b72e47b1760e",
        platform: "Medium",
      },
      {
        title: "JAVA Bootcamp",
        description:
          "Code + Handwritten notes from my Java Bootcamp series for beginners.",
        date: "Oct 2022",
        category: "Java",
        link: "https://anandsuryawanshi.hashnode.dev/java-bootcamp-by-anand-code-handwritten-notes",
        platform: "Hashnode",
      },
    ],
  },

  // Contact section
  contact: {
    subtitle: "Get In Touch",
    title: "Contact",
    description: "Let's discuss how we can work together on your next project.",
    info: [
      {
        type: "email",
        icon: "fas fa-envelope",
        title: "Email",
        value: "Anandsuryawanshi66@gmail.com",
        isLink: true,
        link: "mailto:Anandsuryawanshi66@gmail.com",
      },
      {
        type: "location",
        icon: "fas fa-map-marker-alt",
        title: "Location",
        value: "India",
        isLink: false,
      },
      {
        type: "linkedin",
        icon: "fab fa-linkedin",
        title: "LinkedIn",
        value: "Anand Suryawanshi",
        isLink: true,
        link: "https://www.linkedin.com/in/anand-suryawanshi-532a87155/",
      },
      {
        type: "github",
        icon: "fab fa-github",
        title: "GitHub",
        value: "aanand10",
        isLink: true,
        link: "https://github.com/aanand10",
      },
    ],
    form: {
      fields: [
        { id: "name", label: "Name", type: "text", placeholder: "Your Name" },
        {
          id: "email",
          label: "Email",
          type: "email",
          placeholder: "Your Email",
        },
        {
          id: "message",
          label: "Message",
          type: "textarea",
          placeholder: "Your Message",
        },
      ],
      submitText: "Send Message",
      submitIcon: "fas fa-paper-plane",
    },
  },

  // Footer
  footer: {
    logo: {
      icon: "fas fa-code",
    },
    copyright: "© 2025 Anand Suryawanshi. All Rights Reserved.",
  },
};
