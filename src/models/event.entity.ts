import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { AppBaseEntity } from '../baseEntity/base.entity'
import { TABLE_NAME } from '../constants/tableName'
import { User } from './user.entity'
import { EventPrize } from './eventPrize.entity'
import { COMPETITION_TYPES, type CompetitionType } from '~/constants/competitionType'
import { EVENT_STATUS, type EventStatus } from '~/constants/eventStatus'

export type ContactInfo = {
  name: string
  phone_number: string
  email?: string
}

@Entity({ name: TABLE_NAME.EVENTS })
@Index(['startDate'])
@Index(['competitionType'])
@Index(['status'])
export class Event extends AppBaseEntity {
  @Column('varchar', { length: 255 })
  title: string

  @Column('text', { nullable: true })
  description: string

  @Column('varchar', { length: 255 })
  venue: string

  @Column('timestamptz')
  startDate: Date

  @Column('timestamptz', { nullable: true })
  endDate: Date | null

  @Column('text', { array: true, default: () => "'{}'" })
  weightCategories: string[]

  @Column({ type: 'enum', enum: COMPETITION_TYPES })
  competitionType!: CompetitionType

  @Column({ type: 'enum', enum: EVENT_STATUS, default: 'upcoming' })
  status!: EventStatus

  @Column('varchar', { length: 30, nullable: true })
  organizerPhoneNumber: string | null

  @Column('text', { nullable: true })
  eventImage: string | null

  @Column({ type: 'jsonb', nullable: true })
  otherOfficial: ContactInfo | null

  @Column({ type: 'jsonb', nullable: true })
  coordinator: ContactInfo | null

  @Column('uuid')
  createdById: string

  @ManyToOne(() => User, user => user.createdEvents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'createdById' })
  createdBy: User

  @OneToMany(() => EventPrize, prize => prize.event, {
    cascade: true,
    orphanedRowAction: 'delete',
  })
  prizes: EventPrize[]
}
