import { version as uuidVersion } from 'uuid';
import { validate as uuidValidate } from 'uuid';

export function isValidUuid(id: string): boolean {
  return uuidValidate(id) && uuidVersion(id) === 4;
}
