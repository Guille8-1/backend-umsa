import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, OneToMany } from 'typeorm'
import { Projects } from '../../projects/entities/projects.entity'

@Entity()
export class Users {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: 'varchar', length: 20, nullable: true})
    nombre: string

    @Column({type: 'varchar', length: 20, nullable: true})
    apellido: string

    @Column({type:'varchar', length:60})
    email: string

    @Column({type:'varchar', length:60})
    password: string

    @Column({type:'boolean'})
    admin: boolean
    
    @Column({nullable: true})
    nivel:number

    @CreateDateColumn({type: Date})
    created: Date

    @UpdateDateColumn({type: Date})
    updated: Date

    @OneToMany( () => Projects, (porjects) => porjects.user ,{
        cascade: true,
        onDelete:'CASCADE'
    })
    projects: Projects[]
}