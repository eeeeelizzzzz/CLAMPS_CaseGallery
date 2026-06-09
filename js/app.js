const CASES_URL = "data/cases.json";

let casesCache = null;

async function loadCases() {
  if (casesCache) return casesCache;

  const response = await fetch(CASES_URL);
  if (!response.ok) {
    throw new Error(`Failed to load cases (${response.status})`);
  }

  casesCache = await response.json();
  return casesCache;
}

function formatDate(isoDate) {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

function getCaseById(cases, id) {
  return cases.find((entry) => entry.id === id);
}

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function casePageUrl(id) {
  return `case.html?id=${encodeURIComponent(id)}`;
}

function sortCases(cases, sortBy) {
  const sorted = [...cases];

  if (sortBy === "date-desc") {
    return sorted.sort((a, b) => b.date.localeCompare(a.date));
  }
  if (sortBy === "date-asc") {
    return sorted.sort((a, b) => a.date.localeCompare(b.date));
  }
  if (sortBy === "title") {
    return sorted.sort((a, b) => {
      const titleCompare = a.title.localeCompare(b.title);
      if (titleCompare !== 0) return titleCompare;
      return a.subtitle.localeCompare(b.subtitle);
    });
  }

  return sorted;
}

function filterCases(cases, query) {
  const needle = query.trim().toLowerCase();
  if (!needle) return cases;

  return cases.filter((entry) => {
    const haystack = [
      entry.id,
      entry.title,
      entry.subtitle,
      entry.date,
      ...(entry.tags || []),
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(needle);
  });
}

function renderTags(tags) {
  if (!tags || tags.length === 0) return "";

  const items = tags.map((tag) => `<li class="tag">${tag}</li>`).join("");
  return `<ul class="tag-list">${items}</ul>`;
}

function renderCaseCard(entry) {
  const alt = `${entry.title} — ${entry.subtitle} (${entry.date})`;

  return `
    <li class="case-card">
      <a href="${casePageUrl(entry.id)}">
        <div class="case-card__thumb">
          <img src="${entry.image}" alt="${alt}" loading="lazy">
        </div>
        <div class="case-card__body">
          <p class="case-card__date">${formatDate(entry.date)}</p>
          <h2 class="case-card__title">${entry.title}</h2>
          <p class="case-card__subtitle">${entry.subtitle}</p>
          ${renderTags(entry.tags)}
        </div>
      </a>
    </li>
  `;
}

function renderSections(sections) {
  if (!sections || sections.length === 0) {
    return `
      <section class="content-section placeholder-note">
        <h2>Additional content</h2>
        <p>More case information and visualizations will be added here as they are developed.</p>
      </section>
    `;
  }

  return sections
    .map((section) => {
      if (section.type === "html") {
        return `
          <section class="content-section">
            <h2>${section.title}</h2>
            ${section.content}
          </section>
        `;
      }

      if (section.type === "image") {
        return `
          <section class="content-section">
            <h2>${section.title}</h2>
            <img src="${section.src}" alt="${section.alt || section.title}" loading="lazy">
          </section>
        `;
      }

      return `
        <section class="content-section">
          <h2>${section.title}</h2>
          <p>${section.content}</p>
        </section>
      `;
    })
    .join("");
}

export {
  loadCases,
  formatDate,
  getCaseById,
  getQueryParam,
  casePageUrl,
  sortCases,
  filterCases,
  renderCaseCard,
  renderTags,
  renderSections,
};
