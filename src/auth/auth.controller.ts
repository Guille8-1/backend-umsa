import { Controller, Get, Post, Body, Param, Delete, Res, ValidationPipe, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto, DeleteUserDto, GetUserDto, LoginUserDto, GetUserByIds } from './dto/login-user.dto';



@Controller('/auth')
export class AuthController {
    constructor (private readonly authService: AuthService) {}

    @Post('/login-user')
    loginUser(@Body() loginUser: LoginUserDto, @Res()  res: Response) {
        return this.authService.loginUser(loginUser, res)
    }

    @Get('/user-token')
    verifyUser (@Res() res: Response, @Req() req: Request ){ 
        return this.authService.verifyUser(res, req)
    }

    @Post('/alwayserror')
    errorFn(@Req() req: Request, @Res() res: Response) {
        return this.authService.alwaysError(res, req)
    }
}
