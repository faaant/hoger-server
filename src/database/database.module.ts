import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import entities from './entities';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.HOST_DB,
        port: parseInt(process.env.PORT_DB || '5432'),
        username: process.env.USERNAME_DB,
        password: process.env.PASSWORD_DB,
        database: process.env.NAME_DB,
        entities,
        ssl: !!process.env.DB_SSL_CONNECTION,
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {
  constructor() {
    console.log(process.env.PASSWORD_DB);
  }
}
