const axios = require("axios");
const Job = require("../models/Job");

const API_URL = "https://technopark.in/api/paginated-jobs";

async function scrapeTechnopark() {
    try {
        let page = 1;
        let allJobs = [];

        while (true) {
            console.log(`Fetching Technopark page ${page}...`);

            const response = await axios.get(API_URL, {
                params: {
                    page,
                    search: "",
                    type: "",
                },
            });

            const jobs = response.data.data;

            if (!jobs || jobs.length === 0) {
                break;
            }

            const formattedJobs = jobs.map((job) => ({
                externalId: job.job_listing_id,

                title: job.job_title,

                company: job.company?.company || "Unknown",

                park: "Technopark",

                location: "Thiruvananthapuram, Kerala",

                postedDate: job.posted_date
                    ? new Date(`${job.posted_date}T00:00:00`)
                    : null,

                closingDate: job.closing_date
                    ? new Date(`${job.closing_date}T00:00:00`)
                    : null,

                isWalkIn: Boolean(job.is_walk_in),

                walkInStartDate: job.walk_in_start_date,

                walkInStartTime: job.walk_in_start_time,

                walkInEndTime: job.walk_in_end_time,

                companyId: job.company_id,

                companyLogo: job.company?.logo || null,

                // Original Technopark job details page
                sourceUrl: `https://technopark.in/job-details/${job.id}?job=${encodeURIComponent(job.job_title)}`,

                source: "Technopark",
            }));

            allJobs.push(...formattedJobs);

            console.log(`Found ${jobs.length} jobs`);

            if (page >= response.data.last_page) {
                break;
            }

            page++;
        }

        console.log(`\nTotal jobs found: ${allJobs.length}`);

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

console.log(`\nNew jobs added: ${newJobs}`);
console.log(`Existing jobs updated: ${updatedJobs}`);
console.log(`Total jobs processed: ${allJobs.length}`);

        console.log(`\nJobs processed: ${allJobs.length}`);

        return allJobs;

    } catch (error) {
        console.error(
            "Technoparkpa scraper failed:",
            error.response?.status,
            error.message
        );
    }
}

module.exports = scrapeTechnopark;