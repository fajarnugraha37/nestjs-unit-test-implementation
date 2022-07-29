import { BadRequestException, Provider } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { BooksEntity, BorrowsEntity, MembersEntity, PenaltiesEntity } from "../../databases";
import { MembersFacade } from "../../controllers/members";
import { MembersBooksRepository } from "./members-books.repository";
import { MembersImplFacade } from "./members-impl.facade";
import { MembersRepository } from "./members.repository";

const TestMembersRepositoryProvider: Provider[] = [
    {
        provide: MembersRepository,
        useValue: {
            getItemByCode: jest.fn(() => []),
            getCount: jest.fn(() => []),
            getItems: jest.fn(() => []),
            getLatestPenalty: jest.fn(() => []),
            getBorrowedBook: jest.fn(() => []),
            updateBorrow: jest.fn(() => []),
            insertBorrow: jest.fn(() => []),
            insertPenalty: jest.fn(() => []),
        },
    },
    {
        provide: MembersBooksRepository,
        useValue: {
            getItemByCode: jest.fn(() => []),
        },
    },
];

describe(MembersFacade.name, () => {
    let app: TestingModule;
    let membersImplFacade: MembersImplFacade;
    let membersRepository: MembersRepository;
    let membersBooksRepository: MembersBooksRepository;
    
    beforeAll(async () => {
        app = await Test.createTestingModule({
            providers: [
                MembersImplFacade,
                ...TestMembersRepositoryProvider,
            ],
        }).compile();
        
        membersImplFacade = app.get<MembersImplFacade>(MembersImplFacade);
        membersRepository = app.get<MembersRepository>(MembersRepository);
        membersBooksRepository = app.get<MembersBooksRepository>(MembersBooksRepository);
    });
    
    it(`${MembersImplFacade.name} - dependency`, () => {
        expect(membersImplFacade).toBeDefined();
        expect(membersRepository).toBeDefined();
        expect(membersBooksRepository).toBeDefined();
    });

    it(`${MembersImplFacade.name}@borrow - case direject karena member tidak ada`, async() => {
        const memberCode = '09275';
        const bookCode = 'HSB-092';

        jest.spyOn(membersRepository, 'getItemByCode').mockImplementation(async() => undefined);
        
        try {
            await membersImplFacade.borrow(memberCode, bookCode);
            expect(true).toBe(false);
        } catch (e) {
            if(e instanceof BadRequestException) {
                expect(e.message).toBe(`Member dengan code ${memberCode} tidak ditemukan`);
            } else {
                expect(true).toBe(false);
            }
        }
    });

    it(`${MembersImplFacade.name}@borrow - case direject karena member mencapai batas peminjaman buku`, async() => {
        const memberCode = '09275';
        const bookCode = 'HSB-092';
        const member = new MembersEntity({
            code: memberCode,
            name: 'name',
            beingBorrowed: MembersImplFacade.MAX_BORROWED_BOOK,  
        });

        jest.spyOn(membersRepository, 'getItemByCode').mockImplementation(async() => member);
        
        try {
            await membersImplFacade.borrow(memberCode, bookCode);
            expect(true).toBe(false);
        } catch (e) {
            if(e instanceof BadRequestException) {
                expect(e.message).toBe(`Anda sudah meminjam lebih >= ${MembersImplFacade.MAX_BORROWED_BOOK} buku, kembalikan buku terlebih dahulu untuk meminjam lagi`);
            } else {
                expect(true).toBe(false);
            }
        }
    });

    it(`${MembersImplFacade.name}@borrow - case direject karena buku tidak ada`, async() => {
        const memberCode = '09275';
        const bookCode = 'HSB-092';
        const member = new MembersEntity({
            code: memberCode,
            name: 'name',
            beingBorrowed: 0,  
        });
        
        jest.spyOn(membersRepository, 'getItemByCode').mockImplementation(async() => member);
        jest.spyOn(membersBooksRepository, 'getItemByCode').mockImplementation(async() => undefined);
        
        try {
            await membersImplFacade.borrow(memberCode, bookCode);
            expect(true).toBe(false);
        } catch (e) {
            if(e instanceof BadRequestException) {
                expect(e.message).toBe(`Book dengan code ${bookCode} tidak ditemukan`);
            } else {
                expect(true).toBe(false);
            }
        }
    });
    
    it(`${MembersImplFacade.name}@borrow - case direject karena buku ada tapi sudah habis terpinjam`, async() => {
        const memberCode = '09275';
        const bookCode = 'HSB-092';
        const member = new MembersEntity({
            code: memberCode,
            name: 'name',
            beingBorrowed: 0,  
        });
        const book = new BooksEntity({
            code: bookCode,
            author: 'author',
            title: 'title',
            stock: 1,
            notBorrowed: 0,
        })
        
        jest.spyOn(membersRepository, 'getItemByCode').mockImplementation(async() => member);
        jest.spyOn(membersBooksRepository, 'getItemByCode').mockImplementation(async() => book);
        
        try {
            await membersImplFacade.borrow(memberCode, bookCode);
            expect(true).toBe(false);
        } catch (e) {
            if(e instanceof BadRequestException) {
                expect(e.message).toBe(`Seluruh book ${book.title} telah dipinjam`);
            } else {
                expect(true).toBe(false);
            }
        }
    });

    it(`${MembersImplFacade.name}@borrow - case direject karena member sedang dalam masa penalty`, async() => {
        const memberCode = '09275';
        const bookCode = 'HSB-092';
        const member = new MembersEntity({
            code: memberCode,
            name: 'name',
            beingBorrowed: 0,  
        });
        const book = new BooksEntity({
            code: bookCode,
            author: 'author',
            title: 'title',
            stock: 1,
            notBorrowed: 1,
        });
        const penalty = new PenaltiesEntity({
            borrowId: 1,
            id: 1,
            memberCode: memberCode,
            penalizedAt: new Date(),
        })
        
        jest.spyOn(membersRepository, 'getItemByCode').mockImplementation(async() => member);
        jest.spyOn(membersRepository, 'getLatestPenalty').mockImplementation(async() => penalty);
        jest.spyOn(membersBooksRepository, 'getItemByCode').mockImplementation(async() => book);
        
        try {
            await membersImplFacade.borrow(memberCode, bookCode);
            expect(true).toBe(false);
        } catch (e) {
            if(e instanceof BadRequestException) {
                expect(e.message).toBe(`Member ${memberCode} masih dalam masa penalty`);
            } else {
                expect(true).toBe(false);
            }
        }
    });

    it(`${MembersImplFacade.name}@borrow - case diaccept karena member dan buku ada serta tidak punya riwayat penalty`, async() => {
        const memberCode = '09275';
        const bookCode = 'HSB-092';
        const member = new MembersEntity({
            code: memberCode,
            name: 'name',
            beingBorrowed: 0,  
        });
        const book = new BooksEntity({
            code: bookCode,
            author: 'author',
            title: 'title',
            stock: 1,
            notBorrowed: 1,
        });
        const borrow = new BorrowsEntity({
            bookCode: bookCode,
            memberCode: memberCode,
            borrowedAt: new Date(),
        });
        
        jest.spyOn(membersRepository, 'getItemByCode').mockImplementation(async() => member);
        jest.spyOn(membersRepository, 'getLatestPenalty').mockImplementation(async() => undefined);
        jest.spyOn(membersRepository, 'insertBorrow').mockImplementation(async() => borrow);
        jest.spyOn(membersBooksRepository, 'getItemByCode').mockImplementation(async() => book);
        
        expect(await membersImplFacade.borrow(memberCode, bookCode)).toStrictEqual([
            `Member ${borrow.memberCode} berhasil meminjam book ${borrow.bookCode} pada pukul ${borrow.borrowedAt.toLocaleTimeString()}`
        ]);
    });

    it(`${MembersImplFacade.name}@borrow - case diaccept karena member dan buku, meskipun punya riwayat penalty tapi telah belalu`, async() => {
        const memberCode = '09275';
        const bookCode = 'HSB-092';
        const member = new MembersEntity({
            code: memberCode,
            name: 'name',
            beingBorrowed: 0,  
        });
        const book = new BooksEntity({
            code: bookCode,
            author: 'author',
            title: 'title',
            stock: 1,
            notBorrowed: 1,
        });
        const penalty = new PenaltiesEntity({
            memberCode: memberCode,
            id: 1,
            borrowId: 1,
            penalizedAt: new Date(Date.now() - (MembersImplFacade.PENALTY_DURATION+1) * MembersImplFacade.ONE_HOUR ),
        });
        const borrow = new BorrowsEntity({
            bookCode: bookCode,
            memberCode: memberCode,
            borrowedAt: new Date(),
        });
        
        jest.spyOn(membersRepository, 'getItemByCode').mockImplementation(async() => member);
        jest.spyOn(membersRepository, 'getLatestPenalty').mockImplementation(async() => penalty);
        jest.spyOn(membersRepository, 'insertBorrow').mockImplementation(async() => borrow);
        jest.spyOn(membersBooksRepository, 'getItemByCode').mockImplementation(async() => book);
        
        expect(await membersImplFacade.borrow(memberCode, bookCode)).toStrictEqual([
            `Member ${borrow.memberCode} berhasil meminjam book ${borrow.bookCode} pada pukul ${borrow.borrowedAt.toLocaleTimeString()}`
        ]);
    });

    it(`${MembersImplFacade.name}@return - case direject karena member tidak ada`, async() => {
        const memberCode = '09275';
        const bookCode = 'HSB-092';

        jest.spyOn(membersRepository, 'getItemByCode').mockImplementation(async() => undefined);
        
        try {
            await membersImplFacade.return(memberCode, bookCode);
            expect(true).toBe(false);
        } catch (e) {
            if(e instanceof BadRequestException) {
                expect(e.message).toBe(`Member dengan code ${memberCode} tidak ditemukan`);
            } else {
                expect(true).toBe(false);
            }
        }
    });

    it(`${MembersImplFacade.name}@return - case direject karena buku tidak ada`, async() => {
        const memberCode = '09275';
        const bookCode = 'HSB-092';
        const member = new MembersEntity({
            code: memberCode,
            name: 'name',
            beingBorrowed: 0,  
        });
        
        jest.spyOn(membersRepository, 'getItemByCode').mockImplementation(async() => member);
        jest.spyOn(membersBooksRepository, 'getItemByCode').mockImplementation(async() => undefined);
        
        try {
            await membersImplFacade.return(memberCode, bookCode);
            expect(true).toBe(false);
        } catch (e) {
            if(e instanceof BadRequestException) {
                expect(e.message).toBe(`Book dengan code ${bookCode} tidak ditemukan`);
            } else {
                expect(true).toBe(false);
            }
        }
    });

    it(`${MembersImplFacade.name}@return - case direject karena member sedang tidak meminjam buku tersebut`, async() => {
        const memberCode = '09275';
        const bookCode = 'HSB-092';
        const member = new MembersEntity({
            code: memberCode,
            name: 'name',
            beingBorrowed: 0,  
        });
        const book = new BooksEntity({
            code: bookCode,
            author: 'author',
            title: 'title',
            stock: 1,
            notBorrowed: 1,
        });

        jest.spyOn(membersRepository, 'getItemByCode').mockImplementation(async() => member);
        jest.spyOn(membersBooksRepository, 'getItemByCode').mockImplementation(async() => book);
        jest.spyOn(membersRepository, 'getBorrowedBook').mockImplementation(async() => undefined);

        try {
            await membersImplFacade.return(memberCode, bookCode);
            expect(true).toBe(false);
        } catch (e) {
            if(e instanceof BadRequestException) {
                expect(e.message).toBe(`Member ${memberCode} tidak sedang meminjam Book ${bookCode}`);
            } else {
                expect(true).toBe(false);
            }
        }
    });

    it(`${MembersImplFacade.name}@return - case diaccept tanpa penalty`, async() => {
        const memberCode = '09275';
        const bookCode = 'HSB-092';
        const member = new MembersEntity({
            code: memberCode,
            name: 'name',
            beingBorrowed: 0,  
        });
        const book = new BooksEntity({
            code: bookCode,
            author: 'author',
            title: 'title',
            stock: 1,
            notBorrowed: 0,
        });
        const borrow = new BorrowsEntity({
            bookCode: bookCode,
            memberCode: memberCode,
            borrowedAt: new Date(Date.now() - MembersImplFacade.ONE_HOUR),
        });

        jest.spyOn(membersRepository, 'getItemByCode').mockImplementation(async() => member);
        jest.spyOn(membersBooksRepository, 'getItemByCode').mockImplementation(async() => book);
        jest.spyOn(membersRepository, 'getBorrowedBook').mockImplementation(async() => borrow);
        jest.spyOn(membersRepository, 'updateBorrow').mockImplementation(async() => borrow);

        const received = await membersImplFacade.return(memberCode, bookCode);
        expect(received[0]).toEqual(false);
        expect(received[1]).toStrictEqual([
            `Book ${bookCode} yang dipinjam oleh ${memberCode} berhasil dikembalikan`
        ]);
    });

    it(`${MembersImplFacade.name}@return - case diaccept dengan penalty`, async() => {
        const memberCode = '09275';
        const bookCode = 'HSB-092';
        const member = new MembersEntity({
            code: memberCode,
            name: 'name',
            beingBorrowed: 0,  
        });
        const book = new BooksEntity({
            code: bookCode,
            author: 'author',
            title: 'title',
            stock: 1,
            notBorrowed: 0,
        });
        const borrow = new BorrowsEntity({
            bookCode: bookCode,
            memberCode: memberCode,
            borrowedAt: new Date(Date.now() - (MembersImplFacade.MAX_BORROWED_TIME+1) * MembersImplFacade.ONE_HOUR),
        });

        jest.spyOn(membersRepository, 'getItemByCode').mockImplementation(async() => member);
        jest.spyOn(membersBooksRepository, 'getItemByCode').mockImplementation(async() => book);
        jest.spyOn(membersRepository, 'getBorrowedBook').mockImplementation(async() => borrow);
        jest.spyOn(membersRepository, 'updateBorrow').mockImplementation(async() => borrow);

        const received = await membersImplFacade.return(memberCode, bookCode);
        expect(received[0]).toEqual(true);
        expect(received[1]).toStrictEqual([
            `Book ${bookCode} yang dipinjam oleh ${memberCode} berhasil dikembalikan, namun dikarenakan pengembalian terlambat anda akan dikenakan penalty tidak bisa meminjam buku dalam periode tertentu`
        ]);
    });
    
    it(`${MembersImplFacade.name}@getItemByCode - check flow input`, async() => {
        const bookCode = 'code';
        const expected = new MembersEntity({});

        jest.spyOn(membersRepository, 'getItemByCode').mockImplementation(async() => expected);

        await membersImplFacade.getItemByCode(bookCode);
        expect(membersRepository.getItemByCode).toBeCalled();
        expect(membersRepository.getItemByCode).toBeCalledWith(bookCode);
    });

    it(`${MembersImplFacade.name}@getPaggingMeta - chcek flow input`, async() => {
        const input = {
            page: 3,
            rowsPerPage: 20,
            canBeBorrowOnly: false,
        };
        const totalRows = 45;
        
        jest.spyOn(membersRepository, 'getCount').mockImplementation(async() => totalRows);
        
        await membersImplFacade.getPaggingMeta(input);
        expect(membersRepository.getCount).toBeCalled();
    });
    
    it(`${MembersImplFacade.name}@getPaggingMeta - kasus yang di accept`, async() => {
        const input = {
            page: 3,
            rowsPerPage: 20,
            canBeBorrowOnly: false,
        };
        const totalRows = 45;
        const totalPages = 3;
        
        jest.spyOn(membersRepository, 'getCount').mockImplementation(async() => totalRows);
        
        const received = await membersImplFacade.getPaggingMeta(input);
        expect(received.totalPages).toEqual(totalPages);
    });
    
    it(`${MembersImplFacade.name}@getPaggingMeta - kasus yang di reject`, async() => {
        const input = {
            page: 1,
            rowsPerPage: 50,
            canBeBorrowOnly: false,
        };
        const totalRows = 45;
        const totalPages = 2;
        
        jest.spyOn(membersRepository, 'getCount').mockImplementation(async() => totalRows);
        
        const received = await membersImplFacade.getPaggingMeta(input);
        expect(received.totalPages).not.toEqual(totalPages);
    });
    
    it(`${MembersImplFacade.name}@getPaggingItems - check flow input`, async() => {
        const input = {
            page: 3,
            rowsPerPage: 7,
            canBeBorrowOnly: false,
        };
        const take = 7;
        const skip = 14;
        
        jest.spyOn(membersRepository, 'getItems').mockImplementation(async() => []);

        await membersImplFacade.getPaggingItems(input);
        expect(membersRepository.getItems).toBeCalled();
        expect(membersRepository.getItems).toBeCalledWith({ skip, take });
    });
});