import { Controller, Get, Post, Body, Param, Delete, Res, ValidationPipe, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto, DeleteUserDto, GetUserDto, LoginUserDto, GetUserByIds } from './dto/login-user.dto';



@Controller('/auth')
export class AuthController {
    constructor (private readonly authService: AuthService) {}

    @Post('create-user')
    createUser(@Body() createUser: CreateUserDto, @Res() res: Response) {
        return this.authService.createUser(createUser, res)
    }

    @Post('login-user')
    loginUser(@Body() loginUser: LoginUserDto, @Res()  res: Response) {
        return this.authService.loginUser(loginUser, res)
    }

    @Get('user-token')
    verifyUser (@Res() res: Response, @Req() req: Request ){ 
        return this.authService.verifyUser(res, req)
    }
    @Get('/active/users')
    getUsers(@Res() res: Response) {
        return this.authService.getAllUsers(res)
    }

    @Get('/users/')
    getUsersAssign(@Res() res: Response){
        return this.authService.getAllUsersAssigned(res)
    }

    @Post('/userids')
    getUserId(@Body() getUsersIds: GetUserByIds, @Res() res: Response){
        return this.authService.getUserByIds(getUsersIds ,res)
    }

    @Get(':userId')
    getUserById (@Param(new ValidationPipe()) params: GetUserDto, @Res() res: Response) {
        return this.authService.getUserById(params.userId, res)
    }

    @Delete('/delete/:userId')
    deleteUser(@Param(new ValidationPipe()) params: DeleteUserDto, @Res() res: Response ){
        return this.authService.deleteUser(params.userId, res)
    }
    @Post('/alwayserror')
    errorFn(@Res() res: Response) {
        return this.authService.alwaysError(res)
    }
}
