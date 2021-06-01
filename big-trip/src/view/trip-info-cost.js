import AbstractView from './abstract.js';

const createTripInfoCostTemplate = (points) => {
  const tripBasicCost = points
    .map((point) => point.basePrice)
    .reduce((sum, item) => sum + item, 0);

  const tripAdditionalCost = points
    .map((point) => {
      if (point.offers) {
        return point.offers;
      }
      return 0;
    })
    .map((points) => points.map((offer) => offer.price).reduce((sum, item) => sum + item, 0))
    .reduce((sum, item) => sum + item, 0);

  return `
  <p class="trip-info__cost">
    Total: &euro;&nbsp;
    <span class="trip-info__cost-value">
      ${tripBasicCost + tripAdditionalCost}
    </span>
  </p>
  `;
};

export default class TripInfoCost extends AbstractView {
  constructor(points = []) {
    super();
    this._points = points;
  }

  getTemplate() {
    return createTripInfoCostTemplate(this._points);
  }
}

