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
import { CronjobsServices } from './cronjobs/cronjobs.service';
import { ScheduleModule } from '@nestjs/schedule';
import { Projects } from './projects/entities/projects.entity';
import { ActivitiesModule } from './activities/activities.module';



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
    FileModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Projects]),
    ActivitiesModule
  ],
  controllers: [AppController],
  providers: [AppService, CronjobsServices],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer){
    consumer.apply(TimeMiddleWare).forRoutes("*")
  }
}
