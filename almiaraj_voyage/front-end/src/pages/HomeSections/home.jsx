import { useAuth } from "@/context/AuthContext";
// import FeaturesSection from "@/components/FeaturesSectionButtom";
import Hero from "./hero";
import Search from "./search";
import { useEffect, useRef, useState } from "react";
import Features from "@/components/features";
import FeaturedTrips from "./voyagesRecommand";
import FeaturedHotels from "./FeaturedHotels";
import Destinations from "./Destinations";
import About from "./about";
import Testimonials from "./Testimonials";
import Contact from "./contact";
import FAQ from "./FAQ";
import CTA from "./CTA";

export default function Home() {
  const { client , authenticated } = useAuth();
    useEffect(() => {
      if (client) {
        console.log(client);
      }
    }, [authenticated]);

  return (
    <>
      <Hero />
      <div className="bg-blue rounded-lg shadow-lg">
        <Search />
      </div>
      <Destinations />
      <FeaturedTrips />
      <FeaturedHotels />
      <Features />
      <About />
      <Testimonials />
      <FAQ />
      <Contact />
      <CTA />
    </>
  );
}
