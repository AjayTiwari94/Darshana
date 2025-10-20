'use client'

import React from 'react'
import { Map, Navigation, Calendar, Users } from 'lucide-react'

const TravelPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center mb-12">
            <Navigation className="h-16 w-16 text-primary-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Travel Planning</h1>
            <p className="text-xl text-gray-600">
              Plan your perfect cultural heritage journey
            </p>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-6">
              Our travel planning services help you create unforgettable journeys through India's 
              rich cultural landscape. From personalized itineraries to expert guidance, we make 
              heritage travel seamless and enriching.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">What We Offer</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>Personalized heritage tour itineraries</li>
              <li>Expert cultural guides and storytellers</li>
              <li>Transportation and accommodation arrangements</li>
              <li>Special access to monuments and cultural sites</li>
              <li>Local cuisine and cultural experience recommendations</li>
              <li>Flexible scheduling to match your interests</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">How It Works</h2>
            <ol className="list-decimal pl-6 mb-6 space-y-2 text-gray-700">
              <li><strong>Tell Us Your Interests:</strong> Share your preferences for history, architecture, spirituality, or other cultural aspects</li>
              <li><strong>Receive Your Itinerary:</strong> Get a customized travel plan with detailed information about each site</li>
              <li><strong>Book Your Journey:</strong> Reserve transportation, accommodations, and guided tours through our platform</li>
              <li><strong>Experience Heritage:</strong> Enjoy immersive cultural experiences with our expert guides</li>
            </ol>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Popular Heritage Routes</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li><strong>Golden Triangle:</strong> Delhi - Agra - Jaipur</li>
              <li><strong>UNESCO World Heritage Sites:</strong> Complete collection of India's UNESCO sites</li>
              <li><strong>Spiritual Journey:</strong> Varanasi - Bodh Gaya - Ajanta & Ellora</li>
              <li><strong>South India Heritage:</strong> Hampi - Mysore - Madurai - Thanjavur</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Get Started</h2>
            <p className="text-gray-700 mb-4">
              Ready to plan your cultural heritage journey? Contact our travel experts today:
            </p>
            <p className="text-gray-700 mb-4">
              Email: travel@darshana.com<br />
              Phone: +91 98765 43210
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Contact Us</h2>
            <p className="text-gray-700 mb-4">
              For general inquiries about our travel services, please contact us at:
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

export default TravelPage