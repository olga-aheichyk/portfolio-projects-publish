import { sendData } from './get-and-send-data.js';
import { closeMessage } from './util.js';
import { resetMap } from './map.js';
import { initializePinsOnMap } from './get-and-send-data.js';
import { removePins } from './pins.js';
import { disableAlternativeSelectCapacityOptions } from './form-setting.js';
import { clearAdPhotoPreview, clearAvatarPreview } from './photo-upload.js';

const MESSAGE_Z_INDEX = 1000;

const errorTemplate = document.querySelector('#error').content;
const errorMessageLayout = errorTemplate.querySelector('.error');
const successTemplate = document.querySelector('#success').content;
const successMessageLayout = successTemplate.querySelector('.success');
const form = document.querySelector('.ad-form');

/**
 * Функция очистки полей ввода и выбранных фильтров (после успешной отправки формы или нажатия на кнопку "Очистить форму")
 */
const clearFormAndMapFilterAfterResetOrSubmit = () => {
  form.reset();
  clearAvatarPreview();
  clearAdPhotoPreview();
  document.querySelector('.map__filters').reset();
  disableAlternativeSelectCapacityOptions();
  form.querySelector('#price').placeholder = 1000;
  form.querySelector('#price').min = 1000;
  resetMap();
  removePins();
  initializePinsOnMap();
}

/**
 * Функция показа сообщения об ошибке отправке формы
 */
const showErrorMessageAfterFormSubmit = () => {
  const errorMessage = errorMessageLayout.cloneNode(true);
  errorMessage.style.zIndex = MESSAGE_Z_INDEX;

  document.querySelector('main').appendChild(errorMessage);
  closeMessage(errorMessage);
}

/**
 * Функция показа сообщения об успешной отправке формы и последующей очистке полей ввода
 */
const showSuccessMessageAfterFormSubmit = () => {
  const successMessage = successMessageLayout.cloneNode(true);
  successMessage.style.zIndex = MESSAGE_Z_INDEX;

  document.querySelector('main').appendChild(successMessage);
  closeMessage(successMessage);
  clearFormAndMapFilterAfterResetOrSubmit();
}

/**
 * Функция отправки на сервер введенных пользователем данных
 */
const activateFormDataPostOnSubmit = () => {

  form.addEventListener('submit', (evt) => {
    evt.preventDefault();

    sendData(
      showSuccessMessageAfterFormSubmit,
      showErrorMessageAfterFormSubmit,
      new FormData(evt.target),
    )
  });
};

export {
  form,
  clearFormAndMapFilterAfterResetOrSubmit,
  activateFormDataPostOnSubmit
};
