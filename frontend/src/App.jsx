import { useEffect, useState } from "react";
import { getJobs } from "./api/jobApi";

function App() {
    const [jobs, setJobs] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [jobsAddedToday, setJobsAddedToday] = useState(0);

    const [search, setSearch] = useState("");
    const [park, setPark] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchJobs = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getJobs({
    page,
    limit: 20,
    search,
    park
});

setJobs(data.jobs);
setTotalPages(data.totalPages);
setJobsAddedToday(data.jobsAddedToday);
        } catch (error) {
            console.error(error);
            setError("Failed to load jobs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, [page, search, park]);

    const handleSearch = (event) => {
        setSearch(event.target.value);
        setPage(1);
    };

    const handleParkChange = (event) => {
        setPark(event.target.value);
        setPage(1);
    };

    return (
        <div className="min-h-screen bg-slate-50">

            {/* Header */}
            <header className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-6 py-8">

                    <h1 className="text-3xl font-bold text-slate-900">
                        Kerala Tech Jobs
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Find technology jobs across Kerala
                    </p>

                </div>
            </header>


            {/* Main */}
            <main className="max-w-7xl mx-auto px-6 py-8">

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">

                    <input
                        type="text"
                        placeholder="Search jobs or companies..."
                        value={search}
                        onChange={handleSearch}
                        className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <select
                        value={park}
                        onChange={handleParkChange}
                        className="px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">
                            All Parks
                        </option>

                        <option value="Technopark">
                            Technopark
                        </option>

                        <option value="Infopark">
                            Infopark
                        </option>

                        <option value="Cyberpark">
                            Cyberpark
                        </option>
                    </select>

                </div>

                {/* <div className="mb-6">
    <h1 className="text-3xl font-bold">
        Kerala Tech Jobs
    </h1>

    <p className="mt-2 text-green-600 font-medium">
        🟢 {jobsAddedToday} jobs added today
    </p>
</div> */}
                


                {/* Loading */}
                {loading && (
                    <div className="text-center py-20">
                        <p className="text-slate-500">
                            Loading jobs...
                        </p>
                    </div>
                )}


                {/* Error */}
                {error && (
                    <div className="text-center py-20">
                        <p className="text-red-500">
                            {error}
                        </p>
                    </div>
                )}


                {/* Jobs */}
                {!loading && !error && (
                    <>
                        {jobs.length === 0 ? (
                            <div className="text-center py-20">
                                <p className="text-slate-500">
                                    No jobs found.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                                {jobs.map((job) => (
                                    <div
                                        key={job._id}
                                        className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition"
                                    >

                                        <div className="flex justify-between items-start gap-4">

                                            <div>
                                                <h2 className="text-lg font-semibold text-slate-900">
                                                    {job.title}
                                                </h2>

                                                <p className="mt-1 text-blue-600 font-medium">
                                                    {job.company}
                                                </p>
                                            </div>

                                        </div>


                                        <div className="mt-5 space-y-2 text-sm text-slate-600">

                                            <p>
                                                📍 {job.location}
                                            </p>

                                            <p>
                                                🏢 {job.park}
                                            </p>

                                            {job.experience && (
                                                <p>
                                                    💼 {job.experience}
                                                </p>
                                            )}

                                            {job.jobType && (
                                                <p>
                                                    ⏱️ {job.jobType}
                                                </p>
                                            )}

                                        </div>


                                        {job.postedDate && (
                                            <p className="mt-5 pt-4 border-t text-xs text-slate-400">
                                                Posted{" "}
                                                {new Date(job.postedDate).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
})}
                                            </p>
                                        )}
                                        <a
    href={job.sourceUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-block mt-5 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
>
    View Job
</a>

                                    </div>
                                ))}

                            </div>
                        )}


                        {/* Pagination */}
                        <div className="flex justify-center items-center gap-5 mt-10">

                            <button
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                                className="px-5 py-2.5 rounded-lg border bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100"
                            >
                                Previous
                            </button>

                            <span className="text-sm text-slate-600">
                                Page {page} of {totalPages}
                            </span>

                            <button
                                disabled={page === totalPages}
                                onClick={() => setPage(page + 1)}
                                className="px-5 py-2.5 rounded-lg bg-blue-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-700"
                            >
                                Next
                            </button>

                        </div>

                    </>
                )}

            </main>

        </div>
    );
}

export default App;