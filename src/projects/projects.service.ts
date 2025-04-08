import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Not, Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Projects } from './entities/projects.entity';
import { Comments } from './entities/comments.entity';
import { Users } from 'src/auth/entities/users.entity';
import { CommentProjectDto } from './dto/comments-project.dto';
import { Response } from 'express';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Projects)
    private readonly projectRepository: Repository<Projects>,
    @InjectRepository(Comments)
    private readonly commentRepository: Repository<Comments>,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>
  ) {}

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
    

    const validStatus = ['activo', 'pendiente', 'cerrado', 'en_mora'];
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

      const numberId: number[] = []

      asignadosId.forEach((id)=> {
        numberId.push(+id)
      })
      
      const userNames = await this.userRepository.find({
        where:{
          id: In(numberId)
        },
        select:['nombre', 'apellido']
      })
      
      const userProject: string[] = []

      for(const name of userNames) {
        const {nombre} = name
        const {apellido} = name
        const userToSave = `${nombre} ${apellido}`
        userProject.push(userToSave)
      }
      
      
      const toCreateWork = {
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
        isActive: true
      };
      
      await this.projectRepository.save(toCreateWork);

    } else {
      return res.status(400).json('Status No Valido');
    }
    return res.status(201).json('Proyecto Creado!');
  }

  async createProjectComment(commentProject: CommentProjectDto, res: Response) {
    const { comentarios, projectId, author } = commentProject;
    await this.commentRepository.save({
      comentarios: comentarios,
      project: projectId,
      author: author
    });
    return res.status(201).json('comentario guardado');
  }

  async findAllProjects(res: Response) {
    const availableProjects = await this.projectRepository.find({
      where: {
        isActive: true,
      },
      relations: ['comentarios', 'user'],
      select:{
        user: {
          id: true,
          nombre: true,
          apellido: true,
          email: true,
          nivel: true
        }
      }
    });
    return res.status(201).json(availableProjects);
  }

  async userProjects(id: number, res: Response) {
    const userProjects = await this.projectRepository.find({
      where: {gestor: Not(IsNull()), user:{id: id}},
      relations: ['user','comentarios'],
      select: {
        user: {
          id: true,
          nombre: true,
          apellido: true,
          email: true,
          nivel: true
        },
        comentarios: {
          id: true,
          comentario: true,
          author: true,
          createdDate: true,
          updatedDate: true,
        }
      }
    })
    return res.json(userProjects);
  }

  async userAssigned(id:number, res: Response) {
    const assignedId = id
    const assignedProject = await this.projectRepository
      .createQueryBuilder('project')
      .leftJoin('project.comentarios', 'comentarios')
      .addSelect([
        'comentarios.id',
        'comentarios.comentario',
        'comentarios.author',
        'comentarios.createdDate',
        'comentarios.updatedDate'
      ])
      .leftJoin('project.user', 'user')
      .addSelect(
        [
          'user.id',
          'user.nombre',
          'user.apellido',
          'user.email',
          'user.nivel'
        ]
      )
      .where('project.gestor IS NOT NULL')
      .andWhere('project.asignadosId IS NOT NULL')
      .andWhere(':assignedId = Any(project.asignadosId)', { assignedId })
      .getMany()
    return res.status(200).json(assignedProject);
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

  async updateProject(
    id: number,
    updateProjectDto: UpdateProjectDto,
    res: Response,
  ) {
    const asignados = updateProjectDto.asignados
    if (asignados) {
      
      await this.projectRepository
        .createQueryBuilder()
        .update(Projects)
        .where('id = :id', { id: id })
        .set({
          asignados: asignados,
        })
        .execute();
    }

    if (updateProjectDto.titulo) {
      await this.projectRepository
        .createQueryBuilder()
        .update(Projects)
        .where('id = :id', { id: id })
        .set({
          titulo: updateProjectDto.titulo,
        })
        .execute();
    }

    if (updateProjectDto.estado) {
      await this.projectRepository
        .createQueryBuilder()
        .update(Projects)
        .where('id = :id', { id: id })
        .set({
          estado: updateProjectDto.estado,
        })
        .execute();
    }

    if (updateProjectDto.prioridad) {
      await this.projectRepository
        .createQueryBuilder()
        .update(Projects)
        .where('id = :id', { id: id })
        .set({
          prioridad: updateProjectDto.prioridad,
        })
        .execute();
    }
    return res.status(201).json('Cambios Guardados');
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

  async testingDates(res: Response) {
    const date = new Date().toLocaleString('lp-BO',{
      timeZone:'America/La_Paz'
    });
    console.log(date)
    return res.status(201).json('desde dates');
  }
}
