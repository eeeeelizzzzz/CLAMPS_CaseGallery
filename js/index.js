import {
  loadCases,
  sortCases,
  filterCases,
  renderCaseCard,
} from "./app.js";

const grid = document.getElementById("case-grid");
const searchInput = document.getElementById("search");
const sortSelect = document.getElementById("sort");
const caseCount = document.getElementById("case-count");

let allCases = [];

function updateGallery() {
  const filtered = filterCases(allCases, searchInput.value);
  const sorted = sortCases(filtered, sortSelect.value);

  caseCount.textContent = `${sorted.length} case${sorted.length === 1 ? "" : "s"}`;

  if (sorted.length === 0) {
    grid.innerHTML =
      '<li class="empty-state">No cases match your search.</li>';
    return;
  }

  grid.innerHTML = sorted.map(renderCaseCard).join("");
}

async function init() {
  try {
    allCases = await loadCases();
    updateGallery();

    searchInput.addEventListener("input", updateGallery);
    sortSelect.addEventListener("change", updateGallery);
  } catch (error) {
    grid.innerHTML = `<li class="error-state">${error.message}</li>`;
  }
}

init();
