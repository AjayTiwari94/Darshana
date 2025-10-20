'use client'

import React from 'react'
import Link from 'next/link'
import { 
  MessageCircle, 
  Eye, 
  Trophy, 
  BookOpen, 
  Ticket, 
  Car,
  Sparkles,
  HeadphonesIcon,
  CheckCircle,
  Clock,
  Wrench,
  ExternalLink
} from 'lucide-react'

const GuidePage = () => {
  const features = [
    {
      id: 'narad-ai',
      icon: MessageCircle,
      title: 'Narad AI Guide',
      description: 'Interactive cultural companion providing historical facts, myths, folklore, and personalized storytelling experiences.',
      status: 'available',
      statusText: 'Available Now',
      statusIcon: CheckCircle,
      content: [
        {
          heading: 'What is Narad AI?',
          text: 'Narad AI is your intelligent cultural companion that brings India\'s rich heritage to life through interactive conversations. Named after the legendary storyteller from Hindu mythology, this AI guide provides personalized narratives based on your interests and location.'
        },
        {
          heading: 'How to Use Narad AI',
          text: 'Simply click on the Narad AI button (usually found in the header or on specific monument pages) to activate the guide. You can ask questions about any cultural site, historical event, or mythological story. The AI understands multiple languages and can provide information in English, Hindi, Tamil, Telugu, and other regional languages.'
        },
        {
          heading: 'Key Features',
          features: [
            'Voice & Chat Interface - Communicate through text or voice commands',
            'Multilingual Support - Get information in your preferred language',
            'Contextual Stories - Receive relevant tales based on your location',
            'Audio Narration - Listen to stories instead of reading them',
            'Personalized Recommendations - Get suggestions based on your interests'
          ]
        },
        {
          heading: 'Example Questions',
          examples: [
            '"Tell me about the history of Qutub Minar"',
            '"What are the legends associated with Hampi?"',
            '"Can you narrate the story of Ramayana in Tamil?"',
            '"What should I know about the architecture of Khajuraho temples?"'
          ]
        }
      ]
    },
    {
      id: 'virtual-visit',
      icon: Eye,
      title: 'Virtual Visit',
      description: 'Immersive AR/VR experiences that bring ancient monuments and legendary stories to life in stunning detail.',
      status: 'development',
      statusText: 'In Development',
      statusIcon: Wrench,
      content: [
        {
          heading: 'What is Virtual Visit?',
          text: 'Virtual Visit allows you to explore India\'s magnificent monuments from anywhere in the world using augmented reality (AR) and virtual reality (VR) technologies. Experience these sites as they were in their prime, with interactive elements that make history come alive.'
        },
        {
          heading: 'How It Will Work',
          text: 'Once available, you\'ll be able to access Virtual Visit through compatible devices. For AR experiences, simply point your smartphone camera at a monument to see overlays of historical information. For VR experiences, use a VR headset to fully immerse yourself in recreated historical environments.'
        },
        {
          heading: 'Planned Features',
          features: [
            'AR Overlays - See historical information overlaid on real monuments',
            'VR Recreations - Experience sites as they were in their historical prime',
            'Interactive Elements - Touch and explore 3D models of artifacts',
            '360° Experiences - Look around and explore every angle of ancient structures',
            'Time Travel Mode - See how sites changed over different historical periods'
          ]
        },
        {
          heading: 'Coming Soon',
          text: 'We are currently developing partnerships with technology providers and creating detailed 3D models of key monuments. This feature will be rolled out in phases, starting with the most popular heritage sites.'
        }
      ]
    },
    {
      id: 'treasure-hunt',
      icon: Trophy,
      title: 'Treasure Hunt',
      description: 'Gamified exploration with myth-based puzzles, folklore riddles, and rewards for discovering hidden cultural gems.',
      status: 'development',
      statusText: 'In Development',
      statusIcon: Wrench,
      content: [
        {
          heading: 'What is Treasure Hunt?',
          text: 'Treasure Hunt is a gamified way to explore India\'s cultural heritage. Solve puzzles, decode riddles based on folklore, and complete challenges to unlock rewards and discover hidden stories about monuments and traditions.'
        },
        {
          heading: 'How It Will Work',
          text: 'Once launched, Treasure Hunt will be accessible through your dashboard. You\'ll receive daily challenges and location-based quests. Complete these by visiting sites, solving puzzles, or answering questions about cultural facts you\'ve learned.'
        },
        {
          heading: 'Planned Features',
          features: [
            'Interactive Puzzles - Solve myth-based brain teasers',
            'Digital Badges - Earn collectible badges for achievements',
            'Leaderboards - Compete with other cultural explorers',
            'Cultural Challenges - Complete themed exploration missions',
            'Reward System - Unlock exclusive content and discounts'
          ]
        },
        {
          heading: 'Coming Soon',
          text: 'We are currently designing the puzzle engine and creating culturally authentic challenges. The feature will launch with a pilot program at select heritage sites.'
        }
      ]
    },
    {
      id: 'story-hub',
      icon: BookOpen,
      title: 'Story Hub',
      description: 'Rich multimedia library featuring articles, videos, podcasts, and illustrated comics about heritage sites.',
      status: 'available',
      statusText: 'Available Now',
      statusIcon: CheckCircle,
      content: [
        {
          heading: 'What is Story Hub?',
          text: 'Story Hub is a comprehensive multimedia library that brings India\'s cultural heritage to life through various formats. Explore articles, watch videos, listen to podcasts, and read illustrated comics about monuments, traditions, and historical events.'
        },
        {
          heading: 'How to Use Story Hub',
          text: 'Access Story Hub through the "Stories" link in the main navigation. Browse by category, monument, or theme. You can save stories to read later, share them with friends, and even download audio versions for offline listening.'
        },
        {
          heading: 'Available Content Types',
          features: [
            'Articles - In-depth written content by historians and cultural experts',
            'Videos - Documentaries and short films about heritage sites',
            'Podcasts - Audio stories you can listen to on the go',
            'Comics - Illustrated narratives that make history fun for all ages',
            'Photo Galleries - High-quality images of monuments and artifacts',
            'Interactive Timelines - Visual representations of historical events'
          ]
        },
        {
          heading: 'Getting Started',
          text: 'Create an account to save your favorite stories, track your reading progress, and receive personalized recommendations. The more you explore, the better Narad AI becomes at suggesting content you\'ll enjoy.'
        }
      ]
    },
    {
      id: 'smart-ticketing',
      icon: Ticket,
      title: 'Smart Ticketing',
      description: 'Seamless booking integration with tourism departments, bundled with exclusive cultural content.',
      status: 'beta',
      statusText: 'Beta Testing',
      statusIcon: Clock,
      content: [
        {
          heading: 'What is Smart Ticketing?',
          text: 'Smart Ticketing makes it easy to book entry tickets to monuments while providing additional cultural value. Get exclusive content, skip the lines, and enjoy special offers all through a single platform.'
        },
        {
          heading: 'How to Use Smart Ticketing',
          text: 'Currently in beta testing with select monuments. When available, you\'ll be able to book tickets directly through the "Tickets" section. Your digital ticket will include QR codes for entry and access to exclusive content about the site you\'re visiting.'
        },
        {
          heading: 'Available Features',
          features: [
            'QR-based Tickets - Digital tickets you can store on your phone',
            'Bundled Stories - Exclusive content about the monument you\'re visiting',
            'Group Discounts - Special rates for families and tour groups',
            'Skip Lines - Fast-track entry at participating sites',
            'Reservation System - Book time slots to avoid crowds'
          ]
        },
        {
          heading: 'Beta Program',
          text: 'We are currently testing Smart Ticketing with the Archaeological Survey of India (ASI) at select monuments. If you\'re interested in participating in the beta program, contact our support team to express your interest.'
        }
      ]
    },
    {
      id: 'travel-integration',
      icon: Car,
      title: 'Travel Integration',
      description: 'End-to-end travel partnerships with transport services, hotels, and heritage circuit packages.',
      status: 'development',
      statusText: 'In Development',
      statusIcon: Wrench,
      content: [
        {
          heading: 'What is Travel Integration?',
          text: 'Travel Integration will provide complete travel solutions for cultural tourism. From booking transportation to finding heritage-friendly accommodations, plan your entire cultural journey in one place.'
        },
        {
          heading: 'How It Will Work',
          text: 'Once launched, Travel Integration will allow you to plan comprehensive heritage tours. Book flights or trains, reserve hotels near monuments, and create custom itineraries that include multiple cultural sites across different regions.'
        },
        {
          heading: 'Planned Features',
          features: [
            'Transport Booking - Reserve flights, trains, and buses to heritage sites',
            'Route Planning - Optimize your journey between multiple monuments',
            'Hotel Deals - Find accommodations that respect and celebrate local culture',
            'Circuit Tours - Pre-planned packages for exploring heritage circuits',
            'Local Guide Connections - Connect with certified cultural guides',
            'Travel Insurance - Specialized coverage for heritage tourism'
          ]
        },
        {
          heading: 'Coming Soon',
          text: 'We are currently establishing partnerships with travel providers and developing the booking engine. This feature will launch in phases, starting with popular heritage circuits like the Golden Triangle.'
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="text-primary-600 mr-2" size={24} />
            <h1 className="text-3xl font-bold text-gray-900">Darshana Platform Guide</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Learn how to make the most of all Darshana features. Some features are available now, 
            while others are in development and will be released soon.
          </p>
        </div>

        {/* Features Grid */}
        <div className="space-y-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            const StatusIcon = feature.statusIcon
            
            return (
              <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Feature Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center">
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 p-4 mr-4`}>
                        <IconComponent size={32} className="text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{feature.title}</h2>
                        <p className="text-gray-600 mt-1">{feature.description}</p>
                      </div>
                    </div>
                    <div className={`mt-4 sm:mt-0 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      feature.status === 'available' ? 'bg-green-100 text-green-800' :
                      feature.status === 'beta' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      <StatusIcon size={16} className="mr-1" />
                      {feature.statusText}
                    </div>
                  </div>
                </div>

                {/* Feature Content */}
                <div className="p-6">
                  <div className="space-y-6">
                    {feature.content.map((section, sectionIndex) => (
                      <div key={sectionIndex}>
                        {section.heading && (
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">{section.heading}</h3>
                        )}
                        
                        {section.text && (
                          <p className="text-gray-600 mb-4">{section.text}</p>
                        )}
                        
                        {section.features && (
                          <ul className="space-y-2">
                            {section.features.map((item, itemIndex) => (
                              <li key={itemIndex} className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                                <span className="text-gray-600">{item}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        
                        {section.examples && (
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-2">Try asking:</h4>
                            <ul className="space-y-1">
                              {section.examples.map((example, exampleIndex) => (
                                <li key={exampleIndex} className="text-gray-600 font-mono text-sm">
                                  {example}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Feature Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-gray-500">
                      {feature.status === 'available' 
                        ? 'Ready to use - try it now!' 
                        : feature.status === 'beta'
                        ? 'Currently in beta testing - coming soon to all users'
                        : 'Under development - stay tuned for updates'}
                    </p>
                    {feature.status === 'available' && (
                      <Link 
                        href={feature.id === 'narad-ai' ? '/monuments' : 
                              feature.id === 'story-hub' ? '/stories' : 
                              feature.id === 'smart-ticketing' ? '/tickets' : '#'}
                        className="mt-2 sm:mt-0 inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500"
                      >
                        Try it now
                        <ExternalLink size={14} className="ml-1" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Call to Action */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-8 text-center">
          <HeadphonesIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Need More Help?</h2>
          <p className="text-gray-600 mb-6">
            Our support team is here to help you make the most of Darshana.
          </p>
          <div className="flex flex-col sm:flex-row sm:justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Link 
              href="/help" 
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
            >
              Visit Help Center
            </Link>
            <Link 
              href="/contact" 
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GuidePage