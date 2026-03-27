import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { Footer } from '../components/Footer';
import './DocumentationPage.css';

const sectionKeys = [
    { id: 'overview', key: 'nav1', accent: 'purple', icon: '📜' },
    { id: 'architecture', key: 'nav2', accent: 'cyan', icon: '🏗' },
    { id: 'cow-token', key: 'nav3', accent: 'green', icon: '🪙' },
    { id: 'cow-timelock', key: 'nav4', accent: 'amber', icon: '⏳' },
    { id: 'deploy', key: 'nav5', accent: 'red', icon: '🚀' },
    { id: 'security', key: 'nav6', accent: 'blue', icon: '🛡' },
    { id: 'frontend', key: 'nav7', accent: 'purple', icon: '🔗' },
    { id: 'upgrade', key: 'nav8', accent: 'pink', icon: '🔄' },
    { id: 'liquidation', key: 'nav9', accent: 'orange', icon: '⚡' },
    { id: 'verify', key: 'nav10', accent: 'teal', icon: '✅' },
];

export default function SmartContractGuidePage() {
    const { t } = useTranslation();
    const sections = sectionKeys.map(s => ({ ...s, title: t(`smartContract.${s.key}`) }));
    return (
        <div className="pdoc-page">
            <header className="pdoc-header">
                <div className="pdoc-header-content">
                    <Link to="/" className="logo">
                        <div className="logo-icon-wrapper">
                            <img src="/media/cow_sp.gif" alt="COW Stablecoin Logo" className="logo-img" />
                        </div>
                        <span className="logo-text">COW <span className="logo-accent">Stablecoin</span></span>
                    </Link>
                    <div className="pdoc-header-right">
                        <LanguageSwitcher />
                        <Link to="/" className="pdoc-back-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="19" y1="12" x2="5" y2="12" />
                                <polyline points="12 19 5 12 12 5" />
                            </svg>
                            {t('smartContract.backToApp')}
                        </Link>
                    </div>
                </div>
            </header>

            <div className="pdoc-layout">
                <aside className="pdoc-sidebar">
                    <nav className="pdoc-nav">
                        <span className="pdoc-nav-label">{t('smartContract.navLabel')}</span>
                        {sections.map((s) => (
                            <a key={s.id} href={`#${s.id}`} className="pdoc-nav-link">
                                <span className={`pdoc-nav-icon pdoc-nav-icon--${s.accent}`}>{s.icon}</span>
                                {s.title}
                            </a>
                        ))}
                    </nav>
                </aside>

                <main className="pdoc-main">
                    {/* Hero */}
                    <div className="pdoc-hero">
                        <div className="pdoc-hero-badge">
                            <span className="badge-dot" />
                            {t('smartContract.heroBadge')}
                            <span style={{ opacity: 0.5 }}>v2.0</span>
                        </div>
                        <h1 className="pdoc-hero-title">
                            {t('smartContract.heroTitle')} <span className="gradient-text">{t('smartContract.heroTitleAccent')}</span>
                        </h1>
                        <div className="pdoc-hero-meta">
                            <span className="pdoc-meta-item"><strong>{t('smartContract.heroSolidity')}</strong> 0.8.24</span>
                            <span className="pdoc-meta-item"><strong>{t('smartContract.heroFramework')}</strong> Hardhat</span>
                            <span className="pdoc-meta-item"><strong>{t('smartContract.heroNetwork')}</strong> BNB Smart Chain</span>
                        </div>
                        <p className="pdoc-hero-desc">
                            {t('smartContract.heroDesc')}
                        </p>
                    </div>

                    {/* ═══ SECTION 1: Overview ═══ */}
                    <Section id="overview" title={t('smartContract.s1Title')} accent="purple"
                        icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>} />

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">{t('smartContract.s1_1Title')}</h3>
                        <div className="pdoc-table-wrapper">
                            <table className="pdoc-table">
                                <thead><tr><th>{t('smartContract.s1_1H_contract')}</th><th>{t('smartContract.s1_1H_desc')}</th><th>{t('smartContract.s1_1H_loc')}</th></tr></thead>
                                <tbody>
                                    <tr><td><strong>COWToken.sol</strong></td><td>{t('smartContract.s1_1R1_desc')}</td><td>{t('smartContract.s1_1R1_loc')}</td></tr>
                                    <tr><td><strong>COWTimelock.sol</strong></td><td>{t('smartContract.s1_1R2_desc')}</td><td>{t('smartContract.s1_1R2_loc')}</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">{t('smartContract.s1_2Title')}</h3>
                        <div className="pdoc-table-wrapper">
                            <table className="pdoc-table">
                                <thead><tr><th>{t('smartContract.s1_2H_lib')}</th><th>{t('smartContract.s1_2H_func')}</th></tr></thead>
                                <tbody>
                                    <tr><td><code>ERC20</code></td><td>{t('smartContract.s1_2R1')}</td></tr>
                                    <tr><td><code>ReentrancyGuard</code></td><td>{t('smartContract.s1_2R2')}</td></tr>
                                    <tr><td><code>Pausable</code></td><td>{t('smartContract.s1_2R3')}</td></tr>
                                    <tr><td><code>Ownable</code></td><td>{t('smartContract.s1_2R4')}</td></tr>
                                    <tr><td><code>TimelockController</code></td><td>{t('smartContract.s1_2R5')}</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">{t('smartContract.s1_3Title')}</h3>
                        <p className="pdoc-text" dangerouslySetInnerHTML={{ __html: t('smartContract.s1_3Text') }} />
                        <div className="pdoc-table-wrapper">
                            <table className="pdoc-table">
                                <thead><tr><th>{t('smartContract.s1_3H_network')}</th><th>{t('smartContract.s1_3H_address')}</th></tr></thead>
                                <tbody>
                                    <tr><td><strong>BSC Testnet</strong></td><td><code>0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526</code></td></tr>
                                    <tr><td><strong>BSC Mainnet</strong></td><td><code>0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE</code></td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* ═══ SECTION 2: Architecture ═══ */}
                    <Section id="architecture" title={t("smartContract.s2Title")} accent="cyan"
                        icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2" /><rect x="2" y="14" width="20" height="8" rx="2" ry="2" /><line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" /></svg>} />

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">{t('smartContract.s2_1Title')}</h3>
                        <p className="pdoc-text" dangerouslySetInnerHTML={{ __html: t('smartContract.s2_1Text') }} />
                        <div className="pdoc-formula">
                            <p className="pdoc-formula-line" dangerouslySetInnerHTML={{ __html: t('smartContract.s2_1Mint') }} />
                            <p className="pdoc-formula-line" dangerouslySetInnerHTML={{ __html: t('smartContract.s2_1Burn') }} />
                            <p className="pdoc-formula-line" dangerouslySetInnerHTML={{ __html: t('smartContract.s2_1Liquidate') }} />
                        </div>
                    </div>

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">{t("smartContract.s2_2Title")}</h3>
                        <div className="pdoc-table-wrapper">
                            <table className="pdoc-table">
                                <thead><tr><th>{t("smartContract.s2_2H_type")}</th><th>{t("smartContract.s2_2H_rate")}</th><th>{t("smartContract.s2_2H_receiver")}</th><th>{t("smartContract.s2_2H_purpose")}</th></tr></thead>
                                <tbody>
                                    <tr><td><strong>Spread Fee</strong></td><td>1% (100 bps)</td><td>Treasury2</td><td>Dự trữ & phát triển</td></tr>
                                    <tr><td><strong>Mint Fee</strong></td><td>0.3% (30 bps)</td><td>Fee Collector</td><td>{t("smartContract.s2_2R2_purpose")}</td></tr>
                                    <tr><td><strong>Burn Fee</strong></td><td>0.3% (30 bps)</td><td>Fee Collector</td><td>{t("smartContract.s2_2R3_purpose")}</td></tr>
                                    <tr><td><strong>Liquidation Penalty</strong></td><td>5% (500 bps)</td><td>Liquidator</td><td>{t("smartContract.s2_2R4_purpose")}</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">{t('smartContract.s2_3Title')}</h3>
                        <div className="pdoc-table-wrapper">
                            <table className="pdoc-table">
                                <thead><tr><th>{t('smartContract.s2_3H_const')}</th><th>{t('smartContract.s2_3H_val')}</th><th>{t('smartContract.s2_3H_meaning')}</th></tr></thead>
                                <tbody>
                                    <tr><td><code>MAX_FEE_BPS</code></td><td>500 (5%)</td><td>{t('smartContract.s2_3R1')}</td></tr>
                                    <tr><td><code>MAX_LTV_BPS</code></td><td>9000 (90%)</td><td>{t('smartContract.s2_3R2')}</td></tr>
                                    <tr><td><code>MAX_PRICE_STALENESS</code></td><td>3600 (1h)</td><td>{t('smartContract.s2_3R3')}</td></tr>
                                    <tr><td><code>LIQUIDATION_PENALTY_BPS</code></td><td>500 (5%)</td><td>{t('smartContract.s2_3R4')}</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* ═══ SECTION 3: COWToken.sol ═══ */}
                    <Section id="cow-token" title={t("smartContract.s3Title")} accent="green"
                        icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>} />

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">{t("smartContract.s3_1Title")}</h3>
                        <p className="pdoc-text">{t("smartContract.s3_1Text")}</p>
                        <CodeBlock lang="solidity">{`// Oracle
AggregatorV3Interface public priceFeed;  // Chainlink BNB/USD

// Configuration (basis points)
uint256 public ltvBps;                  // 8000 = 80%
uint256 public liquidationThreshold;    // 10500 = 105%
uint256 public spreadBps;               // 100 = 1%
uint256 public mintFeeBps;              // 30 = 0.3%
uint256 public burnFeeBps;              // 30 = 0.3%

// Addresses
address public feeCollector;            // Nhận mint/burn fee
address public treasury2;               // Nhận spread fee

// Collateral tracking
uint256 public totalCollateral;         // Tổng BNB locked

// Per-user position
struct CollateralPosition {
    uint256 collateralAmount;           // BNB deposited (wei)
    uint256 cowMinted;                  // COW minted
}
mapping(address => CollateralPosition) public positions;`}</CodeBlock>
                    </div>

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">{t("smartContract.s3_2Title")}</h3>
                        <p className="pdoc-text">{t("smartContract.s3_2Text")}</p>
                        <CodeBlock lang="solidity">{`constructor(
    address _priceFeed,           // Chainlink address
    address _feeCollector,        // Fee recipient
    address _treasury2,           // Spread fee recipient
    uint256 _ltvBps,              // e.g., 8000
    uint256 _spreadBps,           // e.g., 100
    uint256 _mintFeeBps,          // e.g., 30
    uint256 _burnFeeBps,          // e.g., 30
    uint256 _liquidationThreshold // e.g., 10500
) ERC20("COW Token", "COW") Ownable(msg.sender) {
    // Validate: no zero addresses, fees <= 5%, LTV <= 90%
    // threshold > 100%
}`}</CodeBlock>
                    </div>

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">{t("smartContract.s3_3Title")}</h3>
                        <p className="pdoc-text" dangerouslySetInnerHTML={{ __html: t("smartContract.s3_3Text") }} />
                        <CodeBlock lang="solidity">{`function mint() external payable nonReentrant whenNotPaused {
    // 1. Validate: msg.value > 0
    // 2. Lấy giá BNB/USD từ Chainlink (8 decimals)
    // 3. Tính USD value = msg.value * price / 1e8
    // 4. Áp LTV: cowBeforeFees = usdValue * ltvBps / 10000
    // 5. Tính spread fee → chuyển cho treasury2
    // 6. Tính mint fee → chuyển cho feeCollector
    // 7. Mint COW = cowBeforeFees - spreadFee - mintFee
    // 8. Cập nhật position: collateral + cowMinted
    // 9. _mint(msg.sender, tokensToMint)
    // 10. Forward fees bằng .call{value}
}`}</CodeBlock>
                        <div className="pdoc-formula">
                            <p className="pdoc-formula-line"><strong>USD Value</strong> = BNB × (BNB/USD price) ÷ 10⁸</p>
                            <p className="pdoc-formula-line"><strong dangerouslySetInnerHTML={{ __html: t("smartContract.s3_3F2") }} /></p>
                            <p className="pdoc-formula-line"><strong dangerouslySetInnerHTML={{ __html: t("smartContract.s3_3F3") }} /></p>
                            <p className="pdoc-formula-line"><strong dangerouslySetInnerHTML={{ __html: t("smartContract.s3_3F4") }} /></p>
                            <p className="pdoc-formula-line"><strong dangerouslySetInnerHTML={{ __html: t("smartContract.s3_3F5") }} /></p>
                        </div>
                    </div>

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">{t("smartContract.s3_4Title")}</h3>
                        <CodeBlock lang="solidity">{`function burn(uint256 amount) external nonReentrant whenNotPaused {
    // 1. Validate: amount > 0, balance >= amount
    // 2. Lấy position của user
    // 3. Tính BNB share:
    //    - Nếu burn ALL → trả toàn bộ collateral
    //    - Nếu burn một phần → proportional
    // 4. Tính spread fee + burn fee trên BNB
    // 5. Net BNB = bnbShare - fees
    // 6. Update position, totalCollateral
    // 7. _burn(msg.sender, amount)
    // 8. Transfer BNB + forward fees
}`}</CodeBlock>
                        <div className="pdoc-info-card pdoc-info-card--warning">
                            <span className="pdoc-info-card-icon">⚠️</span>
                            <span className="pdoc-info-card-text" dangerouslySetInnerHTML={{ __html: t("smartContract.s3_4Warn") }} />
                        </div>
                    </div>

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">{t("smartContract.s3_5Title")}</h3>
                        <CodeBlock lang="solidity">{`function liquidate(address user) external nonReentrant whenNotPaused {
    // 1. Kiểm tra user có position
    // 2. Tính collateral ratio: (collateral × price) / cowMinted
    // 3. Nếu ratio >= 105% → revert PositionHealthy
    // 4. Tính penalty = collateral × 5%
    // 5. returnToUser = collateral - penalty
    // 6. Clear position, burn COW, transfer BNB
    // 7. Send penalty cho liquidator (msg.sender)
}`}</CodeBlock>
                        <div className="pdoc-info-card pdoc-info-card--info">
                            <span className="pdoc-info-card-icon">💡</span>
                            <span className="pdoc-info-card-text" dangerouslySetInnerHTML={{ __html: t("smartContract.s3_5Info") }} />
                        </div>
                    </div>

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">{t("smartContract.s3_6Title")}</h3>
                        <div className="pdoc-table-wrapper">
                            <table className="pdoc-table">
                                <thead><tr><th>{t("smartContract.s3_6H_func")}</th><th>Returns</th><th>{t("smartContract.s3_6H_desc")}</th></tr></thead>
                                <tbody>
                                    <tr><td><code>getCollateralRatio(user)</code></td><td><code>uint256</code></td><td>{t("smartContract.s3_6R1")}</td></tr>
                                    <tr><td><code>getPosition(user)</code></td><td><code>(collateral, cowMinted, ratio)</code></td><td>{t("smartContract.s3_6R2")}</td></tr>
                                    <tr><td><code>getBNBPrice()</code></td><td><code>uint256</code></td><td>{t("smartContract.s3_6R3")}</td></tr>
                                    <tr><td><code>backingRatio()</code></td><td><code>uint256</code></td><td>{t("smartContract.s3_6R4")}</td></tr>
                                    <tr><td><code>previewMint(bnb)</code></td><td><code>(tokens, spread, fee)</code></td><td>{t("smartContract.s3_6R5")}</td></tr>
                                    <tr><td><code>previewBurn(tokens)</code></td><td><code>(bnb, spread, fee)</code></td><td>{t("smartContract.s3_6R6")}</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">{t("smartContract.s3_7Title")}</h3>
                        <p className="pdoc-text" dangerouslySetInnerHTML={{ __html: t("smartContract.s3_7Text") }} />
                        <div className="pdoc-table-wrapper">
                            <table className="pdoc-table">
                                <thead><tr><th>{t("smartContract.s3_7H_func")}</th><th>{t("smartContract.s3_7H_feature")}</th><th>{t("smartContract.s3_7H_limit")}</th></tr></thead>
                                <tbody>
                                    <tr><td><code>setMintFee(bps)</code></td><td>{t("smartContract.s3_7R1")}</td><td>≤ 500 bps (5%)</td></tr>
                                    <tr><td><code>setBurnFee(bps)</code></td><td>{t("smartContract.s3_7R2")}</td><td>≤ 500 bps (5%)</td></tr>
                                    <tr><td><code>setSpreadBps(bps)</code></td><td>{t("smartContract.s3_7R3")}</td><td>≤ 500 bps (5%)</td></tr>
                                    <tr><td><code>setLtv(bps)</code></td><td>{t("smartContract.s3_7R4")}</td><td>≤ 9000 bps (90%)</td></tr>
                                    <tr><td><code>setLiquidationThreshold(bps)</code></td><td>{t("smartContract.s3_7R5")}</td><td>{'>'} 10000 bps (100%)</td></tr>
                                    <tr><td><code>setFeeCollector(addr)</code></td><td>{t("smartContract.s3_7R6")}</td><td>≠ address(0)</td></tr>
                                    <tr><td><code>setTreasury2(addr)</code></td><td>{t("smartContract.s3_7R7")}</td><td>≠ address(0)</td></tr>
                                    <tr><td><code>setPriceFeed(addr)</code></td><td>{t("smartContract.s3_7R8")}</td><td>≠ address(0)</td></tr>
                                    <tr><td><code>pause() / unpause()</code></td><td>{t("smartContract.s3_7R9")}</td><td>—</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">{t("smartContract.s3_8Title")}</h3>
                        <div className="pdoc-table-wrapper">
                            <table className="pdoc-table">
                                <thead><tr><th>Error</th><th>{t("smartContract.s3_8H_when")}</th></tr></thead>
                                <tbody>
                                    <tr><td><code>ZeroAmount()</code></td><td>{t("smartContract.s3_8R1")}</td></tr>
                                    <tr><td><code>FeeTooHigh(requested, max)</code></td><td>{t("smartContract.s3_8R2")}</td></tr>
                                    <tr><td><code>LtvTooHigh(requested, max)</code></td><td>{t("smartContract.s3_8R3")}</td></tr>
                                    <tr><td><code>ZeroAddress()</code></td><td>{t("smartContract.s3_8R4")}</td></tr>
                                    <tr><td><code>InsufficientBalance(req, avail)</code></td><td>{t("smartContract.s3_8R5")}</td></tr>
                                    <tr><td><code>TransferFailed()</code></td><td>{t("smartContract.s3_8R6")}</td></tr>
                                    <tr><td><code>StalePrice(updatedAt, current)</code></td><td>{t("smartContract.s3_8R7")}</td></tr>
                                    <tr><td><code>InvalidPrice(price)</code></td><td>{t("smartContract.s3_8R8")}</td></tr>
                                    <tr><td><code>PositionHealthy(ratio, threshold)</code></td><td>{t("smartContract.s3_8R9")}</td></tr>
                                    <tr><td><code>NoPosition()</code></td><td>{t("smartContract.s3_8R10")}</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">{t("smartContract.s3_9Title")}</h3>
                        <CodeBlock lang="solidity">{`event Minted(address indexed user, uint256 bnbDeposited,
    uint256 tokensReceived, uint256 spreadFee,
    uint256 mintFee, uint256 bnbPriceUsd);

event Burned(address indexed user, uint256 tokensBurned,
    uint256 bnbReturned, uint256 spreadFee,
    uint256 burnFee, uint256 bnbPriceUsd);

event Liquidated(address indexed user, address indexed liquidator,
    uint256 collateralSeized, uint256 debtRepaid,
    uint256 penalty, uint256 bnbPriceUsd);

// Admin events
event SpreadBpsUpdated(uint256 oldSpread, uint256 newSpread);
event MintFeeUpdated(uint256 oldFee, uint256 newFee);
event BurnFeeUpdated(uint256 oldFee, uint256 newFee);
event LtvUpdated(uint256 oldLtv, uint256 newLtv);
event LiquidationThresholdUpdated(uint256 old, uint256 new);
event FeeCollectorUpdated(address old, address new);
event Treasury2Updated(address old, address new);
event PriceFeedUpdated(address old, address new);`}</CodeBlock>
                    </div>

                    {/* ═══ SECTION 4: COWTimelock ═══ */}
                    <Section id="cow-timelock" title="4. COWTimelock.sol — 48h Timelock" accent="amber"
                        icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>} />

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">4.1 Mục đích</h3>
                        <p className="pdoc-text">
                            <code>COWTimelock</code> kế thừa <code>TimelockController</code> từ OpenZeppelin — đảm bảo mọi thay đổi admin trên COWToken phải qua quy trình 3 bước với thời gian chờ <strong>48 giờ</strong>.
                        </p>
                        <ol className="pdoc-steps">
                            <li className="pdoc-step"><span className="pdoc-step-num">1</span><span className="pdoc-step-text"><strong>Schedule</strong> — Proposer đề xuất thay đổi → emits <code>CallScheduled</code> event</span></li>
                            <li className="pdoc-step"><span className="pdoc-step-num">2</span><span className="pdoc-step-text"><strong>Wait 48h</strong> — Community có thể thấy thay đổi sắp tới và burn token nếu không đồng ý (ragequit)</span></li>
                            <li className="pdoc-step"><span className="pdoc-step-num">3</span><span className="pdoc-step-text"><strong>Execute</strong> — Executor thực hiện thay đổi sau khi hết thời gian chờ</span></li>
                        </ol>
                    </div>

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">4.2 Source Code</h3>
                        <CodeBlock lang="solidity">{`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/governance/TimelockController.sol";

contract COWTimelock is TimelockController {
    constructor(
        uint256 minDelay,          // 172800 = 48 hours
        address[] memory proposers,
        address[] memory executors,
        address admin
    ) TimelockController(minDelay, proposers, executors, admin) {}
}`}</CodeBlock>
                    </div>

                    {/* ═══ SECTION 5: Deploy ═══ */}
                    <Section id="deploy" title="5. Hướng dẫn Deploy Smart Contract" accent="red"
                        icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>} />

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">5.1 Yêu cầu</h3>
                        <div className="pdoc-table-wrapper">
                            <table className="pdoc-table">
                                <thead><tr><th>Yêu cầu</th><th>Chi tiết</th></tr></thead>
                                <tbody>
                                    <tr><td><strong>Node.js</strong></td><td>≥ 22.0.0</td></tr>
                                    <tr><td><strong>Hardhat</strong></td><td>Đã cài trong <code>contracts/package.json</code></td></tr>
                                    <tr><td><strong>Private Key</strong></td><td>Wallet có BNB để trả gas fee</td></tr>
                                    <tr><td><strong>tBNB (Testnet)</strong></td><td>Lấy từ <a href="https://www.bnbchain.org/en/testnet-faucet" target="_blank" rel="noopener noreferrer">BNB Testnet Faucet</a></td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">5.2 Cấu hình Hardhat</h3>
                        <CodeBlock lang="typescript">{`// contracts/hardhat.config.ts
import { config as dotenvConfig } from "dotenv";
dotenvConfig({ path: path.resolve(__dirname, "../.env") });

const config: HardhatUserConfig = {
    solidity: {
        version: "0.8.24",
        settings: { optimizer: { enabled: true, runs: 200 } },
    },
    networks: {
        bscTestnet: {
            url: "https://data-seed-prebsc-1-s1.binance.org:8545",
            chainId: 97,
            accounts: process.env.DEPLOYER_PRIVATE_KEY
                ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
        },
        bscMainnet: {
            url: "https://bsc-dataseed.binance.org",
            chainId: 56,
            accounts: process.env.DEPLOYER_PRIVATE_KEY
                ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
        },
    },
};`}</CodeBlock>
                    </div>

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">5.3 Step-by-step Deploy</h3>
                        <ol className="pdoc-steps">
                            <li className="pdoc-step"><span className="pdoc-step-num">1</span><span className="pdoc-step-text">Cài đặt dependencies: <code>cd contracts && npm install</code></span></li>
                            <li className="pdoc-step"><span className="pdoc-step-num">2</span><span className="pdoc-step-text">Tạo file <code>.env</code> ở thư mục gốc:<br /><code>DEPLOYER_PRIVATE_KEY=7de11db97e666bb34f396097fe04a995daddf87d2a34971544195960766fe2cd</code><br /><code>BSCSCAN_API_KEY=</code></span></li>
                            <li className="pdoc-step"><span className="pdoc-step-num">3</span><span className="pdoc-step-text">Biên dịch contract: <code>npx hardhat compile</code></span></li>
                            <li className="pdoc-step"><span className="pdoc-step-num">4</span><span className="pdoc-step-text">Chạy unit tests: <code>npx hardhat test</code></span></li>
                            <li className="pdoc-step"><span className="pdoc-step-num">5</span><span className="pdoc-step-text">Deploy lên Testnet: <code>npx hardhat run scripts/deploy.ts --network bscTestnet</code></span></li>
                            <li className="pdoc-step"><span className="pdoc-step-num">6</span><span className="pdoc-step-text">Ghi lại địa chỉ contract → cập nhật vào <code>src/contracts/cowConfig.ts</code></span></li>
                        </ol>
                        <div className="pdoc-info-card pdoc-info-card--warning">
                            <span className="pdoc-info-card-icon">⚠️</span>
                            <span className="pdoc-info-card-text"><strong>KHÔNG commit private key vào git!</strong> Luôn dùng file <code>.env</code> và thêm vào <code>.gitignore</code>.</span>
                        </div>
                    </div>

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">5.4 Deploy Script chi tiết</h3>
                        <p className="pdoc-text">Script deploy thực hiện 3 bước tuần tự:</p>
                        <CodeBlock lang="typescript">{`// contracts/scripts/deploy.ts
async function main() {
    // Bước 1: Deploy COWTimelock (48h delay)
    const timelock = await COWTimelock.deploy(
        172800,              // 48 hours in seconds
        [deployer.address],  // proposers
        [deployer.address],  // executors
        deployer.address     // admin
    );

    // Bước 2: Deploy COWToken với cấu hình
    const token = await COWToken.deploy(
        priceFeedAddr,       // Chainlink BNB/USD
        deployer.address,    // feeCollector
        deployer.address,    // treasury2
        8000,                // 80% LTV
        100,                 // 1% spread
        30,                  // 0.3% mint fee
        30,                  // 0.3% burn fee
        10500                // 105% liquidation threshold
    );

    // Bước 3: Chuyển ownership cho Timelock
    await token.transferOwnership(timelockAddr);
    // → Mọi thay đổi admin phải qua Timelock 48h
}`}</CodeBlock>
                    </div>

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">5.5 Địa chỉ Contract đã deploy (BSC Mainnet & Testnet)</h3>
                        <div className="pdoc-table-wrapper">
                            <table className="pdoc-table">
                                <thead><tr><th>Network</th><th>Contract</th><th>Địa chỉ</th><th>Explorer</th></tr></thead>
                                <tbody>
                                    <tr className="pdoc-table-row--mainnet">
                                        <td><strong>Mainnet</strong></td>
                                        <td><strong>COWToken</strong></td>
                                        <td><code>0x4C79D24eF2C1166c88375BCe730fdE8894f266Ab</code></td>
                                        <td><a href="https://bscscan.com/address/0x4C79D24eF2C1166c88375BCe730fdE8894f266Ab" target="_blank" rel="noopener noreferrer">BscScan</a></td>
                                    </tr>
                                    <tr className="pdoc-table-row--mainnet">
                                        <td><strong>Mainnet</strong></td>
                                        <td><strong>COWTimelock</strong></td>
                                        <td><code>0xf8Ed2CD8b1C66c7700641E065b98B129141fd156</code></td>
                                        <td><a href="https://bscscan.com/address/0xf8Ed2CD8b1C66c7700641E065b98B129141fd156" target="_blank" rel="noopener noreferrer">BscScan</a></td>
                                    </tr>
                                    <tr>
                                        <td>Testnet</td>
                                        <td>COWToken</td>
                                        <td><code>0xA381f67E1c448d18569A2397B7e8BbD9D4DcD332</code></td>
                                        <td><a href="https://testnet.bscscan.com/address/0xA381f67E1c448d18569A2397B7e8BbD9D4DcD332" target="_blank" rel="noopener noreferrer">BscScan</a></td>
                                    </tr>
                                    <tr>
                                        <td>Testnet</td>
                                        <td>COWTimelock</td>
                                        <td><code>0xEad577d7730bE3d191CbC4e6657816efE7507437</code></td>
                                        <td><a href="https://testnet.bscscan.com/address/0xEad577d7730bE3d191CbC4e6657816efE7507437" target="_blank" rel="noopener noreferrer">BscScan</a></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* ═══ SECTION 6: Security ═══ */}
                    <Section id="security" title="6. Bảo mật & Anti-Rug-Pull" accent="blue"
                        icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>} />

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">6.1 Mô hình Anti-Rug-Pull</h3>
                        <ul className="pdoc-checklist">
                            <li className="pdoc-check"><CheckIcon />KHÔNG CÓ hàm <strong>withdraw()</strong> cho admin — BNB chỉ ra khỏi contract qua burn hoặc liquidation</li>
                            <li className="pdoc-check"><CheckIcon />KHÔNG CÓ hàm admin <strong>mint()</strong> — Token chỉ được tạo khi có tài sản thế chấp</li>
                            <li className="pdoc-check"><CheckIcon /><strong>ReentrancyGuard</strong> — Chống tấn công reentrancy trên mọi hàm core</li>
                            <li className="pdoc-check"><CheckIcon /><strong>Pausable</strong> — Admin có thể tạm dừng contract khi khẩn cấp (qua Timelock 48h)</li>
                            <li className="pdoc-check"><CheckIcon /><strong>Ownable + TimelockController</strong> — Mọi thay đổi admin có thời gian chờ 48 giờ</li>
                            <li className="pdoc-check"><CheckIcon /><strong>MAX_FEE_BPS = 500</strong> — Admin không thể set phí cao hơn 5%</li>
                            <li className="pdoc-check"><CheckIcon /><strong>receive() revert</strong> — Không chấp nhận BNB gửi trực tiếp, phải dùng mint()</li>
                        </ul>
                    </div>

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">6.2 Cơ chế bảo vệ Oracle</h3>
                        <CodeBlock lang="solidity">{`function _getBNBPrice() internal view returns (uint256) {
    (, int256 price, , uint256 updatedAt, ) =
        priceFeed.latestRoundData();

    // Reject giá âm hoặc 0
    if (price <= 0) revert InvalidPrice(price);

    // Reject nếu giá quá cũ (> 1 giờ)
    if (block.timestamp - updatedAt > MAX_PRICE_STALENESS)
        revert StalePrice(updatedAt, block.timestamp);

    return uint256(price);
}`}</CodeBlock>
                    </div>

                    {/* ═══ SECTION 7: Frontend Integration ═══ */}
                    <Section id="frontend" title="7. Tích hợp Frontend" accent="purple"
                        icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>} />

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">7.1 Cấu hình ABI (cowConfig.ts)</h3>
                        <p className="pdoc-text">Frontend sử dụng <strong>Human-Readable ABI</strong> từ ethers.js v6 — chỉ include các hàm cần dùng:</p>
                        <CodeBlock lang="typescript">{`// src/contracts/cowConfig.ts
export const COW_TOKEN_ABI = [
    // Read
    "function balanceOf(address) view returns (uint256)",
    "function totalCollateral() view returns (uint256)",
    "function getBNBPrice() view returns (uint256)",
    "function getPosition(address) view returns (uint256, uint256, uint256)",
    "function previewMint(uint256) view returns (uint256, uint256, uint256)",
    "function previewBurn(uint256) view returns (uint256, uint256, uint256)",
    "function backingRatio() view returns (uint256)",

    // Write
    "function mint() payable",
    "function burn(uint256 amount)",
    "function liquidate(address user)",

    // Events
    "event Minted(address indexed, uint256, uint256, uint256, uint256, uint256)",
    "event Burned(address indexed, uint256, uint256, uint256, uint256, uint256)",
];`}</CodeBlock>
                    </div>

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">7.2 Mapping địa chỉ theo chain</h3>
                        <CodeBlock lang="typescript">{`export const COW_TOKEN_ADDRESSES: Record<string, string> = {
    '0x61': '0xA381f67E1c448d18569A2397B7e8BbD9D4DcD332',
    '0x38': '0x4C79D24eF2C1166c88375BCe730fdE8894f266Ab',
};

export function getCOWTokenAddress(chainId: string | null) {
    if (!chainId) return null;
    return COW_TOKEN_ADDRESSES[chainId] || null;
}`}</CodeBlock>
                    </div>

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">7.3 Cách gọi contract từ React</h3>
                        <CodeBlock lang="typescript">{`import { ethers } from 'ethers';
import { COW_TOKEN_ABI, getCOWTokenAddress } from '../contracts/cowConfig';

const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
const address = getCOWTokenAddress(chainId);
const contract = new ethers.Contract(address, COW_TOKEN_ABI, signer);

// Read
const price = await contract.getBNBPrice();
// Write
const tx = await contract.mint({ value: ethers.parseEther("0.1") });
await tx.wait();`}</CodeBlock>
                    </div>

                    {/* ═══ SECTION 8: Upgrade Guide ═══ */}
                    <Section id="upgrade" title="8. Hướng dẫn Nâng cấp Smart Contract" accent="pink"
                        icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></svg>} />

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">8.1 Tổng quan — Hai loại thay đổi</h3>
                        <p className="pdoc-text">
                            Hệ thống COWToken có <strong>hai loại thay đổi</strong> với quy trình khác nhau:
                        </p>
                        <div className="pdoc-table-wrapper">
                            <table className="pdoc-table">
                                <thead><tr><th>Loại thay đổi</th><th>Ví dụ cụ thể</th><th>Quy trình</th><th>Deploy mới?</th></tr></thead>
                                <tbody>
                                    <tr><td><strong>Thay đổi thông số</strong></td><td>Đổi phí mint/burn, LTV, ngưỡng thanh lý, fee collector, pause/unpause</td><td>Gửi lệnh qua Timelock → Chờ 48h → Execute</td><td>❌ Không</td></tr>
                                    <tr><td><strong>Thay đổi logic code</strong></td><td>Thêm tính năng, fix bug, upgrade Solidity, đổi cách tính mint/burn</td><td>Deploy contract mới → Migration → Update frontend</td><td>✅ Có</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="pdoc-info-card pdoc-info-card--info">
                            <span className="pdoc-info-card-icon">💡</span>
                            <span className="pdoc-info-card-text"><strong>Quan trọng:</strong> Phần lớn thay đổi thường ngày (đổi phí, LTV, pause khẩn cấp...) thuộc loại <strong>Thay đổi thông số</strong> — chỉ cần gửi lệnh qua Timelock, <strong>KHÔNG cần deploy contract mới</strong>.</span>
                        </div>
                    </div>

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">8.2 Quy trình Timelock 48h — Chi tiết từng bước</h3>
                        <p className="pdoc-text">
                            Mọi thay đổi thông số trên COWToken đều <strong>phải đi qua hệ thống Timelock</strong> (COWTimelock). Admin <strong>KHÔNG THỂ</strong> thay đổi tức thời, mà phải chờ tối thiểu <strong>48 giờ</strong>.
                        </p>
                        <ol className="pdoc-steps">
                            <li className="pdoc-step"><span className="pdoc-step-num">1</span><span className="pdoc-step-text"><strong>Schedule (Đặt lịch)</strong> — Admin gửi lệnh nâng cấp lên Timelock. Lệnh được ghi on-chain, <strong>công khai cho toàn bộ cộng đồng</strong> thấy. Lệnh <strong>CHƯA có hiệu lực</strong>.</span></li>
                            <li className="pdoc-step"><span className="pdoc-step-num">2</span><span className="pdoc-step-text"><strong>Wait 48h (Chờ đợi)</strong> — Hệ thống <strong>treo lệnh trong 48 giờ</strong>. Trong thời gian này:<br />• Mọi người xem lệnh đang chờ trên <strong>BscScan</strong><br />• User kiểm tra <strong>source code + smart contract</strong> để đánh giá<br />• Nếu thấy dấu hiệu rug-pull → user <strong>Burn token + rút BNB</strong> trước khi lệnh có hiệu lực<br />• Admin có thể <strong>hủy lệnh</strong> nếu phát hiện lỗ hổng hoặc sai sót</span></li>
                            <li className="pdoc-step"><span className="pdoc-step-num">3</span><span className="pdoc-step-text"><strong>Execute (Thực thi)</strong> — Sau 48h, admin mới được thực thi lệnh. Nếu không execute, lệnh <strong>tự hết hạn</strong>.</span></li>
                        </ol>
                    </div>

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">8.3 Bảng thông số có thể thay đổi</h3>
                        <p className="pdoc-text">Tất cả thông số admin có thể thay đổi — mỗi thay đổi phải qua Timelock 48h:</p>
                        <div className="pdoc-table-wrapper">
                            <table className="pdoc-table">
                                <thead><tr><th>Hàm admin</th><th>Chức năng</th><th>Giá trị hiện tại</th><th>Giới hạn tối đa</th></tr></thead>
                                <tbody>
                                    <tr><td><code>setMintFee(bps)</code></td><td>Thay đổi phí mint</td><td>30 bps (0.3%)</td><td>≤ 500 bps (5%)</td></tr>
                                    <tr><td><code>setBurnFee(bps)</code></td><td>Thay đổi phí burn</td><td>30 bps (0.3%)</td><td>≤ 500 bps (5%)</td></tr>
                                    <tr><td><code>setSpreadBps(bps)</code></td><td>Thay đổi spread fee</td><td>100 bps (1%)</td><td>≤ 500 bps (5%)</td></tr>
                                    <tr><td><code>setLtv(bps)</code></td><td>Thay đổi tỷ lệ LTV</td><td>8000 bps (80%)</td><td>≤ 9000 bps (90%)</td></tr>
                                    <tr><td><code>setLiquidationThreshold(bps)</code></td><td>Ngưỡng thanh lý</td><td>10500 bps (105%)</td><td>{'>'} 10000 bps</td></tr>
                                    <tr><td><code>setFeeCollector(addr)</code></td><td>Đổi ví nhận fee</td><td>Deployer wallet</td><td>≠ 0x0</td></tr>
                                    <tr><td><code>setTreasury2(addr)</code></td><td>Đổi ví spread fee</td><td>Deployer wallet</td><td>≠ 0x0</td></tr>
                                    <tr><td><code>setPriceFeed(addr)</code></td><td>Đổi oracle</td><td>Chainlink BNB/USD</td><td>≠ 0x0</td></tr>
                                    <tr><td><code>pause()</code></td><td>Tạm dừng contract</td><td>—</td><td>—</td></tr>
                                    <tr><td><code>unpause()</code></td><td>Mở lại contract</td><td>—</td><td>—</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="pdoc-info-card pdoc-info-card--warning">
                            <span className="pdoc-info-card-icon">⚠️</span>
                            <span className="pdoc-info-card-text"><strong>Bảo vệ cứng (hardcoded):</strong> Smart contract đã <strong>ghi cứng giới hạn tối đa</strong>. Phí <strong>KHÔNG THỂ vượt 5%</strong>, LTV <strong>KHÔNG THỂ vượt 90%</strong>. Không ai thay đổi được, kể cả admin.</span>
                        </div>
                    </div>

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">8.4 Ví dụ: Đổi mint fee qua Timelock</h3>
                        <p className="pdoc-text"><strong>Ví dụ:</strong> Đổi mint fee từ 0.3% (30 bps) → 0.5% (50 bps):</p>

                        <h4 className="pdoc-subtitle" style={{ fontSize: '0.88rem', marginTop: '16px' }}>Bước 1: Schedule — Đặt lịch</h4>
                        <CodeBlock lang="typescript">{`// scripts/timelock-schedule.ts
import { ethers } from "hardhat";

async function main() {
    // BSC Mainnet Addresses
    const TIMELOCK = "0xf8Ed2CD8b1C66c7700641E065b98B129141fd156";
    const COW_TOKEN = "0x4C79D24eF2C1166c88375BCe730fdE8894f266Ab";
    const MIN_DELAY = 172800; // 48h = 172800 giây

    const timelock = await ethers.getContractAt("COWTimelock", TIMELOCK);

    // Encode lệnh: setMintFee(50) = đổi thành 0.5%
    const iface = new ethers.Interface([
        "function setMintFee(uint256 _mintFeeBps)"
    ]);
    const callData = iface.encodeFunctionData("setMintFee", [50]);

    // Schedule — bắt đầu đếm 48h
    const tx = await timelock.schedule(
        COW_TOKEN,        // target
        0,                // value: 0 BNB
        callData,         // data: setMintFee(50)
        ethers.ZeroHash,  // predecessor
        ethers.id("set-mint-fee-to-50bps"), // salt
        MIN_DELAY         // delay: 48h
    );
    await tx.wait();
    console.log("Lệnh đã schedule! Chờ 48h...");
}`}</CodeBlock>

                        <h4 className="pdoc-subtitle" style={{ fontSize: '0.88rem', marginTop: '16px' }}>Bước 2: Chờ 48h — Cộng đồng kiểm tra</h4>
                        <ul className="pdoc-checklist">
                            <li className="pdoc-check"><CheckIcon />Xem lệnh trên <strong>BscScan</strong> (event <code>CallScheduled</code>)</li>
                            <li className="pdoc-check"><CheckIcon />Giải mã <code>callData</code> để biết <strong>thông số nào thay đổi</strong></li>
                            <li className="pdoc-check"><CheckIcon />Không đồng ý → <strong>Burn COW + rút BNB</strong> trước 48h</li>
                            <li className="pdoc-check"><CheckIcon />Admin hủy lệnh bằng <code>cancel(operationId)</code> nếu sai sót</li>
                        </ul>

                        <h4 className="pdoc-subtitle" style={{ fontSize: '0.88rem', marginTop: '16px' }}>Bước 3: Execute — Thực thi sau 48h</h4>
                        <CodeBlock lang="typescript">{`// Chạy SAU 48h
const tx = await timelock.execute(
    COW_TOKEN, 0, callData,
    ethers.ZeroHash,
    ethers.id("set-mint-fee-to-50bps")
);
await tx.wait();
console.log("Mint fee đã đổi thành 0.5%!");`}</CodeBlock>
                    </div>

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">8.5 Bảo vệ người dùng — Anti-Rug-Pull</h3>
                        <p className="pdoc-text">
                            Timelock 48h là <strong>cơ chế bảo vệ quan trọng nhất</strong> cho người nắm giữ COW token:
                        </p>
                        <div className="pdoc-table-wrapper">
                            <table className="pdoc-table">
                                <thead><tr><th>Tình huống</th><th>Hành động của User</th><th>Thời gian</th></tr></thead>
                                <tbody>
                                    <tr><td>Admin schedule <strong>tăng phí lên 5%</strong></td><td>Kiểm tra BscScan → Burn COW + rút BNB trước 48h</td><td>48 giờ</td></tr>
                                    <tr><td>Admin schedule <strong>đổi oracle</strong></td><td>Kiểm tra oracle mới → Rút tài sản nếu nghi ngờ</td><td>48 giờ</td></tr>
                                    <tr><td>Admin schedule <strong>pause contract</strong></td><td>Burn + rút BNB trước khi contract bị pause</td><td>48 giờ</td></tr>
                                    <tr><td>Admin <strong>đổi fee collector</strong></td><td>Phí chỉ ảnh hưởng giao dịch future</td><td>48 giờ</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="pdoc-info-card pdoc-info-card--security">
                            <span className="pdoc-info-card-icon">🛡️</span>
                            <span className="pdoc-info-card-text"><strong>Quyền của User (không ai tước được):</strong><br />• User <strong>LUÔN có quyền burn COW</strong> và rút BNB bất cứ lúc nào<br />• Admin <strong>KHÔNG CÓ hàm withdraw()</strong> — không rút được BNB của user<br />• Admin <strong>KHÔNG CÓ hàm admin mint()</strong> — không tạo token từ hư không</span>
                        </div>
                    </div>

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">8.6 Công khai Source Code + Smart Contract</h3>
                        <p className="pdoc-text">
                            Toàn bộ source code được <strong>công khai hoàn toàn</strong>:
                        </p>
                        <div className="pdoc-table-wrapper">
                            <table className="pdoc-table">
                                <thead><tr><th>Nơi kiểm tra</th><th>Link</th><th>Nội dung</th></tr></thead>
                                <tbody>
                                    <tr><td><strong>BscScan — COWToken (Mainnet)</strong></td><td><a href="https://bscscan.com/address/0x4C79D24eF2C1166c88375BCe730fdE8894f266Ab#code" target="_blank" rel="noopener noreferrer">Xem BscScan</a></td><td>Mainnet source code, verified</td></tr>
                                    <tr><td><strong>BscScan — Timelock (Mainnet)</strong></td><td><a href="https://bscscan.com/address/0xf8Ed2CD8b1C66c7700641E065b98B129141fd156#code" target="_blank" rel="noopener noreferrer">Xem BscScan</a></td><td>Mainnet Timelock</td></tr>
                                    <tr><td><strong>BscScan — COWToken (Testnet)</strong></td><td><a href="https://testnet.bscscan.com/address/0xA381f67E1c448d18569A2397B7e8BbD9D4DcD332#code" target="_blank" rel="noopener noreferrer">Xem BscScan</a></td><td>Testnet source code, verified</td></tr>

                                </tbody>
                            </table>
                        </div>
                        <p className="pdoc-text"><strong>Cách verify trên BscScan:</strong></p>
                        <ol className="pdoc-steps">
                            <li className="pdoc-step"><span className="pdoc-step-num">1</span><span className="pdoc-step-text">Mở BscScan → Tab <strong>Contract</strong></span></li>
                            <li className="pdoc-step"><span className="pdoc-step-num">2</span><span className="pdoc-step-text">Xem biểu tượng <strong>✅ xanh</strong> = code verified khớp 100%</span></li>
                            <li className="pdoc-step"><span className="pdoc-step-num">3</span><span className="pdoc-step-text"><strong>Read Contract</strong> → xem giá trị hiện tại (fee, LTV...)</span></li>
                            <li className="pdoc-step"><span className="pdoc-step-num">4</span><span className="pdoc-step-text"><strong>Events</strong> → xem lịch sử mọi thay đổi</span></li>
                        </ol>
                    </div>

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">8.7 Nâng cấp logic code — Deploy contract mới</h3>
                        <p className="pdoc-text">Khi cần thay đổi <strong>logic code</strong>, phải deploy V3 mới và migrate:</p>
                        <ol className="pdoc-steps">
                            <li className="pdoc-step"><span className="pdoc-step-num">1</span><span className="pdoc-step-text"><strong>Audit + Test</strong> — Review code V3, chạy Slither + Mythril, test trên BSC Testnet</span></li>
                            <li className="pdoc-step"><span className="pdoc-step-num">2</span><span className="pdoc-step-text"><strong>Thông báo 7+ ngày</strong> — Post lên Discord/Telegram/Twitter. Công khai source code V3</span></li>
                            <li className="pdoc-step"><span className="pdoc-step-num">3</span><span className="pdoc-step-text"><strong>Deploy V3</strong> lên Mainnet</span></li>
                            <li className="pdoc-step"><span className="pdoc-step-num">4</span><span className="pdoc-step-text"><strong>Pause V2 qua Timelock</strong> — Schedule pause → Chờ 48h → Execute. User có 48h burn + rút BNB</span></li>
                            <li className="pdoc-step"><span className="pdoc-step-num">5</span><span className="pdoc-step-text"><strong>Snapshot positions</strong> — Đọc <code>positions[user]</code> cho mọi user từ V2</span></li>
                            <li className="pdoc-step"><span className="pdoc-step-num">6</span><span className="pdoc-step-text"><strong>User tự migrate</strong> — Burn COW V2 → rút BNB → mint COW V3</span></li>
                            <li className="pdoc-step"><span className="pdoc-step-num">7</span><span className="pdoc-step-text"><strong>Update frontend</strong> — Cập nhật <code>cowConfig.ts</code> → Deploy → Thông báo hoàn tất</span></li>
                        </ol>
                    </div>

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">8.8 Script Migration — Snapshot dữ liệu</h3>
                        <CodeBlock lang="typescript">{`// scripts/snapshot-v2.ts
import { ethers } from "hardhat";

async function main() {
    // BSC Mainnet snapshot
    const V2 = "0x4C79D24eF2C1166c88375BCe730fdE8894f266Ab";
    const v2 = await ethers.getContractAt("COWToken", V2);

    // Lấy danh sách user qua event logs
    const events = await v2.queryFilter(
        v2.filters.Minted(), 0, "latest"
    );
    const users = [...new Set(
        events.map(e => e.args?.user)
    )];

    // Snapshot positions
    const snapshot = [];
    for (const user of users) {
        const [collateral, cowMinted] =
            await v2.getPosition(user);
        if (cowMinted > 0n) {
            snapshot.push({
                user,
                collateral: collateral.toString(),
                cowMinted: cowMinted.toString(),
            });
        }
    }

    const fs = require("fs");
    fs.writeFileSync("snapshot-v2.json",
        JSON.stringify(snapshot, null, 2));
    console.log("Saved", snapshot.length, "positions");
}`}</CodeBlock>
                    </div>

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">8.9 Tương lai — Proxy Upgradeable Pattern</h3>
                        <div className="pdoc-table-wrapper">
                            <table className="pdoc-table">
                                <thead><tr><th>Pattern</th><th>Ưu điểm</th><th>Nhược điểm</th></tr></thead>
                                <tbody>
                                    <tr><td><strong>Non-upgradeable (hiện tại)</strong></td><td>Đơn giản, dễ audit, trust tuyệt đối</td><td>Migration phức tạp khi nâng cấp</td></tr>
                                    <tr><td><strong>UUPS Proxy</strong></td><td>Upgrade dễ, giữ nguyên address</td><td>Phức tạp hơn, risk nếu logic sai</td></tr>
                                    <tr><td><strong>Transparent Proxy</strong></td><td>Admin/user tách biệt, an toàn</td><td>Gas cao hơn, cần proxy admin</td></tr>
                                    <tr><td><strong>Diamond (EIP-2535)</strong></td><td>Modular, upgrade từng phần</td><td>Rất phức tạp, khó audit</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* ═══ SECTION 9: Liquidation Guide ═══ */}
                    <Section id="liquidation" title={t('smartContract.s9Title')} accent="orange"
                        icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /><line x1="8" y1="21" x2="16" y2="21" /></svg>} />

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">{t('smartContract.s9_1Title')}</h3>
                        <p className="pdoc-text" dangerouslySetInnerHTML={{ __html: t('smartContract.s9_1Text') }} />
                        <div className="pdoc-formula">
                            <p className="pdoc-formula-line"><strong>{t('smartContract.s9_1FormulaTitle')}</strong></p>
                            <p className="pdoc-formula-line" dangerouslySetInnerHTML={{ __html: t('smartContract.s9_1Formula1') }} />
                            <p className="pdoc-formula-line" dangerouslySetInnerHTML={{ __html: t('smartContract.s9_1Formula2') }} />
                        </div>
                        <p className="pdoc-text" style={{ marginTop: '16px' }}><strong>{t('smartContract.s9_1TableTitle')}</strong></p>
                        <div className="pdoc-table-wrapper">
                            <table className="pdoc-table">
                                <thead><tr><th>{t('smartContract.s9_1H_ratio')}</th><th>{t('smartContract.s9_1H_status')}</th><th>{t('smartContract.s9_1H_action')}</th></tr></thead>
                                <tbody>
                                    <tr><td>{t('smartContract.s9_1R1_ratio')}</td><td>{t('smartContract.s9_1R1_status')}</td><td>{t('smartContract.s9_1R1_action')}</td></tr>
                                    <tr><td>{t('smartContract.s9_1R2_ratio')}</td><td>{t('smartContract.s9_1R2_status')}</td><td>{t('smartContract.s9_1R2_action')}</td></tr>
                                    <tr><td>{t('smartContract.s9_1R3_ratio')}</td><td>{t('smartContract.s9_1R3_status')}</td><td>{t('smartContract.s9_1R3_action')}</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">{t('smartContract.s9_2Title')}</h3>
                        <p className="pdoc-text">{t('smartContract.s9_2Text')}</p>
                        <ol className="pdoc-steps">
                            <li className="pdoc-step"><span className="pdoc-step-num">1</span><span className="pdoc-step-text" dangerouslySetInnerHTML={{ __html: t('smartContract.s9_2S1') }} /></li>
                            <li className="pdoc-step"><span className="pdoc-step-num">2</span><span className="pdoc-step-text" dangerouslySetInnerHTML={{ __html: t('smartContract.s9_2S2') }} /></li>
                            <li className="pdoc-step"><span className="pdoc-step-num">3</span><span className="pdoc-step-text" dangerouslySetInnerHTML={{ __html: t('smartContract.s9_2S3') }} /></li>
                            <li className="pdoc-step"><span className="pdoc-step-num">4</span><span className="pdoc-step-text" dangerouslySetInnerHTML={{ __html: t('smartContract.s9_2S4') }} /></li>
                            <li className="pdoc-step"><span className="pdoc-step-num">5</span><span className="pdoc-step-text" dangerouslySetInnerHTML={{ __html: t('smartContract.s9_2S5') }} /></li>
                        </ol>
                    </div>

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">{t('smartContract.s9_3Title')}</h3>
                        <p className="pdoc-text">{t('smartContract.s9_3Text')}</p>
                        <CodeBlock lang="typescript">{`import { ethers } from 'ethers';
import { COW_TOKEN_ABI, getCOWTokenAddress } from '../contracts/cowConfig';

async function checkAndLiquidate(targetUser: string) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const chainId = (await provider.getNetwork()).chainId.toString(16);
    const address = getCOWTokenAddress('0x' + chainId);
    const contract = new ethers.Contract(address!, COW_TOKEN_ABI, signer);

    // Step 1: Check collateral ratio
    const ratio = await contract.getCollateralRatio(targetUser);
    console.log('Collateral Ratio:', ratio.toString(), 'bps');

    // Step 2: Check if eligible (< 10500 bps = 105%)
    if (ratio < 10500n) {
        console.log('Position is undercollateralized! Liquidating...');

        // Step 3: Call liquidate
        const tx = await contract.liquidate(targetUser);
        const receipt = await tx.wait();
        console.log('Liquidation successful!', receipt.hash);

        // Liquidator receives 5% of collateral as BNB reward
    } else {
        console.log('Position is healthy, cannot liquidate.');
    }
}`}</CodeBlock>
                        <div className="pdoc-info-card pdoc-info-card--warning">
                            <span className="pdoc-info-card-icon">⚠️</span>
                            <span className="pdoc-info-card-text" dangerouslySetInnerHTML={{ __html: t('smartContract.s9_3Warn') }} />
                        </div>
                    </div>

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">{t('smartContract.s9_4Title')}</h3>
                        <h4 className="pdoc-subtitle" style={{ fontSize: '0.88rem', marginTop: '16px' }} dangerouslySetInnerHTML={{ __html: t('smartContract.s9_4RewardTitle') }} />
                        <ul className="pdoc-checklist">
                            <li className="pdoc-check"><CheckIcon /><span dangerouslySetInnerHTML={{ __html: t('smartContract.s9_4Reward1') }} /></li>
                            <li className="pdoc-check"><CheckIcon /><span dangerouslySetInnerHTML={{ __html: t('smartContract.s9_4Reward2') }} /></li>
                            <li className="pdoc-check"><CheckIcon /><span dangerouslySetInnerHTML={{ __html: t('smartContract.s9_4Reward3') }} /></li>
                        </ul>
                        <h4 className="pdoc-subtitle" style={{ fontSize: '0.88rem', marginTop: '16px' }} dangerouslySetInnerHTML={{ __html: t('smartContract.s9_4RiskTitle') }} />
                        <ul className="pdoc-checklist">
                            <li className="pdoc-check"><CheckIcon /><span dangerouslySetInnerHTML={{ __html: t('smartContract.s9_4Risk1') }} /></li>
                            <li className="pdoc-check"><CheckIcon /><span dangerouslySetInnerHTML={{ __html: t('smartContract.s9_4Risk2') }} /></li>
                            <li className="pdoc-check"><CheckIcon /><span dangerouslySetInnerHTML={{ __html: t('smartContract.s9_4Risk3') }} /></li>
                        </ul>
                        <div className="pdoc-info-card pdoc-info-card--info" style={{ marginTop: '16px' }}>
                            <span className="pdoc-info-card-icon">💰</span>
                            <span className="pdoc-info-card-text">
                                <strong>{t('smartContract.s9_4ExampleTitle')}</strong><br />
                                <span dangerouslySetInnerHTML={{ __html: t('smartContract.s9_4ExampleText') }} />
                            </span>
                        </div>
                    </div>

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">{t('smartContract.s9_5Title')}</h3>
                        <p className="pdoc-text">{t('smartContract.s9_5Text')}</p>

                        <h4 className="pdoc-subtitle" style={{ fontSize: '0.88rem', marginTop: '16px' }}>{t('smartContract.s9_5Method1Title')}</h4>
                        <p className="pdoc-text" dangerouslySetInnerHTML={{ __html: t('smartContract.s9_5Method1Text') }} />
                        <CodeBlock lang="typescript">{`// Monitor all Minted events to find users with positions
const events = await contract.queryFilter(contract.filters.Minted());
const users = [...new Set(events.map(e => e.args?.user))];

// Check each user's collateral ratio
for (const user of users) {
    const ratio = await contract.getCollateralRatio(user);
    if (ratio < 10500n) { // < 105%
        console.log('Liquidatable:', user, 'ratio:', ratio.toString());
    }
}`}</CodeBlock>

                        <h4 className="pdoc-subtitle" style={{ fontSize: '0.88rem', marginTop: '16px' }}>{t('smartContract.s9_5Method2Title')}</h4>
                        <p className="pdoc-text" dangerouslySetInnerHTML={{ __html: t('smartContract.s9_5Method2Text') }} />

                        <div className="pdoc-info-card pdoc-info-card--security">
                            <span className="pdoc-info-card-icon">🛡️</span>
                            <span className="pdoc-info-card-text" dangerouslySetInnerHTML={{ __html: t('smartContract.s9_5Info') }} />
                        </div>
                    </div>

                    {/* ═══ SECTION 10: Verify Smart Contract on BscScan ═══ */}
                    <Section id="verify" title={t('smartContract.s10Title')} accent="teal"
                        icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>} />

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">{t('smartContract.s10_1Title')}</h3>
                        <p className="pdoc-text" dangerouslySetInnerHTML={{ __html: t('smartContract.s10_1Text') }} />
                        <ul className="pdoc-checklist">
                            <li className="pdoc-check"><CheckIcon /><span dangerouslySetInnerHTML={{ __html: t('smartContract.s10_1C1') }} /></li>
                            <li className="pdoc-check"><CheckIcon /><span dangerouslySetInnerHTML={{ __html: t('smartContract.s10_1C2') }} /></li>
                            <li className="pdoc-check"><CheckIcon /><span dangerouslySetInnerHTML={{ __html: t('smartContract.s10_1C3') }} /></li>
                            <li className="pdoc-check"><CheckIcon /><span dangerouslySetInnerHTML={{ __html: t('smartContract.s10_1C4') }} /></li>
                        </ul>
                    </div>

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">{t('smartContract.s10_2Title')}</h3>
                        <div className="pdoc-table-wrapper">
                            <table className="pdoc-table">
                                <thead><tr><th>{t('smartContract.s10_2H_req')}</th><th>{t('smartContract.s10_2H_detail')}</th></tr></thead>
                                <tbody>
                                    <tr><td><strong>BscScan API Key</strong></td><td dangerouslySetInnerHTML={{ __html: t('smartContract.s10_2R1') }} /></tr>
                                    <tr><td><strong>Environment Variable</strong></td><td dangerouslySetInnerHTML={{ __html: t('smartContract.s10_2R2') }} /></tr>
                                    <tr><td><strong>Hardhat Plugin</strong></td><td dangerouslySetInnerHTML={{ __html: t('smartContract.s10_2R3') }} /></tr>
                                    <tr><td><strong>Deployed Contract</strong></td><td>{t('smartContract.s10_2R4')}</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">{t('smartContract.s10_3Title')}</h3>
                        <p className="pdoc-text" dangerouslySetInnerHTML={{ __html: t('smartContract.s10_3Text') }} />

                        <h4 className="pdoc-subtitle" style={{ fontSize: '0.88rem', marginTop: '16px' }}>{t('smartContract.s10_3Step1Title')}</h4>
                        <p className="pdoc-text" dangerouslySetInnerHTML={{ __html: t('smartContract.s10_3Step1Text') }} />
                        <CodeBlock lang="typescript">{`// hardhat.config.ts
etherscan: {
    apiKey: {
        bsc: process.env.BSCSCAN_API_KEY || "",
        bscTestnet: process.env.BSCSCAN_API_KEY || "",
    },
    // No customChains needed for standard BSC/BSC Testnet in latest Hardhat
}`}</CodeBlock>

                        <h4 className="pdoc-subtitle" style={{ fontSize: '0.88rem', marginTop: '16px' }}>{t('smartContract.s10_3Step2Title')}</h4>
                        <p className="pdoc-text" dangerouslySetInnerHTML={{ __html: t('smartContract.s10_3Step2Text') }} />
                        <CodeBlock lang="bash">{`# Verify COWToken on BSC Mainnet
npx hardhat verify --network bsc \\
  0x4C79D24eF2C1166c88375BCe730fdE8894f266Ab \\
  "0xf8Ed2CD8b1C66c7700641E065b98B129141fd156" \\
  "0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE" \\
  "0xA820AA03894d60E7fcDe0B6C5Add291091fDF223" \\
  "0xA820AA03894d60E7fcDe0B6C5Add291091fDF223" \\
  8000 30 30 100

# Verify COWToken on BSC Testnet
npx hardhat verify --network bscTestnet \\
  0xA381f67E1c448d18569A2397B7e8BbD9D4DcD332 \\
  "0xEad577d7730bE3d191CbC4e6657816efE7507437" \\
  "0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526" \\
  "0xCaCf62df403bB440E2490ED1a741192dD48a10A0" \\
  "0xA820AA03894d60E7fcDe0B6C5Add291091fDF223" \\
  8000 30 30 100`}</CodeBlock>

                        <h4 className="pdoc-subtitle" style={{ fontSize: '0.88rem', marginTop: '16px' }}>{t('smartContract.s10_3Step3Title')}</h4>
                        <p className="pdoc-text" dangerouslySetInnerHTML={{ __html: t('smartContract.s10_3Step3Text') }} />
                        <CodeBlock lang="javascript">{`// arguments-timelock.js
const MIN_DELAY = 172800; // 48 hours in seconds
const PROPOSER = "0xYourDeployerAddress";
const EXECUTOR = "0xYourDeployerAddress";
const ADMIN = "0xYourDeployerAddress";

module.exports = [
    MIN_DELAY,
    [PROPOSER],  // proposers array
    [EXECUTOR],  // executors array
    ADMIN        // admin
];`}</CodeBlock>
                        <CodeBlock lang="bash">{`# Verify COWTimelock with arguments file
npx hardhat verify --network bscTestnet \\
  --constructor-args arguments-timelock.js \\
  0xYourTimelockAddress`}</CodeBlock>

                        <h4 className="pdoc-subtitle" style={{ fontSize: '0.88rem', marginTop: '16px' }}>{t('smartContract.s10_3Step4Title')}</h4>
                        <p className="pdoc-text">{t('smartContract.s10_3Step4Text')}</p>
                        <ul className="pdoc-checklist">
                            <li className="pdoc-check"><CheckIcon /><span dangerouslySetInnerHTML={{ __html: t('smartContract.s10_3Step4C1') }} /></li>
                            <li className="pdoc-check"><CheckIcon /><span dangerouslySetInnerHTML={{ __html: t('smartContract.s10_3Step4C2') }} /></li>
                            <li className="pdoc-check"><CheckIcon /><span dangerouslySetInnerHTML={{ __html: t('smartContract.s10_3Step4C3') }} /></li>
                            <li className="pdoc-check"><CheckIcon /><span dangerouslySetInnerHTML={{ __html: t('smartContract.s10_3Step4C4') }} /></li>
                        </ul>
                    </div>

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">{t('smartContract.s10_4Title')}</h3>
                        <p className="pdoc-text" dangerouslySetInnerHTML={{ __html: t('smartContract.s10_4Text') }} />
                        <ol className="pdoc-steps">
                            <li className="pdoc-step"><span className="pdoc-step-num">1</span><span className="pdoc-step-text" dangerouslySetInnerHTML={{ __html: t('smartContract.s10_4S1') }} /></li>
                            <li className="pdoc-step"><span className="pdoc-step-num">2</span><span className="pdoc-step-text" dangerouslySetInnerHTML={{ __html: t('smartContract.s10_4S2') }} /></li>
                            <li className="pdoc-step"><span className="pdoc-step-num">3</span><span className="pdoc-step-text" dangerouslySetInnerHTML={{ __html: t('smartContract.s10_4S3') }} /></li>
                            <li className="pdoc-step"><span className="pdoc-step-num">4</span><span className="pdoc-step-text" dangerouslySetInnerHTML={{ __html: t('smartContract.s10_4S4') }} /></li>
                            <li className="pdoc-step"><span className="pdoc-step-num">5</span><span className="pdoc-step-text" dangerouslySetInnerHTML={{ __html: t('smartContract.s10_4S5') }} /></li>
                            <li className="pdoc-step"><span className="pdoc-step-num">6</span><span className="pdoc-step-text" dangerouslySetInnerHTML={{ __html: t('smartContract.s10_4S6') }} /></li>
                            <li className="pdoc-step"><span className="pdoc-step-num">7</span><span className="pdoc-step-text" dangerouslySetInnerHTML={{ __html: t('smartContract.s10_4S7') }} /></li>
                        </ol>
                        <div className="pdoc-info-card pdoc-info-card--warning">
                            <span className="pdoc-info-card-icon">⚠️</span>
                            <span className="pdoc-info-card-text" dangerouslySetInnerHTML={{ __html: t('smartContract.s10_4Warn') }} />
                        </div>
                    </div>

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">{t('smartContract.s10_5Title')}</h3>
                        <p className="pdoc-text" dangerouslySetInnerHTML={{ __html: t('smartContract.s10_5Text') }} />
                        <ul className="pdoc-checklist">
                            <li className="pdoc-check"><CheckIcon /><span dangerouslySetInnerHTML={{ __html: t('smartContract.s10_5Method1') }} /></li>
                            <li className="pdoc-check"><CheckIcon /><span dangerouslySetInnerHTML={{ __html: t('smartContract.s10_5Method2') }} /></li>
                        </ul>
                        <CodeBlock lang="javascript">{`// arguments.js — for COWToken constructor
const { ethers } = require("ethers");

const args = [
    "0xTimelockAddress",     // initialOwner
    "0x2514895c7...526",     // priceFeed (Chainlink BNB/USD)
    "0xFeeCollectorAddress", // feeCollector
    "0xTreasury2Address",    // treasury2
    8000,                    // ltvBps (80%)
    30,                      // mintFeeBps (0.3%)
    30,                      // burnFeeBps (0.3%)
    100                      // spreadFeeBps (1%)
];

// ABI-encode the arguments
const encoded = ethers.AbiCoder.defaultAbiCoder().encode(
    ["address", "address", "address", "address",
     "uint256", "uint256", "uint256", "uint256"],
    args
);
console.log("Constructor Args (hex):", encoded);`}</CodeBlock>
                    </div>

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">{t('smartContract.s10_6Title')}</h3>
                        <div className="pdoc-table-wrapper">
                            <table className="pdoc-table">
                                <thead><tr><th>{t('smartContract.s10_6H_error')}</th><th>{t('smartContract.s10_6H_cause')}</th><th>{t('smartContract.s10_6H_fix')}</th></tr></thead>
                                <tbody>
                                    <tr><td dangerouslySetInnerHTML={{ __html: t('smartContract.s10_6R1_error') }} /><td>{t('smartContract.s10_6R1_cause')}</td><td>{t('smartContract.s10_6R1_fix')}</td></tr>
                                    <tr><td dangerouslySetInnerHTML={{ __html: t('smartContract.s10_6R2_error') }} /><td>{t('smartContract.s10_6R2_cause')}</td><td dangerouslySetInnerHTML={{ __html: t('smartContract.s10_6R2_fix') }} /></tr>
                                    <tr><td dangerouslySetInnerHTML={{ __html: t('smartContract.s10_6R3_error') }} /><td>{t('smartContract.s10_6R3_cause')}</td><td dangerouslySetInnerHTML={{ __html: t('smartContract.s10_6R3_fix') }} /></tr>
                                    <tr><td dangerouslySetInnerHTML={{ __html: t('smartContract.s10_6R4_error') }} /><td>{t('smartContract.s10_6R4_cause')}</td><td>{t('smartContract.s10_6R4_fix')}</td></tr>
                                    <tr><td dangerouslySetInnerHTML={{ __html: t('smartContract.s10_6R5_error') }} /><td>{t('smartContract.s10_6R5_cause')}</td><td>{t('smartContract.s10_6R5_fix')}</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="pdoc-info-card pdoc-info-card--info" style={{ marginTop: '16px' }}>
                            <span className="pdoc-info-card-icon">💡</span>
                            <span className="pdoc-info-card-text">
                                <strong>Pro tip:</strong> {t('smartContract.s10_3Step1Text')}
                            </span>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="pdoc-footer">
                        <p className="pdoc-footer-text">
                            📝 Smart Contract Guide cập nhật lần cuối: <strong>14/03/2026</strong> &nbsp;·&nbsp; © 2026 TokenDev Development Team
                        </p>
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
}

/* ── Helper Components ───────────────────────────── */

function Section({ id, title, accent, icon }: {
    id: string;
    title: string;
    accent: string;
    icon: React.ReactNode;
}) {
    return (
        <section id={id} className="pdoc-section">
            <div className="pdoc-section-header">
                <span className={`pdoc-section-icon pdoc-section-icon--${accent}`}>{icon}</span>
                <h2>{title}</h2>
            </div>
        </section>
    );
}

function CodeBlock({ lang, children }: { lang: string; children: string }) {
    return (
        <div className="pdoc-code-wrapper">
            <div className="pdoc-code-header">
                <span className="pdoc-code-dots"><span /><span /><span /></span>
                <span className="pdoc-code-lang">{lang}</span>
            </div>
            <pre className="pdoc-code"><code>{children}</code></pre>
        </div>
    );
}

function CheckIcon() {
    return (
        <svg className="pdoc-check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    );
}
