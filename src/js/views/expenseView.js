import { elements } from "../base";

export function sortTable(tbl, row, down = 1) {
  var table, rows, switching, i, x, y, shouldSwitch;
  table = tbl;
  switching = true;
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /*Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 1; i < rows.length - 1; i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("TD")[row];
      y = rows[i + 1].getElementsByTagName("TD")[row];
      //check if the two rows should switch place:
      let a;
      let b;
      if (down === 1) {
        a = x.innerHTML.toLowerCase();
        b = y.innerHTML.toLowerCase();
        let tempA = a.split(" ");
        let tempB = b.split(" ");

        if (parseInt(tempA[0], 10)) {
          a = tempA[0] * 1;
        }
        if (parseInt(tempB[0], 10)) {
          b = tempB[0] * 1;
        }
      } else {
        a = y.innerHTML.toLowerCase();
        b = x.innerHTML.toLowerCase();
        let tempA = a.split(" ");
        let tempB = b.split(" ");
        if (parseInt(tempA[0], 10)) {
          a = tempA[0] * 1;
        }
        if (parseInt(tempB[0], 10)) {
          b = tempB[0] * 1;
        }
      }
      if (a > b) {
        //if so, mark as a switch and break the loop:
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}

const accordion = () => {
  var acc = document.getElementsByClassName("accordion");
  var i;

  for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function () {
      /* Toggle between adding and removing the "active" class,
    to highlight the button that controls the panel */
      this.classList.toggle("active");

      /* Toggle between hiding and showing the active panel */
      var icon = this.firstChild.nextElementSibling;

      if (icon.name === "chevron-up-outline") {
        icon.name = "chevron-down-outline";
      } else {
        icon.name = "chevron-up-outline";
      }

      var panel = this.nextElementSibling.nextElementSibling;
      if (panel.style.maxHeight === "300px") {
        panel.style.maxHeight = "0px";
      } else {
        panel.style.maxHeight = "300px";
      }
    });
  }
};

export const getInput = () => {
  const output = {
    name: elements.inputName.value,
    cost: elements.inputCost.value,
    category: elements.inputType.value,
    currency: elements.currencyType.value,
  };
  return output;
};

export const getInputCreateTrip = () => {
  const output = {
    tripName: elements.tripName.value,
    startDate: elements.startDate.value,
    endDate: elements.endDate.value,
  };

  return output;
};
const parseExpense = (a) => {
  let b;
  if (a >= 1000) {
    b = a.toFixed(0);
  } else {
    b = a.toFixed(2);
  }
  return b;
};
export const renderExpense = (mainCurr, exp) => {
  const markup = `
     <tr class="expense__row" id="${exp.id}">
       <td class="expense__row-title">${exp.name}</td>
        <td class="expense__row-price">${parseExpense(exp.cost / exp.rate)} ${
    exp.rate === 1 ? `` : `<div>${exp.currency} ${parseExpense(exp.cost*1)}</td>`
  }</td>
        <td class="expense__row-category">${exp.categoryShort}</td>
  
        <td class="expense__row-delete"><ion-icon name="close-outline" class="expense__row-delete-button"></ion-icon></td>
  
    </tr>
  `;

  elements.table.insertAdjacentHTML("beforeend", markup);
};

export const renderTotals = (el, days = 7) => {
  elements.statsTotal.innerHTML = `<ion-icon name="pricetags-outline"></ion-icon>${el.toFixed(
    2
  )}<span>&nbsp;EUR</span>`;
  elements.statsDaily.innerHTML = `<ion-icon name="pricetag-outline"></ion-icon>${(
    el / days
  ).toFixed(2)}<span>&nbsp;EUR</span>`;
};

export const clearInputFields = () => {
  elements.inputType.value = "";
  elements.inputCost.value = "";
  elements.inputName.value = "";
  elements.inputName.focus();
};

export const clearCategories = () => {
  elements.stats.innerHTML = "";
};
export const renderCategories = (cat, stateTotal, currency = "EUR") => {
  cat.categories.forEach((el) => {
    if (el.total) {
      const markup = `
      <div class="accordion stats__categories-cat">
        <ion-icon name="chevron-down-outline"></ion-icon>&nbsp;${el.name}
      </div>
      <div class="stats__categories-bar" style="width: ${
        (el.total / cat.highest) * 85
      }%;">&nbsp;<p>${Math.round((el.total / stateTotal) * 100)}%</p></div>
      <div class="panel">
        <strong>Total spent: ${el.total.toFixed(
          2
        )} ${currency}</strong><br />Average expense: ${el.averageExpense.toFixed(
        2
      )} ${currency}<br />
        Number of expenses: ${el.countExpenses}<br />
        Largest expense: ${
          el.highestExpense.name
        } (${el.highestExpense.cost.toFixed(2)} ${currency})
        
      </div>
    `;

      elements.stats.insertAdjacentHTML("beforeend", markup);
    }
  });
  accordion();
};

export const toggleView = (how = "off") => {
  if (how === "off") {
    elements.tripPanel.classList.add("active");
    elements.statsPanel.classList.add("active");
    elements.inputPanel.classList.add("active");
    elements.tripPanel.classList.remove("hidden");
    elements.statsPanel.classList.remove("hidden");
    elements.inputPanel.classList.remove("hidden");
    elements.startPanel.classList.add("hidden");
  } else {
    elements.tripPanel.classList.remove("active");
    elements.statsPanel.classList.remove("active");
    elements.inputPanel.classList.remove("active");
    elements.tripPanel.classList.add("hidden");
    elements.statsPanel.classList.add("hidden");
    elements.inputPanel.classList.add("hidden");
    elements.startPanel.classList.remove("hidden");
  }
};
