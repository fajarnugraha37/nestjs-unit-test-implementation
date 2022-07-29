import { Transform } from "class-transformer";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { BorrowsEntity } from "./borrows.entity";

@Entity({ name: 'books' })
export class BooksEntity {
    @PrimaryColumn({ length: 25 })
    code: string;
    
    @Column({ length: 100 })
    title: string;
    
    @Column({ length: 25 })
    author: string;
    
    @Column({ type: 'int' })
    stock: number;
    
    @OneToMany(() => BorrowsEntity, (item: BorrowsEntity) => item.book)
    borrows: BorrowsEntity[];

    @Transform(v => (!isNaN(v.value) ? Number(v.value) : v.value))
    notBorrowed?: number;

    constructor(data: Partial<BooksEntity>) {
        Object.assign(this, data);
    }
}