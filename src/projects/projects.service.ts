import { All, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Not, Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto, UpdateAssigneesDto } from './dto/update-project.dto';
import { Projects } from './entities/projects.entity';
import { Comments } from './entities/comments.entity';
import { Users } from '../users/entities/user.entity';
import { CommentProjectDto } from './dto/comments-project.dto';
import { Response } from 'express';
import { merge } from 'rxjs';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Projects)
    private readonly projectRepository: Repository<Projects>,
    @InjectRepository(Comments)
    private readonly commentRepository: Repository<Comments>,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) { }

  async createProject(createProjectDto: CreateProjectDto, res: Response) {
    const {
      user,
      titulo,
      asignadosId,
      tipoDocumento,
      gestor,
      estado,
      tipo,
      citeNumero,
      rutaCv,
      diasActivo,
      avance,
      oficinaOrigen,
      prioridad,
    } = createProjectDto;

    const validStatus = ['Activo', 'Pendiente', 'Cerrado', 'Mora'];
    if (validStatus.some((statusMatch) => estado === statusMatch)) {
      const validProject = await this.projectRepository.find({
        where: { estado: estado },
      });
      const projecTitles: string[] = [];
      for (const project of validProject) {
        projecTitles.push(project.titulo);
      }
      if (projecTitles.some((titleMatch) => titulo == titleMatch)) {
        return res.status(400).json('Proyecto Existente');
      }

      const userNames = await this.userRepository.find({
        where: {
          id: In(asignadosId),
        },
        select: ['nombre', 'apellido'],
      });

      const userProject: string[] = [];

      for (const name of userNames) {
        const { nombre, apellido } = name;
        const userToSave = `${nombre} ${apellido}`;
        userProject.push(userToSave);
      }

      const toCreateProject = {
        user,
        titulo,
        asignados: userProject,
        asignadosId,
        tipoDocumento,
        gestor,
        estado,
        tipo,
        citeNumero,
        rutaCv,
        diasActivo,
        avance,
        oficinaOrigen,
        prioridad,
        isActive: true,
      };

      await this.projectRepository.save(toCreateProject);
    } else {
      return res.status(400).json('Estado No Valido');
    }
    return res.status(201).json('Proyecto Creado!');
  }

  async createProjectComment(commentProject: CommentProjectDto, res: Response) {
    const { comentario, projectId, author } = commentProject;
    await this.commentRepository.save({
      project: projectId,
      comentario: comentario,
      author: author,
    });
    res.status(201).json('Comentario Guardado!');

    // const projectComments = await this.commentRepository
    //   .createQueryBuilder('comments')
    //   .where('comments.projectId = :projectId', { projectId: projectId })
    //   .getMany();
    //
    // return res.status(201).json(
    //   {
    //     commentsContent: projectComments,
    //     success: 'Comentario Creado!',
    //   }
    // );
  }

  async gettingProjectComment(id: number, res: Response) {
    const projectComments = await this.commentRepository
      .createQueryBuilder('comments')
      .where('comments.projectId = :projectId', { projectId: id })
      .getMany();
    return res.status(201).json(projectComments);
  }

  async findAllProjects(res: Response) {
    const availableProjects = await this.projectRepository.find({
      where: {
        isActive: true,
        titulo: Not(IsNull()),
        user: Not(IsNull()),
      },
      relations: ['comentarios', 'user'],
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
    return res.status(201).json(availableProjects);
  }

  async userProjects(id: number, res: Response) {
    const userProjects = await this.projectRepository.find({
      where: {
        titulo: Not(IsNull()),
        gestor: Not(IsNull()),
        user: { id: id },
      },
      relations: ['user', 'comentarios'],
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
    const usrAssigned = await this.userAssigned(id);
    const jointPrj = userProjects.concat(usrAssigned);

    const noRepeatedPrj = (uniquePrj: any) => {
      const seenIds = new Set();
      return uniquePrj.filter((prj: any) => {
        if (seenIds.has(prj.id)) return false;
        seenIds.add(prj.id);
        return true;
      });
    };
    const uniqueProjects = noRepeatedPrj(jointPrj);

    uniqueProjects.sort((a: any, b: any) => b.id - a.id);

    return res.json(uniqueProjects);
  }

  async userAssigned(id: number) {
    const assignedProject = await this.projectRepository
      .createQueryBuilder('project')
      .leftJoin('project.comentarios', 'comentarios')
      .addSelect([
        'comentarios.id',
        'comentarios.comentario',
        'comentarios.author',
        'comentarios.createdDate',
        'comentarios.updatedDate',
      ])
      .leftJoin('project.user', 'user')
      .addSelect([
        'user.id',
        'user.nombre',
        'user.apellido',
        'user.email',
        'user.nivel',
      ])
      .where('project.gestor IS NOT NULL')
      .andWhere('project.asignadosId IS NOT NULL')
      .andWhere('project.titulo IS NOT NULL')
      .andWhere('project.user IS NOT NULL')
      .andWhere(':id = Any(project.asignadosId)', { id })
      .getMany();

    return assignedProject;
  }

  async findOneProject(id: number, res: Response) {
    const project = await this.projectRepository.findOne({
      where: { id: id },
    });
    if (!project) {
      return res.status(201).json('Proyecto no Encontrado');
    }
    return res.status(201).json(project);
  }
  //update user function
  //updateUserIdField = (id: number) => {};
  async updateProject(
    id: number,
    updateProject: UpdateProjectDto,
    res: Response,
  ) {
    const { estado, avance, documento, prioridad, idUser } = updateProject;
    const numbAvance: number = +avance;
    const numbUsrId: number = +idUser;

    await this.projectRepository.update(id, {
      estado: estado,
      avance: numbAvance,
      tipoDocumento: documento,
      prioridad,
      editBy: numbUsrId,
    });

    const titlePrj = await this.projectRepository.find({
      where: {
        id: id,
      },
      select: ['titulo'],
    });
    const { titulo } = titlePrj[0];

    res.status(201).json(`${titulo.toUpperCase()}`);
  }

  async updateAssigness(updateUsers: UpdateAssigneesDto, res: Response) {
    const { projectId, asignadosId } = updateUsers;
    await this.projectRepository.update(projectId, {
      asignadosId: asignadosId,
    });

    const assignedNew = await this.userRepository.find({
      where: {
        id: In(asignadosId),
      },
      select: ['nombre', 'apellido'],
    });

    const newAssigned: string[] = [];

    for (const newAss of assignedNew) {
      const { nombre, apellido } = newAss;
      const userNewAssinged = `${nombre} ${apellido}`;
      newAssigned.push(userNewAssinged);
    }

    await this.projectRepository.update(projectId, {
      asignados: newAssigned,
    });

    return res.status(202).json(`Asignados Cambiados`);
  }

  async newBodyRequest(id: number, res: Response) {
    const newBodyProject = await this.projectRepository.find({
      where: { id: id },
      select: ['estado', 'avance', 'tipoDocumento', 'prioridad'],
    });
    const indexBody = newBodyProject[0];
    return res.status(201).json(indexBody);
  }

  async newPrjAssginees(id: number, res: Response) {
    const newAss = await this.projectRepository.find({
      where: { id: id },
      select: ['asignados']
    });
    const newAssData = newAss[0];
    const acutalAssData = newAssData.asignados;

    return res.status(202).json(acutalAssData);
  }

  async removeProject(id: number, res: Response) {
    const project = await this.projectRepository.findOne({
      where: { id: id },
      relations: ['comentarios'],
    });

    if (!project) {
      return res.status(200).json(`Proyecto no Encontrado`);
    }

    await this.projectRepository
      .createQueryBuilder()
      .delete()
      .where('id = :id', { id: id })
      .execute();

    await this.commentRepository
      .createQueryBuilder()
      .delete()
      .where('projectId IS NULL')
      .execute();

    return res.status(201).json(`Proyecto ${project.titulo} fue eliminado`);
  }

  async returningNumbers(res: Response) {
    const prjNumbers = await this.projectRepository.find({
      where: {
        estado: In(['Activo', 'activo', 'Cerrado', 'cerrado'])
      }
    });

    const prjActive = prjNumbers.filter((prj) => prj.estado === 'Activo' || prj.estado === 'activo').length;
    const prjCerrado = prjNumbers.filter((prj) => prj.estado === 'Cerrado' || prj.estado === 'cerrado').length;

    const resPrjNumbers = [
      {
        title: 'Activos',
        value: prjActive,
      },
      {
        title: 'Cerrados',
        value: prjCerrado,
      },
    ]
    return res.status(202).json(resPrjNumbers);
  }

  async gettingPrjStats(res: Response) {
    const prjStats = await this.userRepository.createQueryBuilder('u')
      .leftJoin(
        'projects',
        'p',
        'u.id = ANY(p."asignadosId")',
      )
      .select('u.id', 'id')
      .addSelect('u.nombre', 'nombre')
      .addSelect('u.apellido', 'apellido')
      .addSelect(
        "COUNT(*) FILTER (WHERE p.estado = 'Activo')",
        "activePrj",
      )
      .addSelect(
        "COUNT(*) FILTER (WHERE p.estado = 'Cerrado')",
        "closedPrj",
      )
      .groupBy('u.id')
      .addGroupBy('u.nombre')
      .addGroupBy('u.apellido')
      .getRawMany();

    console.log('esto debe ser?', prjStats);

    const prjDetails = await this.projectRepository.find({
      where: {
        estado: In(['Activo', 'Cerrado'])
      }
    })
    const prjStatsResponse = prjStats.map((obj) => {
      return {
        fullName: `${obj.nombre} ${obj.apellido}`
      }
    })
    return res.status(202).json('funcando desde stats');
  }

  async testingDates(res: Response) {
    const date = new Date().toLocaleString('lp-BO', {
      timeZone: 'America/La_Paz',
    });
    console.log(date);
    return res.status(201).json('desde dates');
  }
}
