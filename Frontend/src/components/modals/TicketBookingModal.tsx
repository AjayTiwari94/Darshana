'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  XMarkIcon,
  CalendarIcon,
  ClockIcon,
  UserGroupIcon,
  CreditCardIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

interface Monument {
  _id: string
  name: string
  ticketInfo: {
    price: { indian: number; foreign: number }
    timings: string
  }
}

interface TicketBookingModalProps {
  isOpen: boolean
  onClose: () => void
  monument: Monument | null
}

const TicketBookingModal: React.FC<TicketBookingModalProps> = ({ isOpen, onClose, monument }) => {
  const [step, setStep] = useState(1)
  const [bookingData, setBookingData] = useState({
    date: '',
    timeSlot: '',
    visitors: 1,
    ticketType: 'indian',
    name: '',
    email: '',
    phone: ''
  })

  const timeSlots = [
    '9:00 AM - 11:00 AM',
    '11:00 AM - 1:00 PM', 
    '1:00 PM - 3:00 PM',
    '3:00 PM - 5:00 PM'
  ]

  const handleBooking = () => {
    // Demo booking completion
    setStep(4)
    setTimeout(() => {
      onClose()
      setStep(1)
      setBookingData({
        date: '',
        timeSlot: '',
        visitors: 1,
        ticketType: 'indian',
        name: '',
        email: '',
        phone: ''
      })
    }, 3000)
  }

  const calculateTotal = () => {
    if (!monument) return 0
    const pricePerTicket = bookingData.ticketType === 'indian' 
      ? monument.ticketInfo.price.indian 
      : monument.ticketInfo.price.foreign
    return pricePerTicket * bookingData.visitors
  }

  if (!monument) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={onClose}
            />

            {/* Center modal */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative inline-block align-middle bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full sm:p-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Book Tickets - {monument.name}
                </h3>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Progress bar */}
              <div className="mb-6">
                <div className="flex items-center">
                  {[1, 2, 3].map((i) => (
                    <React.Fragment key={i}>
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                        step >= i ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-500'
                      }`}>
                        {i}
                      </div>
                      {i < 3 && (
                        <div className={`flex-1 h-1 mx-2 ${
                          step > i ? 'bg-orange-600' : 'bg-gray-200'
                        }`} />
                      )}
                    </React.Fragment>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Details</span>
                  <span>Contact</span>
                  <span>Payment</span>
                </div>
              </div>

              {/* Step 1: Booking Details */}
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Visit Date
                    </label>
                    <input
                      type="date"
                      value={bookingData.date}
                      onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time Slot
                    </label>
                    <select
                      value={bookingData.timeSlot}
                      onChange={(e) => setBookingData({...bookingData, timeSlot: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">Select time slot</option>
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Visitors
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={bookingData.visitors}
                      onChange={(e) => setBookingData({...bookingData, visitors: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ticket Type
                    </label>
                    <select
                      value={bookingData.ticketType}
                      onChange={(e) => setBookingData({...bookingData, ticketType: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="indian">Indian (₹{monument.ticketInfo.price.indian})</option>
                      <option value="foreign">Foreign (₹{monument.ticketInfo.price.foreign})</option>
                    </select>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span>Total Amount:</span>
                      <span className="font-bold text-orange-600">₹{calculateTotal()}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Contact Information */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={bookingData.name}
                      onChange={(e) => setBookingData({...bookingData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={bookingData.email}
                      onChange={(e) => setBookingData({...bookingData, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={bookingData.phone}
                      onChange={(e) => setBookingData({...bookingData, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Booking Summary</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Monument:</span>
                        <span>{monument.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Date:</span>
                        <span>{bookingData.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Time:</span>
                        <span>{bookingData.timeSlot}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Visitors:</span>
                        <span>{bookingData.visitors}</span>
                      </div>
                      <div className="flex justify-between font-bold text-orange-600">
                        <span>Total:</span>
                        <span>₹{calculateTotal()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <CreditCardIcon className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="text-sm text-blue-800">
                        This is a demo booking. No actual payment will be processed.
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Success */}
              {step === 4 && (
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <CheckCircleIcon className="h-16 w-16 text-green-500" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-900">Booking Confirmed!</h4>
                  <p className="text-gray-600">
                    Your ticket has been booked successfully. You will receive a confirmation email shortly.
                  </p>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-green-800">
                      Booking ID: DMO{Date.now().toString().slice(-6)}
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {step < 4 && (
                <div className="flex space-x-3 mt-6">
                  {step > 1 && (
                    <button
                      onClick={() => setStep(step - 1)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (step === 3) {
                        handleBooking()
                      } else {
                        setStep(step + 1)
                      }
                    }}
                    disabled={
                      (step === 1 && (!bookingData.date || !bookingData.timeSlot)) ||
                      (step === 2 && (!bookingData.name || !bookingData.email || !bookingData.phone))
                    }
                    className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {step === 3 ? 'Complete Booking' : 'Continue'}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default TicketBookingModal