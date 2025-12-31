import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import {
  CreateUserDto,
  GetUserByIds,
  UpdateUserDto,
} from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { hash } from 'bcrypt';
import 'dotenv/config';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: Users;
    }
  }
}
const capFirstLetter = (name: string) => {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) { }

  async create(createUserDto: CreateUserDto, res: Response) {
    const { password, nombre, email, nivel, apellido } = createUserDto;

    if (nivel === 1) {
      return res
        .status(401)
        .json(
          'Registro de propiertarios de cuenta no permitido en esta instancia',
        );
    }

    const emialExists = await this.usersRepository.findOne({
      where: { email },
    });
    const nameExists = await this.usersRepository.findOne({
      where: { nombre },
    });

    const lastName = await this.usersRepository.findOne({
      where: { apellido },
    });

    if (emialExists || nameExists || lastName) {
      return res.status(401).json('Usuario Ya Registrado');
    }

    if (nivel === 1) {
      return res.status(401).json('Instancia solo para creacion de usuarios');
    }

    const hashedPw = await hash(password, 10);

    let isAdmin: boolean = true;
    isAdmin = nivel < 4;
    const lowerName = capFirstLetter(nombre);
    const lowerLastName = capFirstLetter(apellido);

    const registerUser = {
      nombre: lowerName.trim(),
      apellido: lowerLastName.trim(),
      email,
      password: hashedPw,
      admin: isAdmin,
      nivel,
      accountOwner: false,
      changedPw: true,
      active: true,
    };

    await this.usersRepository.save(registerUser);
    return res.status(201).json('Usuario Creado!');
  }

  async getAllUsers(res: Response) {
    const allUsers = await this.usersRepository.find({
      where: {
        nombre: Not(IsNull()),
        apellido: Not(IsNull()),
      },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        nivel: true,
        admin: true,
        accountOwner: true,
        changedPw: true
      },
    });
    PerformanceObserverEntryList
    const formattedResponse = [...allUsers];
    const userResponse = formattedResponse.map((user) => {
      return {
        id: user.id,
        name: user.nombre,
        lastName: user.apellido,
        nivel: user.nivel,
        admin: user.admin,
        accountOwner: user.accountOwner,
        changedPw: user.changedPw
      };
    });
    res.status(200).json(userResponse);
  }

  async getAllUsersAssigned(res: Response) {
    const allUsers = await this.usersRepository.find({
      where: {
        nombre: Not(IsNull()),
        apellido: Not(IsNull()),
      },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        nivel: true,
        admin: true,
      },
    });
    return res.status(201).json(allUsers);
  }

  async getUserById(id: number, res: Response) {
    res.json(`obteniendo usuario ${id}`);
  }

  async getUserByIds(usersId: GetUserByIds, res: Response) {
    const { ids } = usersId;
    const fullNames = ids.map((name) => {
      const [nombre, apellido] = name.split(' ');
      return { nombre, apellido };
    });
    const responseId = await this.usersRepository.find({
      where: fullNames.map((fullName) => ({
        nombre: fullName.nombre,
        apellido: fullName.apellido,
      })),
      select: ['id', 'nombre', 'apellido'],
    });
    return res.status(201).json(responseId);
  }

  async update(id: number, nivel: number, res: Response) {
    let admin: boolean;

    nivel === 4 ? admin = false : admin = true;

    await this.usersRepository.update(id, {
      nivel,
      admin
    });

    const userData = await this.usersRepository.findOne({
      where: { id }
    });
    const { nombre, apellido } = userData;
    return res.status(201).json(`El usuario ${nombre} ${apellido} fue modificado`);
  }

  async userIds(id: GetUserByIds, res: Response) {
    const { ids } = id;
    const fullNames = ids.map((names) => {
      const [nombre, apellido] = names.split(' ');
      const frstName = nombre.trim()
      const lastName = apellido.trim()
      return { frstName, lastName };
    });

    const responseId = await this.usersRepository.find({
      where: fullNames.map((fullName) => ({
        nombre: capFirstLetter(fullName.frstName),
        apellido: capFirstLetter(fullName.lastName),
      })),
      select: ['id', 'nombre', 'apellido'],
    });
    return res.status(201).json(responseId);
  }

  async deleteUser(id: number, res: Response) {
    const user = await this.usersRepository.findOne({
      where: { id: id },
      relations: ['projects'],
    });
    if (!user) {
      return res.status(503).json('Usuario No Encontrado')
    }
    const { nombre, apellido } = user

    await this.usersRepository
      .createQueryBuilder()
      .delete()
      .where('id = :id', { id: id })
      .execute();

    res
      .status(201)
      .json(`Usuario ${nombre} ${apellido} fue eliminado`);
  }
}
