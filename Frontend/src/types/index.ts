// User Types
export interface User {
  _id: string
  email: string
  name: string
  firstName?: string
  lastName?: string
  avatar?: string
  role?: 'user' | 'guide' | 'admin'
  preferences: UserPreferences
  visitHistory: VisitHistory[]
  rewards: Reward[]
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
}

export interface UserPreferences {
  language: 'en' | 'hi' | 'regional'
  contentTypes: ContentType[]
  interests: string[]
  accessibility: AccessibilityOptions
}

export interface AccessibilityOptions {
  audioNarration: boolean
  highContrast: boolean
  fontSize: 'small' | 'medium' | 'large'
  subtitles: boolean
}

// Monument Types
export interface Monument {
  _id: string
  name: string
  location: Location
  description: string
  images: string[]
  categories: string[]
  historicalPeriod: string
  significance: string
  stories: Story[]
  arAssets: ARAsset[]
  vrExperiences: VRExperience[]
  ticketInfo: TicketInfo
  treasureHunts: TreasureHunt[]
  createdAt: string
  updatedAt: string
}

export interface Location {
  address: string
  city: string
  state: string
  country: string
  coordinates: {
    latitude: number
    longitude: number
  }
  nearbyLandmarks: string[]
}

// Story Types
export interface Story {
  _id: string
  title: string
  type: StoryType
  content: string
  summary: string
  mediaAssets: MediaAsset[]
  narrator: Narrator
  language: string
  duration: number
  tags: string[]
  verificationStatus: 'verified' | 'folklore' | 'legend'
  popularityScore: number
  createdAt: string
  updatedAt: string
}

export type StoryType = 'history' | 'mythology' | 'folklore' | 'horror' | 'belief' | 'legend'

export interface MediaAsset {
  _id: string
  type: 'image' | 'video' | 'audio' | 'illustration'
  url: string
  caption?: string
  credits?: string
}

export interface Narrator {
  name: string
  voice: 'male' | 'female' | 'ai'
  accent: string
  specialty: string[]
}

// AI Types
export interface NaradAI {
  sessionId: string
  context: ConversationContext
  isActive: boolean
}

export interface ConversationContext {
  currentMonument?: string
  userLocation?: Location
  preferences: UserPreferences
  conversationHistory: Message[]
}

export interface Message {
  _id: string
  type: 'user' | 'ai'
  content: string
  timestamp: string
  metadata?: {
    suggestedActions?: string[]
    relatedStories?: string[]
    multimedia?: MediaAsset[]
  }
}

// AR/VR Types
export interface ARAsset {
  _id: string
  monumentId: string
  name: string
  type: 'animation' | 'overlay' | 'interactive'
  modelUrl: string
  triggerPoints: TriggerPoint[]
  storyId?: string
  description: string
}

export interface VRExperience {
  _id: string
  monumentId: string
  title: string
  description: string
  sceneUrl: string
  duration: number
  interactiveElements: InteractiveElement[]
  requiredEquipment: VREquipment[]
}

export interface TriggerPoint {
  coordinates: {
    x: number
    y: number
    z: number
  }
  radius: number
  action: string
}

export interface InteractiveElement {
  name: string
  position: { x: number; y: number; z: number }
  action: string
  content: string
}

export type VREquipment = 'smartphone' | 'vr-headset' | 'cardboard'

// Gamification Types
export interface TreasureHunt {
  _id: string
  monumentId: string
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  clues: Clue[]
  rewards: Reward[]
  completionRate: number
  estimatedDuration: number
}

export interface Clue {
  _id: string
  order: number
  question: string
  hint?: string
  answer: string
  location?: Location
  mediaAsset?: MediaAsset
  storyReference?: string
}

export interface Reward {
  _id: string
  type: 'badge' | 'discount' | 'collectible' | 'points'
  name: string
  description: string
  value: number
  iconUrl: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

// Booking Types
export interface TicketInfo {
  available: boolean
  price: {
    indian: number
    foreign: number
    student: number
  }
  timings: {
    openTime: string
    closeTime: string
    closedDays: string[]
  }
  bookingUrl?: string
  restrictions: string[]
}

export interface Booking {
  _id: string
  userId: string
  monumentId: string
  ticketType: 'indian' | 'foreign' | 'student'
  quantity: number
  visitDate: string
  totalAmount: number
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded'
  qrCode: string
  bundledStories: string[]
  createdAt: string
}

// Content Types
export type ContentType = 'article' | 'video' | 'audio' | 'comic' | 'interactive'

export interface Content {
  _id: string
  title: string
  type: ContentType
  url: string
  thumbnail: string
  duration?: number
  description: string
  tags: string[]
  relatedMonuments: string[]
  createdAt: string
}

// Visit History
export interface VisitHistory {
  monumentId: string
  visitDate: string
  storiesViewed: string[]
  treasureHuntsCompleted: string[]
  rating?: number
  review?: string
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

// Search Types
export interface SearchFilters {
  location?: string
  category?: string[]
  storyType?: StoryType[]
  difficulty?: string
  period?: string
}

export interface SearchResult {
  monuments: Monument[]
  stories: Story[]
  experiences: VRExperience[]
}

// Navigation Types
export interface NavigationItem {
  label: string
  href: string
  icon?: string
  children?: NavigationItem[]
}