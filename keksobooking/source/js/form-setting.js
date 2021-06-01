import {
  form,
  clearFormAndMapFilterAfterResetOrSubmit
} from './form-submit.js';

const MinPricePerNight = {
  BUNGALOW: 0,
  FLAT: 1000,
  HOUSE: 5000,
  PALACE: 10000,
};

const TitleLength = {
  MIN: 30,
  MAX: 100,
};

const RoomGuestsIndexes = {
  1: [2],
  2: [1, 2],
  3: [0, 1, 2],
  100: [3],
};


const formSelectType = form.querySelector('#type');
const formInputPrice = form.querySelector('#price');
const selectTimeIn = form.querySelector('#timein');
const selectTimeOut = form.querySelector('#timeout');
const formInputTitle = form.querySelector('#title');
const formSelectRoomNumber = form.querySelector('#room_number');
const formSelectCapacityOptions = Array.from(form.querySelectorAll('#capacity option'));
const resetButton = form.querySelector('.ad-form__reset');


/**
 * Настройка запрета ручного редактирования поля ввода адреса
 */
form.querySelector('#address').readOnly = true;


/**
 *  Настройка зависимости цены за ночь от выбранного типа жилья
 */
formSelectType.addEventListener('change', (evt) => {
  formInputPrice.placeholder = MinPricePerNight[evt.target.value.toUpperCase()];
  formInputPrice.min = MinPricePerNight[evt.target.value.toUpperCase()];
});

/**
 *  Настройка синхронизации времени заезда и выезда
 */
selectTimeIn.addEventListener('change', (evt) => {
  selectTimeOut.value = evt.target.value;
})

selectTimeOut.addEventListener('change', (evt) => {
  selectTimeIn.value = evt.target.value;
})

/**
 *  Настройка валидации поля ввода заголовка объявления
 */
formInputTitle.addEventListener('input', () => {
  const valueLength = formInputTitle.value.length;

  if (valueLength < TitleLength.MIN) {
    formInputTitle.setCustomValidity(`Осталось ввести ещё ${TitleLength.MIN - valueLength} символов`);
  }

  else if (valueLength > TitleLength.MAX) {
    formInputTitle.setCustomValidity(`Максимальная длина заголовка ${TitleLength.MAX} символов`);
  }

  else {
    formInputTitle.setCustomValidity('');
  }

  formInputTitle.reportValidity();
});

/**
 *  Настройка валидации цены за ночь
 */
formInputPrice.addEventListener('invalid', () => {
  if (formInputPrice.validity.rangeUnderflow) {
    formInputPrice.setCustomValidity(`Минимальная цена за ночь для такого типа жилья составляет ${formInputPrice.getAttribute('min')} рублей`);
  }

  else if (formInputPrice.validity.rangeOverflow) {
    formInputPrice.setCustomValidity(`Максимальная цена за ночь не должна превышать ${formInputPrice.getAttribute('max')} рублей`);
  }

  else if (formInputPrice.validity.valueMissing) {
    formInputPrice.setCustomValidity('Обязательное поле');
  }

  formInputPrice.addEventListener('input', () => {
    formInputPrice.setCustomValidity('');
  });
});

/**
 *  Функция деактивации поля выбора количества комнат до выбора пользователем количества гостей
 */
const disableAlternativeSelectCapacityOptions = () => {
  formSelectCapacityOptions.forEach((option) => {
    option.disabled = true;
  });
  formSelectCapacityOptions[2].disabled = false;
  formSelectCapacityOptions[2].selected = true;
};

disableAlternativeSelectCapacityOptions();

/**
 *  Настройка зависимости возможного количества гостей от выбранного количества комнат
 */
formSelectRoomNumber.addEventListener('change', (evt) => {
  disableAlternativeSelectCapacityOptions();

  RoomGuestsIndexes[evt.target.value].forEach((index) => {
    formSelectCapacityOptions[index].disabled = false;
    formSelectCapacityOptions[index].selected = false;

    if (index === 3) {
      formSelectCapacityOptions[index].selected = true;
      formSelectCapacityOptions[2].selected = false;
      formSelectCapacityOptions[2].disabled = true;
    }
    else {
      formSelectCapacityOptions[2].selected = true;
    }
  });
});

/**
 *  Настройка выделения рамкой невалидных обязательных полей ввода при вводе данных в форму
 */
form.addEventListener('input', () => {
  const invalidInputs = Array.from(form.querySelectorAll('input:invalid'));
  const validInputs = Array.from(form.querySelectorAll('input:valid'));

  invalidInputs.forEach((input) => {
    input.style.border = '2px solid red'
  });

  validInputs.forEach((input) => {
    input.style.border = 'none';
  });
});

/**
 * Настройка работы кнопки 'Очистить форму'
 */
resetButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  clearFormAndMapFilterAfterResetOrSubmit();
});

export { disableAlternativeSelectCapacityOptions }


