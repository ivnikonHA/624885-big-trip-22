import TripEventModel from './model/trip-event-model.js';
import HeaderPresenter from './presenter/header-presenter.js';
import TripEventsPresenter from './presenter/trip-events-presenter.js';


const siteInfoElement = document.querySelector('.trip-main');
const siteMainElement = document.querySelector('.trip-events');
const tripEventsModel = new TripEventModel();
const headerPresenter = new HeaderPresenter({ headerContainer: siteInfoElement });
const tripEventsPresenter = new TripEventsPresenter({
  tripEventsContainer: siteMainElement,
  tripEventsModel
});

tripEventsPresenter.init();
headerPresenter.init();
