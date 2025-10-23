'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  CalendarIcon,
  ClockIcon,
  UserGroupIcon,
  CreditCardIcon,
  TicketIcon,
  MapPinIcon,
  CheckCircleIcon,
  XCircleIcon,
  QrCodeIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'

interface Monument {
  _id: string
  name: string
  location: string
  images: string[]
  ticketPricing: {
    base: number
    student: number
    senior: number
    foreign: number
  }
  operatingHours: any
  description?: string
}

interface TimeSlot {
  startTime: string
  endTime: string
  available: number
  price: number
}

interface BookingData {
  monument: string
  visitDate: string
  timeSlot: { startTime: string; endTime: string }
  visitors: Array<{
    name: string
    age: number
    nationality: string
  }>
  type: string
  totalAmount: number
}

const SlotBookingPage: React.FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [monument, setMonument] = useState<Monument | null>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [bookingData, setBookingData] = useState<BookingData>({
    monument: '',
    visitDate: '',
    timeSlot: { startTime: '', endTime: '' },
    visitors: [{ name: '', age: 18, nationality: 'Indian' }],
    type: 'individual',
    totalAmount: 0
  })
  const [loading, setLoading] = useState(false)
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  // Add state for payment section position
  const [paymentSectionTop, setPaymentSectionTop] = useState(16) // 16px from top initially

  // Add scroll listener to update payment section position
  useEffect(() => {
    const handleScroll = () => {
      // Get the scroll position
      const scrollY = window.scrollY || window.pageYOffset
      
      // Calculate new top position (minimum 16px from top)
      const newTop = Math.max(16, scrollY + 16)
      
      // Update state
      setPaymentSectionTop(newTop)
    }

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll)
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    // Get parameters from URL
    const monumentId = searchParams.get('monument')
    const date = searchParams.get('date')
    const monumentName = searchParams.get('name')
    
    if (monumentId && date) {
      setSelectedDate(date)
      setBookingData(prev => ({ ...prev, monument: monumentId, visitDate: date }))
      
      // Set monument data
      const demoMonuments = getDemoMonuments()
      const foundMonument = demoMonuments.find(m => m._id === monumentId)
      if (foundMonument) {
        setMonument(foundMonument)
        fetchAvailableSlots(foundMonument, date)
      }
    }
  }, [searchParams])

  const getDemoMonuments = (): Monument[] => {
    return [
      {
        _id: '1',
        name: 'Taj Mahal',
        location: 'Agra, Uttar Pradesh',
        images: ['/taj-mahal.jpg'],
        ticketPricing: {
          base: 50,
          student: 25,
          senior: 35,
          foreign: 1100
        },
        operatingHours: '6:00 AM - 6:00 PM (Closed on Fridays)',
        description: 'The Taj Mahal, a UNESCO World Heritage Site, is an ivory-white marble mausoleum built by Mughal emperor Shah Jahan in memory of his beloved wife Mumtaz Mahal. This architectural masterpiece represents the finest example of Mughal architecture, combining elements from Islamic, Persian, Ottoman Turkish and Indian architectural styles. The Taj Mahal is widely recognized as "the jewel of Muslim art in India" and is one of the universally admired masterpieces of the worlds heritage.'
      },
      {
        _id: '2',
        name: 'Red Fort',
        location: 'New Delhi, Delhi',
        images: ['/red-fort.jpg'],
        ticketPricing: {
          base: 35,
          student: 18,
          senior: 25,
          foreign: 500
        },
        operatingHours: '9:30 AM - 4:30 PM (Closed on Mondays)',
        description: 'The Red Fort, known as Lal Qila, served as the main residence of the Mughal emperors for nearly 200 years. This historic fortified palace showcases the peak of Mughal creativity and is a symbol of Indias rich heritage. The fort complex houses museums, gardens, and several impressive structures including the Diwan-i-Aam and Diwan-i-Khas. Built by Emperor Shah Jahan in 1639, it served as the political center of the Mughal Empire.'
      },
      {
        _id: '3',
        name: 'Hawa Mahal',
        location: 'Jaipur, Rajasthan',
        images: ['/images/hawa-mahal.jpg'],
        ticketPricing: {
          base: 50,
          student: 25,
          senior: 35,
          foreign: 200
        },
        operatingHours: '9:00 AM - 4:30 PM',
        description: 'Hawa Mahal, also known as the "Palace of Winds," is a stunning example of Rajput architecture built in 1799 by Maharaja Sawai Pratap Singh. The five-story palace with its 953 small windows called jharokhas was designed to allow royal ladies to observe everyday life and festivals celebrated in the street below without being seen. The unique honeycomb-like structure is an iconic landmark of Jaipur and represents the architectural brilliance of the Rajput era.'
      },
      {
        _id: '4',
        name: 'Amer Fort',
        location: 'Jaipur, Rajasthan',
        images: ['/amer-fort.jpg'],
        ticketPricing: {
          base: 100,
          student: 50,
          senior: 70,
          foreign: 550
        },
        operatingHours: '8:00 AM - 5:30 PM',
        description: 'Amer Fort, also known as Amber Fort, is a magnificent example of Rajput architecture located on a hilltop. Built by Raja Man Singh I in 1592, this majestic fort-palace complex is known for its artistic Hindu style elements, cobbled paths, series of gates and paved paths. The fort overlooks Maota Lake and offers breathtaking views of the surrounding landscape. Its artistic Hindu style elements, grand courtyards, and beautiful mirror work make it a must-visit destination.'
      }
    ]
  }

  // Helper function to get monument image
  const getMonumentImage = (monumentId: string): string => {
    const imageMap: { [key: string]: string } = {
      '1': '/taj-mahal.jpg',
      '2': '/red-fort.jpg', 
      '3': '/images/hawa-mahal.jpg',
      '4': '/amer-fort.jpg'
    }
    return imageMap[monumentId] || '/images/heritage-background.jpg'
  }

  // Helper function to get monument description
  const getMonumentDescription = (monumentId: string): string => {
    const descriptionMap: { [key: string]: string } = {
      '1': 'The Taj Mahal, a UNESCO World Heritage Site, is an ivory-white marble mausoleum built by Mughal emperor Shah Jahan in memory of his beloved wife Mumtaz Mahal. This architectural masterpiece represents the finest example of Mughal architecture, combining elements from Islamic, Persian, Ottoman Turkish and Indian architectural styles.',
      '2': 'The Red Fort, known as Lal Qila, served as the main residence of the Mughal emperors for nearly 200 years. This historic fortified palace showcases the peak of Mughal creativity and is a symbol of India\'s rich heritage. The fort complex houses museums, gardens, and several impressive structures including the Diwan-i-Aam and Diwan-i-Khas.',
      '3': 'Hawa Mahal, also known as the "Palace of Winds," is a stunning example of Rajput architecture built in 1799 by Maharaja Sawai Pratap Singh. The five-story palace with its 953 small windows called jharokhas was designed to allow royal ladies to observe everyday life and festivals celebrated in the street below without being seen.',
      '4': 'Amer Fort, also known as Amber Fort, is a magnificent example of Rajput architecture located on a hilltop. Built by Raja Man Singh I in 1592, this majestic fort-palace complex is known for its artistic Hindu style elements, cobbled paths, series of gates and paved paths. The fort overlooks Maota Lake and offers breathtaking views of the surrounding landscape.'
    }
    return descriptionMap[monumentId] || 'Discover the rich history and cultural significance of this magnificent monument through our immersive experience.'
  }

  const fetchAvailableSlots = async (monument: Monument, date: string) => {
    setLoading(true)
    try {
      // Demo time slots for each monument
      const demoSlots = [
        { startTime: '9:00 AM', endTime: '11:00 AM', available: 25, price: monument.ticketPricing.base },
        { startTime: '11:00 AM', endTime: '1:00 PM', available: 18, price: monument.ticketPricing.base },
        { startTime: '1:00 PM', endTime: '3:00 PM', available: 30, price: monument.ticketPricing.base },
        { startTime: '3:00 PM', endTime: '5:00 PM', available: 22, price: monument.ticketPricing.base },
        { startTime: '5:00 PM', endTime: '7:00 PM', available: 15, price: monument.ticketPricing.base }
      ]
      
      // Simulate different availability for different monuments
      const availableSlots = demoSlots.map(slot => ({
        ...slot,
        available: Math.max(5, slot.available - Math.floor(Math.random() * 10))
      }))
      
      setAvailableSlots(availableSlots)
    } catch (error) {
      console.error('Failed to fetch slots:', error)
    } finally {
      setTimeout(() => setLoading(false), 500) // Simulate loading time
    }
  }

  const addVisitor = () => {
    setBookingData({
      ...bookingData,
      visitors: [...bookingData.visitors, { name: '', age: 18, nationality: 'Indian' }]
    })
  }

  const updateVisitor = (index: number, field: string, value: any) => {
    const updatedVisitors = bookingData.visitors.map((visitor, i) => 
      i === index ? { ...visitor, [field]: value } : visitor
    )
    setBookingData({ ...bookingData, visitors: updatedVisitors })
  }

  const removeVisitor = (index: number) => {
    if (bookingData.visitors.length > 1) {
      const updatedVisitors = bookingData.visitors.filter((_, i) => i !== index)
      setBookingData({ ...bookingData, visitors: updatedVisitors })
    }
  }

  const calculateTotal = () => {
    if (!monument || !selectedSlot) return 0
    
    const basePrice = selectedSlot.price
    const visitorCount = bookingData.visitors.length
    let total = basePrice * visitorCount
    
    // Apply discounts
    const studentCount = bookingData.visitors.filter(v => v.age < 18).length
    const seniorCount = bookingData.visitors.filter(v => v.age >= 60).length
    
    total -= studentCount * (basePrice * 0.5) // 50% discount for students
    total -= seniorCount * (basePrice * 0.3) // 30% discount for seniors
    
    // Add taxes
    const tax = total * 0.18 // 18% GST
    return total + tax
  }

  const proceedToPayment = async () => {
    setPaymentProcessing(true)
    
    try {
      const bookingPayload = {
        ...bookingData,
        monument: monument?._id,
        visitDate: selectedDate,
        timeSlot: selectedSlot,
        totalAmount: calculateTotal()
      }

      // Demo booking - simulate successful payment after 2 seconds
      console.log('Demo Booking Payload:', bookingPayload)
      
      setTimeout(async () => {
        // Generate booking confirmation details
        const completedBookingData = {
          bookingId: `DH${Date.now().toString().slice(-6)}`,
          monument: monument,
          visitDate: selectedDate,
          timeSlot: selectedSlot,
          visitors: bookingData.visitors,
          totalAmount: calculateTotal(),
          bookingDate: new Date().toLocaleDateString(),
          bookingTime: new Date().toLocaleTimeString(),
          status: 'Confirmed',
          paymentMethod: 'Demo Payment',
          paymentId: `PAY${Math.random().toString(36).substr(2, 9).toUpperCase()}`
        }
        
        // Redirect to ticket details page with booking data
        if (completedBookingData.monument && completedBookingData.timeSlot) {
          const params = new URLSearchParams({
            bookingId: completedBookingData.bookingId,
            monumentId: completedBookingData.monument._id,
            monumentName: completedBookingData.monument.name,
            location: completedBookingData.monument.location,
            visitDate: completedBookingData.visitDate,
            startTime: completedBookingData.timeSlot.startTime,
            endTime: completedBookingData.timeSlot.endTime,
            visitors: JSON.stringify(completedBookingData.visitors),
            totalAmount: completedBookingData.totalAmount.toString(),
            bookingDate: completedBookingData.bookingDate,
            bookingTime: completedBookingData.bookingTime,
            paymentId: completedBookingData.paymentId
          });
          
          router.push(`/tickets/${completedBookingData.bookingId}?${params.toString()}`);
        }
        setPaymentProcessing(false)
        
      }, 2000)
      
    } catch (error) {
      console.error('Payment failed:', error)
      setPaymentProcessing(false)
    }
  }

  if (!monument) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  return (
    <motion.div 
      className="min-h-screen bg-gray-50 py-3"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "tween", 
        ease: [0.25, 0.46, 0.45, 0.94], 
        duration: 0.6,
        delay: 0.2 
      }}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-3">
        <motion.div 
          className="bg-white rounded-lg shadow-lg overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: "tween",
            ease: [0.25, 0.46, 0.45, 0.94],
            duration: 0.6,
            delay: 0.4
          }}
        >
          <div className="p-6">
            <div className="flex items-center mb-6">
              <button
                onClick={() => router.back()}
                className="flex items-center text-orange-600 hover:text-orange-800 font-medium"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to Date Selection
              </button>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Book Your Slot for {monument?.name}</h2>
            
            {/* Combined Single Page Layout - All sections in one view */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Slot Selection and Visitor Information (60%) */}
              <div className="lg:col-span-2 space-y-6">
                {/* Time Slots */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <ClockIcon className="h-5 w-5 mr-2 text-orange-600" />
                    Available Time Slots for {selectedDate}
                  </h3>
                  
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
                      <p className="text-gray-600 mt-4">Loading available slots...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {availableSlots.map((slot, index) => (
                        <motion.div
                          key={index}
                          onClick={() => setSelectedSlot(slot)}
                          className={`border rounded-lg p-4 cursor-pointer transition-all duration-300 ${
                            selectedSlot === slot
                              ? 'border-orange-500 bg-orange-50 shadow-md scale-[1.02]'
                              : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                          }`}
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="font-medium text-gray-900 text-lg">
                                {slot.startTime} - {slot.endTime}
                              </span>
                              <div className="text-lg font-bold text-orange-600 mt-1">
                                ₹{slot.price} per person
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                slot.available > 10 
                                  ? 'bg-green-100 text-green-800'
                                  : slot.available > 5
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {slot.available} slots left
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Visitor Details */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Visitor Details</h3>
                  
                  {bookingData.visitors.map((visitor, index) => (
                    <div key={index} className="border rounded-lg p-4 mb-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium">Visitor {index + 1}</h4>
                        {bookingData.visitors.length > 1 && (
                          <button
                            onClick={() => removeVisitor(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <XCircleIcon className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                          type="text"
                          placeholder="Full Name"
                          value={visitor.name}
                          onChange={(e) => updateVisitor(index, 'name', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                        />
                        <input
                          type="number"
                          placeholder="Age"
                          value={visitor.age}
                          onChange={(e) => updateVisitor(index, 'age', parseInt(e.target.value))}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                        />
                        <select
                          value={visitor.nationality}
                          onChange={(e) => updateVisitor(index, 'nationality', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                        >
                          <option value="Indian">Indian</option>
                          <option value="Foreign">Foreign</option>
                        </select>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={addVisitor}
                    className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-orange-300 hover:text-orange-600"
                  >
                    + Add Another Visitor
                  </button>

                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Booking Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Monument:</span>
                        <span>{monument?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Date:</span>
                        <span>{selectedDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Time:</span>
                        <span>{selectedSlot?.startTime} - {selectedSlot?.endTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Visitors:</span>
                        <span>{bookingData.visitors.length}</span>
                      </div>
                      <div className="flex justify-between font-bold text-base pt-2 border-t">
                        <span>Total:</span>
                        <span>₹{calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Payment Section (40%) - Fixed position */}
              <div className="lg:col-span-1">
                <div 
                  className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg sticky top-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <CreditCardIcon className="h-5 w-5 mr-2 text-orange-600" />
                    Payment
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="bg-orange-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Order Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Ticket Price:</span>
                          <span>₹{selectedSlot ? selectedSlot.price : 0} × {bookingData.visitors.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Taxes (18% GST):</span>
                          <span>₹{(calculateTotal() * 0.18).toFixed(2)}</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between font-bold">
                          <span>Total:</span>
                          <span>₹{calculateTotal().toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={proceedToPayment}
                      disabled={!selectedSlot || bookingData.visitors.some(v => !v.name) || paymentProcessing}
                      className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${
                        !selectedSlot || bookingData.visitors.some(v => !v.name)
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-orange-600 hover:bg-orange-700'
                      }`}
                    >
                      {paymentProcessing ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing Payment...
                        </div>
                      ) : (
                        `Pay ₹${calculateTotal().toFixed(2)}`
                      )}
                    </button>
                    
                    <p className="text-xs text-gray-500 text-center">
                      By proceeding, you agree to our terms and conditions
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default SlotBookingPage