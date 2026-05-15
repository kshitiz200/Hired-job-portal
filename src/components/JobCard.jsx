import { useUser } from "@clerk/react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Heart, MapPinIcon, Trash2Icon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { deleteJob, savedJobs } from "@/api/apiJobs";
import useFetch from "@/hooks/usefetch";
import { useState } from "react";
import { BarLoader } from "react-spinners";

const JobCard = ({
    job,
    isMyJob = false,
    savedInit = false,
    onJobSaved = () => { }, }) => {
    const { user } = useUser();
    const [saved, setSaved] = useState(savedInit);

    const {
        fn: fnSavedJob,
        loading: loadingSavedJob
    } = useFetch(savedJobs, { alreadySaved: saved });

    const handleSavedJob = async () => {
        const prevSaved = saved;
        setSaved(prev => !prev);
        try {
            await fnSavedJob({
                user_id: user.id,
                job_id: job.id,
            });

            onJobSaved();
        } catch (err) {
            setSaved(prevSaved);
            console.log(err);
        }
    };

    const { loading: loadingDeleteJob, fn: fnDeleteJob } = useFetch(deleteJob, { job_id: job.id });

    const handleDeleteJob = async () => {
        await fnDeleteJob()
        onJobSaved()
    }
    return <Card className="flex flex-col">
        <CardHeader>
            {loadingDeleteJob && (<BarLoader className="mb-4" width="100%" color="#F4F4F5" />)}
            <CardTitle className="flex justify-between font-bold text-xl">
                {job.title}
                {isMyJob && <Trash2Icon
                    fill="red"
                    size={18}
                    className="text-red-300 cursor-pointer"
                    onClick={handleDeleteJob}
                />}
            </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 flex-4">
            <div className="flex justify-between">
                {job.companies && <img src={job.companies.logo_url} className="h-6" />}
                <div className="flex gap-2 items-center" >
                    <MapPinIcon size={15} />
                    <span>{job.location}</span>
                </div>
            </div>
            <hr />
            <p className="text-muted-foreground text-lg">
                {job.description.includes(".")
                    ? job.description.substring(0, job.description.indexOf(".") + 1)
                    : job.description}
            </p>        </CardContent>
        <CardFooter className="flex gap-2">
            <Link to={`/job/${job.id}`} className="flex-1">
                <Button variant="secondary" className="w-full">
                    More Details
                </Button>
            </Link>
            {!isMyJob && (
                <Button size="icon"
                    variant="ghost"
                    className="
                      h-12 w-12
                      rounded-xl
                      bg-zinc-900/90
                      border border-zinc-800
                      hover:bg-zinc-800
                      transition-all duration-200
                      hover:scale-110
                    " onClick={handleSavedJob} disabled={loadingSavedJob}>
                    {saved ?
                        <Heart
                            className="
                               h-6 w-6
                               fill-red-500
                               text-red-500
                               drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]
                               transition-all duration-200
                             "
                        /> : <Heart size={20} stroke="white" fill="none" />
                    }
                </Button>
            )}
        </CardFooter>
    </Card>
}
export default JobCard