const Ticket = require('../models/Ticket')
const Monument = require('../models/Monument')
const User = require('../models/User')
const whatsappService = require('../services/whatsappService')
const { validationResult } = require('express-validator')
const crypto = require('crypto')
// Add PDF generation libraries
const PDFDocument = require('pdfkit')
const fs = require('fs')
const path = require('path')

// Add required libraries for image processing
const axios = require('axios')

// Helper function to get monument image path
const getMonumentImagePath = (monumentId) => {
  const imageMap = {
    '1': 'taj-mahal.jpg',
    '2': 'red-fort.jpg', 
    '3': 'hawa-mahal.jpg',
    '4': 'amer-fort.jpg',
    '5': 'bhangarhfort.jpg'
  }
  
  const imageName = imageMap[monumentId] || 'heritage-background.jpg'
  return path.join(__dirname, '..', '..', 'public', imageName)
}

// Helper function to check if image exists
const imageExists = (imagePath) => {
  try {
    return fs.existsSync(imagePath)
  } catch (err) {
    return false
  }
}

// @desc    Book a ticket
// @route   POST /api/tickets/book
// @access  Private
const bookTicket = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      })
    }

    const { monument, visitDate, timeSlot, visitors, type, specialRequests, addons } = req.body

    // Verify monument exists
    const monumentDoc = await Monument.findById(monument)
    if (!monumentDoc) {
      return res.status(404).json({
        success: false,
        message: 'Monument not found'
      })
    }

    // Check slot availability
    const existingBookings = await Ticket.find({
      monument,
      visitDate: new Date(visitDate),
      'timeSlot.startTime': timeSlot.startTime,
      status: { $in: ['booked', 'confirmed', 'checked_in'] }
    })

    const totalBooked = existingBookings.reduce((sum, ticket) => sum + ticket.totalVisitors, 0)
    const available = (monumentDoc.capacity || 100) - totalBooked

    if (available < visitors.length) {
      return res.status(400).json({
        success: false,
        message: 'Not enough slots available for selected time'
      })
    }

    // Calculate pricing
    const basePrice = monumentDoc.ticketPricing?.base || 50
    let totalAmount = basePrice * visitors.length

    // Apply discounts
    const discounts = []
    visitors.forEach(visitor => {
      if (visitor.age < 18) {
        discounts.push({
          type: 'student',
          amount: basePrice * 0.5,
          description: 'Student discount (50%)'
        })
        totalAmount -= basePrice * 0.5
      } else if (visitor.age >= 60) {
        discounts.push({
          type: 'senior',
          amount: basePrice * 0.3,
          description: 'Senior citizen discount (30%)'
        })
        totalAmount -= basePrice * 0.3
      }
    })

    // Add addon costs
    const addonTotal = addons?.reduce((sum, addon) => sum + (addon.price * addon.quantity), 0) || 0
    totalAmount += addonTotal

    // Add taxes
    const gstRate = 0.18
    const gstAmount = totalAmount * gstRate
    const finalAmount = totalAmount + gstAmount

    // Create ticket
    const ticketData = {
      type,
      category: 'entry',
      monument,
      user: req.user.id,
      visitors,
      visitDate: new Date(visitDate),
      timeSlot,
      pricing: {
        basePrice,
        discounts,
        taxes: [{
          name: 'GST',
          rate: gstRate,
          amount: gstAmount
        }],
        totalAmount: finalAmount
      },
      specialRequests: specialRequests || {},
      addons: addons || [],
      payment: {
        status: 'pending'
      }
    }

    const ticket = await Ticket.create(ticketData)

    // Generate QR code
    await ticket.generateQRCode()

    // Create Razorpay order (placeholder)
    const orderId = `order_${Date.now()}`
    
    res.status(201).json({
      success: true,
      message: 'Ticket booking initiated',
      data: {
        ticketId: ticket._id,
        orderId,
        amount: Math.round(finalAmount * 100), // Razorpay expects amount in paise
        currency: 'INR'
      }
    })
  } catch (error) {
    console.error('Book ticket error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// @desc    Get user tickets
// @route   GET /api/tickets/my-tickets
// @access  Private
const getTickets = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query

    const query = { user: req.user.id }
    if (status) query.status = status

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: {
        path: 'monument',
        select: 'name location images operatingHours'
      }
    }

    const tickets = await Ticket.paginate(query, options)

    res.status(200).json({
      success: true,
      data: tickets.docs,
      pagination: {
        currentPage: tickets.page,
        totalPages: tickets.totalPages,
        totalItems: tickets.totalDocs,
        hasNext: tickets.hasNextPage,
        hasPrev: tickets.hasPrevPage
      }
    })
  } catch (error) {
    console.error('Get tickets error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// @desc    Get single ticket
// @route   GET /api/tickets/:id
// @access  Private
const getTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findOne({
      _id: req.params.id,
      user: req.user.id
    }).populate('monument', 'name location images operatingHours')

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      })
    }

    res.status(200).json({
      success: true,
      data: ticket
    })
  } catch (error) {
    console.error('Get ticket error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// @desc    Cancel ticket
// @route   POST /api/tickets/:id/cancel
// @access  Private
const cancelTicket = async (req, res) => {
  try {
    const { reason } = req.body
    
    const ticket = await Ticket.findOne({
      _id: req.params.id,
      user: req.user.id
    })

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      })
    }

    await ticket.cancel(reason, req.user.id)

    res.status(200).json({
      success: true,
      message: 'Ticket cancelled successfully',
      data: {
        refundAmount: ticket.cancellation.refundAmount,
        cancellationFee: ticket.cancellation.cancellationFee
      }
    })
  } catch (error) {
    if (error.message.includes('Cannot cancel')) {
      return res.status(400).json({
        success: false,
        message: error.message
      })
    }
    
    console.error('Cancel ticket error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// @desc    Check in ticket
// @route   POST /api/tickets/:id/check-in
// @access  Private (Staff/Admin)
const checkInTicket = async (req, res) => {
  try {
    const { actualVisitors, notes } = req.body
    
    const ticket = await Ticket.findById(req.params.id)

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      })
    }

    await ticket.checkIn(req.user.id, actualVisitors, notes)

    res.status(200).json({
      success: true,
      message: 'Ticket checked in successfully'
    })
  } catch (error) {
    if (error.message.includes('Cannot check in')) {
      return res.status(400).json({
        success: false,
        message: error.message
      })
    }
    
    console.error('Check in ticket error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// @desc    Get available slots
// @route   GET /api/tickets/available-slots
// @access  Public
const getAvailableSlots = async (req, res) => {
  try {
    const { monumentId, date } = req.query

    if (!monumentId || !date) {
      return res.status(400).json({
        success: false,
        message: 'Monument ID and date are required'
      })
    }

    const slots = await Ticket.getAvailableSlots(monumentId, date)

    res.status(200).json({
      success: true,
      data: slots
    })
  } catch (error) {
    console.error('Get available slots error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// @desc    Verify payment
// @route   POST /api/tickets/verify-payment
// @access  Private
const verifyPayment = async (req, res) => {
  try {
    const { ticketId, paymentId, orderId, signature } = req.body

    const ticket = await Ticket.findOne({
      _id: ticketId,
      user: req.user.id
    })

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      })
    }

    // Verify Razorpay signature (simplified)
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET || 'test_secret')
      .update(orderId + '|' + paymentId)
      .digest('hex')

    if (signature === expectedSignature) {
      ticket.payment.status = 'completed'
      ticket.payment.paymentId = paymentId
      ticket.payment.transactionId = orderId
      ticket.payment.paidAt = new Date()
      ticket.status = 'confirmed'
      
      await ticket.save()

      res.status(200).json({
        success: true,
        message: 'Payment verified successfully'
      })
    } else {
      ticket.payment.status = 'failed'
      await ticket.save()

      res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      })
    }
  } catch (error) {
    console.error('Verify payment error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// @desc    Generate QR code
// @route   GET /api/tickets/:id/qr-code
// @access  Private
const generateQRCode = async (req, res) => {
  try {
    const ticket = await Ticket.findOne({
      _id: req.params.id,
      user: req.user.id
    })

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      })
    }

    if (!ticket.qrCode) {
      await ticket.generateQRCode()
    }

    res.status(200).json({
      success: true,
      data: {
        qrCode: ticket.qrCode,
        ticketNumber: ticket.ticketNumber
      }
    })
  } catch (error) {
    console.error('Generate QR code error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// @desc    Download ticket
// @route   GET /api/tickets/:id/download
// @access  Private
const downloadTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findOne({
      _id: req.params.id,
      user: req.user.id
    }).populate('monument', 'name location images')

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      })
    }

    // Create a PDF document with optimized layout for single page
    const doc = new PDFDocument({
      size: 'A4',
      margin: 30  // Reduced margin to fit more content
    })

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename=ticket-${ticket.ticketNumber}.pdf`)
    
    // Pipe the PDF to the response
    doc.pipe(res)

    // Get monument image path
    const monumentId = ticket.monument?._id?.toString() || '1'
    const imagePath = getMonumentImagePath(monumentId)
    
    // Orange header background to match website display
    doc.rect(30, 30, 535, 50).fill('#ea580c') // Orange header with reduced height
    
    // Add Darshana Heritage header
    doc.fontSize(18)  // Reduced font size
      .fillColor('#FFFFFF')
      .text('DARSHANA HERITAGE', 30, 40, { align: 'center', width: 535 })
    
    doc.fontSize(12)  // Reduced font size
      .fillColor('#FFFFFF')
      .text('Digital Entry Ticket', 30, 65, { align: 'center', width: 535 })

    // Monument image area - reduced height
    const imageY = 90
    const imageHeight = 100  // Reduced from 150 to 100
    
    // Try to load and display the monument image
    try {
      if (imageExists(imagePath)) {
        doc.image(imagePath, 30, imageY, { 
          width: 535, 
          height: imageHeight,
          fit: [535, imageHeight],
          align: 'center'
        })
      } else {
        // Fallback to placeholder if image not found
        doc.rect(30, imageY, 535, imageHeight).fill('#f3f4f6')
        doc.fillColor('#6b7280')
           .fontSize(14)  // Reduced font size
           .text(ticket.monument.name, 300, imageY + 45, { align: 'center' })
      }
    } catch (imageError) {
      console.log(`Error loading image: ${imageError.message}`)
      // Fallback placeholder
      doc.rect(30, imageY, 535, imageHeight).fill('#f3f4f6')
      doc.fillColor('#6b7280')
         .fontSize(14)  // Reduced font size
         .text(ticket.monument.name, 300, imageY + 45, { align: 'center' })
    }
    
    // Main content area - light background like website display
    doc.rect(30, 200, 535, 320).fill('#fff8f0')  // Reduced height from 400 to 320
    
    // Monument name and location (centered)
    doc.fillColor('#1f2937')
       .fontSize(20)  // Reduced from 24 to 20
       .font('Helvetica-Bold')
       .text(ticket.monument.name, 50, 210, { align: 'center', width: 495 })
    
    doc.fillColor('#6b7280')
       .fontSize(12)  // Reduced from 14 to 12
       .font('Helvetica')
       .text(ticket.monument.location, 50, 235, { align: 'center', width: 495 })
       .moveDown()
    
    // Content area layout matching website display
    let yPos = 260  // Reduced from 360
    
    // Left column - Booking ID
    doc.fillColor('#6b7280')
       .fontSize(10)  // Reduced from 12 to 10
       .font('Helvetica-Bold')
       .text('Booking ID', 50, yPos)
    
    doc.fillColor('#ea580c')
       .fontSize(12)  // Reduced from 14 to 12
       .font('Helvetica-Bold')
       .text(ticket.ticketNumber, 50, yPos + 15)
    
    // Right column - Status
    doc.fillColor('#6b7280')
       .fontSize(10)  // Reduced from 12 to 10
       .font('Helvetica-Bold')
       .text('Status', 350, yPos)
    
    doc.fillColor('#059669')
       .fontSize(12)  // Reduced from 14 to 12
       .font('Helvetica-Bold')
       .text(ticket.status, 350, yPos + 15)
    
    yPos += 40  // Reduced spacing
    
    // Visit Date and Time Slot
    doc.fillColor('#6b7280')
       .fontSize(10)  // Reduced from 12 to 10
       .font('Helvetica-Bold')
       .text('Visit Date', 50, yPos)
    
    doc.fillColor('#1f2937')
       .fontSize(12)  // Reduced from 14 to 12
       .font('Helvetica-Bold')
       .text(new Date(ticket.visitDate).toLocaleDateString(), 50, yPos + 15)
    
    doc.fillColor('#6b7280')
       .fontSize(10)  // Reduced from 12 to 10
       .font('Helvetica-Bold')
       .text('Time Slot', 350, yPos)
    
    doc.fillColor('#1f2937')
       .fontSize(12)  // Reduced from 14 to 12
       .font('Helvetica-Bold')
       .text(`${ticket.timeSlot.startTime} - ${ticket.timeSlot.endTime}`, 350, yPos + 15)
    
    yPos += 40  // Reduced spacing
    
    // Visitors section
    doc.fillColor('#6b7280')
       .fontSize(10)  // Reduced from 12 to 10
       .font('Helvetica-Bold')
       .text(`Visitors (${ticket.visitors.length})`, 50, yPos)
    
    yPos += 20  // Reduced spacing
    
    // List all visitors - reduced font size and spacing
    ticket.visitors.forEach((visitor, index) => {
      if (yPos < 450) {  // Prevent going beyond content area
        doc.fillColor('#1f2937')
           .fontSize(10)  // Reduced from 12 to 10
           .font('Helvetica')
           .text(`${visitor.name}`, 50, yPos)
           .fillColor('#6b7280')
           .fontSize(8)  // Reduced from 10 to 8
           .text(`${visitor.age} yrs, ${visitor.nationality}`, 350, yPos)
        yPos += 15  // Reduced spacing
      }
    })
    
    yPos = Math.max(yPos, 460)  // Ensure minimum position
    
    // Total Amount
    doc.fillColor('#6b7280')
       .fontSize(10)  // Reduced from 12 to 10
       .font('Helvetica-Bold')
       .text('Total Amount', 50, yPos)
    
    doc.fillColor('#ea580c')
       .fontSize(14)  // Reduced from 18 to 14
       .font('Helvetica-Bold')
       .text(`₹${ticket.pricing.totalAmount.toFixed(2)}`, 50, yPos + 15)
    
    // Payment ID
    doc.fillColor('#6b7280')
       .fontSize(10)  // Reduced from 12 to 10
       .font('Helvetica-Bold')
       .text('Payment ID', 350, yPos)
    
    doc.fillColor('#1f2937')
       .fontSize(10)  // Reduced from 12 to 10
       .font('Helvetica')
       .text(ticket.payment.paymentId || 'N/A', 350, yPos + 15)
    
    yPos += 40  // Reduced spacing
    
    // Booked On
    doc.fillColor('#6b7280')
       .fontSize(10)  // Reduced from 12 to 10
       .font('Helvetica-Bold')
       .text('Booked On', 50, yPos)
    
    doc.fillColor('#1f2937')
       .fontSize(10)  // Reduced from 12 to 10
       .font('Helvetica')
       .text(`${new Date(ticket.createdAt).toLocaleDateString()} at ${new Date(ticket.createdAt).toLocaleTimeString()}`, 50, yPos + 15)
    
    // QR Code section (moved up to fit on one page)
    if (ticket.qrCode) {
      try {
        // Convert base64 to buffer
        const qrBuffer = Buffer.from(ticket.qrCode.split(',')[1], 'base64')
        
        // Add QR Code (centered and smaller)
        const qrX = (doc.page.width - 80) / 2
        const qrY = 530  // Moved up from 600
        
        // QR code placeholder border (dashed)
        doc.strokeColor('#d1d5db')
           .lineWidth(1)  // Reduced line width
           .dash(3, {space: 3})  // Reduced dash size
           .rect(qrX - 5, qrY - 5, 90, 90)  // Smaller rectangle
           .stroke()
           .undash() // Reset dash pattern
        
        doc.image(qrBuffer, qrX, qrY, { width: 80 })  // Smaller QR code
        
        // QR Code instruction
        doc.fillColor('#6b7280')
           .fontSize(10)  // Reduced from 12 to 10
           .font('Helvetica')
           .text('Show this QR code at entry', qrX - 40, qrY + 95, { width: 160, align: 'center' })
      } catch (qrError) {
        console.error('QR code error:', qrError)
      }
    } else {
      // QR code placeholder
      const qrX = (doc.page.width - 80) / 2
      const qrY = 530  // Moved up from 600
      
      doc.strokeColor('#d1d5db')
         .lineWidth(1)  // Reduced line width
         .dash(3, {space: 3})  // Reduced dash size
         .rect(qrX - 5, qrY - 5, 90, 90)  // Smaller rectangle
         .stroke()
         .undash()
      
      doc.fillColor('#6b7280')
         .fontSize(10)  // Reduced from 12 to 10
         .font('Helvetica')
         .text('Show this QR code at entry', qrX - 40, qrY + 95, { width: 160, align: 'center' })
    }
    
    // Footer - moved up to fit on one page
    doc.fillColor('#6b7280')
       .fontSize(8)  // Reduced from 10 to 8
       .font('Helvetica')
       .text('Valid only for the date and time mentioned above', 50, 640, { align: 'center', width: 500 })
    
    doc.text('Please carry a valid ID proof', 50, 650, { align: 'center', width: 500 })

    // Finalize the PDF
    doc.end()
  } catch (error) {
    console.error('Download ticket error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    })
  }
}

// @desc    Send ticket screenshot via WhatsApp
// @route   POST /api/tickets/send-screenshot
// @access  Private
const sendScreenshot = async (req, res) => {
  try {
    const { whatsappNumber, imageData, ticketData } = req.body

    if (!whatsappNumber || !imageData || !ticketData) {
      return res.status(400).json({
        success: false,
        message: 'WhatsApp number, image data, and ticket data are required'
      })
    }

    // Validate WhatsApp number
    if (!whatsappService.validatePhoneNumber(whatsappNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid WhatsApp number format'
      })
    }

    // Send screenshot via WhatsApp
    const result = await whatsappService.sendScreenshotMessage(whatsappNumber, imageData, ticketData)
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Ticket screenshot sent successfully',
        data: result
      })
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send ticket screenshot',
        error: result.error
      })
    }
  } catch (error) {
    console.error('Send screenshot error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    })
  }
}

// ... existing code ...

module.exports = {
  bookTicket,
  getTickets,
  getTicket,
  cancelTicket,
  checkInTicket,
  getAvailableSlots,
  verifyPayment,
  generateQRCode,
  downloadTicket,
  sendScreenshot
}
