'use client'

import React from 'react'
import { RotateCcw, Play, Info } from 'lucide-react'

const Tours360Page = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center mb-12">
            <RotateCcw className="h-16 w-16 text-primary-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">360° Tours</h1>
            <p className="text-xl text-gray-600">
              Experience monuments from every angle with our immersive 360° tours
            </p>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-6">
              Our 360° tours offer an immersive way to explore India's cultural monuments and 
              heritage sites from the comfort of your home. Experience detailed views of 
              architectural marvels, historical artifacts, and cultural spaces.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">How It Works</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>Click and drag to look around in any direction</li>
              <li>Use navigation controls to move between different viewpoints</li>
              <li>Click on information points to learn about specific features</li>
              <li>Enjoy high-resolution imagery for detailed exploration</li>
              <li>Experience both interior and exterior views of monuments</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Featured Tours</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="bg-gray-200 h-40 rounded-lg mb-4 flex items-center justify-center">
                  <Play className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Taj Mahal 360°</h3>
                <p className="text-gray-600 text-sm">Explore the iconic mausoleum from all angles</p>
                <button className="mt-3 text-primary-600 hover:text-primary-500 text-sm font-medium">
                  Start Tour
                </button>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="bg-gray-200 h-40 rounded-lg mb-4 flex items-center justify-center">
                  <Play className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Ajanta Caves 360°</h3>
                <p className="text-gray-600 text-sm">Discover ancient Buddhist cave paintings</p>
                <button className="mt-3 text-primary-600 hover:text-primary-500 text-sm font-medium">
                  Start Tour
                </button>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="bg-gray-200 h-40 rounded-lg mb-4 flex items-center justify-center">
                  <Play className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Khajuraho Temples 360°</h3>
                <p className="text-gray-600 text-sm">Experience the intricate temple architecture</p>
                <button className="mt-3 text-primary-600 hover:text-primary-500 text-sm font-medium">
                  Start Tour
                </button>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="bg-gray-200 h-40 rounded-lg mb-4 flex items-center justify-center">
                  <Play className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Hampi 360°</h3>
                <p className="text-gray-600 text-sm">Explore the ruins of the Vijayanagara Empire</p>
                <button className="mt-3 text-primary-600 hover:text-primary-500 text-sm font-medium">
                  Start Tour
                </button>
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">System Requirements</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>Modern web browser (Chrome, Firefox, Safari, or Edge)</li>
              <li>Stable internet connection</li>
              <li>For VR experience: Compatible VR headset</li>
              <li>For mobile: Latest smartphone with gyroscope</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Contact Us</h2>
            <p className="text-gray-700 mb-4">
              For inquiries about our 360° tours, please contact us at:
            </p>
            <p className="text-gray-700 mb-4">
              Email: tours@darshana.com<br />
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

export default Tours360Page
