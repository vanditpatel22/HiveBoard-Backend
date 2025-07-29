import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Board, BoardSchema } from './board.schema';
import { GatewayService } from '../gateway/gateway.service';

@Injectable()
export class BoardsService {
  constructor(
    @InjectModel(Board.name) private boardModel: Model<Board>,
    private gatewayService: GatewayService,
  ) {}

  async findByUser(userId: string) {
    return this.boardModel.find({ users: userId });
  }

  async create(userId: string, title: string) {
    const board = await this.boardModel.create({ title, users: [userId], lists: [] });
    this.gatewayService.broadcastBoardUpdated(String(board._id), board);
    return board;
  }

  async findById(id: string, userId: string) {
    const board = await this.boardModel
      .findById(id)
      .populate({
        path: 'lists',
        populate: { path: 'cards', model: 'Card' }
      })
      .populate('users');
    if (!board || !board.users.some((u: any) => u._id.equals(userId))) return null;
    return board;
  }

  async update(id: string, userId: string, title: string) {
    const board = await this.boardModel.findById(id);
    if (!board) throw new NotFoundException('Board not found');
    if (!board.users.some((u: any) => u.equals(userId))) throw new ForbiddenException('No access');
    board.title = title;
    await board.save();
    this.gatewayService.broadcastBoardUpdated(String(board._id), board);
    return board;
  }

  async delete(id: string, userId: string) {
    const board = await this.boardModel.findById(id);
    if (!board) throw new NotFoundException('Board not found');
    if (!board.users.some((u: any) => u.equals(userId))) throw new ForbiddenException('No access');
    await board.deleteOne();
    this.gatewayService.broadcastBoardUpdated(String(board._id), { _id: id, deleted: true });
    return { deleted: true };
  }
}
