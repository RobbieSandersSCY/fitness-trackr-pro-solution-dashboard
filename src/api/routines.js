const API = import.meta.env.VITE_API;

/**
 * @typedef {object} Routine
 * @property {string} name
 * @property {string} [goal]
 */

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

/** Fetches a routine by ID from the API. */
export async function getRoutine(id) {
  try {
    const response = await fetch(API + "/routines/" + id);
    const result = await response.json();
    return result;
  } catch (e) {
    console.error(e);
    return null;
  }
}

/**
 * Sends a new routine to the API to be created.
 * A valid token is required.
 * @param {string} token
 * @param {Routine} routine
 * @throws {Error} if token is missing
 * @throws {Error} if API response is not ok
 */
export async function createRoutine(token, routine) {
  const response = await fetch(API + "/routines", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(routine),
  });

  if (!response.ok) {
    const result = await response.json();
    throw Error(result.message);
  }
}

/**
 * Updates a routine with the matching ID. Requires a valid token.
 * @param {string} token
 * @param {number} id
 * @param {Routine} routine
 * @throws {Error} if token is missing
 * @throws {Error} if API response is not ok
 */
export async function updateRoutine(token, id, routine) {
  if (!token) {
    throw Error("You must be signed in to update a routine.");
  }

  const response = await fetch(API + "/routines/" + id, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(routine),
  });

  if (!response.ok) {
    const result = await response.json();
    throw Error(result.message);
  }
}

/**
 * Requests the API to delete the routine with the given ID.
 * A valid token is required.
 * @param {string} token
 * @param {number} id
 * @throws {Error} if API response is not ok
 * @todo Add missing token guard (see createRoutine/updateRoutine for reference)
 */
export async function deleteRoutine(token, id) {
  const response = await fetch(API + "/routines/" + id, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token },
  });

  if (!response.ok) {
    const result = await response.json();
    throw Error(result.message);
  }
}
