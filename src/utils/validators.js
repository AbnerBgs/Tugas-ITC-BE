const isNonEmptyString = (value) =>
  typeof value === 'string' && value.trim().length > 0;

const isPositiveInteger = (value) =>
  (typeof value === 'number' || (typeof value === 'string' && value.trim() !== '')) &&
  Number.isInteger(Number(value)) &&
  Number(value) > 0;

const isNonNegativeInteger = (value) =>
  (typeof value === 'number' || (typeof value === 'string' && value.trim() !== '')) &&
  Number.isInteger(Number(value)) &&
  Number(value) >= 0;

const isValidDate = (value) =>
  typeof value === 'string' &&
  value.trim().length > 0 &&
  !Number.isNaN(Date.parse(value));

module.exports = {
  isNonEmptyString,
  isPositiveInteger,
  isNonNegativeInteger,
  isValidDate,
};