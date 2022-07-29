import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsOptional } from "class-validator";
import { QueryPaginationDto } from "../../../commons/dtos";

export class QueryPaginationBooksDto extends QueryPaginationDto {
    @ApiPropertyOptional({ default: false, description: 'jika true hanya buku yang BISA DIPINJAM yang akan ditampilkan, jika false maka seluruh buku' })
    @IsOptional()
    @IsNotEmpty()
    @IsBoolean()
    @Transform(({ value }) =>  value === 'true')
    canBeBorrowOnly: boolean = false;
}