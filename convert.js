const fs = require('fs');
const path = require('path');
const { parse } = require('json2csv');

// Load the JSON data
const inputFilePath = path.join(__dirname, 'all_results.json');
const jsonData = JSON.parse(fs.readFileSync(inputFilePath, 'utf8'));

// Extract relevant data for CSV
const csvData = jsonData.map(entry => {
  const pin = entry.pin || {};
  let address = pin.address || '';
  const address2 = entry.addressUnit || ''; // New address2 field from addressUnit
  const zip5 = pin.zip || '';
  let city = '';
  let state = '';
  let stageId = entry.stageId || ''; // Original stageId

  // StageId conversion logic
  if (stageId === '1') {
    stageId = '0';
  } else if (stageId === '14') {
    stageId = '2';
  } else if (['10', '11', '12', '18'].includes(stageId)) {
    stageId = '4';
  }

  // Extract city and state
  if (address.includes(',')) {
    const addressParts = address.split(',');
    city = addressParts[1].trim() || '';
    state = addressParts.length > 2 ? addressParts[2].trim().split(' ')[0] : '';
    address = addressParts[0].trim(); // Remove city and state from address
  }

  const latitude = parseFloat(pin.lat) || null;
  const longitude = parseFloat(pin.lng) || null;
  const location = (latitude && longitude) ? `{"type":"Point","coordinates":[${longitude},${latitude}]}` : null;
  const knocks = entry.visitsCount || 0; // Renamed from visits_count to knocks

  return {
    address,
    address2, // Include the address2 field
    city,
    state,
    zip5,
    location, // Store as GeoJSON Point string
    knocks, // Renamed field
    stageId
  };
});

// Define CSV fields
const fields = ['address', 'address2', 'city', 'state', 'zip5', 'location', 'knocks', 'stageId'];
const opts = { fields };

// Convert to CSV
try {
  const csv = parse(csvData, opts);
  const outputFilePath = path.join(__dirname, 'output.csv');
  fs.writeFileSync(outputFilePath, csv);
  console.log(`CSV file has been created at: ${outputFilePath}`);
} catch (err) {
  console.error('Error creating CSV file:', err);
}
