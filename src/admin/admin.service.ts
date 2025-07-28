import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../users/entities/user.entity';
import {Repository} from 'typeorm';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Users) private readonly usersRepository: Repository<Users>,
  ) {}
  async create(createAdminDto: CreateAdminDto, res: Response) {
    const {nombre, apellido, email, password, nivel} = createAdminDto;
    if(nivel != 1){
      return res.status(400).json('En esta instancia solo se puede crear Admins');
    }

    const emialExists = await this.usersRepository.findOne({where: { email }})
    const nameExists = await this.usersRepository.findOne({where: { nombre }})
    
    if(emialExists || nameExists) {
      return res.status(401).json('Usuario Ya Registrado')
    }

    return res.status(201).json('This action adds a new admin');
  }

  findAll() {
    return `This action returns all admin`;
  }

  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    console.log(updateAdminDto)
    return `This action updates a #${id} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }
}
