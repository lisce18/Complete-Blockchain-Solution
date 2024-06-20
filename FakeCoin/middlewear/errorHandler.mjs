import ErrorResponse from '../models/ErrorResponseModel.mjs';

const handleCastError = () =>
  new ErrorResponse('CastError', 'Resource not found.', 404);
const handleDuplicateFieldError = () =>
  new ErrorResponse(
    'DuplicateFieldError',
    'Duplicate field value entered',
    400
  );
const handleValidationError = (err) => {
  const message = Object.values(err.errors).map((value) => value.message);
  return new ErrorResponse(
    'ValidationError',
    `Information is missing: ${message}`,
    400
  );
};

const errorHandlers = {
  CastError: handleCastError,
  11000: handleDuplicateFieldError,
  ValidationError: handleValidationError,
};

export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  const handler = errorHandlers[err.name] || errorHandlers[err.code];
  if (handler) {
    error = handler(err);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    statusCode: error.statusCode || 500,
    error: error.message || 'Server Error',
  });
};
