import { Column, Entity, ManyToOne, Index } from 'typeorm'
import { AppBaseEntity } from '../baseEntity/base.entity'
import { TABLE_NAME } from '../constants/tableName'
import { Event } from './event.entity'

@Entity({ name: TABLE_NAME.EVENT_PRIZES })
export class EventPrize extends AppBaseEntity {
  @Column('varchar', { length: 255 })
  title: string

  @Column('numeric', { precision: 12, scale: 2 })
  amount: string

  @Index()
  @ManyToOne(() => Event, event => event.prizes, { onDelete: 'CASCADE' })
  event: Event
}
