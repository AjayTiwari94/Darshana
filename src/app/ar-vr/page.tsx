'use client'

import React, { useState, Suspense } from 'react'
import { View, Scan, Smartphone, Headphones, Camera, Play } from 'lucide-react'
import dynamic from 'next/dynamic'

// Dynamically import AR/VR components to avoid SSR issues
const ARViewer = dynamic(() => import('@/components/ar-vr/ARViewer'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-96"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div></div>
})

const VRExperience = dynamic(() => import('@/components/ar-vr/VRExperience'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-96"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div></div>
})

const ArVrPage = () => {
  const [activeExperience, setActiveExperience] = useState<'none' | 'ar' | 'vr'>('none')
  const [selectedMonument, setSelectedMonument] = useState({
    id: 'taj_mahal',
    name: 'Taj Mahal',
    description: 'Experience the Taj Mahal in stunning 3D',
    historicalPeriod: '17th Century Mughal Era'
  })

  const monuments = [
    {
      id: 'taj_mahal',
      name: 'Taj Mahal',
      description: 'Experience the Taj Mahal in stunning 3D',
      historicalPeriod: '17th Century Mughal Era',
      image: '/taj-mahal.jpg'
    },
    {
      id: 'red_fort',
      name: 'Red Fort',
      description: 'Explore the grandeur of Mughal architecture',
      historicalPeriod: '17th Century Mughal Era',
      image: '/red-fort.jpg'
    },
    {
      id: 'hawa_mahal',
      name: 'Hawa Mahal',
      description: 'Discover the Palace of Winds',
      historicalPeriod: '18th Century Rajput Era',
      image: '/hawa-mahal.jpg'
    },
    {
      id: 'amer_fort',
      name: 'Amer Fort',
      description: 'Journey through royal Rajput heritage',
      historicalPeriod: '16th Century Rajput Era',
      image: '/amer-fort.jpg'
    }
  ]

  if (activeExperience === 'ar') {
    return (
      <div className="min-h-screen bg-black">
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={() => setActiveExperience('none')}
            className="bg-white text-gray-900 px-4 py-2 rounded-lg shadow-lg hover:bg-gray-100"
          >
            ← Back to Selection
          </button>
        </div>
        <div className="h-screen w-full">
          <ARViewer
            monumentId={selectedMonument.id}
            monumentName={selectedMonument.name}
            description={selectedMonument.description}
          />
        </div>
      </div>
    )
  }

  if (activeExperience === 'vr') {
    return (
      <div className="min-h-screen bg-black">
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={() => setActiveExperience('none')}
            className="bg-white text-gray-900 px-4 py-2 rounded-lg shadow-lg hover:bg-gray-100"
          >
            ← Back to Selection
          </button>
        </div>
        <div className="h-screen w-full">
          <VRExperience
            monumentId={selectedMonument.id}
            monumentName={selectedMonument.name}
            historicalPeriod={selectedMonument.historicalPeriod}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="text-center p-8 bg-gradient-to-r from-primary-600 to-secondary-600">
            <View className="h-16 w-16 text-white mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-white mb-2">AR/VR Experiences</h1>
            <p className="text-xl text-white opacity-90">
              Step into history with cutting-edge technology
            </p>
          </div>

          {/* Monument Selection */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Experience</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {monuments.map((monument) => (
                <div
                  key={monument.id}
                  onClick={() => setSelectedMonument(monument)}
                  className={`cursor-pointer rounded-xl overflow-hidden border-4 transition-all ${
                    selectedMonument.id === monument.id
                      ? 'border-primary-600 shadow-xl scale-105'
                      : 'border-transparent hover:border-primary-300 hover:shadow-lg'
                  }`}
                >
                  <div className="relative h-48">
                    <img
                      src={monument.image}
                      alt={monument.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = '/images/heritage-background.jpg'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold">{monument.name}</h3>
                      <p className="text-sm opacity-90">{monument.historicalPeriod}</p>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50">
                    <p className="text-gray-700">{monument.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Experience Type Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={() => setActiveExperience('ar')}
                className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <div className="relative z-10">
                  <Scan className="h-12 w-12 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Augmented Reality</h3>
                  <p className="text-blue-100 mb-4">
                    View 3D models and historical overlays in your space
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <Camera className="h-4 w-4" />
                    <span>Works on any device with a camera</span>
                  </div>
                </div>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
              </button>

              <button
                onClick={() => setActiveExperience('vr')}
                className="group relative overflow-hidden bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <div className="relative z-10">
                  <Headphones className="h-12 w-12 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Virtual Reality</h3>
                  <p className="text-orange-100 mb-4">
                    Immerse yourself in historical reconstructions
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <Play className="h-4 w-4" />
                    <span>VR headset recommended but not required</span>
                  </div>
                </div>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
              </button>
            </div>
          </div>

          {/* Information Section */}
          <div className="p-8 bg-gray-50">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">About Our Technology</h2>
              <p className="text-lg text-gray-600">
                Learn more about our immersive experiences
              </p>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 mb-6">
                Our AR/VR experiences transport you through time to witness historical events, 
                explore ancient monuments as they once were, and interact with cultural artifacts 
              in ways never before possible.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Augmented Reality (AR)</h2>
            <p className="text-gray-700 mb-4">
              Using your smartphone or tablet, our AR experiences overlay digital information 
              onto the real world, bringing monuments and artifacts to life.
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>Point your camera at monuments to see historical overlays</li>
              <li>Reconstruct damaged or missing parts of structures</li>
              <li>View detailed information about architectural features</li>
              <li>Experience historical events at their original locations</li>
              <li>Interact with 3D models of artifacts</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Virtual Reality (VR)</h2>
            <p className="text-gray-700 mb-4">
              With a VR headset, immerse yourself completely in historical environments and 
              cultural experiences from around the world.
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>Visit monuments as they appeared in different historical periods</li>
              <li>Walk through ancient cities and civilizations</li>
              <li>Attend historical events and cultural ceremonies</li>
              <li>Examine artifacts in detailed 3D</li>
              <li>Experience cultural practices and traditions</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Featured Experiences</h2>
            <div className="space-y-6 mb-8">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900">Taj Mahal: The Story Unveiled</h3>
                <p className="text-gray-600 mt-2">
                  Experience the love story of Shah Jahan and Mumtaz Mahal through AR overlays 
                  that show the construction process and historical context.
                </p>
                <div className="flex items-center mt-3 text-sm text-gray-500">
                  <Smartphone className="h-4 w-4 mr-1" />
                  <span>AR Experience</span>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900">Ancient Hampi VR Tour</h3>
                <p className="text-gray-600 mt-2">
                  Step into the Vijayanagara Empire at its peak with a fully immersive VR 
                  experience that recreates the bustling capital city.
                </p>
                <div className="flex items-center mt-3 text-sm text-gray-500">
                  <Headphones className="h-4 w-4 mr-1" />
                  <span>VR Experience with Audio Guide</span>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900">Ajanta Caves: Art in Darkness</h3>
                <p className="text-gray-600 mt-2">
                  Use AR to illuminate the ancient cave paintings and learn about the stories 
                  and techniques behind these masterpieces.
                </p>
                <div className="flex items-center mt-3 text-sm text-gray-500">
                  <Scan className="h-4 w-4 mr-1" />
                  <span>AR Experience with Detailed Scanning</span>
                </div>
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Getting Started</h2>
            <p className="text-gray-700 mb-4">
              To experience our AR/VR content:
            </p>
            <ol className="list-decimal pl-6 mb-6 space-y-2 text-gray-700">
              <li>Download the Darshana app from your device's app store</li>
              <li>Create an account or log in if you already have one</li>
              <li>Select your desired AR/VR experience</li>
              <li>Follow the on-screen instructions for setup</li>
              <li>Begin your cultural journey!</li>
            </ol>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">System Requirements</h2>
            <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">For AR Experiences:</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
              <li>Smartphone or tablet with camera (iOS 12+ or Android 8+)</li>
              <li>Darshana mobile app</li>
              <li>Stable internet connection</li>
            </ul>
            
            <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">For VR Experiences:</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>Compatible VR headset (Oculus Quest, HTC Vive, etc.)</li>
              <li>VR-ready computer or standalone headset</li>
              <li>Darshana VR app or web browser support</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Contact Us</h2>
            <p className="text-gray-700 mb-4">
              For technical support with AR/VR experiences, please contact:
            </p>
            <p className="text-gray-700 mb-4">
              Email: arvr@darshana.com<br />
              Phone: +91 98765 43210
            </p>
            <p className="text-gray-700 mb-4">
              For general inquiries, please contact:
            </p>
            <p className="text-gray-700 mb-4">
              Email: tiwari.ajay936@outlook.com<br />
              Phone: +91 98765 43210
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArVrPage