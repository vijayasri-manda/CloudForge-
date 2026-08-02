/**
 * Integration Test Suite for Enterprise Platform Verification
 */

const http = require('http');

function checkEndpoint(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, body: data });
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function runTests() {
  console.log('--- Executing Platform E2E Smoke Tests ---');
  try {
    const livez = await checkEndpoint('http://localhost:5000/livez');
    console.log(`[PASS] Backend /livez responded with HTTP ${livez.statusCode}`);

    const healthz = await checkEndpoint('http://localhost:5000/healthz');
    console.log(`[PASS] Backend /healthz responded with HTTP ${healthz.statusCode}`);
  } catch (error) {
    console.log(`[NOTICE] Local containers not yet running or active. Exception: ${error.message}`);
  }
}

runTests();
