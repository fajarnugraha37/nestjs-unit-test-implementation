import { Transform } from "class-transformer";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { BorrowsEntity } from "./borrows.entity";
import { PenaltiesEntity } from "./penalties.entity";

@Entity({ name: 'members' })
export class MembersEntity {
    @PrimaryColumn({ length: 25 })
    code: string;

    @Column({ length: 25 })
    name: string;
    
    @OneToMany(() => BorrowsEntity, (item: BorrowsEntity) => item.member)
    borrows: BorrowsEntity[];
    
    @OneToMany(() => PenaltiesEntity, (item: PenaltiesEntity) => item.member)
    penalties: PenaltiesEntity[];
    
    @Transform(v => (!isNaN(v.value) ? Number(v.value) : v.value))
    beingBorrowed?: number;
    
    constructor(data: Partial<MembersEntity>) {
        Object.assign(this, data);
    }
}