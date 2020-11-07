import { IsNotEmpty } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { TodoEntity } from '../../todo/entity/todo.entity';

@Entity('task')
export class TaskEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @IsNotEmpty()
  id: number;
  @Column({ type: 'varchar', nullable: false }) name: string;
  @CreateDateColumn() createdOn?: Date;

  @ManyToOne(type => TodoEntity, todo => todo.tasks)
  todo?: TodoEntity;
}
