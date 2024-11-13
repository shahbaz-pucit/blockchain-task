import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Price } from './entities/price.entity';
import { AlertService } from '../alert/alert.service'; 
import Moralis from 'moralis';
import { Cron } from '@nestjs/schedule';
import { AlertDto } from 'src/alert/dto/alert.dto';

@Injectable()
export class PricesService {
  constructor(
    @InjectRepository(Price)
    private priceRepository: Repository<Price>,
    private alertService: AlertService,
  ) {}


  async onModuleInit() {
    console.log('Initial price fetch on app start...');
    await Moralis.start({
      apiKey: process.env.MORALIS_API_KEY
    })
    await this.fetchPrices();  
  }
  /**
   * Fetch prices of Ethereum and Polygon every 5 minutes (Cron job)
   */

  @Cron('*/5 * * * *')
  async fetchPrices() {
    const apiKey = process.env.MORALIS_API_KEY;

    const headers = {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json',
    };

    try {
      const ethPriceRes = await Moralis.EvmApi.token.getTokenPrice({
        "chain": "0x1",
        "include": "percent_change",
        "address": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
      });
      const polygonPriceRes = await Moralis.EvmApi.token.getTokenPrice({
        "chain": "0x89",
        "include": "percent_change",
        "address": "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270"
      });

      const ethPrice = ethPriceRes.raw.usdPrice;
      const polygonPrice = polygonPriceRes.raw.usdPrice;

      await this.priceRepository.save([
        { chain: 'ethereum', price: ethPrice },
        { chain: 'polygon', price: polygonPrice },
      ]);
    } catch (error) {
      console.error('Error fetching blockchain prices:', error);
    }
    
  }

  async getHourlyPrices() {
    const prices = await this.priceRepository
      .createQueryBuilder('price')
      .where('price.timestamp > NOW() - INTERVAL \'24 hours\'')
      .getMany();

    return prices;
  }

  async setPriceAlert(alertDto: AlertDto) {
    const { chain, price, email } = alertDto;

    const priceData = await this.priceRepository.findOne({ where: { chain } });

    if (!priceData) {
      throw new Error('Price data not found for the specified chain.');
    }

    if (priceData.price >= price) {
      await this.alertService.sendPriceAlert(email, chain, priceData.price);
    }

    return { message: `Price alert set for ${chain} at $${price}.` };
  }
}
