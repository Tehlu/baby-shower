import { useState } from 'react'
import couplePhoto from './assets/jayliParent2.jpg'

function App() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  // Use environment variable for API URL, fallback to localhost for development
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      console.log('Uploading file:', file)
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - let the browser set it automatically for FormData
        credentials: 'include',
      })
      console.log('Response:', response)
      
      if (response.ok) {
        setUploadSuccess(true)
        setTimeout(() => setUploadSuccess(false), 3000)
      } else {
        const errorData = await response.json()
        console.error('Upload failed:', errorData)
        alert(`Upload failed: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Upload failed: Network error')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-forest bg-cover bg-center bg-no-repeat relative">
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      
      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        {/* Couple's photo */}
        <div className="w-64 h-64 md:w-96 md:h-96 rounded-full border-4 border-magical-gold overflow-hidden mb-8">
          <img 
            src={couplePhoto} 
            alt="Expecting parents" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Welcome text */}
        <h1 className="text-3xl md:text-4xl font-magical text-white text-center mb-8">
          Share a Memory for the Parents-to-Be
        </h1>

        {/* Upload button */}
        <label className="relative cursor-pointer">
          <input
            type="file"
            className="hidden"
            accept="image/*,video/*"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
          <div className="px-6 py-3 bg-magical-pink bg-opacity-80 hover:bg-opacity-100 text-white rounded-full font-body transition-all duration-300 transform hover:scale-105">
            {isUploading ? 'Uploading...' : 'Upload Your Photo'}
          </div>
        </label>

        {/* Success message */}
        {uploadSuccess && (
          <div className="mt-4 text-white font-body bg-magical-green bg-opacity-80 px-4 py-2 rounded-full">
            Thank you for sharing your memory!
          </div>
        )}
      </div>

      {/* Copyright claim */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
        <p className="text-white text-sm font-body bg-black bg-opacity-50 px-3 py-1 rounded-full">
          © 2025 Beza Mogese - Freelance Developer
        </p>
      </div>
    </div>
  )
}

export default App
