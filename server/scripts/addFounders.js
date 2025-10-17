const mongoose = require('mongoose');
const Founder = require('../models/Founder');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shunmugam-textiles', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const foundersData = [
  {
    name: "(late) P. Nachiappan",
    position: "Founder",
    bio: "The visionary founder of Shunmugam Textiles who established the company in 2003 with a dream to create high-quality textiles while maintaining sustainable practices and supporting the local community.",
    order: 1,
    active: true
  },
  {
    name: "N. Sellamuthu",
    position: "Proprietor",
    bio: "A key proprietor of Shunmugam Textiles, contributing to the company's growth and success through strategic leadership and industry expertise.",
    order: 2,
    active: true
  },
  {
    name: "N. Loganathan",
    position: "Proprietor",
    bio: "A dedicated proprietor who plays a crucial role in the company's operations and decision-making processes, ensuring continued excellence in textile manufacturing.",
    order: 3,
    active: true
  },
  {
    name: "S. Mythies Kumar",
    position: "Executive Director",
    bio: "Executive Director with extensive experience in textile manufacturing and business operations, leading the company towards innovation and growth.",
    order: 4,
    active: true
  },
  {
    name: "L. Shanmugaraj",
    position: "Executive Director",
    bio: "Executive Director responsible for overseeing key business operations and driving strategic initiatives to maintain Shunmugam Textiles' position as a leading manufacturer.",
    order: 5,
    active: true
  },
  {
    name: "S. Arun",
    position: "Executive Director",
    bio: "Executive Director focused on operational excellence and quality management, ensuring that every product meets the highest standards of quality and customer satisfaction.",
    order: 6,
    active: true
  }
];

async function addFounders() {
  try {
    console.log('Starting to add founders and directors...');
    
    // Clear existing founders
    await Founder.deleteMany({});
    console.log('Cleared existing founders data');
    
    // Add new founders
    const addedFounders = await Founder.insertMany(foundersData);
    console.log(`Successfully added ${addedFounders.length} founders/directors:`);
    
    addedFounders.forEach(founder => {
      console.log(`- ${founder.name} (${founder.position})`);
    });
    
    console.log('\nFounders and directors data has been successfully added to the database!');
    console.log('Founders/directors have been added successfully to the system.');
    
  } catch (error) {
    console.error('Error adding founders:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the script
addFounders();


