const axios = require('axios')
const logger = require('../utils/logger')

// Add required libraries for image processing
const fs = require('fs')
const path = require('path')

class WhatsAppService {
  constructor() {
    // Third-party API configuration - Choose one of these options:
    
    // Option 1: Twilio WhatsApp API
    this.twilioAccountSid = process.env.TWILIO_ACCOUNT_SID || 'your_twilio_account_sid'
    this.twilioAuthToken = process.env.TWILIO_AUTH_TOKEN || 'your_twilio_auth_token'
    this.twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886' // Twilio Sandbox
    
    // Option 2: WhatsApp Business API (Official)
    this.whatsappBusinessApiUrl = process.env.WHATSAPP_BUSINESS_API_URL || 'https://graph.facebook.com/v18.0'
    this.whatsappBusinessToken = process.env.WHATSAPP_BUSINESS_TOKEN || 'your_business_api_token'
    this.whatsappBusinessPhoneId = process.env.WHATSAPP_BUSINESS_PHONE_ID || 'your_phone_number_id'
    
    // Option 3: UltraMsg (Popular WhatsApp API service)
    this.ultraMsgInstanceId = process.env.ULTRAMSG_INSTANCE_ID || 'your_instance_id'
    this.ultraMsgToken = process.env.ULTRAMSG_TOKEN || 'your_token'
    this.ultraMsgApiUrl = `https://api.ultramsg.com/${this.ultraMsgInstanceId}`
    
    // Option 4: Other third-party services (ChatAPI, MessageBird, etc.)
    this.thirdPartyApiUrl = process.env.WHATSAPP_THIRD_PARTY_URL || 'https://api.chat-api.com/instance123456'
    this.thirdPartyApiKey = process.env.WHATSAPP_THIRD_PARTY_KEY || 'your_api_key'
    
    // Current provider: 'twilio', 'business_api', 'ultramsg', 'third_party', or 'demo'
    this.provider = process.env.WHATSAPP_PROVIDER || 'demo'
  }

  /**
   * Format phone number to international format
   * @param {string} phoneNumber - Phone number to format
   * @returns {string} - Formatted phone number
   */
  formatPhoneNumber(phoneNumber) {
    // Remove all non-numeric characters
    const cleanNumber = phoneNumber.replace(/[^0-9]/g, '')
    
    // Add country code if not present (assuming Indian numbers)
    if (cleanNumber.startsWith('91')) {
      return cleanNumber
    } else if (cleanNumber.startsWith('0')) {
      // Remove leading 0 and add country code
      return '91' + cleanNumber.substring(1)
    } else if (cleanNumber.length === 10) {
      // Add Indian country code
      return '91' + cleanNumber
    }
    
    return cleanNumber
  }

  /**
   * Generate ticket message for WhatsApp (without QR code as requested)
   * @param {Object} ticketData - Ticket information
   * @returns {string} - Formatted WhatsApp message
   */
  generateTicketMessage(ticketData) {
    const message = `🎫 *DARSHANA HERITAGE - DIGITAL TICKET*\n` +
      `═══════════════════════════════════\n\n` +
      `🏛️ *MONUMENT:* ${ticketData.monument.name}\n` +
      `📍 *LOCATION:* ${ticketData.monument.location}\n\n` +
      `🎫 *BOOKING DETAILS:*\n` +
      `• Booking ID: *${ticketData.bookingId}\n` +
      `• Status: *${ticketData.status}*\n` +
      `• Booked on: ${ticketData.bookingDate} at ${ticketData.bookingTime}\n\n` +
      `📅 *VISIT INFORMATION:*\n` +
      `• Date: *${ticketData.visitDate}\n` +
      `• Time: *${ticketData.timeSlot.startTime} - ${ticketData.timeSlot.endTime}\n\n` +
      `👥 *VISITOR DETAILS (${ticketData.visitors.length} person${ticketData.visitors.length > 1 ? 's' : ''}):*\n` +
      ticketData.visitors.map((v, i) => 
        `${i + 1}. *${v.name}* (${v.age} yrs, ${v.nationality})`
      ).join('\n') +
      `\n\n💰 *PAYMENT DETAILS:*\n` +
      `• Total Amount: *₹${ticketData.totalAmount.toFixed(2)}\n` +
      `• Payment ID: ${ticketData.paymentId}\n` +
      `• Payment Method: ${ticketData.paymentMethod}\n\n` +
      `⚠️ *IMPORTANT INSTRUCTIONS:*\n` +
      `• Keep this ticket safe and accessible\n` +
      `• Show this ticket at the monument entrance\n` +
      `• Carry a valid photo ID for verification\n` +
      `• Arrive 15 minutes before your time slot\n` +
      `• Tickets are non-refundable\n\n` +
      `📱 *Need help?*\n` +
      `Contact: +91-9876543210\n` +
      `Email: support@darshana.com\n` +
      `Website: www.darshana.com\n\n` +
      `Thank you for choosing Darshana! 🙏`

    return message
  }

  /**
   * Generate short ticket message for WhatsApp screenshot caption
   * @param {Object} ticketData - Ticket information
   * @returns {string} - Formatted short WhatsApp message
   */
  generateScreenshotCaption(ticketData) {
    const downloadUrl = process.env.BASE_URL || 'http://localhost:5000';
    
    const message = `🌆 *DARSHANA TICKET CONFIRMED* 🏛️\n\n` +
      `🎫 ID: ${ticketData.bookingId}\n` +
      `🏯 ${ticketData.monument.name}\n` +
      `📅 ${ticketData.visitDate}\n` +
      `⏰ ${ticketData.timeSlot.startTime}-${ticketData.timeSlot.endTime}\n` +
      `💰 ₹${ticketData.totalAmount.toFixed(2)}\n\n` +
      `🔗 PDF ticket: ticket_${ticketData.bookingId}.pdf\n` +
      `🔗 Download: ${downloadUrl}/ticket-download/${ticketData.bookingId}\n\n` +
      `• Show this ticket at monument entry\n` +
      `• Carry valid photo ID proof\n` +
      `• Arrive 15 minutes before your time slot\n` +
      `• Ticket valid only for mentioned date & time\n\n` +
      `🙏 Thank you for choosing Darshana!`;
      
    return message;
  }

  /**
   * Generate QR code data
   * @param {Object} ticketData - Ticket information
   * @returns {string} - QR code data string
   */
  generateQRCodeData(ticketData) {
    const qrData = {
      bookingId: ticketData.bookingId,
      monument: ticketData.monument.name,
      visitDate: ticketData.visitDate,
      timeSlot: `${ticketData.timeSlot.startTime}-${ticketData.timeSlot.endTime}`,
      visitors: ticketData.visitors.length,
      amount: ticketData.totalAmount,
      status: ticketData.status
    }
    
    return `DARSHANA-TICKET:${JSON.stringify(qrData)}`
  }

  /**
   * Send WhatsApp message using selected provider
   * @param {string} phoneNumber - Recipient phone number
   * @param {Object} ticketData - Ticket information
   * @returns {Promise<Object>} - Result of sending message
   */
  async sendTicketMessage(phoneNumber, ticketData) {
    try {
      const formattedNumber = this.formatPhoneNumber(phoneNumber)
      const message = this.generateTicketMessage(ticketData)

      logger.info(`📱 Sending WhatsApp ticket via ${this.provider} to: +${formattedNumber}`)

      switch (this.provider) {
        case 'twilio':
          return await this.sendViaTwilio(formattedNumber, message)
        case 'business_api':
          return await this.sendViaBusinessAPI(formattedNumber, message)
        case 'ultramsg':
          return await this.sendViaUltraMsg(formattedNumber, message)
        case 'third_party':
          return await this.sendViaThirdParty(formattedNumber, message)
        default:
          return await this.sendViaDemo(formattedNumber, message, ticketData)
      }

    } catch (error) {
      logger.error('❌ Failed to send WhatsApp ticket:', error)
      return {
        success: false,
        error: error.message,
        message: 'Failed to send ticket via WhatsApp'
      }
    }
  }

  /**
   * Send via Twilio WhatsApp API
   */
  async sendViaTwilio(phoneNumber, message) {
    try {
      const response = await axios.post(
        `https://api.twilio.com/2010-04-01/Accounts/${this.twilioAccountSid}/Messages.json`,
        new URLSearchParams({
          From: this.twilioWhatsAppNumber,
          To: `whatsapp:+${phoneNumber}`,
          Body: message
        }),
        {
          auth: {
            username: this.twilioAccountSid,
            password: this.twilioAuthToken
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      )

      logger.info(`✅ Twilio WhatsApp message sent successfully to +${phoneNumber}`)
      return {
        success: true,
        messageId: response.data.sid,
        recipientNumber: phoneNumber,
        sentAt: new Date().toISOString(),
        status: 'sent',
        provider: 'twilio',
        message: 'Ticket sent successfully via Twilio WhatsApp API'
      }

    } catch (error) {
      logger.error('❌ Twilio WhatsApp API error:', error.response?.data || error.message)
      throw new Error(`Twilio API error: ${error.response?.data?.message || error.message}`)
    }
  }

  /**
   * Send via WhatsApp Business API (Official)
   */
  async sendViaBusinessAPI(phoneNumber, message) {
    try {
      const response = await axios.post(
        `${this.whatsappBusinessApiUrl}/${this.whatsappBusinessPhoneId}/messages`,
        {
          messaging_product: 'whatsapp',
          to: phoneNumber,
          type: 'text',
          text: {
            body: message
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.whatsappBusinessToken}`,
            'Content-Type': 'application/json'
          }
        }
      )

      logger.info(`✅ WhatsApp Business API message sent successfully to +${phoneNumber}`)
      return {
        success: true,
        messageId: response.data.messages[0].id,
        recipientNumber: phoneNumber,
        sentAt: new Date().toISOString(),
        status: 'sent',
        provider: 'business_api',
        message: 'Ticket sent successfully via WhatsApp Business API'
      }

    } catch (error) {
      logger.error('❌ WhatsApp Business API error:', error.response?.data || error.message)
      throw new Error(`Business API error: ${error.response?.data?.error?.message || error.message}`)
    }
  }

  /**
   * Send via UltraMsg WhatsApp API
   */
  async sendViaUltraMsg(phoneNumber, message) {
    try {
      // UltraMsg expects form data
      const formData = new URLSearchParams()
      formData.append('token', this.ultraMsgToken)
      formData.append('to', phoneNumber)
      formData.append('body', message)

      const response = await axios.post(
        `${this.ultraMsgApiUrl}/messages/chat`,
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      )

      if (response.data.sent) {
        logger.info(`✅ UltraMsg WhatsApp message sent successfully to +${phoneNumber}`)
        return {
          success: true,
          messageId: response.data.id || `ultramsg_${Date.now()}`,
          recipientNumber: phoneNumber,
          sentAt: new Date().toISOString(),
          status: 'sent',
          provider: 'ultramsg',
          message: 'Ticket sent successfully via UltraMsg WhatsApp API'
        }
      } else {
        throw new Error(response.data.error || 'Failed to send message via UltraMsg')
      }

    } catch (error) {
      logger.error('❌ UltraMsg WhatsApp API error:', error.response?.data || error.message)
      throw new Error(`UltraMsg API error: ${error.response?.data?.error || error.message}`)
    }
  }
  async sendViaThirdParty(phoneNumber, message) {
    try {
      const response = await axios.post(
        `${this.thirdPartyApiUrl}/sendMessage`,
        {
          phone: phoneNumber,
          body: message
        },
        {
          headers: {
            'Authorization': `Bearer ${this.thirdPartyApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      )

      logger.info(`✅ Third-party WhatsApp API message sent successfully to +${phoneNumber}`)
      return {
        success: true,
        messageId: response.data.id || `msg_${Date.now()}`,
        recipientNumber: phoneNumber,
        sentAt: new Date().toISOString(),
        status: 'sent',
        provider: 'third_party',
        message: 'Ticket sent successfully via third-party WhatsApp API'
      }

    } catch (error) {
      logger.error('❌ Third-party WhatsApp API error:', error.response?.data || error.message)
      throw new Error(`Third-party API error: ${error.response?.data?.message || error.message}`)
    }
  }

  /**
   * Demo mode - simulates sending (for testing)
   * @param {string} phoneNumber - Recipient phone number
   * @param {string} message - Message content
   * @param {Object} ticketData - Ticket information
   * @param {string} imagePath - Path to the image file (optional)
   * @returns {Promise<Object>} - Result of sending message
   */
  async sendViaDemo(phoneNumber, message, ticketData, imagePath = null) {
    logger.info(`📱 DEMO MODE: Simulating WhatsApp message to +${phoneNumber}`)
    logger.info(`📋 Message content: ${message.substring(0, 100)}...`)
    
    if (imagePath) {
      logger.info(`🖼️ Image attached: ${imagePath}`)
    }

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    return {
      success: true,
      messageId: `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      recipientNumber: phoneNumber,
      sentAt: new Date().toISOString(),
      status: 'sent',
      provider: 'demo',
      message: imagePath ? 'Ticket screenshot sent successfully (DEMO MODE)' : 'Ticket sent successfully (DEMO MODE)',
      note: 'This is a demo - no actual WhatsApp message was sent'
    }
  }

  /**
   * Send WhatsApp message with screenshot using selected provider
   * @param {string} phoneNumber - Recipient phone number
   * @param {string} imageData - Base64 encoded image data
   * @param {Object} ticketData - Ticket information
   * @returns {Promise<Object>} - Result of sending message
   */
  async sendScreenshotMessage(phoneNumber, imageData, ticketData) {
    try {
      const formattedNumber = this.formatPhoneNumber(phoneNumber)
      
      logger.info(`📱 Sending WhatsApp ticket screenshot via ${this.provider} to: +${formattedNumber}`)

      // Save image data to a temporary file
      const tempDir = path.join(process.cwd(), 'temp')
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true })
      }
      
      // Generate unique filename
      const filename = `ticket_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.png`
      const filepath = path.join(tempDir, filename)
      
      // Convert base64 to binary and save
      const base64Data = imageData.replace(/^data:image\/png;base64,/, "")
      fs.writeFileSync(filepath, base64Data, 'base64')
      
      logger.info(`💾 Screenshot saved to: ${filepath}`)

      // Send message based on provider
      switch (this.provider) {
        case 'twilio':
          return await this.sendScreenshotViaTwilio(formattedNumber, filepath, ticketData)
        case 'business_api':
          return await this.sendScreenshotViaBusinessAPI(formattedNumber, filepath, ticketData)
        case 'ultramsg':
          return await this.sendScreenshotViaUltraMsg(formattedNumber, filepath, ticketData)
        case 'third_party':
          return await this.sendScreenshotViaThirdParty(formattedNumber, filepath, ticketData)
        default:
          // For demo mode, we'll send the screenshot with caption
          const message = this.generateScreenshotCaption(ticketData)
          return await this.sendViaDemo(formattedNumber, message, ticketData, filepath)
      }

    } catch (error) {
      logger.error('❌ Failed to send WhatsApp ticket screenshot:', error)
      return {
        success: false,
        error: error.message,
        message: 'Failed to send ticket screenshot via WhatsApp'
      }
    }
  }

  /**
   * Send screenshot via Twilio WhatsApp API
   */
  async sendScreenshotViaTwilio(phoneNumber, imagePath, ticketData) {
    try {
      // Generate caption for the screenshot
      const captionMessage = this.generateScreenshotCaption(ticketData)
      
      // Send the image with caption
      const formData = new FormData()
      formData.append('From', this.twilioWhatsAppNumber)
      formData.append('To', `whatsapp:+${phoneNumber}`)
      formData.append('MediaUrl', `http://localhost:5000/temp/${path.basename(imagePath)}`)
      formData.append('Body', captionMessage) // Add caption to the image

      await axios.post(
        `https://api.twilio.com/2010-04-01/Accounts/${this.twilioAccountSid}/Messages.json`,
        formData,
        {
          auth: {
            username: this.twilioAccountSid,
            password: this.twilioAuthToken
          },
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      // Clean up temporary file
      try {
        fs.unlinkSync(imagePath)
      } catch (cleanupError) {
        logger.warn('⚠️ Failed to clean up temporary screenshot file:', cleanupError)
      }

      logger.info(`✅ Twilio WhatsApp screenshot message sent successfully to +${phoneNumber}`)
      return {
        success: true,
        messageId: `twilio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        recipientNumber: phoneNumber,
        sentAt: new Date().toISOString(),
        status: 'sent',
        provider: 'twilio',
        message: 'Ticket screenshot sent successfully via Twilio WhatsApp API'
      }

    } catch (error) {
      logger.error('❌ Twilio WhatsApp API error:', error.response?.data || error.message)
      throw new Error(`Twilio API error: ${error.response?.data?.message || error.message}`)
    }
  }

  /**
   * Send screenshot via WhatsApp Business API (Official)
   */
  async sendScreenshotViaBusinessAPI(phoneNumber, imagePath, ticketData) {
    try {
      // Generate caption for the screenshot
      const captionMessage = this.generateScreenshotCaption(ticketData)
      
      // Send the image with caption
      await axios.post(
        `${this.whatsappBusinessApiUrl}/${this.whatsappBusinessPhoneId}/messages`,
        {
          messaging_product: 'whatsapp',
          to: phoneNumber,
          type: 'image',
          image: {
            link: `http://localhost:5000/temp/${path.basename(imagePath)}`,
            caption: captionMessage // Add caption to the image
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.whatsappBusinessToken}`,
            'Content-Type': 'application/json'
          }
        }
      )

      // Clean up temporary file
      try {
        fs.unlinkSync(imagePath)
      } catch (cleanupError) {
        logger.warn('⚠️ Failed to clean up temporary screenshot file:', cleanupError)
      }

      logger.info(`✅ WhatsApp Business API screenshot message sent successfully to +${phoneNumber}`)
      return {
        success: true,
        messageId: `business_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        recipientNumber: phoneNumber,
        sentAt: new Date().toISOString(),
        status: 'sent',
        provider: 'business_api',
        message: 'Ticket screenshot sent successfully via WhatsApp Business API'
      }

    } catch (error) {
      logger.error('❌ WhatsApp Business API error:', error.response?.data || error.message)
      throw new Error(`Business API error: ${error.response?.data?.error?.message || error.message}`)
    }
  }

  /**
   * Send screenshot via UltraMsg WhatsApp API
   */
  async sendScreenshotViaUltraMsg(phoneNumber, imagePath, ticketData) {
    try {
      // Generate caption for the screenshot
      const captionMessage = this.generateScreenshotCaption(ticketData)
      
      // Send the image with caption
      const imageFormData = new URLSearchParams()
      imageFormData.append('token', this.ultraMsgToken)
      imageFormData.append('to', phoneNumber)
      imageFormData.append('image', `http://localhost:5000/temp/${path.basename(imagePath)}`)
      imageFormData.append('caption', captionMessage) // Add caption to the image

      await axios.post(
        `${this.ultraMsgApiUrl}/messages/image`,
        imageFormData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      )

      // Clean up temporary file
      try {
        fs.unlinkSync(imagePath)
      } catch (cleanupError) {
        logger.warn('⚠️ Failed to clean up temporary screenshot file:', cleanupError)
      }

      logger.info(`✅ UltraMsg WhatsApp screenshot message sent successfully to +${phoneNumber}`)
      return {
        success: true,
        messageId: `ultramsg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        recipientNumber: phoneNumber,
        sentAt: new Date().toISOString(),
        status: 'sent',
        provider: 'ultramsg',
        message: 'Ticket screenshot sent successfully via UltraMsg WhatsApp API'
      }

    } catch (error) {
      logger.error('❌ UltraMsg WhatsApp API error:', error.response?.data || error.message)
      throw new Error(`UltraMsg API error: ${error.response?.data?.error || error.message}`)
    }
  }

  /**
   * Send screenshot via third-party WhatsApp API
   */
  async sendScreenshotViaThirdParty(phoneNumber, imagePath, ticketData) {
    try {
      // Generate caption for the screenshot
      const captionMessage = this.generateScreenshotCaption(ticketData)
      
      // Send the image with caption
      await axios.post(
        `${this.thirdPartyApiUrl}/sendImage`,
        {
          phone: phoneNumber,
          image: `http://localhost:5000/temp/${path.basename(imagePath)}`,
          caption: captionMessage // Add caption to the image
        },
        {
          headers: {
            'Authorization': `Bearer ${this.thirdPartyApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      )

      // Clean up temporary file
      try {
        fs.unlinkSync(imagePath)
      } catch (cleanupError) {
        logger.warn('⚠️ Failed to clean up temporary screenshot file:', cleanupError)
      }

      logger.info(`✅ Third-party WhatsApp API screenshot message sent successfully to +${phoneNumber}`)
      return {
        success: true,
        messageId: `thirdparty_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        recipientNumber: phoneNumber,
        sentAt: new Date().toISOString(),
        status: 'sent',
        provider: 'third_party',
        message: 'Ticket screenshot sent successfully via third-party WhatsApp API'
      }

    } catch (error) {
      logger.error('❌ Third-party WhatsApp API error:', error.response?.data || error.message)
      throw new Error(`Third-party API error: ${error.response?.data?.message || error.message}`)
    }
  }

  /**
   * Get current provider configuration
   */
  getProviderInfo() {
    return {
      provider: this.provider,
      isConfigured: this.isProviderConfigured(),
      availableProviders: ['twilio', 'business_api', 'ultramsg', 'third_party', 'demo']
    }
  }

  /**
   * Check if current provider is properly configured
   */
  isProviderConfigured() {
    switch (this.provider) {
      case 'twilio':
        return !!(this.twilioAccountSid && this.twilioAuthToken && 
                 this.twilioAccountSid !== 'your_twilio_account_sid')
      case 'business_api':
        return !!(this.whatsappBusinessToken && this.whatsappBusinessPhoneId &&
                 this.whatsappBusinessToken !== 'your_business_api_token')
      case 'ultramsg':
        return !!(this.ultraMsgInstanceId && this.ultraMsgToken &&
                 this.ultraMsgInstanceId !== 'your_instance_id' &&
                 this.ultraMsgToken !== 'your_token')
      case 'third_party':
        return !!(this.thirdPartyApiUrl && this.thirdPartyApiKey &&
                 this.thirdPartyApiKey !== 'your_api_key')
      case 'demo':
        return true
      default:
        return false
    }
  }

  /**
   * Set provider (for testing or dynamic switching)
   */
  setProvider(provider) {
    if (['twilio', 'business_api', 'ultramsg', 'third_party', 'demo'].includes(provider)) {
      this.provider = provider
      logger.info(`🔄 WhatsApp provider changed to: ${provider}`)
    } else {
      throw new Error(`Invalid provider: ${provider}`)
    }
  }

  /**
   * Validate phone number format
   * @param {string} phoneNumber - Phone number to validate
   * @returns {boolean} - True if valid
   */
  validatePhoneNumber(phoneNumber) {
    const cleanNumber = phoneNumber.replace(/[^0-9]/g, '')
    // Check if it's a valid phone number (10-15 digits)
    return cleanNumber.length >= 10 && cleanNumber.length <= 15
  }
}

module.exports = new WhatsAppService()