import { isVoidElement } from './util.js';

const ApartmentTypes = {
  PALACE: 'Дворец',
  FLAT: 'Квартира',
  HOUSE: 'Дом',
  BUNGALOW: 'Бунгало',
};

const cardTemplate = document.querySelector('#card').content;
const cardTemplateArticle = cardTemplate.querySelector('article');

/**
 * Функция создания DOM-элемента тестовой карточки объявления из объекта
 * @param {object} — объект тестовой карточки объявления
 * @return {object} — DOM-элемент тестовой карточки объявления
 */
const createCardLayout = ({author, offer, location}) => {
  const cardArticle = cardTemplateArticle.cloneNode(true);

  const articleAvatar = cardArticle.querySelector('.popup__avatar');

  if (isVoidElement(articleAvatar)) {
    articleAvatar.remove();
  }
  else {
    articleAvatar.src = author.avatar;
  }

  const articleTitle = cardArticle.querySelector('.popup__title');

  if (isVoidElement(articleTitle)) {
    articleTitle.remove();
  }
  else {
    articleTitle.textContent = offer.title;
  }

  cardArticle.querySelector('.popup__text--address').textContent = `Координаты: ${location.lat}, ${location.lng}`;
  cardArticle.querySelector('.popup__text--price').textContent = `${offer.price} ₽/ночь`;
  cardArticle.querySelector('.popup__type').textContent = ApartmentTypes[offer.type.toUpperCase()];
  cardArticle.querySelector('.popup__text--capacity').textContent = `${offer.rooms} комнаты для ${offer.guests} гостей.`;
  cardArticle.querySelector('.popup__text--time').textContent = `Заезд после ${offer.checkin}, выезд до ${offer.checkout}.`;

  const articleDescription = cardArticle.querySelector('.popup__description');

  if (isVoidElement(articleDescription)) {
    articleDescription.remove();
  }
  else {
    articleDescription.textContent = offer.description;
  }

  const articleFeatures = cardArticle.querySelector('.popup__features');

  if (isVoidElement(articleFeatures)) {
    articleFeatures.remove();
  }
  else {
    articleFeatures.textContent = '';
    let featuresFragment = document.createDocumentFragment();

    offer.features.map((item) => {
      const liElement = document.createElement('li');
      liElement.classList.add('popup__feature');
      const specificClassOfLi = `popup__feature--${item}`
      liElement.classList.add(specificClassOfLi);
      return liElement;
    })
      .forEach((liElement) => {
        featuresFragment.appendChild(liElement);
      })

    articleFeatures.appendChild(featuresFragment);
  }

  const articlePhotos = cardArticle.querySelector('.popup__photos');

  if (offer.photos.length === 0) {
    articlePhotos.remove();
  }
  else {
    const articlePhoto = cardArticle.querySelector('.popup__photo');
    articlePhoto.src = offer.photos[0];

    if (offer.photos.length > 1) {
      for (let i = 1; i < offer.photos.length; i++) {
        const nextArticlePhoto = articlePhoto.cloneNode(true);
        nextArticlePhoto.src = offer.photos[i];
        articlePhotos.appendChild(nextArticlePhoto);
      }
    }
  }

  return cardArticle;
}

export { createCardLayout };
