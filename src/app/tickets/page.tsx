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
  QrCodeIcon
} from '@heroicons/react/24/outline'

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
    whatsappNumber?: string
  }>
  type: string
  totalAmount: number
}

const TicketBooking = () => {
  const router = useRouter()
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
    visitors: [{ name: '', age: 18, nationality: 'Indian' }],
    type: 'individual',
    totalAmount: 0
  })
  const [whatsappNumber, setWhatsappNumber] = useState('') // Add this state variable
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [completedBooking, setCompletedBooking] = useState<any>(null)
  const [showMyBookings, setShowMyBookings] = useState(false)
  const [fromMonuments, setFromMonuments] = useState(false)
  const [showMonumentSelection, setShowMonumentSelection] = useState(true) // New state to control monument selection view
  const [showDateSelection, setShowDateSelection] = useState(false) // New state for date selection view
  // New states for popup functionality
  const [showSlotPopup, setShowSlotPopup] = useState(false) // New state for slot selection popup
  const [showPaymentPopup, setShowPaymentPopup] = useState(false) // New state for payment popup

  useEffect(() => {
    fetchMonuments()
  }, [])

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
        setShowMonumentSelection(false)
        setShowDateSelection(true)
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
      setMonuments(demoMonuments)
    } catch (error) {
      console.error('Failed to fetch monuments:', error)
    }
  }

  // Function to select a monument and proceed to booking
  const selectMonument = (monument: Monument) => {
    setSelectedMonument(monument)
    setBookingData({ ...bookingData, monument: monument._id })
    setShowMonumentSelection(false)
    setShowDateSelection(true)
  }

  // Function to go back to monument selection
  const goBackToMonuments = () => {
    setShowMonumentSelection(true)
    setShowDateSelection(false)
    setSelectedMonument(null)
    setSelectedDate('')
    setSelectedSlot(null)
    setBookingData({
      monument: '',
      visitDate: '',
      timeSlot: { startTime: '', endTime: '' },
      visitors: [{ name: '', age: 18, nationality: 'Indian' }],
      type: 'individual',
      totalAmount: 0
    })
  }

  // Function to go back to date selection
  const goBackToDateSelection = () => {
    setShowDateSelection(true)
    setSelectedDate('')
    setSelectedSlot(null)
    // Reset booking data except monument
    setBookingData({
      ...bookingData,
      visitDate: '',
      timeSlot: { startTime: '', endTime: '' },
      visitors: [{ name: '', age: 18, nationality: 'Indian' }],
      totalAmount: 0
    })
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
      setShowSlotPopup(true) // Show popup when slots are loaded
    } catch (error) {
      console.error('Failed to fetch slots:', error)
    } finally {
      setTimeout(() => setLoading(false), 500) // Simulate loading time
    }
  }

  // Function to handle slot selection from popup
  const handleSlotSelection = (slot: TimeSlot) => {
    setSelectedSlot(slot)
    setShowSlotPopup(false) // Close popup
    // Update booking data with selected slot
    setBookingData({
      ...bookingData,
      visitDate: selectedDate,
      timeSlot: { startTime: slot.startTime, endTime: slot.endTime }
    })
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

  // Function to generate and download PDF ticket
  const downloadPDF = async () => {
    const element = document.getElementById('ticket-to-print')
    if (element) {
      // Dynamically import html2pdf
      const html2pdfModule = await import('html2pdf.js')
      const html2pdf = html2pdfModule.default
      
      // Store original content
      const originalInnerHtml = element.innerHTML
      
      const opt = {
        margin: [5, 5, 5, 5] as [number, number, number, number],
        filename: `darshana-ticket-${completedBooking?.bookingId || 'booking'}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { 
          scale: 1,
          useCORS: true,
          logging: false
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait' as const,
          compress: true
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      }

      // Add CSS for two-column layout
      const style = `
        .ticket-container {
          display: flex;
          flex-wrap: wrap;
        }
        .left-column, .right-column {
          width: 50%;
          box-sizing: border-box;
          padding: 10px;
        }
        .right-column .qr-code {
          text-align: center;
          margin-top: 20px;
        }
      `;

      // Modify the ticket content to use the two-column layout
      const modifiedHtml = `
        <style>${style}</style>
        <div class="ticket-container">
          <div class="left-column">
            <!-- Existing ticket content -->
            ${element.innerHTML}
          </div>
          <div class="right-column">
            <div class="qr-code">
              <h4>Entry QR Code</h4>
              <div id="qr-code-placeholder"></div>
            </div>
          </div>
        </div>
      `;

      // Replace the original content with the modified HTML
      element.innerHTML = modifiedHtml;

      // Generate and download the PDF
      html2pdf().set(opt).from(element).save();

      // Restore the original content
      element.innerHTML = originalInnerHtml;
    }
  }

  // Function to capture screenshot of ticket and send via WhatsApp
  const sendScreenshotTicket = async () => {
    const element = document.getElementById('ticket-to-print')
    if (element) {
      // Validate WhatsApp number
      if (!whatsappNumber.trim()) {
        alert('Please enter your WhatsApp number')
        return
      }

      // Basic validation for WhatsApp number format
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
      if (!phoneRegex.test(whatsappNumber.trim())) {
        alert('Please enter a valid WhatsApp number (e.g., +919876543210)')
        return
      }

      try {
        // Show loading state
        const sendButton = document.getElementById('send-screenshot-btn')
        if (sendButton) {
          sendButton.innerHTML = '<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Sending...'

        }

        // Dynamically import html2canvas
        const html2canvasModule = await import('html2canvas')
        const html2canvas = html2canvasModule.default

        // Capture screenshot of the ticket
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          logging: false
        })

        // Convert to base64 image
        const imageData = canvas.toDataURL('image/png')

        // Get JWT token from localStorage
        const token = localStorage.getItem('token');

        // Send to backend for WhatsApp delivery
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
        const response = await fetch(`${backendUrl}/api/tickets/send-screenshot`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Add authentication header
          },
          body: JSON.stringify({
            whatsappNumber: whatsappNumber.trim(),
            imageData: imageData,
            ticketData: {
              monument: selectedMonument?.name || 'Unknown Monument',
              visitDate: selectedDate,
              timeSlot: selectedSlot,
              visitors: bookingData.visitors.length,
              totalAmount: calculateTotal()
            }
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
        const sendButton = document.getElementById('send-screenshot-btn')
        if (sendButton) {
          sendButton.innerHTML = '<svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/></svg>📸 Send Screenshot'
        }
      }
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
        setPaymentProcessing(false)
      
        // Redirect to booking confirmation page instead of showing it below
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
          
          // Use replace instead of push to avoid adding to browser history
          router.replace(`/tickets/confirmation?${params.toString()}`);
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
      className="min-h-screen bg-gray-50 py-3"
      initial={fromMonuments ? { opacity: 0, y: 30 } : false}
      animate={fromMonuments ? { opacity: 1, y: 0 } : false}
      transition={fromMonuments ? { 
        type: "tween", 
        ease: [0.25, 0.46, 0.45, 0.94], 
        duration: 0.6,
        delay: 0.2 
      } : undefined}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-3">
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
          {/* Monument Selection View */}
          {showMonumentSelection && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Choose a Monument</h2>
              <p className="text-gray-600 mb-8 text-center">Select a monument to book your ticket and explore its rich history</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {monuments.map((monument) => (
                  <motion.div
                    key={monument._id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => selectMonument(monument)}
                  >
                    <div className="relative h-56">
                      <img
                        src={getMonumentImage(monument._id)}
                        alt={monument.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/heritage-background.jpg';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-xl font-bold">{monument.name}</h3>
                        <p className="text-sm flex items-center mt-1">
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          {monument.location}
                        </p>
                      </div>
                    </div>
                    <div className="p-5">
                      <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                        {getMonumentDescription(monument._id).substring(0, 150)}...
                      </p>
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <span className="text-sm text-gray-600">Starting from</span>
                          <div className="text-lg font-bold text-orange-600">₹{monument.ticketPricing.base}</div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-gray-500">Operating Hours</span>
                          <div className="text-sm font-medium text-gray-800">{monument.operatingHours.split('(')[0].trim()}</div>
                        </div>
                      </div>
                      <button className="w-full py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium">
                        Book Ticket
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Date Selection View (50% monument info, 50% booking options) */}
          {showDateSelection && selectedMonument && !selectedSlot && (
            <div className="p-6">
              <div className="flex items-center mb-6">
                <button
                  onClick={goBackToMonuments}
                  className="flex items-center text-orange-600 hover:text-orange-800 font-medium"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                  </svg>
                  Back to Monuments
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Monument Information (50%) */}
                <div className="space-y-6">
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-transform duration-200 hover:scale-[1.01]">
                    <div className="relative h-64">
                      <img
                        src={getMonumentImage(selectedMonument._id)}
                        alt={selectedMonument.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/heritage-background.jpg';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <h2 className="text-2xl font-bold">{selectedMonument.name}</h2>
                        <p className="flex items-center mt-1">
                          <MapPinIcon className="h-5 w-5 mr-2" />
                          {selectedMonument.location}
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">About this Monument</h3>
                      <p className="text-gray-700 leading-relaxed">
                        {selectedMonument.description || getMonumentDescription(selectedMonument._id)}
                      </p>
                      
                      <div className="mt-6 bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                          <ClockIcon className="h-5 w-5 mr-2 text-orange-600" />
                          Operating Hours
                        </h4>
                        <p className="text-gray-700">{selectedMonument.operatingHours}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Right Column - Booking Options (50%) */}
                <div className="space-y-6">
                  <div className="bg-white rounded-xl shadow-lg p-6 transform transition-transform duration-200 hover:scale-[1.01]">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Book Your Visit</h3>
                    
                    <div className="bg-orange-50 rounded-lg p-4 mb-6">
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                        <TicketIcon className="h-5 w-5 mr-2 text-orange-600" />
                        Ticket Pricing
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-700">Adult (Indian):</span>
                          <span className="font-semibold text-orange-600">₹{selectedMonument.ticketPricing.base}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Student (Below 18):</span>
                          <span className="font-semibold text-green-600">₹{selectedMonument.ticketPricing.student}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Senior Citizen (60+):</span>
                          <span className="font-semibold text-blue-600">₹{selectedMonument.ticketPricing.senior}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Foreign Tourist:</span>
                          <span className="font-semibold text-purple-600">₹{selectedMonument.ticketPricing.foreign}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <CalendarIcon className="h-5 w-5 mr-2 text-orange-600" />
                        Select Visit Date
                      </h4>
                      <div className="flex gap-2">
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base"
                        />
                        <button
                          onClick={() => {
                            if (selectedDate) {
                              fetchAvailableSlots()
                            }
                          }}
                          disabled={!selectedDate}
                          className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                            !selectedDate
                              ? 'bg-gray-300 cursor-not-allowed'
                              : 'bg-orange-600 text-white hover:bg-orange-700'
                          }`}
                        >
                          Select Slots
                        </button>
                      </div>
                    </div>
                    
                    {/* Slot Selection Popup */}
                    {showSlotPopup && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                          <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="text-xl font-semibold text-gray-900">Available Time Slots</h3>
                              <button
                                onClick={() => setShowSlotPopup(false)}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                <XCircleIcon className="h-6 w-6" />
                              </button>
                            </div>
                            
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
                                    onClick={() => handleSlotSelection(slot)}
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
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Date Selected but Slot Not Selected View */}
          {showDateSelection && selectedMonument && selectedDate && !selectedSlot && (
            <div className="p-6">
              <div className="flex items-center mb-6">
                <button
                  onClick={goBackToMonuments}
                  className="flex items-center text-orange-600 hover:text-orange-800 font-medium"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                  </svg>
                  Back to Monuments
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Monument Information (50%) */}
                <div className="space-y-6">
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-transform duration-200 hover:scale-[1.01]">
                    <div className="relative h-64">
                      <img
                        src={getMonumentImage(selectedMonument._id)}
                        alt={selectedMonument.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/heritage-background.jpg';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <h2 className="text-2xl font-bold">{selectedMonument.name}</h2>
                        <p className="flex items-center mt-1">
                          <MapPinIcon className="h-5 w-5 mr-2" />
                          {selectedMonument.location}
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">About this Monument</h3>
                      <p className="text-gray-700 leading-relaxed">
                        {selectedMonument.description || getMonumentDescription(selectedMonument._id)}
                      </p>
                      
                      <div className="mt-6 bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                          <ClockIcon className="h-5 w-5 mr-2 text-orange-600" />
                          Operating Hours
                        </h4>
                        <p className="text-gray-700">{selectedMonument.operatingHours}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Right Column - Booking Options (50%) */}
                <div className="space-y-6">
                  <div className="bg-white rounded-xl shadow-lg p-6 transform transition-transform duration-200 hover:scale-[1.01]">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Book Your Visit</h3>
                    
                    <div className="bg-orange-50 rounded-lg p-4 mb-6">
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                        <TicketIcon className="h-5 w-5 mr-2 text-orange-600" />
                        Ticket Pricing
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-700">Adult (Indian):</span>
                          <span className="font-semibold text-orange-600">₹{selectedMonument.ticketPricing.base}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Student (Below 18):</span>
                          <span className="font-semibold text-green-600">₹{selectedMonument.ticketPricing.student}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Senior Citizen (60+):</span>
                          <span className="font-semibold text-blue-600">₹{selectedMonument.ticketPricing.senior}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Foreign Tourist:</span>
                          <span className="font-semibold text-purple-600">₹{selectedMonument.ticketPricing.foreign}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <CalendarIcon className="h-5 w-5 mr-2 text-orange-600" />
                        Selected Visit Date
                      </h4>
                      <div className="flex gap-2">
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base"
                        />
                        <button
                          onClick={() => {
                            if (selectedDate) {
                              fetchAvailableSlots()
                            }
                          }}
                          disabled={!selectedDate}
                          className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                            !selectedDate
                              ? 'bg-gray-300 cursor-not-allowed'
                              : 'bg-orange-600 text-white hover:bg-orange-700'
                          }`}
                        >
                          Select Slots
                        </button>
                      </div>
                    </div>
                    
                    {/* Slot Selection Popup */}
                    {showSlotPopup && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                          <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="text-xl font-semibold text-gray-900">Available Time Slots</h3>
                              <button
                                onClick={() => setShowSlotPopup(false)}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                <XCircleIcon className="h-6 w-6" />
                              </button>
                            </div>
                            
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
                                    onClick={() => handleSlotSelection(slot)}
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
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Slot Booking View (with visitor details and payment) */}
          {showDateSelection && selectedMonument && selectedDate && selectedSlot && (
            <div className="p-6">
              <div className="flex items-center mb-6">
                <button
                  onClick={goBackToDateSelection}
                  className="flex items-center text-orange-600 hover:text-orange-800 font-medium"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                  </svg>
                  Back to Date Selection
                </button>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Fill Your Details</h2>
              
              {/* Two Column Layout - 50% for monument info, 50% for visitor details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Monument Information (50%) */}
                <div className="space-y-6">
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="relative h-64">
                      <img
                        src={getMonumentImage(selectedMonument._id)}
                        alt={selectedMonument.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/heritage-background.jpg';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-xl font-bold">{selectedMonument.name}</h3>
                        <p className="flex items-center mt-1">
                          <MapPinIcon className="h-5 w-5 mr-2" />
                          {selectedMonument.location}
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">About this Monument</h4>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {selectedMonument.description || getMonumentDescription(selectedMonument._id)}
                      </p>
                      
                      <div className="mt-6 bg-gray-50 rounded-lg p-4">
                        <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                          <ClockIcon className="h-4 w-4 mr-2 text-orange-600" />
                          Operating Hours
                        </h5>
                        <p className="text-gray-700 text-sm">{selectedMonument.operatingHours}</p>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Right Column - Visitor Details Only (50%) */}
                <div className="space-y-5">
                  {/* Selected Slot Info - More compact */}
                  <div className="bg-white rounded-xl shadow-lg p-4">
                    <h3 className="text-base font-semibold text-gray-900 mb-2 flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1 text-orange-600" />
                      Selected Time Slot
                    </h3>
                    
                    <div className="border rounded p-2 bg-orange-50">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-medium text-gray-900 text-sm">
                            {selectedSlot.startTime} - {selectedSlot.endTime}
                          </span>
                          <div className="text-base font-bold text-orange-600 mt-0.5">
                            ₹{selectedSlot.price} per person
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-gray-600">Date: {selectedDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Visitor Details - More compact */}
                  <div className="bg-white rounded-xl shadow-lg p-4">
                    <h3 className="text-base font-semibold text-gray-900 mb-2">Visitor Details</h3>
                    
                    {bookingData.visitors.map((visitor, index) => (
                      <div key={index} className="border rounded p-2 mb-2">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-medium text-xs">Visitor {index + 1}</h4>
                          {bookingData.visitors.length > 1 && (
                            <button
                              onClick={() => removeVisitor(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <XCircleIcon className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2">
                          <input
                            type="text"
                            placeholder="Name"
                            value={visitor.name}
                            onChange={(e) => updateVisitor(index, 'name', e.target.value)}
                            className="px-2 py-1 text-xs border border-gray-300 rounded focus:ring-orange-500 focus:border-orange-500"
                          />
                          <input
                            type="number"
                            placeholder="Age"
                            value={visitor.age}
                            onChange={(e) => updateVisitor(index, 'age', parseInt(e.target.value))}
                            className="px-2 py-1 text-xs border border-gray-300 rounded focus:ring-orange-500 focus:border-orange-500"
                          />
                          <select
                            value={visitor.nationality}
                            onChange={(e) => updateVisitor(index, 'nationality', e.target.value)}
                            className="px-2 py-1 text-xs border border-gray-300 rounded focus:ring-orange-500 focus:border-orange-500"
                          >
                            <option value="Indian">Indian</option>
                            <option value="Foreign">Foreign</option>
                          </select>
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={addVisitor}
                      className="w-full py-1 text-xs border-2 border-dashed border-gray-300 text-gray-600 rounded hover:border-orange-300 hover:text-orange-600"
                    >
                      + Add Visitor
                    </button>

                    <div className="mt-3 p-2 bg-gray-50 rounded">
                      <h4 className="font-medium mb-1 text-xs">Booking Summary</h4>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span>Monument:</span>
                          <span className="truncate max-w-[80px]">{selectedMonument?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Date:</span>
                          <span>{selectedDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Time:</span>
                          <span className="truncate max-w-[60px]">{selectedSlot?.startTime} - {selectedSlot?.endTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Visitors:</span>
                          <span>{bookingData.visitors.length}</span>
                        </div>
                        <div className="flex justify-between font-bold pt-1 border-t">
                          <span>Total:</span>
                          <span>₹{calculateTotal().toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Next Button to Proceed to Payment */}
                    <div className="mt-3">
                      <button
                        onClick={() => setShowPaymentPopup(true)}
                        disabled={bookingData.visitors.some(v => !v.name)}
                        className={`w-full py-2 px-3 rounded text-white font-medium text-sm ${
                          bookingData.visitors.some(v => !v.name)
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-orange-600 hover:bg-orange-700'
                        }`}
                      >
                        Next: Payment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Popup */}
          {showPaymentPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
                <div className="p-5">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">Payment Details</h3>
                    <button
                      onClick={() => setShowPaymentPopup(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <XCircleIcon className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-orange-50 rounded p-3">
                      <h4 className="font-medium text-gray-900 mb-2 text-sm">Order Summary</h4>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span>Ticket Price:</span>
                          <span>₹{selectedSlot ? selectedSlot.price : 0} × {bookingData.visitors.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Taxes (18% GST):</span>
                          <span>₹{(calculateTotal() * 0.18).toFixed(2)}</span>
                        </div>
                        <div className="border-t pt-1.5 flex justify-between font-bold">
                          <span>Total:</span>
                          <span>₹{calculateTotal().toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={proceedToPayment}
                      disabled={paymentProcessing}
                      className={`w-full py-2.5 px-3 rounded text-white font-medium text-sm ${
                        paymentProcessing
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-orange-600 hover:bg-orange-700'
                      }`}
                    >
                      {paymentProcessing ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
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
          )}

          {/* Booking Confirmation - This section has been removed since we're redirecting to a new page */}
          {/* The confirmation now appears on a separate page at /tickets/confirmation */}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default TicketBooking