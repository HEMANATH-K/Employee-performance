import { useState } from 'react'

interface PerformanceData {
  employeeId: string
  kpiScore: number
  attendance: number
  peerReview: number
  currentSalary: number
}

const initialData: PerformanceData = {
  employeeId: '',
  kpiScore: 0,
  attendance: 0,
  peerReview: 0,
  currentSalary: 0,
}

export default function Performance() {
  const [formData, setFormData] = useState<PerformanceData>(initialData)
  const [prediction, setPrediction] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setPrediction(7500) // Mock prediction
    } catch (error) {
      console.error('Error predicting raise:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold leading-6 text-gray-900">Performance Analysis</h1>
        <p className="mt-2 text-sm text-gray-700">
          Enter employee performance metrics to predict their recommended salary raise.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="employeeId" className="block text-sm font-medium leading-6 text-gray-900">
              Employee ID
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="employeeId"
                id="employeeId"
                className="input-field"
                value={formData.employeeId}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="kpiScore" className="block text-sm font-medium leading-6 text-gray-900">
              KPI Score (0-100)
            </label>
            <div className="mt-2">
              <input
                type="number"
                name="kpiScore"
                id="kpiScore"
                min="0"
                max="100"
                className="input-field"
                value={formData.kpiScore}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="attendance" className="block text-sm font-medium leading-6 text-gray-900">
              Attendance % (0-100)
            </label>
            <div className="mt-2">
              <input
                type="number"
                name="attendance"
                id="attendance"
                min="0"
                max="100"
                className="input-field"
                value={formData.attendance}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="peerReview" className="block text-sm font-medium leading-6 text-gray-900">
              Peer Review Score (0-100)
            </label>
            <div className="mt-2">
              <input
                type="number"
                name="peerReview"
                id="peerReview"
                min="0"
                max="100"
                className="input-field"
                value={formData.peerReview}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="currentSalary" className="block text-sm font-medium leading-6 text-gray-900">
              Current Salary ($)
            </label>
            <div className="mt-2">
              <input
                type="number"
                name="currentSalary"
                id="currentSalary"
                min="0"
                className="input-field"
                value={formData.currentSalary}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="btn-primary w-full sm:w-auto"
            disabled={loading}
          >
            {loading ? 'Calculating...' : 'Predict Raise'}
          </button>
        </div>
      </form>

      {prediction !== null && (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Prediction Complete</h3>
              <div className="mt-2 text-sm text-green-700">
                <p>Recommended Raise: ${prediction.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-md bg-blue-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">About the Prediction Model</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                Our ML model takes into account multiple factors including KPI scores, attendance records,
                peer reviews, and current salary to suggest an appropriate raise amount. The prediction
                is based on historical data and industry standards.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 