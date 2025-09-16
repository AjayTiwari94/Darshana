'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Clock, User, TrendingUp } from 'lucide-react'

const TrendingStories = () => {
  const stories = [
    {
      id: '1',
      title: 'The Curse of Bhangarh Fort',
      type: 'Horror',
      monument: 'Bhangarh Fort',
      duration: '8 min read',
      author: 'Narad AI',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
      description: 'Discover the haunting legends that make Bhangarh one of India\'s most mysterious places.',
      trending: true
    },
    {
      id: '2',
      title: 'The Love Story Behind Taj Mahal',
      type: 'Mythology',
      monument: 'Taj Mahal',
      duration: '12 min read',
      author: 'Cultural Expert',
      image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400',
      description: 'The romantic tale of Shah Jahan and Mumtaz that inspired the world\'s most beautiful monument.',
      trending: false
    },
    {
      id: '3',
      title: 'The Monkey Army of Hampi',
      type: 'Legend',
      monument: 'Hampi',
      duration: '6 min read',
      author: 'Folklore Researcher',
      image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400',
      description: 'How Hanuman\'s army helped build the bridge to Lanka in this ancient Ramayana site.',
      trending: true
    }
  ]

  return (
    <section className="py-20 bg-white">
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
            <TrendingUp className="text-primary-600 mr-2" size={24} />
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
              Trending Now
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
            Stories That
            <span className="text-gradient"> Captivate</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Dive into the most popular cultural narratives that bring India's heritage to life
          </p>
        </motion.div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <motion.article
              key={story.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <div className="card overflow-hidden hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
                {/* Image */}
                <div className="relative h-48 overflow-hidden mb-6">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  
                  {/* Type Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-primary-600 text-white text-xs font-semibold rounded-full">
                      {story.type}
                    </span>
                  </div>
                  
                  {/* Trending Badge */}
                  {story.trending && (
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center space-x-1 px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                        <TrendingUp size={12} />
                        <span>Trending</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300 line-clamp-2">
                    {story.title}
                  </h3>
                  
                  <p className="text-gray-600 line-clamp-3 leading-relaxed">
                    {story.description}
                  </p>

                  {/* Meta Information */}
                  <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <User size={14} />
                        <span>{story.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock size={14} />
                        <span>{story.duration}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BookOpen size={14} />
                      <span className="text-primary-600 font-medium">{story.monument}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
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
          <button className="btn-outline hover:shadow-lg transition-all duration-300">
            Explore All Stories
          </button>
        </motion.div>
      </div>
    </section>
  )
}

export default TrendingStories