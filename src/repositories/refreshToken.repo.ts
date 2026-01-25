import { EntityManager, IsNull } from 'typeorm'
import AppDataSource from '../config/db'
import { RefreshToken } from '../models/refreshToken.entity'

const baseRepo = AppDataSource.getRepository(RefreshToken)

const getRepo = (manager?: EntityManager) =>
  manager ? manager.getRepository(RefreshToken) : baseRepo

export const RefreshTokenRepo = {
  create(data: Partial<RefreshToken>, manager?: EntityManager) {
    return getRepo(manager).create(data)
  },

  save(entity: RefreshToken, manager?: EntityManager) {
    return getRepo(manager).save(entity)
  },

  findValidByIdAndHash(tokenId: string, tokenHash: string, manager?: EntityManager) {
    return getRepo(manager).findOne({
      where: {
        id: tokenId,
        tokenHash,
        revokedAt: IsNull(),
      },
    })
  },

  revokeById(tokenId: string, manager?: EntityManager) {
    return getRepo(manager).update(
      { id: tokenId, revokedAt: IsNull() },
      { revokedAt: new Date() }
    )
  },

  revokeAllForUser(userId: string, manager?: EntityManager) {
    return getRepo(manager).update(
      { userId, revokedAt: IsNull() },
      { revokedAt: new Date() }
    )
  },
}
