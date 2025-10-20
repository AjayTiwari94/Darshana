'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Mail, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  MessageCircle,
  Download,
  Heart
} from 'lucide-react'

const Footer = () => {
  const footerSections = [
    {
      title: 'Explore',
      links: [
        { name: 'Monuments', href: '/monuments' },
        { name: 'Stories', href: '/stories' },
        { name: 'Virtual Visit', href: '/virtual-visits' },
        { name: 'Treasure Hunt', href: '/treasure-hunt' },
        { name: 'AR/VR Experiences', href: '/ar-vr' }
      ]
    },
    {
      title: 'Services',
      links: [
        { name: 'Narad AI Guide', href: '/ai-test' },
        { name: 'Book Tickets', href: '/tickets' },
        { name: 'Travel Planning', href: '/travel' },
        { name: 'Group Tours', href: '/group-tours' },
        { name: 'Educational Programs', href: '/education' }
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '/help' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'FAQ', href: '/faq' },
        { name: 'Accessibility', href: '/accessibility' },
        { name: 'Feedback', href: '/feedback' }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Our Team', href: '/team' },
        { name: 'Careers', href: '/careers' },
        { name: 'Press', href: '/press' },
        { name: 'Blog', href: '/blog' }
      ]
    }
  ]

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'YouTube' }
  ]

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">D</span>
              </div>
              <span className="font-sans font-bold text-2xl">Darshana</span>
            </Link>
            
            <p className="text-gray-300 leading-relaxed max-w-md">
              Reimagining cultural heritage through AI-powered storytelling, immersive experiences, 
              and interactive exploration of India's rich cultural legacy.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <Mail size={16} className="text-primary-400" />
                <span>tiwari.ajay936@outlook.com</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <IconComponent size={18} />
                  </motion.a>
                )
              })}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index} className="space-y-4">
              <h3 className="font-semibold text-lg text-white">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      href={link.href}
                      className="text-gray-300 hover:text-primary-400 transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* App Download Section */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold mb-2">Get the Darshana App</h3>
              <p className="text-gray-300 text-sm">Experience heritage on the go with our mobile app</p>
            </div>
            <div className="flex space-x-4">
              <button className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors duration-300">
                <Download size={20} />
                <span className="text-sm">Coming Soon</span>
              </button>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-gray-800 rounded-2xl p-8 mb-8">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold">Stay Connected</h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Subscribe to our newsletter for the latest cultural stories, new experiences, and exclusive offers.
            </p>
            <div className="flex flex-col sm:flex-row max-w-md mx-auto space-y-2 sm:space-y-0 sm:space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-700 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button className="btn-primary">Subscribe</button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex flex-wrap items-center space-x-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-primary-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-primary-400 transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="hover:text-primary-400 transition-colors">
                Cookie Policy
              </Link>
              <Link href="/security" className="hover:text-primary-400 transition-colors">
                Security
              </Link>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>© 2025 Darshana. Made with</span>
              <Heart size={16} className="text-red-500 fill-current" />
              <span>in India</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer