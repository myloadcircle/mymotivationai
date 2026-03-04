/**
 * MotivationAI - Deployment Configuration
 * 
 * This file contains deployment configuration for different environments.
 * Update these settings based on your deployment platform.
 */

const deploymentConfig = {
  // Production Environment
  production: {
    name: 'Production',
    domain: 'mymotivationai.com',
    apiDomain: 'api.mymotivationai.com',
    database: {
      provider: 'postgresql',
      connectionPool: {
        max: 20,
        min: 5,
        idleTimeout: 30000,
        connectionTimeout: 2000,
      },
      ssl: true,
    },
    caching: {
      redis: {
        enabled: true,
        url: process.env.REDIS_URL,
        ttl: 3600, // 1 hour
      },
    },
    monitoring: {
      sentry: {
        dsn: process.env.SENTRY_DSN,
        tracesSampleRate: 0.1,
      },
      uptime: {
        enabled: true,
        checkInterval: 60, // seconds
      },
    },
    scaling: {
      minInstances: 2,
      maxInstances: 10,
      memory: '1GB',
      cpu: '0.5',
    },
  },

  // Staging Environment
  staging: {
    name: 'Staging',
    domain: 'staging.mymotivationai.com',
    apiDomain: 'api-staging.mymotivationai.com',
    database: {
      provider: 'postgresql',
      connectionPool: {
        max: 10,
        min: 2,
        idleTimeout: 30000,
      },
      ssl: true,
    },
    caching: {
      redis: {
        enabled: false,
      },
    },
    scaling: {
      minInstances: 1,
      maxInstances: 3,
      memory: '512MB',
      cpu: '0.25',
    },
  },

  // Development Environment
  development: {
    name: 'Development',
    domain: 'localhost:3000',
    apiDomain: 'localhost:3000',
    database: {
      provider: 'postgresql',
      connectionPool: {
        max: 5,
        min: 1,
        idleTimeout: 30000,
      },
      ssl: false,
    },
    caching: {
      redis: {
        enabled: false,
      },
    },
    scaling: {
      minInstances: 1,
      maxInstances: 1,
    },
  },

  // Common Configuration
  common: {
    // Security Headers (already configured in next.config.js)
    securityHeaders: {
      hsts: 'max-age=63072000; includeSubDomains; preload',
      xFrameOptions: 'SAMEORIGIN',
      xContentTypeOptions: 'nosniff',
      xXSSProtection: '1; mode=block',
      referrerPolicy: 'origin-when-cross-origin',
      permissionsPolicy: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
    },

    // CORS Configuration
    cors: {
      origins: [
        'https://mymotivationai.com',
        'https://www.mymotivationai.com',
        'https://staging.mymotivationai.com',
        'http://localhost:3000',
        'http://localhost:3001',
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: true,
    },

    // Rate Limiting
    rateLimiting: {
      enabled: true,
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      standardHeaders: true,
      legacyHeaders: false,
    },

    // Logging Configuration
    logging: {
      level: process.env.LOG_LEVEL || 'info',
      format: 'json',
      transports: ['console', 'file'],
      file: {
        filename: 'logs/app.log',
        maxsize: 10485760, // 10MB
        maxFiles: 5,
      },
    },

    // Feature Flags
    features: {
      community: process.env.COMMUNITY_FEATURES_ENABLED === 'true',
      gamification: process.env.GAMIFICATION_ENABLED === 'true',
      ai: process.env.AI_SERVICE_ENABLED === 'true',
      realtime: process.env.REAL_TIME_UPDATES_ENABLED === 'true',
      analytics: process.env.ANALYTICS_ENABLED === 'true',
    },

    // Performance Configuration
    performance: {
      compression: true,
      brotli: true,
      cacheControl: {
        static: 'public, max-age=31536000, immutable',
        dynamic: 'public, max-age=0, must-revalidate',
      },
      imageOptimization: {
        quality: 75,
        formats: ['webp', 'avif'],
        sizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
      },
    },
  },
};

// Export configuration based on environment
const getConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  return {
    ...deploymentConfig.common,
    ...deploymentConfig[env],
    environment: env,
  };
};

module.exports = {
  deploymentConfig,
  getConfig,
};