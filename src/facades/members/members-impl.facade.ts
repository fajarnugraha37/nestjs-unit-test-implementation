import { BadRequestException, Injectable } from "@nestjs/common";
import { BorrowsEntity, MembersEntity, PenaltiesEntity } from "../../databases";
import { MembersFacade } from "../../controllers/members";
import { MembersRepository } from "./members.repository";
import { PagingDto } from "../../commons/dtos";
import { MembersBooksRepository } from "./members-books.repository";

@Injectable()
export class MembersImplFacade implements MembersFacade {
    static readonly MAX_BORROWED_BOOK = 2;
    static readonly PENALTY_DURATION = 3 * 24; // 3 hari
    static readonly MAX_BORROWED_TIME = 7 * 24; // 7 hari
    static readonly ONE_HOUR = 3_600_000;

    constructor(private readonly membersRepository: MembersRepository, private readonly membersBooksRepository: MembersBooksRepository) {}

    async borrow(memberCode: string, bookCode: string): Promise<string[]> {
        const member = await this.membersRepository.getItemByCode(memberCode);
        // check member ada atau tidak
        if(!member) {
            throw new BadRequestException(`Member dengan code ${memberCode} tidak ditemukan`);
        }
        // check member sudah mencapai batas peminjaman buku
        if(member.beingBorrowed >= MembersImplFacade.MAX_BORROWED_BOOK) {
            throw new BadRequestException(`Anda sudah meminjam lebih >= ${MembersImplFacade.MAX_BORROWED_BOOK} buku, kembalikan buku terlebih dahulu untuk meminjam lagi`);
        }
        
        const book = await this.membersBooksRepository.getItemByCode(bookCode);
        // check buku ada atau tidak
        if(!book) {
            throw new BadRequestException(`Book dengan code ${bookCode} tidak ditemukan`);
        }
        // check apakah masih ada buku yang dipinjam
        if(book.notBorrowed < 1) {
            throw new BadRequestException(`Seluruh book ${book.title} telah dipinjam`);
        }

        // check apakah member sedang dalam masa penalty 3 hari
        const penalty = await this.membersRepository.getLatestPenalty(memberCode);
        if(penalty) {
            const diff = Math.abs(penalty.penalizedAt.getTime() - Date.now()) / MembersImplFacade.ONE_HOUR;
            if(diff <= MembersImplFacade.PENALTY_DURATION) {
                throw new BadRequestException(`Member ${memberCode} masih dalam masa penalty`);
            }
        }
        
        // menyimpan data peminjaman buku
        const borrow = await this.membersRepository.insertBorrow(new BorrowsEntity({
            bookCode, memberCode, borrowedAt: new Date(),
        }));

        return [
            `Member ${borrow.memberCode} berhasil meminjam book ${borrow.bookCode} pada pukul ${borrow.borrowedAt.toLocaleTimeString()}`
        ];
    }
    
    async return(memberCode: string, bookCode: string): Promise<[boolean, string[]]> {
        const member = await this.membersRepository.getItemByCode(memberCode);
        // check member ada atau tidak
        if(!member) {
            throw new BadRequestException(`Member dengan code ${memberCode} tidak ditemukan`);
        }

        const book = await this.membersBooksRepository.getItemByCode(bookCode);
        // check buku ada atau tidak
        if(!book) {
            throw new BadRequestException(`Book dengan code ${bookCode} tidak ditemukan`);
        }
        
        let borrowedbook = await this.membersRepository.getBorrowedBook(memberCode, bookCode);
        // check apakah betul member sedang meminjam buku tersebut
        if(!borrowedbook) {
            throw new BadRequestException(`Member ${memberCode} tidak sedang meminjam Book ${bookCode}`);
        }

        // If the book is returned after more than 7 days, the member will be subject to a penalty. Member with penalty cannot able to borrow the book for 3 days
        const diff = Math.abs(borrowedbook.borrowedAt.getTime() - Date.now()) / MembersImplFacade.ONE_HOUR;
        let isPenalty = false;
        let message = `Book ${bookCode} yang dipinjam oleh ${memberCode} berhasil dikembalikan`;

        if(diff > MembersImplFacade.MAX_BORROWED_TIME) {
            isPenalty = true;
            message += ', namun dikarenakan pengembalian terlambat anda akan dikenakan penalty tidak bisa meminjam buku dalam periode tertentu';
            await this.membersRepository.insertPenalty(new PenaltiesEntity({
                borrowId: borrowedbook.id, memberCode, penalizedAt: new Date(),
            }))
        }

        // lakukan proses pengembalin
        borrowedbook.returnedAt = new Date();
        borrowedbook = await this.membersRepository.updateBorrow(borrowedbook);
        
        return [ isPenalty, [message] ];
    }
    
    async getItemByCode(code: string): Promise<MembersEntity> {
        return await this.membersRepository.getItemByCode(code);
    }
    
    async getPaggingMeta({ page, rowsPerPage }): Promise<PagingDto> {
        const paggingMeta = new PagingDto();
        paggingMeta.page = page;
        paggingMeta.rowsPerPage = rowsPerPage;
        paggingMeta.totalRows = await this.membersRepository.getCount();
        paggingMeta.totalPages = Math.ceil(paggingMeta.totalRows / paggingMeta.rowsPerPage);

        return paggingMeta;
    }
    
    async getPaggingItems({ page, rowsPerPage }): Promise<MembersEntity[]> {
        const take = rowsPerPage;
        const skip = (page-1) * take;
        const items = await this.membersRepository.getItems({ skip, take });
        
        return items;
    }
    
}