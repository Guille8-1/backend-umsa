import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateAdminDto, UpdatePassword } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { hash } from 'bcrypt';
import { compare } from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}
  async create(createAdminDto: CreateAdminDto, res: Response) {
    const { nombre, apellido, email, password, masterPassword, nivel } =
      createAdminDto;

    const adminPassword = '3Tm8)*2H:f2y';

    const hashAdmin = await hash(adminPassword, 10);
    const validateAdmin = await compare(masterPassword, hashAdmin);

    if (!validateAdmin) {
      return res.status(401).json('Admin Password Incorrecto');
    }

    if (nivel != 1) {
      return res
        .status(400)
        .json('En esta instancia solo se puede crear Admins');
    }

    const emialExists = await this.usersRepository.findOne({
      where: { email },
    });
    const nameExists = await this.usersRepository.findOne({
      where: { nombre },
    });

    if (emialExists || nameExists) {
      return res.status(401).json('Usuario Ya Registrado');
    }

    const hashedPw = await hash(password, 10);

    const lowerName = nombre.toLowerCase();
    const lowerLastName = apellido.toLocaleLowerCase();

    const registerAnAdmin = {
      nombre: lowerName,
      apellido: lowerLastName,
      email,
      password: hashedPw,
      admin: true,
      nivel: nivel,
      accountOwner: true,
      changedPw: false,
      active: true,
    };
    await this.usersRepository.save(registerAnAdmin);
    return res
      .status(201)
      .json('Admin de cuenta creado, el password debe restablecerse');
  }

  async updatePw(updatePassword: UpdatePassword, res: Response) {
    const { id, password } = updatePassword;
    const hashedPw = await hash(password, 10);

    await this.usersRepository.update(id, {
      password: hashedPw,
      changedPw: true,
    });
    res.status(201).json('Contraseña Actualizada');
  }

  findAll() {
    return `This action returns all admin`;
  }

  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    console.log(updateAdminDto);
    return `This action updates a #${id} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }
}
