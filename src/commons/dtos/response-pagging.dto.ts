import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class PagingDto {
  @ApiProperty()
  @Expose()
  page: number = 1;

  @ApiProperty()
  @Expose()
  rowsPerPage: number = 0;
  
  @ApiProperty()
  @Expose()
  totalRows: number = 0;
  
  @ApiProperty()
  @Expose()
  totalPages: number = 0;
} 

@Exclude()
export class ResponsePaggingDto<T> {
    @ApiProperty({ minimum: 200, maximum: 299, default: 200 })
    @Expose()
    statusCode: number = 200;
    
    @ApiPropertyOptional({ isArray: true })
    @Expose()
    messages?: string[];
    
    @ApiPropertyOptional({ isArray: true })
    @Expose()
    result?: T[];
    
    @ApiProperty()
    @Expose()
    pagging: PagingDto;

    constructor(data: Partial<ResponsePaggingDto<T>>) {
        Object.assign(this, data);
    }
}