import { Provider } from "@nestjs/common";
import { MembersRepository } from "../../facades/members";
import { MembersImplRepository } from "./members-impl.repository";

export const MembersRepositoryProvider: Provider[] = [
    {
        provide: MembersImplRepository,
        useClass: MembersImplRepository,
    },
    {
        provide: MembersRepository,
        useExisting: MembersImplRepository,
    }
]