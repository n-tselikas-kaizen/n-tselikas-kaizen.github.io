import { SUBJECTS } from '../../constants'
import type { Subject } from '../../types'

/** Stubbed network boundary — swap the body for `httpClient.get('/subjects')` once a real catalog API exists. */
export async function fetchSubjects(): Promise<Subject[]> {
  return SUBJECTS
}
