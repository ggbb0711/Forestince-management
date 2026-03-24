import { API_URL } from '../../../config/env'
import type { ApiResponse } from '../../../lib/apiResponse'
import type { UserSearchResult } from '../types/booking'

export async function searchUsers(query: string): Promise<UserSearchResult[]> {
  const res = await fetch(`${API_URL}/users?search=${encodeURIComponent(query)}`)
  const json = await res.json() as ApiResponse<UserSearchResult[]>
  if (!json.isOk) throw new Error(json.message)
  return json.payload
}
