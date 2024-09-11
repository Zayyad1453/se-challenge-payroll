import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeReport } from './time-report/time-report.entity';
import { TimeReportModule } from './time-report/time-report.module';
import { PayrollReportModule } from './payroll-report/payroll-report.module';
import { ConfigModule } from '@nestjs/config';
import { FileMetadata } from './file-uploads/file-uploads.entity';
import { FileUploadsModule } from './file-uploads/file-uploads.module';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [FileMetadata, TimeReport],
      synchronize: true,
    }),
    TimeReportModule,
    PayrollReportModule,
    FileUploadsModule,
  ],
})
export class AppModule {}
