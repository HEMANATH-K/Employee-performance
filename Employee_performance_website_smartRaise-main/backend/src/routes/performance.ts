import express, { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import Performance from '../models/Performance'
import auth from '../middleware/auth'

const router = express.Router()

// Get performance metrics for an employee
router.get('/:employeeId', auth, async (req: Request, res: Response) => {
  try {
    const performance = await Performance.find({ employeeId: req.params.employeeId })
    res.json(performance)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching performance metrics' })
  }
})

// Add performance metrics
router.post(
  '/',
  auth,
  [
    body('employeeId').notEmpty().withMessage('Employee ID is required'),
    body('kpiScore').isFloat({ min: 0, max: 100 }).withMessage('KPI score must be between 0 and 100'),
    body('attendance').isFloat({ min: 0, max: 100 }).withMessage('Attendance must be between 0 and 100'),
    body('peerReview').isFloat({ min: 0, max: 100 }).withMessage('Peer review must be between 0 and 100'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      const performance = new Performance(req.body)
      await performance.save()
      res.status(201).json(performance)
    } catch (error) {
      res.status(500).json({ message: 'Error adding performance metrics' })
    }
  }
)

// Predict raise
router.post(
  '/predict',
  auth,
  [
    body('kpiScore').isFloat({ min: 0, max: 100 }).withMessage('KPI score must be between 0 and 100'),
    body('attendance').isFloat({ min: 0, max: 100 }).withMessage('Attendance must be between 0 and 100'),
    body('peerReview').isFloat({ min: 0, max: 100 }).withMessage('Peer review must be between 0 and 100'),
    body('currentSalary').isNumeric().withMessage('Current salary must be a number'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      // TODO: Replace with actual ML model prediction
      const { kpiScore, attendance, peerReview, currentSalary } = req.body
      const performanceScore = (kpiScore * 0.5 + attendance * 0.3 + peerReview * 0.2) / 100
      const suggestedRaise = Math.round(currentSalary * performanceScore * 0.1)

      res.json({ suggestedRaise })
    } catch (error) {
      res.status(500).json({ message: 'Error predicting raise' })
    }
  }
)

// Get department performance summary
router.get('/department/:department', auth, async (req: Request, res: Response) => {
  try {
    const performances = await Performance.aggregate([
      {
        $lookup: {
          from: 'employees',
          localField: 'employeeId',
          foreignField: '_id',
          as: 'employee',
        },
      },
      {
        $match: {
          'employee.department': req.params.department,
        },
      },
      {
        $group: {
          _id: null,
          avgKpiScore: { $avg: '$kpiScore' },
          avgAttendance: { $avg: '$attendance' },
          avgPeerReview: { $avg: '$peerReview' },
          totalEmployees: { $sum: 1 },
        },
      },
    ])

    if (performances.length === 0) {
      return res.status(404).json({ message: 'No performance data found for this department' })
    }

    res.json(performances[0])
  } catch (error) {
    res.status(500).json({ message: 'Error fetching department performance summary' })
  }
})

export default router 