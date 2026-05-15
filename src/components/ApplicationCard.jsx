import { Boxes, BriefcaseBusiness, Download, SchoolIcon } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import useFetch from "@/hooks/usefetch";
import { updateApplicationStatus } from "@/api/apiApplications";
import { BarLoader } from "react-spinners";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const ApplicationCard = ({ application, isCandidate = false }) => {

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = application?.resume;
        link.target = "_blank";
        link.click();
    }

    const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(updateApplicationStatus, {
        job_id: application.job_id,
    });

    const handleStatusChange = (status) => {
        fnHiringStatus(status);
    }

    return (
        <Card>
            {loadingHiringStatus && <BarLoader width="100%" color="#F4F4F5" />}
            <CardHeader>
                <CardTitle className="flex justify-between font-bold text-2xl">
                    {isCandidate ? `${application?.job?.title} at ${application?.job?.company?.name}` : application?.name}
                    <Download
                        size={18}
                        className="bg-white text-black rounded-full h-8 w-8 p-1.5 cursor-pointer"
                        onClick={handleDownload}
                    />
                </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-4 flex-1">
                <div className="flex flex-col md:flex-row justify-between text-xl">
                    <div className="flex gap-2 items-center"><BriefcaseBusiness size={20} />{application?.experience} years of experience</div>
                    <div className="flex gap-2 items-center"><SchoolIcon size={20} />{application?.education} </div>
                    <div className="flex gap-2 items-center"><Boxes size={20} />{application?.skills} </div>
                </div>
                <hr />
            </CardContent>

            <CardFooter className="flex justify-between">
                <span>{new Date(application?.created_at).toLocaleString()}</span>
                {isCandidate ? <span className="capitalize font-bold">Status : {application?.status}</span> : (
                    <Select onValueChange={handleStatusChange} defaultValue={application.status}>
                        <SelectTrigger className="w-52">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="applied">Applied</SelectItem>
                                <SelectItem value="interviewing">Interviewing</SelectItem>
                                <SelectItem value="hired">Hired</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>)}
            </CardFooter>
        </Card>
    )
}
export default ApplicationCard

