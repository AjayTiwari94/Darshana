'use client'

import React, { useState } from 'react'
import { MessageSquare, ThumbsUp, Lightbulb, Heart, Send, CheckCircle, AlertCircle } from 'lucide-react'

const FeedbackPage = () => {
  const [feedbackType, setFeedbackType] = useState('general')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const feedbackTypes = [
    {
      id: 'general',
      title: 'General Feedback',
      icon: MessageSquare,
      description: 'Share your overall experience with Darshana'
    },
    {
      id: 'bug',
      title: 'Report a Bug',
      icon: AlertCircle,
      description: 'Let us know about technical issues or problems'
    },
    {
      id: 'feature',
      title: 'Feature Request',
      icon: Lightbulb,
      description: 'Suggest new features or improvements'
    },
    {
      id: 'compliment',
      title: 'Compliment',
      icon: ThumbsUp,
      description: 'Tell us what you love about Darshana'
    }
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitSuccess(false)
    setSubmitError('')
    
    try {
      // In a real application, this would send the feedback to your backend
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSubmitSuccess(true)
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      })
    } catch (error) {
      setSubmitError('Failed to send feedback. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Heart className="h-16 w-16 text-primary-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">We Value Your Feedback</h1>
          <p className="text-xl text-gray-600">
            Help us improve Darshana by sharing your thoughts and experiences
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          {submitSuccess ? (
            <div className="text-center py-12">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You for Your Feedback!</h2>
              <p className="text-gray-600 mb-6">
                We appreciate you taking the time to share your thoughts with us. Your feedback helps 
                us make Darshana better for everyone.
              </p>
              <button
                onClick={() => {
                  setSubmitSuccess(false)
                  setFeedbackType('general')
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
              >
                Send More Feedback
              </button>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">What type of feedback are you sharing?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {feedbackTypes.map((type) => {
                    const IconComponent = type.icon
                    return (
                      <button
                        key={type.id}
                        onClick={() => setFeedbackType(type.id)}
                        className={`p-4 text-left rounded-lg border-2 ${
                          feedbackType === type.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0 p-2 bg-primary-100 rounded-lg text-primary-600">
                            <IconComponent size={20} />
                          </div>
                          <div className="ml-3">
                            <h3 className="font-medium text-gray-900">{type.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">{type.description}</p>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
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
                      value={formData.name}
                      onChange={handleChange}
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
                      value={formData.email}
                      onChange={handleChange}
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
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Your Feedback
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Please provide as much detail as possible..."
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
                        Send Feedback
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Other Ways to Connect</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center">
              <MessageSquare className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900">Live Chat</h3>
              <p className="text-sm text-gray-500 mt-1">Chat with our support team</p>
              <button className="mt-2 text-primary-600 hover:text-primary-500 text-sm font-medium">
                Start Chat
              </button>
            </div>
            <div className="text-center">
              <Send className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900">Email Us</h3>
              <p className="text-sm text-gray-500 mt-1">tiwari.ajay936@outlook.com</p>
              <a href="mailto:tiwari.ajay936@outlook.com" className="mt-2 text-primary-600 hover:text-primary-500 text-sm font-medium">
                Send Email
              </a>
            </div>
            <div className="text-center">
              <Heart className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900">Social Media</h3>
              <p className="text-sm text-gray-500 mt-1">Connect with us on social platforms</p>
              <button className="mt-2 text-primary-600 hover:text-primary-500 text-sm font-medium">
                Follow Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeedbackPage