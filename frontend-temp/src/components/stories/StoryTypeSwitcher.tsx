import React from 'react'
import { motion } from 'framer-motion'

type StoryType = 'history' | 'mythology' | 'belief' | 'horror' | 'folklore' | 'legend'

interface StoryTypeSwitcherProps {
  activeType: StoryType
  onTypeChange: (type: StoryType) => void
  availableTypes: StoryType[]
}

const storyTypeLabels = {
  history: 'Historical Accounts',
  mythology: 'Mythological Tales',
  belief: 'Spiritual Beliefs',
  horror: 'Horror Tales',
  folklore: 'Folklore',
  legend: 'Legends'
}

const storyTypeColors = {
  history: 'from-amber-500 to-orange-600',
  mythology: 'from-purple-500 to-indigo-600',
  belief: 'from-emerald-500 to-teal-600',
  horror: 'from-red-500 to-pink-600',
  folklore: 'from-blue-500 to-cyan-600',
  legend: 'from-yellow-500 to-amber-600'
}

const StoryTypeSwitcher: React.FC<StoryTypeSwitcherProps> = ({ 
  activeType, 
  onTypeChange, 
  availableTypes 
}) => {
  return (
    <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-gray-50">
      {availableTypes.map((type) => (
        <button
          key={type}
          onClick={() => onTypeChange(type)}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center relative ${
            activeType === type
              ? `text-white shadow-md`
              : 'text-gray-700 hover:text-gray-900'
          }`}
        >
          {activeType === type && (
            <motion.div
              layoutId="activeType"
              className={`absolute inset-0 bg-gradient-to-r ${storyTypeColors[type]} rounded-md`}
              initial={false}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          <span className="relative z-10">{storyTypeLabels[type]}</span>
        </button>
      ))}
    </div>
  )
}

export default StoryTypeSwitcher