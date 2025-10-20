import React from 'react'
import dynamic from 'next/dynamic'
import Header from '../components/layout/Header'
import Hero from '../components/home/Hero'

// Lazy load non-critical components
const Features = dynamic(() => import('../components/home/Features'), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />
})
const PopularMonuments = dynamic(() => import('../components/home/PopularMonuments'), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />
})
const TrendingStories = dynamic(() => import('../components/home/TrendingStories'), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />
})
const ImageCarousel = dynamic(() => import('../components/home/ImageCarousel'), {
  loading: () => <div className="h-screen bg-red-500">Carousel Loading...</div>
})
const Footer = dynamic(() => import('../components/layout/Footer'), {
  loading: () => <div className="h-48 bg-gray-100 animate-pulse" />
})

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Background Carousel - Positioned behind everything */}
      <div className="fixed inset-0 -z-10">
        <ImageCarousel />
      </div>
      
      <Header />
      <main className="container mx-auto px-4 py-8 relative z-10">
        <Hero />
        <Features />
        <PopularMonuments />
        <TrendingStories />
      </main>
      <Footer />
    </div>
  )
}