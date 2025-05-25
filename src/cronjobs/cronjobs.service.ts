import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Projects } from '../projects/entities/projects.entity';
import { Activities } from '../actividades/entities/actividade.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CronjobsServices {
  constructor(
    @InjectRepository(Projects)
    private readonly projectsRepositories: Repository<Projects>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async projectCronJobs() {
    const projectDays = await this.projectsRepositories.find({
      select: {
        id: true,
        isActive: true,
        createdDate: true,
      },
    });
    for (const project of projectDays) {
      if (project.isActive) {
        const createdDate = new Date(project.createdDate);
        const calcDate = new Date();

        const diferencia = calcDate.getTime() - createdDate.getTime();
        const diasActivo = Math.floor(diferencia / (1000 * 60 * 60 * 24));
        await this.projectsRepositories.update(project.id, {
          diasActivo: diasActivo,
        });
      }
    }
  }
}


@Injectable()
export class ActivitiesService {
  constructor(
    private activitiesRepository: Repository<Activities>,
  ) {}
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async activitiesCronJobs() {
    const activityDays = await this.activitiesRepository.find({
      select: {
        id: true,
        isActive: true,
        createdDate: true
      },
    });
    for (const activity of activityDays) {
      if (activity.isActive) {
        const createdDate = new Date(activity.createdDate);
        const calcDate = new Date();

        const diferencia = calcDate.getTime() - createdDate.getTime();
        const diasActivo = Math.floor(diferencia / (1000 * 60 * 60 * 24));
        await this.activitiesRepository.update(activity.id, {
          diasActivoActividad: diasActivo
        });
      }
    }
  }
}