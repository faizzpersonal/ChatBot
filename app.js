// Import necessary modules
const express = require('express'); 
const app = express(); 
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config(); // Load environment variables from .env file
const { Configuration, OpenAIApi } = require("openai"); // Import the Configuration and OpenAIApi classes from the openai module

app.use(bodyParser.json()); // Use the bodyParser middleware to parse JSON data

// Set up routes
app.get('/', (req, res) => { // Define a GET route for the root URL
  res.sendFile(__dirname + '/views/index.html'); // Send the index.html file as the response
});

app.post('/process', (req, res) => { // Define a POST route for the '/process' endpoint
  const userQuery = req.body.query; // Extract the user query from the request body
  console.log('User query:', userQuery);

  // Process the user query using GPT
  processUserQuery(userQuery) // Call the processUserQuery function with the user query
    .then(botResponse => {
      console.log('Bot response:', botResponse);
      res.json({ response: botResponse }); // Send the bot response as JSON
    })
    .catch(error => {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' }); // Send an error response if an error occurs
    });
});

// Make a request to the OpenAI GPT API
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Get the API key from environment variables
});
const api = new OpenAIApi(configuration); // Create an instance of the OpenAIApi class

async function processUserQuery(userQuery) {
  const params = {
    model: "text-davinci-003",
    prompt: userQuery,
    max_tokens: 100 // Adjust as per your requirements
  };

  try {
    const response = await api.createCompletion(params); // Make a request to the GPT API to process the user query
    const choices = response.data.choices;
    if (choices && choices.length > 0) {
      return choices[0].text || 'No response from the bot.'; // Return the bot's response
    } else {
      return 'No response from the bot.'; // Return a default response if no choices are available
    }
  } catch (error) {
    console.error('Error:', error);
    return 'Sorry, an error occurred.'; // Return an error message if an error occurs
  }
}

// Start the server
const port = process.env.PORT;
app.listen(port, () => { // Start listening for incoming requests on the specified port
  console.log(`Server running on port ${port}`);
});
