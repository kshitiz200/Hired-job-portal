import { getSingleJob, updateHiringStatus } from "@/api/apiJobs"
import useFetch from "@/hooks/usefetch"
import { useUser } from "@clerk/react"
import { Briefcase, DoorClosed, DoorOpen, MapPinIcon } from "lucide-react"
import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { BarLoader } from "react-spinners"
import MarkdownEditor from '@uiw/react-markdown-editor';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ApplyJobDrawer from "@/components/ApplyJobDrawer"
import ApplicationCard from "@/components/ApplicationCard"

const JobPage = () => {
    const { isLoaded, user } = useUser()
    const { id } = useParams()

    const { loading: loadingJob, data: job, fn: fnJob, } = useFetch(getSingleJob, { job_id: id, });
    const { loading: loadingHiringStatus, fn: fnHiringStatus, } = useFetch(updateHiringStatus, { job_id: id, });

    const handleStatusChange = (value) => {
        const isOpen = value === "open";
        fnHiringStatus(isOpen).then(() => fnJob());
    }

    useEffect(() => {
        if (isLoaded) fnJob();
    }, [])

    if (!isLoaded || loadingJob) {
        return <BarLoader className="mb-4" width="100%" color="#F4F4F5" />;
    }
    return (
        <div className="flex flex-col gap-6 mt-5">
            <div className="flex flex-col-reverse gap-6 md:flex-row justify-between items-center">
                <h1 className="gradient-title font-extrabold pb-3 text-4xl sm:text-6xl">{job?.title}</h1>
                <img src={job?.company?.logo_url} className="h-15   " alt={job?.title} />
            </div>
            <div className="flex justify-between">
                <div className="flex gap-2">
                    <MapPinIcon />
                    {job?.location}
                </div>
                <div className="flex gap-2">
                    <Briefcase />
                    {job?.applications?.length} Applicants
                </div>
                <div className="flex gap-2">
                    {job?.isOpen ? <><DoorOpen />Open</> : <><DoorClosed />Closed</>}
                </div>
            </div>

            {/* hiring status */}
            {loadingHiringStatus && <BarLoader width="100%" color="#F4F4F5" />}
            {job?.recruiter_id === user?.id && <Select onValueChange={handleStatusChange}>
                <SelectTrigger className={`w-full px-5 py-5 ${job.isOpen ? "bg-green-950" : "bg-red-950"}`}>
                    <SelectValue placeholder={"Hiring Status " + (job?.isOpen ? "(Open)" : "(Closed)")} />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem value="open">OPEN</SelectItem>
                        <SelectItem value="closed">CLOSED</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>}

            <h2 className="text-2xl sm:text-3xl font-bold">About the job</h2>
            <p className="sm:text-lg">{job?.description}</p>

            <h2 className="text-2xl sm:text-3xl font-bold">What we are looking for</h2>
            <MarkdownEditor.Markdown source={job?.requirements} className="bg-transparent! sm:text-lg" height="200px" />


            {/* render applications */}
            {job?.recruiter_id !== user?.id && <ApplyJobDrawer
                job={job}
                user={user}
                fetchJob={fnJob}
                applied={job?.applications?.find((ap) => ap.candidate_id === user.id)}
            />}

            {job?.applications?.length > 0 && job?.recruiter_id === user?.id &&
                <div className="flex flex-col gap-4">
                    <h2 className="text-2xl sm:text-3xl font-bold">Applications</h2>
                    {job?.applications.map((application) => {
                        return <ApplicationCard
                            key={application.id}
                            application={application}
                        />
                    })}
                </div>}
        </div>
    )
}
export default JobPage