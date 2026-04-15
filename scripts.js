// scripts.js

// DOM Content Loaded
document.addEventListener("DOMContentLoaded", function () {
  // Mobile menu toggle
  setupMobileMenu();

  // Smooth scrolling for anchor links
  setupSmoothScrolling();

  // Back to top button
  setupBackToTop();

  // Initialize student carousel
  initStudentCarousel();

  // Count-up animation for results
  setupCountUpAnimation();

  // Dark mode toggle
  setupDarkModeToggle();

  // Modal functionality for student cards
  setupStudentModals();

  // Fetch student data and render the student cards
  renderStudentCards();
});

// Mobile menu functionality
function setupMobileMenu() {
  const menuToggle = document.createElement("button");
  menuToggle.className = "mobile-menu-toggle";
  menuToggle.innerHTML = "☰";

  const header = document.querySelector("header");
  const nav = document.querySelector(".nav");

  // Only add mobile menu if screen is small
  if (window.innerWidth <= 768) {
    header.insertBefore(menuToggle, nav);
    nav.classList.add("mobile-nav");

    menuToggle.addEventListener("click", function () {
      nav.classList.toggle("active");
    });
  }

  // Handle window resize
  window.addEventListener("resize", function () {
    if (window.innerWidth > 768) {
      nav.classList.remove("active", "mobile-nav");
      if (document.querySelector(".mobile-menu-toggle")) {
        header.removeChild(menuToggle);
      }
    } else if (!document.querySelector(".mobile-menu-toggle")) {
      header.insertBefore(menuToggle, nav);
      nav.classList.add("mobile-nav");
    }
  });
}

// Smooth scrolling for anchor links
function setupSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        });
      }
    });
  });
}

// Back to top button
function setupBackToTop() {
  const backToTopButton = document.createElement("button");
  backToTopButton.className = "back-to-top";
  backToTopButton.innerHTML = "↑";
  backToTopButton.style.display = "none";
  document.body.appendChild(backToTopButton);

  window.addEventListener("scroll", function () {
    if (window.pageYOffset > 300) {
      backToTopButton.style.display = "block";
    } else {
      backToTopButton.style.display = "none";
    }
  });

  backToTopButton.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// Student carousel
function initStudentCarousel() {
  const carousels = document.querySelectorAll(".student-carousel");

  carousels.forEach((carousel) => {
    const items = carousel.querySelectorAll(".carousel-item");
    let currentIndex = 0;

    function showItem(index) {
      items.forEach((item, i) => {
        item.classList.toggle("active", i === index);
      });
    }

    // Add navigation buttons if not present
    if (!carousel.querySelector(".carousel-prev")) {
      const prevBtn = document.createElement("button");
      prevBtn.className = "carousel-prev";
      prevBtn.innerHTML = "❮";
      carousel.appendChild(prevBtn);

      const nextBtn = document.createElement("button");
      nextBtn.className = "carousel-next";
      nextBtn.innerHTML = "❯";
      carousel.appendChild(nextBtn);

      prevBtn.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        showItem(currentIndex);
      });

      nextBtn.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % items.length;
        showItem(currentIndex);
      });
    }

    // Initialize first item
    showItem(currentIndex);
  });
}

// Count-up animation for results
function setupCountUpAnimation() {
  const counters = document.querySelectorAll(".count-up");
  const speed = 200;

  function animateCounters() {
    counters.forEach((counter) => {
      const target = +counter.getAttribute("data-target");
      const count = +counter.innerText;
      const increment = target / speed;

      if (count < target) {
        counter.innerText = Math.ceil(count + increment);
        setTimeout(animateCounters, 1);
      } else {
        counter.innerText = target;
      }
    });
  }

  // Intersection Observer to trigger animation when element is in view
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounters();
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => {
    observer.observe(counter);
  });
}

// Dark mode toggle
function setupDarkModeToggle() {
  const darkModeToggle = document.createElement("button");
  darkModeToggle.className = "dark-mode-toggle";
  darkModeToggle.innerHTML = "🌓";
  document.body.appendChild(darkModeToggle);

  // Check for saved user preference
  if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
  }

  darkModeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    // Save user preference
    if (document.body.classList.contains("dark-mode")) {
      localStorage.setItem("darkMode", "enabled");
    } else {
      localStorage.setItem("darkMode", "disabled");
    }
  });
}

// Modal functionality for student cards
function setupStudentModals() {
  // Create modal container
  const modal = document.createElement("div");
  modal.className = "student-modal";
  modal.innerHTML = `
          <div class="modal-content">
              <span class="close-modal">&times;</span>
              <img class="modal-image" src="" alt="">
              <div class="modal-info">
                  <h3 class="modal-name"></h3>
                  <p class="modal-marks"></p>
                  <p class="modal-class"></p>
                  <p class="modal-details"></p>
              </div>
          </div>
      `;
  document.body.appendChild(modal);

  // Add click event to all student cards
  document.querySelectorAll(".card.shadow-sm").forEach((card) => {
    card.addEventListener("click", function (e) {
      // Don't open modal if clicking a link inside the card
      if (e.target.tagName === "A") return;

      const img = this.querySelector("img");
      const name = this.querySelector(".card-body .card-text");
      const marks = this.querySelector(".only-mark");
      const classInfo = Array.from(this.querySelectorAll(".card-text")).find(
        (p) => p.textContent.startsWith("Class:")
      );

      if (img && name && marks && classInfo) {
        document.querySelector(".modal-image").src = img.src;
        document.querySelector(".modal-name").textContent = name.textContent;
        document.querySelector(".modal-marks").textContent = marks.textContent;
        document.querySelector(".modal-class").textContent =
          classInfo.textContent;

        // Show modal
        modal.style.display = "block";
        document.body.style.overflow = "hidden";
      }
    });
  });

  // Close modal
  modal.querySelector(".close-modal").addEventListener("click", function () {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  });

  // Close when clicking outside modal content
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  });
}

// Function to dynamically render student cards
function renderStudentCards() {
  const studentData = {
    "12th_science": [
      {
        name: "Sonu Kumar( Nirmali Topper 2025 )",
        marks: 450,
        class: "12th",
        subjects: {
          Math: 97,
          // Physics removed
        },
        image: "images/Student/Sonu Kumar.jpg",
      },
      {
        name: "Jaykrishna Singh",
        marks: 436,
        class: "12th",
        subjects: {
          Math: 90,
          Physics: 97,
        },
        image: "images/Student/jk.jpg",
      },
      {
        name: "Nitish Kumar",
        marks: 409,
        class: "12th",
        subjects: {
          Math: 93,
        },
        image: "images/Student/Nk_12.jpg",
      },
      {
        name: "Khushbu Kumari",
        marks: 395,
        class: "12th",
        subjects: {
          Math: 94,
        },
        image: "images/Student/khusboo_12.jpg",
      },
      {
        name: "Pratosh Kumar",
        marks: 420,
        class: "12th",
        image: "images/Student/Pratosh Kumar.jpg",
      },
      {
        name: "Kalpana Kumari",
        marks: 420,
        class: "12th",
        image: "./images/Student/Kalpana Kumari.jpg",
      },
      {
        name: "Sonam Shree",
        marks: 413,
        class: "12th",
        subjects: {
          Math: 97,
          Physics: 84,
        },
        image: "./images/Student/Sonam Shree.jpg",
      },
      {
        name: "Kishu Rajput",
        marks: 408,
        class: "12th",
        subjects: {
          Math: 92,
          Physics: 83,
        },
        image: "./images/Student/Kishu Rajput.jpg",
      },
    ],
    "10th": [
      {
        name: "Suman Kumar",
        marks: 462,
        class: "10th",
        image: "images/Student/Suman Kumar.jpg",
      },
      {
        name: "Chanchal Kumari",
        marks: 454,
        class: "10th",
        image: "./images/Student/chanchal.jpg",
      },
      {
        name: "Santosh Kumar",
        marks: 443,
        image: "./images/Student/santosh.jpg",
        class: "10th",
      },
      {
        name: "Saurabh Kumar",
        marks: 441,
        image: "./images/Student/saurav.jpg",
        class: "10th",
      },
      {
        name: "Bidyanand",
        marks: 439,
        image: "./images/Student/Bidyanand Kumar.jpg",
        class: "10th",
      },
      {
        name: "Rajeev",
        marks: 439,
        image: "./images/Student/Rajeev.jpg",
        class: "10th",
      },
      {
        name: "Karishma Singh",
        marks: 439,
        image: "./images/Student/Karishma Singh.jpg",
        class: "10th",
      },
      {
        name: "Pratik Singh",
        marks: 438,
        image: "./images/Student/Pratik Singh.jpg",
        class: "10th",
      },
      {
        name: "Samiruddin",
        marks: 432,
        image: "./images/Student/Samiruddin.jpg",
        class: "10th",
      },
      {
        name: "Mahesh",
        marks: 431,
        image: "./images/Student/Mahesh.jpg",
        class: "10th",
      },
      {
        name: "Raushan Kumar",
        marks: 428,
        image: "./images/Student/Raushan Kumar.jpg",
        class: "10th",
      },
      {
        name: "Gunja Kumari",
        marks: 427,
        image: "./images/Student/Gunja Kumari.jpg",
        class: "10th",
      },
      {
        name: "Shiv Kumar",
        marks: 426,
        image: "./images/Student/Shiv Kumar.jpg",
        class: "10th",
      },
      {
        name: "Ganesh Kumar",
        marks: 422,
        image: "./images/Student/Ganesh Kumar.jpg",
        class: "10th",
      },
      {
        name: "Narayan Kumar",
        marks: 413,
        image: "./images/Student/Narayan Kumar.jpg",
        class: "10th",
      },
      {
        name: "Nitish Kumar",
        marks: 413,
        image: "./images/Student/Nitish Kumar.jpg",
        class: "10th",
      },
      {
        name: "Jai Krishna Kumar",
        marks: 407,
        image: "./images/Student/Jai Krishna Kumar.jpg",
        class: "10th",
      },
      {
        name: "Kishu Rajput",
        marks: 410,
        image: "./images/Student/Kishu Rajput.jpg",
        class: "10th",
      },
      {
        name: "Kundan Kumar",
        marks: 405,
        image: "./images/Student/Kundan Kumar.jpg",
        class: "10th",
      },
      {
        name: "Rohit Kumar",
        marks: 405,
        image: "./images/Student/Rohit Kumar.jpg",
        class: "10th",
      },
      {
        name: "Anshu Kumar",
        marks: 404,
        image: "./images/Student/Anshu Kumar.jpg",
        class: "10th",
      },
      {
        name: "Bidyanand Kumar",
        marks: 404,
        image: "./images/Student/Bidyanand Kumar2.jpg",
        class: "10th",
      },
      {
        name: "Many More",
        marks: null,
        image: "./images/Student/Many more.jpg",
        class: "10th",
      },
    ],
  };

  const mainContainer = document.getElementById("student-container");
  const container = mainContainer.querySelector(".container");

  // Render students dynamically
  for (const grade in studentData) {
    // Create heading
    const gradeTitle = document.createElement("h3");
    gradeTitle.textContent =
      grade === "12th_science" ? "Class 12th (Science)" : "Class 10th";
    gradeTitle.className = "mt-4 mb-3";

    // Create a new row for this group
    const row = document.createElement("div");
    row.className = "row row-cols-2 row-cols-sm-2 row-cols-md-4 g-3";

    // Add student cards
    studentData[grade].forEach((student) => {
      const studentCard = createStudentCard(student);
      row.appendChild(studentCard);
    });

    // Append everything
    container.appendChild(gradeTitle);
    container.appendChild(row);
  }
}

// Function to create a student card
function createStudentCard(student) {
  const col = document.createElement("div");
  col.className = "col";

  const card = document.createElement("div");
  card.className = "card shadow-sm";
  card.style.cursor = "pointer";
  card.title = `${student.name} - ${student.class}`;

  const img = document.createElement("img");
  img.src = student.image;
  img.alt = student.name;
  img.className = "bd-placeholder-img card-img-top";
  img.style.height = "200px";
  img.style.objectFit = "cover";
  card.appendChild(img);

  const cardBody = document.createElement("div");
  cardBody.className = "card-body";

  const name = document.createElement("p");
  name.className = "card-text";
  name.textContent = student.name;
  cardBody.appendChild(name);

  const marks = document.createElement("p");
  marks.className = "only-mark";
  marks.textContent = `Marks: ${student.marks}`;
  cardBody.appendChild(marks);

  const classInfo = document.createElement("p");
  classInfo.className = "card-text";
  classInfo.textContent = `Class: ${student.class}`;
  cardBody.appendChild(classInfo);

  if (student.subjects) {
    const subjects = document.createElement("p");
    subjects.className = "card-text";

    let subjectText = [];

    if (student.subjects.Math !== undefined) {
      subjectText.push(`Math: ${student.subjects.Math}`);
    }

    if (student.subjects.Physics !== undefined) {
      subjectText.push(`Physics: ${student.subjects.Physics}`);
    }

    subjects.textContent = subjectText.join(", ");
    cardBody.appendChild(subjects);
  }

  card.appendChild(cardBody);
  col.appendChild(card);
  return col;
}
