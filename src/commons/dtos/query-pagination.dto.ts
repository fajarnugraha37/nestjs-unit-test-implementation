import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, Max, Min } from "class-validator";

export class QueryPaginationDto {
    @ApiPropertyOptional({ default: 1 })
    @Min(1)
    @Max(25)
    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    page: number = 1;
    
    @ApiPropertyOptional({ default: 20 })
    @Min(1)
    @Max(25)
    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    rowsPerPage: number = 20;
}