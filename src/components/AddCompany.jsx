import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "./ui/drawer";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const schema = z.object({
    name: z.string().min(1, { message: "Company name is required" }),
    logo: z.any().refine((file) => file[0] && (file[0].type === "image/png" || file[0].type === "image/jpeg"),
        { message: "Only Images are allowed" }),
});

const AddCompany = ({ fetchCompanies }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: zodResolver(schema) })

    const onSubmit = async (data) => {
        // handle submit logic here
        console.log(data);
        await fetchCompanies(); // refresh companies after adding
    }

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button variant="secondary" type="button">
                    Add Company
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Add Company</DrawerTitle>
                    <DrawerDescription>
                        Create a new company entry.
                    </DrawerDescription>
                </DrawerHeader>

                {/* Form fields go HERE, between header and footer */}
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 px-4">
                    <Input
                        placeholder="Company Name"
                        {...register("name")}
                        className="bg-zinc-900 border border-zinc-700 text-zinc-100"
                    />
                    {errors.name && <p className="text-red-500">{errors.name.message}</p>}

                    <Input
                        type="file"
                        accept="image/png, image/jpeg"
                        {...register("logo")}
                        className="bg-zinc-900 border border-zinc-700 text-zinc-100"
                    />
                    {errors.logo && <p className="text-red-500">{errors.logo.message}</p>}

                    <DrawerFooter>
                        <Button type="submit">Submit</Button>
                        <DrawerClose asChild>
                            <Button variant="outline" type="button">Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </form>
            </DrawerContent>
        </Drawer>
    )
}

export default AddCompany