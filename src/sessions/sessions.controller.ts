import { Controller, Post, Body, Res, Get } from '@nestjs/common';
import { Response } from 'express';
import { CreateSessionDto, VerifySessionDto  } from './dto/create-session.dto'
import { SessionsService } from './sessions.service';



@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post('/index')
  create(@Body() createSession: CreateSessionDto, @Res() res: Response) {
    return this.sessionsService.create(createSession, res);
  }

  @Get('/verify')
  findAll(@Body() verifySession: VerifySessionDto, @Res() res: Response) {
    return this.sessionsService.findAll(verifySession, res);
  }
  //
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.sessionsService.findOne(+id);
  // }
  //
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateSessionDto: UpdateSessionDto) {
  //   return this.sessionsService.update(+id, updateSessionDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.sessionsService.remove(+id);
  // }
}
