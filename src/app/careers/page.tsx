'use client'

import React from 'react'
import { Briefcase, Mail, Users } from 'lucide-react'

const CareersPage = () => {
  const positions = [
    {
      title: 'Software Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time'
    },
    {
      title: 'Content Writer',
      department: 'Content',
      location: 'New Delhi, India',
      type: 'Full-time'
    },
    {
      title: 'UI/UX Designer',
      department: 'Design',
      location: 'Remote',
      type: 'Full-time'
    },
    {
      title: 'Cultural Historian',
      department: 'Content',
      location: 'New Delhi, India',
      type: 'Part-time'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center mb-12">
            <Briefcase className="h-16 w-16 text-primary-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Careers at Darshana</h1>
            <p className="text-xl text-gray-600">
              Join our mission to reimagine cultural heritage
            </p>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-6">
              At Darshana, we're building more than just a platform - we're creating a bridge between 
              ancient wisdom and modern technology. We're looking for passionate individuals who share 
              our vision and want to be part of something meaningful.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Why Work With Us?</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>Be part of a mission-driven company with real social impact</li>
              <li>Work with cutting-edge technology in cultural heritage</li>
              <li>Flexible work arrangements and remote work options</li>
              <li>Competitive compensation and benefits</li>
              <li>Continuous learning and professional development opportunities</li>
              <li>Diverse and inclusive workplace</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Open Positions</h2>
            <div className="space-y-4 mb-8">
              {positions.map((position, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900">{position.title}</h3>
                  <div className="flex flex-wrap gap-4 mt-2">
                    <span className="inline-flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-1" />
                      {position.department}
                    </span>
                    <span className="inline-flex items-center text-sm text-gray-500">
                      <Mail className="h-4 w-4 mr-1" />
                      {position.location}
                    </span>
                    <span className="text-sm text-gray-500">{position.type}</span>
                  </div>
                  <button className="mt-4 text-primary-600 hover:text-primary-500 font-medium">
                    View Details &rarr;
                  </button>
                </div>
              ))}
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">How to Apply</h2>
            <p className="text-gray-700 mb-4">
              If you're interested in any of our open positions or would like to learn more about 
              opportunities at Darshana, please send your resume and a brief introduction to:
            </p>
            <p className="text-gray-700 mb-4">
              Email: careers@darshana.com<br />
              Subject: Career Inquiry
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Contact Us</h2>
            <p className="text-gray-700 mb-4">
              For general inquiries about careers at Darshana, please contact us at:
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

export default CareersPage