import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  IsNull,
} from 'typeorm';
import { Users } from '../../users/entities/user.entity';
import { CommentsActivities } from './actividadecoment.entity';

@Entity()
export class Activities {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true, length: 255 })
  tituloActividad: string;

  @Column({ type: 'varchar', nullable: true, length: 255 })
  categoriaActividad: string;

  @Column('text', { array: true })
  asignadosActividad: string[];

  @Column('int', { array: true, nullable: true })
  asignadosActividadId: number[];

  @Column({ type: 'varchar', length: 40, nullable: true })
  gestorActividad: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  estadoActividad: string;

  @Column({ nullable: true })
  diasActivoActividad: number;

  @Column({ nullable: true })
  avanceActividad: number;

  @Column({ type: 'varchar', length: 200, nullable: true })
  oficinaOrigenActividad: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  prioridadActividad: string;

  @Column({ type: 'boolean' })
  isActive: boolean;

  @ManyToOne(() => Users, (users) => users.actividades, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  user: Users;

  @OneToMany(
    () => CommentsActivities,
    (commentActivity) => commentActivity.activity,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  comentariosActivity: CommentsActivities;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdDate: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIEMSTAMP',
  })
  updatedDate: Date;
}
