import { useEffect } from "react";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { OfferingPage } from "./components/OfferingPage";
import { Services } from "./components/Services";
import { TopNav } from "./components/TopNav";
import { Updates } from "./components/Updates";
import { OFFERINGS } from "./data/site";
import { scrollToHash, usePath } from "./router";

export function App() {
  const path = usePath();
  const offering = OFFERINGS.find((o) => path.replace(/\/+$/, "") === `/${o.slug}`);

  useEffect(() => {
    document.title = offering ? `${offering.name} | Aeygis` : "Aeygis";
    scrollToHash(false);
  }, [offering]);

  return (
    <>
      <TopNav />
      <main>
        {offering ? (
          <OfferingPage key={offering.slug} item={offering} />
        ) : (
          <>
            <Hero />
            <Updates />
            <Services />
            <Contact />
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
