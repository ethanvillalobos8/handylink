import React from 'react';

import Navbar from '@/components/Navbar';

function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-custom-background">
      <header>
        <Navbar />
      </header>
      <main className="flex-grow container mx-auto pt-16 pb-4">
        <section className="my-6">
          <h1 className="text-4xl font-bold text-center my-6 flex justify-center items-center">
            <span className="flex w-max text-gradient bg-gradient-to-r from-custom-primary to-custom-accent">
              Welcome
            </span>
            &nbsp;- Service Page &#40;<span className="italic" style={{WebkitTextStroke: "1px #13040c", color: "transparent",}}>&nbsp;HOME&nbsp;&nbsp;</span>&#41;
          </h1>
          <p className="text-md text-custom-text text-center">
            Here, we'll add the components that let users hire a company to do a job.
          </p>
          <div className="flex pt-60 text-sm text-custom-text italic justify-center mt-8">
            TO-DO: Add service components here
          </div>
        </section>
        {/* Other sections and components */}
      </main>
      <footer className="bg-custom-background text-sm text-custom-text text-center p-4">
        {/* Replace later with actual Footer component */}
        <p>© 2024 DBWizards. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default HomePage;
