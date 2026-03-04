/**
 * A/B Testing Framework for MotivationAI
 * TypeScript implementation of the A/B testing framework
 */

export interface Variant {
  id: string;
  name: string;
  description: string;
  weight: number;
}

export interface Experiment {
  id: string;
  name: string;
  description: string;
  variants: Variant[];
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
}

export interface VariantResult {
  participants: number;
  completions: number;
  totalMetric: number;
  completionRate: number;
}

export interface ExperimentResults {
  experimentId: string;
  totalParticipants: number;
  overallCompletionRate: number;
  variantResults: Record<string, VariantResult>;
  winningVariant?: string;
  statisticalSignificance: boolean;
  confidenceLevel: 'low' | 'medium' | 'high';
  lastUpdated: Date;
}

export interface UserAssignment {
  userId: string;
  experimentId: string;
  variantId: string;
  assignedAt: Date;
  completedAt?: Date;
  successMetric?: number;
}

export class ABTestingFramework {
  private experiments: Map<string, Experiment> = new Map();
  private results: Map<string, ExperimentResults> = new Map();
  private userAssignments: Map<string, UserAssignment[]> = new Map();

  /**
   * Create a new A/B test experiment
   */
  createExperiment(
    id: string,
    name: string,
    description: string,
    variants: Variant[],
    startDate: Date = new Date()
  ): Experiment {
    const totalWeight = variants.reduce((sum, variant) => sum + variant.weight, 0);
    if (Math.abs(totalWeight - 1) > 0.01) {
      throw new Error(`Variant weights must sum to 1 (got ${totalWeight})`);
    }

    const experiment: Experiment = {
      id,
      name,
      description,
      variants,
      startDate,
      isActive: true,
    };

    this.experiments.set(id, experiment);

    // Initialize results
    const variantResults: Record<string, VariantResult> = {};
    variants.forEach(variant => {
      variantResults[variant.id] = {
        participants: 0,
        completions: 0,
        totalMetric: 0,
        completionRate: 0,
      };
    });

    this.results.set(id, {
      experimentId: id,
      totalParticipants: 0,
      overallCompletionRate: 0,
      variantResults,
      statisticalSignificance: false,
      confidenceLevel: 'low',
      lastUpdated: new Date(),
    });

    console.log(`✅ Experiment created: ${name} (${id}) with ${variants.length} variants`);
    return experiment;
  }

  /**
   * Assign a user to a variant for an experiment
   */
  assignUserToVariant(userId: string, experimentId: string): UserAssignment {
    const experiment = this.experiments.get(experimentId);
    if (!experiment) {
      throw new Error(`Experiment ${experimentId} not found`);
    }

    if (!experiment.isActive) {
      throw new Error(`Experiment ${experimentId} is not active`);
    }

    // Check if user already assigned
    const existingAssignment = this.getUserAssignments(userId).find(
      a => a.experimentId === experimentId
    );

    if (existingAssignment) {
      return existingAssignment;
    }

    // Consistent hashing for variant assignment
    const variant = this.getVariantForUser(userId, experiment);
    const assignment: UserAssignment = {
      userId,
      experimentId,
      variantId: variant.id,
      assignedAt: new Date(),
    };

    // Store assignment
    if (!this.userAssignments.has(userId)) {
      this.userAssignments.set(userId, []);
    }
    this.userAssignments.get(userId)!.push(assignment);

    // Update participant count
    const results = this.results.get(experimentId)!;
    results.totalParticipants++;
    results.variantResults[variant.id].participants++;
    results.lastUpdated = new Date();

    console.log(`👤 User ${userId} assigned to variant ${variant.id} for experiment ${experiment.name}`);
    return assignment;
  }

  /**
   * Record a completion for a user in an experiment
   */
  recordCompletion(
    userId: string,
    experimentId: string,
    successMetric: number = 1
  ): void {
    const assignment = this.getUserAssignments(userId).find(
      a => a.experimentId === experimentId
    );

    if (!assignment) {
      throw new Error(`User ${userId} not assigned to experiment ${experimentId}`);
    }

    if (assignment.completedAt) {
      console.warn(`⚠️ User ${userId} already completed experiment ${experimentId}`);
      return;
    }

    assignment.completedAt = new Date();
    assignment.successMetric = successMetric;

    // Update completion counts
    const results = this.results.get(experimentId)!;
    const variantResult = results.variantResults[assignment.variantId];
    variantResult.completions++;
    variantResult.totalMetric += successMetric;
    variantResult.completionRate = variantResult.completions / variantResult.participants;

    // Update overall completion rate
    results.overallCompletionRate = Object.values(results.variantResults).reduce(
      (sum, vr) => sum + vr.completions,
      0
    ) / results.totalParticipants;

    // Check statistical significance
    this.updateStatisticalSignificance(experimentId);

    results.lastUpdated = new Date();

    console.log(`📈 Recorded completion for user ${userId} in variant ${assignment.variantId}`);
  }

  /**
   * Get experiment results
   */
  getExperimentResults(experimentId: string): ExperimentResults | undefined {
    return this.results.get(experimentId);
  }

  /**
   * Get all active experiments
   */
  getActiveExperiments(): Experiment[] {
    return Array.from(this.experiments.values()).filter(exp => exp.isActive);
  }

  /**
   * End an experiment and determine winning variant
   */
  endExperiment(experimentId: string): ExperimentResults {
    const experiment = this.experiments.get(experimentId);
    if (!experiment) {
      throw new Error(`Experiment ${experimentId} not found`);
    }

    experiment.isActive = false;
    experiment.endDate = new Date();

    const results = this.results.get(experimentId)!;
    this.determineWinningVariant(experimentId);

    console.log(`🏁 Experiment ${experiment.name} ended`);
    return results;
  }

  /**
   * Get user assignments
   */
  private getUserAssignments(userId: string): UserAssignment[] {
    return this.userAssignments.get(userId) || [];
  }

  /**
   * Get variant for user using consistent hashing
   */
  private getVariantForUser(userId: string, experiment: Experiment): Variant {
    // Simple hash-based assignment for consistency
    const hash = this.hashString(userId + experiment.id);
    let cumulativeWeight = 0;

    for (const variant of experiment.variants) {
      cumulativeWeight += variant.weight;
      if (hash <= cumulativeWeight) {
        return variant;
      }
    }

    // Fallback to first variant
    return experiment.variants[0];
  }

  /**
   * Simple string hash function
   */
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash) / 2147483647; // Normalize to 0-1
  }

  /**
   * Update statistical significance for an experiment
   */
  private updateStatisticalSignificance(experimentId: string): void {
    const results = this.results.get(experimentId)!;
    const variants = Object.entries(results.variantResults);

    if (variants.length < 2) return;

    // Simple statistical significance check
    // In production, use proper statistical tests (chi-square, t-test, etc.)
    const totalCompletions = variants.reduce((sum, [, vr]) => sum + vr.completions, 0);
    const totalParticipants = results.totalParticipants;

    if (totalParticipants < 100) {
      results.statisticalSignificance = false;
      results.confidenceLevel = 'low';
      return;
    }

    // Check if any variant has significantly different completion rate
    const baselineRate = results.overallCompletionRate;
    let significant = false;

    for (const [, variantResult] of variants) {
      const rate = variantResult.completionRate;
      const participants = variantResult.participants;

      // Simple z-test approximation
      if (participants > 30) {
        const se = Math.sqrt(baselineRate * (1 - baselineRate) / participants);
        const z = Math.abs(rate - baselineRate) / se;

        if (z > 1.96) { // 95% confidence
          significant = true;
          results.confidenceLevel = 'high';
        } else if (z > 1.645) { // 90% confidence
          significant = true;
          results.confidenceLevel = 'medium';
        }
      }
    }

    results.statisticalSignificance = significant;
  }

  /**
   * Determine winning variant based on completion rates
   */
  private determineWinningVariant(experimentId: string): void {
    const results = this.results.get(experimentId)!;
    const variants = Object.entries(results.variantResults);

    if (variants.length === 0) return;

    let winningVariant = '';
    let highestRate = -1;

    for (const [variantId, variantResult] of variants) {
      if (variantResult.completionRate > highestRate && variantResult.participants > 10) {
        highestRate = variantResult.completionRate;
        winningVariant = variantId;
      }
    }

    if (winningVariant) {
      results.winningVariant = winningVariant;
    }
  }
}

/**
 * Recommendation-specific A/B tests for MotivationAI
 */
export class RecommendationABTests {
  private framework: ABTestingFramework;

  constructor() {
    this.framework = new ABTestingFramework();
    this.setupExperiments();
  }

  private setupExperiments(): void {
    // Experiment 1: Recommendation Presentation Styles
    this.framework.createExperiment(
      'recommendation_presentation',
      'AI Recommendation Presentation Styles',
      'Test different ways of presenting AI recommendations to users',
      [
        { id: 'A', name: 'Card-based', description: 'Recommendations in card format', weight: 0.33 },
        { id: 'B', name: 'List-based', description: 'Recommendations in list format', weight: 0.33 },
        { id: 'C', name: 'Interactive', description: 'Interactive recommendation widgets', weight: 0.34 },
      ]
    );

    // Experiment 2: Recommendation Timing
    this.framework.createExperiment(
      'recommendation_timing',
      'AI Recommendation Timing',
      'Test optimal timing for delivering AI recommendations',
      [
        { id: 'A', name: 'Morning', description: 'Recommendations delivered in morning', weight: 0.33 },
        { id: 'B', name: 'Evening', description: 'Recommendations delivered in evening', weight: 0.33 },
        { id: 'C', name: 'Real-time', description: 'Recommendations delivered in real-time', weight: 0.34 },
      ]
    );

    // Experiment 3: Recommendation Content Strategy
    this.framework.createExperiment(
      'recommendation_content',
      'AI Recommendation Content Strategy',
      'Test different content strategies for AI recommendations',
      [
        { id: 'A', name: 'Actionable', description: 'Focus on actionable steps', weight: 0.33 },
        { id: 'B', name: 'Inspirational', description: 'Focus on inspirational content', weight: 0.33 },
        { id: 'C', name: 'Hybrid', description: 'Mix of actionable and inspirational', weight: 0.34 },
      ]
    );

    console.log('✅ Recommendation A/B tests set up');
  }

  /**
   * Get variant for a user's recommendation presentation
   */
  getRecommendationPresentation(userId: string): string {
    const assignment = this.framework.assignUserToVariant(userId, 'recommendation_presentation');
    return assignment.variantId;
  }

  /**
   * Get variant for a user's recommendation timing
   */
  getRecommendationTiming(userId: string): string {
    const assignment = this.framework.assignUserToVariant(userId, 'recommendation_timing');
    return assignment.variantId;
  }

  /**
   * Get variant for a user's recommendation content
   */
  getRecommendationContent(userId: string): string {
    const assignment = this.framework.assignUserToVariant(userId, 'recommendation_content');
    return assignment.variantId;
  }

  /**
   * Record completion for recommendation interaction
   */
  recordRecommendationInteraction(userId: string, successMetric: number = 1): void {
    // Record completion for all recommendation experiments
    try {
      this.framework.recordCompletion(userId, 'recommendation_presentation', successMetric);
    } catch (e) {
      // User might not be assigned yet
    }

    try {
      this.framework.recordCompletion(userId, 'recommendation_timing', successMetric);
    } catch (e) {
      // User might not be assigned yet
    }

    try {
      this.framework.recordCompletion(userId, 'recommendation_content', successMetric);
    } catch (e) {
      // User might not be assigned yet
    }
  }

  /**
   * Get experiment results
   */
  getExperimentResults(experimentId: string): ExperimentResults | undefined {
    return this.framework.getExperimentResults(experimentId);
  }

  /**
   * Get all experiment results
   */
  getAllResults(): Record<string, ExperimentResults> {
    const results: Record<string, ExperimentResults> = {};
    const experiments = ['recommendation_presentation', 'recommendation_timing', 'recommendation_content'];
    
    experiments.forEach(expId => {
      const result = this.framework.getExperimentResults(expId);
      if (result) {
        results[expId] = result;
      }
    });

    return results;
  }
}

// Singleton instance for the application
let recommendationABTests: RecommendationABTests | null = null;

export function getRecommendationABTests(): RecommendationABTests {
  if (!recommendationABTests) {
    recommendationABTests = new RecommendationABTests();
  }
  return recommendationABTests;
}