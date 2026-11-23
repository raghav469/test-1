const Employee = require('../models/Employee');

async function createEmployee(req, res) {
  const employee = await Employee.create(req.body);
  res.status(201).json({ success: true, data: employee });
}

async function getEmployees(req, res) {
  const employees = await Employee.find().sort({ joiningDate: -1 });
  res.status(200).json({ success: true, data: employees });
}

async function getEmployeeById(req, res) {
  const employee = await Employee.findById(req.params.id);

  if (!employee) {
    return res.status(404).json({ success: false, message: 'Employee not found' });
  }

  res.status(200).json({ success: true, data: employee });
}

async function updateEmployee(req, res) {
  const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: 'after',
    runValidators: true,
  });

  if (!employee) {
    return res.status(404).json({ success: false, message: 'Employee not found' });
  }

  res.status(200).json({ success: true, data: employee });
}

async function deleteEmployee(req, res) {
  const employee = await Employee.findByIdAndDelete(req.params.id);

  if (!employee) {
    return res.status(404).json({ success: false, message: 'Employee not found' });
  }

  res.status(200).json({ success: true, data: employee });
}

module.exports = {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};