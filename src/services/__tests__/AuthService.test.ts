import { AuthService } from '../AuthService';
import { UserRepository } from '../../repositories/UserRepository';
import { User } from '../../entities/User';
import bcrypt from 'bcryptjs';
import { Response } from 'express';
import { BadRequestError } from '../../helpers/error';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: UserRepository;

  beforeEach(() => {
    userRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
    } as unknown as UserRepository;
    authService = new AuthService(userRepository);
  });

  describe('hashPassword', () => {
    it('should hash the password correctly', async () => {
      const password = 'password123';
      const hashedPassword = await authService.hashPassword(password);
      expect(bcrypt.compareSync(password, hashedPassword)).toBe(true);
    });
  });

  describe('comparePassword', () => {
    it('should return true for matching passwords', async () => {
      const password = 'password123';
      const user = new User({ password: await bcrypt.hash(password, 10) });
      const result = await authService.comparePassword(password, user);
      expect(result).toBe(true);
    });

    it('should return false for non-matching passwords', async () => {
      const password = 'password123';
      const user = new User({
        password: await bcrypt.hash('otherpassword', 10),
      });
      const result = await authService.comparePassword(password, user);
      expect(result).toBe(false);
    });
  });

  describe('generateToken', () => {
    it('should generate a JWT token', () => {
      const user = new User({ id: 1 });
      const res = {
        cookie: jest.fn(),
      } as unknown as Response;
      authService.generateToken(res, user);
      expect(res.cookie).toHaveBeenCalledWith('jwt', expect.any(String), expect.any(Object));
    });

    it('should throw an error if user is undefined', () => {
      const res = {} as Response;
      expect(() => authService.generateToken(res, undefined)).toThrowError(
        'Fatal error. id not found !? #generateToken',
      );
    });
  });

  describe('clearToken', () => {
    it('should clear the JWT token', () => {
      const res = {
        cookie: jest.fn(),
      } as unknown as Response;
      authService.clearToken(res);
      expect(res.cookie).toHaveBeenCalledWith('jwt', '', expect.any(Object));
    });
  });

  describe('validateRegistration', () => {
    it('should throw an error if any required field is missing', async () => {
      await expect(
        authService.validateRegistration('', 'test@example.com', 'password', 'password'),
      ).rejects.toThrowError(BadRequestError);
      await expect(authService.validateRegistration('username', '', 'password', 'password')).rejects.toThrowError(
        BadRequestError,
      );
      await expect(
        authService.validateRegistration('username', 'test@example.com', '', 'password'),
      ).rejects.toThrowError(BadRequestError);
      await expect(
        authService.validateRegistration('username', 'test@example.com', 'password', ''),
      ).rejects.toThrowError(BadRequestError);
    });

    it('should throw an error if passwords do not match', async () => {
      await expect(
        authService.validateRegistration('username', 'test@example.com', 'password', 'otherpassword'),
      ).rejects.toThrowError(BadRequestError);
    });

    it('should throw an error if password is too short', async () => {
      await expect(
        authService.validateRegistration('username', 'test@example.com', 'pass', 'pass'),
      ).rejects.toThrowError(BadRequestError);
    });

    it('should throw an error if user already exists', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValueOnce(new User({}));
      await expect(
        authService.validateRegistration('username', 'test@example.com', 'password', 'password'),
      ).rejects.toThrowError(BadRequestError);
    });

    it('should not throw an error if registration is valid', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValueOnce(undefined);
      await expect(
        authService.validateRegistration('username', 'test@example.com', 'password', 'password'),
      ).resolves.not.toThrow();
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      (userRepository.save as jest.Mock).mockResolvedValueOnce(new User({}));
      const user = await authService.createUser('username', 'test@example.com', 'password');
      expect(user).toBeInstanceOf(User);
      expect(user.username).toBe('username');
      expect(user.email).toBe('test@example.com');
      expect(user.password).not.toBe('password');
    });
  });
});
