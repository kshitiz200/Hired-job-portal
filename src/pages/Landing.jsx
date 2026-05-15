import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { Link } from "react-router-dom"
import companies from "@/data/companies.json"
import faq from "@/data/faq.json"
import Autoplay from "embla-carousel-autoplay"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const Landing = () => {
    return (
        <main className="flex flex-col gap-10 sm:gap-20 py-10 sm:py-20">
            <section className="text-center">
                <h1 className="gradient-title text-4xl font-extrabold sm:text-6xl lg:text-9xl tracking-tighter py-4 text-center">
                    Find Your Dream Job{""}
                    <span className="flex items-center justify-center gap-4 sm:gap-6">and get{" "}
                        <img
                            src="/Logo.png"
                            alt="Logo"
                            className="h-20 sm:h-30 lg:h-40"
                        />
                    </span>
                </h1>
                <p className="text-gray-300 sm:mt-4 text-xl sm:text-xl">
                    Explore thousands of job opportunities or connect with top talent.
                </p>
            </section>

            {/* {button} */}

            <div className="flex gap-6 justify-center">
                <Link to="/jobs">
                    <Button size="xl" variant="blue">Find Jobs</Button>
                </Link>
                <Link to="/post-jobs">
                    <Button size="xl" variant="red">Post a Job</Button>
                </Link>
            </div>

            {/* carousel */}

            <Carousel
                plugins={[Autoplay({ delay: 2000 })]}
                className="w-full py-10"
            >
                <CarouselContent className="flex gap-5 sm:gap-20 items-center justify-start ">
                    {companies.map(({ name, id, path }) => {
                        return (
                            <CarouselItem
                                key={id}
                                className="basis-1/2 sm:basis-1/3 lg:basis-1/6"
                            >
                                <div className="flex items-center justify-center">
                                    <img
                                        src={path}
                                        alt={name}
                                        className="h-9 sm:h-14 p-1 object-contain"
                                    />
                                </div>
                            </CarouselItem>
                        );
                    })}
                </CarouselContent>
            </Carousel>

            {/* banner */}
            <img src="/banner.png" alt="" className="w-full" />
            <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <Card className="p-10 text-center bg-white/5 border-white/10 backdrop-blur-md">
                    <CardHeader>
                        <CardTitle className="text-3xl sm:text-4xl font-bold text-white">
                            For Job Seekers
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
                            Search and apply for opportunities that match your skills,
                            goals, and career ambitions.
                        </p>
                    </CardContent>
                </Card>

                <Card className="p-10 text-center bg-white/5 border-white/10 backdrop-blur-md">
                    <CardHeader>
                        <CardTitle className="text-3xl sm:text-4xl font-bold text-white">
                            For Employers
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
                            Discover talented candidates, streamline hiring,
                            and build your dream team faster.
                        </p>
                    </CardContent>
                </Card>

            </section>

            {/* accordion */}
            <section>
                <Accordion
                    type="single"
                    collapsible
                    className="w-full bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6"
                >
                    {faq.map((faq, index) => {
                        return (
                            <AccordionItem
                                key={index}
                                value={`item-${index + 1}`}
                                className="border-b border-white/10 py-1 last:border-none"
                            >
                                <AccordionTrigger className="text-left text-xl sm:text-2xl font-semibold text-white hover:no-underline">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="pt-4 text-lg sm:text-xl text-gray-300 leading-relaxed">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        );
                    })}
                </Accordion>
            </section>
        </main>
    )
}
export default Landing