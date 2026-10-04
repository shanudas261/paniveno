const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const jobRoutes = require("./routes/jobRoutes");
const scrapeTechnopark = require("./services/technoparkService");
const scrapeInfopark = require("./services/infoparkService");
const scrapeCyberpark = require("./services/cyberparkService");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Kerala Tech Jobs API is running"
    });
});

app.use("/api/jobs", jobRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


// Run scraper every 30 minutes
const SCRAPE_INTERVAL = 30 * 60 * 1000;

async function runScraper() {
    console.log("\n==============================");
    console.log("Starting job scrapers...");
    console.log("==============================");

    try {
        console.log("\nStarting Technopark scraper...");
        await scrapeTechnopark();
        console.log("Technopark scraping completed.");
    } catch (error) {
        console.error(
            "Technopark scraper failed:",
            error.message
        );
    }

    try {
        console.log("\nStarting Infopark scraper...");
        await scrapeInfopark();
        console.log("Infopark scraping completed.");
    } catch (error) {
        console.error(
            "Infopark scraper failed:",
            error.message
        );
    }

    try {
        console.log("\nStarting Cyberpark scraper...");
        await scrapeCyberpark();
        console.log("Cyberpark scraping completed.");
    } catch (error) {
        console.error(
            "Cyberpark scraper failed:",
            error.message
        );
    }

    console.log("\n==============================");
    console.log("All scrapers finished.");
    console.log("==============================");
}
// Run immediately
runScraper();

// Then every 30 minutes
setInterval(runScraper, SCRAPE_INTERVAL);