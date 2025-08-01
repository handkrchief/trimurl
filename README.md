# TrimURL

A simple URL shortener built with Node.js, Express, MySQL, and jQuery.

## Overview

TrimURL is a basic URL trimming service. You enter a long URL and receive a shortened version that redirects back to the original link.

## Database Schema

The service expects a table with the following structure:

```sql
CREATE TABLE links (
    linkID INT AUTO_INCREMENT PRIMARY KEY,
    trimmedUrl VARCHAR(50) UNIQUE,
    url VARCHAR(2083),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Running the Project

- Install dependencies with npm install
- Make sure to create an env with your database variables
- Start the server: nodemon index.js
- Open the app in your browser
