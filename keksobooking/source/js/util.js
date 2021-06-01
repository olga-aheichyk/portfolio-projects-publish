const ALERT_SHOW_TIME = 5000;
const FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];


/**
 * Функция перевода интерактивных элементов объекта в неактивное состояние
 * @param {object} object — объект, элементы которого нужно перевести в неактивное состояние
 * @param {string} className — CSS-класс неактивности объекта
 * @param {array} interactiveElements — коллекция элементов объекта
 */
const makeInteractiveElementsInactive = (object, className) => {
  object.classList.add(className);

  let interactiveElements = Array.from(object.elements);
  interactiveElements.forEach((item) => {
    item.disabled = true;
  });
};

/**
  * Функция перевода интерактивных элементов объекта в активное состояние
  * @param {object} object — объект, элементы которого нужно перевести в активное состояние
  * @param {string} className — CSS-класс неактивности объекта
  * @param {array} interactiveElements — коллекция элементов объекта
  */
const makeInteractiveElementsActive = (object, className) => {
  object.classList.remove(className);

  let interactiveElements = Array.from(object.elements);
  interactiveElements.forEach((item) => {
    item.disabled = false;
  });
};

/**
 * Функция проверки наличия содержимого у DOM-элемента
 * @param {object} element — DOM-элемент
 * @return {boolean}
 */
const isVoidElement = (element) => {
  return element.length === 0 || element.src === null;
};

/**
  * Функция создания сообщения об ошибке получения данных с сервера
  * @param {string} message — текст сообщения об ошибке
  */
const showGetErrorAlert = (message = 'Данные о доступных объявлениях не могут быть загружены') => {
  const adTitle = document.querySelector('.notice__title')
  const alertContainer = document.createElement('div');
  alertContainer.style.padding = '30px';
  alertContainer.style.fontSize = '40px';
  alertContainer.style.textAlign = 'center';
  alertContainer.style.backgroundColor = 'red';

  alertContainer.textContent = message;

  adTitle.append(alertContainer);

  setTimeout(() => {
    alertContainer.remove();
  }, ALERT_SHOW_TIME);
};

/**
  * Функция проверки на нажатие клавиши 'Esc'
  */
const isEscEvent = (evt) => {
  return evt.key === 'Escape' || evt.key === 'Esc';
};

/**
  * Функция закрытия сообщения об отправке формы
  * @param {object} message — DOM-элемент сообщения об отправке формы
  */
const closeMessage = (message) => {
  document.addEventListener('keydown', (evt) => {
    if (isEscEvent(evt)) {
      message.remove();
      document.removeEventListener('keydown', closeMessage(message));
    }
  });

  message.addEventListener('click', () => {
    message.remove();
  });
};

/**
  * Функция проверки, является ли указанный файл изображением
  * @param {string} fileName — имя файла
  * @return {boolean}
  */
const isPhoto = (fileName) => {
  return FILE_TYPES.some((item) => {
    return fileName.endsWith(item);
  });
};

/**
  * Функция создания DOM-элемента изображения
  * @param {object} imageParameter — параметры создаваемого изображения
  * @param {string} alt — атрибут alt у создаваемого DOM-элемента
  * @return {object} — DOM-элемент изображения
  */
const createImage = (imageParameter, alt) => {
  const image = document.createElement('img');
  image.alt = alt;
  image.width = imageParameter.WIDTH;
  image.height = imageParameter.HEIGHT;
  return image;
};

export {
  makeInteractiveElementsInactive,
  makeInteractiveElementsActive,
  isVoidElement,
  showGetErrorAlert,
  closeMessage,
  isPhoto,
  createImage
};
