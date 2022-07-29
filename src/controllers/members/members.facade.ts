import { PagingDto, QueryPaginationDto } from "../../commons/dtos";
import { MembersEntity } from "../../databases";

export abstract class MembersFacade {
    abstract getPaggingMeta(input: QueryPaginationDto): Promise<PagingDto>;
    abstract getPaggingItems(input: QueryPaginationDto): Promise<MembersEntity[]>;
    abstract getItemByCode(code: string): Promise<MembersEntity>;
    abstract borrow(memberCode: string, bookCode: string): Promise<string[]>;
    abstract return(memberCode: string, bookCode: string): Promise<[boolean, string[]]>;
}