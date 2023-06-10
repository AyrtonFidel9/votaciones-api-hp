import express from 'express';
import { routerVotaciones } from './votaciones.router';

const routes = express.Router();

routes.use(routerVotaciones);


export { routes };