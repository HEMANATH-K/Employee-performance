import { useState } from 'react'
import FileUpload from '../components/FileUpload'

export default function DataImport() {
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleFileSelect = async (file: File) => {
    setUploading(true)
    setUploadSuccess(null)
    setUploadError(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('http://localhost:5000/api/import', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      setUploadSuccess(`Successfully imported ${data.rowsImported} records`)
    } catch (error) {
      setUploadError('Failed to upload file. Please try again.')
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold leading-6 text-gray-900">Data Import</h1>
        <p className="mt-2 text-sm text-gray-700">
          Import employee data from Excel files (.xlsx, .xls) or CSV files.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-medium text-gray-900">Import Employee Data</h2>
            <p className="mt-1 text-sm text-gray-500">
              Upload your employee data file. The file should contain the following columns:
            </p>
            <ul className="mt-3 list-disc list-inside text-sm text-gray-500">
              <li>Employee Name</li>
              <li>Department</li>
              <li>Role</li>
              <li>Salary</li>
              <li>KPI Score</li>
              <li>Attendance</li>
              <li>Peer Review Score</li>
            </ul>
            <div className="mt-4">
              <FileUpload
                acceptedFileTypes=".xlsx,.xls,.csv"
                maxSize={5}
                onFileSelect={handleFileSelect}
              />
            </div>
          </div>

          {uploadSuccess && (
            <div className="rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">{uploadSuccess}</p>
                </div>
              </div>
            </div>
          )}

          {uploadError && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">{uploadError}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="text-lg font-medium text-gray-900">Sample Files</h2>
          <p className="mt-1 text-sm text-gray-500">
            Download these sample files to see the required format:
          </p>
          <div className="mt-4 space-y-3">
            <button
              type="button"
              className="flex items-center text-sm text-primary-600 hover:text-primary-900"
              onClick={() => {/* TODO: Add download handler */}}
            >
              <svg
                className="mr-2 h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Sample Excel Template
            </button>
            <button
              type="button"
              className="flex items-center text-sm text-primary-600 hover:text-primary-900"
              onClick={() => {/* TODO: Add download handler */}}
            >
              <svg
                className="mr-2 h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Sample CSV Template
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 