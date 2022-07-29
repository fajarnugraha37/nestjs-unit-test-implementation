import { BorrowsEntity, MembersEntity, PenaltiesEntity } from "../../databases";

type Filter = {
    take: number,
    skip: number,
}

export abstract class MembersRepository {
    abstract getItemByCode(code: string): Promise<MembersEntity>;
    abstract getCount(): Promise<number>;
    abstract getItems(filter: Filter): Promise<MembersEntity[]>;
    abstract getLatestPenalty(code: string): Promise<PenaltiesEntity>;
    abstract getBorrowedBook(memberCode: string, bookCode: string): Promise<BorrowsEntity>;
    abstract updateBorrow(borrow: BorrowsEntity): Promise<BorrowsEntity>;
    abstract insertBorrow(borrow: BorrowsEntity): Promise<BorrowsEntity>;
    abstract insertPenalty(penalty: PenaltiesEntity): Promise<PenaltiesEntity>;
}