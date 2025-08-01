import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { List } from './list.schema';
import { Board } from '../boards/board.schema';
import { GatewayService } from '../gateway/gateway.service';

@Injectable()
export class ListsService {
    constructor(
        @InjectModel(List.name) private listModel: Model<List>,
        @InjectModel(Board.name) private boardModel: Model<Board>,
        private gatewayService: GatewayService,
    ) { }

    async create(boardId: string, userId: string, title: string, position: number) {
        const board = await this.boardModel.findById(boardId);
        if (!board) throw new NotFoundException('Board not found');
        if (!board.users.some((u: any) => u.equals(userId))) throw new ForbiddenException('No access');
        const list = await this.listModel.create({ title, board: board._id, position, cards: [] });
        
        // Initialize lists array if it doesn't exist
        if (!board.lists) {
            board.lists = [];
        }
        
        board.lists.push(list._id as Types.ObjectId);
        await board.save();
        this.gatewayService.broadcastListUpdated(board?._id!.toString() ?? "", list.toObject());
        return list.toObject();
    }

    async findByBoard(boardId: string, userId: string) {
        const board = await this.boardModel.findById(boardId).populate('lists');
        if (!board) throw new NotFoundException('Board not found');
        if (!board.users.some((u: any) => u.equals(userId))) throw new ForbiddenException('No access');
        if (!board.lists) board.lists = [];
        return board.lists;
    }

    async update(id: string, userId: string, title: string, position: number) {
        const list = await this.listModel.findById(id);
        if (!list) throw new NotFoundException('List not found');
        const board = await this.boardModel.findById(list.board);
        if (!board || !board.users.some((u: any) => u.equals(userId))) throw new ForbiddenException('No access');
        list.title = title;
        list.position = position;
        await list.save();
        this.gatewayService.broadcastListUpdated(board?._id!.toString() ?? "", list.toObject());
        return list.toObject();
    }

    async delete(id: string, userId: string) {
        const list = await this.listModel.findById(id);
        if (!list) throw new NotFoundException('List not found');
        const board = await this.boardModel.findById(list.board);
        if (!board || !board.users.some((u: any) => u.equals(userId))) throw new ForbiddenException('No access');
        
        // Initialize lists array if it doesn't exist
        if (!board.lists) {
            board.lists = [];
        }
        
        board.lists = board.lists.filter((l: any) => !l.equals(list._id));
        await board.save();
        await list.deleteOne();
        this.gatewayService.broadcastListUpdated(board?._id!.toString() ?? "", { _id: id, deleted: true });
        return { deleted: true, _id: id };
    }
}
