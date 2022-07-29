import { Provider } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToClass } from 'class-transformer';
import { ResponseOkDto, ResponsePaggingDto } from '../../commons/dtos';
import { MembersEntity } from '../../databases';
import { BookBorrowDto, BookReturnDto, MembersDto } from './dto';
import { MembersController } from './members.controller';
import { MembersFacade } from './members.facade';


const TestMembersFacadeProvider: Provider = {
    provide: MembersFacade,
    useValue: {
        getPaggingMeta: jest.fn(() => []),
        getPaggingItems: jest.fn(() => []),
        getItemByCode: jest.fn(() => []),
        borrow: jest.fn(() => []),
        return: jest.fn(() => []),
    },
};

describe(MembersController.name, () => {
    let app: TestingModule;
    let membersController: MembersController;
    let membersFacade: MembersFacade;

    beforeAll(async () => {
        app = await Test.createTestingModule({
            controllers: [ 
                MembersController
            ],
            providers: [
                TestMembersFacadeProvider,
            ],
        }).compile();
        
        membersFacade = app.get<MembersFacade>(MembersFacade);
        membersController = app.get<MembersController>(MembersController);
    });

    it(`${MembersController.name} - dependency`, () => {
        expect(membersFacade).toBeDefined();
        expect(membersController).toBeDefined();
    });
    
    it(`${MembersController.name}@getMemberByCode - check flow`, async() => {
        const param = 'code';
        const result = new MembersEntity({
            code: 'code',
            name: 'name',
            beingBorrowed: 0,
        });
        const expected = new ResponseOkDto<MembersDto>({
            result: plainToClass(MembersDto, result),
        });

        jest.spyOn(membersFacade, 'getItemByCode').mockImplementation(async() => result);

        const received = await membersController.getMemberByCode(param);
        expect(received.messages).toStrictEqual(expected.messages);
        expect(received.result).toStrictEqual(expected.result);
        
        expect(membersFacade.getItemByCode).toHaveBeenCalled();
        expect(membersFacade.getItemByCode).toHaveBeenCalledWith(param);
    });

    it(`${MembersController.name}@getAllMembers - check flow`, async() => {
        const query = {
            page: 1,
            rowsPerPage: 10,
            canBeBorrowOnly: false,
        };
        const itemsResult: MembersEntity[] = [
            new MembersEntity({
                code: 'code',
                name: 'name',
                beingBorrowed: 0,
            }),
            new MembersEntity({
                code: 'code',
                name: 'name',
                beingBorrowed: 0,
            }),
        ];
        const paggingResult = {
            page: query.page,
            rowsPerPage: query.rowsPerPage,
            totalRows: itemsResult.length,
            totalPages: 1,
        };
        const expected = new ResponsePaggingDto<MembersDto>({
            result: itemsResult.map(item => plainToClass(MembersDto, item)),
            pagging: paggingResult,
        })
        
        jest.spyOn(membersFacade, 'getPaggingItems').mockImplementation(async() => itemsResult);
        jest.spyOn(membersFacade, 'getPaggingMeta').mockImplementation(async() => paggingResult);

        const received = await membersController.getAllMembers(query);
        expect(received.messages).toStrictEqual(expected.messages);
        expect(received.pagging).toStrictEqual(expected.pagging);
        expect(received.result).toStrictEqual(expected.result);
        
        expect(membersFacade.getPaggingItems).toHaveBeenCalled();
        expect(membersFacade.getPaggingItems).toHaveBeenCalledWith(query);
        expect(membersFacade.getPaggingMeta).toHaveBeenCalled();
        expect(membersFacade.getPaggingMeta).toHaveBeenCalledWith(query);
    });
    
    it(`${MembersController.name}@postBorrowBook - check flow`, async() => {
        const memberCode = 'memberCode';
        const bookCode = 'bookCode';
        const expected = new ResponseOkDto<BookBorrowDto>({
            messages: [ `Member ${memberCode} berhasil meminjam book ${bookCode} pada pukul ${(new Date()).toLocaleTimeString()}` ],
            result: { bookCode, memberCode },
        })
        
        jest.spyOn(membersFacade, 'borrow').mockImplementation(async() => expected.messages);

        const received = await membersController.postBorrowBook(memberCode, bookCode);
        expect(received.messages).toStrictEqual(expected.messages);
        expect(received.result).toStrictEqual(expected.result);
        
        expect(membersFacade.borrow).toHaveBeenCalled();
        expect(membersFacade.borrow).toHaveBeenCalledWith(memberCode, bookCode);
    });
    
    it(`${MembersController.name}@postReturnBook - check flow`, async() => {
        const memberCode = 'memberCode';
        const bookCode = 'bookCode';
        const expected = new ResponseOkDto<BookReturnDto>({
            messages: [ `Book ${bookCode} yang dipinjam oleh ${memberCode} berhasil dikembalikan` ],
            result: { bookCode, memberCode, isPenalty: false },
        })
        
        jest.spyOn(membersFacade, 'return').mockImplementation(async() => [ expected.result.isPenalty, expected.messages ]);

        const received = await membersController.postReturnBook(memberCode, bookCode);
        expect(received.messages).toStrictEqual(expected.messages);
        expect(received.result).toStrictEqual(expected.result);

        expect(membersFacade.return).toHaveBeenCalled();
        expect(membersFacade.return).toHaveBeenCalledWith(memberCode, bookCode);
    });
});