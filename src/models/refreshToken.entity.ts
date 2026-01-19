import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm'
import { AppBaseEntity } from '../baseEntity/base.entity'
import { TABLE_NAME } from '../constants/tableName'
import { User } from './user.entity'

@Entity({ name: TABLE_NAME.REFRESH_TOKENS })
@Index(['userId'])
@Index(['tokenHash'])
export class RefreshToken extends AppBaseEntity {
  @Column('uuid')
  userId: string

  @Column('text')
  tokenHash: string

  @Column('timestamptz')
  expiresAt: Date

  @Column('timestamp', { nullable: true })
  revokedAt: Date | null

  @Column('varchar', { length: 255, nullable: true })
  userAgent: string | null

  @Column('varchar', { length: 64, nullable: true })
  ip: string | null

  @ManyToOne(() => User, user => user.refreshTokens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User
}
