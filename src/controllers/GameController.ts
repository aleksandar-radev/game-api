import { AuthRequest } from '../helpers/request';
import { Service } from 'typedi';
import { plainToInstance } from 'class-transformer';
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Req,
  UseBefore,
  Body,
  HttpCode,
  Param,
  QueryParams,
} from 'routing-controllers';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import { Repository } from 'typeorm';
import { AppDataSource } from '../database/connection';
import { Game } from '../entities/Game';
import { BadRequestError } from '../helpers/error';
import { UserNameDto } from '../dto/UserNameDto';

@Controller('/games')
@Service()
export class GameController {
  private gameRepository: Repository<Game>;

  constructor() {
    this.gameRepository = AppDataSource.getRepository(Game);
  }

  @Get('/')
  @HttpCode(200)
  async getAllGames(@QueryParams() query: any) {
    // Implement filtering by type, featured, etc.
    const options: any = {
      where: {},
      order: { createdAt: 'DESC' },
    };

    if (query.type) {
      options.where.type = query.type;
    }

    if (query.featured === 'true') {
      options.where.isFeatured = true;
    }

    if (query.status) {
      options.where.status = query.status;
    } else {
      options.where.status = 'active'; // Default to only active games
    }

    return this.gameRepository.find(options);
  }

  @Get('/featured')
  @HttpCode(200)
  async getFeaturedGames() {
    return this.gameRepository.find({
      where: { isFeatured: true, status: 'active' },
      order: { createdAt: 'DESC' },
    });
  }

  @Get('/:idOrName')
  @HttpCode(200)
  async getGame(@Param('idOrName') idOrName: string) {
    // Support fetching by numeric id or by game name
    let game;

    // If the param is an integer string, treat it as an id
    if (/^\d+$/.test(idOrName)) {
      const id = Number(idOrName);
      game = await this.gameRepository.findOne({
        where: { id },
        relations: ['uploadedBy', 'comments', 'comments.user'],
      });
    } else {
      // Otherwise, look up by name
      game = await this.gameRepository.findOne({
        where: { name: idOrName },
        relations: ['uploadedBy', 'comments', 'comments.user'],
      });
    }

    if (!game) {
      throw new BadRequestError('Game not found');
    }

    // Sanitize nested user objects using DTO so password is excluded
    if (game.uploadedBy) {
      game.uploadedBy = plainToInstance(UserNameDto, game.uploadedBy) as any;
    }

    if (game.comments && Array.isArray(game.comments)) {
      game.comments = game.comments.map((c) => {
        if (c.user) {
          c.user = plainToInstance(UserNameDto, c.user) as any;
        }
        return c;
      });
    }

    return game;
  }

  @Post('/')
  @HttpCode(201)
  @UseBefore(AuthMiddleware)
  async createGame(@Body() gameData: Partial<Game>, @Req() req: AuthRequest) {
    if (!req.user?.id) {
      throw new BadRequestError('User must be logged in');
    }

    // Validate required fields
    if (!gameData.name || !gameData.title || !gameData.type) {
      throw new BadRequestError('Name, title and type are required');
    }

    const game = this.gameRepository.create({
      ...gameData,
      uploadedById: req.user.id,
      status: 'active',
    });

    return await this.gameRepository.save(game);
  }

  @Put('/:id')
  @HttpCode(200)
  @UseBefore(AuthMiddleware)
  async updateGame(@Param('id') id: number, @Body() gameData: Partial<Game>, @Req() req: AuthRequest) {
    const game = await this.gameRepository.findOne({ where: { id } });

    if (!game) {
      throw new BadRequestError('Game not found');
    }

    // Only the uploader or admin can update the game
    if (game.uploadedById !== req.user?.id && req.user?.role !== 'admin') {
      throw new BadRequestError('Unauthorized to update this game');
    }

    await this.gameRepository.update(id, gameData);
    return await this.gameRepository.findOne({ where: { id } });
  }

  @Put('/:name/version')
  @HttpCode(200)
  @UseBefore(AuthMiddleware)
  async updateGameVersion(@Param('name') name: string, @Body() body: any, @Req() req: AuthRequest) {
    const newVersion = body?.version;
    if (!newVersion || typeof newVersion !== 'string') {
      throw new BadRequestError('version is required');
    }

    // Only admin can update the version
    if (req.user?.role !== 'admin') {
      throw new BadRequestError('Unauthorized to update game version');
    }

    // Find game by name instead of id
    const game = await this.gameRepository.findOne({ where: { name } });
    if (!game) {
      throw new BadRequestError('Game not found');
    }

    await this.gameRepository.update({ id: game.id }, { version: newVersion });
    return await this.gameRepository.findOne({ where: { id: game.id } });
  }

  @Delete('/:id')
  @HttpCode(200)
  @UseBefore(AuthMiddleware)
  async deleteGame(@Param('id') id: number, @Req() req: AuthRequest) {
    const game = await this.gameRepository.findOne({ where: { id } });

    if (!game) {
      throw new BadRequestError('Game not found');
    }

    // Only the uploader or admin can delete the game
    if (game.uploadedById !== req.user?.id && req.user?.role !== 'admin') {
      throw new BadRequestError('Unauthorized to delete this game');
    }

    // Soft delete
    await this.gameRepository.update(id, { status: 'deleted' });
    return { message: 'Game deleted successfully' };
  }
}
