'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

interface CarouselImage {
  src: string
  alt: string
  title: string
}

const ImageCarousel: React.FC = () => {
  const images: CarouselImage[] = [
    {
      src: '/premmandir.jpg',
      alt: 'Prem Mandir - A beautiful temple dedicated to Radha Krishna, showcasing intricate architecture and spiritual significance',
      title: 'Prem Mandir'
    },
    {
      src: '/konarksuntemple.jpg',
      alt: 'Konark Sun Temple - UNESCO World Heritage Site, featuring a giant stone chariot dedicated to the sun god Surya',
      title: 'Konark Sun Temple'
    },
    {
      src: '/golderntemple.jpg',
      alt: 'Golden Temple - Sacred Sikh gurdwara in Amritsar, featuring stunning golden architecture and spiritual significance',
      title: 'Golden Temple'
    },
    {
      src: '/redfort.jpg',
      alt: 'Red Fort - Historic fort in Delhi with rich Mughal architecture',
      title: 'Red Fort'
    },
    {
      src: '/bhangarhfort.jpg',
      alt: 'Bhangarh Fort - Historic fort known as one of the most haunted places in India, with mysterious ruins and legends',
      title: 'Bhangarh Fort'
    },
    {
      src: '/Badrinath.jpg',
      alt: 'Badrinath Temple - Sacred temple dedicated to Lord Vishnu in Uttarakhand',
      title: 'Badrinath Temple'
    },
    {
      src: '/Kedarnath.jpg',
      alt: 'Kedarnath Temple - Ancient Hindu temple dedicated to Lord Shiva, nestled in the Himalayas with stunning mountain backdrop',
      title: 'Kedarnath Temple'
    },
    {
      src: '/amer-fort.jpg',
      alt: 'Amer Fort - Magnificent example of Rajput architecture with artistic Hindu style elements and stunning hilltop location',
      title: 'Amer Fort'
    }
  ]

  const [currentIndex, setCurrentIndex] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const [imageLoadErrors, setImageLoadErrors] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const startInterval = () => {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
      }, 5000)
    }

    startInterval()

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [images.length])

  const handleIndicatorClick = (index: number) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setCurrentIndex(index)
    // Restart interval after manual selection
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 5000)
  }

  const handleImageError = (src: string) => {
    console.error(`Failed to load image: ${src}`);
    setImageLoadErrors(prev => ({ ...prev, [src]: true }));
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Simplified image rendering with proper error handling */}
      {images.map((image, index) => (
        <div
          key={index}
          className="absolute inset-0"
          style={{ 
            opacity: index === currentIndex ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
            zIndex: index === currentIndex ? 1 : 0
          }}
        >
          {!imageLoadErrors[image.src] ? (
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover object-center"
              priority={index === 0}
              quality={90}
              sizes="100vw"
              onError={() => handleImageError(image.src)}
            />
          ) : (
            // Fallback content if image fails to load
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
              <div className="text-white text-center p-4">
                <h3 className="text-2xl font-bold mb-2">{image.title}</h3>
                <p className="text-lg">{image.alt}</p>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Simple indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => handleIndicatorClick(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-white scale-125 shadow-lg'
                : 'bg-white/60 hover:bg-white/80 hover:scale-110'
            }`}
            aria-label={`Go to ${images[index].title}`}
          />
        ))}
      </div>
    </div>
  )
}

export default ImageCarousel