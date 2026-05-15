import { getMyJobs } from "@/api/apiJobs";
import useFetch from "@/hooks/usefetch";
import { useUser } from "@clerk/react"
import { useEffect } from "react";
import { BarLoader } from "react-spinners";
import JobCard from "./JobCard";


const CreatedJobs = () => {
    const { user } = useUser();
    const {
        loading: loadingCreatedJobs,
        data: createdJobs,
        fn: fnCreatedJobs,
    } = useFetch(getMyJobs, { recruiter_id: user.id, });
    useEffect(() => {
        fnCreatedJobs();
    }, [])

    if (loadingCreatedJobs) {
        return <BarLoader className="mb-4" width="100%" color="#F4F4F5" />
    }
    return (
        <div className="mt-10 grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {createdJobs?.length ? (
                createdJobs.map((job) => (
                    <JobCard
                        key={job?.id}
                        job={job}
                        // savedInit={job?.saved?.length > 0}
                        onJobSaved={fnCreatedJobs}
                        isMyJob
                    />
                ))
            ) : (
                <p className="text-zinc-400">No jobs found 😓</p>
            )}
        </div>
    )
}
export default CreatedJobs