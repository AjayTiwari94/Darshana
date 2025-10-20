'use client'

import React from 'react'
import { Shield, Lock, Key, Eye, AlertTriangle, CheckCircle } from 'lucide-react'

const SecurityPage = () => {
  const securityFeatures = [
    {
      icon: Shield,
      title: 'Data Encryption',
      description: 'All data is encrypted in transit and at rest using industry-standard encryption protocols.'
    },
    {
      icon: Lock,
      title: 'Secure Authentication',
      description: 'Multi-factor authentication and secure password policies to protect your account.'
    },
    {
      icon: Key,
      title: 'Access Controls',
      description: 'Role-based access controls ensure only authorized personnel can access sensitive data.'
    },
    {
      icon: Eye,
      title: 'Monitoring',
      description: '24/7 monitoring of our systems for suspicious activity and potential threats.'
    }
  ]

  const securityPractices = [
    {
      title: 'Regular Security Audits',
      description: 'We conduct regular security audits and penetration testing to identify and address vulnerabilities.'
    },
    {
      title: 'Employee Training',
      description: 'All staff receive regular security training to recognize and respond to potential threats.'
    },
    {
      title: 'Incident Response',
      description: 'We have a comprehensive incident response plan to quickly address any security issues.'
    },
    {
      title: 'Compliance',
      description: 'We comply with relevant data protection regulations and industry security standards.'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center mb-12">
            <Shield className="h-16 w-16 text-primary-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Security at Darshana</h1>
            <p className="text-xl text-gray-600">
              Your security and privacy are our top priorities
            </p>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-6">
              At Darshana, we are committed to protecting your personal information and ensuring the 
              security of our platform. We implement a comprehensive set of security measures designed 
              to safeguard your data and provide you with a secure experience.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Our Security Measures</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {securityFeatures.map((feature, index) => {
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
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Security Practices</h2>
            
            <div className="space-y-6 mb-8">
              {securityPractices.map((practice, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">{practice.title}</h3>
                    <p className="text-gray-600 mt-1">{practice.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">How We Protect Your Data</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li><strong>Encryption:</strong> All data is encrypted both in transit and at rest using AES-256 encryption</li>
              <li><strong>Authentication:</strong> Multi-factor authentication and secure password requirements</li>
              <li><strong>Access Controls:</strong> Role-based access ensures only authorized personnel can access sensitive data</li>
              <li><strong>Monitoring:</strong> Continuous monitoring for suspicious activity and potential threats</li>
              <li><strong>Backups:</strong> Regular automated backups with encryption and secure storage</li>
              <li><strong>Compliance:</strong> Adherence to industry security standards and data protection regulations</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Reporting Security Issues</h2>
            <p className="text-gray-700 mb-4">
              If you believe you've found a security vulnerability in our platform, please report it to us immediately. 
              We encourage responsible disclosure and will work with you to address any issues promptly.
            </p>
            <p className="text-gray-700 mb-4">
              To report a security issue, please contact our security team at:
            </p>
            <p className="text-gray-700 mb-4">
              Email: security@darshana.com<br />
              Please include detailed information about the vulnerability and steps to reproduce it.
            </p>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>Important:</strong> Please do not publicly disclose security vulnerabilities 
                    before we have had a chance to address them.
                  </p>
                </div>
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Stay Secure</h2>
            <p className="text-gray-700 mb-4">
              While we take extensive measures to secure our platform, you can also help protect your account:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li>Use a strong, unique password for your Darshana account</li>
              <li>Enable two-factor authentication when available</li>
              <li>Keep your software and devices up to date</li>
              <li>Be cautious of phishing attempts and suspicious emails</li>
              <li>Log out of your account when using shared or public devices</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about our security practices or concerns about your account security, 
              please contact us at:
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

export default SecurityPage