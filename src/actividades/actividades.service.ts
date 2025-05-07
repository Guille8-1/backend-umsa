import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Not, Repository } from 'typeorm';
import { Activities } from './entities/actividade.entity'
import { Users } from '../auth/entities/users.entity'
import { Response } from 'express';
import { UpdateActividadeDto } from './dto/update-actividade.dto';
import { CreateActividadeDto } from './dto/create-actividade.dto';

@Injectable()
export class ActividadesService {

  constructor(
    @InjectRepository( Activities )
    private readonly actividadesRepository: Repository<Activities>,
    @InjectRepository( Users )
    private readonly userRepository: Repository<Users>
  ) {
  }

  async createActividades(createActividadeDto: CreateActividadeDto, res: Response) {
    console.log(createActividadeDto);
    const {
      id,
      tituloActividad,
      asignadosActividadId,
      gestorActividad,
      estadoActividad,
      tipoActividad,
      oficinaOrigenActividad,
      prioridadActividad,
      diasActivoActividad,
      avanceActividad
    } = createActividadeDto;
    const validateStatus = ['activo', 'pendiente'];
    if(validateStatus.some((validStatus) => estadoActividad === validStatus)){
      const validActivity = await this.actividadesRepository.find({
        where: { estadoActividad: estadoActividad }
      });
      const actTitles: string[] = [];
      for(const act of validActivity){
        actTitles.push(act.tituloActividad);
      }

      if(actTitles.some((actTitleMatch) => tituloActividad == actTitleMatch)){
        return res.status(400).json('Actividad Existente');
      }
      
      const numberId: number[] = [];
      asignadosActividadId.forEach((id) => {
        numberId.push(+id)
      })

      const userNames = await this.userRepository.find({
        where: {
          id: In(numberId)
        },
        select: ['nombre', 'apellido']
      })
      const usrActivity: string[] = []

      for(const name of userNames) {
        const { nombre, apellido } = name;
        const userToSave = `${nombre} ${apellido}`;
        usrActivity.push(userToSave);
      }

      const toCreateActivity = {
        id,
        tituloActividad,
        asignadosActividad: usrActivity,
        asignadosActividadId,
        gestorActividad,
        estadoActividad,
        tipoActividad,
        oficinaOrigenActividad,
        prioridadActividad,
        diasActivoActividad,
        avanceActividad,
        isActive: true
      }
      await this.actividadesRepository.save(toCreateActivity);
    } else {
      return res.status(400).json('Status No Valido');
    }
    return res.status(201).json('Actividad Creada!');
  }

  async findAllActividades(res: Response) {
    const availableAct = await this.actividadesRepository.find({
      where:{
        isActive: true,
        tituloActividad: Not(IsNull())
      }
    })
    return res.status(201).json(availableAct);
  }

  findOne(id: number) {
    return `This action returns a #${id} actividade`;
  }

  update(id: number, updateActividadeDto: UpdateActividadeDto) {
    return `This action updates a #${id} actividade`;
  }

  remove(id: number) {
    return `This action removes a #${id} actividade`;
  }
}
