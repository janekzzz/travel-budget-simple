import Categories from "./models/Category";

import Expenses from "./models/Expenses";
import Trip from "./models/Trip";
import * as expenseView from "./views/expenseView";
import axios from "axios";
import { elements } from "./base";
import * as tripView from "./views/tripView";

const getRates = async (cur) => {
  try {
    const res = await axios(
      `https://api.exchangeratesapi.io/latest?base=${cur}`
    );
    const rates = res.data.rates;
    state.rates = rates;
  } catch (error) {
    console.log(error);
  }
};

const state = {};

/*
const tryPostMongo = () => {
  axios({
    method: "post",
    url: "http://127.0.0.1:3001/api/v1/expenses/",
    data: state.expenses,
  });
};

const tryDeleteMongo = () => {
  axios({
    method: "delete",
    url: "http://127.0.0.1:3001/api/v1/expenses/",
  });
};
*/

state.mainCurrency = "EUR";

//just some useful functions for guessing the category of expense from the clues in the name:
const checkCommonEl = (arr1, arr2) => arr1.some((r) => arr2.indexOf(r) >= 0);
const guessType = (input) => {
  const words = input.toLowerCase().split(" ");
  let name = "";
  let shortName = "";
  state.categories.categories.forEach((el) => {
    if (checkCommonEl(el.clues, words)) {
      name = el.name;
      shortName = el.shortName;
    }
  });
  if (!name) {
    name = "Other";
    shortName = "💡";
  }
  return [name, shortName];
};

getRates(state.mainCurrency);

state.categories = new Categories();
state.expenses = new Expenses();

/*
const fetch = async () => {
  try {
    await state.expenses.getExpenses();

    if (state.expenses.expenses[0]) {
      state.expenses.expenses.forEach((el) => {
        expenseView.renderExpense(state.mainCurrency, el);
      });
      updateUI();
    }
  } catch (err) {
    console.log(err);
  }
};
*/
//fetch();

state.categories.addCategory("Accommodation", "🛌", [
  "accommodation",
  "hotel",
  "motel",
  "room",
  "hostel",
  "airbnb",
]);
state.categories.addCategory("Eating out", "🍴", [
  "eating",
  "dinner",
  "lunch",
  "breakfast",
  "pizza",
  "burger",
  "sushi",
  "kebab",
  "brunch",
  "restaurant",
  "coffee",
]);
state.categories.addCategory("Transportation", "🚌", [
  "bus",
  "tram",
  "ferry",
  "uber",
  "taxi",
  "train",
  "taxi",
  "uber",
]);
state.categories.addCategory("Flight tickets", "🛫", [
  "plane",
  "flight",
  "airline",
  "air",
]);
state.categories.addCategory("Groceries", "🥖", [
  "food",
  "shop",
  "groceries",
  "shopping",
  "grocery",
]);
state.categories.addCategory("Attractions", "🎳", [
  "museum",
  "fun",
  "zoo",
  "cinema",
  "tour"
]);
state.categories.addCategory("Car rental", "🚗", ["rental", "car"]);
state.categories.addCategory("Fuel", "⛽", ["gas", "petrol"]);
state.categories.addCategory("Party", "🥂", [
  "drink",
  "beer",
  "club",
  "pub",
  "bar",
  "dancing",
]);
state.categories.addCategory("Other", "💡", []);

//read trip storage

state.trip = new Trip();

state.trip.readID(); //reads what is the current trip ID
state.trip.readStorage(); //reads storage for that ID

//UPDATE THE DASHBOARD UI

const editDate = (date) => {
  const b = date.split('-');
  return (b[2]+'/'+b[1]+'/'+b[0].slice(0,2));
}

if (state.trip.tripName) {
  elements.tripTitle.textContent = state.trip.tripName;
  elements.tripDate.textContent = `${editDate(state.trip.startDate)} - ${editDate(state.trip.endDate)}`;
  expenseView.toggleView();
}

//get all trips IDs and names and update the list of trips
state.trips = JSON.parse(localStorage.getItem("allTrips"));

if (state.trips) {
  tripView.clearTrips();
  tripView.renderTrips(state.trips);
}

const addExpense = () => {
  //get input from the input fields
  const input = expenseView.getInput();

  if (input.name && input.cost && input.currency && input.category) {
    //add new expense to the STATE - this will also make the short category
    state.expenses.addExpense(
      input.name,
      input.cost,
      input.currency,
      input.category
    );

    //display the new expense - coming from the data
    const curExp = state.expenses.expenses[state.expenses.expenses.length - 1];
   
    curExp.calcExchange(state.rates, input.currency);

    //render the added expense
    expenseView.renderExpense(state.mainCurrency, curExp);

    //clear the input fields for the new input
    expenseView.clearInputFields();

    //updated dashboard UI
    updateUI();

    //write to storage
    state.expenses.persistData(state.trip.id);
  }
};

//removing an expense:
elements.expensesList.addEventListener("click", (event) => {
  if (event.target.classList.contains("expense__row-delete-button")) {
    const t = event.target.parentNode.parentNode;
    //remove from UI:
    t.parentNode.removeChild(t);
    //remove from the data:
    state.expenses.deleteExpense(t.id);
    //update UI
    updateUI();
    //write to storage
    state.expenses.persistData(state.trip.id);
  }
});

//adding expense
document.addEventListener("keypress", (e) => {
  if (e.code == "Enter") {
    addExpense();
  }
});
document.getElementById("input__add-btn").addEventListener("click", addExpense);

//guessing the expense type by clues
elements.inputName.addEventListener("focusout", () => {
  const input = expenseView.getInput();
  if (input.name) {
    elements.inputType.value = guessType(input.name).join(" ");
  }
});

elements.inputType.addEventListener("focusin", () => {
elements.inputType.value = "";
});
elements.currencyType.addEventListener("focusin", () => {
  elements.currencyType.value = "";
  });

//sorting the table
let sortDirection = [1, 1, 1];
document
  .querySelector(".expense__row-title-sort")
  .addEventListener("click", () => {
    expenseView.sortTable(elements.table, 0, sortDirection[0]);
    sortDirection[0] *= -1;
  });
document
  .querySelector(".expense__row-category-sort")
  .addEventListener("click", () => {
    expenseView.sortTable(elements.table, 2, sortDirection[2]);
    sortDirection[2] *= -1;
  });
document
  .querySelector(".expense__row-price-sort")
  .addEventListener("click", () => {
    expenseView.sortTable(elements.table, 1, sortDirection[1]);
    sortDirection[1] *= -1;
  });

const updateUI = () => {
  //calculate the expenses for each category
  state.categories.calcStats(state.expenses.expenses);
  //calculate the totals
  state.expenses.calcTotal();

  //update the totals
  expenseView.renderTotals(state.expenses.total, state.trip.days);
  //clear and render the results by categories
  expenseView.clearCategories();
  expenseView.renderCategories(state.categories, state.expenses.total);
};

//read the storage and render UI:
state.expenses.readStorage(state.trip.id);
const renderUI = () => {
  state.expenses.expenses.forEach((el) => {
    expenseView.renderExpense(state.mainCurrency, el);
  });
  if (state.expenses.expenses[0]) {
    updateUI();
  }
};
renderUI();

document.querySelector(".start-btn").addEventListener("click", () => {
  const tripDetails = expenseView.getInputCreateTrip();
  if (
    tripDetails.tripName &&
    tripDetails.startDate &&
    tripDetails.endDate &&
    tripDetails.endDate > tripDetails.startDate
  ) {
    state.trip = new Trip(
      tripDetails.tripName,
      tripDetails.startDate,
      tripDetails.endDate
    );
    state.trip.createID();
    state.trip.calcDays();
    state.trip.persistData();
    location.reload();
  }
});

document.querySelector(".menu-outline").addEventListener("click", () => {
  //document.querySelector(".head__links").classList.toggle("active");
  if (
    document.querySelector(".head__links-child").style.maxHeight === "500px"
  ) {
    document.querySelector(".head__links-child").style.maxHeight = "0px";
  } else {
    document.querySelector(".head__links-child").style.maxHeight = "500px";
  }
});

window.addEventListener(
  "hashchange",
  function () {
    const id = window.location.hash.replace("#", "");
    if (id=="1") {
      expenseView.toggleView("on");
      document.querySelector(".head__links-child").style.maxHeight = "0px";
    } else {
    state.trip.updateCurTrip(id);
    location.reload();
  }
  },
  false
);
