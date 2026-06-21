const featuredRepoNames = new Set([
    "istanbul-transit-analytics-ai",
    "omnidev1.1",
    "trendyol-clone",
    "personalfinanceapp",
    "cv-builder"
]);

const fallbackRepos = [
    {
        name: "Trendyol-Clone",
        html_url: "https://github.com/Heliacaa/Trendyol-Clone",
        description: "Multi-vendor e-commerce platform with customer, seller, and admin portals.",
        language: "TypeScript",
        stargazers_count: 0,
        pushed_at: "2026-06-01T00:00:00Z"
    },
    {
        name: "PersonalFinanceApp",
        html_url: "https://github.com/Heliacaa/PersonalFinanceApp",
        description: "AI-powered investment platform with portfolio context, RAG, market data, and risk analytics.",
        language: "Dart",
        stargazers_count: 0,
        pushed_at: "2026-06-01T00:00:00Z"
    },
    {
        name: "cv-builder",
        html_url: "https://github.com/Heliacaa/cv-builder",
        description: "AI-assisted CV builder with a responsive React and TypeScript interface.",
        language: "TypeScript",
        stargazers_count: 0,
        pushed_at: "2026-06-01T00:00:00Z"
    }
];

document.addEventListener("DOMContentLoaded", () => {
    setCurrentYear();
    loadGitHubRepos();
    bindActiveNavigation();
});

function setCurrentYear() {
    const yearNode = document.getElementById("current-year");
    if (yearNode) {
        yearNode.textContent = String(new Date().getFullYear());
    }
}

async function loadGitHubRepos() {
    const container = document.getElementById("github-repos");
    if (!container) {
        return;
    }

    try {
        const response = await fetch("https://api.github.com/users/Heliacaa/repos?sort=updated&per_page=100", {
            headers: {
                Accept: "application/vnd.github+json"
            }
        });

        if (!response.ok) {
            throw new Error(`GitHub responded with ${response.status}`);
        }

        const repos = await response.json();
        const visibleRepos = repos
            .filter((repo) => !repo.fork)
            .filter((repo) => !featuredRepoNames.has(repo.name.toLowerCase()))
            .sort((first, second) => new Date(second.pushed_at) - new Date(first.pushed_at))
            .slice(0, 6);

        renderRepos(visibleRepos.length ? visibleRepos : fallbackRepos, container);
    } catch (error) {
        console.warn("Could not load GitHub repositories:", error);
        renderRepos(fallbackRepos, container, true);
    }
}

function renderRepos(repos, container, isFallback = false) {
    container.replaceChildren();

    repos.forEach((repo) => {
        container.appendChild(createRepoCard(repo, isFallback));
    });
}

function createRepoCard(repo, isFallback) {
    const card = document.createElement("article");
    card.className = "repo-card";

    const meta = document.createElement("div");
    meta.className = "repo-meta";
    meta.textContent = isFallback ? "Featured fallback" : formatDate(repo.pushed_at);

    const title = document.createElement("h3");
    const link = document.createElement("a");
    link.href = repo.html_url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = repo.name;
    title.appendChild(link);

    const description = document.createElement("p");
    description.textContent = repo.description || "Repository details are available on GitHub.";

    const footer = document.createElement("footer");

    const language = document.createElement("span");
    language.className = "repo-language";
    language.textContent = repo.language || "Repository";

    const stars = document.createElement("span");
    stars.setAttribute("aria-label", `${repo.stargazers_count || 0} stars`);
    stars.textContent = `★ ${repo.stargazers_count || 0}`;

    footer.append(language, stars);
    card.append(meta, title, description, footer);

    return card;
}

function formatDate(dateValue) {
    if (!dateValue) {
        return "Recently updated";
    }

    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) {
        return "Recently updated";
    }

    return new Intl.DateTimeFormat("en", {
        month: "short",
        year: "numeric"
    }).format(date);
}

function bindActiveNavigation() {
    const links = Array.from(document.querySelectorAll(".site-nav a"));
    const sections = links
        .map((link) => document.querySelector(link.getAttribute("href")))
        .filter(Boolean);

    if (!("IntersectionObserver" in window) || sections.length === 0) {
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            const activeId = `#${entry.target.id}`;
            links.forEach((link) => {
                link.classList.toggle("active", link.getAttribute("href") === activeId);
            });
        });
    }, {
        rootMargin: "-35% 0px -55% 0px",
        threshold: 0.01
    });

    sections.forEach((section) => observer.observe(section));
}
