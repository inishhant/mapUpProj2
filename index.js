const express = require('express');
const bodyParser = require('body-parser');
const turf = require('@turf/turf');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// API endpoint
app.post('/intersect', (req, res) => {
  // Validate request body and headers
  if (!req.body || !req.headers.authorization) {
    return res.status(400).json({ error: 'Bad Request' });
  }

  // Perform authentication check (implement your own logic here)
  // Example: Verify the authorization header token
  const isAuthorized = verifyAuthToken(req.headers.authorization);
  if (!isAuthorized) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Extract linestring from the request body
  const linestring = req.body;

  // Validate the linestring
  if (!isValidLinestring(linestring)) {
    return res.status(400).json({ error: 'Invalid linestring' });
  }

  // Perform intersection calculation with the set of lines
  const intersectingLines = findIntersectingLines(linestring);

  // Return the response
  if (intersectingLines.length === 0) {
    return res.json([]);
  } else {
    return res.json(intersectingLines);
  }
});

// Function to verify authorization token
function verifyAuthToken(token) {
  // Implement your own logic to verify the token
  // Example: Compare token against a valid token or check against a user database
  const validToken = 'valid_token';
  return token === validToken;
}

// Function to validate the linestring
function isValidLinestring(linestring) {
  // Implement your own validation logic
  // Example: Check if linestring is a valid GeoJSON LineString
  return linestring && linestring.type === 'LineString' && Array.isArray(linestring.coordinates);
}

// Function to find intersecting lines
function findIntersectingLines(linestring) {
  const lines = [
    // Example lines
    { id: 'L01', coordinates: [[0, 0], [1, 1]] },
    { id: 'L02', coordinates: [[2, 2], [3, 3]] },
    // Add more lines as needed
  ];

  const intersectingLines = [];

  lines.forEach(line => {
    const lineString = turf.lineString(line.coordinates);
    const intersection = turf.lineIntersect(linestring, lineString);

    if (intersection.features.length > 0) {
      intersectingLines.push({
        id: line.id,
        intersection: intersection.features[0].geometry.coordinates
      });
    }
  });

  return intersectingLines;
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
