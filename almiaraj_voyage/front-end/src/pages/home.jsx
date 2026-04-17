import Hero from "./hero";
import Search from "./search";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  // const [showSearch, setShowSearch] = useState(false)
  // const heroRef = useRef(null)

  // useEffect(() => {
  //     const handleScroll = () => {
  //         if (!heroRef.current) return

  //         const heroHeight = heroRef.current.offsetHeight
  //         const scrollY = window.scrollY

  //         if (scrollY > heroHeight - 570) {
  //             setShowSearch(true)
  //         } else {
  //             setShowSearch(false)
  //         }
  //     }

  //     window.addEventListener("scroll", handleScroll)

  //     return () => window.removeEventListener("scroll", handleScroll)
  // }, [])

  return (
    <>
      <div>
        <Hero />
      </div>
        <div class="bg-white rounded-lg shadow-lg p-6">
          <Search />
        </div>
    </>
  );
}
