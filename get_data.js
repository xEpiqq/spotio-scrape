import fetch from 'node-fetch';
import fs from 'fs';

// Define the base URL without the scrollId parameter
const baseUrl = 'https://app.spotio2.com/api/dataObjectsSearch?includeCustomFieldIds=100002%2C32&includeParentData=false&includeFilterOptionIds=&singleType=1&sortBy=-updatedAt&filterId=Filter-89ea5f02352fed54e45866f3a4732245-595291-&q=AR';

// Define the new headers
const headers = {
    "Accept": "application/json",
    "Accept-Language": "en-US,en;q=0.9",
    "Authorization": "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjUxMjU1MjU0NTc5NzIyMDdDMzBBNUNGNDU5MTkxNUMyMEUxODc1MDFSUzI1NiIsInR5cCI6ImF0K2p3dCIsIng1dCI6IlVTVlNWRmVYSWdmRENsejBXUmtWd2c0WWRRRSJ9.eyJuYmYiOjE3MzIwNzQ4MjYsImV4cCI6MTczMjA4MjAyNiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDozMjc2OCIsImF1ZCI6ImFwaTEiLCJjbGllbnRfaWQiOiJyby5jbGllbnQ3ZCIsInN1YiI6IjU5NTI5MSIsImF1dGhfdGltZSI6MTczMTc4MjQ4OCwiaWRwIjoibG9jYWwiLCJ1aSI6IjU5NTI5MSIsImNpIjoiNjUxZDZhMzlhNjY0ZGE3Y2ZhYmNlODgyIiwiciI6Im1hbmFnZXIiLCJlIjoiSXNhYWNzY2hyYWVkZWxAZ21haWwuY29tIiwibCI6ImVuIiwidGdhIjpmYWxzZSwiZm4iOiJJc2FhYyIsImxuIjoiU2NocmFlZGVsIiwicCI6IldlYiIsImQiOiI4OWVhNWYwMjM1MmZlZDU0ZTQ1ODY2ZjNhNDczMjI0NSIsInV0IjoiZm9vdHMiLCJhciI6InVzMSIsInQiOiJVUy9DZW50cmFsIiwicGwiOiJCMkIiLCJjbiI6IkJyaWdodHNwZWVkIiwicHAiOiJCZ0FBQUFBZ2oySENCdz09IiwicG0iOiJUZWFtcyIsImFtIjoiRmxleGlibGUiLCJsY3MiOiJmYWxzZSIsImp0aSI6IkEwMUUzQzdBRUI3MDZFOTlFNTI0Mzg2OTAzMzQ5MTBDIiwiaWF0IjoxNzMyMDc0ODI2LCJzY29wZSI6WyJhcGkxIiwib2ZmbGluZV9hY2Nlc3MiXSwiYW1yIjpbInB3ZCJdfQ.uU51ObmiTwkfdYv4HdEMXCvPLYjINCXevnaE0kmYklB6ZRw_rWO1mO8nH338r3lf4wQelpSI1l1E_HdDdtKvMBHlOm8jzQQTT3ugVayBvtP_wP8kPM9Ya0N0Nn-QFVQuq5gQ6KV1uOfE4YxHoPPOtrKtkJKxWpsoU1eyC9PBXRLpzIB4uXX_Zqpq72nT81H-vOlxDHt_SAikyGjXGGeoFAzyDpXsoRm28K1zIYyylwb6RJPwpcKKsRPYWct-PBWYi2LIvNJXsT_4XLhHVXCrxkcxMDYo_g0ZrdMLiPm4xmJDyGQpDUXfzXj60HDkkr6dXbntrYJrQCGz5toGDsOsgN9EbkXOydQ1Cz9Y3LpjVyWz3T6v6UqwI4LTOjzMUDfAyWeNyte7rXczS2c5qK3fUEJEBR6EjgJD6ouFocumr6CNRMZ2N23pJ4wFKjiblpAzn7a9Foksp_1uTibOJv2GcPDCk9Wh8ipS7Xy8mPMwHPy1JJWboG8-eFDrj3qqxfJ7doqKhoMDRLhS1H8CqO4PH_ZVu2WSUY5P91QZYbi_o6qQJKHYSDckdyMnfC9il7y_P1dL6sSJOPMswBmbrjjv8EBLfinNQImLS9zaOIk3xdvBkDl8UBwKP9AzKBkXmkQtzgDp_JYELqhOZI_q4t6oXVLZaNLFhOx0RorGoccVsK8",
    "Content-Type": "application/json",
    "If-None-Match": "W/\"dBFAR3yQWFqA3Mv12EE7xksex1o\"",
    "Request-Context": "appId=cid-v1:6c287f03-fc91-4c45-a5d2-9586033ec540",
    "Request-Id": "|6758a183f9954a7bb6ddce1a2d6e8257.2f857e514f274b78",
    "Sec-CH-UA": "\"Chromium\";v=\"130\", \"Google Chrome\";v=\"130\", \"Not?A_Brand\";v=\"99\"",
    "Sec-CH-UA-Mobile": "?1",
    "Sec-CH-UA-Platform": "\"Android\"",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "Traceparent": "00-6758a183f9954a7bb6ddce1a2d6e8257-2f857e514f274b78-01",
    "Cookie": "ai_user=m4jRuofnD3LrpfVy/iXWSA|2024-11-05T22:16:47.398Z; __cflb=02DiuFS237Vecp3cV78ukSvEhptTVRmEqH3uLqimDh8Kv; __zlcmid=1Oan9FTplTYb2mK; G_ENABLED_IDPS=google; ai_session=/ui4rnexlGuE+BhfBFhsa4|1730856666733|1730856678330",
    "Referer": "https://app.spotio2.com/pipeline",
    "Referrer-Policy": "strict-origin-when-cross-origin"
};

// Initialize an array to store all results
let allResults = [];

/**
 * Function to fetch data with pagination using scrollId
 * @param {string} scrollId - The scroll identifier for pagination
 */
async function fetchAllResults(scrollId = '') {
    try {
        // Construct the URL with or without the scrollId
        const paginatedUrl = scrollId ? `${baseUrl}&scrollId=${scrollId}` : baseUrl;

        // Define fetch options
        const fetchOptions = {
            method: 'GET',
            headers: headers,
            // Include credentials if necessary
            // In node-fetch, 'credentials: "same-origin"' can be approximated with 'credentials: "include"'
            // However, node-fetch handles cookies differently. Since cookies are included in headers, it's optional.
            // credentials: 'include', // Uncomment if you need to include credentials
        };

        // Make the GET request
        const response = await fetch(paginatedUrl, fetchOptions);

        // Check if the response is OK (status code 200-299)
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        // Parse the JSON response
        const data = await response.json();

        // Check if data contains items
        if (data && data.items) {
            // Concatenate the fetched items to allResults
            allResults = allResults.concat(data.items);
            console.log(`Fetched ${data.items.length} items, total: ${allResults.length}`);

            // If there's a scrollId for the next page, fetch the next set of results
            if (data.scrollId) {
                await fetchAllResults(data.scrollId);
            } else {
                console.log('No more results to fetch.');
            }
        } else {
            console.log('No items found in the response.');
        }

    } catch (error) {
        console.error('Fetch error:', error);
    }
}

/**
 * Main function to initiate data fetching and save results to a file
 */
async function main() {
    await fetchAllResults();

    // Save all fetched results to a JSON file
    fs.writeFile('all_results.json', JSON.stringify(allResults, null, 2), (err) => {
        if (err) {
            console.error('Error writing to file:', err);
            return;
        }
        console.log('All data has been saved to all_results.json');
    });
}

// Execute the main function
main();
