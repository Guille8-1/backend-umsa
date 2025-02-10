import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Projects } from "./projects.entity";

@Entity()
export class Comments {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type:'varchar'})
    comentarios: string

    @ManyToOne(()=> Projects, (projects) => projects.comentarios,{
        nullable: true,
        onDelete: 'SET NULL'
    })
    project: number

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