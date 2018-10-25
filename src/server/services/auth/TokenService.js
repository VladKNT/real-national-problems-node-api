import JwtService from './JwtService';
import tokenConf from '../../config/token';

export default class TokenService {
  static async createToken (user, configType) {
    try {
      const { id, email, username, role } = user;
      const { type, expiresIn, secret } = configType === 'access' ?  tokenConf.access : tokenConf.refresh;

      const payload = {
        email,
        username,
        role,
        tokenType: type
      };

      const options = {
        algorithm: 'HS512',
        subject: id.toString(),
        expiresIn
      };

      return await JwtService.sign(payload, secret, options);
    } catch (error) {
      throw new Error(error);
    }
  }
};
