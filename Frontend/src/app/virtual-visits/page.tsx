'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { 
  EyeIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  CameraIcon,
  SpeakerWaveIcon,
  PlayIcon,
  PauseIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

interface VRExperience {
  _id: string
  title: string
  description: string
  monument: {
    _id: string
    name: string
    location: string
  }
  type: '360_tour' | 'ar_overlay' | 'vr_immersive' | 'virtual_guide'
  assets: {
    vrVideo?: string
    panoramicImages: string[]
    arModels: string[]
    audioGuide?: string
    thumbnails: string[]
  }
  duration: number
  difficulty: string
  isPublic: boolean
  features: string[]
  requirements: {
    device: 'mobile' | 'desktop' | 'vr_headset'
    minSpecs: string
  }
  interactions: Array<{
    id: string
    type: 'hotspot' | 'annotation' | 'quiz' | 'story'
    position: { x: number; y: number; z: number }
    content: string
    media?: string
  }>
}

const VirtualVisits: React.FC = () => {
  const router = useRouter()
  const [experiences, setExperiences] = useState<VRExperience[]>([])
  const [selectedExperience, setSelectedExperience] = useState<VRExperience | null>(null)
  const [currentView, setCurrentView] = useState<'gallery' | 'viewer'>('gallery')
  const [isLoading, setIsLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [deviceType, setDeviceType] = useState<'mobile' | 'desktop' | 'vr'>('desktop')
  const viewerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchVRExperiences()
    detectDevice()
  }, [])

  const detectDevice = () => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    setDeviceType(isMobile ? 'mobile' : 'desktop')
  }

  const fetchVRExperiences = async () => {
    try {
      const response = await fetch('/api/vr-experiences')
      const data = await response.json()
      
      if (data.success) {
        setExperiences(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch VR experiences:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const startExperience = (experience: VRExperience) => {
    setSelectedExperience(experience)
    setCurrentView('viewer')
    setCurrentImageIndex(0)
  }

  const exitViewer = () => {
    setCurrentView('gallery')
    setSelectedExperience(null)
    setIsPlaying(false)
  }

  const nextImage = () => {
    if (selectedExperience) {
      setCurrentImageIndex((prev) => 
        prev === selectedExperience.assets.panoramicImages.length - 1 ? 0 : prev + 1
      )
    }
  }

  const prevImage = () => {
    if (selectedExperience) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedExperience.assets.panoramicImages.length - 1 : prev - 1
      )
    }
  }

  const toggleAudio = () => {
    setIsPlaying(!isPlaying)
    // Audio play/pause logic would be implemented here
  }

  const requestFullscreen = () => {
    if (viewerRef.current) {
      viewerRef.current.requestFullscreen()
    }
  }

  const launchVR = () => {
    // WebXR implementation would go here
    if ('xr' in navigator) {
      console.log('WebXR supported - launching VR experience')
    } else {
      alert('VR not supported on this device. Please use a VR-compatible browser.')
    }
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'mobile': return <DevicePhoneMobileIcon className="h-5 w-5" />
      case 'desktop': return <ComputerDesktopIcon className="h-5 w-5" />
      case 'vr_headset': return <EyeIcon className="h-5 w-5" />
      default: return <ComputerDesktopIcon className="h-5 w-5" />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {currentView === 'gallery' ? (
        <div className="relative">
          {/* Hero Section */}
          <div 
            className="relative h-96 bg-cover bg-center bg-no-repeat flex items-center justify-center"
            style={{
              backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.2)), url('/images/virtual1.png')"
            }}
          >
            <div className="text-center text-white">
              <h1 className="text-5xl font-bold mb-4 drop-shadow-2xl" style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.9), 0 0 12px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.6)' }}>
                Virtual Heritage Tours
              </h1>
              <p className="text-xl text-gray-200 max-w-2xl mx-auto drop-shadow-lg" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.8), 0 0 12px rgba(0,0,0,0.6)' }}>
                Experience India's magnificent monuments through immersive AR/VR technology. 
                Travel through time from anywhere in the world.
              </p>
            </div>
          </div>

          {/* Experience Categories */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div
                className="bg-gray-800 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-750 transition-colors transform transition-transform duration-200 hover:scale-105 hover:shadow-lg"
                onClick={() => router.push('/360-tours')}
                role="button"
                aria-label="Explore 360° Tours"
                title="Explore 360° Tours"
              >
                <EyeIcon className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">360° Tours</h3>
                <p className="text-gray-400 text-sm">Immersive panoramic experiences</p>
              </div>
              <div className="relative bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg p-6 text-center shadow-lg opacity-60">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-500/20 to-gray-600/20 rounded-lg"></div>
                <CameraIcon className="h-12 w-12 text-gray-400 mx-auto mb-4 relative z-10" />
                <h3 className="text-lg font-semibold mb-2 text-gray-300 relative z-10">AR Overlays</h3>
                <p className="text-gray-500 text-sm relative z-10">Interactive augmented reality</p>
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="bg-gradient-to-r from-cyan-500/90 to-blue-500/90 text-white px-4 py-2 rounded-full text-sm font-medium transform -rotate-12 shadow-lg">
                    Coming Soon
                  </div>
                </div>
              </div>
              <div className="relative bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg p-6 text-center shadow-lg opacity-60">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-500/20 to-gray-600/20 rounded-lg"></div>
                <DevicePhoneMobileIcon className="h-12 w-12 text-gray-400 mx-auto mb-4 relative z-10" />
                <h3 className="text-lg font-semibold mb-2 text-gray-300 relative z-10">Mobile VR</h3>
                <p className="text-gray-500 text-sm relative z-10">Smartphone-based virtual reality</p>
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="bg-gradient-to-r from-purple-500/90 to-pink-500/90 text-white px-4 py-2 rounded-full text-sm font-medium transform -rotate-12 shadow-lg">
                    Coming Soon
                  </div>
                </div>
              </div>
              <div className="relative bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg p-6 text-center shadow-lg opacity-60">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-500/20 to-gray-600/20 rounded-lg"></div>
                <SpeakerWaveIcon className="h-12 w-12 text-gray-400 mx-auto mb-4 relative z-10" />
                <h3 className="text-lg font-semibold mb-2 text-gray-300 relative z-10">Audio Guides</h3>
                <p className="text-gray-500 text-sm relative z-10">Expert narrated experiences</p>
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="bg-gradient-to-r from-yellow-500/90 to-orange-500/90 text-white px-4 py-2 rounded-full text-sm font-medium transform -rotate-12 shadow-lg">
                    Coming Soon
                  </div>
                </div>
              </div>
            </div>

            {/* Experience Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {experiences.map((experience) => (
                <div key={experience._id} className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors">
                  <div className="relative">
                    <img
                      src={experience.assets.thumbnails[0] || '/placeholder-vr.jpg'}
                      alt={experience.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 flex space-x-1">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        experience.type === '360_tour' ? 'bg-blue-600' :
                        experience.type === 'ar_overlay' ? 'bg-green-600' :
                        experience.type === 'vr_immersive' ? 'bg-purple-600' :
                        'bg-yellow-600'
                      }`}>
                        {experience.type.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{experience.title}</h3>
                    <p className="text-gray-400 text-sm mb-3">{experience.description}</p>
                    
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <span className="mr-4">{experience.monument.name}</span>
                      <span>{formatDuration(experience.duration)}</span>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        {getDeviceIcon(experience.requirements.device)}
                        <span className="text-sm text-gray-400 capitalize">
                          {experience.requirements.device.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex space-x-1">
                        {experience.features.slice(0, 3).map((feature, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-700 rounded text-xs">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => startExperience(experience)}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                    >
                      <PlayIcon className="h-4 w-4 mr-2" />
                      Start Experience
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // VR Viewer
        <div ref={viewerRef} className="relative h-screen bg-black">
          {selectedExperience && (
            <>
              {/* Main Viewer Area */}
              <div className="relative h-full">
                <img
                  src={selectedExperience.assets.panoramicImages[currentImageIndex] || '/placeholder-360.jpg'}
                  alt={selectedExperience.title}
                  className="w-full h-full object-cover cursor-move"
                  style={{ cursor: 'grab' }}
                />

                {/* Interactive Hotspots */}
                {selectedExperience.interactions.map((interaction) => (
                  <div
                    key={interaction.id}
                    className="absolute w-4 h-4 bg-orange-500 rounded-full animate-pulse cursor-pointer"
                    style={{
                      left: `${interaction.position.x}%`,
                      top: `${interaction.position.y}%`
                    }}
                    title={interaction.content}
                  />
                ))}
              </div>

              {/* Controls Overlay */}
              {showControls && (
                <div className="absolute inset-0 pointer-events-none">
                  {/* Top Bar */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-center pointer-events-auto">
                    <div className="bg-black bg-opacity-50 rounded-lg px-4 py-2">
                      <h3 className="text-white font-semibold">{selectedExperience.title}</h3>
                      <p className="text-gray-300 text-sm">{selectedExperience.monument.name}</p>
                    </div>
                    
                    <div className="flex space-x-2">
                      {selectedExperience.assets.audioGuide && (
                        <button
                          onClick={toggleAudio}
                          className="bg-black bg-opacity-50 p-3 rounded-lg text-white hover:bg-opacity-70"
                        >
                          {isPlaying ? <PauseIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5" />}
                        </button>
                      )}
                      
                      <button
                        onClick={requestFullscreen}
                        className="bg-black bg-opacity-50 p-3 rounded-lg text-white hover:bg-opacity-70"
                      >
                        <ArrowPathIcon className="h-5 w-5" />
                      </button>
                      
                      {deviceType === 'mobile' && (
                        <button
                          onClick={launchVR}
                          className="bg-orange-600 p-3 rounded-lg text-white hover:bg-orange-700"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                      )}
                      
                      <button
                        onClick={exitViewer}
                        className="bg-red-600 p-3 rounded-lg text-white hover:bg-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {/* Navigation Controls */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 pointer-events-auto">
                    <div className="bg-black bg-opacity-50 rounded-lg p-4 flex items-center space-x-4">
                      <button
                        onClick={prevImage}
                        className="p-2 bg-gray-700 rounded text-white hover:bg-gray-600"
                      >
                        ‹
                      </button>
                      
                      <div className="flex space-x-2">
                        {selectedExperience.assets.panoramicImages.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-3 h-3 rounded-full ${
                              index === currentImageIndex ? 'bg-orange-500' : 'bg-gray-500'
                            }`}
                          />
                        ))}
                      </div>
                      
                      <button
                        onClick={nextImage}
                        className="p-2 bg-gray-700 rounded text-white hover:bg-gray-600"
                      >
                        ›
                      </button>
                    </div>
                  </div>

                  {/* Info Panel */}
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-auto">
                    <div className="bg-black bg-opacity-50 rounded-lg p-4 max-w-xs">
                      <h4 className="text-white font-semibold mb-2">About this view</h4>
                      <p className="text-gray-300 text-sm mb-4">
                        Use your mouse or touch to look around. Click on the glowing hotspots to learn more.
                      </p>
                      
                      <div className="space-y-2 text-sm text-gray-400">
                        <div>Type: {selectedExperience.type.replace('_', ' ')}</div>
                        <div>Duration: {formatDuration(selectedExperience.duration)}</div>
                        <div>Features: {selectedExperience.features.length}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile VR Instructions */}
              {deviceType === 'mobile' && (
                <div className="absolute bottom-20 left-4 right-4 bg-orange-600 rounded-lg p-4 pointer-events-auto">
                  <p className="text-white text-sm text-center">
                    📱 Tap the VR button and insert your phone into a VR headset for the full immersive experience!
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default VirtualVisits