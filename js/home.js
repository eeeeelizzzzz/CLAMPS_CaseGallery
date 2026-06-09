import { loadCases, sortCases, renderCaseTableBody } from "./app.js";

const tableBody = document.getElementById("case-table-body");

function navigateToCase(row) {
  const href = row.dataset.href;
  if (href) {
    window.location.href = href;
  }
}

function bindTableRows() {
  tableBody.querySelectorAll(".case-table__row").forEach((row) => {
    row.addEventListener("click", () => navigateToCase(row));
    row.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        navigateToCase(row);
      }
    });
  });
}

async function init() {
  try {
    const cases = sortCases(await loadCases(), "date-asc");
    tableBody.innerHTML = renderCaseTableBody(cases);
    bindTableRows();
  } catch (error) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" class="error-state">${error.message}</td>
      </tr>
    `;
  }
}

init();
