import { Injectable } from '@nestjs/common';
import { Response, Request } from 'express';
import { CreateUserDto, GetUserByIds, LoginUserDto } from './dto/login-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/users.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { hash, compare } from 'bcrypt'
import { sign, verify } from 'jsonwebtoken'
import 'dotenv/config'
declare global {
    namespace Express {
        interface Request{
            user?: Users
        }
    }
}
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Users) private readonly userRepository: Repository<Users>
    ) {}
    async createUser(createUser: CreateUserDto, res: Response) {
        const { password, nombre, email, nivel, apellido } = createUser;

        const emialExists = await this.userRepository.findOne({where: { email }})
        const nameExists = await this.userRepository.findOne({where: { nombre }})
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

        await this.userRepository.save(registerUser)
        return res.status(201).json('Usuario Creado!')
    }

    async loginUser(login: LoginUserDto, res:Response) {
        const { email, password } = login;

        const findUser = await this.userRepository.findOne({where: {email}})

        if(!findUser){
            return res.status(401).json('Email No Registrado')
        }
        
        const verified = await compare(password, findUser.password)
        if(!verified) {
            return res.status(401).json('Password o Email Incorrectos')
        }

        const authenticatedUser = {
            id: findUser.id,
            nombre: findUser.nombre,
            apellido: findUser.apellido,
            admin: findUser.admin
        }

        const jwtSession = sign(authenticatedUser, process.env.JWT_KEY, {expiresIn: '4h'})
        return res.status(201).json(jwtSession)
    }

    async verifyUser(res: Response, req: Request){
        const bearer = req.headers.authorization
        if(!bearer){
            return res.status(401).json({error:'No Autorizado'})
        }
        const [ ,token] = bearer.split(" ")
        if(!token){
            return res.status(401).json({error:'Token No Valido o Autorizados'})
        }
        try {
            const decoded = verify(token, process.env.JWT_KEY)
            if(typeof decoded === 'object' && decoded.id){
                req.user = await this.userRepository.findOne({where:{id: decoded.id}})
                res.json({
                    id:req.user.id,
                    name: req.user.nombre,
                    lastName: req.user.apellido,
                    admin: req.user.admin,
                    nivel: req.user.nivel,
                })
            }
            
        } catch (error) {
            return res.status(401).json('Token No Valido o Autorizado')
            }    
    }

    async getUserById(id: number, res: Response){        
        res.json(`obteniendo usuario ${id}`);
    }

    async getUserByIds(usersId: GetUserByIds, res: Response){
        const { ids } = usersId;
        const fullNames = ids.map(name => {
            const [nombre, apellido] = name.split(' ');
            return {nombre, apellido}
        })
        const responseId = await this.userRepository.find({
            where: fullNames.map(fullName => (
              {
                nombre: fullName.nombre,
                apellido: fullName.apellido
              })),
            select: ['id', 'nombre', 'apellido'],
        })
        return res.status(201).json(responseId)
    }

    async getAllUsers(res: Response){
        const allUsers = await this.userRepository.find({
            where:{
                nombre: Not(IsNull()),
                apellido: Not(IsNull())
            },
            select: {
                id: true,
                nombre: true,
                apellido: true,
                nivel: true,
                admin: true
            }
        });
        const formattedResponse = [...allUsers]
        const userResponse = formattedResponse.map((res)=> {
            const adminLevel:string = res.admin ? 'si' : 'no'
            return {
                id: res.id,
                name: res.nombre,
                lastName: res.apellido,
                admin: adminLevel,
                nivel: res.nivel,
            }
        });
        res.status(201).json(userResponse);
    }

    async deleteUser(id: number, res: Response) {
        const user = await this.userRepository.findOne({
            where: {id:id},
            relations: ['projects']
        })

        await this.userRepository
        .createQueryBuilder()
        .delete()
        .where('id = :id', {id: id})
        .execute()

        res.status(201).json(`Usuario ${user.nombre + user.apellido} fue eliminado`)
    }

    async alwaysError(res: Response) {
        res.status(401).json('error')
    }
}
