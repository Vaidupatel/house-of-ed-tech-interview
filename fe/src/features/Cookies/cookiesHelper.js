import Cookies from "js-cookie";

export async function setLocalStoreData(key, value) {
  try {
    const serializedValue = await JSON.stringify(value);
    await Cookies.set(key, serializedValue);
  } catch (error) {
    console.error("Error setting data:", error);
  }
}

export async function getLocalStoreData(key) {
  try {
    const serializedValue = await Cookies.get(key);
    return serializedValue ? JSON.parse(serializedValue) : null;
  } catch (error) {
    console.error("Error getting data:", error);
    return null;
  }
}

export async function deleteLocalStoreData(key) {
  try {
    await Cookies.remove(key);
  } catch (error) {
    console.error("Error deleting data:", error);
  }
}

export async function deleteAllLocalStoreData() {
  try {
    const cookies = Object.keys(await Cookies.get());
    cookies.forEach((cookie) => Cookies.remove(cookie));
  } catch (error) {
    console.error("Error deleting all cookies:", error);
  }
}
