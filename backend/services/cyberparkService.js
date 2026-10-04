const axios = require("axios");
const cheerio = require("cheerio");
const Job = require("../models/Job");

const API_URL = "https://cyberparks.in/jm-ajax/get_listings/";

async function scrapeCyberpark() {
    try {
        let page = 1;
        let allJobs = [];
        let totalPages = 1;

        while (page <= totalPages) {
            console.log(`Fetching Cyberpark page ${page}...`);

            const response = await axios.get(API_URL, {
                params: {
                    page,
                },
                headers: {
                    "User-Agent": "Mozilla/5.0",
                },
            });

            const data = response.data;

            totalPages = Number(data.max_num_pages || 1);

            const $ = cheerio.load(data.html || "");

            const jobs = [];

            $("li.job_listing").each((index, element) => {
                const job = $(element);

                const title = job
                    .find(".position h3")
                    .text()
                    .trim();

                const company = job
                    .find(".company strong")
                    .text()
                    .trim();

                const location = job
                    .find(".location")
                    .text()
                    .trim();

                const postedDate = job
                    .find("time")
                    .attr("datetime");

                const jobType = job
                    .find(".job-type")
                    .text()
                    .trim();

                const sourceUrl = job
                    .find("a")
                    .first()
                    .attr("href");

                if (!title || !sourceUrl) {
                    return;
                }

                jobs.push({
                    externalId: sourceUrl,

                    title,

                    company: company || "Unknown",

                    park: "Cyberpark",

                    location: location || "Kozhikode, Kerala",

                    postedDate: postedDate
                        ? new Date(`${postedDate}T00:00:00`)
                        : null,

                    closingDate: null,

                    description: "",

                    experience: "",

                    jobType: jobType || "Full-time",

                    skills: [],

                    sourceUrl,

                    source: "Cyberpark",
                });
            });

            console.log(`Found ${jobs.length} jobs`);

            allJobs.push(...jobs);

            page++;
        }

        // Newest jobs first
        allJobs.sort((a, b) => {
            if (!a.postedDate) return 1;
            if (!b.postedDate) return -1;

            return b.postedDate - a.postedDate;
        });

        console.log(
            `\nTotal Cyberpark jobs found: ${allJobs.length}`
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

        console.log(
            `New Cyberpark jobs added: ${newJobs}`
        );

        console.log(
            `Existing Cyberpark jobs updated: ${updatedJobs}`
        );

        return allJobs;

    } catch (error) {
        console.error(
            "Cyberpark scraper failed:",
            error.response?.status,
            error.message
        );
    }
}

module.exports = scrapeCyberpark;