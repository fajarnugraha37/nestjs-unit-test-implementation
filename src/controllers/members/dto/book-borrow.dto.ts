import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class BookBorrowDto {
    @ApiProperty({ example: 'M001' })
    @Expose()
    memberCode: string;

    @ApiProperty({ example: 'BH-01' })
    @Expose()
    bookCode: string;
    
    constructor(data: Required<BookBorrowDto>) {
        Object.assign(this, data);
    }
}