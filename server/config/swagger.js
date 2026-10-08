const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Bharat Land Research & Governance Portal API',
      version: '1.0.0',
      description:
        'API documentation for SIH26019 – National Digital Platform for Research, Policy Innovation, and Evidence-Based Land Governance',
      contact: {
        name: 'SIH Team',
        email: 'support@bharatlandportal.gov.in',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
