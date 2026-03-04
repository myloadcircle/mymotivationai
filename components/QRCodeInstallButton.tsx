'use client'

import { useState, useEffect } from 'react'
import { trackEvent } from '@/lib/analytics'

interface QRCodeInstallButtonProps {
  onSuccess: () => void
  onError: (error: any) => void
  qrData: any
}

export default function QRCodeInstallButton({ onSuccess, onError, qrData }: QRCodeInstallButtonProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isInstalling, setIsInstalling] = useState(false)
  const [installSupported, setInstallSupported] = useState(false)

  useEffect(() => {
    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault()
      
      // Stash the event so it can be triggered later
      setDeferredPrompt(e)
      setInstallSupported(true)
      
      // Track that prompt is available
      trackEvent('install_prompt_available', {
        platform: navigator.platform,
        userAgent: navigator.userAgent,
        ...qrData
      })
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    if (isStandalone) {
      setInstallSupported(false)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [qrData])

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      onError(new Error('Install prompt not available'))
      return
    }

    setIsInstalling(true)
    
    // Track install initiation
    trackEvent('install_initiated', {
      source: 'qr_landing',
      timestamp: new Date().toISOString(),
      ...qrData
    })

    try {
      // Show the install prompt
      deferredPrompt.prompt()
      
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice
      
      // Track the outcome
      trackEvent(`install_${outcome}`, {
        source: 'qr_landing',
        timestamp: new Date().toISOString(),
        ...qrData
      })
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt')
        onSuccess()
      } else {
        console.log('User dismissed the install prompt')
        onError(new Error('User dismissed install prompt'))
      }
      
      // Clear the saved prompt
      setDeferredPrompt(null)
      setInstallSupported(false)
    } catch (error) {
      console.error('Error during installation:', error)
      trackEvent('install_error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        ...qrData
      })
      onError(error)
    } finally {
      setIsInstalling(false)
    }
  }

  if (!installSupported) {
    return null
  }

  return (
    <div className="install-button-container">
      <button
        onClick={handleInstallClick}
        disabled={isInstalling}
        className="install-button-pulse w-full max-w-md py-4 px-6 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold text-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
      >
        <div className="flex items-center justify-center space-x-3">
          {isInstalling ? (
            <>
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Installing...</span>
            </>
          ) : (
            <>
              <div className="text-2xl">📱</div>
              <div className="text-left">
                <div className="font-bold">Install myMotivationAI</div>
                <div className="text-sm font-normal opacity-90">One tap • No app store • Works offline</div>
              </div>
              <div className="text-2xl ml-2">↓</div>
            </>
          )}
        </div>
      </button>
      
      <div className="mt-4 text-center">
        <div className="inline-flex items-center space-x-2 text-gray-600 text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>No download required</span>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Instant access</span>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Free to use</span>
        </div>
      </div>
    </div>
  )
}