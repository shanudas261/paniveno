const axios = require("axios");
const cheerio = require("cheerio");
const Job = require("../models/Job");

const BASE_URL = "https://infopark.in/companies-job";

async function scrapeInfopark() {
    try {
        let page = 1;
        let allJobs = [];

        while (true) {
            const url =
                page === 1
                    ? BASE_URL
                    : `${BASE_URL}?page=${page}`;

            console.log(`Fetching Infopark page ${page}...`);

            const response = await axios.get(url, {
                headers: {
                    "User-Agent": "Mozilla/5.0",
                },
            });

            const $ = cheerio.load(response.data);

            const jobs = [];

            $("table tbody tr").each((index, element) => {
                const columns = $(element).find("td");

                if (columns.length < 4) {
                    return;
                }

                const postedDateText = $(columns[0])
                    .text()
                    .trim();

                const title = $(columns[1])
                    .text()
                    .trim();

                const company = $(columns[2])
                    .text()
                    .trim();

                const closingDateText = $(columns[3])
                    .text()
                    .trim();

                const detailsLink = $(columns[4])
                    .find("a")
                    .attr("href");

                if (!title || !company) {
                    return;
                }

                const sourceUrl = detailsLink
                    ? new URL(
                          detailsLink,
                          "https://infopark.in"
                      ).href
                    : "";

                jobs.push({
                    externalId: sourceUrl,
                    title,
                    company,

                    park: "Infopark",

                    location: "Kochi, Kerala",

                    postedDate: parseDate(postedDateText),

                    closingDate: parseDate(closingDateText),

                    sourceUrl,

                    source: "Infopark",

                    description: "",
                    experience: "",
                    jobType: "Full-time",
                    skills: [],
                });
            });

            console.log(`Found ${jobs.length} jobs`);

            if (jobs.length === 0) {
                break;
            }

            allJobs.push(...jobs);

            page++;
        }

        console.log(
            `\nTotal Infopark jobs found: ${allJobs.length}`
        );

        let newJobs = 0;
        let updatedJobs = 0;

        for (const job of allJobs) {
            const existingJob = await Job.findOne({
                externalId: job.externalId,
                park: job.park,
            });

            if (existingJob) {
                await Job.findOneAndUpdate(
                    {
                        externalId: job.externalId,
                        park: job.park,
                    },
                    job,
                    {
                        returnDocument: "after",
                    }
                );

                updatedJobs++;
            } else {
                await Job.create(job);

                newJobs++;
            }
        }

        console.log(`New Infopark jobs added: ${newJobs}`);
        console.log(
            `Existing Infopark jobs updated: ${updatedJobs}`
        );

        return allJobs;

    } catch (error) {
        console.error(
            "Infopark scraper failed:",
            error.message
        );
    }
}


function parseDate(dateString) {
    if (!dateString) {
        return null;
    }

    const parts = dateString.split("-");

    if (parts.length !== 3) {
        return null;
    }

    const [day, month, year] = parts;

    return new Date(
        `${year}-${month}-${day}T00:00:00`
    );
}


module.exports = scrapeInfopark;