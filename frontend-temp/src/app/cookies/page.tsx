'use client'

import React from 'react'

const CookiePolicyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cookie Policy</h1>
          <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-6">
              This Cookie Policy explains how Darshana ("we", "us", or "our") uses cookies and similar 
              technologies to recognize you when you visit our website at [darshana.com]. It explains 
              what these technologies are and why we use them, as well as your rights to control our use 
              of them.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. What are Cookies?</h2>
            <p className="text-gray-700 mb-4">
              Cookies are small data files that are placed on your computer or mobile device when you 
              visit a website. Cookies are widely used by website owners in order to make their websites 
              work, or to work more efficiently, as well as to provide reporting information.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Why Do We Use Cookies?</h2>
            <p className="text-gray-700 mb-4">
              We use first party and third party cookies for several reasons. Some cookies are required 
              for technical reasons in order for our website to operate, and we refer to these as 
              "essential" or "strictly necessary" cookies. Other cookies also enable us to track and 
              target the interests of our users to enhance the experience on our website.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. Types of Cookies We Use</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Essential Cookies</h3>
            <p className="text-gray-700 mb-4">
              These cookies are strictly necessary to provide you with services available through our 
              website and to use some of its features, such as access to secure areas.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Performance Cookies</h3>
            <p className="text-gray-700 mb-4">
              These cookies collect information about how visitors use our website, for instance which 
              pages visitors go to most often, and if they get error messages from web pages. These 
              cookies don't collect information that identifies a visitor.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Functionality Cookies</h3>
            <p className="text-gray-700 mb-4">
              These cookies allow our website to remember choices you make (such as your user name, 
              language or the region you are in) and provide enhanced, more personal features.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Targeting Cookies</h3>
            <p className="text-gray-700 mb-4">
              These cookies are used to deliver advertisements more relevant to you and your interests. 
              They are also used to limit the number of times you see an advertisement as well as help 
              measure the effectiveness of the advertising campaign.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. How Can You Control Cookies?</h2>
            <p className="text-gray-700 mb-4">
              You have the right to decide whether to accept or reject cookies. You can set or amend 
              your web browser controls to accept or refuse cookies. If you choose to reject cookies, 
              you may still use our website though your access to some functionality and areas of our 
              website may be restricted.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Changes to This Cookie Policy</h2>
            <p className="text-gray-700 mb-4">
              We may update this Cookie Policy from time to time in order to reflect, for example, 
              changes to the cookies we use or for other operational, legal or regulatory reasons. 
              Please therefore re-visit this Cookie Policy regularly to stay informed about our use 
              of cookies and related technologies.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about our use of cookies or other technologies, please contact us at:
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

export default CookiePolicyPage