'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'

interface Presentation {
  id: string
  title: string
  summary: string
  videoUrl: string
  githubUrl: string
  authorId: string
  authorName: string
  createdAt: string
  updatedAt: string
}

interface PaginationInfo {
  total: number
  page: number
  limit: number
  pages: number
}

export default function Home() {
  const [presentations, setPresentations] = useState<Presentation[]>([])
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPresentations = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/presentations?page=${pagination.page}&limit=${pagination.limit}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch presentations')
        }
        
        const data = await response.json()
        setPresentations(data.data)
        setPagination(data.pagination)
      } catch (err) {
        setError('Error loading presentations. Please try again later.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchPresentations()
  }, [pagination.page, pagination.limit])

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination.pages) {
      setPagination(prev => ({ ...prev, page: newPage }))
    }
  }

  return (
    <main className="min-h-screen p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">
          AI-Powered Presentations
        </h1>
        
        {loading ? (
          <div className="flex justify-center my-12">
            <p className="text-lg">Loading presentations...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md my-6">
            {error}
          </div>
        ) : presentations.length === 0 ? (
          <div className="text-center my-12">
            <p className="text-lg mb-4">No presentations found.</p>
            <Link 
              href="/presentations/new" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Create Your First Presentation
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {presentations.map(presentation => (
                <div 
                  key={presentation.id} 
                  className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-2 truncate">
                      {presentation.title}
                    </h2>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {presentation.summary.replace(/#+\s|[*_]/g, '')}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <span>By {presentation.authorName}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(presentation.createdAt).toLocaleDateString()}</span>
                    </div>
                    <Link 
                      href={`/presentations/${presentation.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View Presentation →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
            {pagination.pages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-3 py-1 rounded-md border disabled:opacity-50"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded-md ${
                        pagination.page === page 
                          ? 'bg-blue-600 text-white' 
                          : 'border hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="px-3 py-1 rounded-md border disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
        
        <div className="mt-12 text-center">
          <Link 
            href="/presentations/new" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium"
          >
            Create New Presentation
          </Link>
        </div>
      </div>
    </main>
  )
} 