import express from 'express'
import { body, validationResult } from 'express-validator'
import Employee from '../models/Employee'
import auth from '../middleware/auth'

const router = express.Router()

// Get all employees
router.get('/', auth, async (req, res) => {
  try {
    const employees = await Employee.find()
    res.json(employees)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employees' })
  }
})

// Get employee by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' })
    }
    res.json(employee)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employee' })
  }
})

// Create employee
router.post(
  '/',
  auth,
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('department').notEmpty().withMessage('Department is required'),
    body('role').notEmpty().withMessage('Role is required'),
    body('salary').isNumeric().withMessage('Salary must be a number'),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      const employee = new Employee(req.body)
      await employee.save()
      res.status(201).json(employee)
    } catch (error) {
      res.status(500).json({ message: 'Error creating employee' })
    }
  }
)

// Update employee
router.put(
  '/:id',
  auth,
  [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('department').optional().notEmpty().withMessage('Department cannot be empty'),
    body('role').optional().notEmpty().withMessage('Role cannot be empty'),
    body('salary').optional().isNumeric().withMessage('Salary must be a number'),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      const employee = await Employee.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      )
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' })
      }
      res.json(employee)
    } catch (error) {
      res.status(500).json({ message: 'Error updating employee' })
    }
  }
)

// Delete employee
router.delete('/:id', auth, async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id)
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' })
    }
    res.json({ message: 'Employee deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Error deleting employee' })
  }
})

export default router 