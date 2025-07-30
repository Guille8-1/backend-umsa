import { Response } from 'express';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Projects } from 'src/projects/entities/projects.entity';
import { Between, IsNull, Not, Repository } from 'typeorm';
import { Workbook } from 'exceljs';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Projects)
    private readonly projectRepository: Repository<Projects>,
  ) {}

  async generateExcel(
    startDate: Date,
    endDate: Date,
    userId: number,
  ): Promise<Buffer> {
    const userIdReport = await this.projectRepository.find({
      where: {
        titulo: Not(IsNull()),
        gestor: Not(IsNull()),
        user: { id: userId },
        createdDate: Between(new Date(startDate), new Date(endDate)),
      },
    });

    const userAssignedReport = await this.projectRepository
      .createQueryBuilder('projectsReport')
      .where(':userId = ANY(projectsReport.asignadosId)', { userId })
      .andWhere('projectsReport.createdDate BETWEEN :startDate AND :endDate', {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      })
      .getMany();

    const constructRport = userIdReport.concat(userAssignedReport);

    const noRepeatedQueries = (uniqueRecords: typeof constructRport) => {
      const seenIds = new Set();
      return uniqueRecords.filter((record) => {
        if (seenIds.has(record.id)) return false;
        seenIds.add(record.id);
        return true;
      });
    };
    const uniqueRecords = noRepeatedQueries(constructRport);

    const workBook = new Workbook();
    const workSheet = workBook.addWorksheet(`Reporte de Proyectos`);

    workSheet.columns = [
      { header: 'Id', key: 'id', width: 20 },
      { header: 'Titulo', key: 'titulo', width: 25 },
    ];

    uniqueRecords.forEach((record) => {
      workSheet.addRow({
        id: record.id,
        titulo: record.titulo,
      });
    });

    const arrayBuffer = await workBook.xlsx.writeBuffer();
    return Buffer.from(arrayBuffer);
  }

  create(createReportDto, res: Response) {
    return res.status(201).json(createReportDto);
  }

  findOne(id: number) {
    return `This action returns a #${id} report`;
  }

  update(id: number, updateReportDto) {
    console.log(updateReportDto);
    return `This action updates a #${id} report`;
  }

  remove(id: number) {
    return `This action removes a #${id} report`;
  }
}
