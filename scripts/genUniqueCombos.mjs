import * as fs from 'fs'
const csvFilePath = './src/data/uniqueCombos.csv'
const jsonFilePath = './src/data/uniqueCombos.json'

const csvData = fs.readFileSync(csvFilePath, 'utf-8')
const lines = csvData.trim().split('\n')
const headers = lines[0].split(',')

const jsonData = []

for (let i = 1; i < lines.length; i++) {
  const currentLine = lines[i].split(',')
  const jsonLine = {}

  for (let j = 0; j < headers.length; j++) {
    jsonLine[headers[j]] = currentLine[j]
  }

  jsonData.push(jsonLine)
}

fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2))
