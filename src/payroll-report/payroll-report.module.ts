import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeReport } from '../time-report/time-report.entity';
import { PayrollReportService } from './payroll-report.service';
import { PayrollReportController } from './payroll-report.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TimeReport])],
  providers: [PayrollReportService],
  controllers: [PayrollReportController],
})
export class PayrollReportModule {}
