'use client'

import React from 'react'
import { View, Scan, Smartphone, Headphones } from 'lucide-react'

const ArVrPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center mb-12">
            <View className="h-16 w-16 text-primary-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AR/VR Experiences</h1>
            <p className="text-xl text-gray-600">
              Step into history with our augmented and virtual reality experiences
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