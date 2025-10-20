'use client'

import React, { useEffect, useState } from 'react'

const PerformanceMonitor = () => {
  const [fps, setFps] = useState(0)
  const [memoryUsage, setMemoryUsage] = useState(0)

  useEffect(() => {
    let frameCount = 0
    let lastTime = performance.now()

    const countFrames = () => {
      frameCount++
      const currentTime = performance.now()
      
      if (currentTime - lastTime >= 1000) {
        setFps(frameCount)
        frameCount = 0
        lastTime = currentTime
        
        // Check memory usage if available
        if ('memory' in performance) {
          const memory = (performance as any).memory
          setMemoryUsage(Math.round(memory.usedJSHeapSize / 1024 / 1024))
        }
      }
      
      requestAnimationFrame(countFrames)
    }

    const rafId = requestAnimationFrame(countFrames)
    
    return () => cancelAnimationFrame(rafId)
  }, [])

  // Only show in development
  if (process.env.NODE_ENV !== 'development') return null

  return (
    <div className="fixed top-4 left-4 bg-black/80 text-white p-2 rounded text-sm font-mono z-50">
      <div>FPS: {fps}</div>
      {memoryUsage > 0 && <div>Memory: {memoryUsage}MB</div>}
    </div>
  )
}

export default PerformanceMonitor