import { forwardRef, Module } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardsController } from './boards.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Board, BoardSchema } from './board.schema';
import { GatewayService } from '../gateway/gateway.service';
import { GatewayModule } from '../gateway/gateway.module';
import { List } from 'src/lists/list.schema';
import { ListSchema } from 'src/lists/list.schema';
import { Card } from 'src/cards/card.schema';
import { CardSchema } from 'src/cards/card.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Board.name, schema: BoardSchema },
      { name: List.name, schema: ListSchema },
      { name: Card.name, schema: CardSchema }
    ]),
    forwardRef(() => GatewayModule),
  ],
  providers: [BoardsService, GatewayService],
  controllers: [BoardsController]
})
export class BoardsModule { }
