const Job = require("../models/Job");

const createJob = async (req, res) => {
    try {
        const job = await Job.create(req.body);

        res.status(201).json({
            message: "Job created successfully",
            job
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create job",
            error: error.message
        });
    }
};

const getJobs = async (req, res) => {
    try {
        const {
            park,
            title,
            company,
            experience,
            jobType,
            search,
            page = 1,
            limit = 20
        } = req.query;

        const filter = {};

        // Filter by park
        if (park) {
            filter.park = park;
        }

        // Filter by title
        if (title) {
            filter.title = {
                $regex: title,
                $options: "i"
            };
        }

        // Filter by company
        if (company) {
            filter.company = {
                $regex: company,
                $options: "i"
            };
        }

        // Filter by experience
        if (experience) {
            filter.experience = {
                $regex: experience,
                $options: "i"
            };
        }

        // Filter by job type
        if (jobType) {
            filter.jobType = jobType;
        }

        // Search title OR company
        if (search) {
            filter.$or = [
                {
                    title: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    company: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ];
        }

        // Pagination
        const pageNumber = Number(page);
        const limitNumber = Number(limit);

        const skip = (pageNumber - 1) * limitNumber;

        // Get jobs
        const jobs = await Job.find(filter)
            .sort({ postedDate: -1 })
            .skip(skip)
            .limit(limitNumber);

        const startOfToday = new Date();
startOfToday.setHours(0, 0, 0, 0);

const endOfToday = new Date();
endOfToday.setHours(23, 59, 59, 999);

const jobsAddedToday = await Job.countDocuments({
    postedDate: {
        $gte: startOfToday,
        $lte: endOfToday
    }
});

        // Get total matching jobs
        const total = await Job.countDocuments(filter);

        res.status(200).json({
    message: "Jobs fetched successfully",
    count: jobs.length,
    total,
    page: pageNumber,
    limit: limitNumber,
    totalPages: Math.ceil(total / limitNumber),
    jobs,
    jobsAddedToday
});

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch jobs",
            error: error.message
        });
    }
};

const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        res.status(200).json({
            message: "Job fetched successfully",
            job
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch job",
            error: error.message
        });
    }
};

module.exports = {
    createJob,
    getJobs,
    getJobById
};