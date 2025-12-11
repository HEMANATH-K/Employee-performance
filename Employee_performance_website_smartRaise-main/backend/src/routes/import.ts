import express from 'express'
import multer from 'multer'
import path from 'path'
import xlsx from 'xlsx'
import csv from 'csv-parser'
import fs from 'fs'
import Employee from '../models/Employee'
import Performance from '../models/Performance'
import auth from '../middleware/auth'

const router = express.Router()

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'data/uploads'
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  },
})

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    if (ext === '.xlsx' || ext === '.xls' || ext === '.csv') {
      cb(null, true)
    } else {
      cb(new Error('Only Excel and CSV files are allowed'))
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
})

// Process Excel file
const processExcelFile = (filePath: string) => {
  const workbook = xlsx.readFile(filePath)
  const sheetName = workbook.SheetNames[0]
  const worksheet = workbook.Sheets[sheetName]
  return xlsx.utils.sheet_to_json(worksheet)
}

// Process CSV file
const processCsvFile = async (filePath: string): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const results: any[] = []
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error))
  })
}

// Import route
router.post('/', auth, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' })
  }

  try {
    const filePath = req.file.path
    const ext = path.extname(req.file.originalname).toLowerCase()
    
    let data: any[]
    if (ext === '.csv') {
      data = await processCsvFile(filePath)
    } else {
      data = processExcelFile(filePath)
    }

    let rowsImported = 0
    for (const row of data) {
      // Create or update employee
      const employee = await Employee.findOneAndUpdate(
        { name: row.name },
        {
          name: row.name,
          department: row.department,
          role: row.role,
          salary: row.salary,
        },
        { upsert: true, new: true }
      )

      // Create performance record
      if (row.kpiScore || row.attendance || row.peerReview) {
        await Performance.create({
          employeeId: employee._id,
          kpiScore: row.kpiScore || 0,
          attendance: row.attendance || 0,
          peerReview: row.peerReview || 0,
          date: new Date(),
        })
      }

      rowsImported++
    }

    // Clean up uploaded file
    fs.unlinkSync(filePath)

    res.json({
      message: 'File processed successfully',
      rowsImported,
    })
  } catch (error) {
    console.error('Import error:', error)
    res.status(500).json({ message: 'Error processing file' })
  }
})

// Download sample templates
router.get('/sample/:type', (req, res) => {
  const type = req.params.type
  const samplesDir = path.join(__dirname, '../../data/samples')
  
  let filename: string
  if (type === 'excel') {
    filename = 'employee_template.xlsx'
  } else if (type === 'csv') {
    filename = 'employee_template.csv'
  } else {
    return res.status(400).json({ message: 'Invalid template type' })
  }

  const filePath = path.join(samplesDir, filename)
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'Template file not found' })
  }

  res.download(filePath)
})

export default router 