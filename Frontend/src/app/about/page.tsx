'use client'

import React from 'react'
import { Users, Target, Eye, Heart, Globe, Award } from 'lucide-react'

const AboutPage = () => {
  const values = [
    {
      icon: Heart,
      title: 'Passion for Heritage',
      description: 'We are deeply passionate about preserving and sharing India\'s rich cultural heritage with the world.'
    },
    {
      icon: Eye,
      title: 'Innovation',
      description: 'We leverage cutting-edge technology to create immersive and engaging cultural experiences.'
    },
    {
      icon: Globe,
      title: 'Accessibility',
      description: 'We believe everyone should have access to learn about and experience cultural heritage.'
    },
    {
      icon: Target,
      title: 'Excellence',
      description: 'We strive for excellence in everything we do, from content creation to user experience.'
    }
  ]

  const team = [
    {
      name: 'Ajay Tiwari',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    {
      name: 'Narad AI',
      role: 'Cultural Guide',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">About Darshana</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Reimagining cultural heritage through technology, storytelling, and immersive experiences
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-gray-700 mb-6">
                At Darshana, we believe that India's cultural heritage is a treasure that belongs to all of humanity. 
                Our mission is to make this heritage accessible, engaging, and meaningful to people around the world 
                through innovative technology and storytelling.
              </p>
              <p className="text-gray-700 mb-6">
                We're building a platform that transforms the way people experience cultural heritage, 
                moving beyond static museums and guidebooks to create immersive, interactive journeys 
                that bring history, mythology, and tradition to life.
              </p>
              <div className="flex items-center text-primary-600">
                <Users className="h-6 w-6 mr-2" />
                <span className="font-medium">Founded in 2024</span>
              </div>
            </div>
            <div className="bg-gray-200 rounded-lg h-80 flex items-center justify-center">
              <Globe className="h-16 w-16 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon
              return (
                <div key={index} className="bg-white rounded-lg shadow-sm p-6 text-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="bg-gray-200 rounded-lg h-80 flex items-center justify-center order-2 lg:order-1">
              <Award className="h-16 w-16 text-gray-400" />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-gray-700 mb-6">
                Darshana was born from a simple idea: What if we could make India's cultural heritage 
                come alive for people around the world? Our founder, Ajay Tiwari, was inspired by his 
                own journey of discovering the rich stories behind India's monuments and realized that 
                many people never get to experience this depth of cultural knowledge.
              </p>
              <p className="text-gray-700 mb-6">
                Combining his passion for technology and cultural preservation, he set out to create 
                a platform that would bridge the gap between ancient wisdom and modern innovation. 
                Today, Darshana is proud to be at the forefront of cultural heritage technology, 
                with users from around the world exploring India's rich traditions through our platform.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 text-center">
                <div className="mx-auto h-24 w-24 rounded-full overflow-hidden mb-4">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-primary-600 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Join Our Journey</h2>
          <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
            Be part of our mission to preserve and share India's cultural heritage with the world. 
            Whether you're a cultural enthusiast, educator, or technology innovator, there's a place for you at Darshana.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <a 
              href="/careers" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-primary-600 bg-white hover:bg-gray-50"
            >
              View Careers
            </a>
            <a 
              href="/contact" 
              className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md shadow-sm text-white bg-transparent hover:bg-white hover:text-primary-600"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage