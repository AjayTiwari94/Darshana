'use client'

import React, { useState, useEffect } from 'react'
import { useAuthStore, useUIStore } from '@/store'
import { useRouter } from 'next/navigation'
import { 
  Settings, 
  Shield, 
  Bell, 
  Palette, 
  Database, 
  Users, 
  Mail, 
  CreditCard, 
  Globe, 
  Save, 
  Eye, 
  EyeOff,
  Key,
  Lock
} from 'lucide-react'

const AdminSettings: React.FC = () => {
  const { user, isAuthenticated, token } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/auth/login')
    }
  }, [isAuthenticated, user, router])

  // System settings
  const [systemSettings, setSystemSettings] = useState({
    siteName: 'Darshana',
    siteDescription: 'Explore India\'s Cultural Heritage',
    maintenanceMode: false,
    registrationEnabled: true,
    emailVerificationRequired: true
  })

  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireLowercase: true,
    passwordRequireNumbers: true,
    passwordRequireSpecialChars: true,
    sessionTimeout: 30, // minutes
    maxLoginAttempts: 5
  })

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    adminEmailNotifications: true,
    userReportNotifications: true,
    systemAlerts: true,
    contentReviewNotifications: true,
    newsletter: true
  })

  // Appearance settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'light',
    primaryColor: '#EA580C',
    logoUrl: '',
    faviconUrl: '',
    customCss: ''
  })

  // Email settings
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: 'smtp.example.com',
    smtpPort: 587,
    smtpUser: 'noreply@example.com',
    smtpPassword: '',
    fromName: 'Darshana',
    fromEmail: 'noreply@darshana.com'
  })

  // Payment settings
  const [paymentSettings, setPaymentSettings] = useState({
    currency: 'INR',
    stripePublicKey: '',
    stripeSecretKey: '',
    paypalClientId: '',
    paypalSecret: '',
    enablePayments: false
  })

  const [showSmtpPassword, setShowSmtpPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const handleSystemSettingsUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    
    try {
      // In a real app, this would call an API to update settings
      setSuccess('System settings updated successfully!')
    } catch (err) {
      setError('Failed to update system settings. Please try again.')
      console.error('System settings update error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSecuritySettingsUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    
    try {
      // In a real app, this would call an API to update settings
      setSuccess('Security settings updated successfully!')
    } catch (err) {
      setError('Failed to update security settings. Please try again.')
      console.error('Security settings update error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Admin Settings</h1>
          <p className="text-gray-600 mt-1">Configure your platform settings and preferences</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-700 text-sm">{success}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <nav className="space-y-1">
                <a 
                  href="#system" 
                  className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg"
                >
                  <Settings size={16} />
                  <span>System</span>
                </a>
                <a 
                  href="#security" 
                  className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Shield size={16} />
                  <span>Security</span>
                </a>
                <a 
                  href="#notifications" 
                  className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Bell size={16} />
                  <span>Notifications</span>
                </a>
                <a 
                  href="#appearance" 
                  className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Palette size={16} />
                  <span>Appearance</span>
                </a>
                <a 
                  href="#email" 
                  className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Mail size={16} />
                  <span>Email</span>
                </a>
                <a 
                  href="#payments" 
                  className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <CreditCard size={16} />
                  <span>Payments</span>
                </a>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* System Settings */}
            <div id="system" className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">System Settings</h2>
                <p className="text-sm text-gray-500 mt-1">Configure basic platform settings</p>
              </div>
              <div className="p-6">
                <form onSubmit={handleSystemSettingsUpdate} className="space-y-6">
                  <div>
                    <label htmlFor="siteName" className="block text-sm font-medium text-gray-700">
                      Site Name
                    </label>
                    <input
                      type="text"
                      id="siteName"
                      value={systemSettings.siteName}
                      onChange={(e) => setSystemSettings({...systemSettings, siteName: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700">
                      Site Description
                    </label>
                    <textarea
                      id="siteDescription"
                      rows={3}
                      value={systemSettings.siteDescription}
                      onChange={(e) => setSystemSettings({...systemSettings, siteDescription: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Maintenance Mode</h3>
                      <p className="text-sm text-gray-500">Temporarily disable the platform for maintenance</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSystemSettings({...systemSettings, maintenanceMode: !systemSettings.maintenanceMode})}
                      className={`${
                        systemSettings.maintenanceMode ? 'bg-primary-600' : 'bg-gray-200'
                      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
                    >
                      <span
                        className={`${
                          systemSettings.maintenanceMode ? 'translate-x-5' : 'translate-x-0'
                        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">User Registration</h3>
                      <p className="text-sm text-gray-500">Allow new user registrations</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSystemSettings({...systemSettings, registrationEnabled: !systemSettings.registrationEnabled})}
                      className={`${
                        systemSettings.registrationEnabled ? 'bg-primary-600' : 'bg-gray-200'
                      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
                    >
                      <span
                        className={`${
                          systemSettings.registrationEnabled ? 'translate-x-5' : 'translate-x-0'
                        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Email Verification</h3>
                      <p className="text-sm text-gray-500">Require email verification for new accounts</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSystemSettings({...systemSettings, emailVerificationRequired: !systemSettings.emailVerificationRequired})}
                      className={`${
                        systemSettings.emailVerificationRequired ? 'bg-primary-600' : 'bg-gray-200'
                      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
                    >
                      <span
                        className={`${
                          systemSettings.emailVerificationRequired ? 'translate-x-5' : 'translate-x-0'
                        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                      />
                    </button>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={16} className="mr-2" />
                          Save changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Security Settings */}
            <div id="security" className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Security Settings</h2>
                <p className="text-sm text-gray-500 mt-1">Configure platform security policies</p>
              </div>
              <div className="p-6">
                <form onSubmit={handleSecuritySettingsUpdate} className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-500">Require 2FA for admin accounts</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSecuritySettings({...securitySettings, twoFactorAuth: !securitySettings.twoFactorAuth})}
                      className={`${
                        securitySettings.twoFactorAuth ? 'bg-primary-600' : 'bg-gray-200'
                      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
                    >
                      <span
                        className={`${
                          securitySettings.twoFactorAuth ? 'translate-x-5' : 'translate-x-0'
                        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                      />
                    </button>
                  </div>

                  <div>
                    <label htmlFor="passwordMinLength" className="block text-sm font-medium text-gray-700">
                      Minimum Password Length
                    </label>
                    <input
                      type="number"
                      id="passwordMinLength"
                      min="6"
                      max="128"
                      value={securitySettings.passwordMinLength}
                      onChange={(e) => setSecuritySettings({...securitySettings, passwordMinLength: parseInt(e.target.value)})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Require Uppercase Letters</h3>
                        <p className="text-sm text-gray-500">Passwords must contain uppercase letters</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSecuritySettings({...securitySettings, passwordRequireUppercase: !securitySettings.passwordRequireUppercase})}
                        className={`${
                          securitySettings.passwordRequireUppercase ? 'bg-primary-600' : 'bg-gray-200'
                        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
                      >
                        <span
                          className={`${
                            securitySettings.passwordRequireUppercase ? 'translate-x-5' : 'translate-x-0'
                          } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Require Lowercase Letters</h3>
                        <p className="text-sm text-gray-500">Passwords must contain lowercase letters</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSecuritySettings({...securitySettings, passwordRequireLowercase: !securitySettings.passwordRequireLowercase})}
                        className={`${
                          securitySettings.passwordRequireLowercase ? 'bg-primary-600' : 'bg-gray-200'
                        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
                      >
                        <span
                          className={`${
                            securitySettings.passwordRequireLowercase ? 'translate-x-5' : 'translate-x-0'
                          } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Require Numbers</h3>
                        <p className="text-sm text-gray-500">Passwords must contain numbers</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSecuritySettings({...securitySettings, passwordRequireNumbers: !securitySettings.passwordRequireNumbers})}
                        className={`${
                          securitySettings.passwordRequireNumbers ? 'bg-primary-600' : 'bg-gray-200'
                        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
                      >
                        <span
                          className={`${
                            securitySettings.passwordRequireNumbers ? 'translate-x-5' : 'translate-x-0'
                          } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Require Special Characters</h3>
                        <p className="text-sm text-gray-500">Passwords must contain special characters</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSecuritySettings({...securitySettings, passwordRequireSpecialChars: !securitySettings.passwordRequireSpecialChars})}
                        className={`${
                          securitySettings.passwordRequireSpecialChars ? 'bg-primary-600' : 'bg-gray-200'
                        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
                      >
                        <span
                          className={`${
                            securitySettings.passwordRequireSpecialChars ? 'translate-x-5' : 'translate-x-0'
                          } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="sessionTimeout" className="block text-sm font-medium text-gray-700">
                        Session Timeout (minutes)
                      </label>
                      <input
                        type="number"
                        id="sessionTimeout"
                        min="1"
                        max="1440"
                        value={securitySettings.sessionTimeout}
                        onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value)})}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="maxLoginAttempts" className="block text-sm font-medium text-gray-700">
                        Max Login Attempts
                      </label>
                      <input
                        type="number"
                        id="maxLoginAttempts"
                        min="1"
                        max="20"
                        value={securitySettings.maxLoginAttempts}
                        onChange={(e) => setSecuritySettings({...securitySettings, maxLoginAttempts: parseInt(e.target.value)})}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={16} className="mr-2" />
                          Save changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Notification Settings */}
            <div id="notifications" className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Notification Settings</h2>
                <p className="text-sm text-gray-500 mt-1">Configure admin notification preferences</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Admin Email Notifications</h3>
                    <p className="text-sm text-gray-500">Receive important admin notifications via email</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNotificationSettings({...notificationSettings, adminEmailNotifications: !notificationSettings.adminEmailNotifications})}
                    className={`${
                      notificationSettings.adminEmailNotifications ? 'bg-primary-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        notificationSettings.adminEmailNotifications ? 'translate-x-5' : 'translate-x-0'
                      } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">User Report Notifications</h3>
                    <p className="text-sm text-gray-500">Receive notifications about user reports</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNotificationSettings({...notificationSettings, userReportNotifications: !notificationSettings.userReportNotifications})}
                    className={`${
                      notificationSettings.userReportNotifications ? 'bg-primary-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        notificationSettings.userReportNotifications ? 'translate-x-5' : 'translate-x-0'
                      } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">System Alerts</h3>
                    <p className="text-sm text-gray-500">Receive critical system alerts</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNotificationSettings({...notificationSettings, systemAlerts: !notificationSettings.systemAlerts})}
                    className={`${
                      notificationSettings.systemAlerts ? 'bg-primary-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        notificationSettings.systemAlerts ? 'translate-x-5' : 'translate-x-0'
                      } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Content Review Notifications</h3>
                    <p className="text-sm text-gray-500">Receive notifications about content requiring review</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNotificationSettings({...notificationSettings, contentReviewNotifications: !notificationSettings.contentReviewNotifications})}
                    className={`${
                      notificationSettings.contentReviewNotifications ? 'bg-primary-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        notificationSettings.contentReviewNotifications ? 'translate-x-5' : 'translate-x-0'
                      } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Newsletter</h3>
                    <p className="text-sm text-gray-500">Receive platform updates and newsletters</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNotificationSettings({...notificationSettings, newsletter: !notificationSettings.newsletter})}
                    className={`${
                      notificationSettings.newsletter ? 'bg-primary-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        notificationSettings.newsletter ? 'translate-x-5' : 'translate-x-0'
                      } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Appearance Settings */}
            <div id="appearance" className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Appearance</h2>
                <p className="text-sm text-gray-500 mt-1">Customize the look and feel of the platform</p>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label htmlFor="theme" className="block text-sm font-medium text-gray-700">
                    Theme
                  </label>
                  <select
                    id="theme"
                    value={appearanceSettings.theme}
                    onChange={(e) => setAppearanceSettings({...appearanceSettings, theme: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System default</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700">
                    Primary Color
                  </label>
                  <div className="mt-1 flex items-center">
                    <input
                      type="color"
                      id="primaryColor"
                      value={appearanceSettings.primaryColor}
                      onChange={(e) => setAppearanceSettings({...appearanceSettings, primaryColor: e.target.value})}
                      className="h-10 w-16 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                    <span className="ml-3 text-sm text-gray-500">{appearanceSettings.primaryColor}</span>
                  </div>
                </div>

                <div>
                  <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700">
                    Logo URL
                  </label>
                  <input
                    type="url"
                    id="logoUrl"
                    value={appearanceSettings.logoUrl}
                    onChange={(e) => setAppearanceSettings({...appearanceSettings, logoUrl: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="https://example.com/logo.png"
                  />
                </div>

                <div>
                  <label htmlFor="faviconUrl" className="block text-sm font-medium text-gray-700">
                    Favicon URL
                  </label>
                  <input
                    type="url"
                    id="faviconUrl"
                    value={appearanceSettings.faviconUrl}
                    onChange={(e) => setAppearanceSettings({...appearanceSettings, faviconUrl: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="https://example.com/favicon.ico"
                  />
                </div>

                <div>
                  <label htmlFor="customCss" className="block text-sm font-medium text-gray-700">
                    Custom CSS
                  </label>
                  <textarea
                    id="customCss"
                    rows={4}
                    value={appearanceSettings.customCss}
                    onChange={(e) => setAppearanceSettings({...appearanceSettings, customCss: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm font-mono text-sm"
                    placeholder="/* Add your custom CSS here */"
                  />
                </div>
              </div>
            </div>

            {/* Email Settings */}
            <div id="email" className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Email Settings</h2>
                <p className="text-sm text-gray-500 mt-1">Configure email delivery settings</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="smtpHost" className="block text-sm font-medium text-gray-700">
                      SMTP Host
                    </label>
                    <input
                      type="text"
                      id="smtpHost"
                      value={emailSettings.smtpHost}
                      onChange={(e) => setEmailSettings({...emailSettings, smtpHost: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="smtp.example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="smtpPort" className="block text-sm font-medium text-gray-700">
                      SMTP Port
                    </label>
                    <input
                      type="number"
                      id="smtpPort"
                      value={emailSettings.smtpPort}
                      onChange={(e) => setEmailSettings({...emailSettings, smtpPort: parseInt(e.target.value)})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="587"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="smtpUser" className="block text-sm font-medium text-gray-700">
                    SMTP Username
                  </label>
                  <input
                    type="text"
                    id="smtpUser"
                    value={emailSettings.smtpUser}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpUser: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="user@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="smtpPassword" className="block text-sm font-medium text-gray-700">
                    SMTP Password
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type={showSmtpPassword ? "text" : "password"}
                      id="smtpPassword"
                      value={emailSettings.smtpPassword}
                      onChange={(e) => setEmailSettings({...emailSettings, smtpPassword: e.target.value})}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSmtpPassword(!showSmtpPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showSmtpPassword ? <EyeOff size={16} className="text-gray-400" /> : <Eye size={16} className="text-gray-400" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="fromName" className="block text-sm font-medium text-gray-700">
                      From Name
                    </label>
                    <input
                      type="text"
                      id="fromName"
                      value={emailSettings.fromName}
                      onChange={(e) => setEmailSettings({...emailSettings, fromName: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="Darshana"
                    />
                  </div>

                  <div>
                    <label htmlFor="fromEmail" className="block text-sm font-medium text-gray-700">
                      From Email
                    </label>
                    <input
                      type="email"
                      id="fromEmail"
                      value={emailSettings.fromEmail}
                      onChange={(e) => setEmailSettings({...emailSettings, fromEmail: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="noreply@darshana.com"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Settings */}
            <div id="payments" className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Payment Settings</h2>
                <p className="text-sm text-gray-500 mt-1">Configure payment gateway settings</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Enable Payments</h3>
                    <p className="text-sm text-gray-500">Allow users to make payments on the platform</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPaymentSettings({...paymentSettings, enablePayments: !paymentSettings.enablePayments})}
                    className={`${
                      paymentSettings.enablePayments ? 'bg-primary-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        paymentSettings.enablePayments ? 'translate-x-5' : 'translate-x-0'
                      } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                    />
                  </button>
                </div>

                <div>
                  <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                    Default Currency
                  </label>
                  <select
                    id="currency"
                    value={paymentSettings.currency}
                    onChange={(e) => setPaymentSettings({...paymentSettings, currency: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  >
                    <option value="INR">Indian Rupee (₹)</option>
                    <option value="USD">US Dollar ($)</option>
                    <option value="EUR">Euro (€)</option>
                    <option value="GBP">British Pound (£)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="stripePublicKey" className="block text-sm font-medium text-gray-700">
                    Stripe Public Key
                  </label>
                  <input
                    type="text"
                    id="stripePublicKey"
                    value={paymentSettings.stripePublicKey}
                    onChange={(e) => setPaymentSettings({...paymentSettings, stripePublicKey: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="pk_test_..."
                  />
                </div>

                <div>
                  <label htmlFor="stripeSecretKey" className="block text-sm font-medium text-gray-700">
                    Stripe Secret Key
                  </label>
                  <input
                    type="password"
                    id="stripeSecretKey"
                    value={paymentSettings.stripeSecretKey}
                    onChange={(e) => setPaymentSettings({...paymentSettings, stripeSecretKey: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="sk_test_..."
                  />
                </div>

                <div>
                  <label htmlFor="paypalClientId" className="block text-sm font-medium text-gray-700">
                    PayPal Client ID
                  </label>
                  <input
                    type="text"
                    id="paypalClientId"
                    value={paymentSettings.paypalClientId}
                    onChange={(e) => setPaymentSettings({...paymentSettings, paypalClientId: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Client ID"
                  />
                </div>

                <div>
                  <label htmlFor="paypalSecret" className="block text-sm font-medium text-gray-700">
                    PayPal Secret
                  </label>
                  <input
                    type="password"
                    id="paypalSecret"
                    value={paymentSettings.paypalSecret}
                    onChange={(e) => setPaymentSettings({...paymentSettings, paypalSecret: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Secret"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminSettings