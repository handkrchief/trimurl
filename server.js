require('dotenv').config();
const express = require("express");
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");
const path = require("path");
const { isValidURL, generateUniqueID } = require("./functions");

const app = express();
const PORT = process.env.PORT || 3000;
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

(async () => {
    try {
        await client.connect();
        console.log("Connected to MongoDB.");

        const db = client.db("TrimURL");
        const urlsCollection = db.collection("urls");

        app.post("/submit", async (req, res) => {
            const { url } = req.body;

            if (!url || !isValidURL(url)) {
                return res.status(400).send("URL is required!");
            }

            try {
                const shortCode = await generateUniqueID(db);
                const result = await urlsCollection.insertOne({ 
                    url, 
                    short_code: shortCode,
                    createdAt: new Date(),
                });

                console.log("Inserted URL:", result.insertedId);
                res.send("URL submitted successfully!");
            } catch (error) {
                console.error("Error inserting URL:", error);
                res.send(500).send("Failed to save URL!");
            }
        });

        app.get("/redirect/:shortCode", async (req, res) => {
            const { shortCode } = req.params;

            try {
                const result = await urlsCollection.findOne({ short_code: shortCode });

                if (!result) {
                    return res.status(404).send("Trimmed URL not found!");
                }

                res.redirect(result.url);
            } catch (error) {
                console.error("Error finding trimmed URL:", error);
                res.status(500).send("Failed to process redirect!");
            }
        })
        
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        process.exit(1);
    }
})();