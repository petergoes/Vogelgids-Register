function buildRecord(record) {
  const [name, ...pageNumbers] = record.split(';')

  if (!name) return

  if (name.includes('/')) {
    const splitRecords = name
      .split('/')
      .map(splitName => buildRecord(`${splitName};${pageNumbers}`))

    // Ignore english names
    return splitRecords[0]
  }

  let parsedName = name
  if (parsedName.includes(',')) {
    const [part1, part2] = parsedName.split(',')
    parsedName = `${part2}${part1}`.replace('- ', '').replace('-', ' ')
  }


  return [parsedName.trim(), ...pageNumbers]
}

function buildSearchString(record) {
  const [name, ...pageNumbers] = record
  return `${name} (${pageNumbers.join(', ').trim()})`
}

function sort(a, b) {
  if (Number(a[1]) < Number(b[1])) {
    return -1;
  }
  if (Number(a[1]) > Number(b[1])) {
    return 1;
  }
  // a must be equal to b
  return 0;
}

export const getData = async () => {
  return fetch('/data.csv')
    .then(response => response.text())
    .then(data => data.split('\n'))
    .then(records => records.map(buildRecord))
    .then(records => records.sort(sort))
    .then(records => records.filter(x => x))
    .then(records => records.map(buildSearchString))
    .then(records => records.flat())
    .then(records => records.filter(x => x))
    .then(records => [...new Set(records)])
}
