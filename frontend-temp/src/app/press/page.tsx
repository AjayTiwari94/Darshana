'use client'

import React from 'react'
import { Newspaper, Mail, Phone } from 'lucide-react'

const PressPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center mb-12">
            <Newspaper className="h-16 w-16 text-primary-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Press & Media</h1>
            <p className="text-xl text-gray-600">
              Resources for journalists and media professionals
            </p>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-6">
              Welcome to Darshana's press center. Here you'll find resources, press releases, 
              and contact information for media inquiries.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Press Releases</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>Darshana Launches Revolutionary AI Cultural Guide - June 2024</li>
              <li>Darshana Partners with Archaeological Survey of India - May 2024</li>
              <li>Darshana Announces Series A Funding - April 2024</li>
              <li>Darshana Expands to 100+ Monuments - March 2024</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Media Kit</h2>
            <p className="text-gray-700 mb-4">
              Our media kit includes high-resolution logos, product screenshots, 
              and executive headshots.
            </p>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Download Media Kit
            </button>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Press Contact</h2>
            <p className="text-gray-700 mb-4">
              For media inquiries, interviews, or press requests, please contact our press team:
            </p>
            <p className="text-gray-700 mb-4">
              Email: press@darshana.com<br />
              Phone: +91 98765 43210<br />
              Twitter: @DarshanaPress
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Company Facts</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>Founded: 2024</li>
              <li>Headquarters: New Delhi, India</li>
              <li>Employees: 25+</li>
              <li>Monuments Covered: 100+</li>
              <li>Users: 50,000+</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Contact Us</h2>
            <p className="text-gray-700 mb-4">
              For general inquiries, please contact us at:
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

export default PressPage