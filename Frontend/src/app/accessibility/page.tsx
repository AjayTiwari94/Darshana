'use client'

import React from 'react'
import { Eye, Ear, User, Mouse, Contrast, ZoomIn } from 'lucide-react'

const AccessibilityPage = () => {
  const accessibilityFeatures = [
    {
      icon: Eye,
      title: 'Visual Accessibility',
      description: 'High contrast mode, resizable text, and screen reader compatibility.'
    },
    {
      icon: Ear,
      title: 'Audio Accessibility',
      description: 'Audio descriptions, captions, and alternative content formats.'
    },
    {
      icon: User,
      title: 'Motor Accessibility',
      description: 'Keyboard navigation, voice commands, and alternative input methods.'
    },
    {
      icon: Mouse,
      title: 'Navigation',
      description: 'Consistent navigation patterns and clear focus indicators.'
    }
  ]

  const wcagPrinciples = [
    {
      letter: 'P',
      title: 'Perceivable',
      description: 'Information and user interface components must be presentable to users in ways they can perceive.'
    },
    {
      letter: 'O',
      title: 'Operable',
      description: 'User interface components and navigation must be operable.'
    },
    {
      letter: 'U',
      title: 'Understandable',
      description: 'Information and the operation of user interface must be understandable.'
    },
    {
      letter: 'R',
      title: 'Robust',
      description: 'Content must be robust enough that it can be interpreted reliably by a wide variety of user agents.'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center mb-12">
            <Contrast className="h-16 w-16 text-primary-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Accessibility Statement</h1>
            <p className="text-xl text-gray-600">
              Committed to making Darshana accessible to everyone
            </p>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-6">
              Darshana is committed to ensuring digital accessibility for people with disabilities. 
              We are continually improving the user experience for everyone and applying the relevant 
              accessibility standards.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Our Accessibility Commitment</h2>
            <p className="text-gray-700 mb-4">
              We strive to make our website and platform accessible to all users, including those with 
              visual, auditory, motor, or cognitive disabilities. Our goal is to meet or exceed the 
              Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Accessibility Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {accessibilityFeatures.map((feature, index) => {
                const IconComponent = feature.icon
                return (
                  <div key={index} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <div className="flex-shrink-0 p-2 bg-primary-100 rounded-lg text-primary-600">
                        <IconComponent size={24} />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 ml-4">{feature.title}</h3>
                    </div>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                )
              })}
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">WCAG Principles</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {wcagPrinciples.map((principle, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary-600">{principle.letter}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{principle.title}</h3>
                  <p className="text-gray-600 text-sm">{principle.description}</p>
                </div>
              ))}
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Technical Specifications</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>Compatibility with screen readers including JAWS, NVDA, and VoiceOver</li>
              <li>Keyboard navigation support for all interactive elements</li>
              <li>Alternative text for all images and visual content</li>
              <li>Clear and consistent navigation structure</li>
              <li>Resizable text up to 200% without loss of content or functionality</li>
              <li>Sufficient color contrast ratios for text and background elements</li>
              <li>Closed captions for video content</li>
              <li>Audio descriptions for visual content when appropriate</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Accessibility Tools</h2>
            <p className="text-gray-700 mb-4">
              We provide several tools to help you customize your experience:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li><strong>Text Size Adjuster:</strong> Increase or decrease text size using the controls in the footer</li>
              <li><strong>High Contrast Mode:</strong> Toggle high contrast mode for better visibility</li>
              <li><strong>Keyboard Navigation:</strong> Navigate the entire site using only your keyboard</li>
              <li><strong>Skip Links:</strong> Skip to main content or navigation using the skip links at the top</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Feedback and Support</h2>
            <p className="text-gray-700 mb-4">
              We welcome your feedback on the accessibility of Darshana. If you encounter accessibility 
              barriers, please let us know:
            </p>
            <p className="text-gray-700 mb-4">
              Email: accessibility@darshana.com<br />
              Phone: +91 98765 43210<br />
              Address: New Delhi, India
            </p>
            <p className="text-gray-700 mb-4">
              When you contact us, please include:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>The URL of the page where you experienced the accessibility issue</li>
              <li>A description of the problem you encountered</li>
              <li>The assistive technology you are using (if any)</li>
              <li>Your contact information so we can follow up with you</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Continuous Improvement</h2>
            <p className="text-gray-700 mb-4">
              We are committed to continuous improvement of our website's accessibility. We regularly 
              conduct accessibility audits and user testing with people with disabilities to identify 
              and address accessibility issues.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Compatibility with Browsers and Assistive Technology</h2>
            <p className="text-gray-700 mb-4">
              Our website is designed to be compatible with the following browsers:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>Chrome (latest version)</li>
              <li>Firefox (latest version)</li>
              <li>Safari (latest version)</li>
              <li>Edge (latest version)</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Our website is also compatible with the following assistive technologies:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>JAWS (latest version)</li>
              <li>NVDA (latest version)</li>
              <li>VoiceOver (latest version)</li>
              <li>Dragon NaturallySpeaking (latest version)</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about our accessibility practices or need assistance accessing 
              our content, please contact us at:
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

export default AccessibilityPage