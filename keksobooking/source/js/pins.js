import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { createCardLayout } from './create-card-layout.js';
import { PinParameter } from './map.js';

const PINS_ON_MAP_COUNT = 10;

let adPin;
let adPins = [];

/**
  * Функция создания на карте пинов объявлениЙ, при клике на которые открывается всплывающая карточка отдельного объявления
  * @param {array} pins — массив объектов объявлений для создания пинов на карте
  * @param {object} map — интерактивная карта
  */
const renderPins = (pins, map) => {
  pins.slice(0, PINS_ON_MAP_COUNT)
    .forEach((pin) => {
      const icon = L.icon({
        iconUrl: 'img/pin.svg',
        iconSize: [PinParameter.X, PinParameter.Y],
        iconAnchor: [(PinParameter.X) / 2, PinParameter.Y],
      });

      adPin = L.marker({
        lat: pin.location.lat,
        lng: pin.location.lng,
      },
      {
        icon,
      },
      );

      adPin
        .addTo(map)
        .bindPopup(createCardLayout(pin),
          {
            keepInView: true,
          },
        );

      adPins.push(adPin);
    })
}

/**
  * Функция удаления пинов объявлений
  */
const removePins = () => {
  adPins.forEach((adPin) => {
    adPin.remove();
  })
  adPins.length = 0;
}

export {
  PINS_ON_MAP_COUNT,
  renderPins,
  removePins
};

