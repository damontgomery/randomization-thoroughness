// const printSummaryTable = () => {
//   const testResults = [
//     {
//       name: 'Random (1)',
//       result: runTest({
//         shufflingFunction: shuffleTrulyRandom,
//         shuffleCount: 1,
//       }),
//     }
//   ]

//   // for (let i = 1; i <= 7; i++) {
//   //   testResults.push(
//   //     {
//   //       name: `Riffle (${i})`,
//   //       result: runTest({
//   //         shufflingFunction: shuffleRiffleApproximation,
//   //         shuffleCount: i,
//   //       }),
//   //     }
//   //   )
//   // }

//   for (let i = 1; i <= 8; i++) {
//     testResults.push(
//       {
//         name: `Riffle (${i})`,
//         result: runTest({
//           shufflingFunction: shuffleRiffleApproximationWithAccuracy,
//           shuffleCount: i,
//         }),
//       }
//     )
//   }

//   const columnWidth = 10

//   console.log('Suit Count Distribution Summary (over', numberOfSamples, 'samples with', riffleAccuracy, 'accuracy):')
//   console.log('Suit Count |', testResults.map(tr => tr.name.padStart(columnWidth)).join(' | '))
//   console.log('-'.repeat(10 + testResults.length * (columnWidth + 3)))

//   for (let suitCount = 0; suitCount <= numberOfRanks; suitCount++) {
//     const row = [suitCount.toString().padStart(10)]
//     for (const testResult of testResults) {
//       const totalHands = numberOfPlayers * numberOfSuits * numberOfSamples
//       const percent = (testResult.result.get(suitCount) ?? 0) / totalHands * 100
//       row.push(percent.toFixed(2).padStart(columnWidth))
//     }
//     console.log(row.join(' | '))
//   }
// }