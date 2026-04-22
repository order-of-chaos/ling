import { I18nProvider } from "@orderofchaos/ling-react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Philosophy } from "./components/Philosophy";
import { Features } from "./components/Features";
import { Comparison } from "./components/Comparison";
import { CodeExamples } from "./components/CodeExamples";
import { Installation } from "./components/Installation";
import { Documentation } from "./components/Documentation";
import { Footer } from "./components/Footer";
import { translations, storage, defaultLanguage } from "./i18n";

function App() {
  return (
    <I18nProvider
      translations={translations}
      storage={storage}
      defaultLanguage={defaultLanguage}
    >
      <div className="min-h-screen">
        <Header />
        <main>
          <Hero />
          <Philosophy />
          <Features />
          <Comparison />
          <CodeExamples />
          <Installation />
          <Documentation />
        </main>
        <Footer />
      </div>
    </I18nProvider>
  );
}

export default App;
