import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { Projects } from 'src/projects/entities/projects.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Projects])],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
