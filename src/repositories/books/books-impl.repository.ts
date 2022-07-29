import { Injectable } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { MembersBooksRepository } from "../../facades/members";
import { EntityManager } from "typeorm";
import { BooksEntity, BorrowsEntity } from "../../databases";
import { BooksRepository } from "../../facades/books";

@Injectable()
export class BooksImplRepository implements BooksRepository, MembersBooksRepository {
    constructor(private readonly manager: EntityManager) {}

    async getItemByCode(code: string): Promise<BooksEntity> {
        const result = await this.manager
            .createQueryBuilder(BooksEntity, 'books')
            .addSelect('(books.stock - COUNT(borrows.id))', 'notBorrowed')
            .addSelect('books.*')
            .leftJoin(BorrowsEntity, 'borrows', 'books.code = borrows.bookCode AND borrows.returnedAt IS NULL')
            .having('books.code = :code', { code })
            .groupBy('books.code')
            .getRawOne();

        return plainToClass(BooksEntity, result);
    }

    async getCount(canBeBorrowOnly: boolean): Promise<number> {
        const result = await this.manager
            .createQueryBuilder()
            .select('COUNT(notBorrowed)', 'total')
            .from(
                (qb) => {
                    qb.addSelect('(books.stock - COUNT(borrows.id))', 'notBorrowed')
                        .from(BooksEntity, 'books')
                        .leftJoin(BorrowsEntity, 'borrows', 'books.code = borrows.bookCode AND borrows.returnedAt IS NULL')
                        .groupBy('books.code');
                    if(canBeBorrowOnly === true) {
                        qb.having('notBorrowed > 0')
                    }
                    return qb;
                }, 
                'groupBooks',
            )
            .getRawOne();

        return +result.total;
    }

    async getItems({ take, skip, canBeBorrowOnly }): Promise<BooksEntity[]> {
        const query = this.manager
            .createQueryBuilder()
            .from(
                (qb) => {
                    qb.addSelect('(books.stock - COUNT(borrows.id))', 'notBorrowed')
                        .addSelect('books.*')
                        .from(BooksEntity, 'books')
                        .leftJoin(BorrowsEntity, 'borrows', 'books.code = borrows.bookCode AND borrows.returnedAt IS NULL')
                        .groupBy('books.code')
                        if(canBeBorrowOnly === true) {
                            qb.having('notBorrowed > 0')
                        }
                    return qb;
                }, 
                'groupBooks'
            )
            .take(take)
            .skip(skip);

        return (await query.getRawMany()).map(result => plainToClass(BooksEntity, result));
    }
}