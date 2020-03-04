import * as Yup from 'yup';
import { Op } from 'sequelize';
import Usuarios from '../models/Usuarios';

class UsuariosController {
  async store(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
      sexo: Yup.string().required(),
      telefone: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Preencha os campos solicitados.' });
    }
    const UsuariosExists = await Usuarios.findOne({
      where: { email: req.body.email },
    });

    if (UsuariosExists) {
      return res.status(400).json({ error: 'Usuario já existe.' });
    }

    const { id, nome, email } = await Usuarios.create(req.body);

    return res.json({
      id,
      nome,
      email,
    });
  }

  async index(req, res) {
    const { page = 1, limit = 10 } = req.query;

    const usuarios = await Usuarios.findAndCountAll({
      where: { active: true },
      order: ['id'],
      attributes: ['id', 'nome', 'email', 'sexo', 'telefone'],
      limit,
      offset: (page - 1) * limit,
    });

    return res.json(usuarios);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
      sexo: Yup.string(),
      telefone: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Preencha os campos solicitados.' });
    }

    const { email, oldPassword } = req.body;

    const usuario = await Usuarios.findByPk(req.params.id);

    if (email && email !== usuario.email) {
      const usuarioExists = await Usuarios.findOne({ where: { email } });

      if (usuarioExists) {
        return res
          .status(400)
          .json({ error: 'Já existe um usuário com esse e-mail.' });
      }
    }

    if (oldPassword && !(await Usuarios.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'A senha antiga não confere.' });
    }

    await usuario.update(req.body);

    return res.json(usuario);
  }

  async remove(req, res) {
    const usuario = await Usuarios.findByPk(req.params.id);

    const usuarioExists = await usuario;

    if (!usuarioExists) {
      return res.status(400).json({ error: 'Usuario não existe.' });
    }

    usuario.active = false;

    await usuario.save();

    return res.json(usuario);
  }

  async showOne(req, res) {
    const usuario = await Usuarios.findByPk(req.params.id);

    const usuarioExists = await usuario;

    if (!usuarioExists) {
      return res.status(400).json({ error: 'Usuario não existe.' });
    }

    return res.json(usuario);
  }

  async search(req, res) {
    const {
      page = 1,
      limit = 10,
      order_field = 'id',
      is_descending = false,
    } = req.query;

    const { nome, email, sexo, telefone, active } = req.body;

    const where = {};

    const descending = is_descending ? 'DESC' : 'ASC';

    const order = [[order_field, descending]];

    if (nome) {
      where.nome = { [Op.iLike]: `%${nome}%` };
    }

    if (email) {
      where.email = { [Op.iLike]: `%${email}%` };
    }

    if (sexo) {
      where.sexo = { [Op.iLike]: `%${sexo}%` };
    }

    if (telefone) {
      where.telefone = { [Op.eq]: telefone };
    }

    if (active === 'false' || active === false) {
      where.active = { [Op.eq]: false };
    } else {
      where.active = { [Op.eq]: true };
    }

    const usuarios = await Usuarios.findAndCountAll({
      where,
      order,
      attributes: ['id', 'nome', 'email', 'sexo', 'telefone'],
      limit,
      offset: (page - 1) * limit,
    });

    return res.json(usuarios);
  }
}

export default new UsuariosController();
