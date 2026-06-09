import { loadCases, sortTableCases, renderCaseTableBody } from "./app.js";

const tableBody = document.getElementById("case-table-body");
const sortButtons = document.querySelectorAll(".case-table__sort");

let allCases = [];
let currentSort = { column: "date", direction: "asc" };
let sortingEnabled = false;

function navigateToCase(row) {
  const href = row.dataset.href;
  if (href) {
    window.location.href = href;
  }
}

function bindTableRows() {
  tableBody.querySelectorAll(".case-table__row").forEach((row) => {
    row.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        return;
      }
      navigateToCase(row);
    });
    row.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        navigateToCase(row);
      }
    });
  });
}

function updateSortIndicators() {
  sortButtons.forEach((button) => {
    const column = button.dataset.column;
    const indicator = button.querySelector(".case-table__sort-indicator");

    if (column === currentSort.column) {
      button.setAttribute(
        "aria-sort",
        currentSort.direction === "asc" ? "ascending" : "descending"
      );
      indicator.textContent = currentSort.direction === "asc" ? "▲" : "▼";
      button.classList.add("case-table__sort--active");
    } else {
      button.setAttribute("aria-sort", "none");
      indicator.textContent = "";
      button.classList.remove("case-table__sort--active");
    }
  });
}

function renderTable() {
  if (!sortingEnabled) {
    return;
  }

  const sorted = sortTableCases(
    allCases,
    currentSort.column,
    currentSort.direction
  );
  tableBody.innerHTML = renderCaseTableBody(sorted);
  bindTableRows();
  updateSortIndicators();
}

function bindSortHeaders() {
  sortButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (!sortingEnabled) {
        return;
      }

      const column = button.dataset.column;

      if (currentSort.column === column) {
        currentSort.direction = currentSort.direction === "asc" ? "desc" : "asc";
      } else {
        currentSort = { column, direction: "asc" };
      }

      renderTable();
    });
  });
}

async function init() {
  bindSortHeaders();
  updateSortIndicators();

  try {
    allCases = await loadCases();
    sortingEnabled = true;
    renderTable();
  } catch (error) {
    const hasRows = tableBody.querySelector(".case-table__row");
    if (!hasRows) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="5" class="error-state">${error.message}</td>
        </tr>
      `;
      return;
    }

    bindTableRows();
    sortButtons.forEach((button) => {
      button.disabled = true;
      button.title = "Sorting unavailable until case data loads";
    });
  }
}

init();
