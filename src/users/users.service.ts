import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDto, GetUserByIds, UpdateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { hash } from 'bcrypt'
import 'dotenv/config'

declare global {
  namespace Express {
    interface Request{
      user?: Users
    }
  }
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private readonly usersRepository: Repository<Users>,
  ) {}

  async create(createUserDto: CreateUserDto, res: Response) {
    const { password, nombre, email, nivel, apellido } = createUserDto;

    const emialExists = await this.usersRepository.findOne({where: { email }})
    const nameExists = await this.usersRepository.findOne({where: { nombre }})

    if(emialExists || nameExists) {
      return res.status(401).json('Usuario Ya Registrado')
    }

    const hashedPw = await hash(password, 10);

    let isAdmin: boolean
    isAdmin = nivel < 4;
    const lowerName = nombre.toLowerCase();
    const lowerLastName = apellido.toLowerCase();

    const registerUser = {
      nombre: lowerName,
      apellido: lowerLastName,
      email,
      password: hashedPw,
      admin: isAdmin,
      nivel,
      active: true
    }

    await this.usersRepository.save(registerUser)
    return res.status(201).json('Usuario Creado!')
  }

  async getAllUsers(res: Response) {
    const allUsers = await this.usersRepository.find({
      where:{
        nombre: Not(IsNull()),
        apellido: Not(IsNull()),
      },
      select:{
        id: true,
        nombre: true,
        apellido: true,
        nivel: true,
        admin: true
      }
    });
    const formattedResponse = [...allUsers]
    const userResponse = formattedResponse.map((user) => {
      const adminLevel: string = user.admin ? 'si' : 'no'
      return {
        id: user.id,
        name: user.nombre,
        lastName: user.apellido,
        admin: adminLevel,
        nivel: user.nivel,
      }
    });
    res.status(200).json(userResponse)
  }

  async getAllUsersAssigned(res: Response) {
    const allUsers = await this.usersRepository.find({
      where:{
        nombre: Not(IsNull()),
        apellido: Not(IsNull()),
      },
      select:{
        id: true,
        nombre: true,
        apellido: true,
        nivel: true,
        admin: true
      }
    });
    return res.status(201).json(allUsers);
  }

  async getUserById(id: number, res: Response) {
    res.json(`obteniendo usuario ${id}`);
  }

  async getUserByIds(usersId: GetUserByIds, res: Response) {
    const {ids} = usersId;
    const fullNames = ids.map(name => {
      const [nombre, apellido] = name.split(' ');
      return {nombre, apellido};
    });
    const responseId = await this.usersRepository.find({
      where: fullNames.map(fullName => ({
        nombre: fullName.nombre,
        apellido: fullName.apellido,
      })),
      select: ['id', 'nombre', 'apellido'],
    })
    return res.status(201).json(responseId);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async userIds(id: GetUserByIds, res: Response) {
    const {ids} = id
    const fullNames = ids.map(names => {
      const [nombre, apellido] = names.split(' ');
      return {nombre, apellido};
    })
    const responseId = await this.usersRepository.find({
      where: fullNames.map(fullName => ({
        nombre: fullName.nombre,
        apellido: fullName.apellido,
      })),
      select: ['id', 'nombre', 'apellido'],
    })
    return res.status(201).json(responseId);
  }

  async deleteUser(id: number, res: Response) {
    const user = await this.usersRepository.findOne({
      where: {id:id},
      relations: ['projects']
    })

    await this.usersRepository
      .createQueryBuilder()
      .delete()
      .where('id = :id', {id: id})
      .execute()

    res.status(201).json(`Usuario ${user.nombre + user.apellido} fue eliminado`)
  }
}
