/**
 * Database Seed Script for MotivationAI
 * 
 * This script seeds the database with initial data.
 * Run: npx prisma db seed
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with initial data...');

  // Create sample achievements
  console.log('Creating achievements...');
  const achievements = await prisma.achievement.createMany({
    data: [
      {
        id: 'first_goal',
        name: 'First Step',
        description: 'Complete your first goal',
        icon: '🎯',
        points: 100,
        category: 'milestone',
        rarity: 'common',
      },
      {
        id: 'streak_7',
        name: 'Weekly Warrior',
        description: 'Maintain a 7-day streak',
        icon: '🔥',
        points: 250,
        category: 'streak',
        rarity: 'uncommon',
      },
      {
        id: 'streak_30',
        name: 'Monthly Master',
        description: 'Maintain a 30-day streak',
        icon: '🌟',
        points: 500,
        category: 'streak',
        rarity: 'rare',
      },
      {
        id: 'goal_master',
        name: 'Goal Master',
        description: 'Complete 10 goals',
        icon: '🏆',
        points: 1000,
        category: 'productivity',
        rarity: 'epic',
      },
      {
        id: 'community_contributor',
        name: 'Community Contributor',
        description: 'Make 10 community posts',
        icon: '👥',
        points: 750,
        category: 'social',
        rarity: 'uncommon',
      },
    ],
    skipDuplicates: true,
  });

  // Create sample community groups
  console.log('Creating community groups...');
  const groups = await prisma.communityGroup.createMany({
    data: [
      {
        id: 'health_fitness',
        name: 'Health & Fitness Warriors',
        description: 'A community for people pursuing health and fitness goals',
        category: 'Health & Fitness',
        isPublic: true,
        memberCount: 1245,
        createdBy: 'system',
      },
      {
        id: 'career_growth',
        name: 'Career Growth Network',
        description: 'Professionals helping each other achieve career goals',
        category: 'Career & Business',
        isPublic: true,
        memberCount: 892,
        createdBy: 'system',
      },
      {
        id: 'learning_skills',
        name: 'Learning & Skills Development',
        description: 'Community for continuous learning and skill improvement',
        category: 'Learning',
        isPublic: true,
        memberCount: 567,
        createdBy: 'system',
      },
      {
        id: 'financial_freedom',
        name: 'Financial Freedom Journey',
        description: 'Achieving financial goals and building wealth',
        category: 'Finance',
        isPublic: true,
        memberCount: 432,
        createdBy: 'system',
      },
    ],
    skipDuplicates: true,
  });

  // Create sample challenges
  console.log('Creating challenges...');
  const challenges = await prisma.challenge.createMany({
    data: [
      {
        id: 'new_year_challenge',
        name: 'New Year Resolution Challenge',
        description: 'Start the year strong with 30 days of consistent goal setting',
        duration: 30,
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-01-31'),
        participationPoints: 100,
        completionReward: 500,
        participants: 1250,
        isActive: true,
      },
      {
        id: 'spring_fitness',
        name: 'Spring Fitness Challenge',
        description: 'Get fit for spring with daily exercise goals',
        duration: 21,
        startDate: new Date('2026-03-15'),
        endDate: new Date('2026-04-05'),
        participationPoints: 75,
        completionReward: 300,
        participants: 890,
        isActive: true,
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Database seeded successfully!');
  console.log(`Created: ${achievements.count} achievements`);
  console.log(`Created: ${groups.count} community groups`);
  console.log(`Created: ${challenges.count} challenges`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });