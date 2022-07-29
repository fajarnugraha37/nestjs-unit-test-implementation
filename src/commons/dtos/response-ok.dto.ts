import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class ResponseOkDto<T> {
    @ApiProperty({ minimum: 200, maximum: 299, default: 200 })
    @Expose()
    statusCode: number = 200;
    
    @ApiPropertyOptional({ isArray: true })
    @Expose()
    messages?: string[];
    
    @ApiPropertyOptional()
    @Expose()
    result?: T;

    constructor(data: Partial<ResponseOkDto<T>>) {
        Object.assign(this, data);
    }
}