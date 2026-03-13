const API = import.meta.env.VITE_API;

/**
 * @typedef {object} Set
 * @property {number} reps
 * @property {number} weight
 */

/**
 * Sends a new set to the API to be created.
 * A valid token is required.
 * @param {string} token
 * @param {Set} set
 * @throws {Error} if API response is not ok
 * @todo Add missing token guard (see updateSet for reference)
 */
export async function createSet(token, set) {
  const response = await fetch(API + "/sets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(set),
  });

  if (!response.ok) {
    const result = await response.json();
    throw Error(result.message);
  }
}

/**
 * Updates set that matches the routineID and activityID
 * @param {string} token
 * @param {number} routineId
 * @param {number} activityId
 * @param {Set} updates
 * @throws {Error} if token is missing
 * @throws {Error} if API response is not ok
 */
export async function updateSet(
  token,
  routineId,
  activityId,
  updates,
) {
  if (!token) {
    throw Error("You must be signed in to update a set.");
  }

  const response = await fetch(
    API + "/routines/" + routineId + "/activities/" + activityId,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(updates),
    },
  );

  if (!response.ok) {
    const result = await response.json();
    throw Error(result.message);
  }
}

/**
 * Requests the API to delete the set with the given ID.
 * A valid token is required.
 * @param {string} token
 * @param {number} id
 * @throws {Error} if API response is not ok
 * @todo Add missing token guard (see updateSet for reference)
 */
export async function deleteSet(token, id) {
  const response = await fetch(API + "/sets/" + id, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token },
  });

  if (!response.ok) {
    const result = await response.json();
    throw Error(result.message);
  }
}
