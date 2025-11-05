const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'UPSTDC Project Monitoring API',
      version: '1.0.0',
      description: 'REST API for UPSTDC Project Monitoring System. Includes auth, RBAC, CRUD modules, uploads and reporting.',
    },
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      },
      schemas: {
        Project: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            budget: { type: 'number' },
            start_date: { type: 'string', format: 'date' },
            end_date: { type: 'string', format: 'date', nullable: true },
            latitude: { type: 'number', nullable: true },
            longitude: { type: 'number', nullable: true },
            status: { type: 'string', enum: ['PLANNED', 'ONGOING', 'COMPLETED', 'ON_HOLD'] }
          },
          required: ['name', 'budget']
        }
      }
    },
    tags: [
      { name: 'Auth' },
      { name: 'Users' },
      { name: 'Projects' },
      { name: 'tenders' },
      { name: 'contractors' },
      { name: 'contracts' },
      { name: 'milestones' },
      { name: 'payments' },
      { name: 'inspections' },
      { name: 'handovers' },
      { name: 'reports' },
      { name: 'Uploads' },
    ],
    security: [{ bearerAuth: [] }]
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
