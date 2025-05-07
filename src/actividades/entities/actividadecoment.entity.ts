import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Activities } from '../entities/actividade.entity';

@Entity()
export class CommentsActivities {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  comentario: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  author: string;

  @ManyToOne(() => Activities, (activities) => activities.comentariosActivity, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  activity: number;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdDate: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedDate: Date;
}
