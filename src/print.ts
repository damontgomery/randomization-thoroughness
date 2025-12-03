import type { LabeledTest } from "./test.js";

export const printTestsSummaryTable = ({ countLabel, rows, labeledTests }: {
  countLabel: string;
  rows: number;
  labeledTests: LabeledTest[]
}): void => {
  const columnWidth = Math.max(
    10, 
    ...labeledTests.map(labeledTest => labeledTest.label.length)
  )
  
  console.log(
    `${countLabel} |`,
    labeledTests.map(
      labeledTest => labeledTest.label.padStart(columnWidth)
    ).join(' | ')
  )

  console.log('-'.repeat(10 + labeledTests.length * (columnWidth + 3)))

  for (let rowIndex = 0; rowIndex <= rows; rowIndex++) {
    const row = [rowIndex.toString().padStart(10)]

    for (const labeledTest of labeledTests) {
      const numberOfObservations = labeledTest.summary.entries().reduce((sum, [, count]) => sum + count, 0)

      const percent = (labeledTest.summary.get(rowIndex) ?? 0) / numberOfObservations * 100

      row.push(percent.toFixed(2).padStart(columnWidth))
    }

    console.log(row.join(' | '))
  }
}
