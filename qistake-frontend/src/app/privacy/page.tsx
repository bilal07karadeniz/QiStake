import { Header, Footer, Container } from '@/components/layout';
import { Card } from '@/components/ui';

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-8">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold font-heading text-white mb-8">
              Privacy Policy
            </h1>

            <Card className="prose prose-invert max-w-none p-6 md:p-8">
              <p className="text-text-secondary mb-6">
                Last updated: December 2025
              </p>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">1. Introduction</h2>
                <p className="text-text-secondary mb-4">
                  QiStake (&quot;we&quot;, &quot;our&quot;, or &quot;the Platform&quot;) is committed to protecting your privacy.
                  This Privacy Policy explains how we collect, use, and safeguard information when you use our Platform.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">2. Information We Collect</h2>
                <p className="text-text-secondary mb-4">
                  As a decentralized application, we collect minimal information:
                </p>
                <ul className="list-disc list-inside text-text-secondary mb-4 space-y-2">
                  <li><strong className="text-white">Wallet Address:</strong> Your public blockchain address when you connect your wallet</li>
                  <li><strong className="text-white">Transaction Data:</strong> Information about your interactions with smart contracts (publicly available on-chain)</li>
                  <li><strong className="text-white">Usage Data:</strong> Anonymous analytics about how you interact with the Platform</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">3. Information We Do NOT Collect</h2>
                <p className="text-text-secondary mb-4">
                  We do not collect:
                </p>
                <ul className="list-disc list-inside text-text-secondary mb-4 space-y-2">
                  <li>Personal identification information (name, email, phone number)</li>
                  <li>Private keys or seed phrases</li>
                  <li>Financial account information</li>
                  <li>Location data</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">4. How We Use Information</h2>
                <p className="text-text-secondary mb-4">
                  The information we collect is used to:
                </p>
                <ul className="list-disc list-inside text-text-secondary mb-4 space-y-2">
                  <li>Enable Platform functionality</li>
                  <li>Display your staking positions and rewards</li>
                  <li>Improve user experience</li>
                  <li>Analyze Platform usage patterns</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">5. Blockchain Data</h2>
                <p className="text-text-secondary mb-4">
                  Please note that blockchain transactions are public and permanent. Once you interact
                  with smart contracts on QIE Chain, this information becomes part of the public blockchain
                  record and cannot be deleted or modified.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">6. Third-Party Services</h2>
                <p className="text-text-secondary mb-4">
                  We may use third-party services such as:
                </p>
                <ul className="list-disc list-inside text-text-secondary mb-4 space-y-2">
                  <li>RainbowKit for wallet connections</li>
                  <li>WalletConnect for mobile wallet support</li>
                  <li>RPC providers for blockchain data</li>
                </ul>
                <p className="text-text-secondary">
                  These services have their own privacy policies that govern their collection and use of data.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">7. Cookies</h2>
                <p className="text-text-secondary mb-4">
                  We may use essential cookies for:
                </p>
                <ul className="list-disc list-inside text-text-secondary mb-4 space-y-2">
                  <li>Remembering your wallet connection preferences</li>
                  <li>Maintaining session state</li>
                  <li>Basic analytics</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">8. Data Security</h2>
                <p className="text-text-secondary mb-4">
                  We implement appropriate security measures to protect against unauthorized access.
                  However, no method of transmission over the internet is 100% secure, and we cannot
                  guarantee absolute security.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">9. Changes to This Policy</h2>
                <p className="text-text-secondary mb-4">
                  We may update this Privacy Policy from time to time. We will notify users of any
                  material changes by updating the &quot;Last updated&quot; date.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">10. Contact Us</h2>
                <p className="text-text-secondary">
                  If you have questions about this Privacy Policy, please contact us via{' '}
                  <a
                    href="https://t.me/QiStake"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Telegram
                  </a>.
                </p>
              </section>
            </Card>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
