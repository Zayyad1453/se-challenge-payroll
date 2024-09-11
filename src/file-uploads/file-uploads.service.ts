import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileMetadata } from './file-uploads.entity';

@Injectable()
export class FileUploadsService {
  constructor(
    @InjectRepository(FileMetadata)
    private fileUploadsRepository: Repository<FileMetadata>,
  ) {}

  async checkReportIdExists(reportId: number): Promise<boolean> {
    const existingReport = await this.fileUploadsRepository.findOne({
      where: { reportId },
    });
    return !!existingReport;
  }

  async createFileMetadata(
    fileName: string,
    reportId: number,
  ): Promise<FileMetadata> {
    const fileMetadata = this.fileUploadsRepository.create({
      fileName,
      reportId,
    });
    return this.fileUploadsRepository.save(fileMetadata);
  }
}
