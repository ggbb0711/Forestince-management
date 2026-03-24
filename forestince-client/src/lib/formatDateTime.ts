import dayjs from './dayjs'

export function formatDateTime(iso: string): string {
  return dayjs.utc(iso).format('MMM D, YYYY, h:mm A')
}
