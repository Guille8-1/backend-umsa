import { ConfigService } from '@nestjs/config';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import 'dotenv/config'
import { join } from 'path';

export const typeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
    type:'postgres',
    host: 'localhost',
    port: 5432,
    password: '12345',
    username: 'postgres',
    database: 'saas_umsa_backup',
    logging: true,
    entities: [join(__dirname + '../../**/*.entity.{js, ts}')],
    synchronize: true
})



// host: configService.get('DB_HOST'),
//   port: configService.get('DB_PORT'),
//   password: configService.get('DB_PASS'),
//   username: configService.get('DB_USER'),
//   database: configService.get('DB_NAME'),