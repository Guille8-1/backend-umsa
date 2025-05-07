import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { Activities } from '../entities/actividade.entity'

@Entity()
export class CommentsActivities {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type:'varchar', nullable: true})
    comentario: string

    @ManyToOne(() => Activities, (activities) => activities.comentariosActivity, {
        nullable: true,
        onDelete: 'SET NULL'
    })
    activity: number
}