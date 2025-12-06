// Error handling utility functions

/**
 * Creates a standardized error response object
 * @param {string} message - User-friendly error message
 * @param {number} statusCode - HTTP status code
 * @param {Object} details - Additional error details (optional)
 * @returns {Object} Formatted error object
 */
export const createErrorResponse = (message, statusCode = 500, details = null) => {
  const response = { 
    success: false,
    message,
    statusCode
  };
  
  if (details && process.env.NODE_ENV === 'development') {
    response.details = details;
  }
  
  return response;
};

/**
 * Handles mongoose validation errors
 * @param {Error} error - Mongoose validation error
 * @returns {Object} Formatted validation error object
 */
export const handleValidationError = (error) => {
  const messages = Object.values(error.errors).map(err => err.message);
  return createErrorResponse(messages.join(', '), 400);
};

/**
 * Handles duplicate key errors from MongoDB
 * @param {Error} error - MongoDB duplicate key error
 * @returns {Object} Formatted duplicate key error object
 */
export const handleDuplicateKeyError = (error) => {
  const field = Object.keys(error.keyValue)[0];
  const value = error.keyValue[field];
  return createErrorResponse(`${field} '${value}' already exists`, 400);
};

/**
 * Global error handler for API requests
 * @param {Error} error - Error object
 * @param {Object} res - Express response object
 */
export const handleApiError = (error, res) => {
  console.error('API Error:', error);
  
  // Handle specific error types
  if (error.name === 'ValidationError') {
    return res.status(400).json(handleValidationError(error));
  }
  
  if (error.code === 11000) {
    return res.status(400).json(handleDuplicateKeyError(error));
  }
  
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json(createErrorResponse('Invalid token', 401));
  }
  
  if (error.name === 'TokenExpiredError') {
    return res.status(401).json(createErrorResponse('Token expired', 401));
  }
  
  // Default error response
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Server error';
  const details = process.env.NODE_ENV === 'development' ? error : null;
  
  return res.status(statusCode).json(createErrorResponse(message, statusCode, details));
};