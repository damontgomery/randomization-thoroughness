import type { LabeledTest } from "./test.js";

export const printTestsSummaryTable = ({
  countLabel,
  rows,
  // Sometimes we want a percent of hands and sometimes a percent of suits, etc. So, we let the caller provide this.
  numberOfObservations,
  labeledTests
}: {
  countLabel: string;
  rows: number;
  numberOfObservations: number;
  labeledTests: LabeledTest[]
}): void => {
  const columnWidth = Math.max(
    countLabel.length, 
    ...labeledTests.map(labeledTest => labeledTest.label.length)
  )
  
  console.log(
    `${countLabel} |`,
    labeledTests.map(
      labeledTest => labeledTest.label.padStart(columnWidth)
    ).join(' | ')
  )

  console.log('-'.repeat(countLabel.length + labeledTests.length * (columnWidth + 3)))

  for (let rowIndex = 0; rowIndex <= rows; rowIndex++) {
    const row = [rowIndex.toString().padStart(countLabel.length)]

    for (const labeledTest of labeledTests) {
      const percent = (labeledTest.summary.get(rowIndex) ?? 0) / numberOfObservations * 100

      row.push(percent.toFixed(2).padStart(columnWidth))
    }

    console.log(row.join(' | '))
  }
}
