import { PagingDto } from "../../commons/dtos";
import { BooksEntity } from "../../databases";
import { QueryPaginationBooksDto } from "./dto";

export abstract class BooksFacade {
    abstract getPaggingMeta(input: QueryPaginationBooksDto): Promise<PagingDto>;
    abstract getPaggingItems(input: QueryPaginationBooksDto): Promise<BooksEntity[]>;
    abstract getItemByCode(code: string): Promise<BooksEntity>;
}