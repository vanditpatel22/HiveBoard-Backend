import { Injectable, NotFoundException, ForbiddenException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Card } from './card.schema';
import { List } from '../lists/list.schema';
import { Board } from '../boards/board.schema';
import { GatewayService } from '../gateway/gateway.service';

@Injectable()
export class CardsService {
    constructor(
        @InjectModel(Card.name) private cardModel: Model<Card>,
        @InjectModel(List.name) private listModel: Model<List>,
        @InjectModel(Board.name) private boardModel: Model<Board>,
        private gatewayService: GatewayService,
    ) { }

    async create(listId: string, userId: string, dto: any) {
        const list = await this.listModel.findById(listId);
        if (!list) throw new NotFoundException('List not found');
        const board = await this.boardModel.findById(list.board);
        if (!board || !board.users.some((u: any) => u.equals(userId))) throw new ForbiddenException('No access');
        const card = await this.cardModel.create({
            title: dto.title,
            description: dto.description,
            list: list._id,
            position: dto.position,
            labels: dto.labels || [],
            assignedUsers: dto.assignedUsers || [],
        });
        list.cards.push(card._id as Types.ObjectId);
        await list.save();
        this.gatewayService.broadcastCardCreated(board?._id!.toString() ?? "", card.toObject());
        return card.toObject();
    }

    async findByList(listId: string, userId: string) {
        const list = await this.listModel.findById(listId).populate('cards');
        if (!list) throw new NotFoundException('List not found');
        const board = await this.boardModel.findById(list.board);
        if (!board || !board.users.some((u: any) => u.equals(userId))) throw new ForbiddenException('No access');
        return list.cards.map((c: any) => c.toObject());
    }

    async update(id: string, userId: string, dto: any) {
        const card = await this.cardModel.findById(id);
        if (!card) throw new NotFoundException('Card not found');
        const list = await this.listModel.findById(card.list);
        if (!list) throw new NotFoundException('List not found');
        const board = await this.boardModel.findById(list.board);
        if (!board) throw new NotFoundException('Board not found');
        if (!board || !board.users.some((u: any) => u.equals(userId))) throw new ForbiddenException('No access');
        if (dto.title !== undefined) card.title = dto.title;
        if (dto.description !== undefined) card.description = dto.description;
        if (dto.position !== undefined) card.position = dto.position;
        if (dto.labels !== undefined) card.labels = dto.labels;
        if (dto.assignedUsers !== undefined) card.assignedUsers = dto.assignedUsers;
        await card.save();
        this.gatewayService.broadcastCardCreated(board?._id!.toString() ?? "", card.toObject());
        return card.toObject();
    }

    async delete(id: string, userId: string) {
        const card = await this.cardModel.findById(id);
        if (!card) throw new NotFoundException('Card not found');
        const list = await this.listModel.findById(card.list);
        if (!list) throw new NotFoundException('List not found');
        const board = await this.boardModel.findById(list.board);
        if (!board) throw new NotFoundException('Board not found');
        if (!board || !board.users.some((u: any) => u.equals(userId))) throw new ForbiddenException('No access');
        list.cards = list.cards.filter((c: any) => !c.equals(card._id));
        await list.save();
        await card.deleteOne();
        this.gatewayService.broadcastCardCreated(board?._id!.toString() ?? "", { _id: id, deleted: true });
        return { deleted: true, _id: id };
    }
}
