import { getCompanies } from "@/api/apiCompanies";
import { getJobs } from "@/api/apiJobs";
import JobCard from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import useFetch from "@/hooks/usefetch";
import { useUser } from "@clerk/react";
import { State } from "country-state-city";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";

const JobListings = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [location, setLocation] = useState("");
    const [company_id, setCompany_id] = useState("");
    const { isLoaded } = useUser();

    const {
        fn: fnJobs,
        data: jobs,
        loading: loadingJobs,
    } = useFetch(getJobs, { location, company_id, searchQuery });

    const { fn: fnCompanies, data: companies } = useFetch(getCompanies);

    useEffect(() => {
        if (isLoaded) fnCompanies();
    }, [isLoaded]);

    useEffect(() => {
        if (isLoaded) fnJobs();
    }, [isLoaded, location, company_id, searchQuery]);


    if (!isLoaded) {
        return <BarLoader className="mb-4" width="100%" color="#F4F4F5" />;
    }

    const handleSearch = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const query = formData.get("search-query");
        if (query) setSearchQuery(query);
    };

    const clearFilters = () => {
        setCompany_id("");
        setLocation("");
        setSearchQuery("");
    };

    return (
        <div className="container mx-auto px-6 py-8">
            <h1 className="gradient-title font-extrabold text-6xl md:text-7xl lg:text-8xl text-center pb-10">
                Latest Jobs
            </h1>

            {/* Search bar */}
            <form
                onSubmit={handleSearch}
                className="flex w-full gap-2 items-center mb-3 h-12"
            >

                <Input type="text" name="search-query" placeholder="Search jobs by Title..." className="h-12 text-base px-5 rounded-xl  bg-zinc-900 border border-zinc-700  text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-0 focus-visible:border-zinc-800"/>
                <Button
                    variant="blue"
                    className="h-12 px-10 shrink-0 text-2xl"
                    type="submit"
                >
                    Search
                </Button>
            </form>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 w-full items-center py-2">

                {/* Location */}
                <div className="flex-1 w-full">
                    <Select value={location} onValueChange={setLocation}>
                        <SelectTrigger className="w-full h-10 px-4 py-7 text-2xl bg-zinc-900 border border-zinc-700 text-zinc-100 focus:ring-0 focus:border-zinc-500">
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
                </div>

                {/* Company */}
                <div className="flex-1 w-full">
                    <Select value={company_id} onValueChange={setCompany_id}>
                        <SelectTrigger className="w-full h-10 px-4 py-7 text-2xl bg-zinc-900 border border-zinc-700 text-zinc-100 focus:ring-0 focus:border-zinc-500">
                            <SelectValue placeholder="Filter by Company" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-700 text-zinc-100">
                            <SelectGroup>
                                {companies?.map(({ name, id }) => (
                                    <SelectItem key={id} value={id} className="hover:bg-zinc-800 focus:bg-zinc-800">
                                        {name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex-[0.6] w-full sm:w-auto">
                    <Button
                        variant="red"
                        className="w-full px-6 py-8 text-2xl"
                        onClick={clearFilters}
                    >
                        Clear Filters
                    </Button>
                </div>
            </div>

            {loadingJobs && (
                <BarLoader className="mb-4" width="100%" color="#F4F4F5" />
            )}

            {loadingJobs === false && (
                <div className="mt-10 grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {jobs?.length ? (
                        jobs.map((job) => (
                            <JobCard
                                key={job.id}
                                job={job}
                                savedInit={job?.saved_jobs?.length > 0}
                            />
                        ))
                    ) : (
                        <p className="text-zinc-400">No jobs found 😓</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default JobListings;