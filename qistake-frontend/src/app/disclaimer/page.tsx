import { Header, Footer, Container } from '@/components/layout';
import { Card } from '@/components/ui';
import { AlertTriangle } from 'lucide-react';

export default function DisclaimerPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-8">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold font-heading text-white mb-8">
              Disclaimer
            </h1>

            <Card className="prose prose-invert max-w-none p-6 md:p-8">
              {/* Warning Banner */}
              <div className="flex items-start gap-4 p-4 bg-warning-light rounded-xl border border-warning-border mb-8">
                <AlertTriangle className="w-6 h-6 text-warning-text flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-warning-text mb-1">Important Notice</p>
                  <p className="text-sm text-text-secondary">
                    Please read this disclaimer carefully before using QiStake. By using this Platform,
                    you acknowledge that you have read, understood, and agree to be bound by this disclaimer.
                  </p>
                </div>
              </div>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">No Financial Advice</h2>
                <p className="text-text-secondary mb-4">
                  QiStake does not provide financial, investment, legal, or tax advice. All information
                  on this Platform is provided for informational purposes only. You should not construe
                  any such information as advice.
                </p>
                <p className="text-text-secondary">
                  Before making any financial decisions, you should seek the advice of a qualified
                  professional who is aware of the facts and circumstances of your individual situation.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Risks of Digital Assets</h2>
                <p className="text-text-secondary mb-4">
                  Digital assets and blockchain technology involve significant risks, including:
                </p>
                <ul className="list-disc list-inside text-text-secondary mb-4 space-y-2">
                  <li><strong className="text-white">Price Volatility:</strong> The value of digital assets can fluctuate dramatically</li>
                  <li><strong className="text-white">Smart Contract Risk:</strong> Bugs or vulnerabilities in smart contracts could result in loss of funds</li>
                  <li><strong className="text-white">Regulatory Risk:</strong> Changes in laws or regulations could affect your ability to use the Platform</li>
                  <li><strong className="text-white">Technical Risk:</strong> Network issues, software bugs, or security breaches could impact the Platform</li>
                  <li><strong className="text-white">Liquidity Risk:</strong> You may not be able to sell or transfer your assets when you want</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">No Guarantees</h2>
                <p className="text-text-secondary mb-4">
                  QiStake makes no guarantees regarding:
                </p>
                <ul className="list-disc list-inside text-text-secondary mb-4 space-y-2">
                  <li>The performance or returns of any staking pool</li>
                  <li>The security or value of any token listed on the Platform</li>
                  <li>The continuous operation or availability of the Platform</li>
                  <li>The accuracy of any APY or reward calculations</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Third-Party Tokens</h2>
                <p className="text-text-secondary mb-4">
                  The Platform allows anyone to create staking pools for any ERC-20 token.
                  QiStake does not endorse, verify, or vouch for any token or pool created on the Platform.
                </p>
                <p className="text-text-secondary">
                  You are solely responsible for conducting your own research (DYOR) before interacting
                  with any token or pool.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Limitation of Liability</h2>
                <p className="text-text-secondary mb-4">
                  To the fullest extent permitted by law, QiStake and its operators, developers, and
                  contributors shall not be liable for any:
                </p>
                <ul className="list-disc list-inside text-text-secondary mb-4 space-y-2">
                  <li>Loss of funds or assets</li>
                  <li>Lost profits or revenue</li>
                  <li>Business interruption</li>
                  <li>Indirect, incidental, special, or consequential damages</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Your Responsibility</h2>
                <p className="text-text-secondary mb-4">
                  By using QiStake, you acknowledge and agree that:
                </p>
                <ul className="list-disc list-inside text-text-secondary mb-4 space-y-2">
                  <li>You are using the Platform at your own risk</li>
                  <li>You have the necessary knowledge to understand the risks involved</li>
                  <li>You will not invest more than you can afford to lose</li>
                  <li>You are responsible for securing your own wallet and private keys</li>
                  <li>You will comply with all applicable laws in your jurisdiction</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">Contact</h2>
                <p className="text-text-secondary">
                  If you have questions about this disclaimer, please contact us via{' '}
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
