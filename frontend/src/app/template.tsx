'use client'

import React from 'react'
import PageTransition from '@/components/common/PageTransition'

export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>
}