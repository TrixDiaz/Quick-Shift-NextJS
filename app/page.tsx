"use client";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      {/* About Header */}
      <section className="py-20 bg-cover bg-center bg-no-repeat relative" style={{ backgroundImage: "url('/images/ship2.jpg')" }}>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative max-w-8xl mx-auto px-10 text-right">
          <h1 className="text-4xl md:text-7xl font-bold text-white leading-tight drop-shadow-lg">
            Join the team
            <br />Movement with
            <br />Trusted Partnerships
          </h1>
          <div className="mt-8">
            <Link href="/services" className="inline-block px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-xl shadow-lg hover:bg-blue-700 transition-all duration-300">
              Apply Now
            </Link>
          </div>
          <div className="mt-10 flex justify-end">
            <div className="bg-gray-800 p-4 rounded-xl w-fit">
              <Image src="/images/partners.png" alt="Partner Logos" width={800} height={200} className="w-full max-w-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="relative py-12 overflow-hidden">
        <div className="absolute inset-0 animate-gradient"></div>
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-white/20 backdrop-blur-md rounded-xl shadow-lg">
              <h4 className="text-xl font-semibold text-white">
                &ldquo;Together, we achieve more. Your goals, our commitment. Join the movement. Smart solutions, from start to finish.&rdquo;
              </h4>
            </div>
            <div className="p-6 bg-white/20 backdrop-blur-md rounded-xl shadow-lg">
              <h4 className="text-xl font-semibold text-white">
                &ldquo;Where challenges meet solutions, and ideas turn into impact. Be part of the change. Empowering businesses, every day.&rdquo;
              </h4>
            </div>
          </div>
        </div>
        <style jsx>{`
          .animate-gradient {
            background: linear-gradient(-45deg, #f36202, #FBB040, #eccfa3, #FBB040);
            background-size: 400% 400%;
            animation: gradientMove 12s ease infinite;
            z-index: 0;
          }
          
          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}</style>
      </section>

      {/* Services Preview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-center text-5xl font-bold">
            DRIVE WITH QUICKSHIFT
            <br />
            <span className="text-2xl font-normal">Driven by skill, enhanced by technology that works for you.</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <Link href="/services#logistics" className="card group bg-card rounded-2xl shadow-md overflow-hidden transition transform hover:-translate-y-2 hover:shadow-xl border">
              <div className="overflow-hidden">
                <Image src="/images/cdl.jpg" alt="Logistics Solutions" width={400} height={192} className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold">CDL&apos;s Drivers</h3>
                <p className="text-muted-foreground mt-2">
                  We are in need for licensed CDL drivers to power our fleet. Competitive pay, top-notch equipment, and a dynamic team await
                </p>
              </div>
            </Link>

            <Link href="/services#technology" className="card group bg-card rounded-2xl shadow-md overflow-hidden transition transform hover:-translate-y-2 hover:shadow-xl border">
              <div className="overflow-hidden">
                <Image src="/images/del1.jpg" alt="Technology Tools" width={400} height={192} className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold">Class D Driver</h3>
                <p className="text-muted-foreground mt-2">
                  Join QuickShift as a Class D licensed driver and be a key player in our transportation network. We offer steady schedules, competitive pay, and the chance to grow in a fast-paced, innovative environment
                </p>
              </div>
            </Link>

            <Link href="/careers" className="card group bg-card rounded-2xl shadow-md overflow-hidden transition transform hover:-translate-y-2 hover:shadow-xl border">
              <div className="overflow-hidden">
                <Image src="/images/del5.jpg" alt="Driver Careers" width={400} height={192} className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold">Competitive Pay</h3>
                <p className="text-muted-foreground mt-2">
                  We reward experienced drivers with benefits and schedules that get you home each night. New drivers can start satisfying careers through our nationwide, tuition-free driver schools.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="relative py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold mb-4">Trusted By Our Customers</h3>
          <p className="text-muted-foreground mb-10">
            The greatest success is the trust of our customers — earned, not given.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-md border">
              <Image src="/images/ara.png" alt="Aramex Logo" width={160} height={160} className="w-40 h-40 mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">
                &ldquo;QuickShift Lines has consistently delivered exceptional service, meeting our tight deadlines with precision.&rdquo;
              </h4>
              <p className="text-muted-foreground">
                <strong>aramex</strong><br />
                Operations Director
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-md border">
              <Image src="/images/Dash.png" alt="DoorDash Logo" width={160} height={160} className="w-40 h-40 mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">
                &ldquo;Their commitment to quality and customer satisfaction sets QuickShift Lines apart in the industry.&rdquo;
              </h4>
              <p className="text-muted-foreground">
                <strong>Doordash</strong><br />
                CEO
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-md border">
              <Image src="/images/amazon.png" alt="Amazon Logo" width={160} height={160} className="w-40 h-40 mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">
                &ldquo;Business is all about finding quality partners. Amazon Prime is proud to have QuickShift Lines on our side.&rdquo;
              </h4>
              <p className="text-muted-foreground">
                <strong>Amazon</strong><br />
                Logistics Manager
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Background image section */}
      <div className="relative w-full">
        <Image src="/images/part.png" alt="Background" width={1200} height={400} className="w-full object-contain" />
      </div>

      {/* Hero */}
      <header className="relative overflow-hidden bg-gradient-to-br from-primary/90 to-primary/70">
        <svg className="absolute opacity-30 -right-12 -top-12" width="360" height="360" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M37.7,-58.5C49.7,-50.7,61.8,-42.3,66.7,-30.6C71.5,-18.9,69.2,-3.8,65.8,10.3C62.3,24.4,57.7,37.5,48.9,49.4C40.1,61.2,27.1,71.8,12.7,74.1C-1.7,76.4,-17.4,70.4,-31.7,62.6C-45.9,54.8,-58.8,45.1,-63.9,32.1C-69,19.2,-66.4,3,-61.4,-10.2C-56.4,-23.5,-49,-33.9,-39.9,-42.2C-30.7,-50.6,-19.9,-56.9,-7.8,-63.1C4.3,-69.3,17.6,-75.3,29.1,-71.8C40.5,-68.4,50.1,-55.6,37.7,-58.5Z" transform="translate(100 100)" />
        </svg>
        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-2 gap-10 items-center">
          <div className="text-primary-foreground">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">Coast-to-coast network</h1>
            <p className="mt-4 text-lg text-primary-foreground/80">We&apos;re one of the largest providers in North America, with coverage that spans the US, Canada, Mexico and the Caribbean.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/services" className="border-2 border-primary-foreground text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary-foreground hover:text-primary transition-colors">
                Apply for a job
              </Link>
            </div>
          </div>
          <div className="bg-primary-foreground/10 rounded-2xl p-6 shadow-xl border border-primary-foreground/20">
            <ul className="grid grid-cols-2 gap-4 text-primary-foreground">
              <li className="stat-card">
                <div className="text-3xl font-bold">13,000</div>
                <div className="text-sm">Drivers</div>
              </li>
              <li className="stat-card">
                <div className="text-3xl font-bold">43,000</div>
                <div className="text-sm">Tractors & Trailers</div>
              </li>
              <li className="stat-card">
                <div className="text-3xl font-bold">99%</div>
                <div className="text-sm">US ZIP Coverage</div>
              </li>
              <li className="stat-card">
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-sm">Support</div>
              </li>
            </ul>
          </div>
        </div>
      </header>

      {/* Mission Critical Section */}
      <section className="relative bg-muted py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl font-bold mb-4">Transportation is mission-critical to your business</h2>
              <p>
                <strong>So we put your freight first</strong><br />
                We&apos;ve created a transport network equipped with national capacity, leading technology and a world-class team. And we&apos;re always building and improving.
              </p>
            </div>
            <div>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>On-time pick-up and delivery</li>
                <li>Damage-free freight shipping</li>
                <li>Accurate invoices</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="relative py-16">
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-6">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-bold mb-4">
                Technology for efficiency
              </h2>
              <p className="text-muted-foreground">
                <strong>Make your shipping more efficient and your experience simpler, with technology that works for you.</strong>
              </p>
            </div>
            <div className="flex-shrink-0">
              <Link href="/services" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-3 rounded-lg transition-colors">
                Apply now!
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative aspect-square border-2 border-border rounded-lg overflow-hidden shadow-lg">
              <Image src="/images/anal.jpeg" alt="Freight Network" width={400} height={400} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-start justify-start p-4">
                <p className="text-white text-lg font-semibold">
                  13 million shipments moved annually by our linehaul team<br /><br />
                  Easy-to-use shipper tools:<br />
                  Tracking and shipment management
                </p>
              </div>
            </div>
            <div className="relative aspect-square border-2 border-border rounded-lg overflow-hidden shadow-lg">
              <Image src="/images/logi.jpeg" alt="Teamwork" width={400} height={400} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-start justify-start p-4">
                <p className="text-white text-lg font-semibold">
                  650 million linehaul miles run per year<br /><br />
                  Data science and machine learning.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accountable Section */}
      <section className="relative bg-muted py-16">
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-6">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-bold mb-4">
                Accountable to our customers
              </h2>
              <p className="text-muted-foreground">
                <strong>Our local reps know your market and your industry. They work with you to deliver services that meet your specific timing and handling needs.</strong>
              </p>
            </div>
            <div className="flex-shrink-0">
              <Link href="/services" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-3 rounded-lg transition-colors">
                Apply now!
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative aspect-square border-2 border-border rounded-lg overflow-hidden shadow-lg">
              <Image src="/images/Mario.jpeg" alt="Fast Quotes" width={400} height={400} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-start justify-start p-4">
                <p className="text-white text-lg font-semibold">
                  Our team&apos;s commitment...<br /><br />
                  &ldquo;We provide a full-service solution, supporting our customers every step of the way from start to finish in the freight process—no matter the challenge&rdquo;
                  <br /><br />
                  - Mario M.Mason, CEO at QuickShift
                </p>
              </div>
            </div>
            <div className="relative aspect-square border-2 border-border rounded-lg overflow-hidden shadow-lg">
              <Image src="/images/sharon.jpeg" alt="Nationwide" width={400} height={400} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-start justify-start p-4">
                <p className="text-white text-lg font-semibold">
                  ...creates value for customers<br /><br />
                  &ldquo;Our strength lies in our proactive problem-solving approach. We reached out to our partners, identified key insights from their data, and demonstrated how we could help by putting in the effort upfront.&rdquo;
                  <br /><br />
                  — Sharon W. Strausbaugh, CFO
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Give Back Section */}
      <section className="relative py-16">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              Giving Back
            </h2>
            <p className="text-muted-foreground mb-8">
              We believe that by joining together, we are able to bring goodness into this world. That&apos;s why Quickshift Lines, Inc. strongly supports the spread of food, supplies and resources in many needing countries and communities. While working with several non-profit organizations, we were able to bring help to Ukraine, Ethiopia, Mexico, Africa, Asia, Estonia and Russia. Read about our recent trips on these resources:
            </p>

            <div className="flex flex-wrap gap-4">
              <div className="px-6 py-3 border-2 border-primary text-primary font-semibold rounded-lg shadow hover:scale-105 transition">
                Flame of Fire
              </div>
              <div className="px-6 py-3 border-2 border-green-500 text-green-500 font-semibold rounded-lg shadow hover:scale-105 transition">
                DESTINY CENTER
              </div>
              <div className="px-6 py-3 border-2 border-yellow-500 text-yellow-500 font-semibold rounded-lg shadow hover:scale-105 transition">
                Act of Love
              </div>
            </div>
          </div>

          <div className="relative grid grid-cols-2 gap-4">
            <Image src="/images/drive.jpg" alt="Freight Network" width={400} height={192} className="w-full h-48 object-cover rounded-xl shadow-lg col-span-2" />
            <Image src="/images/del1.jpg" alt="Logistics Team" width={400} height={192} className="w-full h-48 object-cover rounded-xl shadow-lg" />
            <Image src="/images/del.jpg" alt="Driver Commitment" width={400} height={192} className="w-full h-48 object-cover rounded-xl shadow-lg mt-8" />
          </div>
        </div>
      </section>
    </div>
  );
}
