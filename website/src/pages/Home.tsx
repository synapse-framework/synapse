import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Performance from '../components/Performance';
import GettingStarted from '../components/GettingStarted';
import Testimonials from '../components/Testimonials';

export default function Home() {
  return (
    <div className="home">
      <Hero />
      <Features />
      <Performance />
      <GettingStarted />
      <Testimonials />
    </div>
  );
}