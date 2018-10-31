import jwt from 'jsonwebtoken';

export default class JwtService {
  static async sign(payload, secret, options) {
    try {
      return await jwt.sign(payload, secret, options);
    } catch (error) {
      throw new Error(error);
    }
  }

  static async verify(token, secret) {
    try {
      return await jwt.verify(token, secret);
    } catch (error) {
      throw new Error(error);
    }
  }

  static async decode(token) {
    try {
      return await jwt.decode(token);
    } catch (error) {
      throw new Error(error);
    }
  }
};
