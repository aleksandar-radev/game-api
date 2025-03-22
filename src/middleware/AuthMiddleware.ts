import { Middleware, ExpressMiddlewareInterface } from 'routing-controllers';
import { Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AuthenticationError } from '../helpers/error';
import { AuthRequest } from '../helpers/request';
import { UserRepository } from '../repositories/UserRepository';
import { Service } from 'typedi';

@Middleware({ type: 'before' })
@Service()
export class AuthMiddleware implements ExpressMiddlewareInterface {
  constructor(private userRepository: UserRepository) {}

  async use(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      let token = req.cookies.jwt;

      if (!token) {
        throw new AuthenticationError('Token not found');
      }

      const jwtSecret = process.env.JWT_SECRET || '';
      const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

      if (!decoded || !decoded.userId) {
        throw new AuthenticationError('UserId not found');
      }

      const user = await this.userRepository.findOne({
        where: { id: decoded.userId },
      });

      if (!user) {
        throw new AuthenticationError('User not found/authenticated');
      }

      req.user = user;
      next();
    } catch (err) {
      next(err);
    }
  }
}
