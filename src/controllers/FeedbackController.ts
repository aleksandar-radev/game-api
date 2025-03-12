import { Response } from 'express';
import { AuthRequest } from '../helpers/request';
import { Service, Inject } from 'typedi';
import { Controller, Get, Post, Delete, Req, UseBefore, Body, HttpCode, Param } from 'routing-controllers';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import { FeedbackRepository } from '../repositories/FeedbackRepository';
import { Feedback } from '../entities/Feedback';
import { CreateFeedbackDto } from '../dto/CreateFeedbackDto';
import { BadRequestError } from '../helpers/error';

@Controller('/feedback')
@Service()
export class FeedbackController {
  constructor(@Inject() private feedbackRepository: FeedbackRepository) {}

  @Post('/')
  @HttpCode(201)
  async createFeedback(@Body() feedbackData: CreateFeedbackDto) {
    // All fields are optional, so we just create the feedback with whatever was provided
    const feedback = this.feedbackRepository.create({
      ...feedbackData,
      status: 'pending',
    });

    return await this.feedbackRepository.save(feedback);
  }

  // Admin endpoints
  @Get('/')
  @HttpCode(200)
  @UseBefore(AuthMiddleware)
  async getAllFeedback(@Req() req: AuthRequest, @Param('status') status?: string) {
    // Check if user is admin
    if (req.user?.role !== 'admin') {
      throw new BadRequestError('Unauthorized to view feedback');
    }

    if (status) {
      return await this.feedbackRepository.findByStatus(status);
    }

    return await this.feedbackRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  @Get('/:id')
  @HttpCode(200)
  @UseBefore(AuthMiddleware)
  async getFeedback(@Param('id') id: number, @Req() req: AuthRequest) {
    // Check if user is admin
    if (req.user?.role !== 'admin') {
      throw new BadRequestError('Unauthorized to view feedback');
    }

    const feedback = await this.feedbackRepository.findOne({ where: { id } });

    if (!feedback) {
      throw new BadRequestError('Feedback not found');
    }

    return feedback;
  }

  @Post('/:id/status')
  @HttpCode(200)
  @UseBefore(AuthMiddleware)
  async updateFeedbackStatus(@Param('id') id: number, @Body() data: { status: string }, @Req() req: AuthRequest) {
    // Check if user is admin
    if (req.user?.role !== 'admin') {
      throw new BadRequestError('Unauthorized to update feedback');
    }

    const feedback = await this.feedbackRepository.findOne({ where: { id } });

    if (!feedback) {
      throw new BadRequestError('Feedback not found');
    }

    // Update status
    feedback.status = data.status;
    return await this.feedbackRepository.save(feedback);
  }

  @Delete('/:id')
  @HttpCode(200)
  @UseBefore(AuthMiddleware)
  async deleteFeedback(@Param('id') id: number, @Req() req: AuthRequest) {
    // Check if user is admin
    if (req.user?.role !== 'admin') {
      throw new BadRequestError('Unauthorized to delete feedback');
    }

    const feedback = await this.feedbackRepository.findOne({ where: { id } });

    if (!feedback) {
      throw new BadRequestError('Feedback not found');
    }

    await this.feedbackRepository.softRemove(feedback);
    return { message: 'Feedback deleted successfully' };
  }
}
