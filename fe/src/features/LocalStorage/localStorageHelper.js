export async function setLocalStorageData(key, value) {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error("Error setting data:", error);
  }
}

export async function getLocalStorageData(key) {
  try {
    const serializedValue = localStorage.getItem(key);
    return serializedValue ? JSON.parse(serializedValue) : null;
  } catch (error) {
    console.error("Error getting data:", error);
    return null;
  }
}

export async function deleteLocalStorageData(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Error deleting data:", error);
  }
}

export async function deleteAllLocalStorageData() {
  try {
    localStorage.clear();
  } catch (error) {
    console.error("Error deleting all cookies:", error);
  }
}