const NotFoundError = require('../../errors/not-found-error');

const validateSessionData = (req, requiredSessionFields) => {
  // Check for missing required fields in the session data.
  // It filters out all fields that are not present in the session.
  const missingFields = requiredSessionFields.filter(
    (field) => !req.session[field],
  );

  // If there are any missing fields, throw an error with a message listing them.
  if (missingFields.length > 0) {
    throw new NotFoundError(
      `Missing required session data: ${missingFields.join(', ')}`,
    );
  }

  // If no fields are missing, construct an object with the required session data.
  // It reduces the array of requiredSessionFields into an object, where each key is the field name,
  // and the value is the corresponding data from the session.
  return requiredSessionFields.reduce(
    (data, field) => ({ ...data, [field]: req.session[field] }),
    {},
  );
};

module.exports = validateSessionData;
