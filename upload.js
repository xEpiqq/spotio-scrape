// const fs = require('fs');
// const path = require('path');
// const { parse } = require('csv-parse');
// const { createClient } = require('@supabase/supabase-js');

// const SUPABASE_URL = 'https://lrzqxcswrgbjlxmidoia.supabase.co';
// const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxyenF4Y3N3cmdiamx4bWlkb2lhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAzMjQyMTAsImV4cCI6MjA0NTkwMDIxMH0.YEQbCXgheRMWJlTYVp18-F5ucPj9FcLAhEO7jA45qj0';

// // Initialize Supabase client
// const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// const BATCH_SIZE = 100; // Number of rows to process in each batch

// // Read CSV file
// async function readCSV(filePath) {
//   return new Promise((resolve, reject) => {
//     const csvData = [];
//     fs.createReadStream(filePath)
//       .pipe(parse({ columns: true }))
//       .on('data', (row) => csvData.push(row))
//       .on('end', () => resolve(csvData))
//       .on('error', (err) => reject(err));
//   });
// }

// // Upload data to Supabase in batches
// async function uploadData(data) {
//   let successCount = 0;
//   let failureCount = 0;

//   for (let i = 0; i < data.length; i += BATCH_SIZE) {
//     const batch = data.slice(i, i + BATCH_SIZE).map(item => {
//       // Parse location JSON string into an object if available
//       const location = item.location ? JSON.parse(item.location) : null;

//       return {
//         address: item.address,
//         address2: item.address2 || '',
//         city: item.city,
//         state: item.state,
//         zip5: item.zip5,
//         location, // Insert as a Point type
//         knocks: parseInt(item.knocks, 10) || 0,
//         status: parseInt(item.stageId, 10) || 0,
//         created_at: new Date().toISOString(),
//         updated_at: new Date().toISOString()
//       };
//     });

//     try {
//       // Single batch insert
//       const { data: insertedData, error } = await supabase
//         .from('restaurants') // Adjust table name if needed
//         .insert(batch);

//       if (error) {
//         console.error('Batch Insert Error:', error.message);
//         failureCount += batch.length;
//       } else {
//         successCount += batch.length;
//       }

//       console.log(`Processed ${successCount + failureCount} records so far...`);
//     } catch (error) {
//       console.error('Error processing batch:', error);
//       failureCount += batch.length;
//     }
//   }

//   console.log(`Upload completed! Successfully uploaded: ${successCount}, Failed: ${failureCount}`);
// }

// // Main function to handle the process
// async function main() {
//   try {
//     const csvFilePath = path.join(__dirname, 'output.csv'); // Path to your CSV file
//     const data = await readCSV(csvFilePath);
//     await uploadData(data);
//   } catch (error) {
//     console.error('Error:', error);
//   }
// }

// main();

const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://lrzqxcswrgbjlxmidoia.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxyenF4Y3N3cmdiamx4bWlkb2lhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAzMjQyMTAsImV4cCI6MjA0NTkwMDIxMH0.YEQbCXgheRMWJlTYVp18-F5ucPj9FcLAhEO7jA45qj0';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const BATCH_SIZE = 100; // Number of rows to process in each batch

// Read CSV file
async function readCSV(filePath) {
  return new Promise((resolve, reject) => {
    const csvData = [];
    fs.createReadStream(filePath)
      .pipe(parse({ columns: true }))
      .on('data', (row) => csvData.push(row))
      .on('end', () => resolve(csvData))
      .on('error', (err) => reject(err));
  });
}

// Check if a lead with the same address, city, and state already exists
async function leadExists(address, city, state) {
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .select('id')
      .eq('address', address)
      .eq('city', city)
      .eq('state', state)
      .limit(1);

    if (error) {
      console.error('Error checking for existing lead:', error.message);
      return false;
    }

    return data && data.length > 0;
  } catch (error) {
    console.error('Error during existence check:', error);
    return false;
  }
}

// Upload data to Supabase in batches
async function uploadData(data) {
  let successCount = 0;
  let failureCount = 0;

  for (let i = 0; i < data.length; i += BATCH_SIZE) {
    const batch = [];

    for (let j = i; j < i + BATCH_SIZE && j < data.length; j++) {
      const item = data[j];

      // Check if the lead already exists
      const exists = await leadExists(item.address, item.city, item.state);
      if (!exists) {
        batch.push({
          address: item.address,
          address2: item.address2 || '',
          city: item.city,
          state: item.state,
          zip5: item.zip5,
          location: item.location ? JSON.parse(item.location) : null, // Parse location if present
          knocks: parseInt(item.knocks, 10) || 0,
          status: parseInt(item.stageId, 10) || 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
    }

    if (batch.length > 0) {
      try {
        // Single batch insert
        const { data: insertedData, error } = await supabase
          .from('restaurants') // Adjust table name if needed
          .insert(batch);

        if (error) {
          console.error('Batch Insert Error:', error.message);
          failureCount += batch.length;
        } else {
          successCount += batch.length;
        }

        console.log(`Processed ${successCount + failureCount} records so far...`);
      } catch (error) {
        console.error('Error processing batch:', error);
        failureCount += batch.length;
      }
    }
  }

  console.log(`Upload completed! Successfully uploaded: ${successCount}, Failed: ${failureCount}`);
}

// Main function to handle the process
async function main() {
  try {
    const csvFilePath = path.join(__dirname, 'output.csv'); // Path to your CSV file
    const data = await readCSV(csvFilePath);
    await uploadData(data);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
