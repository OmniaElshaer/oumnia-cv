// Assignment 2 - Interactive CV Webpage
// All interactive behavior is kept in this separate JavaScript file.

document.addEventListener("DOMContentLoaded", () => {
  // Feature 1: Welcome message when the page loads.
  const welcomeMessage = document.getElementById("welcomeMessage");
  welcomeMessage.classList.add("show");
  setTimeout(() => welcomeMessage.classList.remove("show"), 2800);

  // Feature 2: Dark mode / light mode toggle.
  const themeToggle = document.getElementById("themeToggle");
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const darkModeIsOn = document.body.classList.contains("dark-mode");
    themeToggle.textContent = darkModeIsOn ? "Light Mode" : "Dark Mode";
  });

  // Feature 3: Show / hide the Skills section content.
  const toggleSkillsBtn = document.getElementById("toggleSkillsBtn");
  const skillsContent = document.getElementById("skillsContent");
  toggleSkillsBtn.addEventListener("click", () => {
    const isHidden = skillsContent.hidden;
    skillsContent.hidden = !isHidden;
    toggleSkillsBtn.textContent = isHidden ? "Hide Skills" : "Show Skills";
    toggleSkillsBtn.setAttribute("aria-expanded", String(isHidden));
  });

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
    skillMessage.textContent = `${value} was added to the skills list.`;
    skillMessage.classList.add("success");
  }

  addSkillBtn.addEventListener("click", addSkill);
  newSkill.addEventListener("keydown", (event) => {
    if (event.key === "Enter") addSkill();
  });

  // Feature 5: Interactive project details without reloading the page.
  const projectDetailsBtn = document.getElementById("projectDetailsBtn");
  const projectExtra = document.getElementById("projectExtra");
  projectDetailsBtn.addEventListener("click", () => {
    const detailsAreHidden = projectExtra.hidden;
    projectExtra.hidden = !detailsAreHidden;
    projectDetailsBtn.textContent = detailsAreHidden ? "Hide Project Details" : "Show Project Details";
    projectDetailsBtn.setAttribute("aria-expanded", String(detailsAreHidden));
  });

  // Feature 6: Contact form validation with dynamic error/success messages.
  const contactForm = document.getElementById("contactForm");
  const nameInput = document.getElementById("contactName");
  const emailInput = document.getElementById("contactEmail");
  const messageInput = document.getElementById("contactMessage");
  const nameError = document.getElementById("nameError");
  const emailError = document.getElementById("emailError");
  const messageError = document.getElementById("messageError");
  const formMessage = document.getElementById("formMessage");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
});

// ===== Assignment 3: API integration =====
// Uses fetch + async/await, with loading and error states, and updates the DOM dynamically.

document.addEventListener("DOMContentLoaded", () => {
  // Helper: set a status message with an optional state ("loading" or "error").
  function setStatus(element, message, state) {
    element.textContent = message;
    element.className = "api-status" + (state ? " " + state : "");
  }

  // Helper: fetch JSON and throw a readable error for bad responses.
  async function getJSON(url) {
    const response = await fetch(url, { headers: { Accept: "application/json" } });
    if (!response.ok) {
      if (response.status === 404) throw new Error("User not found.");
      if (response.status === 403) throw new Error("GitHub rate limit reached. Please try again later.");
      throw new Error(`Request failed (status ${response.status}).`);
    }
    return response.json();
  }

  // ---- API 1: GitHub REST API (public repositories) ----
  const githubUser = document.getElementById("githubUser");
  const loadReposBtn = document.getElementById("loadReposBtn");
  const repoStatus = document.getElementById("repoStatus");
  const repoList = document.getElementById("repoList");

  async function loadRepos() {
    const username = githubUser.value.trim();
    repoList.innerHTML = "";

    if (username === "") {
      setStatus(repoStatus, "Please enter a GitHub username.", "error");
      return;
    }

    setStatus(repoStatus, "Loading repositories…", "loading");
    loadReposBtn.disabled = true;

    try {
      const repos = await getJSON(
        `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=12`
      );

      if (repos.length === 0) {
        setStatus(repoStatus, `${username} has no public repositories yet.`);
        return;
      }

      repos.forEach((repo) => {
        const card = document.createElement("article");
        card.className = "repo-card";

        const title = document.createElement("h3");
        const link = document.createElement("a");
        link.href = repo.html_url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = repo.name;
        title.appendChild(link);

        const description = document.createElement("p");
        description.textContent = repo.description || "No description provided.";

        const meta = document.createElement("div");
        meta.className = "repo-meta";
        const language = document.createElement("span");
        language.className = "lang";
        language.textContent = repo.language || "Not specified";
        const stars = document.createElement("span");
        stars.textContent = `★ ${repo.stargazers_count}`;
        meta.append(language, stars);

        card.append(title, description, meta);
        repoList.appendChild(card);
      });

      setStatus(repoStatus, `Showing ${repos.length} public repositories from @${username}.`);
    } catch (error) {
      const offline = error instanceof TypeError;
      setStatus(
        repoStatus,
        offline ? "Could not reach GitHub. Check your internet connection." : error.message,
        "error"
      );
    } finally {
      loadReposBtn.disabled = false;
    }
  }

  loadReposBtn.addEventListener("click", loadRepos);
  githubUser.addEventListener("keydown", (event) => {
    if (event.key === "Enter") loadRepos();
  });
  loadRepos();

  // ---- API 2: DummyJSON Quotes API (random motivational quote) ----
  const quoteText = document.getElementById("quoteText");
  const quoteAuthor = document.getElementById("quoteAuthor");
  const quoteStatus = document.getElementById("quoteStatus");
  const newQuoteBtn = document.getElementById("newQuoteBtn");

  async function loadQuote() {
    setStatus(quoteStatus, "Loading quote…", "loading");
    newQuoteBtn.disabled = true;

    try {
      const data = await getJSON("https://dummyjson.com/quotes/random");
      quoteText.textContent = `“${data.quote}”`;
      quoteAuthor.textContent = data.author;
      setStatus(quoteStatus, "");
    } catch (error) {
      quoteText.textContent = "Sorry, a quote could not be loaded right now.";
      quoteAuthor.textContent = "";
      setStatus(quoteStatus, "Failed to load quote. Please click “New Quote” to try again.", "error");
    } finally {
      newQuoteBtn.disabled = false;
    }
  }

  newQuoteBtn.addEventListener("click", loadQuote);
  loadQuote();
});
