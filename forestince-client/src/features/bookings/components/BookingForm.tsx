import { useNavigate } from 'react-router-dom'
import AsyncSelect from 'react-select/async'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import dayjs from '../../../lib/dayjs'
import { Button } from '../../../components/ui/button'
import { useCreateBooking } from '../hooks/useCreateBooking'
import { useFacilities } from '../../facilities/hooks/useFacilities'
import { searchUsers } from '../api/searchUsers'
import { WORKING_HOURS, MIN_BOOKING_DURATION_HOURS, workingHoursMin, workingHoursMax } from '../../../constants/workingHours'
import type { UserSearchResult } from '../types/booking'

type UserOption = { value: string; label: string; data: UserSearchResult }

async function loadUserOptions(input: string): Promise<UserOption[]> {
  const users = await searchUsers(input)
  return users.map(u => ({ value: u.id, label: u.name, data: u }))
}

function isInFuture(dateStr: string, timeStr: string): boolean {
  if (!dateStr || !timeStr) return false
  return dayjs.utc(`${dateStr}T${timeStr}`).isAfter(dayjs.utc())
}

function todayString(): string {
  return new Date().toISOString().slice(0, 10)
}

function isWithinWorkingHours(t: string): boolean {
  const time  = dayjs.utc(`1970-01-01T${t}`)
  const start = dayjs.utc('1970-01-01').add(WORKING_HOURS.startHour, 'hour')
  const end   = dayjs.utc('1970-01-01').add(WORKING_HOURS.endHour, 'hour')
  return !time.isBefore(start) && !time.isAfter(end)
}

const bookingSchema = z.object({
  facilityId: z.string().min(1, 'Please select a facility'),
  employee: z.custom<UserOption>().nullable(),
  date: z.string().min(1, 'Date is required'),
  startTime: z.string()
    .min(1, 'Start time is required')
    .refine(isWithinWorkingHours, `Start time must be between ${workingHoursMin()} and ${workingHoursMax()}`),
  endTime: z.string()
    .min(1, 'End time is required')
    .refine(isWithinWorkingHours, `End time must be between ${workingHoursMin()} and ${workingHoursMax()}`),
  notes: z.string().max(500).optional(),
}).superRefine((data, ctx) => {
  if (!data.employee) {
    ctx.addIssue({ code: 'custom', message: 'Please select an employee', path: ['employee'] })
  }
  if (data.date && data.startTime && !isInFuture(data.date, data.startTime)) {
    ctx.addIssue({ code: 'custom', message: 'Start time must be in the future', path: ['startTime'] })
  }
  if (data.startTime && data.endTime && data.endTime <= data.startTime) {
    ctx.addIssue({ code: 'custom', message: 'End time must be after start time', path: ['endTime'] })
  }
  if (data.startTime && data.endTime && data.endTime > data.startTime) {
    const [sh, sm] = data.startTime.split(':').map(Number)
    const [eh, em] = data.endTime.split(':').map(Number)
    if ((eh * 60 + em) - (sh * 60 + sm) < MIN_BOOKING_DURATION_HOURS * 60) {
      ctx.addIssue({ code: 'custom', message: `Booking must be at least ${MIN_BOOKING_DURATION_HOURS} hour long`, path: ['endTime'] })
    }
  }
})

type BookingFormValues = z.infer<typeof bookingSchema>

export function BookingForm() {
  const navigate = useNavigate()
  const { facilities, loading: facilitiesLoading } = useFacilities()
  const { submit, loading: submitting } = useCreateBooking()

  const { register, handleSubmit, control, formState: { errors } } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { facilityId: '', employee: null, date: '', startTime: '', endTime: '', notes: '' },
  })

  const notes = useWatch({ control, name: 'notes', defaultValue: '' })
  const disabled = submitting

  async function onSubmit(values: BookingFormValues) {
    const booking = await submit({
      facilityId: Number(values.facilityId),
      userId: values.employee!.value,
      startTime: dayjs.utc(`${values.date}T${values.startTime}`).toISOString(),
      endTime: dayjs.utc(`${values.date}T${values.endTime}`).toISOString(),
      notes: values.notes?.trim() || undefined,
    })
    if (booking) navigate(`/facilities/${booking.facilityId}/bookings/${booking.id}`)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 max-w-lg">

      <div className="flex flex-col gap-1.5">
        <label htmlFor="facilityId" className="text-[12px] font-bold text-color-fg">Facility <span className="text-red-500">*</span></label>
        <select
          id="facilityId"
          {...register('facilityId')}
          disabled={disabled || facilitiesLoading}
          className="w-full rounded-[9px] border border-muted bg-white px-3 py-2 text-[13px] text-color-fg focus:outline-2 focus:outline-offset-2 focus:outline-green-500 disabled:opacity-50"
        >
          <option value="">Select a facility…</option>
          {facilities.map(f => (
            <option key={f.id} value={f.id}>{f.name}</option>
          ))}
        </select>
        {errors.facilityId && <p className="text-[11px] text-red-600">{errors.facilityId.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="employee" className="text-[12px] font-bold text-color-fg">Employee <span className="text-red-500">*</span></label>
        <Controller
          name="employee"
          control={control}
          render={({ field }) => (
            <AsyncSelect<UserOption>
              inputId="employee"
              loadOptions={loadUserOptions}
              defaultOptions
              value={field.value}
              onChange={opt => field.onChange(opt ?? null)}
              isDisabled={disabled}
              isClearable
              placeholder="Search employee…"
              noOptionsMessage={() => 'No employees found'}
              loadingMessage={() => 'Searching…'}
              unstyled
              classNames={{
                control: ({ isFocused }) => [
                  'w-full rounded-[9px] border border-muted bg-white px-3 py-1.5 text-[13px] text-color-fg cursor-pointer',
                  isFocused ? 'outline outline-2 outline-offset-2 outline-green-500' : '',
                ].join(' '),
                menu: () => 'mt-1 rounded-[9px] border border-muted bg-white shadow-md z-50 overflow-hidden',
                option: ({ isFocused }) => `px-3 py-2 text-[13px] cursor-pointer ${isFocused ? 'bg-surface' : ''}`,
                placeholder: () => 'text-fg-muted',
                singleValue: () => 'text-color-fg',
                input: () => 'text-[13px] text-color-fg',
                loadingMessage: () => 'px-3 py-2 text-[12px] text-fg-muted',
                noOptionsMessage: () => 'px-3 py-2 text-[12px] text-fg-muted',
                clearIndicator: () => 'text-fg-muted hover:text-red-500 cursor-pointer px-1',
                dropdownIndicator: () => 'text-fg-muted px-1',
              }}
              formatOptionLabel={opt => (
                <div>
                  <div className="font-medium">{opt.data.name}</div>
                  <div className="text-[11px] text-fg-muted">{opt.data.company.name} · {opt.data.email}</div>
                </div>
              )}
            />
          )}
        />
        {errors.employee && <p className="text-[11px] text-red-600">{errors.employee.message as string}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="date" className="text-[12px] font-bold text-color-fg">Date <span className="text-red-500">*</span></label>
        <input
          id="date"
          type="date"
          {...register('date')}
          min={todayString()}
          disabled={disabled}
          className="w-full rounded-[9px] border border-muted bg-white px-3 py-2 text-[13px] text-color-fg focus:outline-2 focus:outline-offset-2 focus:outline-green-500 disabled:opacity-50"
        />
        {errors.date && <p className="text-[11px] text-red-600">{errors.date.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="startTime" className="text-[12px] font-bold text-color-fg">Start Time <span className="text-red-500">*</span></label>
          <input
            id="startTime"
            type="time"
            {...register('startTime')}
            min={workingHoursMin()}
            max={workingHoursMax()}
            disabled={disabled}
            className="w-full rounded-[9px] border border-muted bg-white px-3 py-2 text-[13px] text-color-fg focus:outline-2 focus:outline-offset-2 focus:outline-green-500 disabled:opacity-50"
          />
          {errors.startTime && <p className="text-[11px] text-red-600">{errors.startTime.message}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="endTime" className="text-[12px] font-bold text-color-fg">End Time <span className="text-red-500">*</span></label>
          <input
            id="endTime"
            type="time"
            {...register('endTime')}
            min={workingHoursMin()}
            max={workingHoursMax()}
            disabled={disabled}
            className="w-full rounded-[9px] border border-muted bg-white px-3 py-2 text-[13px] text-color-fg focus:outline-2 focus:outline-offset-2 focus:outline-green-500 disabled:opacity-50"
          />
          {errors.endTime && <p className="text-[11px] text-red-600">{errors.endTime.message}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="notes" className="text-[12px] font-bold text-color-fg">Notes <span className="text-[11px] font-normal text-fg-muted">(optional)</span></label>
        <textarea
          id="notes"
          {...register('notes')}
          maxLength={500}
          rows={3}
          disabled={disabled}
          placeholder="Any additional notes…"
          className="w-full rounded-[9px] border border-muted bg-white px-3 py-2 text-[13px] text-color-fg placeholder:text-fg-muted resize-none focus:outline-2 focus:outline-offset-2 focus:outline-green-500 disabled:opacity-50"
        />
        <p className="text-[11px] text-fg-muted text-right">{(notes ?? '').length}/500</p>
      </div>

      <div className="flex items-center gap-3 pt-1">
        <Button type="submit" variant="primary" disabled={disabled}>
          {submitting ? 'Creating…' : 'Create Booking'}
        </Button>
        <Button type="button" variant="ghost" onClick={() => navigate(-1)} disabled={disabled}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
