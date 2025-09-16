'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

interface PageTransitionProps {
  children: React.ReactNode
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const pathname = usePathname()

  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.96
    },
    in: {
      opacity: 1,
      y: 0,
      scale: 1
    },
    out: {
      opacity: 0,
      y: -20,
      scale: 1.04
    }
  }

  const pageTransition = {
    type: "tween",
    ease: [0.25, 0.46, 0.45, 0.94], // Custom smooth cubic-bezier
    duration: 0.5
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export default PageTransition