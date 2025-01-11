const express = require("express");
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 3000;

const uri = "mongodb+srv://admin:IabIcqQzOti88bPY@trimurl.isbdj.mongodb.net/?retryWrites=true&w=majority&appName=TrimURL";
const client = new MongoClient(uri);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

function isValidURL(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

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
                const result = await urlsCollection.insertOne({ url, createdAt: new Date() });
                console.log("Inserted URL:", result.insertedId);
                res.send("URL submitted successfully!");
            } catch (error) {
                console.error("Error inserting URL:", error);
                res.send(500).send("Failed to save URL!");
            }
        });
        
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
    }
})();