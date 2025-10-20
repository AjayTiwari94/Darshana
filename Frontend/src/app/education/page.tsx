'use client'

import React from 'react'
import { BookOpen, GraduationCap, Users, Award } from 'lucide-react'

const EducationPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center mb-12">
            <GraduationCap className="h-16 w-16 text-primary-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Educational Programs</h1>
            <p className="text-xl text-gray-600">
              Enriching learning experiences for students and educators
            </p>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-6">
              Darshana's educational programs bring India's cultural heritage to life for students 
              and educators through immersive, interactive learning experiences that go beyond 
              traditional textbooks and classrooms.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Program Offerings</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li><strong>School Programs:</strong> Curriculum-aligned heritage education for K-12 students</li>
              <li><strong>University Partnerships:</strong> Research collaborations and academic programs</li>
              <li><strong>Teacher Training:</strong> Professional development workshops for educators</li>
              <li><strong>Virtual Field Trips:</strong> Immersive online experiences for remote learning</li>
              <li><strong>Research Grants:</strong> Funding opportunities for cultural heritage research</li>
              <li><strong>Internship Programs:</strong> Hands-on experience in cultural preservation</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">School Programs</h2>
            <p className="text-gray-700 mb-4">
              Our school programs are designed to complement existing curricula with engaging, 
              interactive experiences that help students connect with India's cultural heritage.
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>Grade-specific content aligned with NCERT guidelines</li>
              <li>Interactive virtual tours of historical monuments</li>
              <li>Storytelling sessions with our AI cultural guide, Narad</li>
              <li>Hands-on activities and cultural workshops</li>
              <li>Educator resources and lesson plans</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">University Partnerships</h2>
            <p className="text-gray-700 mb-4">
              We collaborate with universities to advance research in cultural heritage, 
              preservation technology, and digital humanities.
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>Joint research projects on heritage preservation</li>
              <li>Access to our digital archives and datasets</li>
              <li>Guest lectures and academic workshops</li>
              <li>Student exchange programs</li>
              <li>Thesis and dissertation support</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Teacher Training</h2>
            <p className="text-gray-700 mb-4">
              Our professional development programs help educators integrate cultural heritage 
              content into their teaching practices.
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>Workshops on using technology in heritage education</li>
              <li>Training on our educational platform and tools</li>
              <li>Curriculum development support</li>
              <li>Certification programs for heritage educators</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Get Involved</h2>
            <p className="text-gray-700 mb-4">
              Interested in our educational programs? Contact our education team:
            </p>
            <p className="text-gray-700 mb-4">
              Email: education@darshana.com<br />
              Phone: +91 98765 43210
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Contact Us</h2>
            <p className="text-gray-700 mb-4">
              For general inquiries about our educational programs, please contact us at:
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

export default EducationPage