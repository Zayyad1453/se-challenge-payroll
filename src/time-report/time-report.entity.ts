import { JobGroupEnum } from 'src/types/jobGroup.enum';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TimeReport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: string; //maintained as type string due to the DD/MM/YYYY format in the reports

  @Column('float')
  hoursWorked: number;

  @Column()
  employeeId: string;

  @Column({
    type: 'enum',
    enum: JobGroupEnum,
    default: [JobGroupEnum.A],
  })
  jobGroup: JobGroupEnum;
}
