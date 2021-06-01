import { renderPins } from './pins.js';
import { rerenderPinsOnFilterChange } from './map-filter.js';
import { showGetErrorAlert } from './util.js';
import { map } from './map.js';

const GET_URL = 'https://22.javascript.pages.academy/keksobooking/data';
const POST_URL = 'https://22.javascript.pages.academy/keksobooking';

/**
 * Функция отправления GET-запроса на сервер и обработки полученных данных
 * @param {function} onSuccess — функция обработки успешно полученных данных
 * @param {function} onError — функция, выполняющаяся при ошибке получения данных
 */
const getData = (onSuccess, onError) => {
  fetch(GET_URL)
    .then((response) => {
      return response.json();
    })
    .then((ads) => {
      onSuccess(ads);
    })
    .catch(() => {
      onError();
    });
}

/**
 * Функция замыкания для отрисовки пинов на карте при успешном получении данных с сервера
 */
const initializePinsOnMap = () => {
  getData(
    (ads) => {
      renderPins(ads, map);
      rerenderPinsOnFilterChange(ads, map);
    },
    showGetErrorAlert,
  );
}

/**
 * Функция отправления POST-запроса на сервер для отправки введенных пользователем данных
 * @param {function} onSuccess — функция обработки успешно отправленных данных
 * @param {function} onError — функция, выполняющаяся при ошибке отправки данных
 * @param {formData} object — введенные в форме пользовательские данные, которые необходимо отправить на сервер
 */
const sendData = (onSuccess, onError, formData) => {
  fetch(
    POST_URL,
    {
      method: 'POST',
      body: formData,
    },
  )
    .then((response) => {
      if (response.ok) {
        onSuccess();
      }
      else {
        onError();
      }
    })
    .catch(() => {
      onError();
    });
};

export {
  initializePinsOnMap,
  sendData
};
