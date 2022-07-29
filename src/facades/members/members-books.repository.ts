import { BooksEntity } from "../../databases";

export abstract class MembersBooksRepository {
    abstract getItemByCode(code: string): Promise<BooksEntity>
}