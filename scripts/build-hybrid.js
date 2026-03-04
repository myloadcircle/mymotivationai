#!/usr/bin/env node
/**
 * Hybrid build script - excludes API routes for static export.
 * API routes require a server; hybrid app uses Supabase directly.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const API_DIR = path.join(__dirname, '..', 'app', 'api');
const API_BAK = path.join(__dirname, '..', 'app', '_api_hybrid_bak');

function run() {
  const hasApi = fs.existsSync(API_DIR);
  if (hasApi) {
    console.log('📦 Temporarily moving app/api for static export...');
    fs.renameSync(API_DIR, API_BAK);
  }

  try {
    execSync('npx cross-env NEXT_PUBLIC_IS_HYBRID_APP=true next build', {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..'),
      env: { ...process.env, NEXT_PUBLIC_IS_HYBRID_APP: 'true' },
    });
  } finally {
    if (hasApi && fs.existsSync(API_BAK)) {
      console.log('📦 Restoring app/api...');
      fs.renameSync(API_BAK, API_DIR);
    }
  }
}

run();
