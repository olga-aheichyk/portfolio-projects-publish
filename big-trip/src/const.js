const AUTHORIZATION = 'Basic 1577653oaheichyk';
const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';

const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

const NavigationItem = {
  TABLE: 'Table',
  STATS: 'Stats',
};

export {
  AUTHORIZATION,
  END_POINT,
  SortType,
  UserAction,
  UpdateType,
  FilterType,
  NavigationItem
};
