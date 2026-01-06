import { Header, Footer, Container } from '@/components/layout';
import { Card } from '@/components/ui';

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-8">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold font-heading text-white mb-8">
              Terms of Service
            </h1>

            <Card className="prose prose-invert max-w-none p-6 md:p-8">
              <p className="text-text-secondary mb-6">
                Last updated: December 2025
              </p>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
                <p className="text-text-secondary mb-4">
                  By accessing or using QiStake (&quot;the Platform&quot;), you agree to be bound by these Terms of Service.
                  If you do not agree to these terms, please do not use the Platform.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">2. Description of Service</h2>
                <p className="text-text-secondary mb-4">
                  QiStake is a decentralized staking platform built on QIE Chain that allows:
                </p>
                <ul className="list-disc list-inside text-text-secondary mb-4 space-y-2">
                  <li>Token creators to establish permissionless staking pools</li>
                  <li>Users to stake tokens in available pools and earn rewards</li>
                  <li>Users to unstake and claim rewards at any time</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">3. Eligibility</h2>
                <p className="text-text-secondary mb-4">
                  You must be at least 18 years old and have the legal capacity to enter into these terms.
                  You are responsible for ensuring that your use of the Platform complies with all applicable
                  laws and regulations in your jurisdiction.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">4. Wallet and Security</h2>
                <p className="text-text-secondary mb-4">
                  You are solely responsible for:
                </p>
                <ul className="list-disc list-inside text-text-secondary mb-4 space-y-2">
                  <li>Maintaining the security of your wallet and private keys</li>
                  <li>All activities that occur under your wallet address</li>
                  <li>Any losses resulting from unauthorized access to your wallet</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">5. Risks</h2>
                <p className="text-text-secondary mb-4">
                  Using the Platform involves significant risks, including but not limited to:
                </p>
                <ul className="list-disc list-inside text-text-secondary mb-4 space-y-2">
                  <li>Smart contract vulnerabilities</li>
                  <li>Token price volatility</li>
                  <li>Potential loss of staked tokens</li>
                  <li>Regulatory uncertainty</li>
                  <li>Network congestion and transaction failures</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">6. No Financial Advice</h2>
                <p className="text-text-secondary mb-4">
                  Nothing on this Platform constitutes financial, investment, legal, or tax advice.
                  You should consult with qualified professionals before making any financial decisions.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">7. Limitation of Liability</h2>
                <p className="text-text-secondary mb-4">
                  To the maximum extent permitted by law, QiStake and its operators shall not be liable
                  for any direct, indirect, incidental, special, consequential, or punitive damages
                  resulting from your use of the Platform.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">8. Changes to Terms</h2>
                <p className="text-text-secondary mb-4">
                  We reserve the right to modify these terms at any time. Continued use of the Platform
                  after changes constitutes acceptance of the new terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">9. Contact</h2>
                <p className="text-text-secondary">
                  For questions about these terms, please contact us via our{' '}
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
