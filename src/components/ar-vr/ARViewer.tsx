'use client'

import React, { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, useGLTF, Html, Environment, Text3D } from '@react-three/drei'
import { motion } from 'framer-motion'
import * as THREE from 'three'

interface ARViewerProps {
  monumentId: string
  monumentName: string
  description: string
}

// Animated 3D Monument Model Component
function MonumentModel({ monumentId }: { monumentId: string }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1
    }
  })

  // Monument-specific models (simplified geometric representations)
  const getMonumentGeometry = () => {
    switch (monumentId) {
      case 'taj_mahal':
        return (
          <group>
            {/* Main dome */}
            <mesh position={[0, 1.5, 0]}>
              <sphereGeometry args={[0.8, 32, 32]} />
              <meshStandardMaterial color="#f5f5dc" metalness={0.3} roughness={0.2} />
            </mesh>
            {/* Base */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[2, 1, 2]} />
              <meshStandardMaterial color="#ffffff" metalness={0.2} roughness={0.3} />
            </mesh>
            {/* Minarets */}
            {[[-1.5, 0, -1.5], [1.5, 0, -1.5], [-1.5, 0, 1.5], [1.5, 0, 1.5]].map((pos, i) => (
              <mesh key={i} position={pos as [number, number, number]}>
                <cylinderGeometry args={[0.15, 0.15, 2, 16]} />
                <meshStandardMaterial color="#f5f5dc" metalness={0.3} roughness={0.2} />
              </mesh>
            ))}
          </group>
        )
      case 'red_fort':
        return (
          <group>
            {/* Main structure */}
            <mesh position={[0, 0.5, 0]}>
              <boxGeometry args={[2.5, 1.5, 2]} />
              <meshStandardMaterial color="#8B0000" metalness={0.1} roughness={0.7} />
            </mesh>
            {/* Towers */}
            {[[-1.5, 0.5, 0], [1.5, 0.5, 0]].map((pos, i) => (
              <mesh key={i} position={pos as [number, number, number]}>
                <cylinderGeometry args={[0.3, 0.3, 2, 16]} />
                <meshStandardMaterial color="#A52A2A" metalness={0.1} roughness={0.6} />
              </mesh>
            ))}
            {/* Dome */}
            <mesh position={[0, 1.5, 0]}>
              <sphereGeometry args={[0.5, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#FFD700" metalness={0.5} roughness={0.2} />
            </mesh>
          </group>
        )
      default:
        return (
          <mesh ref={meshRef}>
            <boxGeometry args={[1, 2, 1]} />
            <meshStandardMaterial 
              color={hovered ? "#ffd700" : "#ff6b6b"} 
              metalness={0.5} 
              roughness={0.2} 
            />
          </mesh>
        )
    }
  }

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.1 : 1}
    >
      {getMonumentGeometry()}
    </mesh>
  )
}

// Information Hotspot Component
function InfoHotspot({ position, label, description }: { 
  position: [number, number, number]
  label: string
  description: string
}) {
  const [visible, setVisible] = useState(false)

  return (
    <group position={position}>
      <mesh onClick={() => setVisible(!visible)}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="#00ffff" />
      </mesh>
      {visible && (
        <Html distanceFactor={2}>
          <div className="bg-white p-4 rounded-lg shadow-xl max-w-xs">
            <h4 className="font-bold text-gray-900 mb-2">{label}</h4>
            <p className="text-sm text-gray-700">{description}</p>
          </div>
        </Html>
      )}
    </group>
  )
}

// Particle System for Atmosphere
function ParticleSystem() {
  const particlesRef = useRef<THREE.Points>(null)
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05
    }
  })

  const particleCount = 100
  const positions = new Float32Array(particleCount * 3)
  
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10
    positions[i * 3 + 1] = Math.random() * 5
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
  }

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#ffffff" transparent opacity={0.6} />
    </points>
  )
}

export default function ARViewer({ monumentId, monumentName, description }: ARViewerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [cameraMode, setCameraMode] = useState<'orbit' | 'fly'>('orbit')

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading 3D Experience...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      {/* Controls UI */}
      <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg p-4 space-y-2">
        <h3 className="font-bold text-gray-900">{monumentName}</h3>
        <p className="text-sm text-gray-600">{description}</p>
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setCameraMode('orbit')}
            className={`px-3 py-1 rounded text-sm ${
              cameraMode === 'orbit' 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Orbit
          </button>
          <button
            onClick={() => setCameraMode('fly')}
            className={`px-3 py-1 rounded text-sm ${
              cameraMode === 'fly' 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Fly
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-black bg-opacity-70 text-white rounded-lg px-4 py-2 text-sm">
        🖱️ Click and drag to rotate • 🔍 Scroll to zoom • 📍 Click blue spheres for info
      </div>

      {/* 3D Canvas */}
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[5, 3, 5]} />
        
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1} 
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-10, 10, -10]} intensity={0.5} color="#ffd700" />
        
        {/* Environment */}
        <Environment preset="sunset" />
        
        {/* Ground */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#90EE90" roughness={0.8} />
        </mesh>
        
        {/* Monument Model */}
        <MonumentModel monumentId={monumentId} />
        
        {/* Information Hotspots */}
        <InfoHotspot 
          position={[1.5, 1, 0]} 
          label="Architecture Style"
          description="Blend of Persian, Islamic, and Indian architectural styles"
        />
        <InfoHotspot 
          position={[-1.5, 1, 0]} 
          label="Historical Period"
          description="Built in the 17th century during the Mughal era"
        />
        <InfoHotspot 
          position={[0, 2, 1.5]} 
          label="Cultural Significance"
          description="UNESCO World Heritage Site and symbol of India's rich history"
        />
        
        {/* Atmospheric Particles */}
        <ParticleSystem />
        
        {/* Controls */}
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={15}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  )
}

