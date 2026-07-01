const applicationRepository = require('./application.repository');
const { Parser } = require('json2csv');
const ExcelJS = require('exceljs');
const storageService = require('../../services/storage.service');
const programRepository = require('../program/program.repository');
const { generateApplicationId } = require('./application.utils');
const { APPLICATION_STATUS, PAGINATION } = require('./application.constants');
const { PROGRAM_STATUS } = require('../program/program.constants');
const NotFoundError = require('../../utils/errors/NotFoundError');
const ValidationError = require('../../utils/errors/ValidationError');
const ConflictError = require('../../utils/errors/ConflictError');

class ApplicationService {
  async applyToProgram(userId, programId, answers, files) {
    const program = await programRepository.findById(programId);

    if (!program) {
      throw new NotFoundError('Program not found');
    }

    if (program.isDeleted) {
      throw new NotFoundError('Program not found');
    }

    if (program.status !== PROGRAM_STATUS.PUBLISHED) {
      throw new ValidationError('Only published programs accept applications');
    }

    if (program.registrationDeadline && new Date() > new Date(program.registrationDeadline)) {
      throw new ValidationError('Registration deadline has passed');
    }

    const existingApplication = await applicationRepository.findExistingApplication(
      userId,
      programId
    );
    if (existingApplication) {
      throw new ConflictError('You have already applied to this program');
    }

    let documentMeta = [];
    if (files && files.length > 0) {
      // Process each uploaded file
      documentMeta = await Promise.all(
        files.map(async (file) => {
          // storageService.uploadFile expects an object with buffer, originalname, mimetype, etc.
          const uploadResult = await storageService.uploadFile(file);
          return {
            url: uploadResult.url,
            key: uploadResult.key,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
          };
        })
      );
    }

    const application = await applicationRepository.create({
      applicationId: await generateApplicationId(),
      user: userId,
      program: programId,
      answers: answers || {},
      documents: documentMeta,
      status: APPLICATION_STATUS.APPLIED,
      appliedAt: new Date(),
      joinedAt: new Date(),
    });

    return { application };
  }

  async withdrawApplication(userId, applicationId) {
    const application = await applicationRepository.findById(applicationId);

    if (!application) {
      throw new NotFoundError('Application not found');
    }

    if (
      application.user._id.toString() !== userId.toString() &&
      application.user.toString() !== userId
    ) {
      throw new ValidationError('You can only withdraw your own application');
    }

    if (
      application.status === APPLICATION_STATUS.WITHDRAWN ||
      application.status === APPLICATION_STATUS.COMPLETED ||
      application.status === APPLICATION_STATUS.CANCELLED
    ) {
      throw new ValidationError('Application cannot be withdrawn');
    }

    if (application.program.startDate) {
      const programStart = new Date(application.program.startDate);
      const now = new Date();
      const hoursRemaining = (programStart - now) / (1000 * 60 * 60);
      if (hoursRemaining < 24) {
        throw new ValidationError('Cannot withdraw less than 24 hours before program start');
      }
    }

    const withdrawnApplication = await applicationRepository.withdraw(applicationId, userId);

    return { application: withdrawnApplication };
  }

  async getApplication(userId, applicationId, userRole) {
    const application = await applicationRepository.findById(applicationId);

    if (!application) {
      throw new NotFoundError('Application not found');
    }

    if (userRole !== 'admin' && userRole !== 'superadmin' && userRole !== 'coordinator') {
      if (
        application.user._id.toString() !== userId.toString() &&
        application.user.toString() !== userId
      ) {
        throw new NotFoundError('Application not found');
      }
    }

    return { application };
  }

  async getMyApplications(userId, queryParams) {
    const page = Math.max(1, parseInt(queryParams.page, 10) || PAGINATION.DEFAULT_PAGE);
    const limit = Math.min(
      Math.max(1, parseInt(queryParams.limit, 10) || PAGINATION.DEFAULT_LIMIT),
      PAGINATION.MAX_LIMIT
    );

    const result = await applicationRepository.findMyApplications(userId, {
      ...queryParams,
      page,
      limit,
    });

    const totalPages = Math.ceil(result.total / limit);

    return {
      applications: result.applications,
      pagination: {
        total: result.total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async getMyPrograms(userId, queryParams) {
    const page = Math.max(1, parseInt(queryParams.page, 10) || PAGINATION.DEFAULT_PAGE);
    const limit = Math.min(
      Math.max(1, parseInt(queryParams.limit, 10) || PAGINATION.DEFAULT_LIMIT),
      PAGINATION.MAX_LIMIT
    );

    const result = await applicationRepository.findMyPrograms(userId, {
      ...queryParams,
      page,
      limit,
    });

    const programs = result.applications.map((app) => app.program);
    const totalPages = Math.ceil(result.total / limit);

    return {
      programs,
      pagination: {
        total: result.total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async getAdminApplications(queryParams) {
    const { page, limit, sortBy, sortOrder, status, program, user, city, state } = queryParams;

    const pageNum = Math.max(1, parseInt(page, 10) || PAGINATION.DEFAULT_PAGE);
    const limitNum = Math.min(
      Math.max(1, parseInt(limit, 10) || PAGINATION.DEFAULT_LIMIT),
      PAGINATION.MAX_LIMIT
    );

    const filters = {};

    if (status) filters.status = status;
    if (program) filters.program = program;
    if (user) filters.user = user;
    if (city) filters['program.city'] = new RegExp(city, 'i');
    if (state) filters['program.state'] = new RegExp(state, 'i');

    const result = await applicationRepository.findAdminApplications(filters, {
      page: pageNum,
      limit: limitNum,
      sortBy: sortBy || 'createdAt',
      sortOrder: sortOrder || 'desc',
    });

    const totalPages = Math.ceil(result.total / limitNum);

    return {
      applications: result.applications,
      pagination: {
        total: result.total,
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPreviousPage: pageNum > 1,
      },
    };
  }

  async bulkUpdateApplications(userId, ids, newStatus) {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new ValidationError('Invalid application IDs');
    }

    if (!Object.values(APPLICATION_STATUS).includes(newStatus)) {
      throw new ValidationError('Invalid status value');
    }

    await applicationRepository.bulkUpdate(ids, { status: newStatus });

    return { updatedCount: ids.length };
  }

  async getApplicationStatistics() {
    return applicationRepository.getStatistics();
  }
}

  // Export applications as CSV or Excel
  async exportApplications(filters, format = 'csv') {
    // Reuse admin list logic for filtering
    const result = await applicationRepository.findAdminApplications(filters, {
      page: 1,
      limit: 1000, // large limit for export; could be adjusted
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
    const applications = result.applications;
    // Flatten data for export
    const rows = applications.map((app) => ({
      applicationId: app.applicationId,
      volunteerName: app.user ? `${app.user.firstName} ${app.user.lastName}` : '',
      programName: app.program ? app.program.title : '',
      status: app.status,
      appliedAt: app.appliedAt,
      joinedAt: app.joinedAt,
    }));

    if (format === 'csv') {
      const parser = new Parser();
      const csv = parser.parse(rows);
      return { data: csv, contentType: 'text/csv', extension: 'csv' };
    }
    // Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Applications');
    worksheet.columns = [
      { header: 'Application ID', key: 'applicationId', width: 20 },
      { header: 'Volunteer Name', key: 'volunteerName', width: 30 },
      { header: 'Program Name', key: 'programName', width: 30 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Applied At', key: 'appliedAt', width: 20 },
      { header: 'Joined At', key: 'joinedAt', width: 20 },
    ];
    worksheet.addRows(rows);
    const buffer = await workbook.xlsx.writeBuffer();
    return { data: buffer, contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', extension: 'xlsx' };
  }
};
module.exports = new ApplicationService();
