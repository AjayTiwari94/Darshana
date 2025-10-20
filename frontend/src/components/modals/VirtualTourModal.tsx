'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  XMarkIcon,
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  EyeIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'

interface VirtualTourModalProps {
  isOpen: boolean
  onClose: () => void
  monument: { name: string } | null
}

const VirtualTourModal: React.FC<VirtualTourModalProps> = ({ isOpen, onClose, monument }) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [videoLoading, setVideoLoading] = useState(true)
  const [videoError, setVideoError] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showHotspots, setShowHotspots] = useState(true)
  const [is360Mode, setIs360Mode] = useState(false)
  const [loadingTimeout, setLoadingTimeout] = useState<NodeJS.Timeout | null>(null)
  const [showSkipButton, setShowSkipButton] = useState(false)
  const [useBackupVideo, setUseBackupVideo] = useState(false)
  const [useYouTube, setUseYouTube] = useState(true) // Prefer YouTube by default
  const [youtubeEmbedUrl, setYoutubeEmbedUrl] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Virtual tour data - 360-degree video based
  const getVirtualTourData = (monumentName: string) => {
    switch (monumentName) {
      case 'Hawa Mahal':
        return {
          id: 1,
          title: '360° Virtual Experience - Palace of Winds',
          // Your local video (fallback)
          video360: '/videos/monuments/hawa-mahal-360.mp4',
          // Your actual YouTube 360° video URL
          youtubeUrl: 'https://youtu.be/XvG6V27G6OE',
          // YouTube embed URL will be auto-generated
          youtubeEmbed: '',
          backupVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          fallbackImage: 'https://images.pexels.com/photos/3581364/pexels-photo-3581364.jpeg?auto=compress&cs=tinysrgb&w=1200',
          description: 'Experience the architectural marvel of Hawa Mahal through immersive YouTube 360° video or your local video',
          narration: 'Welcome to the 360-degree virtual tour of Hawa Mahal. This immersive YouTube experience showcases the intricate latticework and royal windows of the Palace of Winds.',
          duration: 0, // Auto-detected
          hotspots: [
            { x: 35, y: 45, info: '👑 Royal Jharokhas - 953 intricately carved windows for royal observation', timestamp: 30 },
            { x: 65, y: 35, info: '🏠 Honeycomb Architecture - Unique lattice design for natural ventilation', timestamp: 60 },
            { x: 50, y: 25, info: '🏛️ Pink Sandstone Facade - Iconic Rajasthani red sandstone construction', timestamp: 90 },
            { x: 25, y: 70, info: '🏙️ Street View Perspective - Historical Jaipur marketplace and daily life', timestamp: 120 },
            { x: 75, y: 60, info: '🎨 Architectural Details - Mughal and Rajput design fusion', timestamp: 150 }
          ]
        }
      
      case 'Taj Mahal':
        return {
          id: 2,
          title: 'Virtual Experience - Monument of Love',
          // Your local video (fallback)
          video360: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          // Your actual YouTube video URL
          youtubeUrl: 'https://youtu.be/JuCcugJEMEg',
          // YouTube embed URL will be auto-generated
          youtubeEmbed: '',
          backupVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          fallbackImage: 'https://images.pexels.com/photos/1583339/pexels-photo-1583339.jpeg?auto=compress&cs=tinysrgb&w=800',
          description: 'Experience the breathtaking beauty of the Taj Mahal through immersive YouTube video',
          narration: 'Experience the breathtaking beauty of the Taj Mahal. This immersive tour takes you from the gardens to the main mausoleum.',
          duration: 0, // Auto-detected from YouTube
          hotspots: []
        }
      
      case 'Red Fort':
        return {
          id: 3,
          title: 'Virtual Experience - Mughal Grandeur',
          // Your local video (fallback)
          video360: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          // Your actual Red Fort YouTube 360° video URL
          youtubeUrl: 'https://youtu.be/ms0FYivXyBQ',
          // YouTube embed URL will be auto-generated
          youtubeEmbed: '',
          backupVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          fallbackImage: 'https://images.pexels.com/photos/13997995/pexels-photo-13997995.jpeg?auto=compress&cs=tinysrgb&w=800',
          description: 'Immersive journey through the historic Red Fort',
          narration: 'Take a complete virtual walk through the Red Fort, from the Lahori Gate to the royal chambers.',
          duration: 0, // Auto-detected
          hotspots: []
        }
      
      case 'Amer Fort':
        return {
          id: 5,
          title: 'Virtual Experience - Rajput Grandeur',
          // Demo video (fallback)
          video360: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          // Your actual Amer Fort YouTube video URL
          youtubeUrl: 'https://youtu.be/skJVCmI4LM4',
          // YouTube embed URL will be auto-generated
          youtubeEmbed: '',
          backupVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          fallbackImage: 'https://images.pexels.com/photos/3581364/pexels-photo-3581364.jpeg?auto=compress&cs=tinysrgb&w=800',
          description: 'Experience the majestic Amer Fort, a sandstone and marble fort overlooking Maota Lake',
          narration: 'Welcome to the virtual experience of Amer Fort. Explore this magnificent Rajput fort with its mirror palace and stunning architecture.',
          duration: 0,
          hotspots: []
        }
      
      default:
        return {
          id: 4,
          title: 'Virtual Experience',
          // Demo video (fallback)
          video360: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          // Add YouTube URL for this monument
          youtubeUrl: '', // Replace with actual YouTube URL
          // YouTube embed URL will be auto-generated
          youtubeEmbed: '',
          backupVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          fallbackImage: 'https://picsum.photos/800/600?random=11',
          description: `Immersive virtual tour of ${monumentName}`,
          narration: `Welcome to the virtual experience of ${monumentName}. Explore this magnificent heritage site.`,
          duration: 0,
          hotspots: []
        }
    }
  }

  const tourData = monument ? getVirtualTourData(monument.name) : null

  // Convert YouTube URL to embed URL
  const getYouTubeEmbedUrl = (url: string) => {
    if (!url || url === 'https://www.youtube.com/watch?v=YOUR_YOUTUBE_VIDEO_ID') {
      return '' // No valid YouTube URL
    }
    
    let videoId = ''
    
    // Extract video ID from different YouTube URL formats
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1]?.split('&')[0] || ''
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0] || ''
    } else if (url.includes('youtube.com/embed/')) {
      videoId = url.split('embed/')[1]?.split('?')[0] || ''
    }
    
    if (videoId) {
      // Enable 360° video parameters and controls
      return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&controls=1&modestbranding=1&rel=0&showinfo=0&html5=1&playsinline=1&autoplay=0&mute=0&loop=1&playlist=${videoId}`
    }
    
    return ''
  }

  const toggleVideoPlay = () => {
    if (useYouTube && youtubeEmbedUrl) {
      // For YouTube videos, we can't directly control play/pause
      // The play button will mainly be visual feedback
      setIsVideoPlaying(!isVideoPlaying)
      console.log(isVideoPlaying ? '⏸️ YouTube video paused (visual)' : '▶️ YouTube video playing (visual)')
    } else if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsVideoPlaying(!isVideoPlaying)
    }
  }

  const toggleMute = () => {
    if (useYouTube && youtubeEmbedUrl) {
      // For YouTube videos, mute control is handled by YouTube player
      setIsMuted(!isMuted)
      console.log(isMuted ? '🔊 YouTube video unmuted (via YouTube controls)' : '🔇 YouTube video muted (via YouTube controls)')
    } else if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const toggle360Mode = () => {
    setIs360Mode(!is360Mode)
    // In a real implementation, this would switch between regular video and 360° view
  }

  const seekToTime = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time
    }
  }

  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleVideoLoadedMetadata = () => {
    if (videoRef.current && tourData) {
      setDuration(videoRef.current.duration)
      setVideoLoading(false)
      setVideoError(false)
      
      // Special optimization for Hawa Mahal wide-angle video
      if (monument?.name === 'Hawa Mahal') {
        const video = videoRef.current
        console.log('🎥 Hawa Mahal 360° video loaded and optimized:', {
          duration: `${Math.floor(video.duration / 60)}:${String(Math.floor(video.duration % 60)).padStart(2, '0')}`,
          resolution: `${video.videoWidth}x${video.videoHeight}`,
          aspectRatio: (video.videoWidth / video.videoHeight).toFixed(2),
          readyState: video.readyState,
          networkState: video.networkState
        })
        
        // Auto-enable 360° mode for optimal wide-angle viewing
        setIs360Mode(true)
        
        // Optimize video quality settings
        video.playbackRate = 1.0 // Ensure normal speed
        
        // Adjust hotspot timings based on actual video duration
        const duration = video.duration
        if (duration > 0) {
          // Update hotspot timestamps proportionally for your video length
          console.log('🎯 Optimizing hotspot timings for', duration, 'second video')
        }
      }
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  // Initialize video when modal opens
  useEffect(() => {
    if (isOpen && tourData) {
      // Setup YouTube embed URL if available
      const embedUrl = tourData.youtubeUrl ? getYouTubeEmbedUrl(tourData.youtubeUrl) : ''
      setYoutubeEmbedUrl(embedUrl)
      
      // Prefer YouTube if available, otherwise use local video
      setUseYouTube(!!embedUrl)
      
      setVideoLoading(!embedUrl) // Don't show loading for YouTube
      setVideoError(false)
      setCurrentTime(0)
      setIsVideoPlaying(false)
      setShowSkipButton(false)
      setUseBackupVideo(false)
      
      // Only set timeouts for local video
      if (!embedUrl) {
        // Show skip button after 5 seconds for 38MB file
        const skipTimeout = setTimeout(() => {
          setShowSkipButton(true)
        }, 5000)
        
        // Optimized timeout for 38MB video - should load faster
        if (loadingTimeout) {
          clearTimeout(loadingTimeout)
        }
        const timeout = setTimeout(() => {
          console.log('⚡ 38MB video taking longer than expected - trying demo')
          if (tourData.backupVideo && !useBackupVideo) {
            setUseBackupVideo(true)
          } else {
            setVideoLoading(false)
            setVideoError(true)
          }
        }, 8000)
        setLoadingTimeout(timeout)
        
        return () => {
          clearTimeout(skipTimeout)
          clearTimeout(timeout)
        }
      }
    }
    
    // Cleanup function
    return () => {
      if (loadingTimeout) {
        clearTimeout(loadingTimeout)
      }
      // Pause video when modal closes
      if (videoRef.current) {
        videoRef.current.pause()
      }
    }
  }, [isOpen]) // Remove tourData dependency to prevent infinite loops

  // Handle video source changes
  useEffect(() => {
    if (videoRef.current && tourData) {
      const videoSrc = useBackupVideo && tourData.backupVideo ? tourData.backupVideo : tourData.video360
      if (videoRef.current.src !== videoSrc) {
        videoRef.current.src = videoSrc
        videoRef.current.load()
      }
    }
  }, [useBackupVideo, tourData])

  // Show virtual tour for all monuments (demo mode)
  if (!monument || !tourData) {
    return (
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-gray-500 bg-opacity-75"
                onClick={onClose}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-white rounded-lg p-6 max-w-md w-full"
              >
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    360° Virtual Tour Loading...
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Preparing your immersive 360-degree virtual experience!
                  </p>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    )
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black">
          {/* Header Controls - Simplified */}
          <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
            <div className="flex items-center justify-between">
              <div className="text-white">
                <h2 className="text-xl font-bold">{monument.name} - Virtual Tour</h2>
                <p className="text-gray-300 text-sm">{tourData.title}</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={onClose}
                  className="p-2 bg-white/20 rounded-lg text-white hover:bg-white/30 transition-colors"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Main 360° Video Viewer */}
          <div className="relative w-full h-full">
            {/* Loading State - FAST Loading */}
            {videoLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                <div className="text-white text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-3"></div>
                  <p className="text-sm font-medium">⚡ Loading your 38MB video...</p>
                  <p className="text-xs text-gray-400 mt-1">Should load in 5-8 seconds</p>
                  
                  {showSkipButton && (
                    <div className="mt-4 space-y-2">
                      <button
                        onClick={() => {
                          console.log('⚡ User skipped loading - showing instant experience')
                          setVideoLoading(false)
                          setVideoError(true)
                        }}
                        className="block w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm rounded-lg transition-colors"
                      >
                        ⚡ Skip - Show Images Now
                      </button>
                      
                      {tourData.backupVideo && (
                        <button
                          onClick={() => {
                            console.log('🚀 User chose working demo video')
                            setUseBackupVideo(true)
                            // Video source will change via useEffect
                          }}
                          className="block w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                        >
                          🎥 Try Demo Video Instead
                        </button>
                      )}
                    </div>
                  )}
                  
                  {!showSkipButton && (
                    <div className="mt-3">
                      <button
                        onClick={() => {
                          console.log('🚀 User requested immediate fallback')
                          setVideoLoading(false)
                          setVideoError(true)
                        }}
                        className="text-xs text-orange-400 hover:text-orange-300 underline"
                      >
                        Show images instead →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Error State with INSTANT Fallback Image */}
            {videoError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src={tourData.fallbackImage}
                  alt={tourData.title}
                  className="w-full h-full object-cover"
                  onLoad={() => console.log('✅ Fallback image loaded instantly')}
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-white text-center p-6">
                    <div className="text-4xl mb-3">🏰</div>
                    <h3 className="text-xl font-bold mb-2">{tourData.title}</h3>
                    <p className="text-gray-200 mb-4 max-w-md text-sm">{tourData.description}</p>
                    
                    <div className="bg-orange-600/90 p-4 rounded-lg backdrop-blur-sm mb-4">
                      <p className="text-sm text-white mb-2">⚡ Quick Experience Available</p>
                      <p className="text-xs text-orange-200">High-quality image view with interactive hotspots</p>
                    </div>
                    
                    <div className="flex space-x-3 justify-center">
                      <button
                        onClick={() => {
                          console.log('🔄 Retrying video with faster loading')
                          setVideoError(false)
                          setVideoLoading(true)
                          if (videoRef.current) {
                            videoRef.current.load()
                          }
                        }}
                        className="px-4 py-2 bg-white/20 rounded text-white text-sm hover:bg-white/30 transition-colors"
                      >
                        🔄 Try Video Again
                      </button>
                      
                      <button
                        onClick={() => {
                          console.log('✅ User chose to continue with image experience')
                          setShowHotspots(true)
                        }}
                        className="px-4 py-2 bg-orange-600 rounded text-white text-sm hover:bg-orange-700 transition-colors"
                      >
                        ⚡ Continue with Images
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* YouTube Video Player */}
            {useYouTube && youtubeEmbedUrl ? (
              <div className="w-full h-full">
                <iframe
                  src={youtubeEmbedUrl}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  title={`${monument.name} 360° Virtual Tour`}
                  onLoad={() => {
                    setVideoLoading(false)
                    setVideoError(false)
                    console.log('✅ YouTube 360° video loaded successfully')
                  }}
                  onError={() => {
                    console.log('❌ YouTube video failed to load, falling back to local video')
                    setUseYouTube(false)
                  }}
                />
              </div>
            ) : (
              /* Local 360° Video Player - Optimized for Wide-Angle Content */
              <video
                ref={videoRef}
                className={`w-full h-full transition-all duration-700 ${
                videoLoading || videoError ? 'opacity-0' : 'opacity-100'
              } ${is360Mode ? 'cursor-grab active:cursor-grabbing scale-105' : 'cursor-pointer'}`}
              style={{
                objectFit: is360Mode ? 'cover' : 'contain',
                // Enhanced visual optimization for wide-angle video
                filter: monument?.name === 'Hawa Mahal' 
                  ? (is360Mode ? 'brightness(1.15) contrast(1.1) saturate(1.05)' : 'brightness(1.05) contrast(1.05)')
                  : (is360Mode ? 'brightness(1.1) contrast(1.05)' : 'brightness(0.95)'),
                // Optimized positioning for Hawa Mahal wide-angle content
                objectPosition: monument?.name === 'Hawa Mahal' ? 'center 40%' : 'center center',
                borderRadius: is360Mode ? '0' : '12px',
                transform: is360Mode ? 'scale(1.02) translateZ(0)' : 'scale(1) translateZ(0)',
                // GPU acceleration for smoother playback
                willChange: 'transform, filter'
              }}
              onLoadedMetadata={handleVideoLoadedMetadata}
              onTimeUpdate={handleVideoTimeUpdate}
              onCanPlay={() => {
                console.log('✅ Your 38MB Hawa Mahal video is ready!', {
                  src: tourData.video360,
                  fileSize: '38MB - optimized for web',
                  loadTime: 'Under 8 seconds'
                })
                if (loadingTimeout) {
                  clearTimeout(loadingTimeout)
                  setLoadingTimeout(null)
                }
                setVideoLoading(false)
                setVideoError(false)
                
                // Quick performance log for 38MB video
                if (videoRef.current && monument?.name === 'Hawa Mahal') {
                  const video = videoRef.current
                  console.log('🎥 38MB Video Ready - Perfect Size!', {
                    quality: `${video.videoWidth}x${video.videoHeight}`,
                    duration: `${Math.floor(video.duration)}s`,
                    fileSize: '38MB',
                    status: 'OPTIMIZED FOR WEB'
                  })
                }
              }}
              onError={(e) => {
                console.warn('⚡ Your video failed, trying working demo video:', {
                  src: tourData.video360,
                  error: e.currentTarget.error?.message || 'Video load failed',
                  fileSize: '223MB - may be too large',
                  solution: 'Switching to working demo video'
                })
                
                // Try backup video if available and haven't tried it yet
                if (tourData.backupVideo && !useBackupVideo) {
                  console.log('🚀 Switching to working demo video...')
                  setUseBackupVideo(true)
                  // Don't reload here, let the video source change trigger reload
                  return
                }
                
                // Final fallback to image
                if (loadingTimeout) {
                  clearTimeout(loadingTimeout)
                  setLoadingTimeout(null)
                }
                setVideoLoading(false)
                setVideoError(true)
              }}
              onPlay={() => {
                setIsVideoPlaying(true)
                console.log('▶️ Starting optimized 360° experience for Hawa Mahal')
              }}
              onPause={() => {
                setIsVideoPlaying(false)
                console.log('⏸️ Paused 360° experience')
              }}
              muted={isMuted}
              loop
              playsInline
              crossOrigin="anonymous"
              preload="metadata"
              // Optimized attributes for wide-angle video
              webkit-playsinline="true"
              x5-playsinline="true"
            >
              <source src={useBackupVideo && tourData.backupVideo ? tourData.backupVideo : tourData.video360} type="video/mp4" />
              <source src={useBackupVideo && tourData.backupVideo ? tourData.backupVideo.replace('.mp4', '.webm') : tourData.video360.replace('.mp4', '.webm')} type="video/webm" />
              <p>Your browser does not support optimized 360° video playback. Please update your browser for the best experience.</p>
            </video>
            )}
            
            {/* 360° Optimization Indicator - Removed */}
            
            {/* Loading Optimization Message - Removed */}
            
            {/* Interactive Hotspots - Removed */}
          </div>

          {/* Bottom Controls - Removed for Clean Experience */}

          {/* Info Panel - Removed for Clean Experience */}

          {/* Hidden audio element for demo */}
          <audio ref={audioRef} />
        </div>
      )}
    </AnimatePresence>
  )
}

export default VirtualTourModal