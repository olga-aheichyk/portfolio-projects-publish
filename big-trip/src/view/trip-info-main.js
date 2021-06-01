import AbstractView from './abstract.js';
import dayjs from 'dayjs';
import minMax from 'dayjs/plugin/minMax';
dayjs.extend(minMax);
import { sortByDateAscending } from '../utils/data-processing.js';

const TITLE_CITIES_COUNT = 3;

const createTripInfoMainTemplate = (points) => {
  if (points) {
    const tripCities = points
      .sort(sortByDateAscending)
      .map((point) => {
        return point.info.name;
      });

    const title =
    tripCities.length > TITLE_CITIES_COUNT
      ?
      `${tripCities[0]} &mdash; ... &mdash; ${tripCities[tripCities.length - 1]}`
      :
      Array.from(new Set(tripCities))
        .join(' &mdash; ');

    const startDates = points.map((point) => dayjs(point.dateFrom));
    const endDates = points.map((point) => dayjs(point.dateTo));

    const startTripDay = dayjs.min(startDates).format('MMM DD');
    const endTripDay = dayjs.max(endDates).format('MMM DD');

    return `
    <div class="trip-info__main">
      <h1 class="trip-info__title">${title}</h1>
      <p class="trip-info__dates">${startTripDay}&nbsp;&mdash;&nbsp;${endTripDay}</p>
    </div>
    `;
  }

  return '';
};

export default class TripInfoMain extends AbstractView {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return createTripInfoMainTemplate(this._points);
  }
}
