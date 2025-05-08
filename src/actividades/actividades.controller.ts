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
import { UpdateActividadeDto } from './dto/update-actividade.dto';
import { Response } from 'express';

@Controller('actividades')
export class ActividadesController {
  constructor(private readonly actividadesService: ActividadesService) {}

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

  @Get('/assigned/:assigned')
  assignedActivities(@Param('assigned') id: string, @Res() res: Response) {
    return this.actividadesService.userActivityAssigned(+id, res);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateActividadeDto: UpdateActividadeDto,
  ) {
    return this.actividadesService.update(+id, updateActividadeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.actividadesService.remove(+id);
  }
}
