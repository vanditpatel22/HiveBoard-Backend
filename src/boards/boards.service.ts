import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Board, BoardSchema } from './board.schema';
import { GatewayService } from '../gateway/gateway.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { List } from 'src/lists/list.schema';
import { Card } from 'src/cards/card.schema';

@Injectable()
export class BoardsService {
  constructor(
    @InjectModel(Board.name)
    private boardModel: Model<Board>,
    @InjectModel(List.name)
    private listModel: Model<List>,
    @InjectModel(Card.name)
    private cardModel: Model<Card>,
    private gatewayService: GatewayService,
  ) { }

  async findByUser(
    userId: string,
    options: { page?: number; limit?: number; search?: string; status?: string }
  ) {

    const { page = 1, limit = 10, search, status } = options;
    const query: any = { users: userId };

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    const boards = await this.boardModel
      .find(query)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
      

    const total = await this.boardModel.countDocuments(query);

    return {
      data: boards,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };


  }

  async create(userId: string, board: CreateBoardDto) {
    const addedBoard = await this.boardModel.create({ ...board, users: [new Types.ObjectId(userId)], user_id: new Types.ObjectId(userId) });

    const defaultLists = [
      { title: 'To Do', position: 0 },
      { title: 'In Progress', position: 1 },
      { title: 'Done', position: 2 }
    ];

    const createdLists: Types.ObjectId[] = [];
    for (const listData of defaultLists) {
      const list = await this.listModel.create({
        title: listData.title,
        board: addedBoard._id,
        position: listData.position,
        cards: []
      });
      createdLists.push(list._id as Types.ObjectId);
    }

    await this.boardModel.findByIdAndUpdate(
      addedBoard._id,
      { lists: createdLists }
    );

    const updatedBoard = await this.boardModel
      .findById(addedBoard._id)
      .populate({
        path: 'lists',
        populate: { path: 'cards', model: 'Card' }
      })
      .populate('users');

    return updatedBoard;

  }

  async findById(id: string, userId: string) {
    const board = await this.boardModel
      .findById(id)
      .populate({
        path: 'lists',
        options: { sort: { position: 1 } },
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

  async createList(boardId: string, userId: string, title: string, position: number) {
    const board = await this.boardModel.findById(boardId);
    if (!board) throw new NotFoundException('Board not found');
    if (!board.users.some((u: any) => u.equals(userId))) throw new ForbiddenException('No access');

    const list = await this.listModel.create({ title, board: board._id, position, cards: [] });

    return list;
  }
}
