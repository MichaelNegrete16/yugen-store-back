import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

interface HealthStatus {
  status: 'ok';
  service: string;
}

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Estado del servicio' })
  check(): HealthStatus {
    return { status: 'ok', service: 'yugen-store-back' };
  }
}
