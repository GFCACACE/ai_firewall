export interface FirewallConfig {
  server: {
    port: number;
    host: string;
  };
  modules: {
    inputOutputControls: boolean;
    promptProtection: boolean;
    contextProtection: boolean;
    logging: boolean;
  };
  redis: {
    host: string;
    port: number;
    password?: string;
  };
  database: {
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
  };
}

export interface SecurityModule {
  name: string;
  enabled: boolean;
  process(content: string): Promise<SecurityResult>;
}

export interface SecurityResult {
  allowed: boolean;
  confidence: number;
  reason?: string;
  modifiedContent?: string;
}

export interface LogEntry {
  timestamp: Date;
  requestId: string;
  module: string;
  result: SecurityResult;
  originalContent: string;
  clientIp: string;
}