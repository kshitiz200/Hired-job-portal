import useFetch from "@/hooks/use-fetch"
import { getSavedJobs } from "@/api/apiJobs";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";
import { useEffect } from "react";
import JobCard from "@/components/job-card";

const SavedJobs = () => {
    const { isLoaded } = useUser(); 

    const {
        loading: loadingSavedJobs,
        data: savedJobs,
        fn: fnSavedJObs,
    } = useFetch(getSavedJobs);

    useEffect(() => { 
        if (isLoaded) fnSavedJObs();
    },[isLoaded ])

    if (!isLoaded  || loadingSavedJobs ) {
        return <BarLoader className='mb-4' width={"100%"} color='#36d7b7' />
    }

    return (
        <div>
            <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
                Saved jobs
            </h1>

            {loadingSavedJobs === false && (
                <div className='mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {savedJobs?.length ? (
                        savedJobs.map((saved) => {
                            return <JobCard
                                key={saved.id}
                                job={saved?.job}
                                savedInit={true}
                                onJobSaved={fnSavedJObs}
                            />;
                        })
                    ) : (
                        <div>No Saved Jobs Found 🙈</div>
                    )}
                </div>
            )}
        </div>
    )
}

export default SavedJobs
