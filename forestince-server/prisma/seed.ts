import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function daysFromNow(days: number): Date {
  const d = new Date()
  d.setDate(d.getDate() + days)
  d.setMinutes(0, 0, 0)
  return d
}

function hoursLater(base: Date, hours: number): Date {
  return new Date(base.getTime() + hours * 60 * 60 * 1000)
}

async function main() {
  console.log('Seeding database...')

  await prisma.booking.deleteMany()
  await prisma.user.deleteMany()
  await prisma.facility.deleteMany()
  await prisma.company.deleteMany()

  const [nordic, fjord, skogen] = await Promise.all([
    prisma.company.create({ data: { name: 'Nordic Ventures AB' } }),
    prisma.company.create({ data: { name: 'Fjord Systems AS' } }),
    prisma.company.create({ data: { name: 'Skogen Innovations ApS' } }),
  ])

  const [meditationHut, crystalSpring, oakTrail, zenGarden, silentPod] = await Promise.all([
    prisma.facility.create({ data: { name: 'Birch Meditation Hut' } }),
    prisma.facility.create({ data: { name: 'Crystal Spring Bath' } }),
    prisma.facility.create({ data: { name: 'Old Oak Forest Trail' } }),
    prisma.facility.create({ data: { name: 'Zen Garden Deck' } }),
    prisma.facility.create({ data: { name: 'Silent Retreat Pod' } }),
  ])

  const users = await Promise.all([
    prisma.user.create({ data: { name: 'Marcus Arvidson', email: 'marcus.arvidson@nordic.se', companyId: nordic.id } }),
    prisma.user.create({ data: { name: 'Lina Bergman', email: 'lina.bergman@nordic.se', companyId: nordic.id } }),
    prisma.user.create({ data: { name: 'Erik Nilsson', email: 'erik.nilsson@nordic.se', companyId: nordic.id } }),
    prisma.user.create({ data: { name: 'Sarah Jenkins', email: 'sarah.jenkins@fjord.no', companyId: fjord.id } }),
    prisma.user.create({ data: { name: 'Thomas Muller', email: 'thomas.muller@fjord.no', companyId: fjord.id } }),
    prisma.user.create({ data: { name: 'Anna Halvorsen', email: 'anna.halvorsen@fjord.no', companyId: fjord.id } }),
    prisma.user.create({ data: { name: 'Lars Svendsen', email: 'lars.svendsen@skogen.dk', companyId: skogen.id } }),
    prisma.user.create({ data: { name: 'Ingrid Dahl', email: 'ingrid.dahl@skogen.dk', companyId: skogen.id } }),
    prisma.user.create({ data: { name: 'Bjorn Eriksen', email: 'bjorn.eriksen@skogen.dk', companyId: skogen.id } }),
  ])

  const [marcus, lina, erik, sarah, thomas, anna, lars, ingrid, bjorn] = users

  const bookingData = [
    { startTime: daysFromNow(1),  endTime: hoursLater(daysFromNow(1), 1),  status: 'CONFIRMED', facilityId: meditationHut.id, userId: marcus.id,  notes: 'Morning meditation session' },
    { startTime: daysFromNow(2),  endTime: hoursLater(daysFromNow(2), 2),  status: 'CONFIRMED', facilityId: crystalSpring.id, userId: sarah.id },
    { startTime: daysFromNow(3),  endTime: hoursLater(daysFromNow(3), 1),  status: 'CONFIRMED', facilityId: oakTrail.id,      userId: erik.id,   notes: 'Team trail walk' },
    { startTime: daysFromNow(4),  endTime: hoursLater(daysFromNow(4), 3),  status: 'CONFIRMED', facilityId: zenGarden.id,    userId: lina.id },
    { startTime: daysFromNow(5),  endTime: hoursLater(daysFromNow(5), 1),  status: 'CONFIRMED', facilityId: silentPod.id,    userId: anna.id,   notes: 'Focus work session' },
    { startTime: daysFromNow(6),  endTime: hoursLater(daysFromNow(6), 2),  status: 'CONFIRMED', facilityId: meditationHut.id, userId: lars.id },
    { startTime: daysFromNow(7),  endTime: hoursLater(daysFromNow(7), 1),  status: 'CONFIRMED', facilityId: crystalSpring.id, userId: bjorn.id },
    { startTime: daysFromNow(8),  endTime: hoursLater(daysFromNow(8), 2),  status: 'CONFIRMED', facilityId: oakTrail.id,      userId: ingrid.id, notes: 'Wellness walk' },

    { startTime: daysFromNow(1),  endTime: hoursLater(daysFromNow(1), 1),  status: 'PENDING',   facilityId: zenGarden.id,    userId: thomas.id },
    { startTime: daysFromNow(2),  endTime: hoursLater(daysFromNow(2), 2),  status: 'PENDING',   facilityId: silentPod.id,    userId: marcus.id, notes: 'Deep work block' },
    { startTime: daysFromNow(3),  endTime: hoursLater(daysFromNow(3), 1),  status: 'PENDING',   facilityId: meditationHut.id, userId: sarah.id },
    { startTime: daysFromNow(4),  endTime: hoursLater(daysFromNow(4), 3),  status: 'PENDING',   facilityId: crystalSpring.id, userId: lars.id },
    { startTime: daysFromNow(5),  endTime: hoursLater(daysFromNow(5), 1),  status: 'PENDING',   facilityId: oakTrail.id,      userId: anna.id },
    { startTime: daysFromNow(6),  endTime: hoursLater(daysFromNow(6), 2),  status: 'PENDING',   facilityId: zenGarden.id,    userId: erik.id },

    { startTime: daysFromNow(-1), endTime: hoursLater(daysFromNow(-1), 1), status: 'COMPLETED', facilityId: meditationHut.id, userId: bjorn.id },
    { startTime: daysFromNow(-2), endTime: hoursLater(daysFromNow(-2), 2), status: 'COMPLETED', facilityId: oakTrail.id,      userId: lina.id,  notes: 'Completed group walk' },
    { startTime: daysFromNow(-3), endTime: hoursLater(daysFromNow(-3), 1), status: 'COMPLETED', facilityId: zenGarden.id,    userId: thomas.id },
    { startTime: daysFromNow(-4), endTime: hoursLater(daysFromNow(-4), 3), status: 'COMPLETED', facilityId: crystalSpring.id, userId: ingrid.id },
    { startTime: daysFromNow(-5), endTime: hoursLater(daysFromNow(-5), 1), status: 'COMPLETED', facilityId: silentPod.id,    userId: marcus.id },
    { startTime: daysFromNow(-6), endTime: hoursLater(daysFromNow(-6), 2), status: 'COMPLETED', facilityId: meditationHut.id, userId: anna.id,  notes: 'Weekly mindfulness' },
    { startTime: daysFromNow(-7), endTime: hoursLater(daysFromNow(-7), 1), status: 'COMPLETED', facilityId: oakTrail.id,      userId: lars.id },
    { startTime: daysFromNow(-8), endTime: hoursLater(daysFromNow(-8), 2), status: 'COMPLETED', facilityId: zenGarden.id,    userId: sarah.id },

    { startTime: daysFromNow(-1), endTime: hoursLater(daysFromNow(-1), 1), status: 'CANCELLED', facilityId: silentPod.id,    userId: thomas.id, notes: 'Cancelled due to schedule conflict' },
    { startTime: daysFromNow(2),  endTime: hoursLater(daysFromNow(2), 2),  status: 'CANCELLED', facilityId: crystalSpring.id, userId: bjorn.id },
    { startTime: daysFromNow(3),  endTime: hoursLater(daysFromNow(3), 1),  status: 'CANCELLED', facilityId: oakTrail.id,      userId: ingrid.id },
  ]

  for (const data of bookingData) {
    await prisma.booking.create({ data })
  }

}

main()
  .catch((e) => {
    console.error(e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
