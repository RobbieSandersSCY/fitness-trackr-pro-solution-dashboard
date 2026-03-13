const API = import.meta.env.VITE_API;

/**
 * @typedef {object} Activity
 * @property {string} [name]
 * @property {string} [description]
 */

/** Fetches an array of activities from the API. */
export async function getActivities() {
  try {
    const response = await fetch(API + "/activities");
    const result = await response.json();
    return result;
  } catch (e) {
    console.error(e);
    return [];
  }
}

/** Fetches an activity by ID from the API. */
export async function getActivity(id) {
  try {
    const response = await fetch(API + "/activities/" + id);
    const result = await response.json();
    return result;
  } catch (e) {
    console.error(e);
    return null;
  }
}

/**
 * Sends a new activity to the API to be created.
 * A valid token is required.
 * @param {string} token
 * @param {Activity} activity
 * @throws {Error} if token is missing
 * @throws {Error} if the API response is not ok
 */
export async function createActivity(token, activity) {
  if (!token) {
    throw Error("You must be signed in to create an activity.");
  }

  const response = await fetch(API + "/activities", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(activity),
  });

  if (!response.ok) {
    const result = await response.json();
    throw Error(result.message);
  }
}

/**
 * Updates an existing activity by ID. Requires a valid token.
 * @param {string} token
 * @param {number} id
 * @param {Activity} activity
 * @throws {Error} if token is missing
 * @throws {Error} if the API response is not ok
 */
export async function updateActivity(token, id, activity) {
  if (!token) {
    throw Error("You must be signed in to update an activity.");
  }

  const response = await fetch(API + "/activities/" + id, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(activity),
  });

  if (!response.ok) {
    const result = await response.json();
    throw Error(result.message);
  }
}

/**
 * Requests the API to delete the activity with the given ID.
 * A valid token is required.
 * @param {string} token
 * @param {number} id
 * @throws {Error} if token is missing
 * @throws {Error} if the API response is not ok
 */
export async function deleteActivity(token, id) {
  if (!token) {
    throw Error("You must be signed in to delete an activity.");
  }

  const response = await fetch(API + "/activities/" + id, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token },
  });

  if (!response.ok) {
    const result = await response.json();
    throw Error(result.message);
  }
}
