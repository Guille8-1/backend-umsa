import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, OneToMany } from 'typeorm'
import { Projects } from '../../projects/entities/projects.entity'

@Entity()
export class Users {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: 'varchar', length: 20})
    name: string

    @Column({type:'varchar', length:60})
    email: string

    @Column({type:'varchar', length:60})
    password: string

    @Column()
    admin: boolean
    
    @CreateDateColumn({type: Date})
    createdDate: Date

    @UpdateDateColumn({type: Date})
    updateColumn: Date

    @OneToMany( () => Projects, (porjects) => porjects.user ,{
        cascade: true,
        onDelete:'CASCADE'
    })
    projects: Projects[]

}