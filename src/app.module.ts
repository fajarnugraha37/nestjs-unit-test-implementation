import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseProvider } from './databases';
import { RepositoryModule } from './repositories';
import { FacadeModule } from './facades';
import { SeedService } from './databases/seeds';
import { AppController } from './app.controller';
import { BooksModule } from './controllers/books';
import { MembersModule } from './controllers/members';
import { SerialiserInterceptorProvider } from './commons/providers';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.example'],
    }),
    DatabaseProvider,

    RepositoryModule,
    FacadeModule,

    BooksModule,
    MembersModule,
  ],
  controllers: [
    AppController
  ],
  providers: [
    SeedService,
    SerialiserInterceptorProvider,
  ],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly seedService: SeedService) {
  }
  
  async onApplicationBootstrap() {
    await this.seedService.run();
  }
}
