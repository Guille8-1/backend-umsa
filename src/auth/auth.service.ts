import { Injectable } from '@nestjs/common';
import { Response, Request } from 'express';
import { CreateUserDto, LoginUserDto, VerifyUserDto } from './dto/login-user.dto'
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/users.entity';
import { Repository } from 'typeorm';
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
        const { password, name, email, admin } = createUser;
        
        const emialExists = await this.userRepository.findOne({where: { email }})
        const nameExists = await this.userRepository.findOne({where: { name }})
        if(emialExists || nameExists) {
            return res.status(401).json('Usuario Ya Registrado')
        }
        
        const hashedPw = await hash(password, 10);
        let isAdmin: boolean
        if(admin === 'true'){
            isAdmin = admin === 'true'
        } else {
            isAdmin = admin === 'true'
        }
        const registerUser = { name, email, password: hashedPw, admin: isAdmin }

        this.userRepository.save(registerUser)
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
            name: findUser.name,
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
                    name: req.user.name,
                    admin: req.user.admin
                })
            }
            
        } catch (error) {
            return res.status(401).json('Token No Valido o Autorizado')
        }    
    }

    async getUserById(id: number, res: Response){        
        res.json(`obteniendo usuario ${id}`)
    }

    async deleteUser(id: number, res: Response) {
        const user = await this.userRepository.findOne({
            where: {id:id},
            relations: ['projects']
        })

        this.userRepository
        .createQueryBuilder()
        .delete()
        .where('id = :id', {id: id})
        .execute()

        res.json(`Usuario ${user.name} fue eliminado`)
    }
}
