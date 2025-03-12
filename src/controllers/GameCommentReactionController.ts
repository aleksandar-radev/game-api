import { Response } from 'express';
import { AuthRequest } from '../helpers/request';
import { Service, Inject } from 'typedi';
import { Controller, Get, Post, Delete, Req, UseBefore, Body, HttpCode, Param } from 'routing-controllers';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import { Repository } from 'typeorm';
import { AppDataSource } from '../database/connection';
import { GameCommentReaction, ReactionType } from '../entities/GameCommentReaction';
import { GameComment } from '../entities/GameComment';
import { BadRequestError } from '../helpers/error';

@Controller('/comment-reactions')
@Service()
@UseBefore(AuthMiddleware)
export class GameCommentReactionController {
  private reactionRepository: Repository<GameCommentReaction>;
  private commentRepository: Repository<GameComment>;

  constructor() {
    this.reactionRepository = AppDataSource.getRepository(GameCommentReaction);
    this.commentRepository = AppDataSource.getRepository(GameComment);
  }

  @Get('/comment/:commentId')
  @HttpCode(200)
  async getCommentReactions(@Param('commentId') commentId: number) {
    const comment = await this.commentRepository.findOne({ where: { id: commentId } });

    if (!comment) {
      throw new BadRequestError('Comment not found');
    }

    return this.reactionRepository.find({
      where: { commentId },
      relations: ['user'],
    });
  }

  @Get('/user')
  @HttpCode(200)
  async getUserReactions(@Req() req: AuthRequest) {
    if (!req.user?.id) {
      throw new BadRequestError('User must be logged in');
    }

    return this.reactionRepository.find({
      where: { userId: req.user.id },
      relations: ['comment'],
    });
  }

  @Post('/')
  @HttpCode(201)
  async createOrUpdateReaction(
    @Body() reactionData: { commentId: number; type: ReactionType },
    @Req() req: AuthRequest,
  ) {
    if (!req.user?.id) {
      throw new BadRequestError('User must be logged in');
    }

    const { commentId, type } = reactionData;

    if (!commentId || !type) {
      throw new BadRequestError('Comment ID and reaction type are required');
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
      // If same reaction type, remove the reaction (toggle behavior)
      if (existingReaction.reactionType === type) {
        await this.reactionRepository.remove(existingReaction);
        return { message: 'Reaction removed' };
      }

      // Otherwise update the reaction type
      existingReaction.reactionType = type;
      return await this.reactionRepository.save(existingReaction);
    }

    // Create new reaction
    const reaction = this.reactionRepository.create({
      commentId,
      userId: req.user.id,
      reactionType: type,
    });

    return await this.reactionRepository.save(reaction);
  }

  @Delete('/:id')
  @HttpCode(200)
  async deleteReaction(@Param('id') id: number, @Req() req: AuthRequest) {
    if (!req.user?.id) {
      throw new BadRequestError('User must be logged in');
    }

    const reaction = await this.reactionRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!reaction) {
      throw new BadRequestError('Reaction not found');
    }

    // Only the user who created the reaction or an admin can delete it
    if (reaction.userId !== req.user.id && req.user.role !== 'admin') {
      throw new BadRequestError('Unauthorized to delete this reaction');
    }

    await this.reactionRepository.remove(reaction);
    return { message: 'Reaction deleted successfully' };
  }

  @Delete('/comment/:commentId')
  @HttpCode(200)
  async deleteReactionByComment(@Param('commentId') commentId: number, @Req() req: AuthRequest) {
    if (!req.user?.id) {
      throw new BadRequestError('User must be logged in');
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

  @Get('/summary/comment/:commentId')
  @HttpCode(200)
  async getReactionSummary(@Param('commentId') commentId: number) {
    const comment = await this.commentRepository.findOne({ where: { id: commentId } });

    if (!comment) {
      throw new BadRequestError('Comment not found');
    }

    const reactions = await this.reactionRepository.find({
      where: { commentId },
    });

    const summary = {
      total: reactions.length,
      likes: reactions.filter((r) => r.reactionType === ReactionType.LIKE).length,
      dislikes: reactions.filter((r) => r.reactionType === ReactionType.DISLIKE).length,
    };

    return summary;
  }
}
