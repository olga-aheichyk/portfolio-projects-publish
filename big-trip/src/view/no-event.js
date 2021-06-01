import AbstractView from './abstract.js';

const createNewEventCreationTemplate = () => {
  return `
  <p class="trip-events__msg">Click New Event to create your first point</p>
  `;
};

export default class NoEvent extends AbstractView {
  getTemplate() {
    return createNewEventCreationTemplate();
  }
}
