'use client'

import React from 'react'
import { BookOpen, Calendar, User, Tag } from 'lucide-react'

const BlogPage = () => {
  const blogPosts = [
    {
      title: 'The Future of Cultural Heritage Technology',
      excerpt: 'How AI and VR are transforming the way we experience historical sites and cultural artifacts.',
      author: 'Ajay Tiwari',
      date: 'June 15, 2024',
      tags: ['Technology', 'AI', 'Heritage'],
      image: '/images/heritage-background.jpg'
    },
    {
      title: 'Rediscovering the Temples of Khajuraho',
      excerpt: 'A deep dive into the architectural marvels and stories behind the famous Khajuraho temples.',
      author: 'Narad AI',
      date: 'June 10, 2024',
      tags: ['Temples', 'Architecture', 'History'],
      image: '/images/konarksuntemple.jpg'
    },
    {
      title: 'The Legend of Bhangarh Fort',
      excerpt: 'Exploring the haunted history and fascinating legends surrounding Rajasthan\'s most mysterious fort.',
      author: 'Cultural Stories Team',
      date: 'June 5, 2024',
      tags: ['Legends', 'Fort', 'Rajasthan'],
      image: '/bhangarhfort.jpg'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <BookOpen className="h-16 w-16 text-primary-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Darshana Blog</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stories, insights, and updates from the world of cultural heritage and technology
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-8">
              {blogPosts.map((post, index) => (
                <article key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="md:flex">
                    <div className="md:flex-shrink-0 md:w-1/3">
                      <img 
                        className="h-48 w-full object-cover md:h-full md:w-full" 
                        src={post.image} 
                        alt={post.title} 
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag, tagIndex) => (
                          <span key={tagIndex} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h2>
                      <p className="text-gray-600 mb-4">{post.excerpt}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="h-4 w-4 mr-1" />
                        <span className="mr-4">{post.author}</span>
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{post.date}</span>
                      </div>
                      <button className="mt-4 text-primary-600 hover:text-primary-500 font-medium">
                        Read More &rarr;
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <nav className="border-t border-gray-200 px-4 flex items-center justify-between sm:px-0">
                <div className="-mt-px w-0 flex-1 flex">
                  <a
                    href="#"
                    className="border-t-2 border-transparent pt-4 pr-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  >
                    <svg className="mr-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Previous
                  </a>
                </div>
                <div className="hidden md:-mt-px md:flex">
                  <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium">1</a>
                  <a href="#" className="border-primary-500 text-primary-600 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium" aria-current="page">2</a>
                  <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium">3</a>
                  <span className="border-transparent text-gray-500 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium">...</span>
                  <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium">8</a>
                  <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium">9</a>
                  <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium">10</a>
                </div>
                <div className="-mt-px w-0 flex-1 flex justify-end">
                  <a
                    href="#"
                    className="border-t-2 border-transparent pt-4 pl-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  >
                    Next
                    <svg className="ml-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </nav>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* About Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About Darshana Blog</h3>
              <p className="text-gray-600 mb-4">
                Explore stories, insights, and updates from the intersection of cultural heritage and technology.
              </p>
              <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Subscribe
              </button>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-primary-600">Technology</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary-600">History</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary-600">Architecture</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary-600">Legends & Myths</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary-600">Travel</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary-600">Conservation</a></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Stay Updated</h3>
              <p className="text-gray-600 mb-4">
                Get the latest stories and updates delivered to your inbox.
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
                <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogPage