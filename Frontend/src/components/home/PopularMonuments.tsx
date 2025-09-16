'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { MapPin, Star, Clock, Users, Camera, Ticket } from 'lucide-react'

const PopularMonuments = () => {
  const monuments = [
    {
      id: '1',
      name: 'Taj Mahal',
      location: 'Agra, Uttar Pradesh',
      rating: 4.8,
      reviews: 15420,
      visitTime: '2-3 hours',
      image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500',
      description: 'Symbol of eternal love and architectural marvel',
      stories: 23,
      arExperiences: 5,
      treasureHunts: 3,
      ticketPrice: '₹50'
    },
    {
      id: '2',
      name: 'Red Fort',
      location: 'Delhi',
      rating: 4.6,
      reviews: 8930,
      visitTime: '3-4 hours',
      image: 'https://imgcld.yatra.com/ytimages/image/upload/v1461929855/Delhi-Red_Fort1.jpg',
      description: 'Mughal architecture and seat of power',
      stories: 18,
      arExperiences: 4,
      treasureHunts: 2,
      ticketPrice: '₹35'
    },
    {
      id: '3',
      name: 'Hampi',
      location: 'Karnataka',
      rating: 4.7,
      reviews: 5670,
      visitTime: 'Full day',
      image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=500',
      description: 'Ancient Vijayanagara Empire ruins',
      stories: 31,
      arExperiences: 8,
      treasureHunts: 5,
      ticketPrice: '₹40'
    },
    {
      id: '4',
      name: 'Ajanta Caves',
      location: 'Maharashtra',
      rating: 4.9,
      reviews: 3450,
      visitTime: '4-5 hours',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500',
      description: 'Ancient Buddhist rock-cut caves',
      stories: 15,
      arExperiences: 6,
      treasureHunts: 2,
      ticketPrice: '₹30'
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-4">
            <MapPin className="text-primary-600 mr-2" size={24} />
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
              Popular Destinations
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
            Must-Visit
            <span className="text-gradient"> Monuments</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore the most beloved cultural heritage sites with immersive storytelling experiences
          </p>
        </motion.div>

        {/* Monuments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {monuments.map((monument, index) => (
            <motion.div
              key={monument.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <div className="card overflow-hidden hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2 p-0">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={monument.image}
                    alt={monument.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {/* Rating Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center space-x-1 px-2 py-1 bg-white/90 rounded-full">
                      <Star className="text-yellow-500 fill-current" size={14} />
                      <span className="text-xs font-semibold text-gray-900">{monument.rating}</span>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="absolute bottom-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                      <Camera size={16} className="text-gray-700" />
                    </button>
                    <button className="p-2 bg-primary-600 rounded-full hover:bg-primary-700 transition-colors">
                      <Ticket size={16} className="text-white" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
                      {monument.name}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <MapPin size={14} className="mr-1" />
                      {monument.location}
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                    {monument.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 py-3 border-t border-gray-100">
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary-600">{monument.stories}</div>
                      <div className="text-xs text-gray-500">Stories</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-secondary-600">{monument.arExperiences}</div>
                      <div className="text-xs text-gray-500">AR/VR</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-accent-600">{monument.treasureHunts}</div>
                      <div className="text-xs text-gray-500">Hunts</div>
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                    <div className="flex items-center space-x-1">
                      <Users size={12} />
                      <span>{monument.reviews.toLocaleString()} reviews</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock size={12} />
                      <span>{monument.visitTime}</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm text-gray-600">Starting from</span>
                    <span className="text-lg font-bold text-primary-600">{monument.ticketPrice}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/monuments" className="btn-primary hover:shadow-lg transition-all duration-300">
            Explore All Monuments
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default PopularMonuments