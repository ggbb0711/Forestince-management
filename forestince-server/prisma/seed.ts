import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function daysFromNow(days: number): Date {
  const d = new Date()
  d.setDate(d.getDate() + days)
  d.setHours(9, 0, 0, 0)
  return d
}

function hoursLater(base: Date, hours: number): Date {
  return new Date(base.getTime() + hours * 60 * 60 * 1000)
}

const DAMAGE_NOTES = [
  'Damage: wooden railing at entrance scratched',
  'Damage: window blind mechanism jammed and broken',
  'Damage: outdoor light fixture broken near entrance',
  'Damage: meditation cushion torn, needs replacement',
  'Damage: bench slat cracked near the pool deck',
  'Damage: floor mat stained beyond cleaning',
  'Damage: outdoor speaker bracket bent',
  'Damage: garden lantern post knocked over, glass broken',
  'Damage: door handle loose, screws missing',
  'Damage: wall hook broken, items fell',
]

async function main() {
  console.log('Seeding database...')

  await prisma.booking.deleteMany()
  await prisma.user.deleteMany()
  await prisma.facility.deleteMany()

  const [meditationHut, crystalSpring, oakTrail, zenGarden, silentPod] = await Promise.all([
    prisma.facility.create({ data: { name: 'Birch Meditation Hut', facilityIcon: 'HutIcon' } }),
    prisma.facility.create({ data: { name: 'Crystal Spring Bath',  facilityIcon: 'SwimmingIcon' } }),
    prisma.facility.create({ data: { name: 'Old Oak Forest Trail', facilityIcon: 'HikingIcon' } }),
    prisma.facility.create({ data: { name: 'Zen Garden Deck',      facilityIcon: 'ZenIcon' } }),
    prisma.facility.create({ data: { name: 'Silent Retreat Pod',   facilityIcon: 'MindGearIcon' } }),
  ])

  const users = await Promise.all([
    prisma.user.create({ data: { name: 'Marcus Arvidson',  email: 'marcus.arvidson@nordic.se',   companyName: 'Nordic Ventures AB' } }),
    prisma.user.create({ data: { name: 'Lina Bergman',     email: 'lina.bergman@nordic.se',      companyName: 'Nordic Ventures AB' } }),
    prisma.user.create({ data: { name: 'Erik Nilsson',     email: 'erik.nilsson@nordic.se',      companyName: 'Nordic Ventures AB' } }),
    prisma.user.create({ data: { name: 'Hans Petersen',    email: 'hans.petersen@nordic.se',     companyName: 'Nordic Ventures AB' } }),
    prisma.user.create({ data: { name: 'Sarah Jenkins',    email: 'sarah.jenkins@fjord.no',      companyName: 'Fjord Systems AS' } }),
    prisma.user.create({ data: { name: 'Thomas Muller',    email: 'thomas.muller@fjord.no',      companyName: 'Fjord Systems AS' } }),
    prisma.user.create({ data: { name: 'Anna Halvorsen',   email: 'anna.halvorsen@fjord.no',     companyName: 'Fjord Systems AS' } }),
    prisma.user.create({ data: { name: 'Maja Andersen',    email: 'maja.andersen@fjord.no',      companyName: 'Fjord Systems AS' } }),
    prisma.user.create({ data: { name: 'Lars Svendsen',    email: 'lars.svendsen@skogen.dk',     companyName: 'Skogen Innovations ApS' } }),
    prisma.user.create({ data: { name: 'Ingrid Dahl',      email: 'ingrid.dahl@skogen.dk',       companyName: 'Skogen Innovations ApS' } }),
    prisma.user.create({ data: { name: 'Bjorn Eriksen',    email: 'bjorn.eriksen@skogen.dk',     companyName: 'Skogen Innovations ApS' } }),
    prisma.user.create({ data: { name: 'Emma Lindqvist',   email: 'emma.lindqvist@viken.se',     companyName: 'Viken Capital Group' } }),
    prisma.user.create({ data: { name: 'Patrik Sjoberg',   email: 'patrik.sjoberg@viken.se',     companyName: 'Viken Capital Group' } }),
    prisma.user.create({ data: { name: 'Sigrid Thoresen',  email: 'sigrid.thoresen@havet.no',    companyName: 'Havet Marine AS' } }),
    prisma.user.create({ data: { name: 'Nikolai Berg',     email: 'nikolai.berg@havet.no',       companyName: 'Havet Marine AS' } }),
  ])

  const [marcus, lina, erik, hans, sarah, thomas, anna, maja, lars, ingrid, bjorn, emma, patrik, sigrid, nikolai] = users
  const allFacilities = [meditationHut, crystalSpring, oakTrail, zenGarden, silentPod]
  const allUsers = [marcus, lina, erik, hans, sarah, thomas, anna, maja, lars, ingrid, bjorn, emma, patrik, sigrid, nikolai]

  // ─── Explicit near-term bookings (futures + recent window) ───────────────────

  const explicitBookings = [
    // Future CONFIRMED
    { startTime: daysFromNow(1),  endTime: hoursLater(daysFromNow(1), 1),  status: 'CONFIRMED', facilityId: meditationHut.id, userId: marcus.id,  notes: 'Morning meditation session' },
    { startTime: daysFromNow(2),  endTime: hoursLater(daysFromNow(2), 2),  status: 'CONFIRMED', facilityId: crystalSpring.id, userId: sarah.id },
    { startTime: daysFromNow(3),  endTime: hoursLater(daysFromNow(3), 1),  status: 'CONFIRMED', facilityId: oakTrail.id,      userId: erik.id,    notes: 'Team trail walk' },
    { startTime: daysFromNow(4),  endTime: hoursLater(daysFromNow(4), 3),  status: 'CONFIRMED', facilityId: zenGarden.id,    userId: lina.id },
    { startTime: daysFromNow(5),  endTime: hoursLater(daysFromNow(5), 1),  status: 'CONFIRMED', facilityId: silentPod.id,    userId: anna.id,    notes: 'Focus work session' },
    { startTime: daysFromNow(6),  endTime: hoursLater(daysFromNow(6), 2),  status: 'CONFIRMED', facilityId: meditationHut.id, userId: lars.id },
    { startTime: daysFromNow(7),  endTime: hoursLater(daysFromNow(7), 1),  status: 'CONFIRMED', facilityId: crystalSpring.id, userId: bjorn.id },
    { startTime: daysFromNow(8),  endTime: hoursLater(daysFromNow(8), 2),  status: 'CONFIRMED', facilityId: oakTrail.id,      userId: ingrid.id,  notes: 'Wellness walk' },
    { startTime: daysFromNow(10), endTime: hoursLater(daysFromNow(10), 2), status: 'CONFIRMED', facilityId: zenGarden.id,    userId: emma.id,    notes: 'Corporate retreat session' },
    { startTime: daysFromNow(12), endTime: hoursLater(daysFromNow(12), 1), status: 'CONFIRMED', facilityId: silentPod.id,    userId: patrik.id },
    { startTime: daysFromNow(14), endTime: hoursLater(daysFromNow(14), 3), status: 'CONFIRMED', facilityId: meditationHut.id, userId: sigrid.id,  notes: 'Leadership mindfulness retreat' },
    { startTime: daysFromNow(15), endTime: hoursLater(daysFromNow(15), 2), status: 'CONFIRMED', facilityId: crystalSpring.id, userId: nikolai.id },
    { startTime: daysFromNow(18), endTime: hoursLater(daysFromNow(18), 1), status: 'CONFIRMED', facilityId: oakTrail.id,      userId: hans.id,    notes: 'Nordic team hike' },
    { startTime: daysFromNow(20), endTime: hoursLater(daysFromNow(20), 2), status: 'CONFIRMED', facilityId: zenGarden.id,    userId: maja.id },
    // Future PENDING
    { startTime: daysFromNow(1),  endTime: hoursLater(daysFromNow(1), 1),  status: 'PENDING',   facilityId: zenGarden.id,    userId: thomas.id },
    { startTime: daysFromNow(2),  endTime: hoursLater(daysFromNow(2), 2),  status: 'PENDING',   facilityId: silentPod.id,    userId: marcus.id,  notes: 'Deep work block' },
    { startTime: daysFromNow(3),  endTime: hoursLater(daysFromNow(3), 1),  status: 'PENDING',   facilityId: meditationHut.id, userId: sarah.id },
    { startTime: daysFromNow(4),  endTime: hoursLater(daysFromNow(4), 3),  status: 'PENDING',   facilityId: crystalSpring.id, userId: lars.id },
    { startTime: daysFromNow(5),  endTime: hoursLater(daysFromNow(5), 1),  status: 'PENDING',   facilityId: oakTrail.id,      userId: anna.id },
    { startTime: daysFromNow(6),  endTime: hoursLater(daysFromNow(6), 2),  status: 'PENDING',   facilityId: zenGarden.id,    userId: erik.id },
    { startTime: daysFromNow(9),  endTime: hoursLater(daysFromNow(9), 1),  status: 'PENDING',   facilityId: silentPod.id,    userId: emma.id,    notes: 'Strategy planning day' },
    { startTime: daysFromNow(11), endTime: hoursLater(daysFromNow(11), 2), status: 'PENDING',   facilityId: meditationHut.id, userId: nikolai.id },
    { startTime: daysFromNow(16), endTime: hoursLater(daysFromNow(16), 1), status: 'PENDING',   facilityId: oakTrail.id,      userId: sigrid.id },
    // Recent completions (last 7 days — important for dashboard 7d window)
    { startTime: daysFromNow(-1), endTime: hoursLater(daysFromNow(-1), 1), status: 'COMPLETED', facilityId: meditationHut.id, userId: bjorn.id },
    { startTime: daysFromNow(-2), endTime: hoursLater(daysFromNow(-2), 2), status: 'COMPLETED', facilityId: oakTrail.id,      userId: lina.id,    notes: 'Completed group walk' },
    { startTime: daysFromNow(-3), endTime: hoursLater(daysFromNow(-3), 1), status: 'COMPLETED', facilityId: zenGarden.id,    userId: thomas.id },
    { startTime: daysFromNow(-4), endTime: hoursLater(daysFromNow(-4), 3), status: 'COMPLETED', facilityId: crystalSpring.id, userId: ingrid.id },
    { startTime: daysFromNow(-5), endTime: hoursLater(daysFromNow(-5), 1), status: 'COMPLETED', facilityId: silentPod.id,    userId: marcus.id },
    { startTime: daysFromNow(-6), endTime: hoursLater(daysFromNow(-6), 2), status: 'COMPLETED', facilityId: meditationHut.id, userId: anna.id,    notes: 'Weekly mindfulness' },
    { startTime: daysFromNow(-7), endTime: hoursLater(daysFromNow(-7), 1), status: 'COMPLETED', facilityId: oakTrail.id,      userId: lars.id },
    { startTime: daysFromNow(-7), endTime: hoursLater(daysFromNow(-7), 2), status: 'COMPLETED', facilityId: crystalSpring.id, userId: emma.id },
    // Recent cancelled
    { startTime: daysFromNow(-1), endTime: hoursLater(daysFromNow(-1), 1), status: 'CANCELLED', facilityId: silentPod.id,    userId: thomas.id,  notes: 'Cancelled due to schedule conflict' },
    { startTime: daysFromNow(2),  endTime: hoursLater(daysFromNow(2), 2),  status: 'CANCELLED', facilityId: crystalSpring.id, userId: bjorn.id },
    { startTime: daysFromNow(3),  endTime: hoursLater(daysFromNow(3), 1),  status: 'CANCELLED', facilityId: oakTrail.id,      userId: ingrid.id },
  ]

  for (const data of explicitBookings) {
    await prisma.booking.create({ data })
  }

  // ─── Bulk historical bookings (days -8 to -120, programmatic) ─────────────
  // Generates ~170 additional bookings spread across all facilities and users

  interface BulkBooking {
    startTime: Date
    endTime: Date
    status: string
    facilityId: string
    userId: string
    notes: string | null
  }

  const bulkBookings: BulkBooking[] = []
  let counter = 0

  for (let daysBack = 8; daysBack <= 120; daysBack += 3) {
    for (let fIdx = 0; fIdx < allFacilities.length; fIdx++) {
      const facility = allFacilities[fIdx]
      const user = allUsers[counter % allUsers.length]
      const isCancelled = counter % 11 === 7
      const isDamage = counter % 13 === 5 && !isCancelled
      const hours = (counter % 3) + 1
      const offset = fIdx * 2 // stagger each facility by 2 hours to avoid identical times
      const base = daysFromNow(-(daysBack))
      base.setHours(9 + offset, 0, 0, 0)

      bulkBookings.push({
        startTime: base,
        endTime: hoursLater(base, hours),
        status: isCancelled ? 'CANCELLED' : 'COMPLETED',
        facilityId: facility.id,
        userId: user.id,
        notes: isDamage ? DAMAGE_NOTES[counter % DAMAGE_NOTES.length] : null,
      })
      counter++
    }
  }

  await prisma.booking.createMany({ data: bulkBookings })

  const totalBookings = explicitBookings.length + bulkBookings.length
  console.log(`Seeded ${totalBookings} bookings across 5 facilities and ${users.length} users.`)
  console.log(`  - ${explicitBookings.length} explicit (recent/future)`)
  console.log(`  - ${bulkBookings.length} bulk historical`)
}

main()
  .catch((e) => {
    console.error(e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
