import {
  Controller,
  Res,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';
import {
  CreateUserDto,
  GetUserByIds,
  GetUserDto,
  UpdateUserDto,
} from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('/create-user')
  create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    return this.usersService.create(createUserDto, res);
  }

  @Get('/active/users')
  findAll(@Res() res: Response) {
    return this.usersService.getAllUsers(res);
  }

  @Get('/assigned')
  getUserAssigned(@Res() res: Response) {
    return this.usersService.getAllUsersAssigned(res);
  }

  @Get('/userids')
  getUserId(@Body() getUsersIds: GetUserByIds, @Res() res: Response) {
    return this.usersService.getUserByIds(getUsersIds, res);
  }

  @Post('/ids')
  postUserIds(@Body() getUsersIds: GetUserByIds, @Res() res: Response) {
    return this.usersService.userIds(getUsersIds, res);
  }

  @Get(':userid')
  findOne(
    @Param(new ValidationPipe()) params: GetUserDto,
    @Res() res: Response,
  ) {
    return this.usersService.getUserById(params.userId, res);
  }

  @Patch('/edit/:id/:nivel')
  update(@Param('id') id: string, @Param('nivel') nivel: string, @Res() res: Response) {
    return this.usersService.update(+id, +nivel, res);
  }

  @Delete('/delete/:id')
  deleteUser(
    @Param("id") id: string,
    @Res() res: Response,
  ) {
    return this.usersService.deleteUser(+id, res);
  }
}
