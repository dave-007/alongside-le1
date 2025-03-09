'use client'
import React, { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewPresentation() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    videoUrl: '',
    videoType: 'none' as 'youtube' | 'upload' | 'none',
    githubUrl: ''
  })
  
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Reset video URL if video type changes
    if (name === 'videoType' && value !== 'youtube') {
      setFormData(prev => ({ ...prev, videoUrl: '' }))
    }
    
    // Reset file input if video type changes
    if (name === 'videoType' && value !== 'upload') {
      setVideoFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      
      // Validate file type
      const validTypes = ['video/mp4', 'video/webm', 'video/ogg']
      if (!validTypes.includes(file.type)) {
        setError('Invalid file type. Please upload MP4, WebM, or Ogg video.')
        setVideoFile(null)
        e.target.value = ''
        return
      }
      
      // Validate file size (max 100MB)
      const maxSize = 100 * 1024 * 1024 // 100MB in bytes
      if (file.size > maxSize) {
        setError('File is too large. Maximum size is 100MB.')
        setVideoFile(null)
        e.target.value = ''
        return
      }
      
      setVideoFile(file)
      setError(null)
    } else {
      setVideoFile(null)
    }
  }

  const uploadVideo = async (): Promise<string> => {
    if (!videoFile) return ''
    
    const formData = new FormData()
    formData.append('file', videoFile)
    
    try {
      // Track upload progress manually
      const xhr = new XMLHttpRequest()
      
      // Create a promise to handle the XHR request
      const uploadPromise = new Promise<string>((resolve, reject) => {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded * 100) / event.total)
            setUploadProgress(progress)
          }
        })
        
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const response = JSON.parse(xhr.responseText)
            resolve(response.fileName)
          } else {
            reject(new Error('Upload failed'))
          }
        }
        
        xhr.onerror = () => {
          reject(new Error('Upload failed'))
        }
      })
      
      // Open and send the request
      xhr.open('POST', '/api/upload')
      xhr.send(formData)
      
      return await uploadPromise
    } catch (err) {
      console.error('Error uploading video:', err)
      throw new Error('Failed to upload video')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.title.trim() || !formData.summary.trim()) {
      setError('Title and summary are required')
      return
    }
    
    if (formData.videoType === 'youtube' && !formData.videoUrl.trim()) {
      setError('YouTube URL is required when video type is YouTube')
      return
    }
    
    if (formData.videoType === 'upload' && !videoFile) {
      setError('Video file is required when video type is Upload')
      return
    }
    
    try {
      setLoading(true)
      setError(null)
      
      let videoFileName = ''
      let finalVideoUrl = formData.videoUrl
      
      // Upload video if needed
      if (formData.videoType === 'upload' && videoFile) {
        try {
          videoFileName = await uploadVideo()
          finalVideoUrl = `/uploads/videos/${videoFileName}`
        } catch (err) {
          setError('Failed to upload video. Please try again.')
          setLoading(false)
          return
        }
      }
      
      const presentationData = {
        ...formData,
        videoUrl: finalVideoUrl,
        videoFileName: videoFileName || undefined
      }
      
      const response = await fetch('/api/presentations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(presentationData)
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create presentation')
      }
      
      const presentation = await response.json()
      
      // Redirect to the new presentation
      router.push(`/presentations/${presentation.id}`)
    } catch (err) {
      console.error('Error creating presentation:', err)
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
      setUploadProgress(0)
    }
  }

  return (
    <main className="min-h-screen p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            ← Back to Presentations
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-6">Create New Presentation</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter presentation title"
              required
            />
          </div>
          
          <div>
            <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">
              Summary (Markdown) *
            </label>
            <textarea
              id="summary"
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              rows={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="# My Presentation Summary

Write your presentation summary using Markdown.

- Point 1
- Point 2
- Point 3"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              You can use Markdown to format your summary.
            </p>
          </div>
          
          <div>
            <label htmlFor="videoType" className="block text-sm font-medium text-gray-700 mb-1">
              Video Type
            </label>
            <select
              id="videoType"
              name="videoType"
              value={formData.videoType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="none">No Video</option>
              <option value="youtube">YouTube URL</option>
              <option value="upload">Upload Video</option>
            </select>
          </div>
          
          {formData.videoType === 'youtube' && (
            <div>
              <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-1">
                YouTube URL *
              </label>
              <input
                type="url"
                id="videoUrl"
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://youtube.com/watch?v=example"
                required={formData.videoType === 'youtube'}
              />
              <p className="mt-1 text-sm text-gray-500">
                Enter a valid YouTube URL
              </p>
            </div>
          )}
          
          {formData.videoType === 'upload' && (
            <div>
              <label htmlFor="videoFile" className="block text-sm font-medium text-gray-700 mb-1">
                Upload Video *
              </label>
              <input
                type="file"
                id="videoFile"
                name="videoFile"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="video/mp4,video/webm,video/ogg"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required={formData.videoType === 'upload'}
              />
              <p className="mt-1 text-sm text-gray-500">
                Supported formats: MP4, WebM, Ogg (max 100MB)
              </p>
              
              {videoFile && (
                <div className="mt-2">
                  <p className="text-sm text-gray-700">
                    Selected file: {videoFile.name} ({(videoFile.size / (1024 * 1024)).toFixed(2)} MB)
                  </p>
                </div>
              )}
              
              {loading && uploadProgress > 0 && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">
                    Uploading: {uploadProgress}%
                  </p>
                </div>
              )}
            </div>
          )}
          
          <div>
            <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700 mb-1">
              GitHub Repository URL
            </label>
            <input
              type="url"
              id="githubUrl"
              name="githubUrl"
              value={formData.githubUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://github.com/username/repository"
            />
          </div>
          
          <div className="flex justify-end space-x-4">
            <Link
              href="/"
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Presentation'}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
} 