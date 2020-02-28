import jwt from 'jsonwebtoken';

import authConfig from '../../config/auth';
import Usuarios from '../models/Usuarios';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const usuario = await Usuarios.findOne({ where: { email } });

    if (!usuario) {
      return res.status(401).json({ error: 'Usuario não existe' });
    }

    if (!(await usuario.checkPassword(password))) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    const { id, nome } = usuario;

    return res.json({
      usuario: {
        id,
        nome,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
