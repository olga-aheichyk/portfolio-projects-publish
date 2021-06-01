import './form-setting.js';
import './photo-upload.js';

import {
  disableFilterAndFormBeforeInitialization,
  initializeMapAndPins
} from './map.js';

import { activateFormDataPostOnSubmit } from './form-submit.js';


disableFilterAndFormBeforeInitialization();
initializeMapAndPins();

activateFormDataPostOnSubmit();
