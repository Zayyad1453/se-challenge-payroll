import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class FileMetadata {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fileName: string;

  @Column()
  reportId: number;
}
