'use client'

import React from 'react'
import { Users, Mail, Phone } from 'lucide-react'

const TeamPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center mb-12">
            <Users className="h-16 w-16 text-primary-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Team</h1>
            <p className="text-xl text-gray-600">
              Meet the passionate people behind Darshana
            </p>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-6">
              At Darshana, we're a diverse team of technologists, cultural enthusiasts, historians, 
              and storytellers who share a common passion for preserving and sharing India's rich 
              cultural heritage.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Our Leadership</h2>
            <p className="text-gray-700 mb-6">
              Our leadership team brings together decades of experience in technology, cultural 
              preservation, and education to guide Darshana's mission.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Our Culture</h2>
            <p className="text-gray-700 mb-6">
              We foster a culture of innovation, collaboration, and respect for cultural heritage. 
              Our team members come from diverse backgrounds but share a commitment to excellence 
              and making cultural knowledge accessible to all.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Join Our Team</h2>
            <p className="text-gray-700 mb-4">
              We're always looking for passionate individuals to join our mission. If you're 
              interested in working with us, we'd love to hear from you.
            </p>
            <p className="text-gray-700 mb-4">
              Email: careers@darshana.com<br />
              Phone: +91 98765 43210
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Contact Us</h2>
            <p className="text-gray-700 mb-4">
              For general inquiries about our team, please contact us at:
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

export default TeamPage