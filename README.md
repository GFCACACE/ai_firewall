# AI Firewall

Fast, configurable security layer for AI applications built with Node.js + TypeScript + Fastify.

## Architecture Overview

```
Client Request → Fastify Server → Security Modules → Target API
                      ↓
              Redis Cache + PostgreSQL Logs
```

## Features & Technical Solutions

### 🔒 **Input and Output Controls**
**Problem:** Filter malicious content before it reaches AI models  
**Solution:**
- **Regex patterns** for known attack signatures (injection attempts, admin commands)
- **Content length limits** to prevent DoS attacks
- **Character encoding validation** to block unusual encodings
- **Rate limiting** per IP address using Redis cache
- **Implementation:** `src/modules/input-output-controls.ts`

### ⚙️ **Configurable Modules (Performance vs Security)**
**Problem:** Users need different security levels based on their needs  
**Solution:**
- **YAML configuration** (`config/firewall.yaml`) with hot-reload
- **Module toggle system** - disable expensive features for speed
- **Performance monitoring** - track response times per module
- **Graceful degradation** - continue processing if non-critical modules fail
- **Implementation:** Config-driven module loading in `src/index.ts`

### ⚡ **Parallel Processing**
**Problem:** Multiple security checks slow down requests  
**Solution:**
- **Worker threads** for CPU-intensive tasks (ML models)
- **Promise.allSettled()** for independent security modules
- **Redis pipeline** for batch cache operations  
- **Connection pooling** for PostgreSQL
- **Implementation:** Async/await with concurrent execution

### 📊 **Comprehensive Logging**
**Problem:** Need audit trails and security analytics  
**Solution:**
- **Structured logging** with Pino (JSON format)
- **PostgreSQL** for persistent audit logs
- **Redis** for recent activity caching
- **Log levels:** Request tracking, security violations, performance metrics
- **Data retention** policies for compliance
- **Implementation:** `src/modules/logging.ts`

### 🛡️ **Prompt Protection (Sandwich Defense)**
**Problem:** Prompt injection attacks bypass AI safety  
**Solution:**
- **Sandwich technique:** Wrap user input with protective instructions
- **Character limits:** Prevent context overflow attacks
- **Special character detection:** Block excessive punctuation/symbols
- **Context length awareness:** Truncate safely without breaking prompts
- **Pattern detection:** Identify "ignore previous instructions" variants
- **Implementation:** `src/modules/prompt-protection.ts`

### 🤖 **ML-Based Context Protection**
**Problem:** Advanced attacks need AI detection  
**Solution:**
- **Lightweight ML model** for real-time threat detection
- **Confidence scoring** (0-1) for security decisions
- **Python microservice** integration via HTTP/subprocess
- **Fallback mechanism** when ML service unavailable
- **Model updating** without downtime
- **Cache predictions** in Redis for repeated content
- **Implementation:** `src/modules/ml-protection.ts` + Python service

## Performance Strategy

- **Fast path:** Simple regex checks (< 1ms)
- **Medium path:** Character analysis + caching (< 10ms)  
- **Slow path:** ML analysis for suspicious content only (< 100ms)
- **Redis caching** for repeated content patterns
- **Connection pooling** for all external services

## API Endpoints

- `POST /filter` - Main security filtering endpoint
- `GET /health` - Service health check
- `GET /metrics` - Performance and security metrics
- `POST /config/reload` - Hot reload configuration

## Quick Start

```bash
npm install
npm run dev
curl -X POST http://localhost:3000/filter -d '{"content":"Hello AI"}'
```

## Configuration

Edit `config/firewall.yaml` to enable/disable features:
```yaml
modules:
  inputOutputControls: true    # Fast (< 1ms)
  promptProtection: true       # Medium (< 10ms)  
  contextProtection: false     # Slow (< 100ms) - Disabled by default
  logging: true               # Always enabled for security
```

## Tech Stack

- **Server:** Fastify (30k+ req/s)
- **Language:** TypeScript + Node.js
- **Cache:** Redis
- **Database:** PostgreSQL  
- **ML:** Python microservice (FastAPI)
- **Config:** YAML with hot reload
