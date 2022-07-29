import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class BooksDto {
    @ApiProperty()
    @Expose()
    code: string;
    
    @ApiProperty()
    @Expose()
    title: string;
    
    @ApiProperty()
    @Expose()
    author: string;
    
    @ApiProperty({ description: 'jumlah keseluruhan buku' })
    @Expose()
    stock: number;
    
    @ApiPropertyOptional({ description: 'Jumlah buku yang bisa dipinjam'})
    @Expose()
    notBorrowed?: number;
}