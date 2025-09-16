import React from 'react'
import dynamic from 'next/dynamic'
import Header from '@/components/layout/Header'
import Hero from '@/components/home/Hero'

// Lazy load non-critical components
const Features = dynamic(() => import('@/components/home/Features'), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />
})
const TrendingStories = dynamic(() => import('@/components/home/TrendingStories'), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />
})
const PopularMonuments = dynamic(() => import('@/components/home/PopularMonuments'), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />
})
const Footer = dynamic(() => import('@/components/layout/Footer'), {
  loading: () => <div className="h-48 bg-gray-100 animate-pulse" />
})

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <TrendingStories />
      <PopularMonuments />
      <Footer />
    </main>
  )
}