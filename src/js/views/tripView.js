import {elements} from '../base';

const renderTrip = (trip) => {
    const markup = `<li> <a href=#${trip.id}>${trip.name}</a></li>`
    elements.tripList.insertAdjacentHTML('beforeend',markup);
    
}

export const renderTrips = (trips) => {
    trips.forEach(element => {
        renderTrip(element)
    });
    
    elements.tripList.insertAdjacentHTML('beforeend',`<li><a href=#1><ion-icon name="add-circle-outline"></ion-icon>&nbsp;Add new trip</a></li>`);
}

export const clearTrips = () => {
    elements.tripList.innerHTML=``;
}