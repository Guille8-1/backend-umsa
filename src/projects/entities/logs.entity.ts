import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Projects } from './projects.entity';

@Entity()
export class ProjectsLog {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type:'varchar', nullable: true })
    changeName: string

    @Column({ nullable: true })
    changedByUser: number

    @ManyToOne(()=> Projects, (projects) => projects.logs,{
        nullable: true,
        onDelete: 'SET NULL'
    })
    project: number

    @CreateDateColumn({
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP'
    })
    createdDate: Date

    @UpdateDateColumn({
        type: 'timestamptz',
        default: ()=> 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP'
    })
    updatedDate: Date
    
}