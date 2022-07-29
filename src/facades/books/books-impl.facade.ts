import { Injectable } from "@nestjs/common";
import { BooksEntity } from "../../databases";
import { BooksFacade, QueryPaginationBooksDto } from "../../controllers/books";
import { BooksRepository } from "./books.repository";
import { PagingDto } from "../../commons/dtos";

@Injectable()
export class BooksImplFacade implements BooksFacade {
    constructor(private readonly booksRepository: BooksRepository) {}

    async getItemByCode(code: string): Promise<BooksEntity> {
        return await this.booksRepository.getItemByCode(code);
    }

    async getPaggingMeta({ page, rowsPerPage, canBeBorrowOnly }: QueryPaginationBooksDto): Promise<PagingDto> {
        const paggingMeta = new PagingDto();
        paggingMeta.page = page;
        paggingMeta.rowsPerPage = rowsPerPage;
        paggingMeta.totalRows = await this.booksRepository.getCount(canBeBorrowOnly);
        paggingMeta.totalPages = Math.ceil(paggingMeta.totalRows / paggingMeta.rowsPerPage);

        return paggingMeta;
    }
    
    async getPaggingItems({ page, rowsPerPage, canBeBorrowOnly }: QueryPaginationBooksDto): Promise<BooksEntity[]> {
        const take = rowsPerPage;
        const skip = (page-1) * take;   
        return await this.booksRepository.getItems({ skip, take, canBeBorrowOnly });
    }
} 