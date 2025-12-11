import { useState } from 'react'
import { CloudArrowUpIcon } from '@heroicons/react/24/outline'

interface FileUploadProps {
  acceptedFileTypes?: string
  maxSize?: number // in MB
  onFileSelect: (file: File) => void
}

export default function FileUpload({
  acceptedFileTypes = '.xlsx,.xls,.csv',
  maxSize = 10, // 10MB default
  onFileSelect,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    setError(null)

    // Check file type
    const fileType = file.name.split('.').pop()?.toLowerCase()
    const acceptedTypes = acceptedFileTypes.split(',').map(type => 
      type.startsWith('.') ? type.substring(1) : type
    )
    
    if (!acceptedTypes.includes(fileType || '')) {
      setError(`Invalid file type. Please upload ${acceptedFileTypes} files only.`)
      return
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`)
      return
    }

    onFileSelect(file)
  }

  return (
    <div className="space-y-2">
      <div
        className={`
          relative flex flex-col items-center justify-center w-full h-64
          border-2 border-dashed rounded-lg
          ${dragActive 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-gray-300 bg-gray-50'
          }
          transition-colors duration-200 ease-in-out
          cursor-pointer
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept={acceptedFileTypes}
          onChange={handleChange}
        />

        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <CloudArrowUpIcon className="w-12 h-12 text-gray-400" />
          <p className="mb-2 text-sm text-gray-500">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">
            {acceptedFileTypes} (max. {maxSize}MB)
          </p>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
} 