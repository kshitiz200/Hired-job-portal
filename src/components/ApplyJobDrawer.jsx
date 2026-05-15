import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Label } from "./ui/label"
import z from "zod"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import useFetch from "@/hooks/usefetch"
import { applyToJob } from "@/api/apiApplications"
import { BarLoader } from "react-spinners"

const schema = z.object({
    experience: z
        .number()
        .min(0, { message: "Experience must be at least 0" })
        .int(),
    skills: z.string().min(1, { message: "Skills are required" }),
    education: z.enum(["Intermediate", "Graduate", "Post Graduate"], { message: "Education is required" }),
    resume: z.any().refine(file => file[0] && (
        file[0].type === "application/pdf" || file[0].type === "application/msword"),
        { message: "Only PDFs and word documents are allowed" }),
});



const ApplyJobDrawer = ({ job, user, applied = false, fetchJob }) => {

    const { register, handleSubmit, control, formState: { errors }, reset, } = useForm({
        resolver: zodResolver(schema),
    })

    const {
        loading: loadingApply,
        error: errorApply,
        fn: fnApply,
    } = useFetch(applyToJob)

    const onSubmit = (data) => {
        fnApply({
            ...data,
            job_id: job.id,
            candidate_id: user.id,
            name: user.fullName,
            status: "applied",
            resume: data.resume[0],
        }).then(() => {
            fetchJob();
            reset();
        })
    };

    return (
        <Drawer open={applied ? false : undefined}>
            <DrawerTrigger asChild>
                <Button variant={job?.isOpen && !applied ? "blue" : "red"} disabled={!job?.isOpen || applied} size="xl">
                    {job?.isOpen ? (applied ? "Applied" : "Apply") : "Hiring Closed"}
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Apply for {job?.title} at {job?.company?.name} </DrawerTitle>
                    <DrawerDescription>Please fill the form below</DrawerDescription>
                </DrawerHeader>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="
    flex flex-col gap-4 
    p-6 mx-6 mb-6
    border border-zinc-800
    rounded-xl
    bg-zinc-900/60
    shadow-lg
    backdrop-blur-sm
  "
                >
                    <Input
                        type="number"
                        placeholder="Years of Experience"
                        className="h-12 bg-zinc-950 border border-white text-white placeholder:text-zinc-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-white"
                        {...register("experience", { valueAsNumber: true })}
                    />
                    {errors.skills && (
                        <p className="text-red-500">{errors.skills.message}</p>
                    )}

                    <Input
                        type="text"
                        placeholder="Skills (Comma Separated)"
                        className="h-12 bg-zinc-950 border border-white text-white placeholder:text-zinc-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-white"                        {...register("skills")}
                    />
                    {errors.skills && (
                        <p className="text-red-500">{errors.skills.message}</p>
                    )}

                    <Controller
                        name="education"
                        control={control}
                        render={({ field }) => (
                            <RadioGroup
                                onValueChange={field.onChange}
                                className="inline-flex flex-wrap gap-3 rounded-xl border border-white bg-zinc-950/80 p-4 w-fit focus-visible:ring-0 focus-visible:ring-offset-0"
                            >
                                <div className="w-fit flex items-center gap-2 rounded-md border border-white bg-zinc-900 px-3 py-2 hover:bg-zinc-800 transition-all">
                                    <RadioGroupItem
                                        value="Intermediate"
                                        id="intermediate"
                                        className="border-white text-white focus-visible:ring-0 focus-visible:ring-offset-0"
                                    />
                                    <Label htmlFor="intermediate" className="cursor-pointer text-white">
                                        Intermediate
                                    </Label>
                                </div>

                                <div className="w-fit flex items-center gap-2 rounded-md border border-white bg-zinc-900 px-3 py-2 hover:bg-zinc-800 transition-all">
                                    <RadioGroupItem
                                        value="Graduate"
                                        id="graduate"
                                        className="border-white text-white focus-visible:ring-0 focus-visible:ring-offset-0"
                                    />
                                    <Label htmlFor="graduate" className="cursor-pointer text-white">
                                        Graduate
                                    </Label>
                                </div>

                                <div className="w-fit flex items-center gap-2 rounded-md border border-white bg-zinc-900 px-3 py-2 hover:bg-zinc-800 transition-all">
                                    <RadioGroupItem
                                        value="Post Graduate"
                                        id="post-graduate"
                                        className="border-white text-white focus-visible:ring-0 focus-visible:ring-offset-0"
                                    />
                                    <Label htmlFor="post-graduate" className="cursor-pointer text-white">
                                        Post Graduate
                                    </Label>
                                </div>
                            </RadioGroup>
                        )}
                    />
                    {errors.education && (
                        <p className="text-red-500">{errors.education.message}</p>
                    )}

                    <Input
                        type="file"
                        accept=".pdf, .doc , .docx"
                        className="h-9 bg-zinc-950 border file:text-gray-500 border-white text-white placeholder:text-zinc-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-white"
                        {...register("resume")}
                    />
                    {errors.resume && (
                        <p className="text-red-500">{errors.resume.message}</p>
                    )}
                    {errorApply?.message && (
                        <p className="text-red-500">{errorApply?.message}</p>
                    )}
                    {loadingApply && <BarLoader width="100%" color="#F4F4F5" />}
                    <Button>Apply</Button>
                </form>
                <DrawerFooter>
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
export default ApplyJobDrawer