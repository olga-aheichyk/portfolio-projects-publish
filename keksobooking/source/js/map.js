import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import {
  makeInteractiveElementsInactive,
  makeInteractiveElementsActive
} from './util.js';

import { initializePinsOnMap } from './get-and-send-data.js';


const MAP_ZOOM = 10;
const ADDRESS_DIGITS_AFTER_DECIMAL = 5;

const TokyoCenter = {
  X: 35.6894,
  Y: 139.692,
};

const PinParameter = {
  X: 51,
  Y: 51,
};

const adForm = document.querySelector('.ad-form');
const mapFilter = document.querySelector('.map__filters');
const inputAddress = adForm.querySelector('#address');

let map;
let mainPin;

/**
  * Функция деактивации интерактивных элементов формы и фильтра при успешной загрузке скрипта
  */
const disableFilterAndFormBeforeInitialization = () => {
  makeInteractiveElementsInactive(adForm, 'ad-form--disabled');
  makeInteractiveElementsInactive(mapFilter, 'map__filters--disabled');
};

/**
  * Функция инициализации интерактивной карты и отрисовки пинов объявлений на ней
  */
const initializeMapAndPins = () => {
  map = L.map('map-canvas')
    .on('load', () => {
      makeInteractiveElementsActive(adForm, 'ad-form--disabled');
      makeInteractiveElementsActive(mapFilter, 'map__filters--disabled');
      inputAddress.value = `${TokyoCenter.X}, ${TokyoCenter.Y}`;
      initializePinsOnMap();
    })
    .setView({
      lat: TokyoCenter.X,
      lng: TokyoCenter.Y,
    }, MAP_ZOOM);

  L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    })
    .addTo(map);

  const mainIcon = L.icon({
    iconUrl: 'img/main-pin.svg',
    iconSize: [PinParameter.X, PinParameter.Y],
    iconAnchor: [(PinParameter.X) / 2, PinParameter.Y],
  });

  mainPin = L.marker({
    lat: TokyoCenter.X,
    lng: TokyoCenter.Y,
  },
  {
    draggable: true,
    icon: mainIcon,
  },
  );

  mainPin.addTo(map);

  mainPin.on('moveend', (evt) => {
    inputAddress.value = `${evt.target.getLatLng().lat.toFixed(ADDRESS_DIGITS_AFTER_DECIMAL)},
    ${evt.target.getLatLng().lng.toFixed(ADDRESS_DIGITS_AFTER_DECIMAL)}`;
  });
}

/**
  * Функция возвращения карты в исходное состояние
  * @param {number} x — координата широты
  * @param {number} y — координата долготы
  */
const resetMap = (x = TokyoCenter.X, y = TokyoCenter.Y) => {
  map.setView({
    lat: x,
    lng: y,
  }, MAP_ZOOM);

  mainPin.setLatLng([x, y]);

  inputAddress.value = `${x}, ${y}`;
}



export {
  PinParameter,
  map,
  disableFilterAndFormBeforeInitialization,
  initializeMapAndPins,
  resetMap
};








