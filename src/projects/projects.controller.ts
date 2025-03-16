import { Controller, Get, Post, Body, Patch, Param, Delete, Res, ValidationPipe } from '@nestjs/common';
import { Response } from 'express';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CommentProjectDto } from './dto/comments-project.dto'; 
import { DeleteProjectDto } from './dto/delete-project.dto';
import { TestDto } from './dto/test.test.dto';

@Controller('/projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService
  ) {}

  @Post('/test')
  test(@Body() test:TestDto, @Res() res: Response){
    
    return res.json('testing')
  }

  @Post('/create')
  create(@Body() createProjectDto: CreateProjectDto, @Res() res:Response) {
    return this.projectsService.createProject(createProjectDto, res);
  }

  @Post('/comment')
  addComment(@Body() commentProject: CommentProjectDto, @Res() res: Response ){
    console.log(commentProject.comentarios)
   return this.projectsService.createProjectComment(commentProject ,res)
  }

  @Get('/available')
  findAll(@Res() res: Response) {
    return this.projectsService.findAllProjects(res);
  }

  @Get('/user/:id')
  userProjects(@Param('id') id:string, @Res() res: Response){
    return this.projectsService.userProjects(+id, res)
  }

  @Get('/assigned/:assigned')
  assignedProject(@Param('assigned') id:string, @Res() res: Response){
    return this.projectsService.userAssigned(+id, res)
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Res() res: Response) {
    return this.projectsService.findOneProject(+id, res);
  }

  @Patch(':paramId')
  update(@Param(new ValidationPipe()) params: UpdateProjectDto, @Body() updateProjectDto: UpdateProjectDto, @Res() res: Response) {
    console.log(params.paramId)
    return this.projectsService.updateProject(params.paramId, updateProjectDto, res);
  }

  @Delete(':paramId')
  remove(@Param(new ValidationPipe()) params: DeleteProjectDto, @Res() res: Response) {
    console.log(params.paramId)
    return this.projectsService.removeProject(params.paramId, res);
  }
}
