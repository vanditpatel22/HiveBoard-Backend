import { Controller, Post, Get, Patch, Delete, Param, Body, Req, UseGuards, NotFoundException, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CardsService } from './cards.service';
import { IsNotEmpty, IsNumber, IsOptional, IsArray, IsString } from 'class-validator';

class CreateCardDto {
  @IsNotEmpty()
  title: string;
  @IsOptional()
  description?: string;
  @IsNumber()
  position: number;
  @IsArray()
  @IsString({ each: true })
  labels: string[];
  @IsArray()
  @IsString({ each: true })
  assignedUsers: string[];
}

class UpdateCardDto {
  @IsOptional()
  title?: string;
  @IsOptional()
  description?: string;
  @IsOptional()
  @IsNumber()
  position?: number;
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  labels?: string[];
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  assignedUsers?: string[];
}

@Controller('cards')
@UseGuards(JwtAuthGuard)
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post('/lists/:listId/cards')
  async createCard(@Param('listId') listId: string, @Req() req, @Body() dto: CreateCardDto) {
    return this.cardsService.create(listId, req.user.userId, dto);
  }

  @Get('/lists/:listId/cards')
  async getCards(@Param('listId') listId: string, @Req() req) {
    return this.cardsService.findByList(listId, req.user.userId);
  }

  @Patch(':id')
  async updateCard(@Param('id') id: string, @Req() req, @Body() dto: UpdateCardDto) {
    return this.cardsService.update(id, req.user.userId, dto);
  }

  @Delete(':id')
  async deleteCard(@Param('id') id: string, @Req() req) {
    return this.cardsService.delete(id, req.user.userId);
  }
}
