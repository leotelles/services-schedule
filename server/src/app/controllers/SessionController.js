import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import User from '../models/User';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {

    // validando dados de entrada com Yup
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required()
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails' });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'User not found.' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match.' });
    }

    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email
      },
      // 1º parametro: id
      // 2º parametro: string única (gerar em https://www.md5online.org/)
      // 3º parametro: data de expiração
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn
      })
    })
  }
}

export default new SessionController();
