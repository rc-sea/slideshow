export function setLocalStorageValue (key, value) {
  window.localStorage.setItem(key, value === 'undefined' ? 'undefined' : JSON.stringify(value));
}

export function getLocalStorageValue (key) {
  const value = localStorage.getItem(key);

  if (value === undefined || value === 'undefined') return undefined;

  try {
    return JSON.parse(value);
  } catch (e) {
    console.error(`Invalid JSON value for key ${key}: ${value}`);
    return undefined;
  }
}
