import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class ResponseErrorDto {
    @ApiProperty({ minimum: 400, maximum: 499, default: 400 })
    @Expose()
    statusCode: number = 400;
    
    @ApiProperty({ isArray: true })
    @Expose()
    messages: string[] = ['Bad Request'];

    constructor(data: Partial<ResponseErrorDto>) {
        Object.assign(this, data);
    }
}