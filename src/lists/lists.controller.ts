import { Controller, Post, Get, Patch, Delete, Param, Body, Req, UseGuards, NotFoundException, ForbiddenException, Res } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ListsService } from './lists.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { Request, Response } from 'express';
import { handleControllerError } from 'src/common/helpers/error.helper';
import { ResponseUtil } from 'src/common/utils/response.util';
import { AuthenticatedUser } from 'src/auth/interface/auth_user.interface';
import { RESPONSE_CODE, STATUS } from 'src/common/constants/response-codes.constant';


@Controller('lists')
@UseGuards(JwtAuthGuard)
export class ListsController {
  constructor(
    private readonly listsService: ListsService,
    private readonly responseUtil: ResponseUtil
  ) { }

  @Post('/create/:boardId')
  async createList(
    @Param('boardId') boardId: string,
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: CreateListDto) {

    try {

      const user = (req as Request & { user: AuthenticatedUser }).user;
      const addedList = await this.listsService.create(boardId, user.userId, body);

      return this.responseUtil.sendResponse(
        req,
        res,
        STATUS.CREATED,
        RESPONSE_CODE.SUCCESS,
        { keyword: 'text_board_list_created_succ', components: {} },
        addedList
      );

    } catch (error) {
      return handleControllerError(req, res, error, this.responseUtil);
    }

  }

  @Get('/get/:boardId')
  async getLists(@Param('boardId') boardId: string, @Req() req) {
    return this.listsService.findByBoard(boardId, req.user.userId);
  }

  @Patch(':id')
  async updateList(@Param('id') id: string, @Req() req, @Body() dto: UpdateListDto) {
    return this.listsService.update(id, req.user.userId, dto.title, dto.position);
  }

  @Delete(':id')
  async deleteList(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response
  ) {

    try {

      const user = (req as Request & { user: AuthenticatedUser }).user;
      const deletedList = await this.listsService.delete(id, user.userId);

      return this.responseUtil.sendResponse(
        req,
        res,
        STATUS.CREATED,
        RESPONSE_CODE.SUCCESS,
        { keyword: 'text_board_list_created_succ', components: {} },
        null
      );

    } catch (error) {
      return handleControllerError(req, res, error, this.responseUtil);
    }

  }
}
