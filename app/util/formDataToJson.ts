export default function formDataToJson<T>(formData: FormData): T {
  const obj: Record<string, unknown> = {}
  formData.forEach((value, key) => {
    obj[key] = value
  })

  return obj as T
}
