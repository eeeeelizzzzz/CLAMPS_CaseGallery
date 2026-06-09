import {
  loadCases,
  formatDate,
  getCaseById,
  getQueryParam,
  casePageUrl,
  renderTags,
  renderSections,
} from "./app.js";

const content = document.getElementById("case-content");

async function init() {
  const caseId = getQueryParam("id");

  if (!caseId) {
    content.innerHTML = `
      <div class="error-state">
        <p>No case selected. <a href="index.html">Return to the gallery</a>.</p>
      </div>
    `;
    return;
  }

  try {
    const cases = await loadCases();
    const entry = getCaseById(cases, caseId);

    if (!entry) {
      content.innerHTML = `
        <div class="error-state">
          <p>Case not found: <strong>${caseId}</strong></p>
          <p><a href="index.html">Return to the gallery</a></p>
        </div>
      `;
      return;
    }

    document.title = `${entry.title} — CLAMPS Case Gallery`;

    content.innerHTML = `
      <header class="case-header">
        <a class="back-link" href="index.html">&larr; All cases</a>
        <h1>${entry.title}</h1>
        <div class="case-meta">
          <span>${entry.subtitle}</span>
          <span>${formatDate(entry.date)}</span>
          <span>ID: ${entry.id}</span>
        </div>
        ${renderTags(entry.tags)}
      </header>

      <figure class="figure-panel">
        <figcaption class="figure-panel__header">Instrument overview</figcaption>
        <div class="figure-panel__body">
          <img
            src="${entry.image}"
            alt="${entry.title} — ${entry.subtitle} instrument overview"
          >
        </div>
      </figure>

      ${renderSections(entry.sections)}
    `;
  } catch (error) {
    content.innerHTML = `<div class="error-state">${error.message}</div>`;
  }
}

init();
