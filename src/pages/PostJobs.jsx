import { getCompanies } from "@/api/apiCompanies"
import { addNewJob } from "@/api/apiJobs"
// import AddCompany from "@/components/addCompany"
import AddCompanyDrawer from "@/components/AddCompanyDrawer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import useFetch from "@/hooks/usefetch"
import { useUser } from "@clerk/react"
import { zodResolver } from "@hookform/resolvers/zod"
import MarkdownEditor from "@uiw/react-markdown-editor"
import { State } from "country-state-city"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { Navigate, useNavigate } from "react-router-dom"
import { BarLoader } from "react-spinners"
import z from "zod"

const schema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    location: z.string().min(1, { message: "Select a location" }),
    company_id: z.string().min(1, { message: "Select or Add a new company" }),
    requirements: z.string().min(1, { message: "Requirements is required" }),
})

const PostJobs = () => {

    const { register, control, handleSubmit, formState: { errors }, } = useForm({
        defaultValues: {
            location: "",
            company_id: "",
            requirements: "",
        },
        resolver: zodResolver(schema),
    })

    const { isLoaded, user } = useUser();
    const navigate = useNavigate()
    const { fn: fnCompanies, data: companies, loading: loadingCompanies } = useFetch(getCompanies);

    useEffect(() => {
        if (isLoaded) fnCompanies();
    }, [isLoaded]);

    const {
        loading: loadingCreateJob,
        error: errorCreateJob,
        data: dataCreateJob,
        fn: fnCreateJob,
    } = useFetch(addNewJob);

    const onSubmit = (data) => {
        fnCreateJob({ ...data, recruiter_id: user.id, isOpen: true, })
    }

    useEffect(() => {
        if (dataCreateJob?.length > 0) navigate('/jobs')
    }, [loadingCreateJob])


    if (user?.unsafeMetadata?.role !== "recruiter") {
        return <Navigate to="/jobs" />
    }

    if (!isLoaded || loadingCompanies) {
        return <BarLoader className="mb-4" width="100%" color="#F4F4F5" />;
    }
    return (
        <div>
            <h1 className="gradient-title font-extrabold text-6xl sm:text-5xl lg:text-7xl text-center pb-6 sm:pb-8">Post a Job</h1>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-5 p-3 sm:p-4 pb-0 max-w-5xl mx-auto"
            >
                <Input placeholder="Job TItle" {...register("title")} className="w-full h-12 sm:h-14 px-4 text-base sm:text-lg bg-zinc-900 border border-zinc-700 text-zinc-100 focus:ring-0 focus:border-zinc-500" />
                {errors.title && <p className="text-red-500">{errors.title.message}</p>}

                <Textarea
                    placeholder="Job Description"
                    {...register("description")}
                    className="w-full min-h-35 px-4 py-3 text-base sm:text-lg bg-zinc-900 border border-zinc-700 text-zinc-100 focus:ring-0 focus:border-zinc-500"
                />
                {errors.description && (
                    <p className="text-red-500">{errors.description.message}</p>
                )}
                <div className="flex flex-col lg:flex-row gap-4 items-stretch">
                    <Controller
                        name="location"
                        control={control}
                        render={({ field }) => {
                            return <Select value={field.value} onValueChange={field.onChange} >
                                <SelectTrigger className="w-full h-12 sm:h-14 px-4 text-sm sm:text-base bg-zinc-900 border border-zinc-700 text-zinc-100 focus:ring-0 focus:border-zinc-500">
                                    <SelectValue placeholder="Filter by Location" />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-700 text-zinc-100">
                                    <SelectGroup>
                                        {State.getStatesOfCountry("IN").map(({ name }) => (
                                            <SelectItem key={name} value={name} className="hover:bg-zinc-800 focus:bg-zinc-800">
                                                {name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        }} />
                    <Controller
                        name="company_id"
                        control={control}
                        render={({ field }) => {
                            return <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="w-full h-12 sm:h-14 px-4 text-sm sm:text-base bg-zinc-900 border border-zinc-700 text-zinc-100 focus:ring-0 focus:border-zinc-500">
                                    <SelectValue placeholder="Filter by Company" >
                                        {field.value ? companies?.find((com) => com.id === Number(field.value))?.name : "Company"}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-700 text-zinc-100">
                                    <SelectGroup>
                                        {companies?.map(({ name, id }) => (
                                            <SelectItem key={id} value={String(id)} className="hover:bg-zinc-800 focus:bg-zinc-800">
                                                {name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        }} />

                    <div className="w-full lg:w-auto">
                    <AddCompanyDrawer fetchCompanies={fnCompanies} />
                    </div>

                </div>
                {errors.location && (
                    <p className="text-red-500">{errors.location.message}</p>
                )}
                {errors.company_id && (
                    <p className="text-red-500">{errors.company_id.message}</p>
                )}
                <Controller
                    name="requirements"
                    control={control}
                    render={({ field }) => (
                        <div className="overflow-hidden rounded-lg border border-zinc-700">
                            <MarkdownEditor
                                value={field.value}
                                onChange={field.onChange}
                                height={300}
                            />
                        </div>
                    )}
                />
                {errors.requirements && (
                    <p className="text-red-500">{errors.requirements.message}</p>
                )}
                {errorCreateJob && (
                    <p className="text-red-500">{errorCreateJob.message}</p>
                )}
                {loadingCreateJob && <BarLoader className="mb-4" width="100%" color="#F4F4F5" />}
                <Button variant="blue" size="xl" type="submit" className="mt-2">Submit</Button>
            </form >
        </div >
    )
}
export default PostJobs