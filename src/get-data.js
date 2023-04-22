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


  return `${parsedName.trim()} (${pageNumbers.join(', ')})`
}


export const getData = async () => {
  return fetch('/data.csv')
    .then(response => response.text())
    .then(data => data.split('\n'))
    .then(records => records.map(buildRecord))
    .then(records => records.flat())
    .then(records => records.filter(x => x))
}
