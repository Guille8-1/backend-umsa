import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Projects } from './entities/projects.entity';
import { Comments } from './entities/comments.entity';
import { In, Repository } from 'typeorm';
import { CommentProjectDto } from './dto/comments-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Projects)
    private readonly projectRepository: Repository<Projects>,
    @InjectRepository(Comments)
    private readonly commentRepository: Repository<Comments>,
  ) {}

  async createProject(createProjectDto: CreateProjectDto, res: Response) {
    const {
      user,
      titulo,
      asignados,
      tipoDocumento,
      gestor,
      estado,
      tipo,
      citeNumero,
      rutaVc,
      oficinaOrigen,
      prioridad,
    } = createProjectDto;

    const validStatus = ['pendiente', 'activo', 'en_mora'];
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
      const assignees = JSON.parse(asignados.split('[]')[0]);
      const projectAssigned: string[] = [];
      for (const assnee of assignees) {
        projectAssigned.push(assnee);
      }
      const toCreateWork = {
        user,
        titulo,
        asignados: projectAssigned,
        tipoDocumento,
        gestor,
        estado,
        tipo,
        citeNumero,
        rutaVc,
        oficinaOrigen,
        prioridad,
        isActive: true
      };
      this.projectRepository.save(toCreateWork);

    } else {
      return res.status(400).json('Status No Valido');
    }
    return res.status(201).json('Proyecto Creado!');
  }

  async createProjectComment(commentProject: CommentProjectDto, res: Response) {
    const { comentarios, projectId } = commentProject;
    await this.commentRepository.save({
      comentarios: comentarios,
      project: projectId,
    });
    return res.status(201).json('comentario guardado');
  }

  async findAllProjects(res: Response) {
    const availableProjects = await this.projectRepository.find({
      where: {
        estado: In(['activo', 'pendiente']),
      },
      relations: ['comentarios', 'user'],
    });
    return res.status(201).json(availableProjects);
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
    if (updateProjectDto.asignados) {
      const asignados = JSON.parse(updateProjectDto.asignados.split('[]')[0]);

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
}
