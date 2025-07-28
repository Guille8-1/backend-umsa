import { Injectable } from '@nestjs/common';
import { Response, Request } from 'express';
import { LoginUserDto } from './dto/login-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { compare } from 'bcrypt'
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
            return res.status(401).json({
                error:'Token No Valido o Autorizados'
            })
        }
        try {
            const decoded = verify(token, process.env.JWT_KEY)
            if(typeof decoded === 'object' && decoded.id){
                req.user = await this.userRepository.findOne({where:{id: decoded.id}})
                res.json({
                    id: req.user.id,
                    name: req.user.nombre,
                    lastName: req.user.apellido,
                    admin: req.user.admin,
                    nivel: req.user.nivel,
                })
            }
        } catch (error) {
            console.error(error)
            return res.status(401).json('Token No Valido o Autorizado')
        }
    }

    async alwaysError(res: Response, req: Request ) {
        res.status(401).json('error')
     }
}
