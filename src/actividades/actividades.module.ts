import { Module } from '@nestjs/common';
import { ActividadesService } from './actividades.service';
import { ActividadesController } from './actividades.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activities } from './entities/actividade.entity';
import { CommentsActivities } from './entities/actividadecoment.entity';
import { Users } from '../auth/entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Activities, Users, CommentsActivities])],
  controllers: [ActividadesController],
  providers: [ActividadesService],
})
export class ActividadesModule {}
