import { TaskEntity } from '../../todo/entity/task.entity';
import { UserEntity } from '../../users/entity/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
  JoinTable,
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';

@Entity('todo')
export class TodoEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @IsNotEmpty()
  id: number;

  @Column({ type: 'varchar', nullable: false }) name: string;
  @Column({ type: 'text', nullable: true }) description?: string;
  @CreateDateColumn() createdOn?: Date;
  @CreateDateColumn() updatedOn?: Date;

  @ManyToOne(type => UserEntity)
  owner?: UserEntity;

  @OneToMany(type => TaskEntity, task => task.todo)
  tasks?: TaskEntity[];
}
