import { forwardRef, Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Card, CardSchema } from './card.schema';
import { GatewayService } from '../gateway/gateway.service';
import { List } from 'src/lists/list.schema';
import { ListSchema } from 'src/lists/list.schema';
import { Board } from 'src/boards/board.schema';
import { BoardSchema } from 'src/boards/board.schema';
import { GatewayModule } from 'src/gateway/gateway.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Card.name, schema: CardSchema },
      { name: List.name, schema: ListSchema }, // ✅ fix: register ListModel
      { name: Board.name, schema: BoardSchema },
    ]),
    forwardRef(() => GatewayModule), // ✅ if needed due to GatewayService injection
  ],
  providers: [CardsService, GatewayService],
  controllers: [CardsController]
})
export class CardsModule { }
