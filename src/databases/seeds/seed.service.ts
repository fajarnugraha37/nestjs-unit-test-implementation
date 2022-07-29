import { Injectable } from "@nestjs/common";
import { EntityManager } from "typeorm";
import { BooksEntity, MembersEntity } from "../entities";
import BooksSeed from './books.seed';
import MembersSeed from './members.seed';

@Injectable()
export class SeedService {
    constructor(private readonly manager: EntityManager) {}

    async run() {
        const books = await this.manager
            .createQueryBuilder(BooksEntity, 'books')
            .getOne();
        if(!books) {
            this.manager.save(BooksEntity, BooksSeed);
        }
        
        const members = await this.manager
            .createQueryBuilder(MembersEntity, 'books')
            .getOne();
        if(!members) {
            this.manager.save(MembersEntity, MembersSeed);
        }
    }
}