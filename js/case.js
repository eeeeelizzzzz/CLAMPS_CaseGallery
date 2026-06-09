import {
  loadCases,
  formatDate,
  getCaseById,
  getQueryParam,
  renderTags,
  renderFigures,
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
          <span>${entry.campaign}</span>
          <span>${entry.location}</span>
        </div>
        ${renderTags(entry.tags)}
      </header>

      ${renderFigures(entry)}

      ${renderSections(entry.sections)}
    `;
  } catch (error) {
    content.innerHTML = `<div class="error-state">${error.message}</div>`;
  }
}

init();
