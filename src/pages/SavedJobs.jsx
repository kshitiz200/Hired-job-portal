import { getSavedJobs } from "@/api/apiJobs"
import JobCard from "@/components/JobCard";
import useFetch from "@/hooks/usefetch"
import { useUser } from "@clerk/react";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";

const SavedJobs = () => {

    const { isLoaded } = useUser();
    const {
        loading: loadingSavedJobs,
        data: savedJobs,
        fn: fnSavedJobs,
    } = useFetch(getSavedJobs);
    useEffect(() => {
        if (isLoaded) fnSavedJobs();
    }, [isLoaded])
    if (!isLoaded || loadingSavedJobs) {
        return <BarLoader className="mb-4" width="100%" color="#F4F4F5" />
    }

    return (
        <div>
            <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">Saved Jobs</h1>
            {loadingSavedJobs === false && (
                <div className="mt-10 grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {savedJobs?.length ? (
                        savedJobs.map((job) => (
                            <JobCard
                                key={job.id}
                                job={job?.job}
                                savedInit={true}
                                onJobSaved={fnSavedJobs}
                            />
                        ))
                    ) : (
                        <p className="text-zinc-400">No Saved Jobs Found 😓</p>
                    )}
                </div>
            )}
        </div>
    )
}
export default SavedJobs