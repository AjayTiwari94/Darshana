'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
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
  QrCodeIcon
} from '@heroicons/react/24/outline'

// Add html2canvas for screenshot capture
import html2canvas from 'html2canvas'

// Add this import for PDF generation
import html2pdf from 'html2pdf.js'

// Add print styles
import './print-styles.css'

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
    whatsappNumber?: string
  }>
  type: string
  totalAmount: number
  primaryWhatsApp?: string
}

const TicketBooking: React.FC = () => {
  const searchParams = useSearchParams()
  const [monuments, setMonuments] = useState<Monument[]>([])
  const [selectedMonument, setSelectedMonument] = useState<Monument | null>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [bookingData, setBookingData] = useState<BookingData>({
    monument: '',
    visitDate: '',
    timeSlot: { startTime: '', endTime: '' },
    visitors: [{ name: '', age: 18, nationality: 'Indian', whatsappNumber: '' }],
    type: 'individual',
    totalAmount: 0,
    primaryWhatsApp: ''
  })
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [completedBooking, setCompletedBooking] = useState<any>(null)
  const [showMyBookings, setShowMyBookings] = useState(false)
  const [fromMonuments, setFromMonuments] = useState(false) // Track if coming from monuments page

  useEffect(() => {
    fetchMonuments()
  }, [])

  useEffect(() => {
    if (selectedMonument && selectedDate) {
      fetchAvailableSlots()
    }
  }, [selectedMonument, selectedDate])

  // Handle URL parameters for monument pre-selection
  useEffect(() => {
    const monumentId = searchParams.get('monument')
    const monumentName = searchParams.get('name')
    
    if (monumentId && monuments.length > 0) {
      const monument = monuments.find(m => m._id === monumentId)
      if (monument) {
        setSelectedMonument(monument)
        setBookingData({ ...bookingData, monument: monument._id })
        // Auto-advance to step 2 if coming from monuments page
        setCurrentStep(2)
        setFromMonuments(true) // Mark as coming from monuments
      }
    }
  }, [monuments, searchParams])

  const fetchMonuments = async () => {
    try {
      // Using demo data for the 4 monuments we have
      const demoMonuments = [
        {
          _id: '1',
          name: 'Taj Mahal',
          location: 'Agra, Uttar Pradesh',
          images: ['/images/taj-mahal.jpg'],
          ticketPricing: {
            base: 50,
            student: 25,
            senior: 35,
            foreign: 1100
          },
          operatingHours: '6:00 AM - 6:00 PM (Closed on Fridays)'
        },
        {
          _id: '2',
          name: 'Red Fort',
          location: 'New Delhi, Delhi',
          images: ['/images/red-fort.jpg'],
          ticketPricing: {
            base: 35,
            student: 18,
            senior: 25,
            foreign: 500
          },
          operatingHours: '9:30 AM - 4:30 PM (Closed on Mondays)'
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
          operatingHours: '9:00 AM - 4:30 PM'
        },
        {
          _id: '4',
          name: 'Amer Fort',
          location: 'Jaipur, Rajasthan',
          images: ['/images/amer-fort.jpg'],
          ticketPricing: {
            base: 100,
            student: 50,
            senior: 70,
            foreign: 550
          },
          operatingHours: '8:00 AM - 5:30 PM'
        }
      ]
      setMonuments(demoMonuments)
    } catch (error) {
      console.error('Failed to fetch monuments:', error)
    }
  }

  const fetchAvailableSlots = async () => {
    if (!selectedMonument || !selectedDate) return
    
    setLoading(true)
    try {
      // Demo time slots for each monument
      const demoSlots = [
        { startTime: '9:00 AM', endTime: '11:00 AM', available: 25, price: selectedMonument.ticketPricing.base },
        { startTime: '11:00 AM', endTime: '1:00 PM', available: 18, price: selectedMonument.ticketPricing.base },
        { startTime: '1:00 PM', endTime: '3:00 PM', available: 30, price: selectedMonument.ticketPricing.base },
        { startTime: '3:00 PM', endTime: '5:00 PM', available: 22, price: selectedMonument.ticketPricing.base },
        { startTime: '5:00 PM', endTime: '7:00 PM', available: 15, price: selectedMonument.ticketPricing.base }
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
      visitors: [...bookingData.visitors, { name: '', age: 18, nationality: 'Indian', whatsappNumber: '' }]
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
    if (!selectedMonument || !selectedSlot) return 0
    
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

  // Helper function to get monument image
  const getMonumentImage = (monumentId: string): string => {
    const imageMap: { [key: string]: string } = {
      '1': '/images/taj-mahal.jpg',
      '2': '/images/red-fort.jpg', 
      '3': '/images/hawa-mahal.jpg',
      '4': '/images/amer-fort.jpg'
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

  const generateTicketQRCode = (bookingDetails: any) => {
    // Generate QR code data with all ticket information
    const qrData = {
      bookingId: bookingDetails.bookingId,
      monument: bookingDetails.monument.name,
      visitDate: bookingDetails.visitDate,
      timeSlot: `${bookingDetails.timeSlot.startTime}-${bookingDetails.timeSlot.endTime}`,
      visitors: bookingDetails.visitors.length,
      amount: bookingDetails.totalAmount,
      status: bookingDetails.status
    }
    
    // Convert to QR code string (in production, use a proper QR code library)
    return `DARSHANA-TICKET:${JSON.stringify(qrData)}`
  }

  const sendWhatsAppTicket = async (whatsappNumber: string, bookingDetails: any) => {
    try {
      console.log('📱 Attempting to send WhatsApp ticket with PDF...')
      
      // Use the enhanced WhatsApp server with PDF generation
      const response = await fetch('http://localhost:5004/demo-book-whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          whatsappNumber: whatsappNumber,
          bookingId: bookingDetails.bookingId, // Pass the existing booking ID
          monument: {
            name: bookingDetails.monument.name,
            location: bookingDetails.monument.location
          },
          visitDate: bookingDetails.visitDate,
          timeSlot: bookingDetails.timeSlot,
          visitors: bookingDetails.visitors,
          totalAmount: bookingDetails.totalAmount
        })
      })

      const result = await response.json()
      
      if (result.success) {
        console.log(`✅ WhatsApp ticket sent with PDF attachment!`)
        console.log('📱 Message ID:', result.data.messageId)
        console.log('📄 PDF Generated:', result.data.pdfGenerated)
        console.log('📁 Filename:', result.data.filename)
        
        // Show success message to user
        const pdfText = result.data.pdfGenerated ? ' with PDF attachment' : ''
        alert(`🎉 SUCCESS!\n\n` +
              `✅ Ticket sent to your mobile number\n` +
              `📱 ${whatsappNumber}\n` +
              `Happy Journey! 🎉`)
        
        return {
          success: true,
          message: `Ticket sent to your mobile${pdfText}`,
          data: result.data
        }
      } else {
        throw new Error(result.message || 'Failed to send WhatsApp ticket')
      }
      
    } catch (error: any) {
      console.error('❌ WhatsApp sending failed:', error)
      
      alert('❌ Ticket Sending Failed\n\n' +
            'Error: ' + error.message + '\n\n' +
            'Please check:\n' +
            '• Phone number format (+91XXXXXXXXXX)\n' +
            '• Internet connection\n' +
            '• Try again in a moment')
      
      return {
        success: false,
        error: error.message,
        message: 'Failed to send ticket to mobile'
      }
    }
  }

  // Function to generate and download PDF ticket
  const downloadPDF = () => {
    const element = document.getElementById('ticket-to-print')
    if (element) {
      const opt = {
        margin: 10,
        filename: `darshana-ticket-${completedBooking?.bookingId || 'booking'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }
      html2pdf().set(opt).from(element).save()
    }
  }

  // Function to download PDF from backend
  const downloadBackendPDF = async () => {
    if (!completedBooking) return
    
    try {
      const ticketId = completedBooking._id || completedBooking.id
      if (!ticketId) {
        // Fallback to HTML-based PDF generation
        downloadPDF()
        return
      }
      
      // Use the correct backend URL
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'
      const response = await fetch(`${backendUrl}/api/tickets/${ticketId}/download`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/pdf',
        },
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `darshana-ticket-${completedBooking.bookingId || 'booking'}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        // Fallback to HTML-based PDF generation
        downloadPDF()
      }
    } catch (error) {
      console.error('Failed to download PDF from backend:', error)
      // Fallback to HTML-based PDF generation
      downloadPDF()
    }
  }

  // Function to capture screenshot of ticket and send via WhatsApp
  const sendScreenshotTicket = async () => {
    const element = document.getElementById('ticket-to-print')
    if (element && completedBooking) {
      try {
        // Show loading state
        const sendButton = document.querySelector('button.flex.items-center.bg-green-600')
        if (sendButton) {
          sendButton.innerHTML = '<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Sending...'
        }
        
        // Capture screenshot of the ticket
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          logging: false
        })
        
        // Convert to base64 image
        const imageData = canvas.toDataURL('image/png')
        
        // Use the correct backend URL
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'
        
        // Send to backend for WhatsApp delivery
        const response = await fetch(`${backendUrl}/api/tickets/send-screenshot`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            whatsappNumber: bookingData.primaryWhatsApp,
            imageData: imageData,
            ticketData: completedBooking
          })
        })
        
        const result = await response.json()
        
        if (result.success) {
          alert('✅ Ticket screenshot sent to your mobile number. Happy Journey!')
        } else {
          alert(`❌ Failed to send ticket screenshot: ${result.message || 'Please try again.'}`)
        }
      } catch (error) {
        console.error('Screenshot capture failed:', error)
        alert('❌ Failed to capture ticket screenshot. Please try again.')
      } finally {
        // Reset button text
        const sendButton = document.querySelector('button.flex.items-center.bg-green-600')
        if (sendButton) {
          sendButton.innerHTML = '<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/></svg>📸 Send Screenshot'
        }
      }
    } else {
      alert('❌ Unable to capture ticket. Please try again.')
    }
  }

  const proceedToPayment = async () => {
    setPaymentProcessing(true)
    
    try {
      const bookingPayload = {
        ...bookingData,
        monument: selectedMonument?._id,
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
          monument: selectedMonument,
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
        
        setCompletedBooking(completedBookingData)
        setCurrentStep(4) // Success step
        setPaymentProcessing(false)
        
        // AUTOMATICALLY send complete WhatsApp ticket if phone number provided
        if (bookingData.primaryWhatsApp) {
          console.log('🚀 Automatically sending complete ticket to WhatsApp:', bookingData.primaryWhatsApp)
          const result = await sendWhatsAppTicket(bookingData.primaryWhatsApp, completedBookingData)
          if (result.success) {
            console.log('✅ Complete ticket with QR code sent successfully to WhatsApp')
          } else {
            console.error('❌ Failed to send ticket to WhatsApp:', result.message)
          }
        }
      }, 2000)
      
    } catch (error) {
      console.error('Payment failed:', error)
      setPaymentProcessing(false)
    }
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <motion.div 
      className="min-h-screen bg-gray-50 py-8"
      initial={fromMonuments ? { opacity: 0, y: 30 } : false}
      animate={fromMonuments ? { opacity: 1, y: 0 } : false}
      transition={fromMonuments ? { 
        type: "tween", 
        ease: [0.25, 0.46, 0.45, 0.94], 
        duration: 0.6,
        delay: 0.2 
      } : undefined}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <motion.div 
          className="mb-8"
          initial={fromMonuments ? { opacity: 0, y: -20 } : false}
          animate={fromMonuments ? { opacity: 1, y: 0 } : false}
          transition={fromMonuments ? {
            type: "tween",
            ease: [0.25, 0.46, 0.45, 0.94],
            duration: 0.5,
            delay: 0.1
          } : undefined}
        >
          <div className="flex items-center justify-center">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === currentStep ? 'bg-orange-600 text-white' :
                  step < currentStep ? 'bg-green-600 text-white' :
                  'bg-gray-300 text-gray-600'
                }`}>
                  {step < currentStep ? <CheckCircleIcon className="h-5 w-5" /> : step}
                </div>
                {step < 4 && (
                  <div className={`h-1 w-16 mx-2 ${
                    step < currentStep ? 'bg-green-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2">
            <div className="grid grid-cols-4 gap-16 text-sm text-gray-600">
              <span>Select Monument</span>
              <span>Choose Date & Time</span>
              <span>Visitor Details</span>
              <span>Payment</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white rounded-lg shadow-lg overflow-hidden"
          initial={fromMonuments ? { opacity: 0, scale: 0.95 } : false}
          animate={fromMonuments ? { opacity: 1, scale: 1 } : false}
          transition={fromMonuments ? {
            type: "tween",
            ease: [0.25, 0.46, 0.45, 0.94],
            duration: 0.6,
            delay: 0.4
          } : undefined}
        >
          {/* Step 1: Monument Selection */}
          {currentStep === 1 && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Monument</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {monuments.map((monument) => (
                  <div
                    key={monument._id}
                    onClick={() => {
                      setSelectedMonument(monument)
                      setBookingData({ ...bookingData, monument: monument._id })
                    }}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedMonument?._id === monument._id
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={monument.images[0] || '/placeholder-monument.jpg'}
                      alt={monument.name}
                      className="w-full h-32 object-cover rounded mb-3"
                    />
                    <h3 className="font-semibold text-gray-900">{monument.name}</h3>
                    <p className="text-sm text-gray-600 flex items-center mt-1">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      {monument.location}
                    </p>
                    <p className="text-lg font-bold text-orange-600 mt-2">
                      ₹{monument.ticketPricing?.base || 50}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end mt-6">
                <button
                  onClick={nextStep}
                  disabled={!selectedMonument}
                  className="px-6 py-2 bg-orange-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Date & Time Selection */}
          {currentStep === 2 && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Choose Date & Time</h2>
              
              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Monument Information */}
                <div className="space-y-6">
                  {selectedMonument && (
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                      {/* Monument Image */}
                      <div className="relative h-64 bg-gradient-to-br from-orange-100 to-red-100">
                        <img
                          src={getMonumentImage(selectedMonument._id)}
                          alt={selectedMonument.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/images/heritage-background.jpg';
                          }}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                        <div className="absolute bottom-4 left-4 text-white">
                          <h3 className="text-2xl font-bold">{selectedMonument.name}</h3>
                          <p className="flex items-center mt-1">
                            <MapPinIcon className="h-4 w-4 mr-1" />
                            {selectedMonument.location}
                          </p>
                        </div>
                      </div>

                      {/* Monument Details */}
                      <div className="p-6">
                        <div className="mb-4">
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">About this Monument</h4>
                          <p className="text-gray-600 leading-relaxed">
                            {getMonumentDescription(selectedMonument._id)}
                          </p>
                        </div>

                        {/* Operating Hours */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                            <ClockIcon className="h-4 w-4 mr-2 text-orange-600" />
                            Operating Hours
                          </h5>
                          <p className="text-sm text-gray-600">{selectedMonument.operatingHours}</p>
                        </div>

                        {/* Pricing Information */}
                        <div className="bg-orange-50 rounded-lg p-4">
                          <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                            <TicketIcon className="h-4 w-4 mr-2 text-orange-600" />
                            Ticket Pricing
                          </h5>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Adult (Indian):</span>
                              <span className="font-semibold text-orange-600">₹{selectedMonument.ticketPricing.base}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Student:</span>
                              <span className="font-semibold text-green-600">₹{selectedMonument.ticketPricing.student}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Senior (60+):</span>
                              <span className="font-semibold text-blue-600">₹{selectedMonument.ticketPricing.senior}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Foreign:</span>
                              <span className="font-semibold text-purple-600">₹{selectedMonument.ticketPricing.foreign}</span>
                            </div>
                          </div>
                        </div>

                        {/* Features */}
                        <div className="mt-4 flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">📱 Narad AI Guide</span>
                          <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">🥽 AR Experience</span>
                          <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">🎮 Treasure Hunt</span>
                          <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">📚 Stories</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column - Date & Time Selection */}
                <div className="space-y-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <CalendarIcon className="h-5 w-5 mr-2 text-orange-600" />
                      Select Visit Date
                    </h3>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg"
                    />
                  </div>

                  {selectedDate && (
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <ClockIcon className="h-5 w-5 mr-2 text-orange-600" />
                        Available Time Slots
                      </h3>
                      {loading ? (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                          <p className="text-gray-600 mt-2">Loading available slots...</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {availableSlots.map((slot, index) => (
                            <div
                              key={index}
                              onClick={() => setSelectedSlot(slot)}
                              className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                                selectedSlot === slot
                                  ? 'border-orange-500 bg-orange-50 shadow-md'
                                  : 'border-gray-200 hover:border-orange-300 hover:shadow-sm'
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <span className="font-medium text-gray-900">
                                    {slot.startTime} - {slot.endTime}
                                  </span>
                                  <div className="text-lg font-bold text-orange-600 mt-1">
                                    ₹{slot.price} per person
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className={`text-sm px-2 py-1 rounded-full ${
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
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={prevStep}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  disabled={!selectedSlot}
                  className="px-6 py-2 bg-orange-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-700 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Visitor Details */}
          {currentStep === 3 && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Visitor Details</h2>
              
              {/* WhatsApp Number for Automatic Ticket Delivery */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-blue-900 mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/>
                  </svg>
                  📱 Ticket Delivery
                </h3>
                <p className="text-sm text-blue-700 mb-3">
                  Enter your mobile number to receive your ticket with PDF and QR code for easy entry.
                </p>
                <input
                  type="tel"
                  placeholder="Enter your number for sending tickets"
                  value={bookingData.primaryWhatsApp || ''}
                  onChange={(e) => setBookingData({ ...bookingData, primaryWhatsApp: e.target.value })}
                  className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {bookingData.visitors.map((visitor, index) => (
                <div key={index} className="border rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Visitor {index + 1}</h3>
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
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                    />
                    <input
                      type="number"
                      placeholder="Age"
                      value={visitor.age}
                      onChange={(e) => updateVisitor(index, 'age', parseInt(e.target.value))}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                    />
                    <select
                      value={visitor.nationality}
                      onChange={(e) => updateVisitor(index, 'nationality', e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
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
                <h3 className="font-medium mb-2">Booking Summary</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Monument:</span>
                    <span>{selectedMonument?.name}</span>
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
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total:</span>
                    <span>₹{calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  onClick={prevStep}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg"
                >
                  Back
                </button>
                <button
                  onClick={proceedToPayment}
                  disabled={paymentProcessing || bookingData.visitors.some(v => !v.name)}
                  className="px-6 py-2 bg-orange-600 text-white rounded-lg disabled:opacity-50"
                >
                  {paymentProcessing ? 'Processing...' : 'Proceed to Payment'}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {currentStep === 4 && !showMyBookings && (
            <div className="p-6 text-center">
              <CheckCircleIcon className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
              <p className="text-gray-600 mb-2">
                Your ticket has been booked successfully. Booking ID: <strong>{completedBooking?.bookingId}</strong>
              </p>
              {bookingData.primaryWhatsApp && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
                  <p className="text-green-700 text-sm flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/>
                    </svg>
                    📱 Ticket will be sent to: <strong>{bookingData.primaryWhatsApp}</strong>
                  </p>
                  <p className="text-green-600 text-xs text-center mt-1">
                    ✨ You'll receive your ticket with PDF and QR code!
                  </p>
                </div>
              )}
              
              {/* Booking Summary */}
              {completedBooking && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left max-w-md mx-auto">
                  <h3 className="font-semibold text-gray-900 mb-3">Booking Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monument:</span>
                      <span className="font-medium">{completedBooking.monument.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Visit Date:</span>
                      <span className="font-medium">{completedBooking.visitDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time Slot:</span>
                      <span className="font-medium">{completedBooking.timeSlot.startTime} - {completedBooking.timeSlot.endTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Visitors:</span>
                      <span className="font-medium">{completedBooking.visitors.length} person(s)</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-bold text-lg">₹{completedBooking.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-center space-x-4">
                <button 
                  onClick={() => setShowMyBookings(true)}
                  className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  View My Ticket
                </button>
                <button 
                  onClick={() => {
                    setCurrentStep(1)
                    setSelectedMonument(null)
                    setSelectedDate('')
                    setSelectedSlot(null)
                    setBookingData({
                      monument: '',
                      visitDate: '',
                      timeSlot: { startTime: '', endTime: '' },
                      visitors: [{ name: '', age: 18, nationality: 'Indian', whatsappNumber: '' }],
                      type: 'individual',
                      totalAmount: 0,
                      primaryWhatsApp: ''
                    })
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Book Another Ticket
                </button>
              </div>
            </div>
          )}

          {/* My Ticket View */}
          {showMyBookings && completedBooking && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">My Ticket</h2>
                <button
                  onClick={() => setShowMyBookings(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Digital Ticket - This is what will be captured for PDF */}
              <div id="ticket-to-print" className="max-w-md mx-auto bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 rounded-lg overflow-hidden shadow-lg">
                {/* Ticket Header */}
                <div className="bg-orange-600 text-white p-4 text-center">
                  <h3 className="text-lg font-bold">DARSHANA HERITAGE</h3>
                  <p className="text-sm opacity-90">Digital Entry Ticket</p>
                </div>

                {/* Monument Image */}
                <div className="h-48 bg-cover bg-center relative" style={{
                  backgroundImage: `url(${getMonumentImage(completedBooking.monument._id || completedBooking.monument.id || '1')})`
                }}>
                  <img 
                    src={getMonumentImage(completedBooking.monument._id || completedBooking.monument.id || '1')} 
                    alt={completedBooking.monument.name} 
                    className="absolute inset-0 w-full h-full object-cover hidden print:block" 
                  />
                  <div className="h-full w-full bg-black bg-opacity-20 flex items-center justify-center">
                    <h4 className="text-xl font-bold text-white text-center px-4">
                      {completedBooking.monument.name}
                    </h4>
                  </div>
                </div>

                {/* Ticket Details */}
                <div className="p-4 space-y-3">
                  <div className="text-center border-b pb-3">
                    <p className="text-sm text-gray-600">{completedBooking.monument.location}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600 font-medium">Booking ID</p>
                      <p className="font-bold text-orange-600">{completedBooking.bookingId}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium">Status</p>
                      <p className="font-bold text-green-600">{completedBooking.status}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium">Visit Date</p>
                      <p className="font-bold">{completedBooking.visitDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium">Time Slot</p>
                      <p className="font-bold">{completedBooking.timeSlot.startTime} - {completedBooking.timeSlot.endTime}</p>
                    </div>
                  </div>

                  <div className="border-t pt-3">
                    <p className="text-gray-600 font-medium mb-2">Visitors ({completedBooking.visitors.length})</p>
                    {completedBooking.visitors.map((visitor: any, index: number) => (
                      <div key={index} className="flex justify-between items-center py-1 text-sm">
                        <span className="font-medium">{visitor.name}</span>
                        <span className="text-gray-600">{visitor.age} yrs, {visitor.nationality}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Total Amount</span>
                      <span className="text-xl font-bold text-orange-600">₹{completedBooking.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span>Payment ID</span>
                      <span>{completedBooking.paymentId}</span>
                    </div>
                  </div>

                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span>Booked On</span>
                      <span>{completedBooking.bookingDate} at {completedBooking.bookingTime}</span>
                    </div>
                  </div>

                  {/* QR Code Placeholder */}
                  <div className="border-t pt-3 text-center">
                    <div className="w-24 h-24 mx-auto bg-gray-200 rounded border-2 border-dashed border-gray-400 flex items-center justify-center">
                      <QrCodeIcon className="h-12 w-12 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Show this QR code at entry</p>
                  </div>
                </div>

                {/* Ticket Footer */}
                <div className="bg-gray-100 p-3 text-center">
                  <p className="text-xs text-gray-600">
                    Valid only for the date and time mentioned above<br/>
                    Please carry a valid ID proof
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4 mt-6 flex-wrap">
                <button 
                  onClick={() => window.print()}
                  className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Print Ticket
                </button>
                <button 
                  onClick={downloadBackendPDF}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  📄 Download PDF
                </button>
                {bookingData.primaryWhatsApp && (
                  <button 
                    onClick={sendScreenshotTicket}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/>
                    </svg>
                    📸 Send Screenshot
                  </button>
                )}
                <button 
                  onClick={() => {
                    setShowMyBookings(false)
                    setCurrentStep(1)
                    setSelectedMonument(null)
                    setSelectedDate('')
                    setSelectedSlot(null)
                    setBookingData({
                      monument: '',
                      visitDate: '',
                      timeSlot: { startTime: '', endTime: '' },
                      visitors: [{ name: '', age: 18, nationality: 'Indian', whatsappNumber: '' }],
                      type: 'individual',
                      totalAmount: 0,
                      primaryWhatsApp: ''
                    })
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Book New Ticket
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default TicketBooking