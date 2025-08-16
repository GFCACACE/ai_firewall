import { readFileSync } from 'fs';
import { parse } from 'yaml';
import type { FirewallConfig } from '../types/index.js';

export function loadConfig(configPath: string = './config/firewall.yaml'): FirewallConfig {
  try {
    const fileContents = readFileSync(configPath, 'utf8');
    const config = parse(fileContents) as FirewallConfig;
    
    // Validate required fields
    if (!config.server?.port || !config.server?.host) {
      throw new Error('Server configuration is required');
    }
    
    return config;
  } catch (error) {
    console.error('Failed to load configuration:', error);
    process.exit(1);
  }
}