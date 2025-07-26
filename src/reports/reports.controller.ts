import { Controller, Get, Post, Res, Body, Patch, Param, Delete, Query, HttpStatus } from '@nestjs/common';
import { Response } from 'express'
import { ReportsService } from './reports.service';
import { DateRangeDto } from './dto/create-report.dto'

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) 
  {}

  @Post()
  create(@Body() createReportDto, @Res() res: Response) {
    return this.reportsService.create(createReportDto, res);
  }

  @Post("/download")
  async downloadReports(@Res() res: Response, @Body() dateRange: DateRangeDto) {
    
    const {start, end, userId} = dateRange;
    console.log('estes es el rango',dateRange)

    const startDate = new Date(start);
    const endDate = new Date(end);

    const buffer = await this.reportsService.generateExcel(new Date(startDate), new Date(endDate), userId);

    console.log('este es el buffer', buffer)

    //res.json('Reporte de Proyectos Generado')
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename:"reporte_de_${start}_a_${end}.xlsx"`
    })
    res.end(buffer)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reportsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReportDto) {
    return this.reportsService.update(+id, updateReportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reportsService.remove(+id);
  }
}
