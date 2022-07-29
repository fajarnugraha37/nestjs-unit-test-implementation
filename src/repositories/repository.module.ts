import { Global, Module } from "@nestjs/common";
import { BooksRepositoryProvider } from "./books";
import { MembersRepositoryProvider } from "./members";

const RepositoryProviders = [
    ...BooksRepositoryProvider,
    ...MembersRepositoryProvider,
];

@Global()
@Module({
    providers: RepositoryProviders,
    exports: RepositoryProviders,
})
export class RepositoryModule {}