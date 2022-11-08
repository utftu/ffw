function getType(data) {
  if (!data) {
    return 'unknown';
  }
  if (Array.isArray(data)) {
    return 'array';
  }
  if (data.__proto__ === Object.prototype) {
    return 'object';
  }
  return 'unknown';
}

export default getType;
