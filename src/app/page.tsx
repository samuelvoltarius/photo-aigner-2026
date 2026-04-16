'use client';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Gallery from '@/components/Gallery';
import About from '@/components/About';
import Packages from '@/components/Packages';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Navigation />
      <Hero />
      <Gallery />
      <About />
      <Packages />
      <Contact />
      <Footer />
    </motion.main>
  );
}
