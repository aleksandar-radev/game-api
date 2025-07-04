import { Controller, Get, Post, Body, Patch, Param, UseBefore, Req, QueryParam } from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { GameDataService } from '../services/GameDataService';
import { CreateGameDataDto } from '../dto/CreateGameDataDto';
import { UpdateGameDataRequestDto } from '../dto/UpdateGameDataDto';
import { GameDataRepository } from '../repositories/GameDataRepository';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import { AuthRequest } from '../helpers/request';
import { UserRepository } from '../repositories/UserRepository';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { GameDataResponseDto } from '../dto/GameDataResponseDto';
import crypt from '../helpers/crypt';
import { GameRepository } from '../repositories/GameRepository';

@Service()
@Controller('/game-data')
@UseBefore(AuthMiddleware)
export class GameDataController {
  constructor(
    @Inject() private gameDataService: GameDataService,
    @Inject() private gameDataRepository: GameDataRepository,
    @Inject() private userRepository: UserRepository,
    @Inject() private gameRepository: GameRepository,
  ) {}

  @Post('/')
  async create(@Req() req: AuthRequest, @Body() createGameDataDto: CreateGameDataDto) {
    if (!req.user?.id) {
      throw new Error('Unexpected error, user not logged in');
    }
    const userId = req.user.id;

    // 1. Find the game by name
    const game = await this.gameRepository.findOne({ where: { name: createGameDataDto.game_name } });
    if (!game) {
      throw new Error('Game not found');
    }

    const gameData = this.gameDataRepository.create({
      ...createGameDataDto,
      user: { id: userId },
      game: { id: game.id }, // Set the game relation
    });

    const gameDataExists = await this.gameDataRepository.getByUserIdAndPremium(userId, gameData.premium);

    if (gameDataExists) {
      throw new Error('User data already exists');
    }

    return await this.gameDataRepository.save(gameData);
  }

  @Get('/leaderboard')
  async leaderboard(@Req() _req: AuthRequest, @QueryParam('gameName') gameName?: string) {
    const data = await this.gameDataService.getLeaderboardData(gameName);

    return instanceToPlain(data);
  }

  @Get('/:userId')
  async findOne(
    @Req() req: AuthRequest,
    @Param('userId') userId: number,
    @QueryParam('premium') premium: string = 'no',
    @QueryParam('gameName') gameName: string = '',
  ) {
    if (!req.user?.id) {
      throw new Error('Unexpected error, user not logged in');
    }
    const loggedInUser = req.user;

    const gameData = await this.gameDataRepository.findOne({
      where: { user: { id: userId }, premium, game: { name: gameName } },
      relations: ['user'],
    });

    if (!gameData || (gameData.user.id !== loggedInUser.id && loggedInUser?.role !== 'admin')) {
      throw new Error('User data not found / Unauthorized');
    }

    return plainToInstance(GameDataResponseDto, gameData);
  }

  @Get('/')
  async findAll(@Req() _req: AuthRequest) {
    // const loggedInUser = req.user;
    return await this.gameDataRepository.find({
      // where: { user: { id: loggedInUser.id } },
      relations: ['user'],
    });
  }

  @Patch('/:id')
  async update(
    @Param('id') userId: number,
    @Req() req: AuthRequest,
    @Body() updateGameDataDto: UpdateGameDataRequestDto,
  ) {
    if (!req.user?.id) {
      throw new Error('Unexpected error, user not logged in');
    }
    const loggedInUser = req.user;

    if (userId !== loggedInUser.id && loggedInUser?.role !== 'admin') {
      throw new Error('User data not found / Unauthorized');
    }

    // 1. Find the game by name
    const game = await this.gameRepository.findOne({ where: { name: updateGameDataDto.game_name } });
    if (!game) {
      throw new Error('Game not found');
    }

    const decryptedData = crypt.decrypt(updateGameDataDto.data_json);
    const formattedData = this.gameDataService.formatDataJson(decryptedData);

    // Add the game relation
    formattedData.game = game;

    return await this.gameDataRepository.updateAndGet(userId, formattedData);
  }
}
