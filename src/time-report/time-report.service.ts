import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TimeReport } from './time-report.entity';
import { parse } from 'csv-parse';
import { FileUploadsService } from 'src/file-uploads/file-uploads.service';

@Injectable()
export class TimeReportService {
  constructor(
    @InjectRepository(TimeReport)
    private timeReportRepository: Repository<TimeReport>,
    private fileUploadsService: FileUploadsService,
  ) {}

  async uploadFile(file: Express.Multer.File) {
    const reportId = this.extractReportId(file.originalname);
    if (!reportId) {
      throw new Error('Invalid file name');
    }
    const existingReport =
      await this.fileUploadsService.checkReportIdExists(reportId);

    if (existingReport) {
      throw new ConflictException('Report ID already exists');
    }

    await this.fileUploadsService.createFileMetadata(
      file.originalname,
      reportId,
    );

    const records = await this.parseCSV(file.buffer);
    await this.timeReportRepository.save(records);
  }

  private extractReportId(fileName: string): number | null {
    const match = fileName.match(/time-report-(\d+)\.csv$/);
    return match ? parseInt(match[1], 10) : null;
  }

  private async parseCSV(buffer: Buffer): Promise<Partial<TimeReport>[]> {
    return new Promise((resolve, reject) => {
      const records: Partial<TimeReport>[] = [];
      parse(buffer.toString(), { columns: true }, (err, data) => {
        if (err) {
          reject(err);
        } else {
          data.forEach((row) => {
            records.push({
              date: row['date'],
              hoursWorked: parseFloat(row['hours worked']),
              employeeId: row['employee id'],
              jobGroup: row['job group'],
            });
          });
          resolve(records);
        }
      });
    });
  }
}
