'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeftIcon,
  TrophyIcon,
  MapPinIcon,
  ClockIcon,
  StarIcon,
  CheckCircleIcon,
  LockClosedIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import PageTransition from '@/components/common/PageTransition'

interface TreasureHunt {
  id: string
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  duration: string
  rewards: number
  monument: string
  totalClues: number
  completedClues: number
  status: 'locked' | 'available' | 'in-progress' | 'completed'
  unlockRequirement?: string
}

interface Clue {
  id: string
  huntId: string
  clueNumber: number
  type: 'riddle' | 'myth' | 'folklore' | 'history'
  question: string
  hint?: string
  options: string[]
  correctAnswer: number
  explanation: string
  points: number
}

const TreasureHuntPage: React.FC = () => {
  const [selectedHunt, setSelectedHunt] = useState<TreasureHunt | null>(null)
  const [currentClue, setCurrentClue] = useState<Clue | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [totalPoints, setTotalPoints] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [completedClues, setCompletedClues] = useState<Set<string>>(new Set())

  const treasureHunts: TreasureHunt[] = [
    {
      id: 'taj-mystery',
      title: 'Mysteries of the Taj Mahal',
      description: 'Uncover the hidden secrets and untold stories behind the monument of love',
      difficulty: 'easy',
      duration: '20-30 min',
      rewards: 500,
      monument: 'Taj Mahal',
      totalClues: 5,
      completedClues: 0,
      status: 'available'
    },
    {
      id: 'red-fort-legends',
      title: 'Legends of the Red Fort',
      description: 'Discover the myths and folklore surrounding the mighty Mughal fortress',
      difficulty: 'medium',
      duration: '30-40 min',
      rewards: 750,
      monument: 'Red Fort',
      totalClues: 7,
      completedClues: 0,
      status: 'available'
    },
    {
      id: 'bhangarh-curse',
      title: 'Curse of Bhangarh',
      description: 'Dare to explore India\'s most haunted fort and its dark secrets',
      difficulty: 'hard',
      duration: '40-60 min',
      rewards: 1000,
      monument: 'Bhangarh Fort',
      totalClues: 10,
      completedClues: 0,
      status: 'available'
    },
    {
      id: 'hampi-lost-treasure',
      title: 'Lost Treasure of Hampi',
      description: 'Follow the trail of the Vijayanagara Empire\'s hidden riches',
      difficulty: 'hard',
      duration: '45-60 min',
      rewards: 1200,
      monument: 'Hampi',
      totalClues: 12,
      completedClues: 0,
      status: 'locked',
      unlockRequirement: 'Complete 3 treasure hunts'
    }
  ]

  const cluesDatabase: Clue[] = [
    {
      id: 'taj-1',
      huntId: 'taj-mystery',
      clueNumber: 1,
      type: 'riddle',
      question: 'I stand guard at four corners, tall and proud. My head touches the sky, adorned with gold. What am I?',
      hint: 'Look at the corners of the Taj Mahal complex',
      options: ['The main dome', 'The minarets', 'The entrance gates', 'The gardens'],
      correctAnswer: 1,
      explanation: 'The four minarets stand at the corners of the Taj Mahal platform, each over 40 meters tall and topped with a golden finial.',
      points: 100
    },
    {
      id: 'taj-2',
      huntId: 'taj-mystery',
      clueNumber: 2,
      type: 'myth',
      question: 'According to legend, what did Shah Jahan plan to build across the Yamuna River?',
      hint: 'Think about symmetry and opposites',
      options: [
        'A palace for himself',
        'A black marble mausoleum',
        'A grand mosque',
        'A bridge connecting both banks'
      ],
      correctAnswer: 1,
      explanation: 'Legend says Shah Jahan wanted to build a black marble mausoleum for himself across the river, connected to the Taj Mahal by a bridge.',
      points: 100
    },
    {
      id: 'taj-3',
      huntId: 'taj-mystery',
      clueNumber: 3,
      type: 'history',
      question: 'How many years did it take to complete the Taj Mahal?',
      hint: 'It was built during Shah Jahan\'s reign',
      options: ['10 years', '15 years', '22 years', '30 years'],
      correctAnswer: 2,
      explanation: 'The Taj Mahal took approximately 22 years to complete (1632-1653), employing over 20,000 artisans.',
      points: 100
    },
    {
      id: 'red-fort-1',
      huntId: 'red-fort-legends',
      clueNumber: 1,
      type: 'folklore',
      question: 'According to folklore, what is hidden beneath the Red Fort?',
      hint: 'Something valuable that many have searched for',
      options: [
        'A secret tunnel to Agra',
        'Treasure and gold',
        'Ancient weapons',
        'A underground river'
      ],
      correctAnswer: 1,
      explanation: 'Local folklore speaks of hidden treasures buried beneath the Red Fort, though none have been officially discovered.',
      points: 150
    },
    {
      id: 'red-fort-2',
      huntId: 'red-fort-legends',
      clueNumber: 2,
      type: 'myth',
      question: 'Which Mughal emperor is said to haunt the fort as a ghost?',
      hint: 'The last Mughal emperor who died in exile',
      options: [
        'Akbar',
        'Shah Jahan',
        'Bahadur Shah Zafar',
        'Aurangzeb'
      ],
      correctAnswer: 2,
      explanation: 'Bahadur Shah Zafar, the last Mughal emperor, is said to haunt the fort. He was exiled to Burma after the 1857 rebellion.',
      points: 150
    },
    {
      id: 'bhangarh-1',
      huntId: 'bhangarh-curse',
      clueNumber: 1,
      type: 'folklore',
      question: 'What was the name of the beautiful princess who rejected the tantric\'s love?',
      hint: 'Her name means "jewel of prosperity"',
      options: ['Ratnavati', 'Padmavati', 'Roopmati', 'Taramati'],
      correctAnswer: 0,
      explanation: 'Princess Ratnavati was known for her exceptional beauty, which led to the tantric Singhia\'s obsession and the eventual curse.',
      points: 200
    },
    {
      id: 'bhangarh-2',
      huntId: 'bhangarh-curse',
      clueNumber: 2,
      type: 'myth',
      question: 'What happens according to the curse after sunset at Bhangarh?',
      hint: 'Even ASI has placed restrictions',
      options: [
        'The fort gates close automatically',
        'No one can survive the night',
        'Spirits become active',
        'All electronic devices fail'
      ],
      correctAnswer: 2,
      explanation: 'According to the curse, spirits roam the fort after sunset. The ASI prohibits entry after sunset and before sunrise.',
      points: 200
    }
  ]

  useEffect(() => {
    // Load completed clues from localStorage
    const saved = localStorage.getItem('completedClues')
    if (saved) {
      setCompletedClues(new Set(JSON.parse(saved)))
    }
    
    // Load total points
    const savedPoints = localStorage.getItem('treasureHuntPoints')
    if (savedPoints) {
      setTotalPoints(parseInt(savedPoints))
    }
  }, [])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'hard':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const startHunt = (hunt: TreasureHunt) => {
    if (hunt.status === 'locked') return
    
    setSelectedHunt(hunt)
    // Load first clue
    const firstClue = cluesDatabase.find(c => c.huntId === hunt.id && c.clueNumber === 1)
    setCurrentClue(firstClue || null)
    setSelectedAnswer(null)
    setShowResult(false)
    setShowHint(false)
  }

  const submitAnswer = () => {
    if (selectedAnswer === null || !currentClue) return

    const correct = selectedAnswer === currentClue.correctAnswer
    setIsCorrect(correct)
    setShowResult(true)

    if (correct) {
      const newPoints = totalPoints + currentClue.points
      setTotalPoints(newPoints)
      localStorage.setItem('treasureHuntPoints', newPoints.toString())
      
      // Mark clue as completed
      const newCompleted = new Set(completedClues)
      newCompleted.add(currentClue.id)
      setCompletedClues(newCompleted)
      localStorage.setItem('completedClues', JSON.stringify(Array.from(newCompleted)))
    }
  }

  const nextClue = () => {
    if (!currentClue || !selectedHunt) return

    const nextClueNumber = currentClue.clueNumber + 1
    const nextClueData = cluesDatabase.find(
      c => c.huntId === selectedHunt.id && c.clueNumber === nextClueNumber
    )

    if (nextClueData) {
      setCurrentClue(nextClueData)
      setSelectedAnswer(null)
      setShowResult(false)
      setShowHint(false)
    } else {
      // Hunt completed
      alert(`🎉 Congratulations! You've completed the treasure hunt and earned ${selectedHunt.rewards} points!`)
      setSelectedHunt(null)
      setCurrentClue(null)
    }
  }

  const exitHunt = () => {
    setSelectedHunt(null)
    setCurrentClue(null)
    setSelectedAnswer(null)
    setShowResult(false)
    setShowHint(false)
  }

  if (selectedHunt && currentClue) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 relative overflow-hidden">
          {/* Ambient effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-yellow-300 opacity-20"
                style={{
                  width: Math.random() * 4 + 2,
                  height: Math.random() * 4 + 2,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={exitHunt}
                className="flex items-center text-white hover:text-yellow-300 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Exit Hunt
              </button>
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-yellow-500 rounded-full px-4 py-2">
                  <StarIcon className="h-5 w-5 text-white mr-2" />
                  <span className="font-bold text-white">{totalPoints} pts</span>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-semibold">{selectedHunt.title}</h3>
                <span className="text-yellow-300">
                  Clue {currentClue.clueNumber} / {selectedHunt.totalClues}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(currentClue.clueNumber / selectedHunt.totalClues) * 100}%` }}
                />
              </div>
            </div>

            {/* Clue Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Clue Type Badge */}
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <SparklesIcon className="h-6 w-6 text-yellow-300 mr-2" />
                    <span className="text-white font-semibold capitalize">
                      {currentClue.type} Challenge
                    </span>
                  </div>
                  <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                    {currentClue.points} points
                  </span>
                </div>
              </div>

              <div className="p-8">
                {/* Question */}
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {currentClue.question}
                </h2>

                {/* Hint */}
                {currentClue.hint && (
                  <div className="mb-6">
                    <button
                      onClick={() => setShowHint(!showHint)}
                      className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                    >
                      {showHint ? '🙈 Hide Hint' : '💡 Show Hint'}
                    </button>
                    {showHint && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-2 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded"
                      >
                        <p className="text-gray-700">{currentClue.hint}</p>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* Options */}
                <div className="space-y-3 mb-6">
                  {currentClue.options.map((option, index) => (
                    <motion.button
                      key={index}
                      onClick={() => !showResult && setSelectedAnswer(index)}
                      disabled={showResult}
                      whileHover={!showResult ? { scale: 1.02 } : {}}
                      whileTap={!showResult ? { scale: 0.98 } : {}}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                        showResult
                          ? index === currentClue.correctAnswer
                            ? 'bg-green-100 border-green-500'
                            : index === selectedAnswer
                            ? 'bg-red-100 border-red-500'
                            : 'bg-gray-50 border-gray-200'
                          : selectedAnswer === index
                          ? 'bg-purple-100 border-purple-500'
                          : 'bg-white border-gray-300 hover:border-purple-400'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-semibold mr-3">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="font-medium text-gray-800">{option}</span>
                        {showResult && index === currentClue.correctAnswer && (
                          <CheckCircleIcon className="h-6 w-6 text-green-600 ml-auto" />
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Result */}
                <AnimatePresence>
                  {showResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`p-6 rounded-xl mb-6 ${
                        isCorrect ? 'bg-green-50 border-2 border-green-300' : 'bg-red-50 border-2 border-red-300'
                      }`}
                    >
                      <div className="flex items-start">
                        {isCorrect ? (
                          <CheckCircleIcon className="h-8 w-8 text-green-600 mr-3 flex-shrink-0" />
                        ) : (
                          <div className="h-8 w-8 text-red-600 mr-3 flex-shrink-0 text-2xl">✗</div>
                        )}
                        <div>
                          <h3 className={`font-bold text-lg mb-2 ${isCorrect ? 'text-green-900' : 'text-red-900'}`}>
                            {isCorrect ? '🎉 Correct!' : '❌ Incorrect'}
                          </h3>
                          <p className="text-gray-700">{currentClue.explanation}</p>
                          {isCorrect && (
                            <p className="mt-2 font-semibold text-green-700">
                              +{currentClue.points} points earned!
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {!showResult ? (
                    <button
                      onClick={submitAnswer}
                      disabled={selectedAnswer === null}
                      className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                        selectedAnswer !== null
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Submit Answer
                    </button>
                  ) : (
                    <button
                      onClick={nextClue}
                      className="flex-1 py-3 px-6 rounded-xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg transition-all"
                    >
                      {currentClue.clueNumber < selectedHunt.totalClues ? 'Next Clue →' : 'Complete Hunt 🎉'}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 via-rose-50 to-orange-50 relative overflow-hidden">
        {/* Ambient background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-purple-300 to-pink-300 opacity-20"
              style={{
                width: Math.random() * 200 + 100,
                height: Math.random() * 200 + 100,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -50, 0],
                x: [0, Math.random() * 50 - 25, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: Math.random() * 10 + 10, repeat: Infinity }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-6">
              <TrophyIcon className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-700 via-fuchsia-600 to-orange-600 bg-clip-text text-transparent mb-4">
              Treasure Hunt
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Embark on thrilling adventures through India's cultural heritage. Solve riddles,
              uncover myths, and earn rewards as you explore!
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Points</p>
                  <p className="text-3xl font-bold text-purple-600">{totalPoints}</p>
                </div>
                <StarIcon className="h-12 w-12 text-yellow-500" />
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Hunts Completed</p>
                  <p className="text-3xl font-bold text-green-600">{completedClues.size > 0 ? Math.floor(completedClues.size / 5) : 0}</p>
                </div>
                <CheckCircleIcon className="h-12 w-12 text-green-500" />
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Available Hunts</p>
                  <p className="text-3xl font-bold text-indigo-600">{treasureHunts.filter(h => h.status === 'available').length}</p>
                </div>
                <MapPinIcon className="h-12 w-12 text-indigo-500" />
              </div>
            </div>
          </motion.div>

          {/* Treasure Hunts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {treasureHunts.map((hunt, index) => (
              <motion.div
                key={hunt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index + 1) }}
                className={`bg-white rounded-3xl shadow-xl overflow-hidden ${
                  hunt.status === 'locked' ? 'opacity-70' : 'hover:shadow-2xl'
                } transition-all duration-300`}
              >
                {/* Header */}
                <div className={`h-2 bg-gradient-to-r ${
                  hunt.difficulty === 'easy' 
                    ? 'from-green-400 to-emerald-500'
                    : hunt.difficulty === 'medium'
                    ? 'from-yellow-400 to-orange-500'
                    : 'from-red-400 to-pink-500'
                }`} />

                <div className="p-6">
                  {/* Title & Status */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                        {hunt.title}
                        {hunt.status === 'locked' && <LockClosedIcon className="h-6 w-6 text-gray-400" />}
                      </h3>
                      <p className="text-gray-600">{hunt.description}</p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex flex-wrap gap-3 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(hunt.difficulty)}`}>
                      {hunt.difficulty}
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {hunt.duration}
                    </span>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium flex items-center">
                      <StarIcon className="h-4 w-4 mr-1" />
                      {hunt.rewards} pts
                    </span>
                  </div>

                  {/* Monument */}
                  <div className="flex items-center text-gray-700 mb-4">
                    <MapPinIcon className="h-5 w-5 mr-2 text-purple-600" />
                    <span>{hunt.monument}</span>
                  </div>

                  {/* Progress or Lock */}
                  {hunt.status === 'locked' ? (
                    <div className="bg-gray-100 rounded-lg p-4 text-center">
                      <LockClosedIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">{hunt.unlockRequirement}</p>
                    </div>
                  ) : (
                    <>
                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{hunt.completedClues} / {hunt.totalClues} clues</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(hunt.completedClues / hunt.totalClues) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => startHunt(hunt)}
                        className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                      >
                        {hunt.completedClues > 0 ? 'Continue Hunt' : 'Start Hunt'}
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Back to Home */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <Link
              href="/"
              className="inline-flex items-center text-purple-700 hover:text-purple-900 font-medium transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  )
}

export default TreasureHuntPage
