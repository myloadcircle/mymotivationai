'use client'

import { useState } from 'react'
import { trackEvent } from '@/lib/analytics'

export default function IOSInstallGuide() {
  const [currentStep, setCurrentStep] = useState(1)

  const steps = [
    {
      number: 1,
      title: 'Tap the Share Button',
      description: 'Tap the share icon (📤) at the bottom of Safari',
      icon: '📤',
      tip: 'Look for the square with an arrow pointing up'
    },
    {
      number: 2,
      title: 'Find "Add to Home Screen"',
      description: 'Scroll down and tap "Add to Home Screen"',
      icon: '➕',
      tip: 'You may need to scroll through the share options'
    },
    {
      number: 3,
      title: 'Tap "Add"',
      description: 'Tap "Add" in the top right corner',
      icon: '✅',
      tip: 'The app will be added to your home screen'
    },
    {
      number: 4,
      title: 'Launch the App',
      description: 'Find the myMotivationAI icon and tap to launch',
      icon: '🚀',
      tip: 'The app works offline once installed'
    }
  ]

  const handleStepClick = (stepNumber: number) => {
    setCurrentStep(stepNumber)
    trackEvent('ios_install_step_view', { step: stepNumber })
  }

  const handleVideoGuideClick = () => {
    trackEvent('ios_video_guide_click')
    // In a real implementation, this would open a modal with video
    alert('Video guide would open here. This feature requires video assets.')
  }

  return (
    <div className="ios-install-guide-container bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Install on iPhone/iPad</h3>
          <p className="text-gray-600">Follow these simple steps to add to your home screen</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">📱</span>
          </div>
          <div className="text-sm">
            <div className="font-semibold">iOS Safari</div>
            <div className="text-gray-500">Requires manual install</div>
          </div>
        </div>
      </div>

      {/* Step Navigation */}
      <div className="flex space-x-2 mb-8 overflow-x-auto pb-2">
        {steps.map((step) => (
          <button
            key={step.number}
            onClick={() => handleStepClick(step.number)}
            className={`flex-shrink-0 px-4 py-2 rounded-lg transition-colors ${
              currentStep === step.number
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div className="flex items-center space-x-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                currentStep === step.number ? 'bg-white/20' : 'bg-gray-200'
              }`}>
                <span className={currentStep === step.number ? 'text-white' : 'text-gray-600'}>
                  {step.number}
                </span>
              </div>
              <span className="font-medium">Step {step.number}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Current Step Details */}
      <div className="mb-8">
        <div className="flex items-start space-x-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
            <span className="text-3xl">{steps[currentStep - 1].icon}</span>
          </div>
          <div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">
              Step {currentStep}: {steps[currentStep - 1].title}
            </h4>
            <p className="text-gray-700 mb-3">{steps[currentStep - 1].description}</p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 inline-block">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                  <span className="text-blue-600 text-sm">💡</span>
                </div>
                <span className="text-blue-800 text-sm font-medium">
                  Tip: {steps[currentStep - 1].tip}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Guide Placeholder */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="text-gray-700 font-medium">Visual Guide</div>
            <button
              onClick={handleVideoGuideClick}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
            >
              <span className="mr-1">▶️</span>
              Watch Video Guide
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-200 rounded-lg h-32 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">{steps[currentStep - 1].icon}</div>
                <div className="text-gray-600 text-sm">Step {currentStep}</div>
              </div>
            </div>
            <div className="bg-gray-200 rounded-lg h-32 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">📱</div>
                <div className="text-gray-600 text-sm">iPhone Screen</div>
              </div>
            </div>
          </div>
          <p className="text-gray-500 text-sm mt-3 text-center">
            In the actual app, this would show screenshots for each step
          </p>
        </div>
      </div>

      {/* Progress and Completion */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-gray-700 mb-1">Installation Progress</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-gray-700">
              Step {currentStep} of {steps.length}
            </div>
            <div className="text-sm text-gray-500">
              {Math.round((currentStep / steps.length) * 100)}% complete
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          {currentStep > 1 && (
            <button
              onClick={() => handleStepClick(currentStep - 1)}
              className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
            >
              ← Previous Step
            </button>
          )}
          
          {currentStep < steps.length ? (
            <button
              onClick={() => handleStepClick(currentStep + 1)}
              className="flex-1 py-3 px-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
            >
              Next Step →
            </button>
          ) : (
            <button
              onClick={() => trackEvent('ios_install_complete_click')}
              className="flex-1 py-3 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
            >
              🎉 Installation Complete!
            </button>
          )}
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => trackEvent('ios_need_help_click')}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            Need help? Contact support
          </button>
        </div>
      </div>
    </div>
  )
}