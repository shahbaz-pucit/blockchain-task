import { Module } from '@nestjs/common';
import { PricesService } from './prices.service';
import { PricesController } from './prices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Price } from './entities/price.entity';
import { AlertService } from '../alert/alert.service'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Price]),
  ],
  providers: [PricesService, AlertService], 
  controllers: [PricesController],
})
export class PricesModule {}
