'use client'

import React from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import PageTransition from '@/components/common/PageTransition'

export default function ComingSoonPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const feature = searchParams.get('feature')

  const title = feature === 'location' 
    ? 'Share Location'
    : feature === 'photo'
    ? 'Take Photo'
    : 'New Feature'

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 px-4">
        <div className="max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 mb-4">
            <span className="text-sm font-medium">{title}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-3">Thanks for checking out our platform!</h1>
          <p className="text-gray-600 leading-relaxed mb-6">
            This feature is on the way and will be live soon. We’re grateful for your patience and support.
          </p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
        </div>
      </div>
    </PageTransition>
  )
}


