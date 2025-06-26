import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Repository } from 'typeorm';
import { Activities } from '../actividades/entities/actividade.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activities)
    private activitiesRepository: Repository<Activities>,
  ) {}
    
  @Cron(CronExpression.EVERY_12_HOURS)
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