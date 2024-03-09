import assert from 'node:assert'
import * as fs from 'node:fs'
import stringify from 'json-stringify-pretty-compact'
import {normalPalsByName} from '../src/lib/pals'
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
  assert(jsonLine.ResultName in normalPalsByName)
  assert(jsonLine.Parent1Name in normalPalsByName)
  assert(jsonLine.Parent2Name in normalPalsByName)
}

fs.writeFileSync(
  jsonFilePath,
  stringify(jsonData, {
    maxLength: 999,
  }),
)
