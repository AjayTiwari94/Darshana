'use client'

import React from 'react'

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
          <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-6">
              Welcome to Darshana. These terms of service outline the rules and regulations for the use 
              of Darshana's website and services. By accessing this website, we assume you accept these 
              terms of service in full. Do not continue to use Darshana's website if you do not accept 
              all of the terms of service stated on this page.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. License to Use Website</h2>
            <p className="text-gray-700 mb-4">
              Unless otherwise stated, Darshana and/or its licensors own the intellectual property 
              rights in the website and material on the website. Subject to the license below, all 
              these intellectual property rights are reserved.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. User Content</h2>
            <p className="text-gray-700 mb-4">
              In these terms of service, "your user content" means material (including without limitation text, 
              images, audio material, video material and audio-visual material) that you submit to this 
              website, for whatever purpose.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. No Warranties</h2>
            <p className="text-gray-700 mb-4">
              This website is provided "as is" without any representations or warranties, express or 
              implied. Darshana makes no representations or warranties in relation to this website 
              or the information and materials provided on this website.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Limitations of Liability</h2>
            <p className="text-gray-700 mb-4">
              Darshana will not be liable to you (whether under the law of contact, the law of torts 
              or otherwise) in relation to the contents of, or use of, or otherwise in connection with, 
              this website for any indirect, special or consequential loss; or for any business losses, 
              loss of revenue, income, profits or anticipated savings, loss of contracts or business 
              relationships, loss of reputation or goodwill, or loss or corruption of information or data.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Subscription and Payments</h2>
            <p className="text-gray-700 mb-4">
              Some features of Darshana require payment of fees. By purchasing a subscription, you agree 
              to pay all fees and applicable taxes. All fees are non-refundable except as expressly 
              provided in these terms.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. User Responsibilities</h2>
            <p className="text-gray-700 mb-4">
              As a user, you are responsible for maintaining the confidentiality of your account and 
              password and for restricting access to your computer. You agree to accept responsibility 
              for all activities that occur under your account or password.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Prohibited Activities</h2>
            <p className="text-gray-700 mb-4">
              You may not use this website in any way that causes, or may cause, damage to the website 
              or impairment of the availability or accessibility of the website; or in any way which 
              is unlawful, illegal, fraudulent or harmful, or in connection with any unlawful, illegal, 
              fraudulent or harmful purpose or activity.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. Changes to These Terms</h2>
            <p className="text-gray-700 mb-4">
              Darshana reserves the right, at its sole discretion, to modify or replace these Terms at 
              any time. If a revision is material, we will try to provide at least 30 days' notice prior 
              to any new terms taking effect.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. Contact Information</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about these Terms of Service, please contact us at:
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

export default TermsOfServicePage