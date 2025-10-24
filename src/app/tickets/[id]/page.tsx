'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  TicketIcon,
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  QrCodeIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'

interface TicketData {
  bookingId: string
  monument: {
    _id: string
    name: string
    location: string
  }
  visitDate: string
  timeSlot: {
    startTime: string
    endTime: string
  }
  visitors: Array<{
    name: string
    age: number
    nationality: string
  }>
  totalAmount: number
  bookingDate: string
  bookingTime: string
  status: string
  paymentMethod: string
  paymentId: string
}

const TicketDetailsPage: React.FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // State for WhatsApp number input
  const [whatsappNumber, setWhatsappNumber] = useState('')
  // Toast state for bottom-right notifications
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  // Auto-hide toast
  useEffect(() => {
    if (toastVisible) {
      const timer = setTimeout(() => setToastVisible(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [toastVisible])
  
  // In a real app, this would come from an API call
  // For now, we'll simulate with mock data based on URL params
  const ticketData: TicketData = {
    bookingId: searchParams.get('bookingId') || 'DH123456',
    monument: {
      _id: searchParams.get('monumentId') || '1',
      name: searchParams.get('monumentName') || 'Taj Mahal',
      location: searchParams.get('location') || 'Agra, Uttar Pradesh'
    },
    visitDate: searchParams.get('visitDate') || '2023-06-15',
    timeSlot: {
      startTime: searchParams.get('startTime') || '10:00 AM',
      endTime: searchParams.get('endTime') || '12:00 PM'
    },
    visitors: JSON.parse(searchParams.get('visitors') || '[{"name":"John Doe","age":30,"nationality":"Indian"}]'),
    totalAmount: parseFloat(searchParams.get('totalAmount') || '100'),
    bookingDate: searchParams.get('bookingDate') || '2023-06-01',
    bookingTime: searchParams.get('bookingTime') || '14:30',
    status: 'Confirmed',
    paymentMethod: 'Credit Card',
    paymentId: searchParams.get('paymentId') || 'PAY789XYZ'
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

  // Function to generate and download PDF ticket
  const downloadPDF = async () => {
    const element = document.getElementById('ticket-to-print')
    if (element) {
      // Dynamically import the libraries
      const html2pdfModule = await import('html2pdf.js')
      const html2pdf = html2pdfModule.default
      
      // Store original content
      const originalInnerHtml = element.innerHTML
      
      const opt = {
        margin: [5, 5, 5, 5] as [number, number, number, number],
        filename: `darshana-ticket-${ticketData.bookingId}.pdf`,
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
        setToastType('error')
        setToastMessage('Please enter your WhatsApp number')
        setToastVisible(true)
        return
      }
      
      // Basic validation for WhatsApp number format
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
      if (!phoneRegex.test(whatsappNumber.trim())) {
        setToastType('error')
        setToastMessage('Please enter a valid WhatsApp number (e.g., +919876543210)')
        setToastVisible(true)
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
        
        // Capture screenshot of the ticket with reduced quality to minimize payload
        const canvas = await html2canvas(element, {
          scale: 1, // Reduced scale from 2 to 1
          useCORS: true,
          logging: false,
          width: element.offsetWidth,
          height: element.offsetHeight,
          onclone: (clonedDoc) => {
            // Reduce image quality in cloned document
            const images = clonedDoc.getElementsByTagName('img');
            for (let i = 0; i < images.length; i++) {
              images[i].style.imageRendering = 'pixelated';
            }
          }
        })
        
        // Convert to base64 image with reduced quality
        let imageData = canvas.toDataURL('image/jpeg', 0.8) // Changed to JPEG with 80% quality
        
        // Check if image data was captured successfully
        if (!imageData || imageData.length < 100) {
          throw new Error('Failed to capture ticket image. Please try again.')
        }
        
        // Further compress if the image is still too large
        if (imageData.length > 5000000) { // If larger than 5MB
          // Create a new canvas with reduced dimensions
          const tempCanvas = document.createElement('canvas');
          const tempCtx = tempCanvas.getContext('2d');
          const maxWidth = 800;
          const scale = Math.min(maxWidth / canvas.width, 1);
          tempCanvas.width = canvas.width * scale;
          tempCanvas.height = canvas.height * scale;
          
          if (tempCtx) {
            tempCtx.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height);
            imageData = tempCanvas.toDataURL('image/jpeg', 0.7); // Further reduced quality
          }
        }
        
        // Prepare ticket data for WhatsApp message
        const whatsappTicketData = {
          bookingId: ticketData.bookingId,
          monument: {
            name: ticketData.monument.name,
            location: ticketData.monument.location
          },
          visitDate: ticketData.visitDate,
          timeSlot: ticketData.timeSlot,
          visitors: ticketData.visitors,
          totalAmount: ticketData.totalAmount,
          status: ticketData.status,
          bookingDate: ticketData.bookingDate,
          bookingTime: ticketData.bookingTime,
          paymentId: ticketData.paymentId,
          paymentMethod: ticketData.paymentMethod
        }
        
        // Send directly to WhatsApp service
        const whatsappServiceUrl = 'http://localhost:5004';
        const response = await fetch(`${whatsappServiceUrl}/demo-send-screenshot`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            whatsappNumber: whatsappNumber.trim(),
            imageData: imageData,
            ticketData: whatsappTicketData
          })
        })
        
        // Check if response is valid
        if (!response.ok) {
          // Try to parse error response
          let errorMessage = `Failed to send request: ${response.status} ${response.statusText}`
          try {
            const errorData = await response.json()
            if (errorData.message) {
              errorMessage = errorData.message
            }
          } catch (e) {
            // If we can't parse the error, use the default message
          }
          throw new Error(errorMessage)
        }
        
        const result = await response.json()
        
        // Show success toast regardless of backend status as requested
        setToastType('success')
        setToastMessage('✅ Ticket screenshot sent to your WhatsApp. Happy Journey!')
        setToastVisible(true)
        
      } catch (error: any) {
        console.error('Screenshot capture failed:', error)
        // As per request, show success toast instead of error popup
        setToastType('success')
        setToastMessage('✅ Ticket screenshot sent to your WhatsApp. Happy Journey!')
        setToastVisible(true)
      } finally {
        // Reset button text
        const sendButton = document.getElementById('send-screenshot-btn')
        if (sendButton) {
          sendButton.innerHTML = '<svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/></svg>📸 Send Screenshot'
        }
      }
    } else {
      alert('❌ Unable to capture ticket. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-orange-600 hover:text-orange-800 font-medium"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Booking
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Your Ticket</h1>
          <div></div> {/* Spacer for alignment */}
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Ticket Content */}
          <div id="ticket-to-print" className="bg-gradient-to-br from-orange-50 to-amber-50">
            {/* Ticket Header */}
            <div className="bg-orange-600 text-white p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <TicketIcon className="h-8 w-8 mr-2" />
                <h2 className="text-2xl font-bold">Darshana Heritage Ticket</h2>
              </div>
              <p className="text-lg opacity-90">Cultural & Historical Experience</p>
            </div>
            
            {/* Ticket Body */}
            <div className="p-6">
              {/* Monument Info */}
              <div className="relative h-56 mb-6 rounded-xl overflow-hidden shadow-md">
                <img 
                  src={getMonumentImage(ticketData.monument._id)} 
                  alt={ticketData.monument.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/heritage-background.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
                  <div className="text-white p-4 w-full">
                    <h3 className="text-2xl font-bold">{ticketData.monument.name}</h3>
                    <p className="flex items-center text-lg mt-1">
                      <MapPinIcon className="h-5 w-5 mr-2" />
                      {ticketData.monument.location}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Booking Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <h4 className="font-medium text-gray-900 text-sm mb-1 flex items-center">
                    <TicketIcon className="h-4 w-4 mr-2 text-orange-600" />
                    Booking ID
                  </h4>
                  <p className="text-orange-600 font-mono text-lg">{ticketData.bookingId}</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <h4 className="font-medium text-gray-900 text-sm mb-1 flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2 text-orange-600" />
                    Booking Date
                  </h4>
                  <p className="text-gray-700 text-lg">{ticketData.bookingDate}</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <h4 className="font-medium text-gray-900 text-sm mb-1 flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2 text-orange-600" />
                    Visit Date
                  </h4>
                  <p className="text-gray-700 text-lg">{ticketData.visitDate}</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <h4 className="font-medium text-gray-900 text-sm mb-1 flex items-center">
                    <ClockIcon className="h-4 w-4 mr-2 text-orange-600" />
                    Time Slot
                  </h4>
                  <p className="text-gray-700 text-lg">{ticketData.timeSlot.startTime} - {ticketData.timeSlot.endTime}</p>
                </div>
              </div>
              
              {/* Visitor Details */}
              <div className="border-t border-b border-gray-200 py-4 mb-6">
                <h4 className="font-medium text-gray-900 mb-3 text-lg flex items-center">
                  <svg className="h-5 w-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                  Visitors ({ticketData.visitors.length})
                </h4>
                <div className="space-y-3">
                  {ticketData.visitors.map((visitor, index) => (
                    <div key={index} className="visitor-item flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
                      <span className="font-medium text-gray-900">{visitor.name}</span>
                      <div className="text-gray-600 text-sm">
                        <span>Age: {visitor.age}</span>
                        <span className="mx-2">•</span>
                        <span>{visitor.nationality}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Payment Details */}
              <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6 shadow-sm">
                <h4 className="font-medium text-gray-900 mb-3 text-lg flex items-center">
                  <svg className="h-5 w-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Payment Details
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Price:</span>
                    <span>₹{(ticketData.totalAmount / 1.18).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">GST (18%):</span>
                    <span>₹{(ticketData.totalAmount * 0.18).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t pt-2 mt-2">
                    <span className="text-gray-900">Total Paid:</span>
                    <span className="text-green-600 text-xl">₹{ticketData.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-600">Payment Method:</span>
                    <span>{ticketData.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Payment ID:</span>
                    <span className="font-mono">{ticketData.paymentId}</span>
                  </div>
                </div>
              </div>
              
              {/* QR Code */}
              <div className="border-t pt-6 text-center">
                <h4 className="font-medium text-gray-900 mb-3 text-lg flex items-center justify-center">
                  <QrCodeIcon className="h-5 w-5 mr-2 text-orange-600" />
                  Entry QR Code
                </h4>
                <div className="inline-block border-2 border-dashed border-gray-300 rounded-xl p-4 bg-white">
                  <div className="bg-white p-3 rounded">
                    <QrCodeIcon className="w-32 h-32 mx-auto text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    Show this QR code at the entrance for entry validation
                  </p>
                </div>
              </div>
            </div>
            
            {/* Ticket Footer */}
            <div className="bg-gray-100 p-4 text-center text-sm text-gray-600 border-t border-gray-200">
              Thank you for choosing Darshana. Enjoy your cultural journey!
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-4">
              <div className="w-full sm:w-auto">
                <label htmlFor="whatsapp-number" className="block text-sm font-medium text-gray-700 mb-1">
                  WhatsApp Number for Ticket
                </label>
                <input
                  type="tel"
                  id="whatsapp-number"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="Enter your WhatsApp number (e.g., +919876543210)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={downloadPDF}
                className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Download PDF Ticket
              </button>
              <button
                id="send-screenshot-btn"
                onClick={sendScreenshotTicket}
                disabled={!whatsappNumber.trim()}
                className={`flex items-center justify-center px-6 py-3 rounded-lg transition-colors shadow-sm ${
                  whatsappNumber.trim() 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/>
                </svg>
                📸 Send Screenshot
              </button>
            </div>
            <div className="mt-4 text-center text-sm text-gray-500">
              <p>Note: Make sure your UltraMsg account is active and properly configured for WhatsApp messaging.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom-right toast notification */}
      {toastVisible && (
        <div className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-white transition-opacity ${toastType === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toastMessage}
        </div>
      )}
    </div>
  )
}

export default TicketDetailsPage