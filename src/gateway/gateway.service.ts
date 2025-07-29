import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { List } from '../lists/list.schema';
import { Card } from '../cards/card.schema';

@WebSocketGateway({ cors: true })
export class GatewayService implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    @InjectModel(List.name) private listModel: Model<List>,
    @InjectModel(Card.name) private cardModel: Model<Card>,
  ) {}

  afterInit(server: Server) {
    // Optionally log or set up
  }

  handleConnection(client: Socket) {
    // JWT auth for socket connection
    const token = client.handshake.auth?.token || client.handshake.headers['authorization']?.split(' ')[1];
    if (!token) return client.disconnect();
    try {
      const payload = jwt.verify(token, 'supersecret');
      (client as any).user = payload;
    } catch {
      return client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    // Optionally log disconnect
  }

  @SubscribeMessage('joinBoard')
  handleJoinBoard(@MessageBody() boardId: string, @ConnectedSocket() client: Socket) {
    client.join(`board_${boardId}`);
  }

  @SubscribeMessage('leaveBoard')
  handleLeaveBoard(@MessageBody() boardId: string, @ConnectedSocket() client: Socket) {
    client.leave(`board_${boardId}`);
  }

  // Example: broadcast card created
  broadcastCardCreated(boardId: string, card: any) {
    this.server.to(`board_${boardId}`).emit('cardCreated', card);
  }

  // Example: broadcast list updated
  broadcastListUpdated(boardId: string, list: any) {
    this.server.to(`board_${boardId}`).emit('listUpdated', list);
  }

  // Example: broadcast board updated
  broadcastBoardUpdated(boardId: string, board: any) {
    this.server.to(`board_${boardId}`).emit('boardUpdated', board);
  }

  // Example: handle drag-and-drop reorder event
  @SubscribeMessage('reorderCards')
  async handleReorderCards(@MessageBody() data: { boardId: string; listId: string; cardOrder: string[] }, @ConnectedSocket() client: Socket) {
    // Update DB with new card order for the list
    const list = await this.listModel.findById(data.listId);
    if (!list) return;
    list.cards = data.cardOrder.map(id => new Types.ObjectId(id));
    await list.save();
    this.server.to(`board_${data.boardId}`).emit('cardsReordered', data);
  }

  @SubscribeMessage('reorderLists')
  async handleReorderLists(@MessageBody() data: { boardId: string; listOrder: string[] }, @ConnectedSocket() client: Socket) {
    // Update DB with new list order for the board
    const board = await this.listModel.db.model('Board').findById(data.boardId);
    if (!board) return;
    board.lists = data.listOrder.map(id => new Types.ObjectId(id));
    await board.save();
    this.server.to(`board_${data.boardId}`).emit('listsReordered', data);
  }
}
