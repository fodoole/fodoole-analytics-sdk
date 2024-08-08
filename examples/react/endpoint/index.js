const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');
const cors = require('cors');
const url = require('url');
const port = 4000;
//const { fakerDE: faker } = require('@faker-js/faker');

// Enable CORS for all routes
app.use(cors());

// Serve built and bundled qeen script
app.use(express.static(path.join(__dirname, 'dist')));

// Serve config and cotent json file
// app.use(express.static(path.join(__dirname, 'contentconfig')));

// Function to generate product details
// function generateProductDetails(count) {
//   const products = [];
//   for (let i = 0; i < count; i++) {
//     const product = {
//       name: faker.commerce.productName(),
//       description: faker.commerce.productDescription(),
//       category: 'Computers',
//     };
//     products.push(product);
//   }
//   return products;
// }

app.use('/contentconfig', (req, res) => {
  const parsedUrl = url.parse(req.url); // Parse the URL
  const pathname = parsedUrl.pathname; // Get the pathname without query parameters
  const filePath = path.join(__dirname, 'contentconfig', pathname); // Join the pathname with the directory path

  // Function to get a list of unique product categories
  // function getUniqueProductCategories(count) {
  //   const categories = new Set();
  //   while (categories.size < count) {
  //     categories.add(faker.commerce.department());
  //   }
  //   return Array.from(categories);
  // } 
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading file: ${err.message}`);  // Log error if any
      if (err.code === 'ENOENT') {
        res.status(404).send('File not found');
      } else {
        res.status(500).send('Server error');
      }
      return;
    }

    const productsNamesOptimized = ['product1', 'product2', 'product3', 'product4', 'product5', 'product6', 'product7', 'product8', 'product9', 'product10'];
    const productsDescriptionsOptimized = ['description1', 'description2', 'description3', 'description4', 'description5', 'description6', 'description7', 'description8', 'description9', 'description10'];

    const index = Math.floor(Math.random() * 10);
    // Modify the file content here if needed
    let modifiedData = data.replace("{{descriptionToBeReplaced}}", productsDescriptionsOptimized[index]).replace("{{nameToBeReplaced}}", productsNamesOptimized[index]);
    // const products = generateProductDetails(10);
    // let modifiedData = data.replace("{{descriptionToBeReplaced}}", products[index].description).replace("{{nameToBeReplaced}}", products[index].name);

    res.setHeader('Content-Type', 'application/json');
    res.send(modifiedData);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
