import {
  isPhoto,
  createImage
} from './util.js';

const PreviewParameter = {
  HEIGHT: 70,
  WIDTH: 70,
};

const DefaultAvatarParameter = {
  HEIGHT: 44,
  WIDTH: 40,
};

const avatarInput = document.querySelector('.ad-form__field input[type=file]');
const avatarPreview = document.querySelector('.ad-form-header__preview img');

const adPhotoInput = document.querySelector('.ad-form__upload input[type=file]');
const adPhotoPreviewBlock = document.querySelector('.ad-form__photo');

/**
 * Функция очистки превью аватара
 */
const clearAvatarPreview = () => {
  avatarPreview.src = 'img/muffin-grey.svg';
  avatarPreview.width = DefaultAvatarParameter.WIDTH;
  avatarPreview.height = DefaultAvatarParameter.HEIGHT;
};

/**
 * Функция очистки превью фотографии жилья
 */
const clearAdPhotoPreview = () => {
  const previousPhotos = Array.from(adPhotoPreviewBlock.children);
  previousPhotos.forEach((photo) => {
    photo.remove();
  });
};


avatarInput.addEventListener('change', (evt) => {
  const file = evt.target.files[0];
  const fileName = file.name.toLowerCase();

  if (isPhoto(fileName)) {
    const reader = new FileReader();

    reader.addEventListener('load', () => {
      avatarPreview.src = reader.result;
      avatarPreview.width = PreviewParameter.WIDTH;
      avatarPreview.height = PreviewParameter.HEIGHT;
    });

    reader.readAsDataURL(file);
  }
});


adPhotoInput.addEventListener('change', (evt) => {
  const file = evt.target.files[0];
  const fileName = file.name.toLowerCase();
  const adPhotoPreview = createImage(PreviewParameter, 'Фотография жилья');
  clearAdPhotoPreview();
  adPhotoPreviewBlock.appendChild(adPhotoPreview);

  if (isPhoto(fileName)) {
    const reader = new FileReader();

    reader.addEventListener('load', () => {
      adPhotoPreview.src = reader.result;
    });

    reader.readAsDataURL(file);
  }
});

export {
  clearAvatarPreview,
  clearAdPhotoPreview
}
