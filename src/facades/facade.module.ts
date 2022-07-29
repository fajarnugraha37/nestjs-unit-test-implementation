import { Global, Module } from "@nestjs/common";
import { BooksFacadeProviders } from "./books";
import { MembersFacadeProviders } from "./members";

const FacadeProviders = [
    ...BooksFacadeProviders,
    ...MembersFacadeProviders,
];

@Global()
@Module({
    providers: FacadeProviders,
    exports: FacadeProviders,
})
export class FacadeModule {}