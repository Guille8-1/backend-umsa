import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Activities } from './actividade.entity';

@Entity()
export class ActivitiesLog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', nullable: true })
    changeTitle: string;

    @Column({nullable: true})
    changedByUser: number;

    @ManyToOne(()=> Activities, (act) => act.logs,{
        nullable: true,
        onDelete: 'SET NULL'
    })
    activity: number;

    @CreateDateColumn({
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP'
    })
    createdDate: Date;

    @UpdateDateColumn({
        type: 'timestamptz',
        default: ()=> 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP'
    })
    updatedDate: Date;
    
}