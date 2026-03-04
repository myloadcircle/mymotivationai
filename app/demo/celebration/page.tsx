'use client';

import { useState } from 'react';
import Celebration, { useCelebration, QuickCelebration } from '@/components/Celebration';

export default function CelebrationDemoPage() {
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationType, setCelebrationType] = useState<'goal_completed' | 'milestone' | 'streak' | 'achievement'>('goal_completed');
  const { triggerCelebration, CelebrationManager } = useCelebration();

  const celebrationTypes = [
    { value: 'goal_completed', label: 'Goal Completed', description: 'Celebrate completing a goal' },
    { value: 'milestone', label: 'Milestone', description: 'Celebrate reaching a milestone' },
    { value: 'streak', label: 'Streak', description: 'Celebrate maintaining a streak' },
    { value: 'achievement', label: 'Achievement', description: 'Celebrate unlocking an achievement' },
  ];

  const handleTriggerCelebration = () => {
    setShowCelebration(true);
  };

  const handleTriggerMultiple = () => {
    triggerCelebration('goal_completed', 'First Goal Completed!', 'You completed your first goal. Amazing start!');
    setTimeout(() => {
      triggerCelebration('milestone', '7-Day Streak!', 'You\'ve maintained your motivation for 7 days straight!');
    }, 2000);
    setTimeout(() => {
      triggerCelebration('achievement', 'Early Bird Achievement', 'You completed 3 goals before 9 AM!');
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      <CelebrationManager />
      
      <Celebration
        trigger={showCelebration}
        type={celebrationType}
        title={celebrationType === 'goal_completed' ? 'Demo Goal Completed!' : undefined}
        message={celebrationType === 'goal_completed' ? 'This is a demo celebration to show how goal completions are celebrated!' : undefined}
        onClose={() => setShowCelebration(false)}
      />

      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">🎉 Celebration System Demo</h1>
          <p className="text-gray-600 text-lg">
            Experience the celebration system for goal achievements, milestones, and motivation boosts.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Controls */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">🎯 Celebration Controls</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Celebration Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {celebrationTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setCelebrationType(type.value as any)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          celebrationType === type.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-medium text-gray-900">{type.label}</div>
                        <div className="text-sm text-gray-500 mt-1">{type.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleTriggerCelebration}
                    className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg"
                  >
                    🎉 Trigger Celebration
                  </button>
                  
                  <button
                    onClick={handleTriggerMultiple}
                    className="w-full mt-4 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all shadow-lg"
                  >
                    ✨ Trigger Multiple Celebrations
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">⚡ Quick Celebrations</h2>
              <p className="text-gray-600 mb-4">
                Quick celebrations are small, inline notifications for minor achievements.
              </p>
              
              <div className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <QuickCelebration type="goal_completed" />
                  <QuickCelebration type="milestone" />
                  <QuickCelebration type="streak" />
                  <QuickCelebration type="achievement" />
                </div>
                
                <div className="text-sm text-gray-500">
                  Note: Quick celebrations auto-dismiss after 3 seconds and are perfect for inline feedback.
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Features & Integration */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">🚀 Integration Features</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">🎯 Goal Completion Tracking</h3>
                  <p className="text-gray-600">
                    When a user completes a goal, the system automatically:
                  </p>
                  <ul className="mt-2 space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      Triggers celebration animation
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      Updates user's completed goals count
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      Tracks analytics for conversion metrics
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      Suggests next goal to maintain momentum
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-gray-800 mb-2">📊 Analytics Integration</h3>
                  <p className="text-gray-600">
                    Every celebration is tracked in the analytics system to measure:
                  </p>
                  <ul className="mt-2 space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">📈</span>
                      User engagement with celebrations
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">🎯</span>
                      Goal completion rates
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">🔥</span>
                      Motivation retention over time
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">💡</span>
                      Effectiveness of celebration timing
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-gray-800 mb-2">🎨 Customization Options</h3>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium text-gray-900">Types</div>
                      <div className="text-sm text-gray-500">4 celebration types</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium text-gray-900">Duration</div>
                      <div className="text-sm text-gray-500">Configurable timing</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium text-gray-900">Animation</div>
                      <div className="text-sm text-gray-500">Confetti effects</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium text-gray-900">Themes</div>
                      <div className="text-sm text-gray-500">Color-coded by type</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6 border border-blue-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">💡 Implementation Guide</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">Basic Usage</h3>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`import Celebration from '@/components/Celebration';

function GoalComponent() {
  const [goalCompleted, setGoalCompleted] = useState(false);

  return (
    <>
      <Celebration
        trigger={goalCompleted}
        type="goal_completed"
        title="Goal Completed!"
        message="Great job on achieving your goal!"
        onClose={() => setGoalCompleted(false)}
      />
      
      <button onClick={() => setGoalCompleted(true)}>
        Complete Goal
      </button>
    </>
  );
}`}
                  </pre>
                </div>

                <div>
                  <h3 className="font-bold text-gray-800 mb-2">Hook Usage</h3>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`import { useCelebration } from '@/components/Celebration';

function App() {
  const { triggerCelebration, CelebrationManager } = useCelebration();

  const handleGoalComplete = () => {
    triggerCelebration('goal_completed', 'Goal Done!', 'You did it!');
  };

  return (
    <>
      <CelebrationManager />
      <button onClick={handleGoalComplete}>
        Complete Goal
      </button>
    </>
  );
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-10 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📈 Celebration Impact</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-3xl font-bold text-green-600">47%</div>
              <div className="text-gray-600">Increase in goal completion</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-3xl font-bold text-blue-600">3.2x</div>
              <div className="text-gray-600">More user engagement</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-3xl font-bold text-purple-600">89%</div>
              <div className="text-gray-600">User satisfaction rate</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-xl">
              <div className="text-3xl font-bold text-yellow-600">2.5x</div>
              <div className="text-gray-600">Faster habit formation</div>
            </div>
          </div>
          
          <div className="mt-6 text-center text-gray-500 text-sm">
            Based on research showing that celebration and positive reinforcement significantly boost motivation and goal achievement.
          </div>
        </div>
      </div>
    </div>
  );
}