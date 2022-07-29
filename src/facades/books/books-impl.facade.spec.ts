import { Provider } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BooksEntity } from '../../databases';
import { BooksImplFacade } from "./books-impl.facade";
import { BooksRepository } from "./books.repository";

const TestBooksRepositoryProvider: Provider = {
    provide: BooksRepository,
    useValue: {
        getItemByCode: jest.fn(() => []),
        getCount: jest.fn(() => []),
        getItems: jest.fn(() => []),
    },
};

describe(BooksImplFacade.name, () => {
    let app: TestingModule;
    let booksImplFacade: BooksImplFacade;
    let booksRepository: BooksRepository;

    beforeAll(async () => {
        app = await Test.createTestingModule({
            providers: [
                BooksImplFacade,
                TestBooksRepositoryProvider,
            ],
        }).compile();
        
        booksImplFacade = app.get<BooksImplFacade>(BooksImplFacade);
        booksRepository = app.get<BooksRepository>(BooksRepository);
    });

    it(`${BooksImplFacade.name} - dependency`, () => {
        expect(booksImplFacade).toBeDefined();
        expect(booksRepository).toBeDefined();
    });

    it(`${BooksImplFacade.name}@getItemByCode - check flow`, async() => {
        const bookCode = 'code';

        jest.spyOn(booksRepository, 'getItemByCode').mockImplementation(async() => new BooksEntity({}));

        await booksImplFacade.getItemByCode(bookCode);
        expect(booksRepository.getItemByCode).toBeCalled();
        expect(booksRepository.getItemByCode).toBeCalledWith(bookCode);
    });

    it(`${BooksImplFacade.name}@getPaggingMeta - flow`, async() => {
        const input = {
            page: 2,
            rowsPerPage: 20,
            canBeBorrowOnly: false,
        };
        const totalRows = 5;
        
        jest.spyOn(booksRepository, 'getCount').mockImplementation(async() => totalRows);
        
        await booksImplFacade.getPaggingMeta(input);
        expect(booksRepository.getCount).toBeCalled();
        expect(booksRepository.getCount).toBeCalledWith(input.canBeBorrowOnly);
    });
    
    it(`${BooksImplFacade.name}@getPaggingMeta - kasus yang di accept`, async() => {
        const input = {
            page: 4,
            rowsPerPage: 30,
            canBeBorrowOnly: false,
        };
        const totalRows = 91;
        const totalPages = 4;
        
        jest.spyOn(booksRepository, 'getCount').mockImplementation(async() => totalRows);
        
        const received = await booksImplFacade.getPaggingMeta(input);
        expect(received.totalPages).toEqual(totalPages);
    });
    
    it(`${BooksImplFacade.name}@getPaggingMeta - kasus yang harus direject`, async() => {
        const input = {
            page: 1,
            rowsPerPage: 5,
            canBeBorrowOnly: false,
        };
        const totalRows = 51;
        const totalPages = 10;
        
        jest.spyOn(booksRepository, 'getCount').mockImplementation(async() => totalRows);
        
        const received = await booksImplFacade.getPaggingMeta(input);
        expect(received.totalPages).not.toEqual(totalPages);
    });
    
    it(`${BooksImplFacade.name}@getPaggingItems - check flow input`, async() => {
        const input = {
            page: 1,
            rowsPerPage: 20,
            canBeBorrowOnly: false,
        };
        const take = 20;
        const skip = 0;
        
        jest.spyOn(booksRepository, 'getItems').mockImplementation(async() => []);

        await booksImplFacade.getPaggingItems(input);
        expect(booksRepository.getItems).toBeCalled();
        expect(booksRepository.getItems).toBeCalledWith({ skip, take, canBeBorrowOnly: input.canBeBorrowOnly });
    });
});
