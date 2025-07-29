import { Controller, Get, Post, Body, Param, Delete, Patch, Req, UseGuards, NotFoundException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BoardsService } from './boards.service';
import { IsNotEmpty } from 'class-validator';

class CreateBoardDto {
  @IsNotEmpty()
  title: string;
}

class UpdateBoardDto {
  @IsNotEmpty()
  title: string;
}

@Controller('boards')
@UseGuards(JwtAuthGuard)
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Get()
  async getBoards(@Req() req) {
    return this.boardsService.findByUser(req.user.userId);
  }

  @Post()
  async createBoard(@Req() req, @Body() dto: CreateBoardDto) {
    return this.boardsService.create(req.user.userId, dto.title);
  }

  @Get(':id')
  async getBoard(@Param('id') id: string, @Req() req) {
    const board = await this.boardsService.findById(id, req.user.userId);
    if (!board) throw new NotFoundException('Board not found or access denied');
    return board;
  }

  @Patch(':id')
  async updateBoard(@Param('id') id: string, @Req() req, @Body() dto: UpdateBoardDto) {
    return this.boardsService.update(id, req.user.userId, dto.title);
  }

  @Delete(':id')
  async deleteBoard(@Param('id') id: string, @Req() req) {
    return this.boardsService.delete(id, req.user.userId);
  }
}
