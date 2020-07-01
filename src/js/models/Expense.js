var uniqid = require("uniqid");
export default class Expenses {
  constructor(name, cost, currency, category) {
    (this.name = name),
      (this.cost = cost),
      (this.currency = currency),
      (this.category = category.split(' ').slice(0,category.split(' ').length-1).join(' ')),
      (this.categoryShort = category.split(' ')[category.split(' ').length-1]),
      (this.id = uniqid()),
      (this.rate = 1);
  }

  calcExchange(rates, cur) {
    let rate = 1;
    this.rate = 1;

    if (
      Object.values(rates)[Object.keys(rates).findIndex((el) => el === cur)]
    ) {
      rate = Object.values(rates)[
        Object.keys(rates).findIndex((el) => el === cur)
      ];

      this.rate = rate;
    }
  }
}
