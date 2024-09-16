const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');
const cors = require('cors');
const nodemailer=require('nodemailer')
const app = express(); // Initialize express app
app.use(cors()); // Apply cors middleware after app initialization
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = 3000;

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/final_student_details')
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define Schema
const studentSchema = new mongoose.Schema({
  name: String,
  registerNumber: String,
  year: String,
  email: String,
  cgpa: Number,
  eventType: String,
  collegeName: String,
  startDate: Date,
  endDate: Date,
  file1: String,
  file2: String,
  description: String,
});

const Student = mongoose.model('Student', studentSchema);

// Middleware to serve static files
app.use(express.static(path.join(__dirname)));

// Serve HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'gemini.html'));
});

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'aravinthsubbaiah3@gmail.com',
    pass:'mheu wpuw gzuz xiha'
  }
});

// Send Email Function
async function sendEmail(to, subject, text) {
  try {
    await transporter.sendMail({
      from: 'aravinthsubbaiah3@gmail.com',
      to: to,
      subject: subject,
      text: text
    });
    console.log('Email sent to:', to);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

// Handle form submissions
app.post('/register', async (req, res)  => {
  try {
    // Log the incoming data
    console.log('Received data:', req.body);

    // Extract form data
    const { name, registerNumber, year, email, cgpa, eventType, collegeName, startDate, endDate, file1, file2, description } = req.body;

    // Save to MongoDB
    const newStudent = new Student({
      name,
      registerNumber,
      year,
      email,
      cgpa,
      eventType,
      collegeName,
      startDate,
      endDate,
      file1,
      file2,
      description,
    });

    await newStudent.save();

    // Synchronize with mentor backend
    await axios.post('http://localhost:3001/syncStudent', {
      name,
      registerNumber,
      cgpa,
      startDate,
      endDate,
      collegeName,
      file1,
      file2,
      email
    });
  
    res.redirect('/progress.html');
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).send('Error submitting form.');
  }
});
// Retrieve student data for mentor.html
app.get('/getStudents', async (req, res) => {
  try {
    // Fetch students with only specific fields
    const students = await Student.find({}, 'name registerNumber cgpa startDate endDate collegeName file1 file2');
    console.log('Fetched students:', students); // Log data for debugging
    res.json(students); // Send the filtered data as JSON response
  } catch (error) {
    console.error('Error retrieving students:', error);
    res.status(500).send('Error retrieving students.');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
