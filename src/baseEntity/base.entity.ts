import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  DeleteDateColumn,
} from 'typeorm'

export abstract class AppBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Index()
  id: string

  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  @Index()
  createdAt: Date

  @UpdateDateColumn({
    type: 'timestamp with time zone',
  })
  @Index()
  updatedAt: Date

  @DeleteDateColumn({ select: false })
  deletedAt?: Date
}
