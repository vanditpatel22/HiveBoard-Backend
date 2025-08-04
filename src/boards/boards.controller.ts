import { Controller, Get, Post, Body, Param, Delete, Patch, Req, UseGuards, NotFoundException, Res, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { ResponseUtil } from 'src/common/utils/response.util';
import { STATUS, RESPONSE_CODE } from 'src/common/constants/response-codes.constant';
import { handleControllerError } from 'src/common/helpers/error.helper';
import { AuthenticatedUser } from 'src/auth/interface/auth_user.interface';
import { Request, Response } from 'express';

@Controller('boards')
@UseGuards(JwtAuthGuard)
export class BoardsController {
  constructor(
    private readonly boardsService: BoardsService,
    private readonly responseUtil: ResponseUtil
  ) { }

  @Get()
  async getBoards(
    @Req() req: Request,
    @Res() res: Response,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {

    try {
      const user = (req as Request & { user: AuthenticatedUser }).user;
      const boards = await this.boardsService.findByUser(user.userId, { page, limit, search, status });

      if (boards && boards?.data?.length > 0) {

        return this.responseUtil.sendResponse(
          req,
          res,
          STATUS.OK,
          RESPONSE_CODE.SUCCESS,
          { keyword: 'text_boards_fetched_succ', components: {} },
          boards
        );

      } else {

        return this.responseUtil.sendResponse(
          req,
          res,
          STATUS.NO_CONTENT,
          RESPONSE_CODE.NODATA,
          { keyword: 'text_boards_fetched_fail', components: {} },
          []
        );

      }



    } catch (error) {
      return handleControllerError(req, res, error, this.responseUtil);
    }
  }

  @Post()
  async createBoard(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: CreateBoardDto) {

    try {

      const user = (req as Request & { user: AuthenticatedUser }).user;
      const addedBoard = await this.boardsService.create(user.userId, body);

      return this.responseUtil.sendResponse(
        req,
        res,
        STATUS.CREATED,
        RESPONSE_CODE.SUCCESS,
        { keyword: 'text_board_created_succ', components: {} },
        addedBoard
      );
    } catch (error) {
      return handleControllerError(req, res, error, this.responseUtil);
    }
  }

  @Get(':id')
  async getBoard(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {

    try {
      const user = (req as Request & { user: AuthenticatedUser }).user;
      const board = await this.boardsService.findById(id, user.userId);

      console.log(board,`board`);
      

      if (board != null) {

        return this.responseUtil.sendResponse(
          req,
          res,
          STATUS.OK,
          RESPONSE_CODE.SUCCESS,
          { keyword: 'text_board_details_succ', components: {} },
          board
        );

      } else {

        return this.responseUtil.sendResponse(
          req,
          res,
          STATUS.NO_CONTENT,
          RESPONSE_CODE.NODATA,
          { keyword: 'text_board_details_fail', components: {} },
          board
        );

      }

    } catch (error) {
      return handleControllerError(req, res, error, this.responseUtil);
    }


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
