import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div
      className="relative min-h-screen py-16 px-4"
      style={{
        backgroundImage: "url('/auth-back.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-white/40" />

      {/* Elsa — absolutely positioned on the left */}
      <div className="hidden lg:block fixed left-0 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
        <Image src="/pose11.png" alt="Elsa" width={320} height={420} className="object-contain" />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#312E81] transition mb-6 bg-white/50 backdrop-blur rounded-full px-4 py-2 border border-white/40">
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div className="rounded-[28px] border border-white/45 px-6 lg:px-10 py-8 lg:py-10"
          style={{
            background: "rgba(255,255,255,0.22)",
            backdropFilter: "blur(22px)",
            WebkitBackdropFilter: "blur(22px)",
            boxShadow: "0 20px 60px rgba(167,139,250,0.12)",
          }}>
          <h1 className="font-heading text-3xl lg:text-4xl font-bold text-[#312E81] mb-6">Privacy Policy</h1>
          <p className="text-sm text-[#6B7280] mb-8">Last updated: August 2026</p>

          <div className="space-y-6 text-[#312E81] text-sm leading-7">
            <section>
              <h2 className="font-heading text-lg font-bold mb-2">1. Information We Collect</h2>
              <p>When you use BloomLab, we collect:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-[#6B7280]">
                <li><strong>Account information:</strong> Your name, email address, and profile picture when you sign up.</li>
                <li><strong>Learning data:</strong> Projects you create, lessons you complete, skills you learn, and progress you make.</li>
                <li><strong>Usage data:</strong> Pages visited, time spent learning, and features used to improve your experience.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-lg font-bold mb-2">2. How We Use Your Data</h2>
              <ul className="list-disc pl-5 space-y-1 text-[#6B7280]">
                <li>To personalize your learning experience with Elsa, your AI mentor.</li>
                <li>To track your progress, streaks, and achievements.</li>
                <li>To improve BloomLab based on how learners use the platform.</li>
                <li>To send important updates about your account or the service.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-lg font-bold mb-2">3. Data Storage & Security</h2>
              <p className="text-[#6B7280]">Your data is stored securely using Supabase (PostgreSQL) and Firebase Authentication. We use industry-standard encryption and never share your personal information with third parties.</p>
            </section>

            <section>
              <h2 className="font-heading text-lg font-bold mb-2">4. Your Rights</h2>
              <ul className="list-disc pl-5 space-y-1 text-[#6B7280]">
                <li>You can access and update your personal data anytime from your Profile.</li>
                <li>You can request deletion of your account and all associated data by contacting us.</li>
                <li>You can export your learning data at any time.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-lg font-bold mb-2">5. Cookies</h2>
              <p className="text-[#6B7280]">BloomLab uses essential cookies for authentication and session management. We do not use tracking cookies or third-party analytics.</p>
            </section>

            <section>
              <h2 className="font-heading text-lg font-bold mb-2">6. Children's Privacy</h2>
              <p className="text-[#6B7280]">BloomLab is designed for learners of all ages. We do not knowingly collect data from children under 13 without parental consent.</p>
            </section>

            <section>
              <h2 className="font-heading text-lg font-bold mb-2">7. Contact Us</h2>
              <p className="text-[#6B7280]">If you have questions about this privacy policy, contact us at:</p>
              <a href="mailto:abruptessence@gmail.com" className="text-[#8B5CF6] hover:underline font-semibold">abruptessence@gmail.com</a>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}