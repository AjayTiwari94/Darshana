'use client'

import React, { useState, useEffect } from 'react'
import { 
  TrophyIcon,
  MapPinIcon,
  ClockIcon,
  UsersIcon,
  StarIcon,
  PlayIcon,
  PauseIcon,
  CheckCircleIcon,
  LightBulbIcon,
  PhotoIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'

interface Quest {
  _id: string
  title: string
  description: string
  type: string
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert'
  category: string
  objectives: Array<{
    id: string
    title: string
    description: string
    type: string
    points: number
  }>
  rewards: {
    points: number
    badges: string[]
    experiencePoints: number
  }
  timeLimit: number | null
  statistics: {
    totalParticipants: number
    completedCount: number
    averageRating: number
  }
  userProgress?: {
    status: string
    progressPercentage: number
    completedObjectives: number
    totalObjectives: number
    totalPointsEarned: number
  }
}

interface TreasureHunt {
  _id: string
  title: string
  description: string
  theme: string
  difficulty: string
  estimatedDuration: number
  rewards: {
    points: number
    badges: string[]
    prizes: Array<{
      name: string
      description: string
    }>
  }
  schedule: {
    startDate: string
    endDate: string
  }
  statistics: {
    totalParticipants: number
    completedParticipants: number
  }
  status: 'upcoming' | 'active' | 'ended'
  isRegistered?: boolean
}

const GamificationHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'quests' | 'hunts' | 'leaderboard'>('quests')
  const [quests, setQuests] = useState<Quest[]>([])
  const [treasureHunts, setTreasureHunts] = useState<TreasureHunt[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDifficulty, setSelectedDifficulty] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [questsRes, huntsRes] = await Promise.all([
        fetch('/api/quests'),
        fetch('/api/treasure-hunts')
      ])

      const [questsData, huntsData] = await Promise.all([
        questsRes.json(),
        huntsRes.json()
      ])

      if (questsData.success) setQuests(questsData.data)
      if (huntsData.success) setTreasureHunts(huntsData.data)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const startQuest = async (questId: string) => {
    try {
      const response = await fetch(`/api/quests/${questId}/start`, {
        method: 'POST'
      })
      
      if (response.ok) {
        fetchData() // Refresh data
      }
    } catch (error) {
      console.error('Failed to start quest:', error)
    }
  }

  const registerForHunt = async (huntId: string) => {
    try {
      const response = await fetch(`/api/treasure-hunts/${huntId}/register`, {
        method: 'POST'
      })
      
      if (response.ok) {
        fetchData() // Refresh data
      }
    } catch (error) {
      console.error('Failed to register for hunt:', error)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100'
      case 'Medium': return 'text-yellow-600 bg-yellow-100'
      case 'Hard': return 'text-orange-600 bg-orange-100'
      case 'Expert': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100'
      case 'upcoming': return 'text-blue-600 bg-blue-100'
      case 'ended': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getObjectiveIcon = (type: string) => {
    switch (type) {
      case 'visit': return <MapPinIcon className="h-4 w-4" />
      case 'photo': return <PhotoIcon className="h-4 w-4" />
      case 'answer': return <QuestionMarkCircleIcon className="h-4 w-4" />
      default: return <CheckCircleIcon className="h-4 w-4" />
    }
  }

  const filteredQuests = quests.filter(quest => {
    const matchesDifficulty = !selectedDifficulty || quest.difficulty === selectedDifficulty
    const matchesCategory = !selectedCategory || quest.category === selectedCategory
    return matchesDifficulty && matchesCategory
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Adventure & Quests
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Embark on exciting quests and treasure hunts to discover India's heritage.
            Earn points, unlock badges, and compete with fellow explorers!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <TrophyIcon className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">0</p>
            <p className="text-sm text-gray-600">Completed Quests</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <StarIcon className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">0</p>
            <p className="text-sm text-gray-600">Total Points</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <MapPinIcon className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">0</p>
            <p className="text-sm text-gray-600">Badges Earned</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <UsersIcon className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">-</p>
            <p className="text-sm text-gray-600">Leaderboard Rank</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('quests')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'quests'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Daily Quests
              </button>
              <button
                onClick={() => setActiveTab('hunts')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'hunts'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Treasure Hunts
              </button>
              <button
                onClick={() => setActiveTab('leaderboard')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'leaderboard'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Leaderboard
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'quests' && (
              <div>
                {/* Filters */}
                <div className="flex flex-wrap gap-4 mb-6">
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">All Difficulties</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                    <option value="Expert">Expert</option>
                  </select>
                  
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">All Categories</option>
                    <option value="Historical">Historical</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Archaeological">Archaeological</option>
                    <option value="Architectural">Architectural</option>
                    <option value="Mythological">Mythological</option>
                  </select>
                </div>

                {/* Quests Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredQuests.map(quest => (
                    <div key={quest._id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {quest.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-3">
                              {quest.description}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quest.difficulty)}`}>
                            {quest.difficulty}
                          </span>
                        </div>

                        {/* Objectives Preview */}
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Objectives:</h4>
                          <div className="space-y-1">
                            {quest.objectives.slice(0, 3).map(objective => (
                              <div key={objective.id} className="flex items-center text-sm text-gray-600">
                                {getObjectiveIcon(objective.type)}
                                <span className="ml-2">{objective.title}</span>
                                <span className="ml-auto text-orange-600 font-medium">
                                  +{objective.points}
                                </span>
                              </div>
                            ))}
                            {quest.objectives.length > 3 && (
                              <div className="text-xs text-gray-500">
                                +{quest.objectives.length - 3} more objectives
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Progress Bar (if user has started) */}
                        {quest.userProgress && (
                          <div className="mb-4">
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                              <span>Progress</span>
                              <span>{quest.userProgress.completedObjectives}/{quest.userProgress.totalObjectives}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-orange-600 h-2 rounded-full transition-all"
                                style={{ width: `${quest.userProgress.progressPercentage}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {/* Rewards */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center text-gray-600">
                              <TrophyIcon className="h-4 w-4 mr-1" />
                              <span>{quest.rewards.points} points</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <StarIcon className="h-4 w-4 mr-1" />
                              <span>{quest.rewards.experiencePoints} XP</span>
                            </div>
                          </div>
                        </div>

                        {/* Quest Stats */}
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                          <span>{quest.statistics.totalParticipants} participants</span>
                          <div className="flex items-center">
                            <StarSolidIcon className="h-3 w-3 text-yellow-400 mr-1" />
                            <span>{quest.statistics.averageRating.toFixed(1)}</span>
                          </div>
                        </div>

                        {/* Action Button */}
                        <button
                          onClick={() => startQuest(quest._id)}
                          disabled={quest.userProgress?.status === 'completed'}
                          className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
                            quest.userProgress?.status === 'completed'
                              ? 'bg-green-100 text-green-700 cursor-not-allowed'
                              : quest.userProgress
                              ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                              : 'bg-orange-600 text-white hover:bg-orange-700'
                          }`}
                        >
                          {quest.userProgress?.status === 'completed' ? (
                            <>
                              <CheckCircleIcon className="h-4 w-4 inline mr-2" />
                              Completed
                            </>
                          ) : quest.userProgress ? (
                            <>
                              <PlayIcon className="h-4 w-4 inline mr-2" />
                              Continue Quest
                            </>
                          ) : (
                            <>
                              <PlayIcon className="h-4 w-4 inline mr-2" />
                              Start Quest
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'hunts' && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {treasureHunts.map(hunt => (
                    <div key={hunt._id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                              {hunt.title}
                            </h3>
                            <p className="text-gray-600 mb-3">
                              {hunt.description}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className="flex items-center">
                                <ClockIcon className="h-4 w-4 mr-1" />
                                {hunt.estimatedDuration} min
                              </span>
                              <span className="flex items-center">
                                <UsersIcon className="h-4 w-4 mr-1" />
                                {hunt.statistics.totalParticipants} joined
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(hunt.difficulty)}`}>
                              {hunt.difficulty}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(hunt.status)}`}>
                              {hunt.status}
                            </span>
                          </div>
                        </div>

                        {/* Schedule */}
                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                          <div className="text-sm text-gray-600">
                            <div>Start: {new Date(hunt.schedule.startDate).toLocaleDateString()}</div>
                            <div>End: {new Date(hunt.schedule.endDate).toLocaleDateString()}</div>
                          </div>
                        </div>

                        {/* Rewards Preview */}
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Rewards:</h4>
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>{hunt.rewards.points} points</span>
                            <span>{hunt.rewards.badges.length} badges</span>
                            <span>{hunt.rewards.prizes.length} prizes</span>
                          </div>
                        </div>

                        {/* Action Button */}
                        <button
                          onClick={() => registerForHunt(hunt._id)}
                          disabled={hunt.status === 'ended' || hunt.isRegistered}
                          className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
                            hunt.status === 'ended'
                              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                              : hunt.isRegistered
                              ? 'bg-green-100 text-green-700 cursor-not-allowed'
                              : 'bg-orange-600 text-white hover:bg-orange-700'
                          }`}
                        >
                          {hunt.status === 'ended' ? (
                            'Hunt Ended'
                          ) : hunt.isRegistered ? (
                            'Already Registered'
                          ) : hunt.status === 'upcoming' ? (
                            'Register Now'
                          ) : (
                            'Join Hunt'
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'leaderboard' && (
              <div className="text-center py-12">
                <TrophyIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Leaderboard Coming Soon</h3>
                <p className="text-gray-500">Complete quests and treasure hunts to see your ranking!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GamificationHub