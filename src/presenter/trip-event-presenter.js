import { remove, render, replace } from '../framework/render.js';
import TripEventView from '../view/trip-event-view.js';
import EditFormView from '../view/edit-form-view.js';

export default class TripEventPresenter {
  #tripEvent = null;
  #destination = null;
  #tripEventComponent = null;
  #editFormComponent = null;
  #tripEventListContainer = null;
  #onDataChange = null;
  #offersList = null;
  #offersFiltered = null;
  #destinationsList = null;

  constructor({tripEventListContainer, onDataChange}) {
    this.#tripEventListContainer = tripEventListContainer;
    this.#onDataChange = onDataChange;
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToEvent();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #replaceCardToForm() {
    replace(this.#editFormComponent, this.#tripEventComponent);
  }

  #replaceFormToEvent() {
    replace(this.#tripEventComponent, this.#editFormComponent);
  }

  destroy() {
    remove(this.#tripEventComponent);
    remove(this.#editFormComponent);
  }

  init({tripEvent, destinationModel, offerModel}) {
    const prevTripEventComponent = this.#tripEventComponent;
    const prevEditFormComponent = this.#editFormComponent;
    this.#tripEvent = tripEvent;
    this.#destination = destinationModel.getById(this.#tripEvent.destination);

    this.#offersList = [...offerModel.offers];
    this.#offersFiltered = offerModel.getByType(tripEvent.type);
    this.#destinationsList = [...destinationModel.destinations];

    this.#tripEventComponent = new TripEventView({
      tripEvent: this.#tripEvent,
      offersList: this.#offersList,
      destination: this.#destination,
      onEditClick: () => {
        this.#replaceCardToForm();
        document.addEventListener('keydown', this.#escKeyDownHandler);
      },
      onFavoriteClick: () => {
        this.#tripEvent.favorite = !this.#tripEvent.favorite;
        this.#onDataChange(this.#tripEvent, destinationModel, offerModel);
      }
    });

    this.#editFormComponent = new EditFormView({
      tripEvent: this.#tripEvent,
      offersFiltered: this.#offersFiltered,
      destinationsList: this.#destinationsList,
      destination: this.#destination,
      onFormSubmit: () => {
        this.#replaceFormToEvent();
        document.removeEventListener('keydown', this.#escKeyDownHandler);
      },
      onCloseClick: () => {
        this.#replaceFormToEvent();
        document.removeEventListener('keydown', this.#escKeyDownHandler);
      },
    });

    if(prevTripEventComponent === null || prevEditFormComponent === null) {
      render(this.#tripEventComponent, this.#tripEventListContainer);
      return;
    }
    if(this.#tripEventListContainer.contains(prevTripEventComponent.element)) {
      replace(this.#tripEventComponent, prevTripEventComponent);
    }
    if(this.#tripEventListContainer.contains(prevEditFormComponent.element)) {
      replace(this.#editFormComponent, prevEditFormComponent);
    }

    remove(prevTripEventComponent);
    remove(prevEditFormComponent);
  }
}
