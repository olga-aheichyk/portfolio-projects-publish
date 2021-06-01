import TripInfoView from '../view/trip-info.js';
import TripInfoMainView from '../view/trip-info-main.js';
import TripInfoCostView from '../view/trip-info-cost.js';
import { remove, render, RenderPosition } from '../utils/render.js';

export default class TripMain {
  constructor(pointsModel) {
    this._tripMainContainer = document.querySelector('.trip-main');
    this._pointsModel = pointsModel;

    this._tripInfoComponent = new TripInfoView();
    this._tripInfoMainComponent = null;
    this._tripInfoCostComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._pointsModel.addObserver(this._handleModelEvent);
  }

  init() {
    render(this._tripMainContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
    this._renderTripMain();
  }

  _getPoints() {
    return this._pointsModel.getPoints();
  }

  _renderTripInfo() {
    const points = this._getPoints();

    this._tripInfoMainComponent = new TripInfoMainView(points);
    render(this._tripInfoComponent, this._tripInfoMainComponent, RenderPosition.BEFOREEND);

    this._tripInfoCostComponent = new TripInfoCostView(points);
    render(this._tripInfoComponent, this._tripInfoCostComponent, RenderPosition.BEFOREEND);
  }

  _renderTripMain() {
    if (this._getPoints().length) {
      this._renderTripInfo();
    }
  }

  _clearTripMain() {
    remove(this._tripInfoMainComponent);
    remove(this._tripInfoCostComponent);
  }

  _handleModelEvent() {
    this._clearTripMain();
    this._renderTripMain();
  }
}


