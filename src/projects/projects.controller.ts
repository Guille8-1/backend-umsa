import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto, UpdateAssigneesDto } from './dto/update-project.dto';
import { CommentProjectDto } from './dto/comments-project.dto';
import { DeleteProjectDto } from './dto/delete-project.dto';
import { TestDto } from './dto/test.test.dto';

@Controller('/projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) { }
  //testing dates update database intearctive

  @Get('/dates')
  updatingDates(@Res() res: Response) {
    return this.projectsService.testingDates(res);
  }

  @Post('/test')
  test(@Body() test: TestDto, @Res() res: Response) {
    return res.json('testing');
  }


  @Post('/create')
  create(@Body() createProjectDto: CreateProjectDto, @Res() res: Response) {
    return this.projectsService.createProject(createProjectDto, res);
  }


  @Post('/comment')
  addComment(@Body() commentProject: CommentProjectDto, @Res() res: Response) {
    return this.projectsService.createProjectComment(commentProject, res);
  }

  @Get('/comment/project/:id')
  gettingCommentProject(@Param('id') id: string, @Res() res: Response) {
    return this.projectsService.gettingProjectComment(+id, res);
  }

  @Get('/available')
  findAll(@Res() res: Response) {
    return this.projectsService.findAllProjects(res);
  }

  @Get('/user/:id')
  userProjects(@Param('id') id: string, @Res() res: Response) {
    return this.projectsService.userProjects(+id, res);
  }
  @Get('/numbers')
  projectNumbers(@Res() res: Response) {
    return this.projectsService.returningNumbers(res);
  }
  @Get('/stats')
  projectStats(@Res() res: Response) {
    return this.projectsService.gettingPrjStats(res);
  }

  @Get('/urgency')
  projectUrgency(@Res() res: Response) {
    return this.projectsService.responseUrgency(res);
  }

  //Este metodo GET con parametro solitario, produce que los metodos GET para abajo no funcionen a no ser que tengan paramateros definidos...
  @Get(':id')
  findOne(@Param('id') id: string, @Res() res: Response) {
    return this.projectsService.findOneProject(+id, res);
  }


  @Patch('/update/:id')
  update(
    @Param('id') id: number,
    @Body() updateProject: UpdateProjectDto,
    @Res() res: Response,
  ) {
    return this.projectsService.updateProject(id, updateProject, res);
  }

  @Patch('/update/users/project')
  updateAssigness(
    @Body() updateAssignees: UpdateAssigneesDto,
    @Res() res: Response,
  ) {
    return this.projectsService.updateAssigness(updateAssignees, res);
  }


  @Get('/new/body/:id')
  updateProjectBody(@Param('id') id: string, @Res() res: Response) {
    return this.projectsService.newBodyRequest(+id, res)
  }

  @Get('/assigned/newusers/:id')
  newAssignees(@Param('id') id: string, @Res() res: Response) {
    return this.projectsService.newPrjAssginees(+id, res);
  }


  @Delete(':paramId')
  remove(
    @Param(new ValidationPipe()) params: DeleteProjectDto,
    @Res() res: Response,
  ) {
    console.log(params.paramId);
    return this.projectsService.removeProject(params.paramId, res);
  }
}
