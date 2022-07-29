import { Controller, Get, HttpCode, Param, Post, Query } from "@nestjs/common";
import { ApiExtraModels, ApiTags } from "@nestjs/swagger";
import { plainToClass } from "class-transformer";
import { ResponseErrorSchema, ResponseOkSchema } from "../../commons/decorators";
import { QueryPaginationDto, ResponseOkDto, ResponsePaggingDto } from "../../commons/dtos";
import { BookBorrowDto, BookReturnDto, MembersDto } from "./dto";
import { MembersFacade } from "./members.facade";

@ApiTags('Members API')
@ApiExtraModels(MembersDto, BookBorrowDto, BookReturnDto)
@Controller('members')
export class MembersController {
    constructor(private readonly membersFacade: MembersFacade) {}
    
    @ResponseOkSchema(MembersDto)
    @Get()
    async getAllMembers(@Query() query: QueryPaginationDto): Promise<ResponsePaggingDto<MembersDto>> {
        const pagging = await this.membersFacade.getPaggingMeta(query);
        const items = await this.membersFacade.getPaggingItems(query);

        return new ResponsePaggingDto<MembersDto>({
            result: items.map(item => plainToClass(MembersDto, item)),
            pagging: pagging,
        });
    }
    
    @ResponseOkSchema(MembersDto)
    @Get(':memberCode')
    async getMemberByCode(@Param('memberCode') memberCode: string): Promise<ResponseOkDto<MembersDto>> {
        const result = await this.membersFacade.getItemByCode(memberCode);
        
        return new ResponseOkDto<MembersDto>({
            result: plainToClass(MembersDto, result),
        });
    }
    
    @ResponseErrorSchema(400)
    @ResponseOkSchema(BookBorrowDto, 201)
    @HttpCode(201)
    @Post(':memberCode/borrow/:bookCode')
    async postBorrowBook(@Param('memberCode') memberCode: string, @Param('bookCode') bookCode: string): Promise<ResponseOkDto<BookBorrowDto>> {
        const messages = await this.membersFacade.borrow(memberCode, bookCode);
        return new ResponseOkDto<BookBorrowDto>({
            result: { bookCode, memberCode },
            messages: messages,
        });
    }
    
    @ResponseErrorSchema(400)
    @ResponseOkSchema(BookReturnDto, 201)
    @HttpCode(201)
    @Post(':memberCode/return/:bookCode')
    async postReturnBook(@Param('memberCode') memberCode: string, @Param('bookCode') bookCode: string): Promise<ResponseOkDto<BookReturnDto>> {
        const [ isPenalty, messages ] = await this.membersFacade.return(memberCode, bookCode);
        return new ResponseOkDto({
            result: { bookCode, memberCode, isPenalty },
            messages: messages,
        });
    }
}