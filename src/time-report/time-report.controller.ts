import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TimeReportService } from './time-report.service';

@Controller('time-reports')
export class TimeReportController {
  constructor(private readonly timeReportService: TimeReportService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    await this.timeReportService.uploadFile(file);
    return { message: 'File uploaded successfully' };
  }
}
