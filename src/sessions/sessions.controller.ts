import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SessionsService } from './sessions.service';


@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post('/index')
  create(@Body() body:{name: string, id: number, email: string}) {
    const { name, id, email } = body;
    return this.sessionsService.create(name, id, email);
  }

  // @Get()
  // findAll() {
  //   return this.sessionsService.findAll();
  // }
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
