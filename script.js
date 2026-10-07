// Assignment 2 - Interactive CV Webpage
// All interactive behavior is kept in this separate JavaScript file.

document.addEventListener("DOMContentLoaded", () => {
  // Feature 1: Welcome message when the page loads.
  const welcomeMessage = document.getElementById("welcomeMessage");
  if (welcomeMessage) {
    welcomeMessage.classList.add("show");
    setTimeout(() => welcomeMessage.classList.remove("show"), 2800);
  }

  // Feature 2: Dark mode / light mode toggle.
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      const darkModeIsOn = document.body.classList.contains("dark-mode");
      themeToggle.textContent = darkModeIsOn ? "Light Mode" : "Dark Mode";
    });
  }

  // Feature 3: Show / hide the Skills section content.
  const toggleSkillsBtn = document.getElementById("toggleSkillsBtn");
  const skillsContent = document.getElementById("skillsContent");
  if (toggleSkillsBtn && skillsContent) {
    toggleSkillsBtn.addEventListener("click", () => {
      const isHidden = skillsContent.hidden;
      skillsContent.hidden = !isHidden;
      toggleSkillsBtn.textContent = isHidden ? "Hide Skills" : "Show Skills";
      toggleSkillsBtn.setAttribute("aria-expanded", String(isHidden));
    });
  }

  // Feature 4: Dynamically add a new skill to the skills list.
  const newSkill = document.getElementById("newSkill");
  const addSkillBtn = document.getElementById("addSkillBtn");
  const technicalSkillsList = document.getElementById("technicalSkillsList");
  const skillMessage = document.getElementById("skillMessage");

  function addSkill() {
    const value = newSkill.value.trim();
    skillMessage.className = "form-message";

    if (value === "") {
      skillMessage.textContent = "Please enter a skill first.";
      skillMessage.classList.add("error");
      return;
    }

    const existingSkills = Array.from(technicalSkillsList.querySelectorAll("span"))
      .map((skill) => skill.textContent.toLowerCase());

    if (existingSkills.includes(value.toLowerCase())) {
      skillMessage.textContent = "That skill is already listed.";
      skillMessage.classList.add("error");
      return;
    }

    const skillTag = document.createElement("span");
    skillTag.textContent = value;
    technicalSkillsList.appendChild(skillTag);
    newSkill.value = "";
    skillMessage.textContent = value + " was added to the skills list.";
    skillMessage.classList.add("success");
  }

  if (addSkillBtn && newSkill && technicalSkillsList && skillMessage) {
    addSkillBtn.addEventListener("click", addSkill);
    newSkill.addEventListener("keydown", (event) => {
      if (event.key === "Enter") addSkill();
    });
  }

  // Feature 5: Interactive project details without reloading the page.
  const projectDetailsBtn = document.getElementById("projectDetailsBtn");
  const projectExtra = document.getElementById("projectExtra");
  if (projectDetailsBtn && projectExtra) {
    projectDetailsBtn.addEventListener("click", () => {
      const detailsAreHidden = projectExtra.hidden;
      projectExtra.hidden = !detailsAreHidden;
      projectDetailsBtn.textContent = detailsAreHidden ? "Hide Project Details" : "Show Project Details";
      projectDetailsBtn.setAttribute("aria-expanded", String(detailsAreHidden));
    });
  }

  // Feature 6: Contact form validation with dynamic error/success messages.
  const contactForm = document.getElementById("contactForm");
  const nameInput = document.getElementById("contactName");
  const emailInput = document.getElementById("contactEmail");
  const messageInput = document.getElementById("contactMessage");
  const nameError = document.getElementById("nameError");
  const emailError = document.getElementById("emailError");
  const messageError = document.getElementById("messageError");
  const formMessage = document.getElementById("formMessage");
  const emailPattern = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      let isValid = true;

      nameError.textContent = "";
      emailError.textContent = "";
      messageError.textContent = "";
      formMessage.textContent = "";
      formMessage.className = "form-message";

      if (nameInput.value.trim() === "") {
        nameError.textContent = "Name is required.";
        isValid = false;
      }

      const emailValue = emailInput.value.trim();
      if (emailValue === "") {
        emailError.textContent = "Email is required.";
        isValid = false;
      } else if (!emailPattern.test(emailValue)) {
        emailError.textContent = "Please enter a valid email address.";
        isValid = false;
      }

      if (messageInput.value.trim() === "") {
        messageError.textContent = "Message is required.";
        isValid = false;
      }

      if (isValid) {
        formMessage.textContent = "Success! All fields are valid.";
        formMessage.classList.add("success");
        contactForm.reset();
      } else {
        formMessage.textContent = "Please correct the highlighted fields.";
        formMessage.classList.add("error");
      }
    });
  }
});
