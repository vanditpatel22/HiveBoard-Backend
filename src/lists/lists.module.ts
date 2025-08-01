import { forwardRef, Module } from '@nestjs/common';
import { ListsService } from './lists.service';
import { ListsController } from './lists.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { List, ListSchema } from './list.schema';
import { GatewayModule } from 'src/gateway/gateway.module';
import { Card, CardSchema } from 'src/cards/card.schema';
import { Board, BoardSchema } from 'src/boards/board.schema';

@Module({
  imports: [
    
    MongooseModule.forFeature([{ name: Card.name, schema: CardSchema }, { name: List.name, schema: ListSchema }, { name: Board.name, schema: BoardSchema }]),
    forwardRef(() => GatewayModule), // ✅ break the circular import
  ],
  providers: [ListsService],
  controllers: [ListsController],
  exports: [ListsService],
})
export class ListsModule { }
