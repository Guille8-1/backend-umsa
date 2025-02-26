import { Column, CreateDateColumn, UpdateDateColumn, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, IsNull} from 'typeorm'
import { Users } from '../../auth/entities/users.entity'
import { Comments } from './comments.entity'


@Entity()
export class Projects {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type:'varchar', length:100})
    titulo: string

    @Column('text', {array: true})
    asignados: string[]

    @Column({type: 'varchar', length: 20, nullable: true})
    tipoDocumento: string

    @Column({type:'varchar', length:20})
    prioridad: string

    @Column({type:'varchar', length:20, nullable: true})
    tipoActividad: string

    @Column({nullable: true})
    citeNumero: number

    @Column({nullable: true})
    rutaVc: number

    @Column({nullable: true})
    avance: number

    //se va a actulaizar solo en el momento de generacion del reporte
    @Column({nullable: true})
    diasActivo: number
    
    @Column({type:'varchar', length:20, nullable: true})
    estado: string

    @Column({type:'varchar', length:20, nullable: true})
    oficinaOrigen: string

    @Column({nullable: true})
    fechaAtencion: number

    @Column({type:'varchar', length:20, nullable: true})
    actualUsuario: string

    @Column({type:'varchar', length:20, nullable: true})
    gestor: string

    @Column({type:'boolean', nullable: true})
    isActive: boolean

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