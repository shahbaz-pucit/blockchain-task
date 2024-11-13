
import { ApiProperty } from '@nestjs/swagger';

export class AlertDto {
  @ApiProperty({ description: 'Blockchain chain name (e.g., ethereum or polygon)' })
  chain: string;

  @ApiProperty({ description: 'Target price for triggering the alert', example: 1000 })
  price: number;

  @ApiProperty({ description: 'User email to send the alert to' })
  email: string;
}
