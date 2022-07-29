import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiExtraModels, ApiTags } from "@nestjs/swagger";
import { plainToClass } from "class-transformer";
import { ResponseOkSchema } from "../../commons/decorators";
import { ResponseOkDto, ResponsePaggingDto } from "../../commons/dtos";
import { BooksFacade } from "./books.facade";
import { BooksDto, QueryPaginationBooksDto } from "./dto";

@ApiTags('Books API')
@ApiExtraModels(BooksDto)
@Controller('books')
export class BooksController {
    constructor(private readonly booksFacade: BooksFacade) {}
    
    @ResponseOkSchema(BooksDto)
    @Get()
    async getAllBooks(@Query() query: QueryPaginationBooksDto): Promise<ResponsePaggingDto<BooksDto>> {
        const pagging = await this.booksFacade.getPaggingMeta(query);
        const items = await this.booksFacade.getPaggingItems(query);

        return new ResponsePaggingDto<BooksDto>({
            result: items.map(item => plainToClass(BooksDto, item)),
            pagging: pagging,
        });
    }
    
    @ResponseOkSchema(BooksDto)
    @Get(':bookCode')
    async getBooksByCode(@Param('bookCode') bookCode: string): Promise<ResponseOkDto<BooksDto>> {
        const result = await this.booksFacade.getItemByCode(bookCode);
        
        return new ResponseOkDto<BooksDto>({
            result: plainToClass(BooksDto, result),
        });
    }
}