import dayjs from 'dayjs';
import { FilterType } from '../const.js';

const getDuration = (from, to) => {
  const durationInMinutes = dayjs(to).diff(dayjs(from), 'minute');

  return durationInMinutes;
};

const formatDuration = (durationInMinutes) => {
  if (durationInMinutes < 60) {
    const minutes = durationInMinutes < 10 ? `0${durationInMinutes}` : durationInMinutes;
    return `${minutes}M`;
  }

  else if (durationInMinutes < 1440) {
    const durationInHours = Math.floor(durationInMinutes / 60);
    const minutesRest = durationInMinutes % 60;

    const hours = durationInHours < 10 ? `0${durationInHours}` : durationInHours;
    const minutes = minutesRest < 10 ? `0${minutesRest}` : minutesRest;

    return `${hours}H ${minutes}M`;
  }

  const durationInDays = Math.floor(durationInMinutes / (60 * 24));
  const hoursRest = Math.floor((durationInMinutes % (24 * 60)) / 60);
  const minutesRest = (durationInMinutes % (24 * 60)) % 60;

  const days = durationInDays < 10 ? `0${durationInDays}` : durationInDays;
  const hours = hoursRest < 10 ? `0${hoursRest}` : hoursRest;
  const minutes = minutesRest < 10 ? `0${minutesRest}` : minutesRest;

  return `${days}D ${hours}H ${minutes}M`;
};

const countPriceForType = (points, type) => {
  const price = points.slice()
    .filter((point) => point.type === type)
    .map((point) => point.basePrice)
    .reduce((sum, basePrice) => sum + basePrice, 0);

  return price;
};

const getCountForType = (points, type) => {
  const count = points.slice()
    .filter((point) => point.type === type).length;

  return count;
};

const countDurationForType = (points, type) => {
  const duration = points.slice()
    .filter((point) => point.type === type)
    .map((point) => getDuration(point.dateFrom, point.dateTo))
    .reduce((sum, duration) => sum + duration, 0);

  return duration;
};

const sortByDateAscending = (a, b) => dayjs(a.dateFrom).diff(dayjs(b.dateFrom));
const sortByDurationDescending = (a, b) => (dayjs(a.dateFrom).diff(dayjs(a.dateTo))) - (dayjs(b.dateFrom).diff(dayjs(b.dateTo)));
const sortByPriceDescending = (a, b) => b.basePrice - a.basePrice;

const tripEventsFilter = {
  [FilterType.EVERYTHING]: (points) => {
    return points.slice();
  },
  [FilterType.PAST]: (points) => {
    return points.slice().filter(
      (item) => dayjs(item.dateFrom).isBefore(dayjs(), 'day')
        || dayjs(item.dateFrom) === dayjs()
        || dayjs(item.dateFrom).isBefore(dayjs(), 'day') && dayjs(item.dateTo).isAfter(dayjs(), 'day'),
    );
  },
  [FilterType.FUTURE]: (points) => {
    return points.slice().filter(
      (item) => dayjs(item.dateTo).isAfter(dayjs(), 'day')
        || dayjs(item.dateFrom).isBefore(dayjs(), 'day') && dayjs(item.dateTo).isAfter(dayjs(), 'day'),
    );
  },
};

export {
  getDuration,
  formatDuration,
  countPriceForType,
  getCountForType,
  countDurationForType,
  sortByDateAscending,
  sortByPriceDescending,
  sortByDurationDescending,
  tripEventsFilter
};
