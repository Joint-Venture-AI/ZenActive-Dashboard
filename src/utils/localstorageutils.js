// localStorage utility functions
const localStorageUtil = {
  // Set an item in localStorage
  setItem: (key, value) => {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error("Could not save to localStorage", error);
    }
  },

  // Get an item from localStorage
  getItem: (key) => {
    try {
      // console.log(key);
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error("Could not retrieve from localStorage", error);
      return null;
    }
  },

  // Remove an item from localStorage
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Could not remove from localStorage", error);
    }
  },

  // Clear all items from localStorage
  clearAll: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Could not clear localStorage", error);
    }
  },
};

export const setItemWithExpiration = (key, value, expirationInMinutes) => {
  const expirationTimestamp =
    new Date().getTime() + expirationInMinutes * 60 * 1000; // expiration time in milliseconds
  const data = { value, expiration: expirationTimestamp };

  localStorage.setItem(key, JSON.stringify(data));
};

export function getItemWithExpiration(key) {
  const data = JSON.parse(localStorage.getItem(key));

  if (!data) return null; // Item doesn't exist

  const currentTime = new Date().getTime();

  // If the current time is greater than the expiration time, remove the item and return null
  if (currentTime > data.expiration) {
    localStorage.removeItem(key);
    return null;
  }

  return data.value; // Item is still valid
}

export default localStorageUtil;
