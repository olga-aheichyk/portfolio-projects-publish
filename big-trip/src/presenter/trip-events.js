import SortView from '../view/sort.js';
import EventsListView from '../view/events-list.js';
import NoEventView from '../view/no-event.js';
import LoadingView from '../view/loading.js';
import NewEventPresenter from '../presenter/new-event.js';
import PointPresenter, {State as PointPresenterViewState} from './point.js';
import { remove, render, RenderPosition } from '../utils/render.js';
import { sortByDurationDescending, sortByDateAscending, sortByPriceDescending, tripEventsFilter } from '../utils/data-processing.js';
import { SortType, UpdateType, UserAction, FilterType } from '../const.js';
export default class TripEvents {
  constructor(tripEventsContainer, pointsModel, filterModel, destinationsModel, offersModel, api) {
    this._tripEventsContainer = tripEventsContainer;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;
    this._api = api;

    this._pointPresenter = {};
    this._currentSortType = null;

    this._sortComponent = null;
    this._eventListComponent = new EventsListView();
    this._noEventComponent = new NoEventView();
    this._loadingComponent = new LoadingView();
    this._isLoading = false;

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._newEventPresenter = new NewEventPresenter(this._eventListComponent, this._handleViewAction, this._destinationsModel, this._offersModel);
  }

  init() {
    render(this._tripEventsContainer, this._eventListComponent, RenderPosition.BEFOREEND);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._currentSortType = SortType.DAY;
    this._renderTripEvents();
  }

  destroy() {
    this._clearTripEvents();
    remove(this._eventListComponent);

    this._pointsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  createEvent() {
    this._currentSortType = SortType.DAY;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._newEventPresenter.init();
  }

  _getPoints() {
    const filterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints();

    const filteredPoints = tripEventsFilter[filterType](points);
    switch (this._currentSortType) {
      case SortType.DAY:
        return filteredPoints.sort(sortByDateAscending);
      case SortType.TIME:
        return filteredPoints.sort(sortByDurationDescending);
      case SortType.PRICE:
        return filteredPoints.sort(sortByPriceDescending);
    }
    return filteredPoints;
  }

  _renderLoading() {
    render(this._tripEventsContainer, this._loadingComponent, RenderPosition.BEFOREEND);
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._tripEventsContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderEvent(point) {
    const pointPresenter = new PointPresenter(this._eventListComponent, this._handleViewAction, this._handleModeChange, this._destinationsModel, this._offersModel);
    pointPresenter.init(point);
    this._pointPresenter[point.id] = pointPresenter;
  }

  _renderEvents(points) {
    points.forEach((point) => this._renderEvent(point));
  }

  _renderListOfEvents() {
    const points = this._getPoints();
    this._renderEvents(points);
  }

  _renderNoEvent() {
    render(this._tripEventsContainer, this._noEventComponent, RenderPosition.BEFOREEND);
  }

  _renderTripEvents() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    if (!this._getPoints().length) {
      this._renderNoEvent();
      return;
    }
    this._renderSort();
    this._renderListOfEvents();
  }

  _clearListOfEvents() {
    this._newEventPresenter.destroy();
    Object
      .values(this._pointPresenter)
      .forEach((pointPresenter) => pointPresenter.destroy());
    this._pointPresenter = {};
  }

  _clearTripEvents() {
    this._clearListOfEvents();
    remove(this._sortComponent);
    remove(this._noEventComponent);
    remove(this._loadingComponent);
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointPresenter[update.id].setViewState(PointPresenterViewState.SAVING);
        this._api.updatePoint(update)
          .then((response) => {
            this._pointsModel.updatePoint(updateType, response);
          })
          .catch(() => {
            this._pointPresenter[update.id].setViewState(PointPresenterViewState.ABORTING);
          });
        break;
      case UserAction.ADD_POINT:
        this._newEventPresenter.setSaving();
        this._api.addPoint(update)
          .then((response) => {
            this._pointsModel.addPoint(updateType, response);
          })
          .catch(() => {
            this._newEventPresenter.setAborting();
          });
        break;
      case UserAction.DELETE_POINT:
        this._pointPresenter[update.id].setViewState(PointPresenterViewState.DELETING);
        this._api.deletePoint(update)
          .then(() => {
            this._pointsModel.deletePoint(updateType, update);
          })
          .catch(() => {
            this._pointPresenter[update.id].setViewState(PointPresenterViewState.ABORTING);
          });
        break;
    }
  }

  _handleModelEvent(updateType, point) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenter[point.id].init(point);
        break;
      case UpdateType.MINOR:
        this._clearListOfEvents();
        this._renderListOfEvents();
        break;
      case UpdateType.MAJOR:
        this._clearTripEvents();
        this._currentSortType = SortType.DAY;
        this._renderTripEvents();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderTripEvents();
        break;
    }
  }

  _handleModeChange() {
    this._newEventPresenter.destroy();
    Object
      .values(this._pointPresenter)
      .forEach((pointPresenter) => pointPresenter.resetView());
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearTripEvents();
    this._renderTripEvents();
  }
}
