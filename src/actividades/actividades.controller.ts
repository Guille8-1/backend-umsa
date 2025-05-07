import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { ActividadesService } from './actividades.service';
import { CreateActividadeDto } from './dto/create-actividade.dto';
import { UpdateActividadeDto } from './dto/update-actividade.dto';
import { Response } from 'express';

@Controller('actividades')
export class ActividadesController {
  constructor(private readonly actividadesService: ActividadesService) {}

  @Post('/createactividad')
  create(@Body() createActividadeDto: CreateActividadeDto, @Res() res: Response) {
    return this.actividadesService.createActividades(createActividadeDto, res);
  }

  @Get('/getactividades')
  findAll(@Res() res: Response) {
    return this.actividadesService.findAllActividades(res);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.actividadesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateActividadeDto: UpdateActividadeDto) {
    return this.actividadesService.update(+id, updateActividadeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.actividadesService.remove(+id);
  }
}
