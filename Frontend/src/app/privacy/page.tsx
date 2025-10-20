'use client'

import React from 'react'

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-6">
              At Darshana, we respect your privacy and are committed to protecting your personal data. 
              This privacy policy will inform you about how we look after your personal data when you 
              visit our website and tell you about your privacy rights and how the law protects you.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Important Information and Who We Are</h2>
            <p className="text-gray-700 mb-4">
              Darshana is the controller and responsible for your personal data. We have appointed a 
              data privacy officer who is responsible for overseeing questions in relation to this 
              privacy policy. If you have any questions about this privacy policy, including any 
              requests to exercise your legal rights, please contact us using the details below.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. The Data We Collect About You</h2>
            <p className="text-gray-700 mb-4">
              We may collect, use, store and transfer different kinds of personal data about you which 
              we have grouped together as follows:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
              <li><strong>Identity Data</strong> including first name, last name, username or similar identifier</li>
              <li><strong>Contact Data</strong> including billing address, delivery address, email address and telephone numbers</li>
              <li><strong>Technical Data</strong> including internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform and other technology on the devices you use to access this website</li>
              <li><strong>Usage Data</strong> including information about how you use our website, products and services</li>
              <li><strong>Marketing and Communications Data</strong> including your preferences in receiving marketing from us and your communication preferences</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. How We Use Your Personal Data</h2>
            <p className="text-gray-700 mb-4">
              We will only use your personal data when the law allows us to. Most commonly, we will use 
              your personal data in the following circumstances:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
              <li>Where we need to perform the contract we are about to enter into or have entered into with you</li>
              <li>Where it is necessary for our legitimate interests and your interests and fundamental rights do not override those interests</li>
              <li>Where we need to comply with a legal or regulatory obligation</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Cookies</h2>
            <p className="text-gray-700 mb-4">
              We use cookies to distinguish you from other users of our website. This helps us to provide 
              you with a good experience when you browse our website and also allows us to improve our site.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Data Security</h2>
            <p className="text-gray-700 mb-4">
              We have put in place appropriate security measures to prevent your personal data from 
              being accidentally lost, used or accessed in an unauthorised way, altered or disclosed.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Data Retention</h2>
            <p className="text-gray-700 mb-4">
              We will only retain your personal data for as long as necessary to fulfil the purposes 
              we collected it for, including for the purposes of satisfying any legal, accounting, 
              or reporting requirements.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Your Legal Rights</h2>
            <p className="text-gray-700 mb-4">
              Under certain circumstances, you have rights under data protection laws in relation to 
              your personal data, including the right to request access, correction, erasure, 
              restriction, transfer, or to object to processing.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about this privacy policy or our privacy practices, please 
              contact us at:
            </p>
            <p className="text-gray-700 mb-4">
              Email: tiwari.ajay936@outlook.com<br />
              Phone: +91 98765 43210<br />
              Address: New Delhi, India
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicyPage