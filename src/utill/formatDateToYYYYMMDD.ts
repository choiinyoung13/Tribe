export function formatDateToYYYYMMDD(date: Date | string): string {
  let dateObj: Date

  if (typeof date === 'string') {
    dateObj = new Date(date)
  } else {
    dateObj = date
  }

  const year = dateObj.getFullYear()
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const day = String(dateObj.getDate()).padStart(2, '0')

  return `${year}${month}${day}`
}

export function formatDateToYYYY_MM_DD(date: Date | string): string {
  let dateObj: Date

  if (typeof date === 'string') {
    dateObj = new Date(date)
  } else {
    dateObj = date
  }

  const year = dateObj.getFullYear()
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const day = String(dateObj.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}
