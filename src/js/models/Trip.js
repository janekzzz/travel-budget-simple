var uniqid = require("uniqid");

export default class Trip {
  constructor(tripName, startDate, endDate) {
    this.tripName = tripName;
    this.startDate = startDate;
    this.endDate = endDate;
  }

  calcDays() {
    this.days = Math.floor(
      (Date.parse(this.endDate) - Date.parse(this.startDate)) / 86400000
    );
  }

  createID() {
    this.id = uniqid();
  }
  readID() {
    this.id = JSON.parse(localStorage.getItem("curTrip"));
  }

  persistData() {
    let trips = JSON.parse(localStorage.getItem("allTrips"));
    if (trips) {
      trips.push({ id: this.id, name:this.tripName});
      localStorage.setItem("allTrips", JSON.stringify(trips));
    } else {
      localStorage.setItem("allTrips", JSON.stringify([{id: this.id, name: this.tripName}]));
    }

    localStorage.setItem(`trip: ${this.id}`, JSON.stringify(this));
    localStorage.setItem("curTrip", JSON.stringify(this.id));
  }

  readStorage() {
    const curTrip = JSON.parse(localStorage.getItem("curTrip"));
    const storage = JSON.parse(localStorage.getItem(`trip: ${curTrip}`));
    

    if (storage) {
      this.tripName = storage.tripName;
      this.startDate = storage.startDate;
      this.endDate = storage.endDate;
      this.days = storage.days;
    }
  }

  updateCurTrip(id) {
    localStorage.setItem("curTrip", JSON.stringify(id));
  }
}
