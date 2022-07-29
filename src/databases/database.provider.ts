import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm"; 
import { createConnection } from "typeorm"; 
import { MysqlConnectionOptions } from "typeorm/driver/mysql/MysqlConnectionOptions";

const createDatabase = async (options: TypeOrmModuleOptions, dbName: string): Promise<void> => {
    const connection = await createConnection(options as MysqlConnectionOptions);
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName};`);
    connection.close();
};

export const DatabaseProvider = TypeOrmModule.forRootAsync({
    useFactory:async function() {
        const { MYSQL_HOST, MYSQL_PORT, MYSQL_USERNAME, MYSQL_PASSWORD, MYSQL_DB } = process.env;
        const options: TypeOrmModuleOptions = {
            type: 'mysql',
            host: MYSQL_HOST,
            port: +MYSQL_PORT,
            username: MYSQL_USERNAME,
            password: MYSQL_PASSWORD,
        };
        await createDatabase(options, MYSQL_DB);
        return { 
            ...options, 
            database: MYSQL_DB, 
            entities: ['dist/**/*.entity{.ts,.js}'], 
            synchronize: true,
        };
    },
});