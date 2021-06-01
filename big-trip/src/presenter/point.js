import EventItemView from '../view/event-item.js';
import EventEditView from '../view/event-edit.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import {UserAction, UpdateType} from '../const.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
  ABORTING: 'ABORTING',
};

export const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
};
export default class Point {
  constructor(eventListContainer, changeData, changeMode, destinationsModel, offersModel) {
    this._eventListContainer = eventListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._mode = Mode.DEFAULT;
    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;

    this._eventItemComponent = null;
    this._eventEditComponent = null;

    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleArrowClick = this._handleArrowClick.bind(this);
    this._handleEditArrowClick = this._handleEditArrowClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleFormDeleteClick = this._handleFormDeleteClick.bind(this);
    this._handleEscKeyDown = this._handleEscKeyDown.bind(this);
  }

  init(point) {
    this._point = point;

    const prevEventItemComponent = this._eventItemComponent;
    const prevEventEditComponent = this._eventEditComponent;

    this._eventItemComponent = new EventItemView(point);
    this._eventEditComponent = new EventEditView(point, this._destinationsModel.getDestinations(), this._offersModel.getOffers());

    this._eventItemComponent.setArrowClickHandler(this._handleArrowClick);
    this._eventItemComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._eventEditComponent.setEditArrowClickHandler(this._handleEditArrowClick);
    this._eventEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._eventEditComponent.setFormDeleteClickHandler(this._handleFormDeleteClick);


    if (prevEventItemComponent === null || prevEventEditComponent === null) {
      render(this._eventListContainer, this._eventItemComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._eventItemComponent, prevEventItemComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._eventItemComponent, prevEventEditComponent);
      this._mode = Mode.DEFAULT;
    }

    remove(prevEventItemComponent);
    remove(prevEventEditComponent);
  }

  destroy() {
    remove(this._eventItemComponent);
    remove(this._eventEditComponent);
  }

  resetView() {
    if(this._mode !== Mode.DEFAULT) {
      this._closeEventEdit();
    }
  }

  setViewState(state) {
    const resetFormState = () => {
      this._eventEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    switch (state) {
      case State.SAVING:
        this._eventEditComponent.updateData({
          isDisabled: true,
          isSaving: true,
        });
        break;
      case State.DELETING:
        this._eventEditComponent.updateData({
          isDisabled: true,
          isDeleting: true,
        });
        break;
      case State.ABORTING:
        this._eventItemComponent.shake(resetFormState);
        this._eventEditComponent.shake(resetFormState);
        break;
    }
  }

  _openEventEdit() {
    replace(this._eventEditComponent, this._eventItemComponent);
    document.addEventListener('keydown', this._handleEscKeyDown);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _closeEventEdit() {
    replace(this._eventItemComponent, this._eventEditComponent);
    document.removeEventListener('keydown', this._handleEscKeyDown);
    this._mode = Mode.DEFAULT;
  }

  _handleEscKeyDown(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._eventEditComponent.reset(this._point);
      this._closeEventEdit();
    }
  }

  _handleFavoriteClick() {
    this._changeData(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      Object.assign(
        {},
        this._point,
        {
          isFavorite: !this._point.isFavorite,
        },
      ),
    );
  }

  _handleArrowClick() {
    this._openEventEdit();
  }

  _handleEditArrowClick() {
    this._eventEditComponent.reset(this._point);
    this._closeEventEdit();
  }

  _handleFormSubmit(point) {
    this._changeData(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      point,
    );
  }

  _handleFormDeleteClick(point) {
    this._changeData(
      UserAction.DELETE_POINT,
      UpdateType.MAJOR,
      point,
    );
  }
}
