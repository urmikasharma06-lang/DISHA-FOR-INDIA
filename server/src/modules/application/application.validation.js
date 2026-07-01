const ValidationError = require('../../utils/errors/ValidationError');
const { APPLICATION_STATUS } = require('./application.constants');

const validateApplyToProgram = (req, res, next) => {
  const { programId, answers, emergencyContactName, emergencyContactPhone, medicalConditions, backgroundCheckConsent, codeOfConductAgreement, mediaConsent, termsAccepted, privacyAccepted } = req.body;
  const errors = [];

  if (!programId || typeof programId !== 'string' || programId.trim() === '') {
    errors.push({ field: 'programId', message: 'Program ID is required' });
  }

  // Required agreement fields must be true
  if (codeOfConductAgreement !== true) {
    errors.push({ field: 'codeOfConductAgreement', message: 'Code of Conduct must be accepted' });
  }
  if (termsAccepted !== true) {
    errors.push({ field: 'termsAccepted', message: 'Terms must be accepted' });
  }
  if (privacyAccepted !== true) {
    errors.push({ field: 'privacyAccepted', message: 'Privacy policy must be accepted' });
  }


  if (answers !== undefined) {
    if (typeof answers !== 'object' || answers === null || Array.isArray(answers)) {
      errors.push({ field: 'answers', message: 'Answers must be an object' });
    }
  }

  if (errors.length > 0) {
    return next(new ValidationError('Application validation failed', errors));
  }

  return next();
};

const validateWithdrawApplication = (req, res, next) => {
  const { id } = req.params;
  const errors = [];

  if (!id || id.trim() === '') {
    errors.push({ field: 'id', message: 'Application ID is required' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Application validation failed', errors));
  }

  return next();
};

const validateGetApplication = (req, res, next) => {
  const { id } = req.params;
  const errors = [];

  if (!id || id.trim() === '') {
    errors.push({ field: 'id', message: 'Application ID is required' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Application validation failed', errors));
  }

  return next();
};

const validateMyApplications = (req, res, next) => {
  const { page, limit, sortBy, sortOrder, status } = req.query;
  const errors = [];

  if (page !== undefined) {
    const pageNum = parseInt(page, 10);
    if (isNaN(pageNum) || pageNum < 1) {
      errors.push({ field: 'page', message: 'Page must be a positive integer' });
    }
  }

  if (limit !== undefined) {
    const limitNum = parseInt(limit, 10);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      errors.push({ field: 'limit', message: 'Limit must be between 1 and 100' });
    }
  }

  if (status !== undefined && !Object.values(APPLICATION_STATUS).includes(status)) {
    errors.push({ field: 'status', message: 'Invalid status value' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Validation failed', errors));
  }

  return next();
};

const validateMyPrograms = (req, res, next) => {
  const { page, limit } = req.query;
  const errors = [];

  if (page !== undefined) {
    const pageNum = parseInt(page, 10);
    if (isNaN(pageNum) || pageNum < 1) {
      errors.push({ field: 'page', message: 'Page must be a positive integer' });
    }
  }

  if (limit !== undefined) {
    const limitNum = parseInt(limit, 10);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      errors.push({ field: 'limit', message: 'Limit must be between 1 and 100' });
    }
  }

  if (errors.length > 0) {
    return next(new ValidationError('Validation failed', errors));
  }

  return next();
};

const validateAdminApplications = (req, res, next) => {
  const { page, limit, status, program, user } = req.query;
  const errors = [];

  if (page !== undefined) {
    const pageNum = parseInt(page, 10);
    if (isNaN(pageNum) || pageNum < 1) {
      errors.push({ field: 'page', message: 'Page must be a positive integer' });
    }
  }

  if (limit !== undefined) {
    const limitNum = parseInt(limit, 10);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      errors.push({ field: 'limit', message: 'Limit must be between 1 and 100' });
    }
  }

  if (status !== undefined && !Object.values(APPLICATION_STATUS).includes(status)) {
    errors.push({ field: 'status', message: 'Invalid status value' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Validation failed', errors));
  }

  return next();
};

const validateBulkUpdate = (req, res, next) => {
  const { ids, status } = req.body;
  const errors = [];

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    errors.push({ field: 'ids', message: 'Application IDs array is required' });
  }

  if (!status || !Object.values(APPLICATION_STATUS).includes(status)) {
    errors.push({ field: 'status', message: 'Valid status is required' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Validation failed', errors));
  }

  return next();
};

module.exports = {
  validateApplyToProgram,
  validateWithdrawApplication,
  validateGetApplication,
  validateMyApplications,
  validateMyPrograms,
  validateAdminApplications,
  validateBulkUpdate,
};
