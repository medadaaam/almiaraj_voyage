// import { useAuth } from "@/context/AuthContext";
// import FeaturesSection from "@/components/FeaturesSectionButtom";
import Hero from "./hero";
import Search from "./search";
// import { useEffect, useRef, useState } from "react";
import Features from "@/components/features";
import FeaturedTrips from "./voyagesRecommand";
import FeaturedHotels from "./FeaturedHotels";
import Destinations from "./Destinations";
import About from "./about";

export default function Home() {
// const { user,authenticated } = useAuth();
//   useEffect(() => {
//     if (user) {
//       console.log(user);
//     }
//   }, [authenticated]);

  return (
    <>
      <div>
        <Hero />
      </div>
      <div className="bg-blue rounded-lg shadow-lg">
        <Search />
      </div>
      <Features />
       <FeaturedTrips />
       <FeaturedHotels />
      <Destinations />
      <About />

    </>
  );
}
