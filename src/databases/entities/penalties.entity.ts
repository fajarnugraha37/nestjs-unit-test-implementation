import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { BorrowsEntity } from "./borrows.entity";
import { MembersEntity } from "./members.entity";

@Entity({ name: 'penalties' })
export class PenaltiesEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @PrimaryColumn({ length: 25 })
    memberCode: string;
    
    @Column()
    borrowId: number;
    
    @Column()
    public penalizedAt: Date;
    
    @ManyToOne(() => MembersEntity, (item: MembersEntity) => item.penalties)
    @JoinColumn()
    member: MembersEntity;
    
    @OneToOne(() => BorrowsEntity, (item: BorrowsEntity) => item.penalty)
    @JoinColumn()
    borrow: BorrowsEntity;

    constructor(data: Partial<PenaltiesEntity>) {
        Object.assign(this, data);
    }
}