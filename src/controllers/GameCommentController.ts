import { AuthRequest } from '../helpers/request';
import { Service } from 'typedi';
import { Controller, Get, Post, Put, Delete, Req, UseBefore, Body, HttpCode, Param } from 'routing-controllers';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import { Repository } from 'typeorm';
import { AppDataSource } from '../database/connection';
import { GameComment } from '../entities/GameComment';
import { Game } from '../entities/Game';
import { BadRequestError } from '../helpers/error';
import { GameCommentReaction, ReactionType } from '../entities/GameCommentReaction';

@Controller('/game-comments')
@Service()
export class GameCommentController {
  private commentRepository: Repository<GameComment>;
  private gameRepository: Repository<Game>;
  private reactionRepository: Repository<GameCommentReaction>;

  constructor() {
    this.commentRepository = AppDataSource.getRepository(GameComment);
    this.gameRepository = AppDataSource.getRepository(Game);
    this.reactionRepository = AppDataSource.getRepository(GameCommentReaction);
  }

  @Get('/game/:gameId')
  @HttpCode(200)
  async getGameComments(@Param('gameId') gameId: number) {
    const game = await this.gameRepository.findOne({ where: { id: gameId } });

    if (!game) {
      throw new BadRequestError('Game not found');
    }

    return this.commentRepository.find({
      where: { gameId, status: 'active' },
      relations: ['user', 'reactions'],
      order: { createdAt: 'DESC' },
    });
  }

  @Post('/')
  @HttpCode(201)
  @UseBefore(AuthMiddleware)
  async createComment(@Body() commentData: { gameId: number; content: string }, @Req() req: AuthRequest) {
    if (!req.user?.id) {
      throw new BadRequestError('User must be logged in');
    }

    if (!commentData.gameId || !commentData.content) {
      throw new BadRequestError('Game ID and content are required');
    }

    const game = await this.gameRepository.findOne({ where: { id: commentData.gameId } });

    if (!game) {
      throw new BadRequestError('Game not found');
    }

    const comment = this.commentRepository.create({
      gameId: commentData.gameId,
      userId: req.user.id,
      content: commentData.content,
      status: 'active',
    });

    return await this.commentRepository.save(comment);
  }

  @Put('/:id')
  @HttpCode(200)
  @UseBefore(AuthMiddleware)
  async updateComment(@Param('id') id: number, @Body() commentData: { content: string }, @Req() req: AuthRequest) {
    const comment = await this.commentRepository.findOne({ where: { id } });

    if (!comment) {
      throw new BadRequestError('Comment not found');
    }

    // Only the commenter or admin can update the comment
    if (comment.userId !== req.user?.id && req.user?.role !== 'admin') {
      throw new BadRequestError('Unauthorized to update this comment');
    }

    await this.commentRepository.update(id, { content: commentData.content });
    return await this.commentRepository.findOne({ where: { id } });
  }

  @Delete('/:id')
  @HttpCode(200)
  @UseBefore(AuthMiddleware)
  async deleteComment(@Param('id') id: number, @Req() req: AuthRequest) {
    const comment = await this.commentRepository.findOne({ where: { id } });

    if (!comment) {
      throw new BadRequestError('Comment not found');
    }

    // Only the commenter or admin can delete the comment
    if (comment.userId !== req.user?.id && req.user?.role !== 'admin') {
      throw new BadRequestError('Unauthorized to delete this comment');
    }

    // Soft delete
    await this.commentRepository.update(id, { status: 'deleted' });
    return { message: 'Comment deleted successfully' };
  }

  @Post('/:commentId/reactions')
  @HttpCode(201)
  @UseBefore(AuthMiddleware)
  async addReaction(
    @Param('commentId') commentId: number,
    @Body() reactionData: { type: ReactionType },
    @Req() req: AuthRequest,
  ) {
    if (!req.user?.id) {
      throw new BadRequestError('User must be logged in');
    }

    const comment = await this.commentRepository.findOne({ where: { id: commentId } });

    if (!comment) {
      throw new BadRequestError('Comment not found');
    }

    // Check if user already reacted to this comment
    const existingReaction = await this.reactionRepository.findOne({
      where: { commentId, userId: req.user.id },
    });

    if (existingReaction) {
      // Update existing reaction if it's different
      if (existingReaction.reactionType !== reactionData.type) {
        existingReaction.reactionType = reactionData.type;
        await this.reactionRepository.save(existingReaction);
      }
      return existingReaction;
    }

    // Create new reaction
    const reaction = this.reactionRepository.create({
      commentId,
      userId: req.user.id,
      reactionType: reactionData.type,
    });

    return await this.reactionRepository.save(reaction);
  }

  @Delete('/:commentId/reactions')
  @HttpCode(200)
  @UseBefore(AuthMiddleware)
  async removeReaction(@Param('commentId') commentId: number, @Req() req: AuthRequest) {
    if (!req.user?.id) {
      throw new BadRequestError('User must be logged in');
    }

    const comment = await this.commentRepository.findOne({ where: { id: commentId } });

    if (!comment) {
      throw new BadRequestError('Comment not found');
    }

    const reaction = await this.reactionRepository.findOne({
      where: { commentId, userId: req.user.id },
    });

    if (!reaction) {
      throw new BadRequestError('Reaction not found');
    }

    await this.reactionRepository.remove(reaction);
    return { message: 'Reaction removed successfully' };
  }
}
