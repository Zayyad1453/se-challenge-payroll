import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeReport } from './time-report.entity';
import { TimeReportService } from './time-report.service';
import { TimeReportController } from './time-report.controller';
import { FileUploadsModule } from '../file-uploads/file-uploads.module';

@Module({
  imports: [TypeOrmModule.forFeature([TimeReport]), FileUploadsModule],
  providers: [TimeReportService],
  controllers: [TimeReportController],
})
export class TimeReportModule {}
