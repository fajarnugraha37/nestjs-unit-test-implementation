import { BooksEntity } from "../../databases";

type Filter = {
    take: number,
    skip: number,
    canBeBorrowOnly: boolean,
}

export abstract class BooksRepository {
    abstract getItemByCode(code: string): Promise<BooksEntity>
    abstract getCount(canBeBorrowOnly: boolean): Promise<number>;
    abstract getItems(filter: Filter): Promise<BooksEntity[]>;
}