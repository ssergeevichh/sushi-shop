export function formatPrice(price: number) {
  return `${price.toLocaleString('uk-UA')} ₴`
}

export function formatWeight(weight: number) {
  return `${weight.toLocaleString('uk-UA')} г`
}

export function getCartUnitsLabel(count: number) {
  const lastTwoDigits = count % 100

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return 'одиниць'
  }

  const lastDigit = count % 10

  if (lastDigit === 1) {
    return 'одиниця'
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'одиниці'
  }

  return 'одиниць'
}

export function getPositionsLabel(count: number) {
  const lastTwoDigits = count % 100

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return 'позицій'
  }

  const lastDigit = count % 10

  if (lastDigit === 1) {
    return 'позиція'
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'позиції'
  }

  return 'позицій'
}
