'use client'

import React, { useState, useEffect } from 'react'
import { apiCall } from '../../../lib/api'
import { usePathname } from 'next/navigation'
import { 
  BookOpenIcon, 
  ClockIcon, 
  UserIcon, 
  HeartIcon, 
  ShareIcon, 
  BookmarkIcon,
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon, BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import StoryTypeSwitcher from '../../../components/stories/StoryTypeSwitcher'
import AnimatedStoryContent from '../../../components/stories/AnimatedStoryContent'

// Define the story type
type StoryType = 'history' | 'mythology' | 'belief' | 'horror' | 'folklore' | 'legend'

interface Story {
  _id: string
  title: string
  content: string
  type: StoryType
  summary: string
  excerpt: string
  monument: {
    _id: string
    name: string
    location: string
  }
  author: {
    _id: string
    name: string
    avatar: string
  }
  mediaAssets: {
    type: string
    url: string
    caption: string
  }[]
  narrator: {
    name: string
    voice: string
    bio: string
  }
  readingTime: number
  audioLength: number
  themes: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  ageRating: string
  sources: {
    title: string
    author: string
    url: string
  }[]
  statistics: {
    views: number
    likes: number
    shares: number
    bookmarks: number
    averageRating: number
    totalRatings: number
  }
  relatedStories: {
    _id: string
    title: string
    type: StoryType
    summary: string
  }[]
  isLiked?: boolean
  isBookmarked?: boolean
  createdAt: string
}

const StoryDetailPage: React.FC = () => {
  const pathname = usePathname()
  const storyId = pathname.split('/')[2]
  
  const [story, setStory] = useState<Story | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeStoryType, setActiveStoryType] = useState<StoryType>('history')
  const [direction, setDirection] = useState(0) // For animation direction

  // Mock data for demonstration
  const getMockStoryById = (id: string): Story => {
    // Add all stories from the mock API
    const mockStories: Record<string, Story> = {
      '1': {
        _id: '1',
        title: 'The Sacred Kedarnath Temple',
        content: `## The Ancient History of Kedarnath

The Kedarnath Temple, dedicated to Lord Shiva, is one of the twelve Jyotirlingas and holds immense spiritual significance for Hindus. Nestled in the majestic Garhwal Himalayas at an altitude of 3,583 meters, this ancient temple has been a pilgrimage destination for centuries.

### Historical Origins

According to historical records, the current temple structure was built by Adi Shankaracharya in the 8th century AD. However, the origins of the temple are believed to be much older, with references found in ancient Hindu scriptures.

The temple follows the Katyayanagama style of North Indian temple architecture. The main sanctum houses the lingam, which is believed to be swayambhu (self-manifested).

## The Divine Legend

According to the Mahabharata, after the great war of Kurukshetra, the Pandavas sought to atone for their sins by seeking Lord Shiva's blessings. Lord Shiva, not wishing to meet them, took the form of a bull and hid. The Pandavas recognized him and tried to catch him. Lord Shiva then dived into the ground, leaving only his hump visible at Kedarnath. The other parts of his body are believed to have appeared at four other places, forming the Panch Kedar pilgrimage circuit.

## Spiritual Beliefs

Kedarnath is considered one of the holiest shrines in Hinduism. Devotees believe that a visit to this temple can wash away all sins and lead to moksha (liberation). The temple is especially significant during the month of Shravan (July-August) when millions of devotees visit.

The spiritual atmosphere of Kedarnath is enhanced by its remote location, which requires a challenging trek through the Himalayas, symbolizing the journey towards spiritual enlightenment.

## The Annual Ritual

Every year, the temple undergoes a unique ritual. During the winter months (November to April), the idol is moved to Ukhimath for worship, while a replica is worshipped at Kedarnath during the pilgrimage season (May to October). This tradition has been followed for centuries.`,
        type: 'history',
        summary: 'Discover the ancient history and spiritual significance of the Kedarnath Temple, one of the twelve Jyotirlingas dedicated to Lord Shiva.',
        excerpt: 'Explore the rich history of the sacred Kedarnath Temple...',
        monument: {
          _id: 'm1',
          name: 'Kedarnath Temple',
          location: 'Uttarakhand'
        },
        author: {
          _id: 'author-1',
          name: 'Ajay Tiwari',
          avatar: '/placeholder-avatar.jpg'
        },
        mediaAssets: [
          {
            type: 'image',
            url: '/sacred_places/Kedarnath.jpg',
            caption: 'The majestic Kedarnath Temple in the Himalayas'
          }
        ],
        narrator: {
          name: 'Ajay Tiwari',
          voice: 'ai',
          bio: 'Storyteller'
        },
        readingTime: 8,
        audioLength: 12,
        themes: ['history', 'spirituality', 'pilgrimage'],
        difficulty: 'intermediate',
        ageRating: 'all',
        sources: [
          {
            title: 'The Mahabharata',
            author: 'Vyasa',
            url: '#'
          },
          {
            title: 'History of Kedarnath Temple',
            author: 'Archaeological Survey of India',
            url: '#'
          }
        ],
        statistics: {
          views: 12500,
          likes: 890,
          shares: 245,
          bookmarks: 156,
          averageRating: 4.7,
          totalRatings: 234
        },
        relatedStories: [],
        isLiked: false,
        isBookmarked: false,
        createdAt: '2023-05-15T10:30:00Z'
      },
      '2': {
        _id: '2',
        title: 'The Mystical Badrinath',
        content: `## The Divine Abode of Badrinath

Badrinath Temple, located in the picturesque town of Badrinath in Uttarakhand, is one of the most revered pilgrimage sites for Hindus. Dedicated to Lord Vishnu, this ancient temple holds immense spiritual significance and attracts thousands of devotees every year.

### Historical Origins

The Badrinath Temple was originally established by Adi Shankaracharya in the 8th century. The temple is built in the typical North Indian architectural style with a conical roof and a gold-plated facade. The main deity, Badri Vishal, is a black stone idol of Lord Vishnu seated in a meditative posture.

## Spiritual Significance

Badrinath is considered one of the Char Dham pilgrimage sites, along with Yamunotri, Gangotri, and Kedarnath. According to Hindu mythology, Lord Vishnu performed severe penance here in the form of Badri, a berry tree. The temple is also associated with the Pandavas from the Mahabharata, who are believed to have visited this place during their exile.

## The Annual Ritual

The temple remains open for six months, from the end of April to the beginning of November. During the winter months, the idol is moved to the Narasimha Temple in Ukhimath for worship. This tradition has been followed for centuries and is an integral part of the temple's spiritual practices.

## Natural Beauty

Nestled in the backdrop of the majestic Neelkanth peak, the temple offers breathtaking views of the Himalayas. The hot springs near the temple are believed to have medicinal properties and add to the spiritual experience of the pilgrims.`,
        type: 'history',
        summary: 'Explore the spiritual significance of Badrinath Temple dedicated to Lord Vishnu.',
        excerpt: 'Discover the rich history of the sacred Badrinath Temple...',
        monument: {
          _id: 'm2',
          name: 'Badrinath Temple',
          location: 'Uttarakhand'
        },
        author: {
          _id: 'author-2',
          name: 'Ajay Tiwari',
          avatar: '/placeholder-avatar.jpg'
        },
        mediaAssets: [
          {
            type: 'image',
            url: '/sacred_places/Badrinath.jpg',
            caption: 'The majestic Badrinath Temple in the Himalayas'
          }
        ],
        narrator: {
          name: 'Ajay Tiwari',
          voice: 'ai',
          bio: 'Storyteller'
        },
        readingTime: 6,
        audioLength: 9,
        themes: ['history', 'spirituality', 'pilgrimage'],
        difficulty: 'intermediate',
        ageRating: 'all',
        sources: [],
        statistics: {
          views: 9800,
          likes: 720,
          shares: 195,
          bookmarks: 120,
          averageRating: 4.6,
          totalRatings: 150
        },
        relatedStories: [],
        isLiked: false,
        isBookmarked: false,
        createdAt: '2023-06-10T09:15:00Z'
      },
      '3': {
        _id: '3',
        title: 'The Golden Temple of Amritsar',
        content: `## The Sacred Golden Temple

The Golden Temple, officially known as Harmandir Sahib, stands as the most sacred shrine in Sikhism and one of the most revered religious sites in the world. Located in the heart of Amritsar, Punjab, this magnificent structure is not only an architectural marvel but also a symbol of spiritual equality, compassion, and service.

### Historical Origins

The foundation of the Golden Temple was laid by the fourth Sikh Guru, Guru Ram Das Ji, in 1574. However, the construction of the main temple structure began under the guidance of the fifth Sikh Guru, Guru Arjan Dev Ji, in 1581. Guru Arjan Dev Ji designed the temple with a unique architectural concept that reflected the core Sikh principles of equality and openness. The temple was built at a lower level than the surrounding land, symbolizing the Sikh belief in humility and the idea that one must descend to ascend spiritually.

## Architectural Marvel

The Golden Temple is a masterpiece of Indo-Islamic architecture, combining elements from Hindu and Islamic design traditions. The temple stands in the middle of the Amrit Sarovar, connected to the mainland by a causeway. The structure features a square platform with a large doorway on each side, symbolizing the openness of Sikhism to people from all directions and backgrounds. The main temple building is two stories high, with the upper floor housing the sanctum sanctorum where the Guru Granth Sahib is kept.

## Spiritual Significance

The Golden Temple holds immense spiritual significance for Sikhs worldwide as the holiest shrine in Sikhism. It represents the core values of the Sikh faith: equality, service, and devotion to the divine. The temple is open 24 hours a day, 365 days a year, and welcomes people of all religions, castes, and backgrounds. This inclusivity is reflected in the four doorways of the temple, which face the four cardinal directions, symbolizing the Sikh belief that the divine is accessible to all.`,
        type: 'history',
        summary: 'Discover the spiritual heart of Sikhism and the architectural marvel of Harmandir Sahib in Amritsar.',
        excerpt: 'Explore the rich history of the sacred Golden Temple...',
        monument: {
          _id: 'm3',
          name: 'Golden Temple',
          location: 'Punjab'
        },
        author: {
          _id: 'author-3',
          name: 'Ajay Tiwari',
          avatar: '/placeholder-avatar.jpg'
        },
        mediaAssets: [
          {
            type: 'image',
            url: '/golderntemple.jpg',
            caption: 'The magnificent Golden Temple with its iconic golden dome'
          }
        ],
        narrator: {
          name: 'Ajay Tiwari',
          voice: 'ai',
          bio: 'Storyteller'
        },
        readingTime: 11,
        audioLength: 15,
        themes: ['history', 'spirituality', 'architecture'],
        difficulty: 'beginner',
        ageRating: 'all',
        sources: [],
        statistics: {
          views: 21000,
          likes: 1540,
          shares: 420,
          bookmarks: 350,
          averageRating: 4.9,
          totalRatings: 350
        },
        relatedStories: [],
        isLiked: false,
        isBookmarked: false,
        createdAt: '2023-07-05T11:20:00Z'
      },
      '4': {
        _id: '4',
        title: 'The Legends of Ayodhya',
        content: `## The Royal City of Ayodhya

Ayodhya, located on the banks of the sacred Sarayu river, is one of the seven holiest cities in Hinduism. According to the Ramayana, it was the birthplace of Lord Rama, the seventh avatar of Lord Vishnu, and served as the capital of the ancient Kosala Kingdom under his rule.

### Historical Significance

Archaeological evidence suggests that Ayodhya has been continuously inhabited for over 2,000 years. The city's significance extends beyond mythology, with historical records indicating it was an important center of trade and culture during ancient times. The ruins of several temples and structures have been found in the area, testifying to its rich heritage.

## The Ramayana Connection

The Ramayana, one of the greatest epics of ancient India, is deeply intertwined with Ayodhya's identity. The story of Lord Rama's birth, his exile, and his eventual return to rule Ayodhya forms the core of the city's spiritual and cultural narrative. The sites associated with various events from the Ramayana, such as the Ram Janmabhoomi, are considered sacred by millions of devotees.

## Modern Developments

In recent years, Ayodhya has undergone significant development with the construction of the Ram Temple at the Ram Janmabhoomi site. This has renewed interest in the city's historical and spiritual significance, attracting pilgrims and tourists from across the world.`,
        type: 'mythology',
        summary: 'The ancient capital and birthplace of Lord Rama.',
        excerpt: 'Discover the rich history and mythology of Ayodhya...',
        monument: {
          _id: 'm4',
          name: 'Ayodhya',
          location: 'Uttar Pradesh'
        },
        author: {
          _id: 'author-4',
          name: 'Ajay Tiwari',
          avatar: '/placeholder-avatar.jpg'
        },
        mediaAssets: [
          {
            type: 'image',
            url: '/sacred_places/Ayodhya.jpg',
            caption: 'The sacred city of Ayodhya on the banks of the Sarayu river'
          }
        ],
        narrator: {
          name: 'Ajay Tiwari',
          voice: 'ai',
          bio: 'Storyteller'
        },
        readingTime: 12,
        audioLength: 15,
        themes: ['mythology', 'history', 'spirituality'],
        difficulty: 'intermediate',
        ageRating: 'all',
        sources: [],
        statistics: {
          views: 18500,
          likes: 1320,
          shares: 380,
          bookmarks: 280,
          averageRating: 4.7,
          totalRatings: 290
        },
        relatedStories: [],
        isLiked: false,
        isBookmarked: false,
        createdAt: '2023-08-12T14:30:00Z'
      },
      '5': {
        _id: '5',
        title: 'Mathura: Birthplace of Lord Krishna',
        content: `## The Birthplace of Lord Krishna

Mathura, located on the banks of the Yamuna river, is revered as the birthplace of Lord Krishna, one of the most beloved deities in Hinduism. This ancient city holds immense spiritual significance and has been a center of devotion for centuries.

### Historical Origins

Mathura's history dates back to ancient times, with archaeological evidence suggesting it was an important urban center during the Mahajanapada period. The city flourished under various dynasties, including the Mauryas, Sungas, and Guptas, each contributing to its cultural and architectural heritage.

## Spiritual Significance

According to Hindu mythology, Mathura is where Lord Krishna was born to Devaki and Vasudeva in the prison of his maternal uncle, King Kansa. The city is dotted with numerous temples dedicated to Lord Krishna and his childhood associates, making it a major pilgrimage destination for devotees.

## Cultural Heritage

Mathura is renowned for its unique art form, the Mathura School of Art, which developed during the Kushan period. This style is characterized by its distinctive red sandstone sculptures and is considered one of the two major schools of Indian art, along with the Gandhara School.

## Festivals and Traditions

The city comes alive during festivals like Janmashtami, celebrating Lord Krishna's birth, and Holi, which has special significance in Mathura as it is associated with Lord Krishna's playful activities. These festivals attract thousands of devotees and tourists from around the world.`,
        type: 'history',
        summary: 'The ancient city where Lord Krishna was born.',
        excerpt: 'Explore the rich history and spiritual significance of Mathura...',
        monument: {
          _id: 'm5',
          name: 'Mathura',
          location: 'Uttar Pradesh'
        },
        author: {
          _id: 'author-5',
          name: 'Ajay Tiwari',
          avatar: '/placeholder-avatar.jpg'
        },
        mediaAssets: [
          {
            type: 'image',
            url: '/sacred_places/Mathura.jpg',
            caption: 'The sacred city of Mathura on the banks of the Yamuna river'
          }
        ],
        narrator: {
          name: 'Ajay Tiwari',
          voice: 'ai',
          bio: 'Storyteller'
        },
        readingTime: 10,
        audioLength: 12,
        themes: ['history', 'spirituality', 'culture'],
        difficulty: 'beginner',
        ageRating: 'all',
        sources: [],
        statistics: {
          views: 16800,
          likes: 1210,
          shares: 340,
          bookmarks: 240,
          averageRating: 4.8,
          totalRatings: 260
        },
        relatedStories: [],
        isLiked: false,
        isBookmarked: false,
        createdAt: '2023-09-18T09:45:00Z'
      },
      '6': {
        _id: '6',
        title: 'Naina Devi: The Sacred Hilltop Temple',
        content: `## The Sacred Naina Devi Temple

Perched on a hilltop on the borders with Punjab, Naina Devi is an important Shaktipeeth pilgrimage center in Bilaspur district of Himachal Pradesh. The temple is dedicated to Goddess Naina Devi, an incarnation of Goddess Durga, and holds immense spiritual significance for devotees.

### Historical Origins

The temple's history is deeply rooted in Hindu mythology. Believers hold that as the dead body of Sati dismembered during an all consuming cosmic Tandav dance of Lord Shiva, her eyes (Nain) fell at this sacred place, hence the name Naina Devi. This makes it one of the 51 Shaktipeeths in India, each representing a body part of Goddess Sati.

## Spiritual Significance

Naina Devi Temple is considered one of the Shaktipeeths, making it a highly revered pilgrimage site for devotees of Goddess Shakti. The temple complex also houses shrines dedicated to Lord Shiva and other deities, creating a holistic spiritual environment for visitors. The annual Naina Devi Fair, held during Navratri, attracts thousands of devotees from across the country.

## Architectural Beauty

The temple features traditional North Indian architecture with intricate carvings and vibrant colors. The main sanctum houses the idol of Goddess Naina Devi, adorned with beautiful ornaments and flowers. The temple complex also includes several smaller shrines and a beautiful garden that offers panoramic views of the surrounding valleys and hills.

## Natural Setting

The temple's location on a hilltop provides breathtaking views of the surrounding landscape, including the Gobind Sagar reservoir. The serene environment, combined with the spiritual atmosphere, makes it a perfect destination for meditation and spiritual reflection.`,
        type: 'history',
        summary: 'Explore the ancient history of this important Shaktipeeth pilgrimage center.',
        excerpt: 'Discover the rich history and spiritual significance of Naina Devi Temple...',
        monument: {
          _id: 'm6',
          name: 'Naina Devi Temple',
          location: 'Himachal Pradesh'
        },
        author: {
          _id: 'author-6',
          name: 'Ajay Tiwari',
          avatar: '/placeholder-avatar.jpg'
        },
        mediaAssets: [
          {
            type: 'image',
            url: '/sacred_places/Naina-Devi.jpg',
            caption: 'The sacred Naina Devi Temple on the hilltop'
          }
        ],
        narrator: {
          name: 'Ajay Tiwari',
          voice: 'ai',
          bio: 'Storyteller'
        },
        readingTime: 9,
        audioLength: 11,
        themes: ['history', 'spirituality', 'pilgrimage'],
        difficulty: 'intermediate',
        ageRating: 'all',
        sources: [],
        statistics: {
          views: 9200,
          likes: 680,
          shares: 220,
          bookmarks: 140,
          averageRating: 4.5,
          totalRatings: 140
        },
        relatedStories: [],
        isLiked: false,
        isBookmarked: false,
        createdAt: '2023-10-22T13:15:00Z'
      }
    }

    // Add cultural stories with string IDs
    const culturalStories: Record<string, Story> = {
      'kedarnath-history': mockStories['1'],
      'kedarnath-myths': {
        ...mockStories['1'],
        _id: 'kedarnath-myths',
        title: 'The Legend of Kedarnath',
        content: `## The Divine Legend of Kedarnath

According to the Mahabharata, after the great war of Kurukshetra, the Pandavas sought to atone for their sins by seeking Lord Shiva's blessings. Lord Shiva, not wishing to meet them, took the form of a bull and hid. The Pandavas recognized him and tried to catch him. Lord Shiva then dived into the ground, leaving only his hump visible at Kedarnath. The other parts of his body are believed to have appeared at four other places, forming the Panch Kedar pilgrimage circuit.

## Spiritual Significance

This divine legend is central to the spiritual beliefs of millions of devotees who visit Kedarnath each year. The story represents the eternal dance between the divine and the human, where Lord Shiva tests the devotion of his devotees before revealing himself.

## The Pilgrimage

The journey to Kedarnath itself is considered a test of devotion, requiring pilgrims to trek through challenging mountain terrain. This physical journey is seen as a metaphor for the spiritual journey towards self-realization and union with the divine.`,
        type: 'mythology',
        summary: 'The divine mythological tale of Lord Shiva and the Pandavas',
        themes: ['mythology', 'spirituality', 'pilgrimage']
      },
      'badrinath-history': mockStories['2'],
      'badrinath-beliefs': {
        ...mockStories['2'],
        _id: 'badrinath-beliefs',
        title: 'The Spiritual Beliefs of Badrinath',
        content: `## Spiritual Significance of Badrinath

Badrinath is considered one of the Char Dham pilgrimage sites, along with Yamunotri, Gangotri, and Kedarnath. According to Hindu mythology, Lord Vishnu performed severe penance here in the form of Badri, a berry tree. The temple is also associated with the Pandavas from the Mahabharata, who are believed to have visited this place during their exile.

## The Divine Abode

The spiritual atmosphere of Badrinath is enhanced by its pristine mountain setting and the sacred Alaknanda river that flows nearby. Devotees believe that a visit to this temple can wash away all sins and lead to moksha (liberation).

## Annual Rituals

The temple remains open for six months, from the end of April to the beginning of November. During the winter months, the idol is moved to the Narasimha Temple in Ukhimath for worship. This tradition has been followed for centuries and is an integral part of the temple's spiritual practices.`,
        type: 'belief',
        summary: 'Understanding the deep spiritual significance and beliefs associated with Badrinath',
        themes: ['belief', 'spirituality', 'pilgrimage']
      },
      'ayodhya-history': mockStories['4'],
      'ayodhya-myths': {
        ...mockStories['4'],
        _id: 'ayodhya-myths',
        title: 'The Epic Tale of Lord Rama',
        content: `## The Ramayana Connection

The Ramayana, one of the greatest epics of ancient India, is deeply intertwined with Ayodhya's identity. The story of Lord Rama's birth, his exile, and his eventual return to rule Ayodhya forms the core of the city's spiritual and cultural narrative. The sites associated with various events from the Ramayana, such as the Ram Janmabhoomi, are considered sacred by millions of devotees.

## Divine Birth

According to the epic, Lord Rama was born to King Dasharatha and Queen Kaushalya in Ayodhya. The divine birth is celebrated annually during the festival of Ram Navami, which attracts thousands of devotees from across the world.

## Exile and Return

The story of Rama's 14-year exile and his eventual return to Ayodhya after defeating the demon king Ravana is a tale of dharma (righteousness), duty, and the triumph of good over evil. This narrative continues to inspire millions of people and forms the foundation of Ayodhya's spiritual significance.`,
        type: 'mythology',
        summary: 'The divine story of Lord Rama from the Ramayana',
        themes: ['mythology', 'history', 'spirituality']
      },
      'mathura-history': mockStories['5'],
      'mathura-beliefs': {
        ...mockStories['5'],
        _id: 'mathura-beliefs',
        title: 'The Divine Leelas of Krishna',
        content: `## Spiritual Significance

Mathura is revered as the birthplace of Lord Krishna, one of the most beloved deities in Hinduism. The city is dotted with numerous temples dedicated to Lord Krishna and his childhood associates, making it a major pilgrimage destination for devotees.

## Divine Play

The stories of Krishna's childhood (Bal Leela) and his divine plays (Ras Leela) are central to the spiritual beliefs of devotees. These tales of divine love and playfulness represent the intimate relationship between the devotee and the divine.

## Festivals and Traditions

The city comes alive during festivals like Janmashtami, celebrating Lord Krishna's birth, and Holi, which has special significance in Mathura as it is associated with Lord Krishna's playful activities. These festivals attract thousands of devotees and tourists from around the world.`,
        type: 'belief',
        summary: 'The spiritual beliefs and divine plays of Lord Krishna',
        themes: ['belief', 'spirituality', 'culture']
      },
      'naina-devi-history': mockStories['6'],
      'naina-devi-myths': {
        ...mockStories['6'],
        _id: 'naina-devi-myths',
        title: 'The Legend of Naina Devi',
        content: `## The Divine Legend

Believers hold that as the dead body of Sati dismembered during an all consuming cosmic Tandav dance of Lord Shiva, her eyes (Nain) fell at this sacred place, hence the name Naina Devi. This makes it one of the 51 Shaktipeeths in India, each representing a body part of Goddess Sati.

## Spiritual Significance

This divine legend is central to the spiritual beliefs of millions of devotees who visit Naina Devi Temple each year. The story represents the eternal dance between the divine feminine and masculine energies, where Goddess Sati's sacrifice and Lord Shiva's grief created the sacred geography of India.

## The Pilgrimage

The journey to Naina Devi Temple itself is considered a test of devotion, requiring pilgrims to climb to the hilltop shrine. This physical journey is seen as a metaphor for the spiritual journey towards self-realization and union with the divine feminine.`,
        type: 'mythology',
        summary: 'The divine mythological tale of how goddess Sati\'s eyes fell at this sacred place',
        themes: ['mythology', 'spirituality', 'pilgrimage']
      },
      'chintpurni-history': {
        ...mockStories['6'],
        _id: 'chintpurni-history',
        title: 'The Ancient Chintpurni Temple',
        content: `## The Sacred Chintpurni Temple

A deeply revered Shaktipeeth township, Chintpurni is a major pilgrimage centre that attracts lakhs of people every year. Located in Una district of Himachal Pradesh, this temple is dedicated to Goddess Chintpurni, an incarnation of Goddess Durga.

### Historical Origins

The temple's history is deeply rooted in Hindu mythology. Believers hold that as the dead body of Sati dismembered during an all consuming cosmic Tandav dance of Lord Shiva, her feet (Charan) fell at this sacred place, hence the name Chintpurni. This makes it one of the 51 Shaktipeeths in India.

## Spiritual Significance

Chintpurni Temple is considered one of the Shaktipeeths, making it a highly revered pilgrimage site for devotees of Goddess Shakti. The temple complex also houses shrines dedicated to Lord Shiva and other deities, creating a holistic spiritual environment for visitors.

## Natural Setting

The temple's location provides breathtaking views of the surrounding landscape. The serene environment, combined with the spiritual atmosphere, makes it a perfect destination for meditation and spiritual reflection.`,
        type: 'history',
        summary: 'Discover the rich history of this deeply revered Shaktipeeth township',
        themes: ['history', 'spirituality', 'pilgrimage'],
        monument: {
          _id: 'm7',
          name: 'Chintpurni Temple',
          location: 'Himachal Pradesh'
        }
      },
      'chintpurni-beliefs': {
        ...mockStories['6'],
        _id: 'chintpurni-beliefs',
        title: 'The Spiritual Significance of Chintpurni',
        content: `## Spiritual Beliefs

Believers hold that as the dead body of Sati dismembered during an all consuming cosmic Tandav dance of Lord Shiva, her feet (Charan) fell at this sacred place. This makes Chintpurni one of the 51 Shaktipeeths in India, each representing a body part of Goddess Sati.

## Divine Significance

The temple represents the divine feminine energy and is believed to fulfill the wishes of sincere devotees. The name "Chintpurni" itself means "the one who fulfills all desires."

## The Pilgrimage

The annual Chintpurni Fair, held during Navratri, attracts thousands of devotees from across the country. The spiritual journey to this sacred site is considered highly auspicious and spiritually rewarding.`,
        type: 'belief',
        summary: 'Understanding the deep spiritual beliefs associated with the goddess\'s feet',
        themes: ['belief', 'spirituality', 'pilgrimage'],
        monument: {
          _id: 'm7',
          name: 'Chintpurni Temple',
          location: 'Himachal Pradesh'
        }
      }
    };

    // Merge all stories
    const allStories = { ...mockStories, ...culturalStories };

    // Return the story if it exists, otherwise return the default Kedarnath story
    return allStories[id] || mockStories['1']
  }

  // Mock related stories for different types
  const baseStory = getMockStoryById(storyId)
  const relatedStories: Record<StoryType, Story[]> = {
    history: [baseStory],
    mythology: baseStory._id === '1' || baseStory._id === 'kedarnath-history' ? [{
      _id: 'kedarnath-myths',
      title: 'The Legend of Kedarnath',
      content: `## The Divine Legend of Kedarnath

According to the Mahabharata, after the great war of Kurukshetra, the Pandavas sought to atone for their sins by seeking Lord Shiva's blessings. Lord Shiva, not wishing to meet them, took the form of a bull and hid. The Pandavas recognized him and tried to catch him. Lord Shiva then dived into the ground, leaving only his hump visible at Kedarnath. The other parts of his body are believed to have appeared at four other places, forming the Panch Kedar pilgrimage circuit.

## Spiritual Significance

This divine legend is central to the spiritual beliefs of millions of devotees who visit Kedarnath each year. The story represents the eternal dance between the divine and the human, where Lord Shiva tests the devotion of his devotees before revealing himself.

## The Pilgrimage

The journey to Kedarnath itself is considered a test of devotion, requiring pilgrims to trek through challenging mountain terrain. This physical journey is seen as a metaphor for the spiritual journey towards self-realization and union with the divine.`,
      type: 'mythology',
      summary: 'The divine mythological tale of Lord Shiva and the Pandavas',
      excerpt: 'Explore the rich mythology of the sacred Kedarnath Temple...',
      monument: {
        _id: 'm1',
        name: 'Kedarnath Temple',
        location: 'Uttarakhand'
      },
      author: {
        _id: 'author-1',
        name: 'Ajay Tiwari',
        avatar: '/placeholder-avatar.jpg'
      },
      mediaAssets: [
        {
          type: 'image',
          url: '/sacred_places/Kedarnath.jpg',
          caption: 'The majestic Kedarnath Temple in the Himalayas'
        }
      ],
      narrator: {
        name: 'Ajay Tiwari',
        voice: 'ai',
        bio: 'Storyteller'
      },
      readingTime: 6,
      audioLength: 9,
      themes: ['mythology', 'spirituality', 'pilgrimage'],
      difficulty: 'intermediate',
      ageRating: 'all',
      sources: [],
      statistics: {
        views: 11200,
        likes: 820,
        shares: 210,
        bookmarks: 140,
        averageRating: 4.6,
        totalRatings: 210
      },
      relatedStories: [],
      isLiked: false,
      isBookmarked: false,
      createdAt: '2023-05-20T10:30:00Z'
    }] : baseStory._id === '4' || baseStory._id === 'ayodhya-history' ? [{
      _id: 'ayodhya-myths',
      title: 'The Epic Tale of Lord Rama',
      content: `## The Ramayana Connection

The Ramayana, one of the greatest epics of ancient India, is deeply intertwined with Ayodhya's identity. The story of Lord Rama's birth, his exile, and his eventual return to rule Ayodhya forms the core of the city's spiritual and cultural narrative. The sites associated with various events from the Ramayana, such as the Ram Janmabhoomi, are considered sacred by millions of devotees.

## Divine Birth

According to the epic, Lord Rama was born to King Dasharatha and Queen Kaushalya in Ayodhya. The divine birth is celebrated annually during the festival of Ram Navami, which attracts thousands of devotees from across the world.

## Exile and Return

The story of Rama's 14-year exile and his eventual return to Ayodhya after defeating the demon king Ravana is a tale of dharma (righteousness), duty, and the triumph of good over evil. This narrative continues to inspire millions of people and forms the foundation of Ayodhya's spiritual significance.`,
      type: 'mythology',
      summary: 'The divine story of Lord Rama from the Ramayana',
      excerpt: 'Discover the epic tale of Lord Rama from the Ramayana...',
      monument: {
        _id: 'm4',
        name: 'Ayodhya',
        location: 'Uttar Pradesh'
      },
      author: {
        _id: 'author-4',
        name: 'Ajay Tiwari',
        avatar: '/placeholder-avatar.jpg'
      },
      mediaAssets: [
        {
          type: 'image',
          url: '/sacred_places/Ayodhya.jpg',
          caption: 'The sacred city of Ayodhya on the banks of the Sarayu river'
        }
      ],
      narrator: {
        name: 'Ajay Tiwari',
        voice: 'ai',
        bio: 'Storyteller'
      },
      readingTime: 10,
      audioLength: 15,
      themes: ['mythology', 'history', 'spirituality'],
      difficulty: 'intermediate',
      ageRating: 'all',
      sources: [],
      statistics: {
        views: 16500,
        likes: 1180,
        shares: 320,
        bookmarks: 250,
        averageRating: 4.7,
        totalRatings: 270
      },
      relatedStories: [],
      isLiked: false,
      isBookmarked: false,
      createdAt: '2023-08-15T14:30:00Z'
    }] : baseStory._id === '6' || baseStory._id === 'naina-devi-history' ? [{
      _id: 'naina-devi-myths',
      title: 'The Legend of Naina Devi',
      content: `## The Divine Legend

Believers hold that as the dead body of Sati dismembered during an all consuming cosmic Tandav dance of Lord Shiva, her eyes (Nain) fell at this sacred place, hence the name Naina Devi. This makes it one of the 51 Shaktipeeths in India, each representing a body part of Goddess Sati.

## Spiritual Significance

This divine legend is central to the spiritual beliefs of millions of devotees who visit Naina Devi Temple each year. The story represents the eternal dance between the divine feminine and masculine energies, where Goddess Sati's sacrifice and Lord Shiva's grief created the sacred geography of India.

## The Pilgrimage

The journey to Naina Devi Temple itself is considered a test of devotion, requiring pilgrims to climb to the hilltop shrine. This physical journey is seen as a metaphor for the spiritual journey towards self-realization and union with the divine feminine.`,
      type: 'mythology',
      summary: 'The divine mythological tale of how goddess Sati\'s eyes fell at this sacred place',
      excerpt: 'Explore the divine legend of Goddess Naina Devi...',
      monument: {
        _id: 'm6',
        name: 'Naina Devi Temple',
        location: 'Himachal Pradesh'
      },
      author: {
        _id: 'author-6',
        name: 'Ajay Tiwari',
        avatar: '/placeholder-avatar.jpg'
      },
      mediaAssets: [
        {
          type: 'image',
          url: '/sacred_places/Naina-Devi.jpg',
          caption: 'The sacred Naina Devi Temple on the hilltop'
        }
      ],
      narrator: {
        name: 'Ajay Tiwari',
        voice: 'ai',
        bio: 'Storyteller'
      },
      readingTime: 7,
      audioLength: 10,
      themes: ['mythology', 'spirituality', 'pilgrimage'],
      difficulty: 'intermediate',
      ageRating: 'all',
      sources: [],
      statistics: {
        views: 8500,
        likes: 620,
        shares: 180,
        bookmarks: 120,
        averageRating: 4.4,
        totalRatings: 130
      },
      relatedStories: [],
      isLiked: false,
      isBookmarked: false,
      createdAt: '2023-10-25T13:15:00Z'
    }] : [],
    belief: baseStory._id === '1' || baseStory._id === 'kedarnath-history' ? [{
      _id: 'kedarnath-beliefs',
      title: 'Spiritual Beliefs of Kedarnath',
      content: `## Spiritual Beliefs

Kedarnath is considered one of the holiest shrines in Hinduism. Devotees believe that a visit to this temple can wash away all sins and lead to moksha (liberation). The temple is especially significant during the month of Shravan (July-August) when millions of devotees visit.

## The Spiritual Journey

The spiritual atmosphere of Kedarnath is enhanced by its remote location, which requires a challenging trek through the Himalayas, symbolizing the journey towards spiritual enlightenment. This physical journey is seen as a metaphor for the inner journey towards self-realization.

## Annual Ritual

Every year, the temple undergoes a unique ritual. During the winter months (November to April), the idol is moved to Ukhimath for worship, while a replica is worshipped at Kedarnath during the pilgrimage season (May to October). This tradition has been followed for centuries.`,
      type: 'belief',
      summary: 'Understanding the deep spiritual significance of Kedarnath',
      excerpt: 'Discover the spiritual beliefs associated with Kedarnath...',
      monument: {
        _id: 'm1',
        name: 'Kedarnath Temple',
        location: 'Uttarakhand'
      },
      author: {
        _id: 'author-1',
        name: 'Ajay Tiwari',
        avatar: '/placeholder-avatar.jpg'
      },
      mediaAssets: [
        {
          type: 'image',
          url: '/sacred_places/Kedarnath.jpg',
          caption: 'The majestic Kedarnath Temple in the Himalayas'
        }
      ],
      narrator: {
        name: 'Ajay Tiwari',
        voice: 'ai',
        bio: 'Storyteller'
      },
      readingTime: 5,
      audioLength: 7,
      themes: ['belief', 'spirituality', 'pilgrimage'],
      difficulty: 'beginner',
      ageRating: 'all',
      sources: [],
      statistics: {
        views: 9800,
        likes: 720,
        shares: 190,
        bookmarks: 130,
        averageRating: 4.5,
        totalRatings: 190
      },
      relatedStories: [],
      isLiked: false,
      isBookmarked: false,
      createdAt: '2023-05-18T10:30:00Z'
    }] : baseStory._id === '2' || baseStory._id === 'badrinath-history' ? [{
      _id: 'badrinath-beliefs',
      title: 'The Spiritual Beliefs of Badrinath',
      content: `## Spiritual Significance of Badrinath

Badrinath is considered one of the Char Dham pilgrimage sites, along with Yamunotri, Gangotri, and Kedarnath. According to Hindu mythology, Lord Vishnu performed severe penance here in the form of Badri, a berry tree. The temple is also associated with the Pandavas from the Mahabharata, who are believed to have visited this place during their exile.

## The Divine Abode

The spiritual atmosphere of Badrinath is enhanced by its pristine mountain setting and the sacred Alaknanda river that flows nearby. Devotees believe that a visit to this temple can wash away all sins and lead to moksha (liberation).

## Annual Rituals

The temple remains open for six months, from the end of April to the beginning of November. During the winter months, the idol is moved to the Narasimha Temple in Ukhimath for worship. This tradition has been followed for centuries and is an integral part of the temple's spiritual practices.`,
      type: 'belief',
      summary: 'Understanding the deep spiritual significance and beliefs associated with Badrinath',
      excerpt: 'Explore the spiritual beliefs of Badrinath Temple...',
      monument: {
        _id: 'm2',
        name: 'Badrinath Temple',
        location: 'Uttarakhand'
      },
      author: {
        _id: 'author-2',
        name: 'Ajay Tiwari',
        avatar: '/placeholder-avatar.jpg'
      },
      mediaAssets: [
        {
          type: 'image',
          url: '/sacred_places/Badrinath.jpg',
          caption: 'The majestic Badrinath Temple in the Himalayas'
        }
      ],
      narrator: {
        name: 'Ajay Tiwari',
        voice: 'ai',
        bio: 'Storyteller'
      },
      readingTime: 6,
      audioLength: 8,
      themes: ['belief', 'spirituality', 'pilgrimage'],
      difficulty: 'beginner',
      ageRating: 'all',
      sources: [],
      statistics: {
        views: 8900,
        likes: 650,
        shares: 170,
        bookmarks: 110,
        averageRating: 4.4,
        totalRatings: 140
      },
      relatedStories: [],
      isLiked: false,
      isBookmarked: false,
      createdAt: '2023-06-12T09:15:00Z'
    }] : baseStory._id === '5' || baseStory._id === 'mathura-history' ? [{
      _id: 'mathura-beliefs',
      title: 'The Divine Leelas of Krishna',
      content: `## Spiritual Significance

Mathura is revered as the birthplace of Lord Krishna, one of the most beloved deities in Hinduism. The city is dotted with numerous temples dedicated to Lord Krishna and his childhood associates, making it a major pilgrimage destination for devotees.

## Divine Play

The stories of Krishna's childhood (Bal Leela) and his divine plays (Ras Leela) are central to the spiritual beliefs of devotees. These tales of divine love and playfulness represent the intimate relationship between the devotee and the divine.

## Festivals and Traditions

The city comes alive during festivals like Janmashtami, celebrating Lord Krishna's birth, and Holi, which has special significance in Mathura as it is associated with Lord Krishna's playful activities. These festivals attract thousands of devotees and tourists from around the world.`,
      type: 'belief',
      summary: 'The spiritual beliefs and divine plays of Lord Krishna',
      excerpt: 'Discover the divine leelas of Lord Krishna...',
      monument: {
        _id: 'm5',
        name: 'Mathura',
        location: 'Uttar Pradesh'
      },
      author: {
        _id: 'author-5',
        name: 'Ajay Tiwari',
        avatar: '/placeholder-avatar.jpg'
      },
      mediaAssets: [
        {
          type: 'image',
          url: '/sacred_places/Mathura.jpg',
          caption: 'The sacred city of Mathura on the banks of the Yamuna river'
        }
      ],
      narrator: {
        name: 'Ajay Tiwari',
        voice: 'ai',
        bio: 'Storyteller'
      },
      readingTime: 7,
      audioLength: 10,
      themes: ['belief', 'spirituality', 'culture'],
      difficulty: 'beginner',
      ageRating: 'all',
      sources: [],
      statistics: {
        views: 15200,
        likes: 1080,
        shares: 290,
        bookmarks: 220,
        averageRating: 4.6,
        totalRatings: 240
      },
      relatedStories: [],
      isLiked: false,
      isBookmarked: false,
      createdAt: '2023-09-20T09:45:00Z'
    }] : baseStory._id === '6' || baseStory._id === 'chintpurni-history' ? [{
      _id: 'chintpurni-beliefs',
      title: 'The Spiritual Significance of Chintpurni',
      content: `## Spiritual Beliefs

Believers hold that as the dead body of Sati dismembered during an all consuming cosmic Tandav dance of Lord Shiva, her feet (Charan) fell at this sacred place. This makes Chintpurni one of the 51 Shaktipeeths in India, each representing a body part of Goddess Sati.

## Divine Significance

The temple represents the divine feminine energy and is believed to fulfill the wishes of sincere devotees. The name "Chintpurni" itself means "the one who fulfills all desires."

## The Pilgrimage

The annual Chintpurni Fair, held during Navratri, attracts thousands of devotees from across the country. The spiritual journey to this sacred site is considered highly auspicious and spiritually rewarding.`,
      type: 'belief',
      summary: 'Understanding the deep spiritual beliefs associated with the goddess\'s feet',
      excerpt: 'Explore the spiritual significance of Chintpurni Temple...',
      monument: {
        _id: 'm7',
        name: 'Chintpurni Temple',
        location: 'Himachal Pradesh'
      },
      author: {
        _id: 'author-6',
        name: 'Ajay Tiwari',
        avatar: '/placeholder-avatar.jpg'
      },
      mediaAssets: [
        {
          type: 'image',
          url: '/images/chintpurni.jpg',
          caption: 'The sacred Chintpurni Temple on the hilltop'
        }
      ],
      narrator: {
        name: 'Ajay Tiwari',
        voice: 'ai',
        bio: 'Storyteller'
      },
      readingTime: 6,
      audioLength: 8,
      themes: ['belief', 'spirituality', 'pilgrimage'],
      difficulty: 'beginner',
      ageRating: 'all',
      sources: [],
      statistics: {
        views: 7800,
        likes: 580,
        shares: 160,
        bookmarks: 110,
        averageRating: 4.3,
        totalRatings: 120
      },
      relatedStories: [],
      isLiked: false,
      isBookmarked: false,
      createdAt: '2023-10-24T13:15:00Z'
    }] : [],
    horror: [],
    folklore: [],
    legend: []
  }

  // Get available story types
  const availableTypes = Object.keys(relatedStories).filter(
    type => relatedStories[type as StoryType].length > 0
  ) as StoryType[]

  useEffect(() => {
    const load = async () => {
      try {
        // If the route param looks like a MongoDB ObjectId, fetch from backend
        if (/^[a-f0-9]{24}$/i.test(storyId)) {
          try {
            const response = await fetch(`/api/stories/${storyId}`)
            const json = await response.json()
            if (json.success && json.data) {
              const s = json.data
              const mapped: Story = {
                _id: s._id,
                title: s.title,
                content: s.content,
                type: s.type,
                summary: s.summary,
                excerpt: s.excerpt,
                monument: {
                  _id: s.monument?._id || '',
                  name: s.monument?.name || '',
                  location: s.monument?.location?.state || ''
                },
                author: {
                  _id: s.author?._id || '',
                  name: s.author?.name || 'Darshana',
                  avatar: s.author?.avatar || '/placeholder-avatar.jpg'
                },
                mediaAssets: (s.mediaAssets || []).map((m: any) => ({
                  type: m.type,
                  url: m.url,
                  caption: m.caption || ''
                })),
                narrator: {
                  name: s.narrator?.name || 'Narad AI',
                  voice: s.narrator?.voice || 'ai',
                  bio: s.narrator?.bio || ''
                },
                readingTime: s.readingTime || 5,
                audioLength: s.audioLength || 0,
                themes: s.themes || [],
                difficulty: s.difficulty || 'beginner',
                ageRating: s.ageRating || 'all',
                sources: s.sources || [],
                statistics: {
                  views: s.statistics?.views || 0,
                  likes: s.statistics?.likes || 0,
                  shares: s.statistics?.shares || 0,
                  bookmarks: s.statistics?.bookmarks || 0,
                  averageRating: s.statistics?.averageRating || 0,
                  totalRatings: s.statistics?.totalRatings || 0
                },
                relatedStories: (s.relatedStories || []).map((r: any) => ({
                  _id: r._id,
                  title: r.title,
                  type: r.type,
                  summary: r.summary
                })),
                isLiked: false,
                isBookmarked: false,
                createdAt: s.createdAt
              }
              setStory(mapped)
              setLoading(false)
              return
            }
          } catch (e) {
            console.error('Failed to load story from backend, falling back to mock', e)
          }
        }
      } catch (e) {
        console.error('Failed to load story from backend, falling back to mock', e)
      }

      // Fallback to local content for non-ObjectId slugs
      const fallback = getMockStoryById(storyId)
      setStory(fallback)
      setLoading(false)
    }
    load()
  }, [storyId])

  // Track view when story is loaded
  useEffect(() => {
    if (story && /^[a-f0-9]{24}$/i.test(storyId)) {
      // Send view tracking request
      fetch(`/api/stories/${storyId}/view`, {
        method: 'POST'
      }).catch(err => {
        console.error('Failed to track view:', err)
      })
    }
  }, [story, storyId])

  const toggleLike = async () => {
    if (story) {
      try {
        const response = await fetch(`/api/stories/${story._id}/like`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        const data = await response.json();
        
        if (data.success) {
          setStory({
            ...story,
            isLiked: data.liked,
            statistics: {
              ...story.statistics,
              likes: data.liked ? story.statistics.likes + 1 : story.statistics.likes - 1
            }
          });
        }
      } catch (error) {
        console.error('Failed to toggle like:', error);
      }
    }
  }

  const toggleBookmark = async () => {
    if (story) {
      try {
        const response = await fetch(`/api/stories/${story._id}/bookmark`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        const data = await response.json();
        
        if (data.success) {
          setStory({
            ...story,
            isBookmarked: data.bookmarked,
            statistics: {
              ...story.statistics,
              bookmarks: data.bookmarked ? story.statistics.bookmarks + 1 : story.statistics.bookmarks - 1
            }
          });
        }
      } catch (error) {
        console.error('Failed to toggle bookmark:', error);
      }
    }
  }

  const shareStory = () => {
    if (navigator.share) {
      navigator.share({
        title: story?.title,
        text: story?.summary,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  const switchStoryType = (newType: StoryType) => {
    if (newType !== activeStoryType) {
      setDirection(newType > activeStoryType ? 1 : -1)
      setActiveStoryType(newType)
    }
  }

  const formatReadingTime = (minutes: number) => {
    return `${minutes} min read`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Story not found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/stories" className="btn-primary">
            Back to Stories
          </Link>
        </div>
      </div>
    )
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Story not found</h2>
          <Link href="/stories" className="btn-primary">
            Back to Stories
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Cultural Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23d97706' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link 
          href="/stories" 
          className="flex items-center text-amber-700 hover:text-amber-900 mb-8 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Stories
        </Link>

        {/* Story Type Switcher with Animation */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Explore Different Perspectives</h2>
          <StoryTypeSwitcher 
            activeType={activeStoryType}
            onTypeChange={switchStoryType}
            availableTypes={availableTypes}
          />
        </div>

        {/* Animated Story Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Story Header */}
          <div className="relative">
            <div className="h-64 bg-gradient-to-r from-amber-500 to-orange-600 relative overflow-hidden">
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <h1 className="text-3xl md:text-4xl font-bold text-white text-center px-4">
                  {relatedStories[activeStoryType][0]?.title || story.title}
                </h1>
              </div>
            </div>
            
            {/* Story Stats */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-3 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-gray-700">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      <span className="text-sm">{formatReadingTime(story.readingTime)}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <UserIcon className="h-4 w-4 mr-1" />
                      <span className="text-sm">{story.narrator.name}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={toggleLike}
                      className={`p-2 rounded-full ${story.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                    >
                      {story.isLiked ? (
                        <HeartSolidIcon className="h-5 w-5" />
                      ) : (
                        <HeartIcon className="h-5 w-5" />
                      )}
                    </button>
                    <button 
                      onClick={toggleBookmark}
                      className={`p-2 rounded-full ${story.isBookmarked ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'}`}
                    >
                      {story.isBookmarked ? (
                        <BookmarkSolidIcon className="h-5 w-5" />
                      ) : (
                        <BookmarkIcon className="h-5 w-5" />
                      )}
                    </button>
                    <button 
                      onClick={shareStory}
                      className="p-2 rounded-full text-gray-500 hover:text-amber-600"
                    >
                      <ShareIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Story Content */}
          <div className="p-6 md:p-8">
            <AnimatedStoryContent 
              content={relatedStories[activeStoryType][0]?.content || story.content}
              direction={direction}
            />
            
            {/* Story Metadata */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center">
                  <img 
                    src={story.author.avatar} 
                    alt={story.author.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="ml-4">
                    <p className="font-medium text-gray-900">{story.author.name}</p>
                    <p className="text-sm text-gray-500">Author</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>{new Date(story.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{story.statistics.views.toLocaleString()} views</span>
                  <span>•</span>
                  <span>{story.statistics.likes} likes</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Stories */}
        {story.relatedStories.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {story.relatedStories.map((relatedStory) => (
                <Link 
                  key={relatedStory._id}
                  href={`/stories/${relatedStory._id}`}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
                >
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">{relatedStory.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{relatedStory.summary}</p>
                  <div className="flex items-center text-amber-600 text-sm font-medium">
                    <span>Read story</span>
                    <ChevronRightIcon className="h-4 w-4 ml-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default StoryDetailPage