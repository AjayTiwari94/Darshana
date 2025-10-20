'use client'

import React from 'react'
import { Users, Calendar, MapPin, Camera } from 'lucide-react'

const GroupToursPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center mb-12">
            <Users className="h-16 w-16 text-primary-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Group Tours</h1>
            <p className="text-xl text-gray-600">
              Shared cultural experiences for families, friends, and communities
            </p>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-6">
              Join our expertly guided group tours to explore India's cultural heritage with fellow 
              enthusiasts. Our group tours offer a perfect blend of education, entertainment, and 
              cultural immersion at competitive prices.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Tour Benefits</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>Expert guides with deep cultural knowledge</li>
              <li>Small group sizes for personalized attention</li>
              <li>Comprehensive tour packages including transportation and meals</li>
              <li>Special access to monuments and cultural sites</li>
              <li>Interactive storytelling and cultural activities</li>
              <li>Photo opportunities at scenic locations</li>
              <li>Meet like-minded cultural enthusiasts</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Upcoming Tours</h2>
            <div className="space-y-6 mb-8">
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex flex-wrap items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Delhi Heritage Walk</h3>
                    <p className="text-gray-600">Explore Old Delhi's monuments and markets</p>
                  </div>
                  <div className="mt-4 sm:mt-0 text-right">
                    <p className="text-gray-900 font-medium">June 25, 2024</p>
                    <p className="text-gray-600">7 days</p>
                  </div>
                </div>
                <button className="mt-4 text-primary-600 hover:text-primary-500 font-medium">
                  Learn More &rarr;
                </button>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex flex-wrap items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Rajasthan Forts & Palaces</h3>
                    <p className="text-gray-600">Experience the royal heritage of Rajasthan</p>
                  </div>
                  <div className="mt-4 sm:mt-0 text-right">
                    <p className="text-gray-900 font-medium">July 10, 2024</p>
                    <p className="text-gray-600">10 days</p>
                  </div>
                </div>
                <button className="mt-4 text-primary-600 hover:text-primary-500 font-medium">
                  Learn More &rarr;
                </button>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex flex-wrap items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">South India Temple Circuit</h3>
                    <p className="text-gray-600">Discover the spiritual architecture of South India</p>
                  </div>
                  <div className="mt-4 sm:mt-0 text-right">
                    <p className="text-gray-900 font-medium">August 5, 2024</p>
                    <p className="text-gray-600">12 days</p>
                  </div>
                </div>
                <button className="mt-4 text-primary-600 hover:text-primary-500 font-medium">
                  Learn More &rarr;
                </button>
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Custom Group Tours</h2>
            <p className="text-gray-700 mb-4">
              Want to create a custom group tour for your organization, school, or community? 
              Our team can design a tailored cultural experience just for you.
            </p>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Request Custom Tour
            </button>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Contact Us</h2>
            <p className="text-gray-700 mb-4">
              For inquiries about group tours, please contact us at:
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

export default GroupToursPage