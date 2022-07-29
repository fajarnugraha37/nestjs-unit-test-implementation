import { Provider } from "@nestjs/common";
import { MembersFacade } from "../../controllers/members";
import { MembersImplFacade } from "./members-impl.facade";

export const MembersFacadeProviders: Provider[] = [
    {
        provide: MembersImplFacade,
        useClass: MembersImplFacade,
    },
    {
        provide: MembersFacade,
        useExisting: MembersImplFacade,
    },
];