import prisma from '../lib/prisma'
import type { UserSearchResult } from '../types/user'

export async function searchUsers(search: string): Promise<UserSearchResult[]> {
  const users = await prisma.user.findMany({
    where: search
      ? { name: { contains: search } }
      : {},
    include: {
      company: {
        select: { name: true },
      },
    },
    take: 10,
  })

  return users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    company: { name: u.company.name },
  }))
}
