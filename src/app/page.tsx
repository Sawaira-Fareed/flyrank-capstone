import Hero from "@/components/hero/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Navbar from "@/components/navbar/Navbar";
import GlimpseInside from "@/components/landing/GlimpseInside";
import Features from "@/components/landing/Features";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";


export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <HowItWorks />
      <GlimpseInside />
      <Features/>
    
      <CTA />
      <Footer/>
    
    </>
  );
}