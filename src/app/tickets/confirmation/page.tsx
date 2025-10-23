'use client'

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  CheckCircleIcon,
  TicketIcon,
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'

interface BookingData {
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

const BookingConfirmationPage: React.FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Safely parse visitors data
  const parseVisitors = (visitorsStr: string | null): Array<{name: string, age: number, nationality: string}> => {
    try {
      return visitorsStr ? JSON.parse(visitorsStr) : [];
    } catch (e) {
      console.error('Error parsing visitors data:', e);
      return [];
    }
  };
  
  // Get booking data from URL parameters
  const bookingData: BookingData = {
    bookingId: searchParams.get('bookingId') || '',
    monument: {
      _id: searchParams.get('monumentId') || '',
      name: searchParams.get('monumentName') || '',
      location: searchParams.get('location') || ''
    },
    visitDate: searchParams.get('visitDate') || '',
    timeSlot: {
      startTime: searchParams.get('startTime') || '',
      endTime: searchParams.get('endTime') || ''
    },
    visitors: parseVisitors(searchParams.get('visitors')),
    totalAmount: parseFloat(searchParams.get('totalAmount') || '0'),
    bookingDate: searchParams.get('bookingDate') || '',
    bookingTime: searchParams.get('bookingTime') || '',
    status: 'Confirmed',
    paymentMethod: 'Demo Payment',
    paymentId: searchParams.get('paymentId') || ''
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

  // Helper function to get monument description (same mapping as booking page)
  const getMonumentDescription = (monumentId: string): string => {
    const descriptionMap: { [key: string]: string } = {
      '1': 'The Taj Mahal, a UNESCO World Heritage Site, is an ivory-white marble mausoleum built by Mughal emperor Shah Jahan in memory of his beloved wife Mumtaz Mahal. This architectural masterpiece represents the finest example of Mughal architecture, combining elements from Islamic, Persian, Ottoman Turkish and Indian architectural styles.',
      '2': 'The Red Fort, known as Lal Qila, served as the main residence of the Mughal emperors for nearly 200 years. This historic fortified palace showcases the peak of Mughal creativity and is a symbol of India\'s rich heritage. The fort complex houses museums, gardens, and several impressive structures including the Diwan-i-Aam and Diwan-i-Khas.',
      '3': 'Hawa Mahal, also known as the "Palace of Winds," is a stunning example of Rajput architecture built in 1799 by Maharaja Sawai Pratap Singh. The five-story palace with its 953 small windows called jharokhas was designed to allow royal ladies to observe everyday life and festivals celebrated in the street below without being seen.',
      '4': 'Amer Fort, also known as Amber Fort, is a magnificent example of Rajput architecture located on a hilltop. Built by Raja Man Singh I in 1592, this majestic fort-palace complex is known for its artistic Hindu style elements, cobbled paths, series of gates and paved paths. The fort overlooks Maota Lake and offers breathtaking views of the surrounding landscape.'
    }
    return descriptionMap[monumentId] || 'Discover the rich history and cultural significance of this magnificent monument through our immersive experience.'
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.push('/tickets')}
            className="flex items-center text-orange-600 hover:text-orange-800 font-medium"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Tickets
          </button>
          <div></div> {/* Spacer for alignment */}
        </div>

        {/* Split-screen content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Left: Monument details */}
          <div className="space-y-6 h-full flex flex-col">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-transform duration-200 hover:scale-[1.01] hover:shadow-xl h-full flex flex-col">
              <div className="relative h-72">
                <img
                  src={getMonumentImage(bookingData.monument._id)}
                  alt={bookingData.monument.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/heritage-background.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h2 className="text-2xl font-bold">{bookingData.monument.name}</h2>
                  <p className="flex items-center mt-1">
                    <MapPinIcon className="h-5 w-5 mr-2" />
                    {bookingData.monument.location}
                  </p>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">About this Monument</h3>
                <p className="text-gray-700 leading-relaxed">
                  {getMonumentDescription(bookingData.monument._id)}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Confirmation summary */}
          <div className="h-full flex flex-col">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden p-8 text-center transform transition-transform duration-200 hover:scale-[1.01] hover:shadow-xl h-full flex flex-col">
              <CheckCircleIcon className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
              <p className="text-gray-600 mb-6">
                Your ticket has been booked successfully. Booking ID: <strong>{bookingData.bookingId}</strong>
              </p>
              
              {/* Booking Summary */}
              <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
                <h3 className="font-semibold text-gray-900 mb-4">Booking Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monument:</span>
                    <span className="font-medium">{bookingData.monument.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Visit Date:</span>
                    <span className="font-medium">{bookingData.visitDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time Slot:</span>
                    <span className="font-medium">{bookingData.timeSlot.startTime} - {bookingData.timeSlot.endTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Visitors:</span>
                    <span className="font-medium">{bookingData.visitors.length} person(s)</span>
                  </div>
                  <div className="flex justify-between border-t pt-3">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-bold text-lg">₹{bookingData.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-auto flex flex-col sm:flex-row justify-center gap-4">
                <button 
                  onClick={() => {
                    const params = new URLSearchParams({
                      bookingId: bookingData.bookingId,
                      monumentId: bookingData.monument._id,
                      monumentName: bookingData.monument.name,
                      location: bookingData.monument.location,
                      visitDate: bookingData.visitDate,
                      startTime: bookingData.timeSlot.startTime,
                      endTime: bookingData.timeSlot.endTime,
                      visitors: JSON.stringify(bookingData.visitors),
                      totalAmount: bookingData.totalAmount.toString(),
                      bookingDate: bookingData.bookingDate,
                      bookingTime: bookingData.bookingTime,
                      paymentId: bookingData.paymentId
                    });
                    const url = `/tickets/${bookingData.bookingId}?${params.toString()}`;
                    if (typeof window !== 'undefined') {
                      window.open(url, '_blank', 'noopener,noreferrer');
                    } else {
                      router.push(url);
                    }
                  }}
                  className="px-6 py-3 bg-orange-600 text-white rounded-lg transform transition-transform duration-200 hover:scale-105 active:scale-100"
                >
                  View My Ticket
                </button>
                <button 
                  onClick={() => {
                    router.push('/tickets');
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg transform transition-transform duration-200 hover:scale-105 active:scale-100"
                >
                  Book Another Ticket
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingConfirmationPage