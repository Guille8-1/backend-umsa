import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { ActividadesService } from './actividades.service';
import {
  CreateActividadeDto,
  CreateCommentActivityDto,
} from './dto/create-actividade.dto';
import {
  UpdateActivity,
  UpdateActivityAssignees,
} from './dto/update-actividade.dto';
import { Response } from 'express';

@Controller('/actividades')
export class ActividadesController {
  constructor(private readonly actividadesService: ActividadesService) { }

  @Post('/createactividad')
  //crear una nueva actividad
  create(
    @Body() createActividadeDto: CreateActividadeDto,
    @Res() res: Response,
  ) {
    return this.actividadesService.createActividades(createActividadeDto, res);
  }
  //Crear un comentario en la actividad creata
  @Post('/commentactividad')
  createComment(
    @Body() createComment: CreateCommentActivityDto,
    @Res() res: Response,
  ) {
    return this.actividadesService.createActivityComment(createComment, res);
  }

  //obtener actividades con las relaciones comments y users basadas en parametros recibidos por el DTO
  @Get('/getactividades')
  findAll(@Res() res: Response) {
    return this.actividadesService.findAllActividades(res);
  }

  @Get('/comment/activity/:id')
  findOne(@Param('id') id: string, @Res() res: Response) {
    return this.actividadesService.activityCommenet(+id, res);
  }

  @Get('/user/:id')
  userActivities(@Param('id') id: string, @Res() res: Response) {
    return this.actividadesService.userActivities(+id, res);
  }

  @Get('/newusers/:id')
  gettingNewActUsers(@Param('id') id: string, @Res() res: Response) {
    return this.actividadesService.newUsersActivity(+id, res);
  }

  @Patch('/update/users')
  updateAssignees(
    @Body() updateActUsers: UpdateActivityAssignees,
    @Res() res: Response,
  ) {
    return this.actividadesService.updateUsersActivity(updateActUsers, res);
  }
  @Patch('/update')
  updateActivity(@Body() updateActivity: UpdateActivity, @Res() res: Response) {
    return this.actividadesService.updateActivity(updateActivity, res);
  }

  @Get('/edited/:id')
  editedActivity(@Param('id') id: string, @Res() res: Response) {
    return this.actividadesService.editedBody(+id, res)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.actividadesService.remove(+id);
  }
}
