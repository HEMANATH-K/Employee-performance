import { useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Department Performance Overview',
    },
  },
}

const labels = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance']
const data = {
  labels,
  datasets: [
    {
      label: 'Average KPI Score',
      data: [85, 78, 82, 75, 80],
      backgroundColor: 'rgba(14, 165, 233, 0.5)',
    },
    {
      label: 'Average Attendance',
      data: [95, 88, 92, 90, 93],
      backgroundColor: 'rgba(3, 105, 161, 0.5)',
    },
  ],
}

export default function Dashboard() {
  const [timeframe] = useState('Last Month')

  return (
    <div className="h-full p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="section-title mb-2">Performance Dashboard</h1>
          <p className="text-gray-600">A comprehensive overview of employee performance metrics across departments.</p>
        </div>
        <button className="dropdown-button">
          {timeframe}
          <svg className="ml-2 -mr-1 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="stat-card">
          <div className="stat-label">Total Employees</div>
          <div className="stat-value">248</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Average KPI Score</div>
          <div className="stat-value">82%</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Average Attendance</div>
          <div className="stat-value">91%</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending Reviews</div>
          <div className="stat-value">12</div>
        </div>
      </div>

      <div className="chart-container mb-6">
        <div className="h-[400px]">
          <Bar options={options} data={data} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="stat-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
          <div className="space-y-4">
            {[
              { name: 'John Doe', department: 'Engineering', kpi: 95 },
              { name: 'Jane Smith', department: 'Sales', kpi: 92 },
              { name: 'Mike Johnson', department: 'Marketing', kpi: 90 },
            ].map((person) => (
              <div key={person.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{person.name}</p>
                  <p className="text-sm text-gray-500">{person.department}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">KPI Score:</span>
                  <span className="text-sm font-semibold text-indigo-600">{person.kpi}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="stat-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {[
              { action: 'Performance Review', employee: 'Sarah Wilson', date: '2 hours ago' },
              { action: 'KPI Update', employee: 'Tom Brown', date: '4 hours ago' },
              { action: 'Attendance Report', employee: 'Lisa Anderson', date: '1 day ago' },
            ].map((activity) => (
              <div key={activity.action + activity.employee} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.employee}</p>
                </div>
                <div className="text-sm text-gray-500">{activity.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 