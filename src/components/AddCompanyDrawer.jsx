import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "./ui/drawer";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import useFetch from "@/hooks/usefetch";
import { addNewCompany } from "@/api/apiCompanies";
import { BarLoader } from "react-spinners";
import { useEffect } from "react";

const schema = z.object({
    name: z.string().min(1, { message: "Company name is required" }),
    logo: z.any().refine((file) => file[0] && (file[0].type === "image/png" || file[0].type === "image/jpeg"),
        { message: "Only Images are allowed" }),
});

const AddCompanyDrawer = ({ fetchCompanies }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: zodResolver(schema) })

    const onSubmit = async (data) => {
        fnAddCompany({
            ...data,
            logo: data.logo[0]
        })
    }

    const {
        loading: loadingAddCompany,
        error: errorAddCompany,
        data: dataAddCompany,
        fn: fnAddCompany,
    } = useFetch(addNewCompany);

    useEffect(() => {
        if (dataAddCompany?.length > 0) fetchCompanies();
    }, [dataAddCompany]);

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button variant="secondary" type="button" size="sm">
                    Add Company
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Add a New Company</DrawerTitle>
                </DrawerHeader>
                <form className="flex gap-4 px-4 pb-0">
                    <Input
                        placeholder="Company Name"
                        {...register("name")}
                        className="bg-zinc-900 border border-zinc-700 text-zinc-100"
                    />

                    <Input
                        type="file"
                        accept="image/png, image/jpeg"
                        {...register("logo")}
                        className="bg-zinc-900 border border-zinc-700 text-zinc-100"
                    />
                    {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                    {errors.logo && <p className="text-red-500">{errors.logo.message}</p>}
                    {errorAddCompany?.message && (<p className="text-red-500">{errorAddCompany?.message}</p>)}
                    {loadingAddCompany && <BarLoader className="mb-4" width="100%" color="#F4F4F5" />}

                    <Button type="button" onClick={handleSubmit(onSubmit)} variant="red" className="w-40" >Add</Button>
                </form>

                <DrawerFooter>
                    <DrawerClose asChild>
                        <Button variant="secondary" type="button">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

export default AddCompanyDrawer