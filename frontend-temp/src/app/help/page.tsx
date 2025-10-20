'use client'

import React, { useState } from 'react'
import { 
  HelpCircle, 
  MessageSquare, 
  Mail, 
  Search, 
  ChevronRight, 
  User, 
  Lock, 
  CreditCard, 
  Settings, 
  Globe, 
  FileText,
  AlertCircle,
  CheckCircle,
  Send,
  BookOpen // This should be available in lucide-react
} from 'lucide-react'

const HelpSupport: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('getting-started')
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')

  // FAQ data
  const faqs = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: <User className="h-5 w-5" />,
      questions: [
        {
          question: 'How do I create an account?',
          answer: 'To create an account, click on the "Sign Up" button in the top right corner of the homepage. Fill in your details and verify your email address to complete the registration process.'
        },
        {
          question: 'Can I use the platform for free?',
          answer: 'Yes, Darshana offers a free tier that allows you to explore most features. We also have premium subscriptions for advanced features and exclusive content.'
        },
        {
          question: 'How do I reset my password?',
          answer: 'Click on "Forgot Password" on the login page. Enter your email address and follow the instructions sent to your inbox to reset your password.'
        }
      ]
    },
    {
      id: 'account-management',
      title: 'Account Management',
      icon: <Settings className="h-5 w-5" />,
      questions: [
        {
          question: 'How do I update my profile information?',
          answer: 'Log in to your account and go to your profile page. Click on "Edit Profile" to update your personal information, avatar, and preferences.'
        },
        {
          question: 'How do I delete my account?',
          answer: 'You can delete your account from the Settings page under the "Danger Zone" section. Please note that this action is irreversible and will permanently delete all your data.'
        },
        {
          question: 'Can I change my email address?',
          answer: 'Yes, you can update your email address in the account settings. You will need to verify the new email address before the change takes effect.'
        }
      ]
    },
    {
      id: 'billing',
      title: 'Billing & Payments',
      icon: <CreditCard className="h-5 w-5" />,
      questions: [
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit and debit cards including Visa, Mastercard, and American Express. We also support payments through PayPal and various regional payment methods.'
        },
        {
          question: 'How do I cancel my subscription?',
          answer: 'You can cancel your subscription at any time from the Billing section in your account settings. Your subscription will remain active until the end of the current billing period.'
        },
        {
          question: 'Can I get a refund?',
          answer: 'We offer a 30-day money-back guarantee for new subscriptions. After that period, refunds are considered on a case-by-case basis. Contact our support team for assistance.'
        }
      ]
    },
    {
      id: 'technical',
      title: 'Technical Issues',
      icon: <Globe className="h-5 w-5" />,
      questions: [
        {
          question: 'The website is not loading properly. What should I do?',
          answer: 'Try refreshing the page or clearing your browser cache. If the issue persists, try accessing the site from a different browser or device. If problems continue, contact our support team.'
        },
        {
          question: 'I\'m having trouble with the virtual tour feature.',
          answer: 'Ensure your browser is up to date and that you have a stable internet connection. Virtual tours work best on modern browsers like Chrome, Firefox, or Edge. If issues persist, try restarting your browser.'
        },
        {
          question: 'The app keeps crashing on my mobile device.',
          answer: 'Try updating the app to the latest version. If that doesn\'t work, try clearing the app cache or reinstalling the app. Make sure your device meets the minimum system requirements.'
        }
      ]
    }
  ]

  // Help categories
  const helpCategories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      description: 'Learn the basics of using Darshana',
      icon: <User className="h-6 w-6" />,
      articles: 12
    },
    {
      id: 'account',
      title: 'Account & Profile',
      description: 'Manage your account settings',
      icon: <Settings className="h-6 w-6" />,
      articles: 8
    },
    {
      id: 'content',
      title: 'Content & Features',
      description: 'Explore our cultural content',
      icon: <BookOpen className="h-6 w-6" />,
      articles: 15
    },
    {
      id: 'technical',
      title: 'Technical Support',
      description: 'Troubleshoot technical issues',
      icon: <Globe className="h-6 w-6" />,
      articles: 10
    },
    {
      id: 'billing',
      title: 'Billing & Payments',
      description: 'Subscription and payment questions',
      icon: <CreditCard className="h-6 w-6" />,
      articles: 7
    },
    {
      id: 'community',
      title: 'Community Guidelines',
      description: 'Rules and best practices',
      icon: <MessageSquare className="h-6 w-6" />,
      articles: 5
    }
  ]

  const handleContactFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setContactForm(prev => ({ ...prev, [name]: value }))
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitSuccess(false)
    setSubmitError('')
    
    try {
      // In a real app, this would call an API to submit the form
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSubmitSuccess(true)
      setContactForm({
        name: '',
        email: '',
        subject: '',
        message: ''
      })
    } catch (error) {
      setSubmitError('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredFaqs = faqs.find(cat => cat.id === activeCategory)?.questions || []
  const filteredHelpCategories = helpCategories.filter(category => 
    category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 text-center">
          <HelpCircle className="h-12 w-12 text-primary-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">Help & Support</h1>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Find answers to common questions or get in touch with our support team for personalized assistance.
          </p>
          
          {/* Search */}
          <div className="mt-6 max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Search for help articles..."
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Help Categories */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Browse Help Topics</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredHelpCategories.map((category) => (
                  <div 
                    key={category.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-sm transition-all cursor-pointer"
                    onClick={() => setActiveCategory(category.id)}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 p-2 bg-primary-100 rounded-lg text-primary-600">
                        {category.icon}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900">{category.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                        <div className="flex items-center mt-2 text-xs text-gray-400">
                          <FileText className="h-3 w-3 mr-1" />
                          <span>{category.articles} articles</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {faqs.find(cat => cat.id === activeCategory)?.title || 'Frequently Asked Questions'}
              </h2>
              <div className="space-y-4">
                {filteredFaqs.map((faq, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg">
                    <button
                      className="w-full flex justify-between items-center p-4 text-left focus:outline-none"
                      onClick={() => {
                        const element = document.getElementById(`faq-${index}`)
                        if (element) {
                          element.classList.toggle('hidden')
                        }
                      }}
                    >
                      <span className="text-sm font-medium text-gray-900">{faq.question}</span>
                      <ChevronRight className="h-5 w-5 text-gray-400 transform rotate-90" />
                    </button>
                    <div id={`faq-${index}`} className="hidden px-4 pb-4 text-sm text-gray-600 border-t border-gray-200">
                      {faq.answer}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Support</h2>
              {submitSuccess ? (
                <div className="rounded-md bg-green-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">Message sent successfully!</h3>
                      <div className="mt-2 text-sm text-green-700">
                        <p>We'll get back to you as soon as possible.</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  {submitError && (
                    <div className="rounded-md bg-red-50 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <AlertCircle className="h-5 w-5 text-red-400" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">{submitError}</h3>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={contactForm.name}
                        onChange={handleContactFormChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={contactForm.email}
                        onChange={handleContactFormChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={contactForm.subject}
                      onChange={handleContactFormChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={contactForm.message}
                      onChange={handleContactFormChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="flex items-center text-sm text-gray-600 hover:text-primary-600">
                    <BookOpen className="h-4 w-4 mr-2" />
                    User Guide
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center text-sm text-gray-600 hover:text-primary-600">
                    <FileText className="h-4 w-4 mr-2" />
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center text-sm text-gray-600 hover:text-primary-600">
                    <Lock className="h-4 w-4 mr-2" />
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center text-sm text-gray-600 hover:text-primary-600">
                    <Settings className="h-4 w-4 mr-2" />
                    System Status
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Us</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-600">tiwari.ajay936@outlook.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Community */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Community</h3>
              <p className="text-sm text-gray-600 mb-4">
                Join our community of cultural enthusiasts to share experiences and get help from fellow users.
              </p>
              <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                <MessageSquare className="h-4 w-4 mr-2" />
                Join Community
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HelpSupport