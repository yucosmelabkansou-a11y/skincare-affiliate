// Run: node scripts/test-diagnosis-tendency.mjs
import fs from 'node:fs'
import vm from 'node:vm'
import assert from 'node:assert/strict'
import ts from 'typescript'

const sandbox = { exports: {} }
vm.runInNewContext(ts.transpileModule(fs.readFileSync(new URL('../src/lib/diagnosis.ts', import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText, sandbox)
const { questions, calculateResult, getSecondaryTendency, parseSecondaryTendency } = sandbox.exports

const fixtures = [
  ['DDBBAABC', 'dry', undefined], ['ECCCCABC', 'oily', undefined],
  ['FBAEBABC', 'sensitive', undefined], ['CBDACADA', 'combination', undefined],
  ['AAAAEABC', 'normal', undefined], ['BABDACCA', 'aging', undefined],
  ['CCDAEABC', 'normal', undefined],
  ['AAAAABAA', 'normal', { type: 'aging', tied: false }],
  ['AAAAABAB', 'normal', { type: 'aging', tied: true }],
  ['AAABBAAD', 'sensitive', { type: 'normal', tied: false }],
  ['AAAABBDD', 'aging', undefined], // 1st 8, 2nd/3rd 7: no arbitrary runner-up
]
for (const [sequence, expected, secondary] of fixtures) {
  const result = calculateResult([...sequence].map(c => c.charCodeAt(0) - 65))
  assert.equal(result.primaryType, expected)
  assert.equal(JSON.stringify(getSecondaryTendency(result)), JSON.stringify(secondary))
}
for (const [secondary, relation] of [['invalid', 'close'], ['dry', 'tied'], ['oily', 'bad'], [['oily'], 'close']]) {
  assert.equal(parseSecondaryTendency('dry', secondary, relation), undefined)
}
let cases = 0
let paired = 0
function visit(answers) {
  if (answers.length < questions.length) {
    questions[answers.length].options.forEach((_, index) => visit([...answers, index]))
    return
  }
  cases++
  const result = calculateResult(answers)
  const values = Object.values(result.scores).sort((a, b) => b - a)
  const secondary = getSecondaryTendency(result)
  assert.equal(Boolean(secondary), values[0] - values[1] <= 1 && values[1] > values[2])
  if (secondary) {
    paired++
    assert.notEqual(secondary.type, result.primaryType)
    assert.equal(secondary.tied, result.scores[result.primaryType] === result.scores[secondary.type])
  }
}
visit([])
assert.equal(cases, 192000)
assert.equal(paired, 56466)
console.log(`PASS: ${fixtures.length} fixtures, ${cases} answer combinations, ${paired} secondary tendencies`)
