import * as Yup from 'yup';
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
    const { page = 1 } = req.query;

    const clientes = await Clientes.findAll({
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
      limit: 20,
      offset: (page - 1) * 20,
    });

    return res.json(clientes);
  }
}

export default new ClientesController();
