import { Controller, Post, Get, Patch, Delete, Param, Body, Req, UseGuards, NotFoundException, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ListsService } from './lists.service';
import { IsNotEmpty, IsNumber } from 'class-validator';

class CreateListDto {
  @IsNotEmpty()
  title: string;
  @IsNumber()
  position: number;
}

class UpdateListDto {
  @IsNotEmpty()
  title: string;
  @IsNumber()
  position: number;
}

@Controller('lists')
@UseGuards(JwtAuthGuard)
export class ListsController {
  constructor(private readonly listsService: ListsService) {}

  @Post('/boards/:boardId/lists')
  async createList(@Param('boardId') boardId: string, @Req() req, @Body() dto: CreateListDto) {
    return this.listsService.create(boardId, req.user.userId, dto.title, dto.position);
  }

  @Get('/boards/:boardId/lists')
  async getLists(@Param('boardId') boardId: string, @Req() req) {
    return this.listsService.findByBoard(boardId, req.user.userId);
  }

  @Patch(':id')
  async updateList(@Param('id') id: string, @Req() req, @Body() dto: UpdateListDto) {
    return this.listsService.update(id, req.user.userId, dto.title, dto.position);
  }

  @Delete(':id')
  async deleteList(@Param('id') id: string, @Req() req) {
    return this.listsService.delete(id, req.user.userId);
  }
}
