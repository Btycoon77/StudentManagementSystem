
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';


const swaggerJSDocs = YAML.load("api.yaml"); 

module.exports = {swaggerServe: swaggerUi,swaggerSetup:swaggerUi.setup(swaggerJSDocs)};

