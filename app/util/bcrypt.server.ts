import bcrypt from "bcrypt"

export function hash(data: string): string {
  return bcrypt.hashSync(data, 10)
}

export function compare(data: string, encrypted: string): boolean {
  return bcrypt.compareSync(data, encrypted)
}
