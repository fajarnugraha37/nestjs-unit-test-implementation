import { Injectable } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { EntityManager } from "typeorm";
import { BorrowsEntity, MembersEntity, PenaltiesEntity } from "../../databases";
import { MembersRepository } from "../../facades/members";

@Injectable()
export class MembersImplRepository implements MembersRepository {
    constructor(private readonly manager: EntityManager) {}

    getBorrowedBook(memberCode: string, bookCode: string): Promise<BorrowsEntity> {
        return this.manager
            .createQueryBuilder(BorrowsEntity, 'borrows')
            .where('borrows.memberCode = :memberCode', { memberCode })
            .andWhere('borrows.bookCode = :bookCode', { bookCode })
            .andWhere('borrows.returnedAt IS NULL')
            .getOne();
    }

    insertBorrow(borrow: BorrowsEntity): Promise<BorrowsEntity> {
        return this.manager.save(BorrowsEntity, borrow);
    }
    
    insertPenalty(penalty: PenaltiesEntity): Promise<PenaltiesEntity> {
        return this.manager.save(PenaltiesEntity, penalty);
    }
    
    async updateBorrow(borrow: BorrowsEntity): Promise<BorrowsEntity> {
        const result = await this.manager
            .createQueryBuilder() 
            .update(BorrowsEntity)
            .set(borrow)
            .where("id = :id", { id: borrow.id })
            .execute();
        return result.affected[0];
    }
    
    async getLatestPenalty(code: string): Promise<PenaltiesEntity> {
        const result = await this.manager
            .createQueryBuilder(PenaltiesEntity, 'penalty')
            .where('penalty.memberCode = :code', { code })
            .orderBy('penalty.penalizedAt', 'DESC')
            .getOne();

        return result;
    }

    async getItemByCode(code: string): Promise<MembersEntity> {
        const result = await this.manager
            .createQueryBuilder(MembersEntity, 'members')
            .addSelect('(COUNT(borrows.id))', 'beingBorrowed')
            .addSelect('members.*')
            .leftJoin(BorrowsEntity, 'borrows', 'members.code = borrows.memberCode AND borrows.returnedAt IS NULL')
            .having('members.code = :code', { code })
            .groupBy('members.code')
            .getRawOne();

        return plainToClass(MembersEntity, result);
    }

    async getCount(): Promise<number> {
        const result = await this.manager
            .createQueryBuilder()
            .select('COUNT(beingBorrowed)', 'total')
            .from(
                (qb) => qb.addSelect('(COUNT(borrows.id))', 'beingBorrowed')
                    .from(MembersEntity, 'members')
                    .leftJoin(BorrowsEntity, 'borrows', 'members.code = borrows.memberCode AND borrows.returnedAt IS NULL')
                    .groupBy('members.code'), 
                'groupMembers',
            )
            .getRawOne();

        return +result.total;
    }
    
    async getItems({ take, skip }): Promise<MembersEntity[]> {
        const query = this.manager
            .createQueryBuilder()
            .from(
                (qb) => qb.addSelect('(COUNT(borrows.id))', 'beingBorrowed')
                    .addSelect('members.*')
                    .from(MembersEntity, 'members')
                    .leftJoin(BorrowsEntity, 'borrows', 'members.code = borrows.memberCode AND borrows.returnedAt IS NULL')
                    .groupBy('members.code'), 
                'groupMembers'
            )
            .take(take)
            .skip(skip);

        return (await query.getRawMany()).map(result => plainToClass(MembersEntity, result));
    }
}