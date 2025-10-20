const express = require('express')
const { body } = require('express-validator')
const {
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
} = require('../controllers/tickets')
const whatsappService = require('../services/whatsappService')
const path = require('path')
const logger = require('../utils/logger')

const { protect, authorize } = require('../middleware/auth')
const { validateRequest } = require('../middleware/validation')

const router = express.Router()

// Validation rules
const bookingValidation = [
  body('monument')
    .isMongoId()
    .withMessage('Valid monument ID is required'),
  body('visitDate')
    .isISO8601()
    .withMessage('Valid visit date is required'),
  body('timeSlot.startTime')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Valid start time is required (HH:MM format)'),
  body('timeSlot.endTime')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Valid end time is required (HH:MM format)'),
  body('visitors')
    .isArray({ min: 1 })
    .withMessage('At least one visitor is required'),
  body('visitors.*.name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Visitor name must be between 2 and 100 characters'),
  body('visitors.*.age')
    .isInt({ min: 1, max: 120 })
    .withMessage('Valid age is required'),
  body('type')
    .isIn(['individual', 'group', 'family', 'student', 'senior', 'foreign', 'vip'])
    .withMessage('Invalid ticket type')
]

const paymentVerificationValidation = [
  body('ticketId')
    .isMongoId()
    .withMessage('Valid ticket ID is required'),
  body('paymentId')
    .notEmpty()
    .withMessage('Payment ID is required'),
  body('orderId')
    .notEmpty()
    .withMessage('Order ID is required'),
  body('signature')
    .notEmpty()
    .withMessage('Payment signature is required')
]

// Public routes - Defined first to avoid conflicts with parameterized routes
router.get('/available-slots', getAvailableSlots)
router.post('/send-screenshot', sendScreenshot)  // Moved to the top to avoid conflicts

// WhatsApp service configuration and status
router.get('/whatsapp-status', (req, res) => {
  try {
    const providerInfo = whatsappService.getProviderInfo()
    res.json({
      success: true,
      status: {
        provider: providerInfo.provider,
        isReady: providerInfo.isConfigured,
        configured: providerInfo.isConfigured
      },
      message: providerInfo.isConfigured ? 
        `WhatsApp service ready with ${providerInfo.provider} provider` :
        `WhatsApp service needs configuration for ${providerInfo.provider} provider`,
      availableProviders: providerInfo.availableProviders
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking WhatsApp service status',
      error: error.message
    })
  }
})

router.post('/demo-book-whatsapp', async (req, res) => {
  try {
    const { whatsappNumber, monument, visitDate, timeSlot, visitors, totalAmount } = req.body
    
    if (!whatsappNumber) {
      return res.status(400).json({
        success: false,
        message: 'WhatsApp number is required'
      })
    }

    // Create demo ticket data
    const ticketData = {
      bookingId: `DH${Date.now().toString().slice(-6)}`,
      monument: {
        name: monument.name || 'Demo Monument',
        location: monument.location || 'Demo Location'
      },
      visitDate: visitDate,
      timeSlot: timeSlot,
      visitors: visitors,
      totalAmount: totalAmount,
      status: 'Confirmed',
      bookingDate: new Date().toDateString(),
      bookingTime: new Date().toTimeString(),
      paymentId: `PAY${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      paymentMethod: 'Third-Party API Payment'
    }

    // Generate PDF ticket
    let pdfPath = null
    let pdfGenerated = false
    try {
      pdfPath = await whatsappService.generatePDFTicket(ticketData)
      pdfGenerated = true
      logger.info(`✅ PDF ticket generated: ${pdfPath}`)
    } catch (pdfError) {
      logger.error('❌ Failed to generate PDF ticket:', pdfError)
      pdfGenerated = false
    }

    // Send WhatsApp ticket using configured provider
    const result = await whatsappService.sendTicketMessage(whatsappNumber, ticketData)
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: `Ticket sent via ${result.provider} successfully`,
        data: {
          bookingId: ticketData.bookingId,
          messageId: result.messageId,
          sentAt: result.sentAt,
          whatsappNumber: result.recipientNumber,
          provider: result.provider,
          type: 'third_party_api',
          pdfGenerated: pdfGenerated,
          filename: pdfPath ? path.basename(pdfPath) : null
        }
      })
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send ticket via WhatsApp',
        error: result.error,
        provider: whatsappService.provider
      })
    }
  } catch (error) {
    console.error('WhatsApp booking error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    })
  }
})

// Demo endpoint for testing screenshot functionality
router.post('/demo-send-screenshot', async (req, res) => {
  try {
    const { whatsappNumber, imageData, ticketData } = req.body

    if (!whatsappNumber || !imageData || !ticketData) {
      return res.status(400).json({
        success: false,
        message: 'WhatsApp number, image data, and ticket data are required'
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
})

// Protected routes
router.post('/book', protect, bookingValidation, validateRequest, bookTicket)
router.get('/my-tickets', protect, getTickets)
router.get('/:id', protect, getTicket)
router.post('/:id/cancel', protect, cancelTicket)
router.post('/verify-payment', protect, paymentVerificationValidation, validateRequest, verifyPayment)
router.get('/:id/qr-code', protect, generateQRCode)
router.get('/:id/download', protect, downloadTicket)

// Route removed - already defined in public routes section above

// Staff routes
router.post('/:id/check-in', protect, authorize(['admin', 'staff']), checkInTicket)

module.exports = router