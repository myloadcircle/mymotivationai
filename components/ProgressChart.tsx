'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import { TrendingUp, Target, Calendar, Award } from 'lucide-react';

interface ProgressData {
  date: string;
  completed: number;
  created: number;
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface ProgressChartProps {
  timeframe?: 'week' | 'month' | 'year';
  chartType?: 'bar' | 'line' | 'pie';
  showStats?: boolean;
  data?: Array<{
    date?: string;
    month?: string;
    completed: number;
    total?: number;
    created?: number;
  }>;
}

const categoryColors = [
  '#3B82F6', // blue
  '#10B981', // green
  '#8B5CF6', // purple
  '#F59E0B', // amber
  '#EF4444', // red
  '#EC4899', // pink
  '#14B8A6', // teal
  '#F97316', // orange
];

export default function ProgressChart({
  timeframe = 'month',
  chartType = 'bar',
  showStats = true,
  data,
}: ProgressChartProps) {
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalGoals: 0,
    completedGoals: 0,
    completionRate: 0,
    averageCompletionTime: 0,
  });

  useEffect(() => {
    fetchProgressData();
  }, [timeframe]);

  const fetchProgressData = async () => {
    setIsLoading(true);
    
    // Use provided data or generate mock data
    let progressDataToUse: ProgressData[] = [];
    let categoryDataToUse: CategoryData[] = [
      { name: 'Health & Fitness', value: 12, color: categoryColors[0] },
      { name: 'Career & Business', value: 8, color: categoryColors[1] },
      { name: 'Personal Development', value: 6, color: categoryColors[2] },
      { name: 'Education & Learning', value: 4, color: categoryColors[3] },
      { name: 'Relationships', value: 3, color: categoryColors[4] },
      { name: 'Finance', value: 5, color: categoryColors[5] },
    ];

    if (data && data.length > 0) {
      // Use provided data
      progressDataToUse = data.map(item => ({
        date: item.date || item.month || '',
        completed: item.completed,
        created: item.created || 0,
      }));
    } else {
      // Generate mock time series data
      const days = timeframe === 'week' ? 7 : timeframe === 'month' ? 30 : 365;
      const today = new Date();
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        const dateStr = timeframe === 'year' 
          ? date.toLocaleDateString('en-US', { month: 'short' })
          : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        progressDataToUse.push({
          date: dateStr,
          completed: Math.floor(Math.random() * 5),
          created: Math.floor(Math.random() * 3),
        });
      }
    }

    // Calculate stats
    const totalGoals = categoryDataToUse.reduce((sum, cat) => sum + cat.value, 0);
    const completedGoals = progressDataToUse.reduce((sum, item) => sum + item.completed, 0);
    const completionRate = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;
    const averageCompletionTime = 14; // days

    setProgressData(progressDataToUse);
    setCategoryData(categoryDataToUse);
    setStats({
      totalGoals,
      completedGoals,
      completionRate,
      averageCompletionTime,
    });
    
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="completed" 
                stroke="#10B981" 
                strokeWidth={2}
                name="Goals Completed"
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="created" 
                stroke="#3B82F6" 
                strokeWidth={2}
                name="Goals Created"
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value} goals`, 'Count']}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      default: // bar chart
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar 
                dataKey="completed" 
                name="Goals Completed" 
                fill="#10B981" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="created" 
                name="Goals Created" 
                fill="#3B82F6" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Progress Overview</h3>
          <p className="text-gray-600">
            Track your goal completion and progress over time
          </p>
        </div>
        
        <div className="flex space-x-2 mt-4 md:mt-0">
          <div>
            <label htmlFor="timeframe-select" className="sr-only">Select timeframe</label>
            <select
              id="timeframe-select"
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={timeframe}
              onChange={(e) => fetchProgressData()}
              aria-label="Select timeframe for progress chart"
            >
              <option value="week">Last 7 days</option>
              <option value="month">Last 30 days</option>
              <option value="year">Last year</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="chart-type-select" className="sr-only">Select chart type</label>
            <select
              id="chart-type-select"
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={chartType}
              onChange={(e) => fetchProgressData()}
              aria-label="Select chart type"
            >
              <option value="bar">Bar Chart</option>
              <option value="line">Line Chart</option>
              <option value="pie">Pie Chart</option>
            </select>
          </div>
        </div>
      </div>

      {showStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Goals</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalGoals}</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <Award className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedGoals}</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.completionRate.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-3">
                <Calendar className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg. Time</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.averageCompletionTime} days
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="h-80">
        {renderChart()}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">Insights</h4>
            <p className="text-sm text-gray-600 mt-1">
              {stats.completionRate > 70 ? (
                "Great job! You're maintaining excellent consistency. Keep up the momentum!"
              ) : stats.completionRate > 40 ? (
                "Good progress! Try to focus on completing one goal at a time for better results."
              ) : (
                "Consider breaking larger goals into smaller, more achievable milestones."
              )}
            </p>
          </div>
          
          <button
            onClick={fetchProgressData}
            className="mt-4 md:mt-0 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            Refresh Data
          </button>
        </div>
      </div>
    </div>
  );
}