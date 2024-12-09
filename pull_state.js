const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { parse } = require('json2csv');

const inputFilePath = path.join(__dirname, 'output.csv');
const outputFilePath = path.join(__dirname, 'sorted_output.csv');

const data = [];

// Read the CSV file with proper handling of double quotes
fs.createReadStream(inputFilePath)
  .pipe(csv({ separator: ',', quote: '"' }))
  .on('data', (row) => {
    if (row.state === 'AR') {
      data.push(row);
    }
  })
  .on('end', () => {
    // Sort the data by 'state' (even though all entries are 'WI', keeping it consistent)
    data.sort((a, b) => a.state.localeCompare(b.state));

    // Convert sorted data to CSV format
    const fields = Object.keys(data[0]);
    const csvData = parse(data, { fields });

    // Write to a new CSV file
    fs.writeFileSync(outputFilePath, csvData, 'utf8');
    console.log('File sorted and filtered successfully!');
  });
