import { Module, MiddlewareConsumer } from '@nestjs/common';
import { typeOrmConfig } from './config/typeorm.config';
import { TimeMiddleWare } from './middlewares/time.middleware';
import { BearerTokenVerify } from './middlewares/verify-token.middleware';
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { FileModule } from './uploads/file/file.module';
import { ScheduleModule } from '@nestjs/schedule';
import { Projects } from './projects/entities/projects.entity';
import { ActividadesModule } from './actividades/actividades.module';
import { Activities } from './actividades/entities/actividade.entity';
import { Users } from './users/entities/user.entity';
import { CronjobsServices } from './cronjobs/cronjobs.service';
import { ActivitiesService } from './cronjobs/activities.cronjobs';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { AdminModule } from './admin/admin.module';



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
    ActividadesModule,
    UsersModule,
    ReportsModule,
    FileModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Projects, Activities, Users]),
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService, CronjobsServices, ActivitiesService],
})
export class AppModule {
  configure (consumer: MiddlewareConsumer) {
    consumer.apply(TimeMiddleWare).forRoutes("*")
    consumer.apply(BearerTokenVerify).
    forRoutes("/projects/*", "/actividades/*", "/users/*", "/reports/*");
   }
}
