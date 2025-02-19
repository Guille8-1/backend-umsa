import { Column, CreateDateColumn, UpdateDateColumn, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, IsNull} from 'typeorm'
import { Users } from '../../auth/entities/users.entity'
import { Comments } from './comments.entity'


@Entity()
export class Projects {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type:'varchar', length:100})
    titulo: string

    @Column({type:'varchar', length:20, nullable: true})
    facultad: string

    @Column({type:'varchar', length:20})
    estado: string

    @Column({type:'varchar', length:20})
    etiquetas: string

    @Column('text', {array: true})
    asignados: string[]

    @Column({type:'varchar', length:20})
    prioridad: string

    @Column({type:'varchar', length:20, nullable: true})
    tipo: string
    
    @ManyToOne(() => Users, (users) => users.projects, {
        nullable: true,
        onDelete: 'SET NULL'
    })
    user: Users

    @OneToMany(() => Comments, (comment) => comment.project,{
        cascade: true,
        onDelete: 'CASCADE'
    })
    comentarios: string

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