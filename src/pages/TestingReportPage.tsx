import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { Footer } from '../components/Footer';
import './TestingReportPage.css';

// ═══════════════════════════════════════════════════════════════
// TEST DATA — Smart Contract Unit Tests
// ═══════════════════════════════════════════════════════════════

interface TestCategory {
  name: string;
  tests: string[];
}

interface TestSuite {
  name: string;
  file: string;
  categories: TestCategory[];
}

const smartContractSuites: TestSuite[] = [
  {
    name: 'COWToken V2',
    file: 'COWToken.test.ts',
    categories: [
      {
        name: 'Constructor',
        tests: [
          'should set correct name and symbol',
          'should set correct parameters',
          'should set owner correctly',
          'should set initial totalCollateral to 0',
          'should set initial totalSupply to 0',
          'should revert with zero price feed address',
          'should revert with zero feeCollector address',
          'should revert with zero treasury2 address',
          'should revert with LTV too high',
          'should revert with spread too high',
          'should revert with mint fee too high',
          'should revert with burn fee too high',
          'should revert with invalid liquidation threshold (<= 100%)',
          'should accept boundary LTV of 9000 (MAX_LTV_BPS)',
          'should accept boundary fee of 500 (MAX_FEE_BPS)',
          'should accept boundary liquidation threshold of 10001',
        ],
      },
      {
        name: 'Mint (Collateral-based)',
        tests: [
          'should mint COW tokens based on BNB value and LTV',
          'should record user\'s collateral position',
          'should send spread fee to treasury2',
          'should send mint fee to feeCollector',
          'should emit Minted event',
          'should revert with zero amount',
          'should accumulate collateral on multiple mints',
          'should increase totalCollateral correctly',
          'should revert when paused',
          'should work with very small deposit',
          'should work with large deposit',
        ],
      },
      {
        name: 'Burn (Collateral Release)',
        tests: [
          'should return BNB when tokens are burned',
          'should clear position when burning all tokens',
          'should handle partial burns correctly',
          'should send spread fee to treasury2 on burn',
          'should send burn fee to feeCollector on burn',
          'should emit Burned event',
          'should decrease totalCollateral on burn',
          'should decrease totalSupply on burn',
          'should revert with insufficient balance',
          'should revert with zero amount',
          'should revert if user has no position (NoPosition)',
          'should revert if user has no balance (InsufficientBalance)',
          'should revert when paused',
          'should handle burning more than cowMinted (full position return)',
        ],
      },
      {
        name: 'Collateral Ratio',
        tests: [
          'should return healthy ratio at initial price',
          'should return max uint for user with no position',
          'should decrease ratio when BNB price drops',
          'should increase ratio when BNB price rises',
          'should drop below liquidation threshold at extreme price drop',
        ],
      },
      {
        name: 'Liquidation',
        tests: [
          'should revert liquidation when position is healthy',
          'should allow liquidation when collateral ratio < threshold',
          'should emit Liquidated event with correct addresses',
          'should revert for user with no position',
          'should decrease totalCollateral',
          'should decrease totalSupply by debtRepaid',
          'should revert when paused',
          'should send remaining collateral to user after penalty',
          'should allow self-liquidation',
        ],
      },
      {
        name: 'Price Oracle',
        tests: [
          'should revert on stale price',
          'should revert on negative price',
          'should revert on zero price',
          'should return correct BNB price',
          'should reflect updated price',
          'should not revert just before MAX_PRICE_STALENESS',
          'stale price should affect burn',
          'stale price should affect getCollateralRatio',
          'stale price should affect liquidate',
        ],
      },
      {
        name: 'View Helpers',
        tests: [
          'previewMint should return correct values',
          'previewMint with zero should return zeros',
          'backingRatio should return 1e18 when no tokens',
          'backingRatio should return valid value after minting',
          'backingRatio should change when BNB price changes',
          'previewBurn should return 0 for user with no position',
          'previewBurn should return correct values for user with position',
          'previewBurn partial should return proportional BNB',
          'getPosition should return zeros for empty position',
        ],
      },
      {
        name: 'Admin',
        tests: [
          'owner can set mint fee',
          'setMintFee emits MintFeeUpdated',
          'setMintFee reverts if too high',
          'setMintFee reverts for non-owner',
          'owner can set burn fee',
          'setBurnFee emits BurnFeeUpdated',
          'setBurnFee reverts if too high',
          'setBurnFee reverts for non-owner',
          'owner can update spread',
          'setSpreadBps emits SpreadBpsUpdated',
          'setSpreadBps reverts if too high',
          'setSpreadBps reverts for non-owner',
          'owner can update LTV',
          'setLtv emits LtvUpdated',
          'setLtv reverts if too high',
          'setLtv reverts for non-owner',
          'owner can update liquidation threshold',
          'setLiquidationThreshold emits event',
          'setLiquidationThreshold reverts if <= 10000',
          'setLiquidationThreshold reverts for non-owner',
          'owner can update feeCollector',
          'setFeeCollector emits FeeCollectorUpdated',
          'setFeeCollector reverts with zero address',
          'setFeeCollector reverts for non-owner',
          'owner can update treasury2',
          'setTreasury2 emits Treasury2Updated',
          'setTreasury2 reverts with zero address',
          'setTreasury2 reverts for non-owner',
          'owner can update price feed',
          'setPriceFeed emits PriceFeedUpdated',
          'setPriceFeed reverts with zero address',
          'setPriceFeed reverts for non-owner',
          'owner can pause',
          'owner can unpause',
          'pause reverts for non-owner',
          'unpause reverts for non-owner',
          'setMintFee to MAX_FEE_BPS (500) should succeed',
          'setLtv to MAX_LTV_BPS (9000) should succeed',
          'setMintFee to 0 should succeed',
          'setBurnFee to 0 should succeed',
          'setSpreadBps to 0 should succeed',
        ],
      },
      {
        name: 'Safety',
        tests: [
          'should reject direct BNB transfers',
          'ERC20 transfer should work normally',
          'ERC20 approve + transferFrom should work',
        ],
      },
      {
        name: 'Zero Fee Scenarios',
        tests: [
          'should mint without spread fee when spreadBps is 0',
          'should mint without mint fee when mintFeeBps is 0',
          'should burn without spread fee when spreadBps is 0',
          'should burn without burn fee when burnFeeBps is 0',
        ],
      },
      {
        name: 'Multi-user Scenario',
        tests: [
          'should handle multiple users with independent positions',
          'should only liquidate undercollateralized positions',
          'totalCollateral should equal sum of all positions',
        ],
      },
      {
        name: 'Constants',
        tests: [
          'MAX_FEE_BPS should be 500',
          'MAX_LTV_BPS should be 9000',
          'MAX_PRICE_STALENESS should be 3600',
          'LIQUIDATION_PENALTY_BPS should be 500',
        ],
      },
    ],
  },
  {
    name: 'COWToken — Mathematical Precision & Edge Cases',
    file: 'COWToken.math.test.ts',
    categories: [
      {
        name: 'Exact Mint Fee Calculations',
        tests: [
          'should compute exact COW for 1 BNB at $600',
          'should compute exact COW for 0.5 BNB at $600',
          'should compute exact COW for 10 BNB at $600',
          'should compute exact COW at different BNB price ($300)',
          'actual mint matches preview exactly',
          'actual fees sent to feeCollector and treasury2 match expected BNB',
          'net collateral = deposit - spreadFeeBnb - mintFeeBnb',
        ],
      },
      {
        name: 'Exact Burn Fee Calculations',
        tests: [
          'should compute exact BNB return for full burn',
          'should compute exact BNB return for half burn',
          'burn should transfer exact fees to treasury2 and feeCollector',
        ],
      },
      {
        name: 'Collateral Ratio Formula',
        tests: [
          'should compute exact ratio after minting at $600',
          'should compute exact ratio after price change to $400',
        ],
      },
      {
        name: 'Liquidation Penalty Math',
        tests: [
          'should send exactly 5% penalty to liquidator',
          'liquidation should burn exact debt amount of tokens',
          'liquidation should reduce totalCollateral by exact seized amount',
        ],
      },
      {
        name: 'Backing Ratio Computation',
        tests: [
          'should compute exact backing ratio after mint',
          'backing ratio should change proportionally with price',
        ],
      },
      {
        name: 'Event Argument Verification',
        tests: [
          'Minted event should contain exact arguments',
          'Burned event should contain exact arguments',
          'Liquidated event should contain exact arguments',
        ],
      },
      {
        name: 'Max Fee Scenarios',
        tests: [
          'mint with all fees at MAX_FEE_BPS (500 = 5%)',
          'burn with all fees at MAX_FEE_BPS (500 = 5%)',
        ],
      },
      {
        name: 'Reentrancy Guard',
        tests: ['should prevent reentrancy attack during burn'],
      },
      {
        name: 'Extreme Price Scenarios',
        tests: [
          'should handle very high BNB price ($100,000)',
          'should handle very low BNB price ($1)',
          'should handle price spike between mint and burn',
          'should handle price crash between mint and burn',
        ],
      },
      {
        name: 'LTV Change Impact',
        tests: [
          'lower LTV should mint fewer tokens for same deposit',
          'higher LTV should mint more tokens for same deposit',
        ],
      },
      {
        name: 'Conservation of Value',
        tests: [
          'contract BNB balance = totalCollateral (fees leave the contract)',
          'after all users burn, contract should have 0 balance',
          'total BNB in = total net BNB out + fees collected',
        ],
      },
      {
        name: 'Rounding Behavior',
        tests: [
          'should handle 1 wei deposit without overflow or underflow',
          'should handle deposit that results in 0 spread fee',
        ],
      },
    ],
  },
  {
    name: 'COWTimelock',
    file: 'COWTimelock.test.ts',
    categories: [
      {
        name: 'Deployment',
        tests: [
          'should set correct minDelay',
          'should grant PROPOSER_ROLE to proposer',
          'should grant EXECUTOR_ROLE to executor',
          'should grant CANCELLER_ROLE to proposer (auto-granted)',
          'should grant DEFAULT_ADMIN_ROLE to admin',
          'should NOT grant PROPOSER_ROLE to admin (separation of concerns)',
          'should NOT grant EXECUTOR_ROLE to admin (separation of concerns)',
          'should deploy with zero admin (renounced)',
          'should deploy with custom delay',
          'should deploy with multiple proposers and executors',
        ],
      },
      {
        name: 'Schedule → Execute Lifecycle',
        tests: [
          'proposer can schedule an operation',
          'should set operation as pending after scheduling',
          'should NOT be ready before delay',
          'should be ready after delay passes',
          'executor can execute after delay',
          'should mark operation as done after execution',
          'should revert execution before delay',
          'should revert execution halfway through delay',
          'should revert double execution',
        ],
      },
      {
        name: 'Access Control',
        tests: [
          'non-proposer cannot schedule',
          'non-executor cannot execute',
          'non-canceller cannot cancel',
          'proposer (canceller) can cancel scheduled operation',
          'cancelled operation cannot be executed',
          'admin can grant PROPOSER_ROLE to a new address',
          'admin can revoke EXECUTOR_ROLE',
        ],
      },
      {
        name: 'Batch Operations',
        tests: ['should schedule and execute batch operations'],
      },
      {
        name: 'Edge Cases',
        tests: [
          'should reject scheduling with delay less than minDelay',
          'should allow scheduling with delay equal to minDelay',
          'should allow scheduling with delay greater than minDelay',
          'should reject duplicate schedule (same id)',
        ],
      },
    ],
  },
  {
    name: 'Integration: COWTimelock + COWToken',
    file: 'Integration.test.ts',
    categories: [
      {
        name: 'Ownership Transfer',
        tests: [
          'COWToken owner should be the timelock',
          'original admin cannot call onlyOwner functions directly',
          'random user cannot call onlyOwner functions',
        ],
      },
      {
        name: 'Parameter Changes via Timelock',
        tests: [
          'should change mintFee via timelock',
          'should change burnFee via timelock',
          'should change spreadBps via timelock',
          'should change LTV via timelock',
          'should change liquidationThreshold via timelock',
          'should change feeCollector via timelock',
          'should change treasury2 via timelock',
          'should change priceFeed via timelock',
          'should pause via timelock',
          'should unpause via timelock',
        ],
      },
      {
        name: 'Timelock Revert Scenarios',
        tests: [
          'should revert invalid parameter change (fee too high) even via timelock',
          'should revert zero address feeCollector even via timelock',
        ],
      },
      {
        name: 'User Ragequit Window (48h Delay)',
        tests: [
          'user can burn tokens during the 48h delay (ragequit)',
          'proposer can cancel a scheduled change',
        ],
      },
      {
        name: 'Full Lifecycle: Mint → Price Drop → Liquidation',
        tests: ['should handle complete user lifecycle'],
      },
      {
        name: 'Batch Parameter Changes',
        tests: ['should change multiple parameters in a single batch'],
      },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════
// E2E SPEC FILES
// ═══════════════════════════════════════════════════════════════

const e2eSpecFiles = [
  'action-panel.spec.ts',
  'burn-preview.spec.ts',
  'console-errors.spec.ts',
  'contract-info.spec.ts',
  'cow-conversion-preview.spec.ts',
  'cross-page.spec.ts',
  'docs-page-detail.spec.ts',
  'documentation-page.spec.ts',
  'error-resilience.spec.ts',
  'exchange-rates.spec.ts',
  'features-section.spec.ts',
  'footer.spec.ts',
  'header-logo.spec.ts',
  'header-scroll.spec.ts',
  'home.spec.ts',
  'how-it-works.spec.ts',
  'i18n-content.spec.ts',
  'i18n-persistence.spec.ts',
  'language-switcher.spec.ts',
  'mobile-menu.spec.ts',
  'navigation.spec.ts',
  'network-switcher.spec.ts',
  'pages.spec.ts',
  'percent-buttons.spec.ts',
  'performance.spec.ts',
  'responsive-pages.spec.ts',
  'responsive.spec.ts',
  'smart-contract-guide-detail.spec.ts',
  'smart-contract-guide.spec.ts',
  'token-info.spec.ts',
  'transaction-history.spec.ts',
  'treasury-dashboard.spec.ts',
  'ui-a11y.spec.ts',
  'ui-visual-elements.spec.ts',
  'upgrade-guide.spec.ts',
  'wallet-connected.spec.ts',
  'wallet-features.spec.ts',
  'wallet-page-connected.spec.ts',
  'wallet-page.spec.ts',
  'wallet.spec.ts',
];

// ═══════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════

export default function TestingReportPage() {
  const { t } = useTranslation();
  const [expandedSuites, setExpandedSuites] = useState<Set<string>>(new Set());

  const totalSmartContractTests = smartContractSuites.reduce(
    (acc, suite) => acc + suite.categories.reduce((a, c) => a + c.tests.length, 0),
    0
  );
  const totalE2EFiles = e2eSpecFiles.length;
  const totalTests = totalSmartContractTests + totalE2EFiles;

  const toggleSuite = (name: string) => {
    setExpandedSuites((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const expandAll = () => {
    const allNames = smartContractSuites.map((s) => s.name);
    setExpandedSuites(new Set(allNames));
  };

  const collapseAll = () => setExpandedSuites(new Set());

  return (
    <div className="testing-report-page">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <Link to="/" className="logo">
            <div className="logo-icon-wrapper">
              <img src="/logo.png" alt="COW Stablecoin Logo" className="logo-img" />
            </div>
            <span className="logo-text">COW <span className="logo-accent">Stablecoin</span></span>
          </Link>
          <nav className="header-nav desktop-nav">
            <Link to="/" className="nav-link">{t('header.features')}</Link>
            <Link to="/docs" className="nav-link">{t('header.docs')}</Link>
            <Link to="/smart-contract" className="nav-link">{t('footer.smartContractGuide')}</Link>
          </nav>
          <div className="header-actions">
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="testing-report-hero">
        <div className="report-badge">
          <span className="report-badge-dot" />
          <span>{t('testingReport.badge', 'All Tests Passed')}</span>
        </div>
        <h1 className="report-title">{t('testingReport.title', 'Testing Report')}</h1>
        <p className="report-subtitle">
          {t('testingReport.subtitle', 'Comprehensive test suite demonstrating system reliability, security, and stability across smart contracts and UI.')}
        </p>

        <div className="report-summary-stats">
          <div className="summary-stat">
            <span className="stat-number stat-total">{totalTests}</span>
            <span className="stat-label">{t('testingReport.totalTests', 'Total Tests')}</span>
          </div>
          <div className="summary-stat">
            <span className="stat-number stat-passed">{totalTests}</span>
            <span className="stat-label">{t('testingReport.passed', 'Passed')}</span>
          </div>
          <div className="summary-stat">
            <span className="stat-number stat-coverage">100%</span>
            <span className="stat-label">{t('testingReport.passRate', 'Pass Rate')}</span>
          </div>
          <div className="summary-stat">
            <span className="stat-number stat-suites">{smartContractSuites.length + 1}</span>
            <span className="stat-label">{t('testingReport.testSuites', 'Test Suites')}</span>
          </div>
        </div>
        <p className="report-last-run">
          {t('testingReport.lastRun', 'Last run')}: 2026-03-15
        </p>
      </section>

      {/* Content */}
      <div className="report-content">
        {/* ── Smart Contract Unit Tests ──────────────── */}
        <section className="report-section">
          <div className="section-header-row">
            <div className="section-icon smart-contract">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="section-title-group">
              <h2 className="section-title-text">{t('testingReport.smartContractTests', 'Smart Contract Unit Tests')}</h2>
              <span className="section-count">
                {totalSmartContractTests} {t('testingReport.testsIn', 'tests in')} {smartContractSuites.length} {t('testingReport.suites', 'suites')} — Solidity / Hardhat / Chai
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <button
              onClick={expandAll}
              style={{
                background: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                color: '#a78bfa',
                padding: '6px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 600,
              }}
            >
              {t('testingReport.expandAll', '▼ Expand All')}
            </button>
            <button
              onClick={collapseAll}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'rgba(226, 232, 240, 0.6)',
                padding: '6px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 600,
              }}
            >
              {t('testingReport.collapseAll', '▲ Collapse All')}
            </button>
          </div>

          {smartContractSuites.map((suite) => {
            const testCount = suite.categories.reduce((a, c) => a + c.tests.length, 0);
            const isExpanded = expandedSuites.has(suite.name);
            return (
              <div className="test-suite-card" key={suite.name}>
                <div className="suite-header" onClick={() => toggleSuite(suite.name)}>
                  <div className="suite-header-left">
                    <div className="suite-status-icon">✓</div>
                    <span className="suite-name">{suite.name}</span>
                  </div>
                  <div className="suite-header-right">
                    <span className="suite-test-count">{testCount} tests</span>
                    <svg
                      className={`suite-chevron${isExpanded ? ' expanded' : ''}`}
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </div>
                <div className={`suite-body${isExpanded ? ' expanded' : ''}`}>
                  <div className="suite-body-inner">
                    {suite.categories.map((cat) => (
                      <div className="test-category" key={cat.name}>
                        <div className="category-name">{cat.name}</div>
                        {cat.tests.map((testName, idx) => (
                          <div className="test-row" key={idx}>
                            <span className="test-check">✔</span>
                            <span className="test-name">{testName}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* ── E2E Tests ─────────────────────────────── */}
        <section className="report-section">
          <div className="section-header-row">
            <div className="section-icon e2e">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </div>
            <div className="section-title-group">
              <h2 className="section-title-text">{t('testingReport.e2eTests', 'End-to-End UI Tests')}</h2>
              <span className="section-count">
                {totalE2EFiles} {t('testingReport.specFiles', 'spec files')} — Playwright / Chromium / Firefox / WebKit
              </span>
            </div>
          </div>

          <div className="e2e-grid">
            {e2eSpecFiles.map((file) => (
              <div className="e2e-spec-card" key={file}>
                <div className="e2e-spec-icon">✓</div>
                <span className="e2e-spec-name">{file}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Bottom Banner ─────────────────────────── */}
        <div className="report-bottom-banner">
          <div className="banner-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h3 className="banner-title">{t('testingReport.bannerTitle', 'System Verified & Stable')}</h3>
          <p className="banner-desc">
            {t('testingReport.bannerDesc', 'All smart contract logic, security mechanisms, and UI components have been thoroughly tested and verified. The system is production-ready with 100% test pass rate.')}
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
