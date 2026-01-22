import AppDataSource from '../config/db'
import { User } from '../models/user.entity'

const repo = AppDataSource.getRepository(User)

export const userRepo = {
  findByEmail(email: string) {
    return repo.findOne({ where: { email } })
  },

  findByEmailWithPassword(email: string) {
    return repo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne()
  },

  findActiveById(id: string) {
    return repo.findOne({ where: { id, isActive: true } })
  },

  create(data: Partial<User>) {
    return repo.create(data)
  },

  save(user: User) {
    return repo.save(user)
  },
}
