/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { VerificationForm } from './components/VerificationForm';
import { ThankYouScreen } from './components/ThankYouScreen';
import { EventInfoSection } from './components/EventInfoSection';
import { Footer } from './components/Footer';
import { AdminConsultationModal } from './components/AdminConsultationModal';
import { RegistrationFormData, VerificationResult } from './types';
import { soundEffects } from './utils/audio';

export default function App() {
  const [isMuted, setIsMuted] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    formData: RegistrationFormData;
    verification: VerificationResult;
  } | null>(null);

  useEffect(() => {
    // Keyboard shortcut for private admin panel: Ctrl + Shift + A or Cmd + Shift + A
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        soundEffects.playClick();
        setIsAdminModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleMute = () => {
    soundEffects.isMuted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleOpenAdminModal = () => {
    soundEffects.playClick();
    setIsAdminModalOpen(true);
  };

  const handleScrollToForm = () => {
    soundEffects.playClick();
    const formElement = document.getElementById('formulario-registro');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If already on thank you screen and user clicks header
      setSubmittedData(null);
      setTimeout(() => {
        const el = document.getElementById('formulario-registro');
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleVerificationSuccess = (
    formData: RegistrationFormData,
    verification: VerificationResult
  ) => {
    setSubmittedData({ formData, verification });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setSubmittedData(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      <Header
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onScrollToForm={handleScrollToForm}
        onOpenAdmin={handleOpenAdminModal}
      />

      <main className="flex-1">
        {submittedData ? (
          /* Pantalla de Agradecimiento - Solo visible tras enviar y validar respuestas */
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <ThankYouScreen
              formData={submittedData.formData}
              verification={submittedData.verification}
              onReset={handleReset}
            />
          </div>
        ) : (
          /* Pantalla Principal con Formulario de Verificación +18 */
          <div className="space-y-6">
            <HeroBanner onScrollToForm={handleScrollToForm} />
            <VerificationForm onSuccess={handleVerificationSuccess} />
            <EventInfoSection />
          </div>
        )}
      </main>

      <Footer onOpenAdmin={handleOpenAdminModal} />

      <AdminConsultationModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />
    </div>
  );
}
