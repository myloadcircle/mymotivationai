// Offline-first storage service for hybrid app
// Provides localStorage with sync queue for network operations

import { supabase } from './supabase-client'

export interface SyncOperation {
  id: string
  type: 'goal_create' | 'goal_update' | 'goal_delete' | 'progress_log' | 'habit_create' | 'habit_complete'
  table: string
  data: any
  timestamp: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  retryCount: number
  error?: string
}

export interface OfflineData {
  goals: any[]
  progressLogs: any[]
  habits: any[]
  habitCompletions: any[]
  syncQueue: SyncOperation[]
  lastSync: number
}

export class OfflineStorage {
  private static instance: OfflineStorage
  private storageKey = 'motivationai_offline_data'
  private syncQueueKey = 'motivationai_sync_queue'
  private isOnline = false

  private constructor() {
    this.checkNetworkStatus()
    window.addEventListener('online', () => this.handleOnline())
    window.addEventListener('offline', () => this.handleOffline())
  }

  static getInstance(): OfflineStorage {
    if (!OfflineStorage.instance) {
      OfflineStorage.instance = new OfflineStorage()
    }
    return OfflineStorage.instance
  }

  // Check network status
  private checkNetworkStatus() {
    this.isOnline = typeof navigator !== 'undefined' && navigator.onLine
  }

  private handleOnline() {
    this.isOnline = true
    console.log('Device is online, processing sync queue...')
    this.processSyncQueue()
  }

  private handleOffline() {
    this.isOnline = false
    console.log('Device is offline, storing operations locally...')
  }

  // Get all offline data
  getAllData(): OfflineData {
    try {
      const data = localStorage.getItem(this.storageKey)
      return data ? JSON.parse(data) : {
        goals: [],
        progressLogs: [],
        habits: [],
        habitCompletions: [],
        syncQueue: [],
        lastSync: 0
      }
    } catch (error) {
      console.error('Error reading offline data:', error)
      return this.getDefaultData()
    }
  }

  // Save all offline data
  saveAllData(data: OfflineData) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data))
    } catch (error) {
      console.error('Error saving offline data:', error)
    }
  }

  // Get default data structure
  private getDefaultData(): OfflineData {
    return {
      goals: [],
      progressLogs: [],
      habits: [],
      habitCompletions: [],
      syncQueue: [],
      lastSync: 0
    }
  }

  // CRUD operations for goals
  async createGoal(goal: any): Promise<any> {
    const data = this.getAllData()
    const offlineId = `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const goalWithId = {
      ...goal,
      id: offlineId,
      offline_id: offlineId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    data.goals.push(goalWithId)
    this.saveAllData(data)

    // Add to sync queue
    await this.addToSyncQueue({
      type: 'goal_create',
      table: 'goals',
      data: goalWithId
    })

    return goalWithId
  }

  async updateGoal(goalId: string, updates: any): Promise<any> {
    const data = this.getAllData()
    const goalIndex = data.goals.findIndex(g => g.id === goalId || g.offline_id === goalId)
    
    if (goalIndex === -1) {
      throw new Error('Goal not found')
    }

    const updatedGoal = {
      ...data.goals[goalIndex],
      ...updates,
      updated_at: new Date().toISOString()
    }

    data.goals[goalIndex] = updatedGoal
    this.saveAllData(data)

    // Add to sync queue
    await this.addToSyncQueue({
      type: 'goal_update',
      table: 'goals',
      data: updatedGoal
    })

    return updatedGoal
  }

  async deleteGoal(goalId: string): Promise<void> {
    const data = this.getAllData()
    const goalIndex = data.goals.findIndex(g => g.id === goalId || g.offline_id === goalId)
    
    if (goalIndex === -1) {
      throw new Error('Goal not found')
    }

    const goal = data.goals[goalIndex]
    data.goals.splice(goalIndex, 1)
    this.saveAllData(data)

    // Add to sync queue
    await this.addToSyncQueue({
      type: 'goal_delete',
      table: 'goals',
      data: { id: goalId, offline_id: goal.offline_id }
    })
  }

  // CRUD operations for progress logs
  async createProgressLog(log: any): Promise<any> {
    const data = this.getAllData()
    const offlineId = `progress_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const logWithId = {
      ...log,
      id: offlineId,
      offline_id: offlineId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    data.progressLogs.push(logWithId)
    this.saveAllData(data)

    // Add to sync queue
    await this.addToSyncQueue({
      type: 'progress_log',
      table: 'progress_logs',
      data: logWithId
    })

    return logWithId
  }

  // Sync queue management
  async addToSyncQueue(operation: Omit<SyncOperation, 'id' | 'timestamp' | 'status' | 'retryCount'>): Promise<string> {
    const data = this.getAllData()
    const syncId = `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const syncOperation: SyncOperation = {
      id: syncId,
      ...operation,
      timestamp: Date.now(),
      status: 'pending',
      retryCount: 0
    }

    data.syncQueue.push(syncOperation)
    this.saveAllData(data)

    // Try to process immediately if online
    if (this.isOnline) {
      await this.processSyncQueue()
    }

    return syncId
  }

  // Process sync queue
  async processSyncQueue(): Promise<{ success: number; failed: number }> {
    if (!this.isOnline) {
      console.log('Cannot process sync queue: device is offline')
      return { success: 0, failed: 0 }
    }

    const data = this.getAllData()
    const pendingOperations = data.syncQueue.filter(op => op.status === 'pending')
    
    if (pendingOperations.length === 0) {
      return { success: 0, failed: 0 }
    }

    console.log(`Processing ${pendingOperations.length} pending sync operations...`)

    let success = 0
    let failed = 0

    for (const operation of pendingOperations) {
      try {
        // Update status to processing
        const opIndex = data.syncQueue.findIndex(op => op.id === operation.id)
        data.syncQueue[opIndex].status = 'processing'
        this.saveAllData(data)

        // Process based on operation type
        switch (operation.type) {
          case 'goal_create':
            await this.syncGoalCreate(operation.data)
            break
          case 'goal_update':
            await this.syncGoalUpdate(operation.data)
            break
          case 'goal_delete':
            await this.syncGoalDelete(operation.data)
            break
          case 'progress_log':
            await this.syncProgressLog(operation.data)
            break
          case 'habit_create':
            await this.syncHabitCreate(operation.data)
            break
          case 'habit_complete':
            await this.syncHabitComplete(operation.data)
            break
        }

        // Mark as completed
        data.syncQueue[opIndex].status = 'completed'
        success++
      } catch (error) {
        console.error(`Failed to sync operation ${operation.id}:`, error)
        
        const opIndex = data.syncQueue.findIndex(op => op.id === operation.id)
        data.syncQueue[opIndex].status = 'failed'
        data.syncQueue[opIndex].retryCount++
        data.syncQueue[opIndex].error = error instanceof Error ? error.message : 'Unknown error'
        
        // Remove if retry count exceeds limit
        if (data.syncQueue[opIndex].retryCount > 3) {
          data.syncQueue.splice(opIndex, 1)
        }
        
        failed++
      }
    }

    this.saveAllData(data)
    console.log(`Sync completed: ${success} successful, ${failed} failed`)
    
    return { success, failed }
  }

  // Sync operations with Supabase
  private async syncGoalCreate(goalData: any) {
    const { data, error } = await supabase
      .from('goals')
      .insert([{
        title: goalData.title,
        description: goalData.description,
        category: goalData.category,
        target_value: goalData.target_value,
        current_value: goalData.current_value,
        unit: goalData.unit,
        deadline: goalData.deadline,
        priority: goalData.priority,
        status: goalData.status,
        color_theme: goalData.color_theme,
        is_public: goalData.is_public,
        offline_id: goalData.offline_id
      }])
      .select()

    if (error) throw error
    return data
  }

  private async syncGoalUpdate(goalData: any) {
    const { data, error } = await supabase
      .from('goals')
      .update({
        title: goalData.title,
        description: goalData.description,
        current_value: goalData.current_value,
        status: goalData.status,
        updated_at: new Date().toISOString()
      })
      .eq('offline_id', goalData.offline_id)
      .select()

    if (error) throw error
    return data
  }

  private async syncGoalDelete(goalData: any) {
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('offline_id', goalData.offline_id)

    if (error) throw error
  }

  private async syncProgressLog(logData: any) {
    const { data, error } = await supabase
      .from('progress_logs')
      .insert([{
        goal_id: logData.goal_id,
        value: logData.value,
        notes: logData.notes,
        mood: logData.mood,
        offline_id: logData.offline_id
      }])
      .select()

    if (error) throw error
    return data
  }

  private async syncHabitCreate(habitData: any) {
    const { data, error } = await supabase
      .from('habits')
      .insert([{
        name: habitData.name,
        description: habitData.description,
        frequency: habitData.frequency,
        offline_id: habitData.offline_id
      }])
      .select()

    if (error) throw error
    return data
  }

  private async syncHabitComplete(completionData: any) {
    const { data, error } = await supabase
      .from('habit_completions')
      .insert([{
        habit_id: completionData.habit_id,
        completed_at: new Date().toISOString(),
        notes: completionData.notes,
        mood: completionData.mood,
        offline_id: completionData.offline_id
      }])
      .select()

    if (error) throw error
    return data
  }

  // Sync all local data with server
  async fullSync(): Promise<{ success: boolean; message: string }> {
    if (!this.isOnline) {
      return { success: false, message: 'Device is offline' }
    }

    try {
      // Process sync queue first
      const syncResult = await this.processSyncQueue()
      
      // Then sync local data
      const data = this.getAllData()
      
      // Update last sync timestamp
      data.lastSync = Date.now()
      this.saveAllData(data)

      return {
        success: syncResult.failed === 0,
        message: `Sync completed: ${syncResult.success} successful, ${syncResult.failed} failed`
      }
    } catch (error) {
      console.error('Full sync failed:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Sync failed'
      }
    }
  }

  // Clear all offline data
  clearAllData(): void {
    try {
      localStorage.removeItem(this.storageKey)
      localStorage.removeItem(this.syncQueueKey)
      console.log('All offline data cleared')
    } catch (error) {
      console.error('Error clearing offline data:', error)
    }
  }

  // Get sync queue status
  getSyncStatus(): { pending: number; processing: number; completed: number; failed: number } {
    const data = this.getAllData()
    const syncQueue = data.syncQueue

    return {
      pending: syncQueue.filter(op => op.status === 'pending').length,
      processing: syncQueue.filter(op => op.status === 'processing').length,
      completed: syncQueue.filter(op => op.status === 'completed').length,
      failed: syncQueue.filter(op => op.status === 'failed').length
    }
  }

  // Check if device is online
  getIsOnline(): boolean {
    return this.isOnline
  }
}

// Export singleton instance
export const offlineStorage = OfflineStorage.getInstance()