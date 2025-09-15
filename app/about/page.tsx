"use client";
import React from 'react'
import Image from "next/image";

export default function AboutPage() {
    return (
        <div className="">
            {/* About Header */}
            <section className="py-20 bg-primary text-primary-foreground">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold leading-tight drop-shadow-lg">
                        We put your first
                    </h1>
                    <p className="mt-6 text-lg max-w-3xl mx-auto text-primary-foreground/80 drop-shadow-md">
                        <strong>Quickshift is a leading LTL carrier</strong>
                    </p>

                    {/* 4 Column Text */}
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
                        <div className="p-6 rounded-lg shadow-lg bg-primary-foreground/10 border border-primary-foreground/20">
                            <h3 className="text-xl font-semibold mb-2 drop-shadow-md">Coast-to-coast</h3>
                            <p className="text-primary-foreground/80 text-sm drop-shadow-sm">
                                Our comprehensive network lets us serve customers across the U.S., Canada, Mexico and the Caribbean.
                            </p>
                        </div>
                        <div className="p-6 rounded-lg shadow-lg bg-primary-foreground/10 border border-primary-foreground/20">
                            <h3 className="text-xl font-semibold mb-2 drop-shadow-md">Tech-driven</h3>
                            <p className="text-primary-foreground/80 text-sm drop-shadow-sm">
                                Our proprietary technology and automated processes help optimize our operation so we can ship smarter, faster and more efficiently.
                            </p>
                        </div>
                        <div className="p-6 rounded-lg shadow-lg bg-primary-foreground/10 border border-primary-foreground/20">
                            <h3 className="text-xl font-semibold mb-2 drop-shadow-md">Growing</h3>
                            <p className="text-primary-foreground/80 text-sm drop-shadow-sm">
                                We&apos;re always looking to expand our reach, add new talent to help us grow, and become an even bigger part of our customers&apos; success.
                            </p>
                        </div>
                        <div className="p-6 rounded-lg shadow-lg bg-primary-foreground/10 border border-primary-foreground/20">
                            <h3 className="text-xl font-semibold mb-2 drop-shadow-md">Proven</h3>
                            <p className="text-primary-foreground/80 text-sm drop-shadow-sm">
                                With our strong records in safety and service, you can trust us with your most valuable assets.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* New Ways */}
            <section className="py-12 bg-muted">
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-5xl font-extrabold">
                        &ldquo;Creating new ways to put your freight first&rdquo;
                    </h2>
                    <p className="mt-6 text-lg max-w-3xl mx-auto text-muted-foreground">
                        We&apos;re always improving our network, capacity and technology, so we can serve every customer with excellence.
                    </p>
                </div>
            </section>

            {/* Leadership */}
            <section className="py-12">
                <div className="max-w-6xl mx-auto px-6 text-left">
                    <h2 className="text-3xl font-bold mb-4">Our Journey</h2>
                    <p className="text-lg text-muted-foreground mb-10">
                        From humble beginnings to becoming a trusted logistics partner, we&apos;ve grown with our drivers, technology, and commitment to excellence.
                    </p>

                    {/* 4-Column Image Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="bg-card rounded-lg shadow p-4 border">
                            <Image src="/images/Mario.jpeg" alt="CEO" width={300} height={192} className="w-full h-48 object-cover rounded mb-3" />
                            <h3 className="font-semibold">
                                <strong>CEO</strong><br />
                                Mario M.Mason
                            </h3>
                        </div>
                        <div className="bg-card rounded-lg shadow p-4 border">
                            <Image src="/images/kyle.jpeg" alt="COO" width={300} height={192} className="w-full h-48 object-cover rounded mb-3" />
                            <h3 className="font-semibold">
                                <strong>COO</strong><br />
                                Kyle Wiemans
                            </h3>
                        </div>
                        <div className="bg-card rounded-lg shadow p-4 border">
                            <Image src="/images/sharon.jpeg" alt="CFO" width={300} height={192} className="w-full h-48 object-cover rounded mb-3" />
                            <h3 className="font-semibold">
                                <strong>CFO</strong><br />
                                Sharon W. Strausbaugh
                            </h3>
                        </div>
                        <div className="bg-card rounded-lg shadow p-4 border">
                            <Image src="/images/adam.jpeg" alt="Team Member" width={300} height={192} className="w-full h-48 object-cover rounded mb-3" />
                            <h3 className="font-semibold">
                                Adam Davis
                            </h3>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-12 bg-muted">
                <div className="max-w-6xl mx-auto px-6 text-left">
                    <h2 className="text-5xl font-bold mb-4">Our values</h2>
                    <br />

                    {/* 2x3 Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="animated-border">
                            <div className="bg-card p-6 rounded-lg shadow border">
                                <h3 className="text-xl font-semibold mb-2">Overachieve for customers</h3>
                                <p className="text-muted-foreground">
                                    We&apos;ve created an LTL network equipped with national capacity, leading technology and a world-class team. And we&apos;re always building and improving.
                                </p>
                            </div>
                        </div>
                        <div className="animated-border">
                            <div className="bg-card p-6 rounded-lg shadow border">
                                <h3 className="text-xl font-semibold mb-2">Be safe</h3>
                                <p className="text-muted-foreground">
                                    We constantly work to improve the safety and well-being of our people. That means taking all the steps we can to use the safest protocols, technologies and equipment so that our customers do what we do: return home safely.
                                </p>
                            </div>
                        </div>
                        <div className="animated-border">
                            <div className="bg-card p-6 rounded-lg shadow border">
                                <h3 className="text-xl font-semibold mb-2">Be accountable</h3>
                                <p className="text-muted-foreground">
                                    We take pride in doing things the right way, which means speaking up when we see something, taking ownership and getting results. By providing accountability, integrity and transparency, we help make it easier for our customers to do business with us. And we know they can count on us to do right by them.
                                </p>
                            </div>
                        </div>
                        <div className="animated-border">
                            <div className="bg-card p-6 rounded-lg shadow border">
                                <h3 className="text-xl font-semibold mb-2">Always improve</h3>
                                <p className="text-muted-foreground">
                                    We&apos;re forward-thinking and always investing in our people, technology and network to deliver better results every day. Innovation runs deep in our veins, as we find new ways to improve our performance for customers, employees and stakeholders.
                                </p>
                            </div>
                        </div>
                        <div className="animated-border">
                            <div className="bg-card p-6 rounded-lg shadow border">
                                <h3 className="text-xl font-semibold mb-2">Respect each other</h3>
                                <p className="text-muted-foreground">
                                    We work hard to ensure our people feel respected and empowered. We run a collaborative culture that recognizes talent, rewards diversity and makes sure every teammate has a voice.
                                </p>
                            </div>
                        </div>
                        <div className="animated-border">
                            <div className="bg-card p-6 rounded-lg shadow border">
                                <h3 className="text-xl font-semibold mb-2">Be world-class in every way</h3>
                                <p className="text-muted-foreground">
                                    We&apos;re eager to be #1 in LTL. With competitive and direct to win, which means we don&apos;t settle for getting there over time. We stay focused on our customers and our shared vision.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <style jsx>{`
                    .animated-border {
                        position: relative;
                        border-radius: 0.5rem;
                        padding: 1px;
                        background: linear-gradient(270deg, #d1d5db, #9ca3af, #d1d5db);
                        background-size: 400% 400%;
                        animation: moveBorder 6s linear infinite;
                    }
                    
                    @keyframes moveBorder {
                        0% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                        100% { background-position: 0% 50%; }
                    }
                `}</style>
            </section>

            {/* Industry */}
            <section className="py-12">
                <div className="max-w-6xl mx-auto px-6 text-left">
                    <h2 className="text-4xl font-bold mb-8">Recognized as an industry leader</h2>

                    {/* 3 Cards */}
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-card p-6 rounded-lg shadow border">
                            <h3 className="text-xl font-semibold mb-2">Named U.S. Carrier Partner of the Year by Geodis/IBM, 2021, 2022, 2023</h3>
                        </div>
                        <div className="bg-card p-6 rounded-lg shadow border">
                            <h3 className="text-xl font-semibold mb-2">Top 100 Trucker by Internet Logistics, 2018, 2019, 2020, 2021, 2022, 2023</h3>
                        </div>
                        <div className="bg-card p-6 rounded-lg shadow border">
                            <h3 className="text-xl font-semibold mb-2">Named to the FreightTech 100 by FreightWaves, 2018, 2019, 2020, 2021, 2022, 2023</h3>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
