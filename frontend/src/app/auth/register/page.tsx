'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { apiCall } from '@/lib/api'

interface FormData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  preferences: {
    language: string
    interests: string[]
  }
}

const RegisterPage = () => {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    preferences: {
      language: 'en',
      interests: []
    }
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState(1)
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    match: false
  })

  const interests = [
    'History', 'Architecture', 'Mythology', 'Archaeology', 
    'Art & Culture', 'Religious Sites', 'Photography', 'Nature'
  ]

  // Initialize password validation on component mount
  useEffect(() => {
    validatePassword(formData.password, formData.confirmPassword)
  }, [])

  const validatePassword = (password: string, confirmPassword: string = formData.confirmPassword) => {
    const validation = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      match: password === confirmPassword && password.length > 0
    }
    setPasswordValidation(validation)
    return validation
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent as keyof FormData] as any,
          [child]: value
        }
      })
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
      
      // Real-time password validation
      if (name === 'password') {
        validatePassword(value, formData.confirmPassword)
      } else if (name === 'confirmPassword') {
        validatePassword(formData.password, value)
      }
    }
    if (error) setError('')
  }

  const handleInterestToggle = (interest: string) => {
    const updatedInterests = formData.preferences.interests.includes(interest)
      ? formData.preferences.interests.filter(i => i !== interest)
      : [...formData.preferences.interests, interest]
    
    setFormData({
      ...formData,
      preferences: {
        ...formData.preferences,
        interests: updatedInterests
      }
    })
  }

  const validateStep1 = () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError('Please fill in all required fields')
      return false
    }
    
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address')
      return false
    }
    
    const validation = validatePassword(formData.password, formData.confirmPassword)
    
    if (!validation.length) {
      setError('Password must be at least 8 characters long')
      return false
    }
    
    if (!validation.uppercase || !validation.lowercase || !validation.number) {
      setError('Password must contain at least one lowercase letter, one uppercase letter, and one number')
      return false
    }
    
    if (!validation.match) {
      setError('Passwords do not match')
      return false
    }
    
    return true
  }

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2)
      setError('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await apiCall('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(formData)
      })
      
      const data = await response.json()
      
      if (data.success) {
        router.push('/auth/login?message=Registration successful! Please log in.')
      } else {
        // Handle validation errors from backend
        if (data.errors && Array.isArray(data.errors)) {
          setError(data.errors.map((err: any) => err.msg).join(', '))
        } else {
          setError(data.message || 'Registration failed')
        }
      }
    } catch (err) {
      setError('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-orange-100">
            <span className="text-2xl font-bold text-orange-600">D</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Join Darshana
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Create your account and start exploring India's heritage
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center space-x-2">
          <div className={`h-2 w-8 rounded-full ${step >= 1 ? 'bg-orange-600' : 'bg-gray-300'}`}></div>
          <div className={`h-2 w-8 rounded-full ${step >= 2 ? 'bg-orange-600' : 'bg-gray-300'}`}></div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={step === 1 ? (e) => { e.preventDefault(); handleNextStep() } : handleSubmit}>
          {step === 1 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  placeholder="Password (min. 8 chars, A-Z, a-z, 0-9)"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center pt-6"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>

              <div className="relative">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center pt-6"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              
              {/* Live Password Validation Indicators */}
              {formData.password && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</h4>
                  <div className="space-y-1">
                    <div className={`flex items-center text-xs ${passwordValidation.length ? 'text-green-600' : 'text-red-500'}`}>
                      <span className="mr-2">{passwordValidation.length ? '✓' : '✗'}</span>
                      At least 8 characters
                    </div>
                    <div className={`flex items-center text-xs ${passwordValidation.uppercase ? 'text-green-600' : 'text-red-500'}`}>
                      <span className="mr-2">{passwordValidation.uppercase ? '✓' : '✗'}</span>
                      One uppercase letter (A-Z)
                    </div>
                    <div className={`flex items-center text-xs ${passwordValidation.lowercase ? 'text-green-600' : 'text-red-500'}`}>
                      <span className="mr-2">{passwordValidation.lowercase ? '✓' : '✗'}</span>
                      One lowercase letter (a-z)
                    </div>
                    <div className={`flex items-center text-xs ${passwordValidation.number ? 'text-green-600' : 'text-red-500'}`}>
                      <span className="mr-2">{passwordValidation.number ? '✓' : '✗'}</span>
                      One number (0-9)
                    </div>
                    {formData.confirmPassword && (
                      <div className={`flex items-center text-xs ${passwordValidation.match ? 'text-green-600' : 'text-red-500'}`}>
                        <span className="mr-2">{passwordValidation.match ? '✓' : '✗'}</span>
                        Passwords match
                      </div>
                    )}
                  </div>
                  {passwordValidation.length && passwordValidation.uppercase && passwordValidation.lowercase && passwordValidation.number && passwordValidation.match && (
                    <div className="mt-2 text-xs text-green-600 font-medium">
                      ✓ All requirements met! Password is strong.
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label htmlFor="preferences.language" className="block text-sm font-medium text-gray-700">
                  Preferred Language
                </label>
                <select
                  id="preferences.language"
                  name="preferences.language"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  value={formData.preferences.language}
                  onChange={handleChange}
                >
                  <option value="en">English</option>
                  <option value="hi">हिंदी (Hindi)</option>
                  <option value="bn">বাংলা (Bengali)</option>
                  <option value="ta">தமிழ் (Tamil)</option>
                  <option value="te">తెలుగు (Telugu)</option>
                  <option value="mr">मराठी (Marathi)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Your Interests (Select all that apply)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {interests.map((interest) => (
                    <label key={interest} className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                        checked={formData.preferences.interests.includes(interest)}
                        onChange={() => handleInterestToggle(interest)}
                      />
                      <span className="ml-2 text-sm text-gray-700">{interest}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <div className="flex space-x-4">
            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Back
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading || (step === 1 && (!passwordValidation.length || !passwordValidation.uppercase || !passwordValidation.lowercase || !passwordValidation.number || !passwordValidation.match))}
              className="flex-1 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : step === 1 ? (
                'Next'
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>

        <div className="text-center">
          <span className="text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/auth/login" className="font-medium text-orange-600 hover:text-orange-500">
              Sign in
            </a>
          </span>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage