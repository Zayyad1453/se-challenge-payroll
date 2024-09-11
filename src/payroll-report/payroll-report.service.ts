import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TimeReport } from '../time-report/time-report.entity';
import { JobGroupEnum } from 'src/types/jobGroup.enum';

const jobRateMap = new Map<string, number>();
jobRateMap.set(JobGroupEnum.A, 20);
jobRateMap.set(JobGroupEnum.B, 30);

@Injectable()
export class PayrollReportService {
  constructor(
    @InjectRepository(TimeReport)
    private timeReportRepository: Repository<TimeReport>,
  ) {}

  async generateReport() {
    const reports = await this.timeReportRepository.find();
    const employeeReports = this.calculatePayroll(reports);
    return { payrollReport: { employeeReports } };
  }

  private convertToDDMMYYYY = (dateString) => {
    const d = dateString.split('/');
    return new Date(d[2] + '/' + d[1] + '/' + d[0]);
  };

  private calculatePayroll(reports: TimeReport[]) {
    const employeeMap = new Map<string, Record<string, number>>();

    reports.forEach((report) => {
      const employeeId = report.employeeId;
      const jobRate = jobRateMap.get(report.jobGroup);
      const date = new Date(this.convertToDDMMYYYY(report.date));
      const payPeriodKey = this.getPayPeriodKey(date);
      if (!employeeMap.has(employeeId)) {
        employeeMap.set(employeeId, {});
      }

      const periods = employeeMap.get(employeeId);

      if (!periods[payPeriodKey]) {
        periods[payPeriodKey] = 0;
      }

      periods[payPeriodKey] += report.hoursWorked * jobRate;
    });

    const result = [];
    employeeMap.forEach((periods, employeeId) => {
      Object.keys(periods).forEach((periodKey) => {
        const [startDate, endDate] = periodKey.split('|');
        result.push({
          employeeId,
          payPeriod: {
            startDate,
            endDate,
          },
          amountPaid: `$${periods[periodKey].toFixed(2)}`,
        });
      });
    });
    return result.sort(
      (a, b) =>
        a.employeeId.localeCompare(b.employeeId) ||
        new Date(a.payPeriod.startDate).getTime() -
          new Date(b.payPeriod.startDate).getTime(),
    );
  }

  private getPayPeriodKey(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    let startDate: string;
    let endDate: string;

    if (day <= 15) {
      startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
      endDate = `${year}-${month.toString().padStart(2, '0')}-15`;
    } else {
      startDate = `${year}-${month.toString().padStart(2, '0')}-16`;
      endDate = new Date(year, month, 0).toISOString().split('T')[0]; // End of the month
    }

    return `${startDate}|${endDate}`;
  }
}
