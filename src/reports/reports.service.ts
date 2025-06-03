import { Response } from 'express';
import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ReportsService {
  create(createReportDto, res: Response) {
    return res.status(201).json(createReportDto);
  }

  async generateExcel(startDate: Date, endDate: Date): Promise<Buffer> {
     const data = await this.getReportData(startDate, endDate);

     const workBook = new ExcelJS.Workbook();
     const workSheet = workBook.addWorksheet('Report');

     //continuar cuadno se pueda

     return
  }
  //private fn para llamar a los datos del reporte

  private async getReportData(start: Date, end: Date) {
    console.log(start,end)
    console.log('crear el request a la base de datos desde aqui')

    //llamar a la base de datos para generar datos en base a las fechas
  }

  findOne(id: number) {
    return `This action returns a #${id} report`;
  }

  update(id: number, updateReportDto) {
    return `This action updates a #${id} report`;
  }

  remove(id: number) {
    return `This action removes a #${id} report`;
  }
}
