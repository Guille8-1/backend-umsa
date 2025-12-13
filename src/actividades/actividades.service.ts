import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Not, Repository } from 'typeorm';
import { Activities } from './entities/actividade.entity';
import { CommentsActivities } from './entities/actividadecoment.entity';
import { Users } from '../users/entities/user.entity';
import { Response } from 'express';
import {
  UpdateActivityAssignees,
  UpdateActivity,
} from './dto/update-actividade.dto';
import {
  CreateActividadeDto,
  CreateCommentActivityDto,
} from './dto/create-actividade.dto';

@Injectable()
export class ActividadesService {
  constructor(
    @InjectRepository(Activities)
    private readonly actividadesRepository: Repository<Activities>,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    @InjectRepository(CommentsActivities)
    private readonly commentActivity: Repository<CommentsActivities>,
  ) { }

  async createActividades(
    createActividadeDto: CreateActividadeDto,
    res: Response,
  ) {
    const {
      user,
      tituloActividad,
      categoriaActividad,
      asignadosActividadId,
      gestorActividad,
      estadoActividad,
      tipoActividad,
      oficinaOrigenActividad,
      prioridadActividad,
    } = createActividadeDto;

    const validateStatus = ['Activo', 'Pendiente', 'Mora'];
    if (validateStatus.some((validStatus) => estadoActividad === validStatus)) {
      const validActivity = await this.actividadesRepository.find({
        where: { estadoActividad: estadoActividad },
      });
      const actTitles: string[] = [];
      for (const act of validActivity) {
        actTitles.push(act.tituloActividad);
      }

      if (actTitles.some((actTitleMatch) => tituloActividad == actTitleMatch)) {
        return res.status(400).json('Actividad Existente');
      }

      const numberId: number[] = [];
      asignadosActividadId.forEach((id) => {
        numberId.push(+id);
      });

      const userNames = await this.userRepository.find({
        where: {
          id: In(numberId),
        },
        select: ['nombre', 'apellido'],
      });
      const usrActivity: string[] = [];

      for (const name of userNames) {
        const { nombre, apellido } = name;
        const userToSave = `${nombre} ${apellido}`;
        usrActivity.push(userToSave);
      }

      const toCreateActivity = {
        user,
        tituloActividad,
        categoriaActividad,
        asignadosActividad: usrActivity,
        asignadosActividadId,
        gestorActividad,
        estadoActividad,
        tipoActividad,
        oficinaOrigenActividad,
        prioridadActividad,
        diasActivoActividad: 0,
        avanceActividad: 10,
        isActive: true,
      };
      await this.actividadesRepository.save(toCreateActivity);
    } else {
      return res.status(400).json('Status No Valido');
    }
    return res.status(201).json('Actividad Creada!');
  }

  async findAllActividades(res: Response) {
    const availableAct = await this.actividadesRepository.find({
      where: {
        isActive: true,
        tituloActividad: Not(IsNull()),
      },
      relations: ['user', 'comentariosActivity'],
      select: {
        user: {
          id: true,
          nombre: true,
          apellido: true,
          email: true,
          nivel: true,
        },
      },
    });
    return res.status(201).json(availableAct);
  }

  async createActivityComment(
    createComment: CreateCommentActivityDto,
    res: Response,
  ) {
    const { actComentario, author, activity } = createComment;
    console.log(activity);
    await this.commentActivity.save({
      activity: activity,
      author: author,
      comentario: actComentario,
    });
    return res.status(201).json('Comentario Guardado');
  }

  async activityCommenet(id: number, res: Response) {
    const actComments = await this.commentActivity
      .createQueryBuilder('actComments')
      .where('actComments.activityId = :activityId', { activityId: id })
      .getMany();
    return res.status(201).json(actComments);
  }

  async userActivities(id: number, res: Response) {
    const userActivities = await this.actividadesRepository.find({
      where: {
        tituloActividad: Not(IsNull()),
        gestorActividad: Not(IsNull()),
        user: { id: id },
      },
      relations: ['user', 'comentariosActivity'],
      select: {
        user: {
          id: true,
          nombre: true,
          apellido: true,
          email: true,
          nivel: true,
        },
      },
    });

    const assigned = await this.userActivityAssigned(id);
    const jointAct = userActivities.concat(assigned);

    const noRepeatedAct = (uniqueAct: any) => {
      const seenIds = new Set();
      return uniqueAct.filter((prj: any) => {
        if (seenIds.has(prj.id)) return false;
        seenIds.add(prj.id);
        return true;
      });
    };

    const uniqueAct = noRepeatedAct(jointAct);
    uniqueAct.sort((a: any, b: any) => b.id - a.id);

    return res.status(201).json(uniqueAct);
  }

  async userActivityAssigned(id: number) {
    const assignedActivity = await this.actividadesRepository
      .createQueryBuilder('activity')
      .leftJoin('activity.comentariosActivity', 'comentariosActivity')
      .addSelect([
        'comentariosActivity.id',
        'comentariosActivity.comentario',
        'comentariosActivity.author',
        'comentariosActivity.createdDate',
        'comentariosActivity.updatedDate',
      ])
      .leftJoin('activity.user', 'user')
      .addSelect([
        'user.id',
        'user.nombre',
        'user.apellido',
        'user.email',
        'user.nivel',
      ])
      .where('activity.gestorActividad IS NOT NULL')
      .andWhere('activity.asignadosActividadId IS NOT NULL')
      .andWhere('activity.tituloActividad IS NOT NULL')
      .andWhere('activity.user IS NOT NULL')
      .andWhere(':id = Any(activity.asignadosActividadId)', {
        id,
      })
      .getMany();

    return assignedActivity;
  }

  async updateUsersActivity(
    updateUsersActivity: UpdateActivityAssignees,
    res: Response,
  ) {
    const { activityId, actAssId } = updateUsersActivity;
    await this.actividadesRepository.update(activityId, {
      asignadosActividadId: actAssId,
    });
    const assignedActNew = await this.userRepository.find({
      where: {
        id: In(actAssId),
      },
      select: ['nombre', 'apellido'],
    });
    const newActAssigned: string[] = [];

    for (const newAss of assignedActNew) {
      const { nombre, apellido } = newAss;
      const userActNewAssigneed = `${nombre} ${apellido}`;
      newActAssigned.push(userActNewAssigneed);
    }
    await this.actividadesRepository.update(activityId, {
      asignadosActividad: newActAssigned,
    });

    return res.status(202).json(`Asinganos Cambiados`);
  }

  async newUsersActivity(id: number, res: Response) {
    const newAssigAct = await this.actividadesRepository.find({
      where: {
        id: id,
      },
      select: ['asignadosActividad'],
    });
    const { asignadosActividad } = newAssigAct[0];
    const newUsersJoint: string = asignadosActividad.join(", ");

    return res.status(202).json(newUsersJoint);
  }

  async updateActivity(updateActivity: UpdateActivity, res: Response) {
    const { activityId, estadoAct, avanceAct, prioridadAct, idUser } = updateActivity;

    await this.actividadesRepository.update(activityId, {
      estadoActividad: estadoAct,
      avanceActividad: +avanceAct,
      prioridadActividad: prioridadAct,
      editedBy: +idUser
    })

    res.status(202).json(`Actividad con el id: ${updateActivity.activityId} actualizada`);
  }

  async editedBody(id: number, res: Response) {
    const activityRetrive = await this.actividadesRepository.find({
      where: {
        id: id
      },
      select: ['estadoActividad', 'avanceActividad', 'prioridadActividad']
    });
    const newActData = activityRetrive[0];

    const data = {
      estado: newActData.estadoActividad,
      avance: newActData.avanceActividad,
      prioridad: newActData.prioridadActividad
    }

    return res.status(201).json(data);
  }

  remove(id: number) {
    return `This action removes a #${id} actividade`;
  }
}
