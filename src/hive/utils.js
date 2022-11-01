export function isHiveValueValid(value) {
  if (value == null) {
    return false
  }

  try {
    const json = JSON.stringify(value)

    return !!json
  } catch {
    return false
  }
}
