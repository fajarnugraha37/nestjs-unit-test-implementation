import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BooksEntity } from "./books.entity";
import { MembersEntity } from "./members.entity";
import { PenaltiesEntity } from "./penalties.entity";

@Entity({ name: 'borrows' })
export class BorrowsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 25 })
    memberCode: string;
    
    @Column({ length: 25 })
    bookCode: string;
    
    @Column()
    public borrowedAt: Date;
    
    @Column({ nullable: true })
    public returnedAt?: Date;
    
    @ManyToOne(() => BooksEntity, (item: BooksEntity) => item.borrows)
    @JoinColumn()
    book: BooksEntity;
    
    @ManyToOne(() => MembersEntity, (item: MembersEntity) => item.borrows)
    @JoinColumn()
    member: MembersEntity;
    
    @OneToOne(() => PenaltiesEntity, (item: PenaltiesEntity) => item.borrow)
    penalty: PenaltiesEntity;

    constructor(data: Partial<BorrowsEntity>) {
        Object.assign(this, data);
    }
}