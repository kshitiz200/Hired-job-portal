import { getApplications } from "@/api/apiApplications"
import useFetch from "@/hooks/usefetch"
import { useUser } from "@clerk/react"
import { useEffect } from "react"
import { BarLoader } from "react-spinners"
import ApplicationCard from "./ApplicationCard"

const CreatedApplications = () => {

    const { user } = useUser()

    const {
        loading: loadingApplications,
        data: applications,
        fn: fnApplications,
    } = useFetch(getApplications, { user_id: user?.id })

    useEffect(() => {
        fnApplications();
    }, [])

    if (loadingApplications) {
        return <BarLoader className="mb-4" width="100%" color="#F4F4F5" />
    }
    return (
        <div className="flex flex-col gap-2">

            
            {applications?.map((application) => {
                return <ApplicationCard
                    key={application.id}
                    application={application}
                    isCandidate
                />
            })}
        </div>
    )
}
export default CreatedApplications