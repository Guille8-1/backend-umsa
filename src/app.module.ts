import { Module, MiddlewareConsumer } from '@nestjs/common';
import { TimeMiddleWare } from './middlewares/time.middleware';
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { typeOrmConfig } from './config/typeorm.config';
import { ProjectsModule } from './projects/projects.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { FileModule } from './uploads/file/file.module';


@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 5000,
      limit:10,
      blockDuration: 1000 * 2
    }]),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      useFactory: typeOrmConfig,
      inject: [ConfigService]
    }),
    AuthModule,
    ProjectsModule,
    FileModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer){
    consumer.apply(TimeMiddleWare).forRoutes("*")
  }
}
