'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import ReactMarkdown from 'react-markdown'

interface Presentation {
  id: string
  title: string
  summary: string
  videoUrl: string
  videoType: 'youtube' | 'upload' | 'none'
  videoFileName?: string
  githubUrl: string
  authorId: string
  authorName: string
  createdAt: string
  updatedAt: string
  comments: Comment[]
}

interface Comment {
  id: string
  content: string
  userId: string
  userName: string
  createdAt: string
}

export default function PresentationPage() {
  const params = useParams()
  const id = params.id as string
  
  const [presentation, setPresentation] = useState<Presentation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [commentContent, setCommentContent] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const [requestFormVisible, setRequestFormVisible] = useState(false)
  const [requestForm, setRequestForm] = useState({
    requestType: 'course',
    description: '',
    offerAmount: 0
  })
  const [submittingRequest, setSubmittingRequest] = useState(false)

  useEffect(() => {
    const fetchPresentation = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/presentations/${id}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Presentation not found')
          }
          throw new Error('Failed to fetch presentation')
        }
        
        const data = await response.json()
        
        // If videoType is not specified, determine it from the URL
        if (!data.videoType) {
          if (!data.videoUrl) {
            data.videoType = 'none'
          } else if (data.videoUrl.includes('youtube.com') || data.videoUrl.includes('youtu.be')) {
            data.videoType = 'youtube'
          } else if (data.videoUrl.startsWith('/uploads/')) {
            data.videoType = 'upload'
          } else {
            data.videoType = 'none'
          }
        }
        
        setPresentation(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchPresentation()
  }, [id])

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!commentContent.trim()) return
    
    try {
      setSubmittingComment(true)
      
      const response = await fetch(`/api/presentations/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: commentContent })
      })
      
      if (!response.ok) {
        throw new Error('Failed to add comment')
      }
      
      const newComment = await response.json()
      
      // Update the presentation with the new comment
      setPresentation(prev => {
        if (!prev) return prev
        return {
          ...prev,
          comments: [...prev.comments, newComment]
        }
      })
      
      // Clear the comment form
      setCommentContent('')
    } catch (err) {
      console.error('Error adding comment:', err)
      alert('Failed to add comment. Please try again.')
    } finally {
      setSubmittingComment(false)
    }
  }

  const handleRequestChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setRequestForm(prev => ({
      ...prev,
      [name]: name === 'offerAmount' ? parseFloat(value) || 0 : value
    }))
  }

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!requestForm.description.trim()) return
    
    try {
      setSubmittingRequest(true)
      
      const response = await fetch(`/api/presentations/${id}/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestForm)
      })
      
      if (!response.ok) {
        throw new Error('Failed to submit request')
      }
      
      // Hide the request form and show success message
      setRequestFormVisible(false)
      alert('Your request has been submitted successfully!')
      
      // Reset the form
      setRequestForm({
        requestType: 'course',
        description: '',
        offerAmount: 0
      })
    } catch (err) {
      console.error('Error submitting request:', err)
      alert('Failed to submit request. Please try again.')
    } finally {
      setSubmittingRequest(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen p-6 md:p-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center my-12">
            <p className="text-lg">Loading presentation...</p>
          </div>
        </div>
      </main>
    )
  }

  if (error || !presentation) {
    return (
      <main className="min-h-screen p-6 md:p-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              ← Back to Presentations
            </Link>
          </div>
          
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-md my-6">
            <h2 className="text-xl font-semibold mb-2">Error</h2>
            <p>{error || 'Failed to load presentation'}</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            ← Back to Presentations
          </Link>
        </div>
        
        <article className="mb-12">
          <header className="mb-8">
            <h1 className="text-3xl font-bold mb-4">{presentation.title}</h1>
            <div className="flex items-center text-gray-600 mb-6">
              <span>By {presentation.authorName}</span>
              <span className="mx-2">•</span>
              <span>{new Date(presentation.createdAt).toLocaleDateString()}</span>
            </div>
            
            <div className="flex flex-wrap gap-4">
              {presentation.githubUrl && (
                <a 
                  href={presentation.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  GitHub Repository
                </a>
              )}
            </div>
          </header>
          
          {presentation.videoType !== 'none' && presentation.videoUrl && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Video Presentation</h2>
              <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
                {presentation.videoType === 'youtube' ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${getYouTubeVideoId(presentation.videoUrl)}`}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                ) : presentation.videoType === 'upload' ? (
                  <video 
                    controls 
                    className="w-full h-full"
                    poster="/placeholder-video.jpg"
                  >
                    <source src={presentation.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <a 
                    href={presentation.videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center h-full text-blue-600 hover:text-blue-800"
                  >
                    View Video
                  </a>
                )}
              </div>
            </div>
          )}
          
          <div className="prose max-w-none">
            <ReactMarkdown>{presentation.summary}</ReactMarkdown>
          </div>
        </article>
        
        <div className="border-t border-gray-200 pt-8 mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Comments</h2>
            <button
              onClick={() => setRequestFormVisible(!requestFormVisible)}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
            >
              Request Additional Content
            </button>
          </div>
          
          {requestFormVisible && (
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h3 className="text-lg font-semibold mb-4">Request Additional Content</h3>
              <form onSubmit={handleRequestSubmit} className="space-y-4">
                <div>
                  <label htmlFor="requestType" className="block text-sm font-medium text-gray-700 mb-1">
                    Request Type
                  </label>
                  <select
                    id="requestType"
                    name="requestType"
                    value={requestForm.requestType}
                    onChange={handleRequestChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="course">Full Course</option>
                    <option value="tutorial">Tutorial</option>
                    <option value="example">Code Example</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={requestForm.description}
                    onChange={handleRequestChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe what additional content you would like..."
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="offerAmount" className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Offer ($)
                  </label>
                  <input
                    type="number"
                    id="offerAmount"
                    name="offerAmount"
                    value={requestForm.offerAmount}
                    onChange={handleRequestChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Optional: Offer payment for the requested content
                  </p>
                </div>
                
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setRequestFormVisible(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingRequest}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md disabled:opacity-50"
                  >
                    {submittingRequest ? 'Submitting...' : 'Submit Request'}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          <div className="space-y-6 mb-8">
            {presentation.comments && presentation.comments.length > 0 ? (
              presentation.comments.map(comment => (
                <div key={comment.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{comment.userName}</span>
                    <span className="text-gray-500 text-sm">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p>{comment.content}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">No comments yet. Be the first to comment!</p>
            )}
          </div>
          
          <form onSubmit={handleCommentSubmit} className="space-y-4">
            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                Add a Comment
              </label>
              <textarea
                id="comment"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Share your thoughts or ask a question..."
                required
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submittingComment || !commentContent.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50"
              >
                {submittingComment ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}

// Helper function to extract YouTube video ID
function getYouTubeVideoId(url: string): string {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : '';
} 