/**
 * ==============================================================================
 * CAMBIUM RESEARCH PLATFORM — PM2 ENTERPRISE PROCESS SUPERVISION
 * Production Cluster Topology, Zero-Downtime Reloads, and Self-Healing
 * Document ID: PM2-CAMBIUM-2026-V2
 * ==============================================================================
 */

module.exports = {
  apps: [
    // --------------------------------------------------------------------------
    // 1. NestJS 10 Core Application API Cluster
    // --------------------------------------------------------------------------
    {
      name: 'cambium-server',
      cwd: './server',
      script: 'dist/src/main.js',
      instances: process.env.PM2_INSTANCES || 'max',
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '1024M',
      restart_delay: 3000,
      exp_backoff_restart_delay: 100,
      max_restarts: 10,
      min_uptime: '10s',
      listen_timeout: 10000,
      kill_timeout: 5000,
      wait_ready: true,
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
      error_file: './logs/server-error.log',
      out_file: './logs/server-out.log',
      merge_logs: true,
      time: true,
    },

    // --------------------------------------------------------------------------
    // 2. Next.js 15 Living Materials Presentation Client
    // --------------------------------------------------------------------------
    {
      name: 'cambium-client',
      cwd: './client',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      instances: 2,
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '1536M',
      restart_delay: 3000,
      exp_backoff_restart_delay: 100,
      max_restarts: 10,
      min_uptime: '10s',
      kill_timeout: 5000,
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: './logs/client-error.log',
      out_file: './logs/client-out.log',
      merge_logs: true,
      time: true,
    },
  ],
};

