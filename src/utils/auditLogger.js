/**
 * Audit logging utility for tracking OCR processing methods
 */

// Log levels
const LOG_LEVELS = {
  INFO: 'INFO',
  WARNING: 'WARNING',
  ERROR: 'ERROR'
};

/**
 * Log OCR processing events
 * @param {string} filename - The filename being processed
 * @param {boolean} isHardcoded - Whether hardcoded values were used
 * @param {number} medicineCount - Number of medicines found
 * @param {string} [message] - Optional additional message
 */
export const logOcrProcessing = (filename, isHardcoded, medicineCount, message = '') => {
  const timestamp = new Date().toISOString();
  const processingType = isHardcoded ? 'HARDCODED' : 'NORMAL_OCR';
  
  const logEntry = {
    timestamp,
    level: LOG_LEVELS.INFO,
    filename,
    processingType,
    medicineCount,
    message
  };
  
  // Log to console for development/debugging
  console.log(`[OCR_AUDIT] ${timestamp} - ${processingType} - File: ${filename} - Medicines: ${medicineCount} ${message ? '- ' + message : ''}`);
  
  // In a production environment, you might want to:
  // 1. Send logs to a server endpoint
  // 2. Store logs in localStorage/IndexedDB
  // 3. Use a proper logging service
  
  // Example of storing in localStorage (limited by storage size)
  try {
    const existingLogs = JSON.parse(localStorage.getItem('ocr_audit_logs') || '[]');
    existingLogs.push(logEntry);
    
    // Keep only the last 100 logs to prevent storage issues
    const trimmedLogs = existingLogs.slice(-100);
    localStorage.setItem('ocr_audit_logs', JSON.stringify(trimmedLogs));
  } catch (error) {
    console.error('Failed to store audit log:', error);
  }
  
  return logEntry;
};

/**
 * Get all stored audit logs
 * @returns {Array} Array of log entries
 */
export const getAuditLogs = () => {
  try {
    return JSON.parse(localStorage.getItem('ocr_audit_logs') || '[]');
  } catch (error) {
    console.error('Failed to retrieve audit logs:', error);
    return [];
  }
};

/**
 * Clear all stored audit logs
 */
export const clearAuditLogs = () => {
  try {
    localStorage.removeItem('ocr_audit_logs');
  } catch (error) {
    console.error('Failed to clear audit logs:', error);
  }
};