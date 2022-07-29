import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class MembersDto {
    @ApiProperty()
    @Expose()
    code: string;

    @ApiProperty()
    @Expose()
    name: string;
    
    @ApiPropertyOptional({ description: 'Jumlah buku sedang dipinjam oleh User'})
    @Expose()
    beingBorrowed?: number;
}