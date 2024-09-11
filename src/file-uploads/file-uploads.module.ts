import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileUploadsService } from './file-uploads.service';
import { FileMetadata } from './file-uploads.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FileMetadata])],
  providers: [FileUploadsService],
  exports: [FileUploadsService],
})
export class FileUploadsModule {}
