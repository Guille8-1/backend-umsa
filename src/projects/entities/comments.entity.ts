import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Projects } from "./projects.entity";

@Entity()
export class Comments {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type:'varchar'})
    comentario: string

    @ManyToOne(()=> Projects, (projects) => projects.comentarios,{
        nullable: true,
        onDelete: 'SET NULL'
    })
    project: number

    @Column({ type:'varchar', nullable:true })
    author: string

    @CreateDateColumn({
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdDate: Date

    @UpdateDateColumn({
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP'
    })
    updatedDate: Date
}