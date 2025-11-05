const cors = require('cors');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swagger');
const path = require('path');

const securityMiddleware = require('./middleware/security');
const indexRoutes = require('./routes');
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const projectsRoutes = require('./routes/projects');
const modulesRoutes = require('./routes/modules');
const uploadsRoutes = require('./routes/uploads');

// Initialize express app
const app = express();

/**
 * CORS
 * Supports:
 * - Single origin string (e.g., http://localhost:3000)
 * - Comma-separated list (e.g., http://localhost:3000,https://staging.example.com)
 * - "*" for fully open (development)
 */
const corsOriginEnv = process.env.CORS_ORIGIN || '*';
let allowedOrigins = corsOriginEnv;

if (corsOriginEnv && corsOriginEnv !== '*') {
  allowedOrigins = corsOriginEnv
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
}

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser or curl
    if (corsOriginEnv === '*') return callback(null, true);
    if (Array.isArray(allowedOrigins) && allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('CORS not allowed for origin: ' + origin), false);
  },
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Security & rate limiting
securityMiddleware(app);

app.set('trust proxy', true);

// OpenAPI docs with dynamic server url
app.use('/docs', swaggerUi.serve, (req, res, next) => {
  const host = req.get('host');
  let protocol = req.protocol;
  const actualPort = req.socket.localPort;
  const hasPort = host.includes(':');

  const needsPort =
    !hasPort &&
    ((protocol === 'http' && actualPort !== 80) ||
      (protocol === 'https' && actualPort !== 443));
  const fullHost = needsPort ? `${host}:${actualPort}` : host;
  protocol = req.secure ? 'https' : protocol;

  const dynamicSpec = {
    ...swaggerSpec,
    servers: [{ url: `${protocol}://${fullHost}` }],
  };
  swaggerUi.setup(dynamicSpec, { explorer: true })(req, res, next);
});

// Parse JSON request body
app.use(express.json({ limit: '5mb' }));

// Static for uploaded files
app.use('/uploads', express.static(path.join(process.cwd(), process.env.UPLOAD_DIR || 'uploads')));

// Mount routes
app.use('/', indexRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api', modulesRoutes);
app.use('/api/uploads', uploadsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
  });
});

module.exports = app;
