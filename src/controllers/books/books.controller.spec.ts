import { Provider } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToClass } from 'class-transformer';
import { ResponseOkDto, ResponsePaggingDto } from '../../commons/dtos';
import { BooksEntity } from '../../databases';
import { BooksController } from './books.controller';
import { BooksFacade } from './books.facade';
import { BooksDto } from './dto';

const TestBooksFacadeProvider: Provider = {
    provide: BooksFacade,
    useValue: {
        getPaggingMeta: jest.fn(() => []),
        getPaggingItems: jest.fn(() => []),
        getItemByCode: jest.fn(() => []),
    },
};

describe(BooksController.name, () => {
    let app: TestingModule;
    let booksController: BooksController;
    let booksFacade: BooksFacade;

    beforeAll(async () => {
        app = await Test.createTestingModule({
            controllers: [ 
                BooksController,
            ],
            providers: [ 
                TestBooksFacadeProvider,
            ],
        }).compile();
        
        booksFacade = app.get<BooksFacade>(BooksFacade);
        booksController = app.get<BooksController>(BooksController);
    });

    it(`${BooksController.name} - dependency`, () => {
        expect(booksFacade).toBeDefined();
        expect(booksController).toBeDefined();
    });
    
    it(`${BooksController.name}@getItemByCode - check flow`, async() => {
        const param = 'code';
        const result = new BooksEntity({
            title: 'title',
            code: 'code',
            author: 'author',
            stock: 1,
            notBorrowed: 0,
        });
        const expected = new ResponseOkDto<BooksDto>({
            statusCode: 200,
            result: plainToClass(BooksDto, result),
        });

        jest.spyOn(booksFacade, 'getItemByCode').mockImplementation(async() => result);

        const received = await booksController.getBooksByCode(param);
        expect(received.messages).toStrictEqual(expected.messages);
        expect(received.result).toStrictEqual(expected.result);

        expect(booksFacade.getItemByCode).toHaveBeenCalled();
        expect(booksFacade.getItemByCode).toHaveBeenCalledWith(param);
    });

    it(`${BooksController.name}@getAllBooks - check flow`, async() => {
        const query = {
            page: 1,
            rowsPerPage: 10,
            canBeBorrowOnly: false,
        };
        const itemsResult: BooksEntity[] = [
            new BooksEntity({
                title: 'title',
                code: 'code',
                author: 'author',
                stock: 1,
                notBorrowed: 0,
            }),
            new BooksEntity({
                title: 'title',
                code: 'code',
                author: 'author',
                stock: 1,
                notBorrowed: 0,
            }),
        ];
        const paggingResult = {
            page: query.page,
            rowsPerPage: query.rowsPerPage,
            totalRows: itemsResult.length,
            totalPages: 1,
        };
        const expected = new ResponsePaggingDto<BooksDto>({
            statusCode: 200,
            result: itemsResult.map(item => plainToClass(BooksDto, item)),
            pagging: paggingResult,
        })
        
        jest.spyOn(booksFacade, 'getPaggingItems').mockImplementation(async() => itemsResult);
        jest.spyOn(booksFacade, 'getPaggingMeta').mockImplementation(async() => paggingResult);
        
        const received = await booksController.getAllBooks(query);
        expect(received.messages).toStrictEqual(expected.messages);
        expect(received.pagging).toStrictEqual(expected.pagging);
        expect(received.result).toStrictEqual(expected.result);
        
        expect(booksFacade.getPaggingMeta).toHaveBeenCalled();
        expect(booksFacade.getPaggingMeta).toHaveBeenCalledWith(query);
        expect(booksFacade.getPaggingItems).toBeCalled();
        expect(booksFacade.getPaggingItems).toHaveBeenCalledWith(query);
    });
});