import { Controller, Get } from '@nestjs/common';
import { PayrollReportService } from './payroll-report.service';

@Controller('payroll-report')
export class PayrollReportController {
  constructor(private readonly payrollReportService: PayrollReportService) {}

  @Get()
  async getPayrollReport() {
    return this.payrollReportService.generateReport();
  }
}
