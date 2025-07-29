import { Module } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { MongooseModule } from '@nestjs/mongoose';
import { List, ListSchema } from '../lists/list.schema';
import { Card, CardSchema } from '../cards/card.schema';
import { ListsModule } from '../lists/lists.module';
import { CardsModule } from '../cards/cards.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: List.name, schema: ListSchema },
      { name: Card.name, schema: CardSchema },
    ]),
    ListsModule,
    CardsModule,
  ],
  providers: [GatewayService],
  exports: [GatewayService],
})
export class GatewayModule {}
