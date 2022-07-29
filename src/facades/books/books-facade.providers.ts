import { Provider } from "@nestjs/common";
import { BooksFacade } from "../../controllers/books";
import { BooksImplFacade } from "./books-impl.facade";

export const BooksFacadeProviders: Provider[] = [
    {
        provide: BooksImplFacade,
        useClass: BooksImplFacade,
    },
    {
        provide: BooksFacade,
        useExisting: BooksImplFacade,
    }
];