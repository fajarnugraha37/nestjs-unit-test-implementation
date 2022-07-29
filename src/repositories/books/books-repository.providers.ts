import { Provider } from "@nestjs/common";
import { MembersBooksRepository } from "../../facades/members";
import { BooksRepository } from "../../facades/books";
import { BooksImplRepository } from "./books-impl.repository";

export const BooksRepositoryProvider: Provider[] = [
    {
        provide: BooksImplRepository,
        useClass: BooksImplRepository,
    },
    {
        provide: BooksRepository,
        useExisting: BooksImplRepository,
    },
    {
        provide: MembersBooksRepository,
        useExisting: BooksImplRepository,
    },
]