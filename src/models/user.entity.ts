import { Entity, Column, Index } from 'typeorm'
import { TABLE_NAME } from '../constants/tableName'
import { AppBaseEntity } from '../baseEntity/base.entity'
import { userRole } from '../constants/userRole'

@Entity({ name: TABLE_NAME.USERS })
export class User extends AppBaseEntity {
  @Column('varchar', { length: 255 })
  firstName: string

  @Column('varchar', { length: 255, nullable: true })
  lastName: string | null

  @Column('text', { nullable: true })
  profileImage: string | null

  @Index()
  @Column('varchar', { length: 255, unique: true })
  email: string

  @Column('text', { select: false })
  password: string

  @Column('varchar', { length: 30, nullable: true })
  phone: string | null

  @Column('int', { nullable: true })
  age: number | null

  @Column('numeric', { precision: 6, scale: 2, nullable: true })
  weight: string | null

  @Column('varchar', { length: 20, nullable: true })
  gender: string | null

  @Column({
    type: 'enum',
    enum: userRole,
    default: userRole.USER,
  })
  role: userRole

  @Column('boolean', { default: true })
  isActive: boolean
}
