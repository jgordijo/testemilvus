import * as Yup from 'yup';
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
}

export default new UsuariosController();
