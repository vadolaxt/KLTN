import { INTRO_DATA } from './constants/intro_data';

import TopBar from '@/shared/components/TopBar';
import Header from '@/shared/components/Header';
import NavBar from '@/shared/components/NavBar';
import Footer from '@/shared/components/Footer';

import IntroHero from './components/IntroHero';
import QuickNav from './components/QuickNav';
import OverviewSection from './components/OverviewSection';
import AdmissionMethodsSection from './components/AdmissionMethodsSection';
import AdmissionNotesSection from './components/AdmissionNotesSection';
import AdmissionAdditionalInfoSection from './components/AdmissionAdditionalInfoSection';
import AdmissionContactSection from './components/AdmissionContactSection';

export const IntroView = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-light font-vietnam">
      <TopBar />
      <Header />
      <NavBar />

      <IntroHero
        eyebrow={INTRO_DATA.hero.eyebrow}
        title={INTRO_DATA.hero.title}
        subtitle={INTRO_DATA.hero.subtitle}
        description={INTRO_DATA.hero.description}
        sourceUrl={INTRO_DATA.sourceUrl}
      />

      <QuickNav />

      <main className="flex-1">
        <OverviewSection data={INTRO_DATA.overview} />
        <AdmissionMethodsSection data={INTRO_DATA.methods} />
        <AdmissionNotesSection data={INTRO_DATA.notes} />
        <AdmissionAdditionalInfoSection
          data={INTRO_DATA.additionalInfo}
          englishCertificateConversion={INTRO_DATA.englishCertificateConversion}
        />
        <AdmissionContactSection data={INTRO_DATA.contact} sourceUrl={INTRO_DATA.sourceUrl} />
      </main>

      <Footer />
    </div>
  );
};
