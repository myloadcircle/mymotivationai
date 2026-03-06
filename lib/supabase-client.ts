import { createClient } from '@supabase/supabase-js'

// Supabase configuration for hybrid app (use env vars in production)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Create Supabase client with offline-first configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Important for hybrid apps
    storage: {
      getItem: (key: string) => {
        // Try localStorage first, fallback to Capacitor Storage
        if (typeof window !== 'undefined' && window.localStorage) {
          return window.localStorage.getItem(key)
        }
        return null
      },
      setItem: (key: string, value: string) => {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(key, value)
        }
      },
      removeItem: (key: string) => {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.removeItem(key)
        }
      }
    }
  },
  global: {
    headers: {
      'X-Client-Info': 'myMotivationAI-hybrid-app'
    }
  },
  db: {
    schema: 'public'
  }
})

// Helper functions for hybrid app authentication
export const authService = {
  // Sign in with email/password
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return data
  },

  // Sign up with email/password
  async signUp(email: string, password: string, metadata?: any) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })
    
    if (error) throw error
    return data
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Get current session
  async getSession() {
    const { data, error } = await supabase.auth.getSession()
    if (error) throw error
    return data.session
  },

  // Get current user
  async getUser() {
    const { data, error } = await supabase.auth.getUser()
    if (error) throw error
    return data.user
  },

  // Reset password
  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'myMotivationAI://reset-password'
    })
    if (error) throw error
  },

  // Update user profile
  async updateProfile(userId: string, updates: any) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
    
    if (error) throw error
    return data
  }
}

// Offline storage for hybrid app
export const offlineStorage = {
  // Store data locally
  setItem(key: string, value: any) {
    try {
      const serialized = JSON.stringify(value)
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(`motivationai_${key}`, serialized)
      }
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  },

  // Get data from local storage
  getItem(key: string) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const item = window.localStorage.getItem(`motivationai_${key}`)
        return item ? JSON.parse(item) : null
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error)
    }
    return null
  },

  // Remove data from local storage
  removeItem(key: string) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(`motivationai_${key}`)
      }
    } catch (error) {
      console.error('Error removing from localStorage:', error)
    }
  },

  // Clear all app data
  clear() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const keys = Object.keys(window.localStorage)
        keys.forEach(key => {
          if (key.startsWith('motivationai_')) {
            window.localStorage.removeItem(key)
          }
        })
      }
    } catch (error) {
      console.error('Error clearing localStorage:', error)
    }
  }
}

// Sync service for offline-first architecture
export const syncService = {
  // Queue for offline operations
  queue: [] as Array<{ type: string; data: any; timestamp: number }>,

  // Add operation to queue
  addToQueue(type: string, data: any) {
    this.queue.push({
      type,
      data,
      timestamp: Date.now()
    })
    offlineStorage.setItem('sync_queue', this.queue)
  },

  // Process queue when online
  async processQueue() {
    if (this.queue.length === 0) {
      const savedQueue = offlineStorage.getItem('sync_queue')
      if (savedQueue) {
        this.queue = savedQueue
      }
    }

    const successfulOps = []
    const failedOps = []

    for (const op of this.queue) {
      try {
        // Process based on operation type
        switch (op.type) {
          case 'goal_create':
            // Sync goal creation with Supabase
            // Implementation depends on your schema
            break
          case 'goal_update':
            // Sync goal updates
            break
          case 'goal_delete':
            // Sync goal deletions
            break
          case 'progress_log':
            // Sync progress logs
            break
        }
        successfulOps.push(op)
      } catch (error) {
        console.error('Failed to sync operation:', op, error)
        failedOps.push(op)
      }
    }

    // Update queue with failed operations only
    this.queue = failedOps
    offlineStorage.setItem('sync_queue', this.queue)

    return { successful: successfulOps.length, failed: failedOps.length }
  },

  // Check network connectivity
  isOnline() {
    return typeof navigator !== 'undefined' && navigator.onLine
  }
}

export default supabase