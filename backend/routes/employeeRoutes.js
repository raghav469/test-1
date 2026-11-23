const express = require('express');
const { body, param, validationResult } = require('express-validator');
const {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employeeController');

const router = express.Router();
const employeeFields = [
  'name',
  'email',
  'phone',
  'department',
  'designation',
  'joiningDate',
  'status',
];

function validateRequest(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Invalid request',
      errors: errors.array().map(({ path, msg }) => ({ field: path, message: msg })),
    });
  }

  next();
}

function validateEmployeeBody(requireAtLeastOneField) {
  return [
    body().custom((value) => {
      if (!value || typeof value !== 'object' || Array.isArray(value)) {
        throw new Error('Request body must be a JSON object');
      }

      const fields = Object.keys(value);
      const unknownFields = fields.filter((field) => !employeeFields.includes(field));
      if (unknownFields.length) {
        throw new Error(`Unknown field(s): ${unknownFields.join(', ')}`);
      }
      if (requireAtLeastOneField && fields.length === 0) {
        throw new Error('Provide at least one employee field to update');
      }

      return true;
    }),
    body('name').optional().isString().withMessage('Name must be a string').bail().trim().notEmpty().withMessage('Name is required'),
    body('email').optional().isString().withMessage('Email must be a string').bail().trim().isEmail().withMessage('Email must be valid'),
    body('phone').optional().isString().withMessage('Phone must be a string').bail().trim().notEmpty().withMessage('Phone is required'),
    body('department').optional().isString().withMessage('Department must be a string').bail().trim().notEmpty().withMessage('Department is required'),
    body('designation').optional().isString().withMessage('Designation must be a string').bail().trim().notEmpty().withMessage('Designation is required'),
    body('joiningDate').optional().isISO8601({ strict: true }).withMessage('Joining date must be a valid ISO 8601 date').bail().toDate(),
    body('status').optional().isIn(['active', 'inactive']).withMessage('Status must be active or inactive'),
    ...(requireAtLeastOneField
      ? []
      : employeeFields
          .filter((field) => field !== 'status')
          .map((field) =>
            body(field).exists().withMessage(`${field} is required`).bail(),
          )),
  ];
}

const validateId = [
  param('id').isMongoId().withMessage('Employee ID must be a valid MongoDB ID'),
];

router
  .route('/')
  .post(validateEmployeeBody(false), validateRequest, createEmployee)
  .get(getEmployees);

router
  .route('/:id')
  .get(validateId, validateRequest, getEmployeeById)
  .put(validateId, validateEmployeeBody(true), validateRequest, updateEmployee)
  .delete(validateId, validateRequest, deleteEmployee);

module.exports = router;
