import { Router } from 'express';

import authMiddleware from './app/middlewares/auth';

import UsuariosController from './app/controllers/UsuariosController';

import ClientesController from './app/controllers/ClientesController';

import SessionController from './app/controllers/SessionController';

const routes = new Router();

routes.post('/usuario/cadastro', UsuariosController.store);
routes.post('/login', SessionController.store);

routes.use(authMiddleware);

routes.post('/cliente/cadastro', ClientesController.store);
routes.get('/clientes/', ClientesController.index);

export default routes;
