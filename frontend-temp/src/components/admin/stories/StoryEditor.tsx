'use client'

import React, { useState, useRef, useEffect } from 'react'
import { 
  ArrowLeftIcon, 
  PhotoIcon, 
  PaperClipIcon, 
  Bars3Icon,
  ChevronDownIcon,
  XMarkIcon,
  CheckIcon,
  BoldIcon,
  ItalicIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

interface MediaAsset {
  id: string
  type: 'image' | 'audio' | 'video'
  url: string
  caption?: string
  fileName: string
}

interface StoryFormData {
  title: string
  description: string
  content: string
  monument: string
  type: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  ageRating: string
  themes: string[]
  narrator: string
  isPublished: boolean
  isFeatured: boolean
  mediaAssets: MediaAsset[]
  createdAt: string
  updatedAt: string
}

interface StoryEditorProps {
  initialData?: Partial<StoryFormData>
  isEditing?: boolean
  storyId?: string
}

const StoryEditor: React.FC<StoryEditorProps> = ({ initialData, isEditing = false, storyId }) => {
  const [formData, setFormData] = useState<StoryFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    content: initialData?.content || '',
    monument: initialData?.monument || '',
    type: initialData?.type || 'history',
    difficulty: initialData?.difficulty || 'intermediate',
    ageRating: initialData?.ageRating || 'all',
    themes: initialData?.themes || [],
    narrator: initialData?.narrator || 'Ajay Tiwari',
    isPublished: initialData?.isPublished || false,
    isFeatured: initialData?.isFeatured || false,
    mediaAssets: initialData?.mediaAssets || [],
    createdAt: initialData?.createdAt || new Date().toISOString(),
    updatedAt: initialData?.updatedAt || new Date().toISOString()
  })
  
  const [selectedTheme, setSelectedTheme] = useState('')
  const [newTheme, setNewTheme] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [saving, setSaving] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [activeTab, setActiveTab] = useState('content')
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const storyTypes = [
    'history', 'mythology', 'folklore', 'horror', 'belief', 
    'legend', 'mystery', 'romance', 'adventure', 'spiritual'
  ]
  
  const themes = [
    'love', 'war', 'devotion', 'sacrifice', 'wisdom', 'power',
    'mystery', 'supernatural', 'divine', 'justice', 'betrayal',
    'heroism', 'culture', 'tradition', 'architecture', 'art',
    'music', 'dance', 'festival', 'ritual', 'pilgrimage'
  ]
  
  const ageRatings = [
    { value: 'all', label: 'All Ages' },
    { value: '7+', label: '7 and above' },
    { value: '13+', label: '13 and above' },
    { value: '16+', label: '16 and above' },
    { value: '18+', label: '18 and above' }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      updatedAt: new Date().toISOString()
    }))
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      content: e.target.value,
      updatedAt: new Date().toISOString()
    }))
  }

  const addTheme = () => {
    if (selectedTheme && !formData.themes.includes(selectedTheme)) {
      setFormData(prev => ({
        ...prev,
        themes: [...prev.themes, selectedTheme]
      }))
      setSelectedTheme('')
    } else if (newTheme && !formData.themes.includes(newTheme)) {
      setFormData(prev => ({
        ...prev,
        themes: [...prev.themes, newTheme]
      }))
      setNewTheme('')
    }
  }

  const removeTheme = (theme: string) => {
    setFormData(prev => ({
      ...prev,
      themes: prev.themes.filter(t => t !== theme)
    }))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate file upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    // Simulate upload completion
    setTimeout(() => {
      clearInterval(interval)
      setUploadProgress(100)
      
      // Add uploaded files to media assets
      const newMediaAssets: MediaAsset[] = Array.from(files).map((file, index) => ({
        id: `media-${Date.now()}-${index}`,
        type: file.type.startsWith('image') ? 'image' : 
              file.type.startsWith('audio') ? 'audio' : 'video',
        url: URL.createObjectURL(file),
        fileName: file.name
      }))
      
      setFormData(prev => ({
        ...prev,
        mediaAssets: [...prev.mediaAssets, ...newMediaAssets]
      }))
      
      setTimeout(() => {
        setIsUploading(false)
        setUploadProgress(0)
      }, 500)
    }, 2000)
  }

  const removeMediaAsset = (id: string) => {
    setFormData(prev => ({
      ...prev,
      mediaAssets: prev.mediaAssets.filter(asset => asset.id !== id)
    }))
  }

  const insertImageAtCursor = (imageUrl: string) => {
    const textarea = document.getElementById('story-content') as HTMLTextAreaElement
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const content = formData.content
      const newContent = content.substring(0, start) + `\n![Image](${imageUrl})\n` + content.substring(end)
      
      setFormData(prev => ({
        ...prev,
        content: newContent
      }))
      
      // Focus back to textarea
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start + imageUrl.length + 10, start + imageUrl.length + 10)
      }, 0)
    }
  }

  const insertHeading = (level: number) => {
    const textarea = document.getElementById('story-content') as HTMLTextAreaElement
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selectedText = formData.content.substring(start, end)
      const headingPrefix = '#'.repeat(level) + ' '
      const newContent = formData.content.substring(0, start) + 
                        (selectedText ? `${headingPrefix}${selectedText}\n` : `${headingPrefix}Heading\n`) + 
                        formData.content.substring(end)
      
      setFormData(prev => ({
        ...prev,
        content: newContent
      }))
      
      // Focus back to textarea
      setTimeout(() => {
        textarea.focus()
        const newCursorPos = start + headingPrefix.length + (selectedText ? selectedText.length + 1 : 0)
        textarea.setSelectionRange(newCursorPos, newCursorPos)
      }, 0)
    }
  }

  const insertBoldText = () => {
    const textarea = document.getElementById('story-content') as HTMLTextAreaElement
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selectedText = formData.content.substring(start, end)
      const newContent = formData.content.substring(0, start) + 
                        `**${selectedText || 'bold text'}**` + 
                        formData.content.substring(end)
      
      setFormData(prev => ({
        ...prev,
        content: newContent
      }))
      
      // Focus back to textarea
      setTimeout(() => {
        textarea.focus()
        const newCursorPos = start + 2 + (selectedText ? selectedText.length : 0)
        textarea.setSelectionRange(newCursorPos, newCursorPos)
      }, 0)
    }
  }

  const insertItalicText = () => {
    const textarea = document.getElementById('story-content') as HTMLTextAreaElement
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selectedText = formData.content.substring(start, end)
      const newContent = formData.content.substring(0, start) + 
                        `*${selectedText || 'italic text'}*` + 
                        formData.content.substring(end)
      
      setFormData(prev => ({
        ...prev,
        content: newContent
      }))
      
      // Focus back to textarea
      setTimeout(() => {
        textarea.focus()
        const newCursorPos = start + 1 + (selectedText ? selectedText.length : 0)
        textarea.setSelectionRange(newCursorPos, newCursorPos)
      }, 0)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      const url = isEditing 
        ? `/api/admin/stories/${storyId}` 
        : '/api/admin/stories'
      
      const method = isEditing ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          updatedAt: new Date().toISOString()
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setSaving(false)
        alert(`${isEditing ? 'Updated' : 'Created'} story successfully!`)
        if (!isEditing) {
          // Reset form for new story
          setFormData({
            title: '',
            description: '',
            content: '',
            monument: '',
            type: 'history',
            difficulty: 'intermediate',
            ageRating: 'all',
            themes: [],
            narrator: 'Ajay Tiwari',
            isPublished: false,
            isFeatured: false,
            mediaAssets: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          })
        }
      } else {
        const error = await response.json()
        setSaving(false)
        alert(error.message || `Failed to ${isEditing ? 'update' : 'create'} story`)
      }
    } catch (error) {
      console.error('Error saving story:', error)
      setSaving(false)
      alert(`Failed to ${isEditing ? 'update' : 'create'} story. Please try again.`)
    }
  }

  const processMarkdown = (content: string) => {
    if (!content) return null
    
    const lines = content.split('\n')
    const processedLines = []
    
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i]
      
      // Process bold text (**text**)
      line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      
      // Process italic text (*text*)
      line = line.replace(/\*(.*?)\*/g, '<em>$1</em>')
      
      // Check for ## headings
      if (line.startsWith('## ')) {
        const headingText = line.substring(3)
        processedLines.push(
          <h2 key={i} className="markdown-heading text-2xl font-bold text-gray-900 mt-6 mb-4 border-b border-gray-200 pb-2">
            {headingText}
          </h2>
        )
      } 
      // Check for ### subheadings
      else if (line.startsWith('### ')) {
        const headingText = line.substring(4)
        processedLines.push(
          <h3 key={i} className="markdown-subheading text-xl font-semibold text-gray-800 mt-5 mb-3">
            {headingText}
          </h3>
        )
      }
      // Check for images
      else if (line.match(/!\[.*\]\(.*\)/)) {
        const match = line.match(/!\[(.*)\]\((.*)\)/)
        if (match) {
          const [, alt, src] = match
          processedLines.push(
            <img key={i} src={src} alt={alt} className="my-4 rounded-lg shadow-md max-w-full h-auto" />
          )
        }
      }
      // Handle paragraphs with inline formatting
      else if (line.trim() !== '') {
        processedLines.push(
          <p 
            key={i} 
            className="markdown-paragraph text-gray-700 mb-4 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: line }}
          />
        )
      }
      // Handle empty lines
      else if (line.trim() === '') {
        processedLines.push(<br key={i} />)
      }
    }
    
    return processedLines
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Link href="/admin/stories" className="flex items-center text-gray-600 hover:text-gray-900 mr-4">
              <ArrowLeftIcon className="h-5 w-5 mr-1" />
              Back
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? 'Edit Story' : (formData.title || 'New Story')}
            </h1>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              {previewMode ? 'Edit' : 'Preview'}
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {saving ? (isEditing ? 'Updating...' : 'Saving...') : (isEditing ? 'Update Story' : 'Save Story')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  <button
                    onClick={() => setActiveTab('content')}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                      activeTab === 'content'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Content
                  </button>
                  <button
                    onClick={() => setActiveTab('media')}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                      activeTab === 'media'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Media Assets
                  </button>
                </nav>
              </div>
              
              <div className="p-6">
                {activeTab === 'content' ? (
                  <div className="space-y-6">
                    {/* Title */}
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Story Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter story title"
                      />
                    </div>
                    
                    {/* Description */}
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Short Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Brief summary of the story"
                      />
                    </div>
                    
                    {/* Content Editor */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                          Story Content
                        </label>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={insertBoldText}
                            className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200"
                          >
                            <BoldIcon className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            onClick={insertItalicText}
                            className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200"
                          >
                            <ItalicIcon className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => insertHeading(2)}
                            className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200"
                          >
                            H2
                          </button>
                          <button
                            type="button"
                            onClick={() => insertHeading(3)}
                            className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200"
                          >
                            H3
                          </button>
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200 flex items-center"
                          >
                            <PhotoIcon className="h-3 w-3 mr-1" />
                            Image
                          </button>
                        </div>
                      </div>
                      
                      {previewMode ? (
                        <div className="border border-gray-300 rounded-lg p-4 bg-white min-h-[400px]">
                          {processMarkdown(formData.content)}
                        </div>
                      ) : (
                        <textarea
                          id="story-content"
                          name="content"
                          value={formData.content}
                          onChange={handleContentChange}
                          rows={15}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                          placeholder="Write your story content here. Use ## for headings and ![alt](url) for images."
                        />
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* File Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Media
                      </label>
                      <div 
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-900">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            Images, audio, and video files
                          </p>
                        </div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                          multiple
                          accept="image/*,audio/*,video/*"
                          className="hidden"
                        />
                      </div>
                      
                      {isUploading && (
                        <div className="mt-4">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 text-center">
                            Uploading... {uploadProgress}%
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {/* Uploaded Media */}
                    {formData.mediaAssets.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Uploaded Media</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {formData.mediaAssets.map((asset) => (
                            <div key={asset.id} className="relative group">
                              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                {asset.type === 'image' ? (
                                  <img 
                                    src={asset.url} 
                                    alt={asset.fileName}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <PaperClipIcon className="h-8 w-8 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div className="mt-2 text-xs text-gray-500 truncate">
                                {asset.fileName}
                              </div>
                              <div className="absolute top-1 right-1 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => insertImageAtCursor(asset.url)}
                                  className="p-1 bg-white rounded-full shadow text-green-600 hover:text-green-800"
                                >
                                  <CheckIcon className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => removeMediaAsset(asset.id)}
                                  className="p-1 bg-white rounded-full shadow text-red-600 hover:text-red-800"
                                >
                                  <XMarkIcon className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Publish Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Publish Status</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="isPublished"
                      checked={formData.isPublished}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Featured Story</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div>
                  <label htmlFor="monument" className="block text-sm font-medium text-gray-700 mb-1">
                    Monument
                  </label>
                  <input
                    type="text"
                    id="monument"
                    name="monument"
                    value={formData.monument}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Select or enter monument"
                  />
                </div>
                
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    Story Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    {storyTypes.map(type => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
                    Difficulty Level
                  </label>
                  <select
                    id="difficulty"
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="ageRating" className="block text-sm font-medium text-gray-700 mb-1">
                    Age Rating
                  </label>
                  <select
                    id="ageRating"
                    name="ageRating"
                    value={formData.ageRating}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    {ageRatings.map(rating => (
                      <option key={rating.value} value={rating.value}>
                        {rating.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="text-xs text-gray-500 pt-2 border-t">
                  <p>Created: {new Date(formData.createdAt).toLocaleDateString()}</p>
                  <p>Last updated: {new Date(formData.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            
            {/* Themes */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Themes</h3>
              
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <select
                    value={selectedTheme}
                    onChange={(e) => setSelectedTheme(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select theme</option>
                    {themes.map(theme => (
                      <option key={theme} value={theme}>
                        {theme.charAt(0).toUpperCase() + theme.slice(1)}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={addTheme}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
                
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newTheme}
                    onChange={(e) => setNewTheme(e.target.value)}
                    placeholder="Add custom theme"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.themes.map(theme => (
                    <span 
                      key={theme} 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {theme}
                      <button
                        onClick={() => removeTheme(theme)}
                        className="ml-1.5 inline-flex text-blue-600 hover:text-blue-800"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Narrator */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Narrator</h3>
              
              <div>
                <label htmlFor="narrator" className="block text-sm font-medium text-gray-700 mb-1">
                  Narrator Name
                </label>
                <input
                  type="text"
                  id="narrator"
                  name="narrator"
                  value={formData.narrator}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter narrator name"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StoryEditor