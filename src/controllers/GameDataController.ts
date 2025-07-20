import { Controller, Get, Body, Patch, Param, UseBefore, Req, QueryParam, NotFoundError } from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { GameDataService } from '../services/GameDataService';
import { UpdateGameDataRequestDto } from '../dto/UpdateGameDataDto';
import { GameDataRepository } from '../repositories/GameDataRepository';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import { AuthRequest } from '../helpers/request';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { GameDataResponseDto } from '../dto/GameDataResponseDto';
import crypt from '../helpers/crypt';
import { GameRepository } from '../repositories/GameRepository';

@Service()
@Controller('/game-data')
export class GameDataController {
  constructor(
    @Inject() private gameDataService: GameDataService,
    @Inject() private gameDataRepository: GameDataRepository,
    @Inject() private gameRepository: GameRepository,
  ) {}

  @Get('/leaderboard')
  async leaderboard(@Req() _req: AuthRequest, @QueryParam('gameName') gameName?: string) {
    const data = await this.gameDataService.getLeaderboardData(gameName);

    return instanceToPlain(data);
  }

  @Get('/:userId')
  @UseBefore(AuthMiddleware)
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
      throw new NotFoundError('User data not found / Unauthorized');
    }

    const plainData  = plainToInstance(GameDataResponseDto, gameData);
    plainData.data_json = crypt.encrypt(plainData.data_json);

    return plainData;
  }

  @Get('/')
  @UseBefore(AuthMiddleware)
  async findAll(@Req() _req: AuthRequest) {
    // const loggedInUser = req.user;
    return await this.gameDataRepository.find({
      // where: { user: { id: loggedInUser.id } },
      relations: ['user'],
    });
  }

  @Patch('/:id')
  @UseBefore(AuthMiddleware)
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

    // 2. Check if the game data record exists
    let gameData = await this.gameDataRepository.findOne({
      where: { user: { id: userId }, game: { id: game.id }, premium: 'no' },
    });

    // 3. If not, create an empty record
    if (!gameData) {
      gameData = await this.gameDataRepository.save(
        this.gameDataRepository.create({
          user: { id: userId },
        }),
      );
    }

    const decryptedData = crypt.decrypt(updateGameDataDto.data_json);
    const formattedData = this.gameDataService.formatDataJson(decryptedData);

    // Add the game relation
    formattedData.game = game;

    const updatedData = await this.gameDataRepository.updateAndGet(userId, formattedData);

    if (!updatedData || !updatedData.data_json) {
      throw new NotFoundError('Game data not found for the user');
    }
    // Encrypt the data_json before returning
    updatedData.data_json = crypt.encrypt(updatedData.data_json);

    return updatedData;
  }
}
