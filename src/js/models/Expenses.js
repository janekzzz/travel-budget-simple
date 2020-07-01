var uniqid = require("uniqid");
import axios from "axios";
import Expense from "./Expense";

export default class Expenses {
  constructor() {
    this.expenses = [];
    this.total = 0;
  }

  async getExpenses() {
    try {
      const res = await axios(`http://127.0.0.1:3001/api/v1/expenses/`);
      if (res.data.data[0]) {
        const results = res.data.data[0].expenses;

        results.forEach((el) => {
          this.expenses.push(
            new Expense(
              el.name,
              el.cost,
              el.currency,
              `${el.category} ${el.categoryShort}`
            )
          );
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  persistData(id='1') {
    localStorage.setItem(`expenses: ${id}`, JSON.stringify(this.expenses));
  }

  readStorage(id='1') {
    const storage = JSON.parse(localStorage.getItem(`expenses: ${id}`));

    // Restoring likes from the localStorage
    if (storage) this.expenses = storage;
  }

  addExpense(name, cost, currency, category) {
    this.expenses.push(new Expense(name, cost, currency, category));
  }

  deleteExpense(id) {
    const index = this.expenses.findIndex((el) => el.id === id);
    this.expenses.splice(index, 1);
  }

  calcTotal() {
    this.total = 0;
    this.expenses.forEach((el) => (this.total += el.cost / el.rate));
  }

  calcStats(category) {
    this.expenses.forEach((el) => {
      let catTotal = 0;

      if (el.category === category) {
        catTotal += 1 * el.cost;
      }
    });
  }
}
