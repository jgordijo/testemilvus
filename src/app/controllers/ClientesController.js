import * as Yup from 'yup';
import { Op } from 'sequelize';
import Clientes from '../models/Clientes';

class ClientesController {
  async store(req, res) {
    const schema = Yup.object().shape({
      cnpj: Yup.string().required(),
      nome_fantasia: Yup.string().required(),
      razao_social: Yup.string().required(),
      cep: Yup.string().required(),
      logradouro: Yup.string().required(),
      numero: Yup.string().required(),
      complemento: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Preencha os campos solicitados.' });
    }
    const ClienteExists = await Clientes.findOne({
      where: { cnpj: req.body.cnpj },
    });

    if (ClienteExists) {
      return res.status(400).json({ error: 'Cliente já existe.' });
    }

    const { id, cnpj, razao_social, nome_fantasia } = await Clientes.create(
      req.body
    );

    return res.json({
      id,
      cnpj,
      razao_social,
      nome_fantasia,
    });
  }

  async index(req, res) {
    const { page = 1, limit = 10 } = req.query;

    const clientes = await Clientes.findAndCountAll({
      where: { active: true },
      order: ['id'],
      attributes: [
        'id',
        'cnpj',
        'razao_social',
        'nome_fantasia',
        'cep',
        'logradouro',
        'numero',
      ],
      limit,
      offset: (page - 1) * limit,
    });

    return res.json(clientes);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      cnpj: Yup.string(),
      nome_fantasia: Yup.string(),
      razao_social: Yup.string(),
      cep: Yup.string(),
      logradouro: Yup.string(),
      numero: Yup.string(),
      complemento: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Preencha os campos solicitados.' });
    }

    const { cnpj } = req.body;

    const cliente = await Clientes.findByPk(req.params.id);

    const clienteExists = await cliente;

    if (!clienteExists) {
      return res.status(400).json({ error: 'Cliente não existe.' });
    }

    if (cnpj && cnpj !== cliente.email) {
      const checkCnpj = await Clientes.findOne({ where: { cnpj } });

      if (checkCnpj) {
        return res
          .status(400)
          .json({ error: 'Já existe um cliente com esse CNPJ.' });
      }
    }

    await cliente.update(req.body);

    return res.json(cliente);
  }

  async remove(req, res) {
    const cliente = await Clientes.findByPk(req.params.id);

    const clienteExists = await cliente;

    if (!clienteExists) {
      return res.status(400).json({ error: 'Cliente não existe.' });
    }

    cliente.active = false;

    await cliente.save();

    return res.json(cliente);
  }

  async showOne(req, res) {
    const cliente = await Clientes.findByPk(req.params.id);

    const clienteExists = await cliente;

    if (!clienteExists) {
      return res.status(400).json({ error: 'Cliente não existe.' });
    }

    return res.json(cliente);
  }

  async search(req, res) {
    const {
      page = 1,
      limit = 10,
      order_field = 'id',
      is_descending = false,
    } = req.query;

    const {
      cnpj,
      razao_social,
      nome_fantasia,
      cep,
      logradouro,
      numero,
      active,
    } = req.body;

    const where = {};

    const descending = is_descending ? 'DESC' : 'ASC';

    const order = [[order_field, descending]];

    if (cnpj) {
      where.cnpj = { [Op.iLike]: `%${cnpj}%` };
    }

    if (razao_social) {
      where.razao_social = { [Op.iLike]: `%${razao_social}%` };
    }

    if (nome_fantasia) {
      where.nome_fantasia = { [Op.iLike]: `%${nome_fantasia}%` };
    }

    if (cep) {
      where.cep = { [Op.iLike]: `%${cep}%` };
    }

    if (logradouro) {
      where.logradouro = { [Op.iLike]: `%${logradouro}%` };
    }

    if (numero) {
      where.numero = { [Op.eq]: numero };
    }

    if (active === 'false' || active === false) {
      where.active = { [Op.eq]: false };
    } else {
      where.active = { [Op.eq]: true };
    }

    const clientes = await Clientes.findAndCountAll({
      where,
      order,
      attributes: [
        'id',
        'cnpj',
        'razao_social',
        'nome_fantasia',
        'cep',
        'logradouro',
        'numero',
      ],
      limit,
      offset: (page - 1) * limit,
    });

    return res.json(clientes);
  }
}

export default new ClientesController();
