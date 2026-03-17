import { Prisma } from '@prisma/client'
import prisma from '../lib/prisma'
import type { FacilityWithCount } from '../types/facility'

const facilityInclude = {
  _count: {
    select: { bookings: true },
  },
} satisfies Prisma.FacilityInclude

export async function getFacilities(): Promise<FacilityWithCount[]> {
  const facilities = await prisma.facility.findMany({
    include: facilityInclude,
    orderBy: { name: 'asc' },
  })
  return facilities as unknown as FacilityWithCount[]
}

export async function getFacilityById(id: number): Promise<FacilityWithCount | null> {
  const facility = await prisma.facility.findUnique({
    where: { id },
    include: facilityInclude,
  })
  return facility as unknown as FacilityWithCount | null
}
