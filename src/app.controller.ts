import { Controller, Get } from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { ResponseErrorDto, ResponseOkDto, ResponsePaggingDto } from './commons/dtos';

@ApiTags('Index')
@ApiExtraModels(ResponseErrorDto, ResponseOkDto, ResponsePaggingDto)
@Controller()
export class AppController {
  @Get()
  getIndex(): string {
    return 'pong';
  }
}
