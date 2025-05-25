import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { Projects } from './entities/projects.entity';
import { Comments } from './entities/comments.entity';
import { Users } from '../users/entities/user.entity';


@Module({
  imports:[TypeOrmModule.forFeature([Projects, Comments, Users])],
  controllers: [ProjectsController],
  providers: [ProjectsService]
})
export class ProjectsModule {}
