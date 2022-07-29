import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class BookReturnDto {
    @ApiProperty({ example: 'M001' })
    @Expose()
    memberCode: string;

    @ApiProperty({ example: 'BH-01' })
    @Expose()
    bookCode: string;
    
    @ApiProperty({ description: 'Jika true maka terkena penalty karena terlambat', example: false })
    @Expose()
    isPenalty: boolean;

    constructor(data: Required<BookReturnDto>) {
        Object.assign(this, data);
    }
}