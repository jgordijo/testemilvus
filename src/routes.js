import { Router } from 'express';

import authMiddleware from './app/middlewares/auth';

import paramValidationMiddleware from './app/middlewares/paramValidation';

import UsuariosController from './app/controllers/UsuariosController';

import ClientesController from './app/controllers/ClientesController';

import SessionController from './app/controllers/SessionController';

const routes = new Router();

routes.post('/usuario/cadastro', UsuariosController.store);

routes.post('/login', SessionController.store);

routes.use(authMiddleware);

routes.post('/cliente/cadastro', ClientesController.store);
routes.get('/clientes/', paramValidationMiddleware, ClientesController.index);
routes.put('/cliente/:id', ClientesController.update);
routes.delete('/cliente/:id', ClientesController.remove);
routes.get('/cliente/:id', ClientesController.showOne);
routes.post(
  '/cliente/busca',
  paramValidationMiddleware,
  ClientesController.search
);

routes.get('/usuarios', paramValidationMiddleware, UsuariosController.index);
routes.put('/usuario/:id', UsuariosController.update);
routes.get('/usuario/:id', UsuariosController.showOne);
routes.delete('/usuario/:id', UsuariosController.remove);
routes.post(
  '/usuario/busca',
  paramValidationMiddleware,
  UsuariosController.search
);

export default routes;
