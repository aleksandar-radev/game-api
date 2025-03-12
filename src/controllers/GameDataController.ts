import { Controller, Get, Post, Body, Patch, Param, UseBefore, Req, QueryParam } from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { GameDataService } from '../services/GameDataService';
import { CreateGameDataDto } from '../dto/CreateGameDataDto';
import { UpdateGameDataRequestDto } from '../dto/UpdateGameDataDto';
import { GameDataRepository } from '../repositories/GameDataRepository';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import { AuthRequest } from '../helpers/request';
import { UserRepository } from '../repositories/UserRepository';
import { plainToInstance } from 'class-transformer';
import { GameDataResponseDto } from '../dto/GameDataResponseDto';
import crypt from '../helpers/crypt';
import { get } from 'http';

@Service()
@Controller('/game-data')
@UseBefore(AuthMiddleware)
export class GameDataController {
  constructor(
    @Inject() private gameDataService: GameDataService,
    @Inject() private gameDataRepository: GameDataRepository,
    @Inject() private userRepository: UserRepository,
  ) {}

  @Post('/')
  async create(@Req() req: AuthRequest, @Body() createGameDataDto: CreateGameDataDto) {
    if (!req.user?.id) {
      throw new Error('Unexpected error, user not logged in');
    }
    const userId = req.user.id;
    const gameData = this.gameDataRepository.create({
      ...createGameDataDto,
      user: { id: userId },
    });

    const gameDataExists = await this.gameDataRepository.getByUserIdAndPremium(userId, gameData.premium);

    if (gameDataExists) {
      throw new Error('User data already exists');
    }

    return await this.gameDataRepository.save(gameData);
  }

  @Get('/leaderboard')
  async leaderboard(@Req() req: AuthRequest) {
    return this.gameDataService.getLeaderboardData();
  }

  @Get('/:userId')
  async findOne(
    @Req() req: AuthRequest,
    @Param('userId') userId: number,
    @QueryParam('premium') premium: string = 'no',
  ) {
    if (!req.user?.id) {
      throw new Error('Unexpected error, user not logged in');
    }
    const loggedInUser = req.user;

    const gameData = await this.gameDataRepository.findOne({
      where: { user: { id: userId }, premium },
      relations: ['user'],
    });

    if (!gameData || (gameData.user.id !== loggedInUser.id && loggedInUser?.role !== 'admin')) {
      throw new Error('User data not found / Unauthorized');
    }

    return plainToInstance(GameDataResponseDto, gameData);
  }

  @Get('/')
  async findAll(@Req() req: AuthRequest) {
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

    const decryptedData = crypt.decrypt(updateGameDataDto.data_json);
    const formattedData = this.gameDataService.formatDataJson(decryptedData);
    // this.gameDataService.validateDataJson(decryptedData);
    return await this.gameDataRepository.updateAndGet(userId, formattedData);
  }
}
