import { Controller, Get, Post, Body } from '@nestjs/common';
import { PricesService } from './prices.service';
import { AlertDto } from 'src/alert/dto/alert.dto';

@Controller('prices')
export class PricesController {
  constructor(private readonly pricesService: PricesService) {}

  @Get('/hourly')
  getHourlyPrices() {
    return this.pricesService.getHourlyPrices();
  }

  @Post('/set-alert')
  setPriceAlert(@Body() alertDto: AlertDto) {
    return this.pricesService.setPriceAlert(alertDto);
  }
}
