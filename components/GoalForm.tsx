'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { X, Calendar, Tag, Target, Hash, XCircle } from 'lucide-react';

interface GoalFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: {
    title?: string;
    description?: string;
    targetDate?: string;
    category?: string;
    tags?: string[];
  };
  editMode?: boolean;
  goalId?: string;
}

export default function GoalForm({
  onSuccess,
  onCancel,
  initialData,
  editMode = false,
  goalId,
}: GoalFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    targetDate: initialData?.targetDate || '',
    category: initialData?.category || '',
    tags: initialData?.tags || [],
  });
  const [tagInput, setTagInput] = useState('');
  const tagInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    'Health & Fitness',
    'Career & Business',
    'Education & Learning',
    'Personal Development',
    'Relationships',
    'Finance',
    'Hobbies & Creativity',
    'Spiritual',
    'Other',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const url = editMode && goalId 
        ? `/api/goals/${goalId}`
        : '/api/goals';
      
      const method = editMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to save goal');
      }

      // Success
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred');
      console.error('Goal form error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = tagInput.trim().toLowerCase();
      
      if (tag && !formData.tags.includes(tag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tag],
        }));
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
            <Target className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {editMode ? 'Edit Goal' : 'Create New Goal'}
            </h2>
            <p className="text-sm text-gray-600">
              {editMode ? 'Update your goal details' : 'Set a clear, achievable goal'}
            </p>
          </div>
        </div>
        
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
          {error.includes('Free plan allows only') && (
            <a
              href="/pricing"
              className="mt-2 inline-block text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              Upgrade to Basic for unlimited goals →
            </a>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Goal Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="What do you want to achieve?"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            disabled={isLoading}
          />
          <p className="mt-1 text-sm text-gray-500">
            Be specific and measurable (e.g., "Run 5km in under 30 minutes")
          </p>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Why is this goal important to you? What steps will you take?"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
            disabled={isLoading}
          />
          <p className="mt-1 text-sm text-gray-500">
            Optional: Add details about your motivation and plan
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Target Date */}
          <div>
            <label htmlFor="targetDate" className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline-block h-4 w-4 mr-1" />
              Target Date
            </label>
            <input
              type="date"
              id="targetDate"
              name="targetDate"
              value={formData.targetDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              disabled={isLoading}
            />
            <p className="mt-1 text-sm text-gray-500">
              Set a deadline to stay accountable
            </p>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              <Tag className="inline-block h-4 w-4 mr-1" />
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
              disabled={isLoading}
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">
              Helps organize and track similar goals
            </p>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
            <Hash className="inline-block h-4 w-4 mr-1" />
            Tags
          </label>
          <div className="border border-gray-300 rounded-lg p-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-colors">
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                    aria-label={`Remove tag ${tag}`}
                  >
                    <XCircle className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              ref={tagInputRef}
              value={tagInput}
              onChange={handleTagInputChange}
              onKeyDown={handleAddTag}
              placeholder="Type a tag and press Enter or comma to add (e.g., fitness, daily, challenge)"
              className="w-full px-2 py-1 border-0 focus:outline-none focus:ring-0"
              disabled={isLoading}
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Add tags to organize and filter your goals (max 5 tags)
          </p>
        </div>

        {/* Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">💡 Goal Setting Tips</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Make it SMART: Specific, Measurable, Achievable, Relevant, Time-bound</li>
            <li>• Start small - break big goals into smaller milestones</li>
            <li>• Review and adjust your goals regularly</li>
            <li>• Celebrate progress, not just completion</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
          )}
          
          <button
            type="submit"
            disabled={isLoading || !formData.title.trim()}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {editMode ? 'Updating...' : 'Creating...'}
              </span>
            ) : (
              editMode ? 'Update Goal' : 'Create Goal'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}