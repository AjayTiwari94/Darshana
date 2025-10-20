'use client'

import React, { useState } from 'react'
import { Search, ChevronRight } from 'lucide-react'

const FAQPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('general')

  const faqCategories = [
    {
      id: 'general',
      title: 'General Questions',
      icon: '❓'
    },
    {
      id: 'account',
      title: 'Account & Profile',
      icon: '👤'
    },
    {
      id: 'features',
      title: 'Platform Features',
      icon: '⚙️'
    },
    {
      id: 'technical',
      title: 'Technical Issues',
      icon: '💻'
    },
    {
      id: 'billing',
      title: 'Billing & Payments',
      icon: '💳'
    }
  ]

  const faqs = {
    general: [
      {
        question: 'What is Darshana?',
        answer: 'Darshana is an innovative platform that reimagines cultural heritage exploration through AI-powered storytelling, immersive experiences, and interactive content. We bring India\'s rich cultural legacy to life through technology.'
      },
      {
        question: 'Is Darshana free to use?',
        answer: 'Darshana offers both free and premium content. Basic features and a selection of stories are available for free, while premium content and advanced features require a subscription. Check our pricing page for more details.'
      },
      {
        question: 'In which languages is Darshana available?',
        answer: 'Currently, Darshana is available in English and Hindi, with plans to expand to other regional languages including Tamil, Telugu, Bengali, and Marathi. Our AI guide, Narad, supports multilingual interactions.'
      },
      {
        question: 'How can I contribute to Darshana?',
        answer: 'We welcome contributions from historians, cultural experts, writers, and enthusiasts. You can contribute stories, research, translations, or multimedia content. Contact us through our contribution portal to get started.'
      }
    ],
    account: [
      {
        question: 'How do I create an account?',
        answer: 'Click on the "Sign Up" button in the top right corner of any page. Fill in your details and verify your email address to complete registration. You can also sign up using your Google or Facebook account.'
      },
      {
        question: 'How do I reset my password?',
        answer: 'Click on "Forgot Password" on the login page. Enter your email address and follow the instructions sent to your inbox to reset your password.'
      },
      {
        question: 'Can I delete my account?',
        answer: 'Yes, you can delete your account from the Settings page under the "Danger Zone" section. Please note that this action is irreversible and will permanently delete all your data.'
      },
      {
        question: 'How do I update my profile information?',
        answer: 'Log in to your account and go to your profile page. Click on "Edit Profile" to update your personal information, avatar, and preferences.'
      }
    ],
    features: [
      {
        question: 'What is Narad AI Guide?',
        answer: 'Narad AI is your intelligent cultural companion that brings India\'s rich heritage to life through interactive conversations. Named after the legendary storyteller from Hindu mythology, this AI guide provides personalized narratives based on your interests and location.'
      },
      {
        question: 'How does Virtual Visit work?',
        answer: 'Virtual Visit allows you to explore India\'s magnificent monuments from anywhere in the world using augmented reality (AR) and virtual reality (VR) technologies. Experience these sites as they were in their prime, with interactive elements that make history come alive.'
      },
      {
        question: 'What is Treasure Hunt?',
        answer: 'Treasure Hunt is a gamified way to explore India\'s cultural heritage. Solve puzzles, decode riddles based on folklore, and complete challenges to unlock rewards and discover hidden stories about monuments and traditions.'
      },
      {
        question: 'What content is available in Story Hub?',
        answer: 'Story Hub features a comprehensive multimedia library with articles, videos, podcasts, and illustrated comics about heritage sites. Content is created by historians, cultural experts, and storytellers.'
      }
    ],
    technical: [
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
      },
      {
        question: 'Why are some features not working?',
        answer: 'Some features may still be in development or beta testing. Check our roadmap or contact support for updates on feature availability.'
      }
    ],
    billing: [
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
      },
      {
        question: 'Do you offer discounts for students or educators?',
        answer: 'Yes, we offer special pricing for students and educators. Please contact our support team with proof of your status to receive a discount code.'
      }
    ]
  }

  const filteredFaqs = faqs[activeCategory as keyof typeof faqs] || []

  const allFaqs = Object.values(faqs).flat()
  const searchResults = searchQuery 
    ? allFaqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions about Darshana and its features.
          </p>
          
          {/* Search */}
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Search for answers..."
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
              <nav className="space-y-1">
                {faqCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setActiveCategory(category.id)
                      setSearchQuery('')
                    }}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      activeCategory === category.id
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-3">{category.icon}</span>
                    <span>{category.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* FAQ Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {searchQuery ? (
                <>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Search Results for "{searchQuery}"
                  </h2>
                  <div className="space-y-4">
                    {searchResults.length > 0 ? (
                      searchResults.map((faq, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg">
                          <button
                            className="w-full flex justify-between items-center p-4 text-left focus:outline-none"
                            onClick={() => {
                              const element = document.getElementById(`search-faq-${index}`)
                              if (element) {
                                element.classList.toggle('hidden')
                              }
                            }}
                          >
                            <span className="text-sm font-medium text-gray-900">{faq.question}</span>
                            <ChevronRight className="h-5 w-5 text-gray-400 transform rotate-90" />
                          </button>
                          <div id={`search-faq-${index}`} className="hidden px-4 pb-4 text-sm text-gray-600 border-t border-gray-200">
                            {faq.answer}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-gray-500">No results found for "{searchQuery}"</p>
                        <button
                          onClick={() => setSearchQuery('')}
                          className="mt-4 text-primary-600 hover:text-primary-500"
                        >
                          Clear search
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    {faqCategories.find(cat => cat.id === activeCategory)?.title}
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
                </>
              )}
            </div>

            {/* Still Need Help */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Still Need Help?</h2>
                <p className="text-gray-600 mb-6">
                  Can't find the answer you're looking for? We're here to help.
                </p>
                <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <a
                    href="/contact"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                  >
                    Contact Support
                  </a>
                  <a
                    href="/help"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Visit Help Center
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FAQPage