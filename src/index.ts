import Fastify from 'fastify';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import { loadConfig } from './config/loader.js';
import type { FirewallConfig } from './types/index.js';
import { pino } from 'pino';
import 'pino-pretty'; // Ensure this is imported

const config: FirewallConfig = loadConfig();

const fastify = Fastify({
  logger: {
      level: 'info',
      transport: {
        targets: [
          {
            target: 'pino-pretty',
            options: { colorize: true },
            level: 'info'
          },
          {
            target: 'pino/file',
            options: { 
              destination: './logs/server.log',
              mkdir: true

             },
            level: 'info'
          }
        ]
      }
    }
});

// Security middleware
await fastify.register(helmet);
await fastify.register(cors, {
  origin: true
});

// Health check endpoint
fastify.get('/health', async (request, reply) => {
  return { 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    modules: config.modules
  };
});

// Main firewall endpoint
fastify.post('/filter', async (request, reply) => {
  const { content } = request.body as { content: string };
  
  if (!content) {
    return reply.code(400).send({ error: 'Content is required' });
  }
  
  // TODO: Implement security modules processing
  // For now, just return the content as allowed
  return {
    allowed: true,
    content,
    confidence: 1.0,
    processedBy: Object.keys(config.modules).filter(key => config.modules[key as keyof typeof config.modules])
  };
});

// Start server
const start = async (): Promise<void> => {
  try {
    await fastify.listen({ 
      port: config.server.port, 
      host: config.server.host 
    });
    
    console.log(`🔥 AI Firewall running on http://${config.server.host}:${config.server.port}`);
    console.log(`📋 Enabled modules:`, Object.keys(config.modules).filter(key => 
      config.modules[key as keyof typeof config.modules]
    ));
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start().catch(console.error);