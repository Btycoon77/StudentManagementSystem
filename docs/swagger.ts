import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const options:swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Student Management System API',
      version: '1.0.0',
      description: 'Handling all the functions related to student',
    },
    servers:[
      {
        url:'http://localhost:3000/api/v1'
      } 
    ]
  },
  apis: ["../routes/*.ts"],
   // Path to the API docs
};

const specs = swaggerJsdoc(options);

export default specs;

// module.exports = (app:any) => {
//   app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
// };