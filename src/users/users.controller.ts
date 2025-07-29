import { Controller, Get, Patch, Body, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { IsNotEmpty } from 'class-validator';
import { Public } from '../auth/jwt-auth.guard';

class UpdateProfileDto {
  @IsNotEmpty()
  name: string;
}

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @Public()
  async getMe(@Req() req) {
    return this.usersService.findById(req.user.userId);
  }

  @Patch('me')
  async updateName(@Req() req, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateName(req.user.userId, dto.name);
  }
}
