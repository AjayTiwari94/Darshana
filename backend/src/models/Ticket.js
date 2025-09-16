const mongoose = require('mongoose')

const TicketSchema = new mongoose.Schema({
  ticketNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  type: {
    type: String,
    enum: ['individual', 'group', 'family', 'student', 'senior', 'foreign', 'vip'],
    required: true
  },
  category: {
    type: String,
    enum: ['entry', 'guided_tour', 'audio_guide', 'vr_experience', 'photography', 'combo'],
    required: true
  },
  monument: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Monument',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  visitors: [{
    name: {
      type: String,
      required: true
    },
    age: Number,
    idType: {
      type: String,
      enum: ['aadhar', 'passport', 'driving_license', 'student_id']
    },
    idNumber: String,
    nationality: {
      type: String,
      default: 'Indian'
    }
  }],
  visitDate: {
    type: Date,
    required: true
  },
  timeSlot: {
    startTime: {
      type: String,
      required: true // Format: "09:00"
    },
    endTime: {
      type: String,
      required: true // Format: "11:00"
    }
  },
  pricing: {
    basePrice: {
      type: Number,
      required: true
    },
    discounts: [{
      type: {
        type: String,
        enum: ['student', 'senior', 'group', 'early_bird', 'promotional']
      },
      amount: Number,
      percentage: Number,
      description: String
    }],
    taxes: [{
      name: String,
      rate: Number,
      amount: Number
    }],
    totalAmount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },
  payment: {
    paymentId: String,
    method: {
      type: String,
      enum: ['razorpay', 'stripe', 'upi', 'card', 'netbanking', 'wallet']
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded', 'cancelled'],
      default: 'pending'
    },
    transactionId: String,
    paidAt: Date,
    refundId: String,
    refundAmount: Number,
    refundedAt: Date
  },
  status: {
    type: String,
    enum: ['booked', 'confirmed', 'checked_in', 'completed', 'cancelled', 'expired'],
    default: 'booked'
  },
  qrCode: {
    type: String,
    unique: true,
    sparse: true
  },
  specialRequests: {
    wheelchairAccess: {
      type: Boolean,
      default: false
    },
    guideDogAccess: {
      type: Boolean,
      default: false
    },
    languagePreference: String,
    dietaryRequirements: [String],
    otherRequests: String
  },
  addons: [{
    name: String,
    description: String,
    price: Number,
    quantity: {
      type: Number,
      default: 1
    }
  }],
  checkinDetails: {
    checkedInAt: Date,
    checkedInBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    actualVisitors: Number,
    notes: String
  },
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    review: String,
    submittedAt: Date,
    images: [String]
  },
  notifications: [{
    type: {
      type: String,
      enum: ['booking_confirmation', 'reminder', 'cancellation', 'refund', 'check_in']
    },
    message: String,
    sentAt: Date,
    channel: {
      type: String,
      enum: ['email', 'sms', 'push', 'whatsapp']
    }
  }],
  cancellation: {
    cancelledAt: Date,
    reason: String,
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    refundEligible: {
      type: Boolean,
      default: true
    },
    refundAmount: Number,
    cancellationFee: Number
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Indexes
TicketSchema.index({ monument: 1, visitDate: 1, status: 1 })
TicketSchema.index({ user: 1, status: 1 })
TicketSchema.index({ visitDate: 1, 'timeSlot.startTime': 1 })
TicketSchema.index({ 'payment.status': 1 })
TicketSchema.index({ ticketNumber: 1 }, { unique: true })

// Virtual for days until visit
TicketSchema.virtual('daysUntilVisit').get(function() {
  const now = new Date()
  const visitDate = new Date(this.visitDate)
  const diffTime = visitDate - now
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
})

// Virtual for total visitors
TicketSchema.virtual('totalVisitors').get(function() {
  return this.visitors.length
})

// Virtual for can cancel
TicketSchema.virtual('canCancel').get(function() {
  const now = new Date()
  const visitDate = new Date(this.visitDate)
  const hoursDiff = (visitDate - now) / (1000 * 60 * 60)
  
  // Can cancel if visit is more than 24 hours away and status allows cancellation
  return hoursDiff > 24 && ['booked', 'confirmed'].includes(this.status)
})

// Virtual for can check in
TicketSchema.virtual('canCheckIn').get(function() {
  const now = new Date()
  const visitDate = new Date(this.visitDate)
  const isToday = visitDate.toDateString() === now.toDateString()
  
  return isToday && this.status === 'confirmed' && this.payment.status === 'completed'
})

// Pre-save middleware to generate ticket number
TicketSchema.pre('save', async function(next) {
  if (this.isNew && !this.ticketNumber) {
    const monument = await mongoose.model('Monument').findById(this.monument)
    const dateStr = this.visitDate.toISOString().slice(0, 10).replace(/-/g, '')
    const random = Math.random().toString(36).substr(2, 6).toUpperCase()
    
    this.ticketNumber = `${monument.code || 'MON'}-${dateStr}-${random}`
  }
  next()
})

// Methods
TicketSchema.methods.generateQRCode = function() {
  const qrData = {
    ticketNumber: this.ticketNumber,
    monument: this.monument,
    visitDate: this.visitDate,
    visitors: this.totalVisitors,
    user: this.user
  }
  
  // In production, use a proper QR code library
  this.qrCode = Buffer.from(JSON.stringify(qrData)).toString('base64')
  return this.save()
}

TicketSchema.methods.checkIn = function(staffMember, actualVisitors, notes) {
  if (!this.canCheckIn) {
    throw new Error('Cannot check in this ticket')
  }
  
  this.status = 'checked_in'
  this.checkinDetails = {
    checkedInAt: new Date(),
    checkedInBy: staffMember,
    actualVisitors: actualVisitors || this.totalVisitors,
    notes: notes || ''
  }
  
  return this.save()
}

TicketSchema.methods.cancel = function(reason, cancelledBy) {
  if (!this.canCancel) {
    throw new Error('Cannot cancel this ticket')
  }
  
  const now = new Date()
  const visitDate = new Date(this.visitDate)
  const hoursDiff = (visitDate - now) / (1000 * 60 * 60)
  
  // Calculate cancellation fee based on timing
  let cancellationFee = 0
  let refundAmount = this.pricing.totalAmount
  
  if (hoursDiff < 48) {
    cancellationFee = this.pricing.totalAmount * 0.1 // 10% fee for cancellation within 48 hours
    refundAmount = this.pricing.totalAmount * 0.9
  }
  
  this.status = 'cancelled'
  this.cancellation = {
    cancelledAt: now,
    reason,
    cancelledBy,
    refundEligible: true,
    refundAmount,
    cancellationFee
  }
  
  return this.save()
}

TicketSchema.methods.addFeedback = function(rating, review, images = []) {
  if (this.status !== 'completed') {
    throw new Error('Can only add feedback for completed visits')
  }
  
  this.feedback = {
    rating,
    review,
    images,
    submittedAt: new Date()
  }
  
  return this.save()
}

TicketSchema.methods.sendNotification = function(type, message, channel = 'email') {
  this.notifications.push({
    type,
    message,
    sentAt: new Date(),
    channel
  })
  
  // In production, integrate with notification service
  console.log(`Notification sent: ${message} via ${channel}`)
  
  return this.save()
}

// Static methods
TicketSchema.statics.getAvailableSlots = async function(monumentId, date) {
  const monument = await mongoose.model('Monument').findById(monumentId)
  if (!monument) throw new Error('Monument not found')
  
  const dayOfWeek = new Date(date).getDay()
  const operatingHours = monument.operatingHours[dayOfWeek === 0 ? 'sunday' : 
                        dayOfWeek === 1 ? 'monday' :
                        dayOfWeek === 2 ? 'tuesday' :
                        dayOfWeek === 3 ? 'wednesday' :
                        dayOfWeek === 4 ? 'thursday' :
                        dayOfWeek === 5 ? 'friday' : 'saturday']
  
  if (!operatingHours.isOpen) {
    return []
  }
  
  // Get all booked tickets for the date
  const bookedTickets = await this.find({
    monument: monumentId,
    visitDate: {
      $gte: new Date(date),
      $lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000)
    },
    status: { $in: ['booked', 'confirmed', 'checked_in'] }
  })
  
  // Calculate available slots (simplified logic)
  const slots = []
  const startHour = parseInt(operatingHours.openTime.split(':')[0])
  const endHour = parseInt(operatingHours.closeTime.split(':')[0])
  
  for (let hour = startHour; hour < endHour; hour += 2) {
    const startTime = `${hour.toString().padStart(2, '0')}:00`
    const endTime = `${(hour + 2).toString().padStart(2, '0')}:00`
    
    const slotBookings = bookedTickets.filter(ticket => 
      ticket.timeSlot.startTime === startTime
    )
    
    const totalBooked = slotBookings.reduce((sum, ticket) => sum + ticket.totalVisitors, 0)
    const available = (monument.capacity || 100) - totalBooked
    
    if (available > 0) {
      slots.push({
        startTime,
        endTime,
        available,
        price: monument.ticketPricing?.base || 50
      })
    }
  }
  
  return slots
}

module.exports = mongoose.model('Ticket', TicketSchema)