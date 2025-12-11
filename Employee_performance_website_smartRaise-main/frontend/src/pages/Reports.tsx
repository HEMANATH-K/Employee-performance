import { useState } from 'react'
import {
  DocumentArrowDownIcon,
  DocumentChartBarIcon,
  UserGroupIcon,
  ChartPieIcon,
} from '@heroicons/react/24/outline'

const reports = [
  {
    id: 1,
    name: 'Employee Performance Summary',
    description: 'Detailed performance metrics for all employees',
    icon: UserGroupIcon,
  },
  {
    id: 2,
    name: 'Department Analytics',
    description: 'Performance analysis by department',
    icon: ChartPieIcon,
  },
  {
    id: 3,
    name: 'Salary Distribution',
    description: 'Current salary ranges and raise recommendations',
    icon: DocumentChartBarIcon,
  },
  {
    id: 4,
    name: 'Attendance Report',
    description: 'Employee attendance and leave records',
    icon: DocumentArrowDownIcon,
  },
]

export default function Reports() {
  const [selectedFormat, setSelectedFormat] = useState('pdf')
  const [selectedDateRange, setSelectedDateRange] = useState('month')
  const [loading, setLoading] = useState<number | null>(null)

  const handleDownload = async (reportId: number) => {
    setLoading(reportId)
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      // Mock download
      console.log(`Downloading report ${reportId} in ${selectedFormat} format`)
    } catch (error) {
      console.error('Error downloading report:', error)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold leading-6 text-gray-900">Reports</h1>
        <p className="mt-2 text-sm text-gray-700">
          Generate and download various reports about employee performance and analytics.
        </p>
      </div>

      <div className="sm:flex space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="sm:w-48">
          <label htmlFor="format" className="block text-sm font-medium text-gray-700">
            Format
          </label>
          <select
            id="format"
            name="format"
            className="input-field mt-1"
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
          >
            <option value="pdf">PDF</option>
            <option value="excel">Excel</option>
            <option value="csv">CSV</option>
          </select>
        </div>

        <div className="sm:w-48">
          <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700">
            Date Range
          </label>
          <select
            id="dateRange"
            name="dateRange"
            className="input-field mt-1"
            value={selectedDateRange}
            onChange={(e) => setSelectedDateRange(e.target.value)}
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {reports.map((report) => (
          <div
            key={report.id}
            className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-primary-500"
          >
            <div className="flex-shrink-0">
              <report.icon className="h-10 w-10 text-primary-600" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="focus:outline-none">
                <p className="text-sm font-medium text-gray-900">{report.name}</p>
                <p className="text-sm text-gray-500">{report.description}</p>
              </div>
            </div>
            <div>
              <button
                type="button"
                className="btn-primary"
                onClick={() => handleDownload(report.id)}
                disabled={loading === report.id}
              >
                {loading === report.id ? 'Downloading...' : 'Download'}
              </button>
            </div>
          </div>
        ))}
      </div>

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
            <h3 className="text-sm font-medium text-blue-800">About Reports</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                Reports are generated based on the selected date range and include detailed analytics
                about employee performance, attendance, and salary information. You can download them
                in various formats for your records.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 