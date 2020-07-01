export default class Categories {
  constructor() {
    this.categories = [];
  }

  addCategory(name, shortName, clues) {
    const cat = { name, shortName, clues };
    this.categories.push(cat);
  }

  calcStats(expenses) {
    let temp =[];
    this.categories.forEach((el) => {
      el.total = 0;
      el.countExpenses = 0;
      let exp = [];
      let expName = [];
      
      expenses.forEach((el2) => {
        if (el2.category === el.name) {
          el.total += el2.cost / el2.rate;
          el.countExpenses += 1;
          exp.push(el2.cost / el2.rate);
          expName.push(el2.name)
          el.averageExpense = el.total / el.countExpenses;
        }
      } 
      );
      temp.push(el.total);
      el.highestExpense = {};
      el.highestExpense.cost=(Math.max(...exp));
      el.highestExpense.name = expName[exp.findIndex(e=> e===el.highestExpense.cost)];
    });
    this.highest =(Math.max(...temp));
  }
  
}
