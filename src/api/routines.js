const API = import.meta.env.VITE_API;

/** Fetches an array of routines from the API. */
export async function getRoutines() {
  try {
    const response = await fetch(API + "/routines");
    const result = await response.json();
    return result;
  } catch (e) {
    console.error(e);
    return [];
  }
}

