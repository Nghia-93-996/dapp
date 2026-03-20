import { Link } from 'react-router-dom';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { Footer } from '../components/Footer';
import './DocumentationPage.css';

/* ── Sidebar navigation config ────────────────────── */
const sections = [
    { id: 'overview', title: '1. Tổng quan', accent: 'purple', icon: '📖' },
    { id: 'installation', title: '2. Cài đặt & Triển khai', accent: 'green', icon: '🚀' },
    { id: 'user-guide', title: '3. Hướng dẫn sử dụng', accent: 'cyan', icon: '📋' },
    { id: 'folder-structure', title: '4. Cấu trúc thư mục', accent: 'amber', icon: '📂' },
    { id: 'troubleshooting', title: '5. Xử lý lỗi & Bảo trì', accent: 'red', icon: '🛠' },
    { id: 'support', title: '6. Liên hệ & Hỗ trợ', accent: 'blue', icon: '📞' },
];

export default function DocumentationPage() {
    return (
        <div className="pdoc-page">
            {/* ─── Header ─────────────────────────────────── */}
            <header className="pdoc-header">
                <div className="pdoc-header-content">
                    <Link to="/" className="logo">
                        <div className="logo-icon-wrapper">
                            <img src="/media/cow_sp.gif" alt="COW Logo" className="logo-img" />
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
                            Quay lại ứng dụng
                        </Link>
                    </div>
                </div>
            </header>

            <div className="pdoc-layout">
                {/* ─── Sidebar ────────────────────────────── */}
                <aside className="pdoc-sidebar">
                    <nav className="pdoc-nav">
                        <span className="pdoc-nav-label">Tài liệu sản phẩm</span>
                        {sections.map((s) => (
                            <a key={s.id} href={`#${s.id}`} className="pdoc-nav-link">
                                <span className={`pdoc-nav-icon pdoc-nav-icon--${s.accent}`}>{s.icon}</span>
                                {s.title}
                            </a>
                        ))}
                    </nav>
                </aside>

                {/* ─── Main Content ───────────────────────── */}
                <main className="pdoc-main">
                    {/* Hero */}
                    <div className="pdoc-hero">
                        <div className="pdoc-hero-badge">
                            <span className="badge-dot" />
                            Product Documentation
                            <span style={{ opacity: 0.5 }}>v1.0.0</span>
                        </div>
                        <h1 className="pdoc-hero-title">
                            Tài liệu hướng dẫn sử dụng <span className="gradient-text">COW Stablecoin</span>
                        </h1>
                        <div className="pdoc-hero-meta">
                            <span className="pdoc-meta-item">
                                <strong>Phiên bản:</strong> 1.0.0
                            </span>
                            <span className="pdoc-meta-item">
                                <strong>Cập nhật:</strong> 13/03/2026
                            </span>
                            <span className="pdoc-meta-item">
                                <strong>Phát triển:</strong> TokenDev Development Team
                            </span>
                        </div>
                        <p className="pdoc-hero-desc">
                            Tài liệu chính thức hướng dẫn cài đặt, sử dụng và bảo trì sản phẩm COW Stablecoin — COW Token Protocol trên BNB Smart Chain.
                        </p>
                    </div>

                    {/* ═══ SECTION 1: Overview ═══ */}
                    <Section id="overview" title="1. Giới thiệu tổng quan (Overview)" accent="purple"
                        icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>} />

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">1.1 Mục đích sản phẩm</h3>
                        <p className="pdoc-text">
                            <strong>COW Stablecoin</strong> là một ứng dụng phi tập trung (DApp) cho phép người dùng tương tác với smart contract <strong>COW Token</strong> trên mạng lưới <strong>BNB Smart Chain (BSC)</strong>. Sản phẩm cung cấp giải pháp <strong>token bảo chứng bằng tài sản thế chấp</strong> (Collateralized Reserve Token), nơi mỗi token COW đều được bảo đảm bởi BNB trong treasury.
                        </p>
                    </div>

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">1.2 Đối tượng sử dụng</h3>
                        <div className="pdoc-table-wrapper">
                            <table className="pdoc-table">
                                <thead><tr><th>Đối tượng</th><th>Mô tả</th></tr></thead>
                                <tbody>
                                    <tr><td>Người dùng cuối</td><td>Người muốn mint/burn token COW thông qua giao diện web</td></tr>
                                    <tr><td>Nhà phát triển</td><td>Đội ngũ kỹ thuật cần triển khai, bảo trì hệ thống</td></tr>
                                    <tr><td>Khách hàng</td><td>Đối tác nhận bàn giao sản phẩm</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">1.3 Chức năng chính</h3>
                        <div className="pdoc-table-wrapper">
                            <table className="pdoc-table">
                                <thead><tr><th>#</th><th>Chức năng</th><th>Mô tả</th></tr></thead>
                                <tbody>
                                    <tr><td>1</td><td><strong>Mint COW Token</strong></td><td>Nạp BNB làm tài sản thế chấp → Nhận COW token theo tỷ lệ LTV dựa trên giá BNB/USD thời gian thực từ Chainlink Oracle</td></tr>
                                    <tr><td>2</td><td><strong>Burn COW Token</strong></td><td>Đốt COW token → Nhận lại BNB tương ứng từ tài sản thế chấp cá nhân</td></tr>
                                    <tr><td>3</td><td><strong>Liquidation</strong></td><td>Thanh lý vị thế dưới ngưỡng thế chấp (dưới 105%), bất kỳ ai cũng có thể thực hiện và nhận thưởng 5%</td></tr>
                                    <tr><td>4</td><td><strong>Treasury Dashboard</strong></td><td>Bảng điều khiển hiển thị tổng tài sản thế chấp, tổng cung, tỷ lệ bảo chứng, giá BNB/USD</td></tr>
                                    <tr><td>5</td><td><strong>Multi-language</strong></td><td>Hỗ trợ 3 ngôn ngữ: Tiếng Anh, Tiếng Việt, Tiếng Trung</td></tr>
                                    <tr><td>6</td><td><strong>Multi-network</strong></td><td>Chuyển đổi mạng BSC Mainnet / BSC Testnet</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">1.4 Thông số Smart Contract</h3>
                        <div className="pdoc-table-wrapper">
                            <table className="pdoc-table">
                                <thead><tr><th>Thông số</th><th>Giá trị</th></tr></thead>
                                <tbody>
                                    <tr><td>Tên token</td><td>COW Token</td></tr>
                                    <tr><td>Ký hiệu</td><td>COW</td></tr>
                                    <tr><td>Standard</td><td>ERC-20 (OpenZeppelin v5)</td></tr>
                                    <tr><td>Blockchain</td><td>BNB Smart Chain</td></tr>
                                    <tr><td>Solidity</td><td>0.8.24</td></tr>
                                    <tr><td>LTV mặc định</td><td>80% (8000 bps)</td></tr>
                                    <tr><td>Spread Fee</td><td>1% (100 bps) → Treasury</td></tr>
                                    <tr><td>Mint Fee</td><td>0.3% (30 bps) → Fee Collector</td></tr>
                                    <tr><td>Burn Fee</td><td>0.3% (30 bps) → Fee Collector</td></tr>
                                    <tr><td>Fee Cap tối đa</td><td>5% (500 bps)</td></tr>
                                    <tr><td>Liquidation Threshold</td><td>105% (10500 bps)</td></tr>
                                    <tr><td>Liquidation Penalty</td><td>5% (500 bps)</td></tr>
                                    <tr><td>Oracle</td><td>Chainlink BNB/USD (max staleness: 1 giờ)</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">1.5 Mô hình bảo mật (Anti-Rug-Pull)</h3>
                        <ul className="pdoc-checklist">
                            <li className="pdoc-check"><svg className="pdoc-check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>KHÔNG CÓ hàm <strong>withdraw()</strong> cho admin — BNB chỉ ra khỏi contract qua burn hoặc liquidation</li>
                            <li className="pdoc-check"><svg className="pdoc-check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>KHÔNG CÓ hàm admin <strong>mint()</strong> — Token chỉ được tạo khi có tài sản thế chấp</li>
                            <li className="pdoc-check"><svg className="pdoc-check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg><strong>ReentrancyGuard</strong> — Chống tấn công reentrancy</li>
                            <li className="pdoc-check"><svg className="pdoc-check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg><strong>Pausable</strong> — Admin có thể tạm dừng contract khi khẩn cấp</li>
                            <li className="pdoc-check"><svg className="pdoc-check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg><strong>Ownable + TimelockController</strong> — Mọi thay đổi admin có thời gian chờ 48 giờ</li>
                        </ul>
                    </div>

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">1.6 Địa chỉ Contract (BSC Testnet)</h3>
                        <div className="pdoc-table-wrapper">
                            <table className="pdoc-table">
                                <thead><tr><th>Contract</th><th>Địa chỉ</th><th>Explorer</th></tr></thead>
                                <tbody>
                                    <tr><td><strong>COWToken</strong></td><td><code>0x6b0E49E7141700B4DAec5Ab1215e170d4beE83c8</code></td><td><a href="https://testnet.bscscan.com/address/0x6b0E49E7141700B4DAec5Ab1215e170d4beE83c8" target="_blank" rel="noopener noreferrer">Xem trên BscScan</a></td></tr>
                                    <tr><td><strong>COWTimelock</strong></td><td><code>0x01487E36Ec2Bd4b34885F3DF31d59D8451A86413</code></td><td><a href="https://testnet.bscscan.com/address/0x01487E36Ec2Bd4b34885F3DF31d59D8451A86413" target="_blank" rel="noopener noreferrer">Xem trên BscScan</a></td></tr>
                                    <tr><td><strong>Fee Collector</strong></td><td><code>0x65E8c1434E348EE409A0d6488b9e293C3fFdd998</code></td><td>—</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* ═══ SECTION 2: Installation ═══ */}
                    <Section id="installation" title="2. Hướng dẫn cài đặt & Triển khai" accent="green"
                        icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>} />

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">2.1 Yêu cầu hệ thống</h3>
                        <div className="pdoc-table-wrapper">
                            <table className="pdoc-table">
                                <thead><tr><th>Thành phần</th><th>Phiên bản tối thiểu</th></tr></thead>
                                <tbody>
                                    <tr><td><strong>Node.js</strong></td><td>≥ 22.0.0</td></tr>
                                    <tr><td><strong>Yarn</strong></td><td>≥ 1.22 (hoặc npm ≥ 10)</td></tr>
                                    <tr><td><strong>Trình duyệt</strong></td><td>Chrome / Firefox / Brave (có cài MetaMask)</td></tr>
                                    <tr><td><strong>MetaMask</strong></td><td>Phiên bản mới nhất</td></tr>
                                    <tr><td><strong>Git</strong></td><td>≥ 2.30</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">2.2 Công nghệ sử dụng</h3>
                        <div className="pdoc-table-wrapper">
                            <table className="pdoc-table">
                                <thead><tr><th>Tầng</th><th>Công nghệ</th></tr></thead>
                                <tbody>
                                    <tr><td><strong>Frontend</strong></td><td>React 19 + TypeScript + Vite 7</td></tr>
                                    <tr><td><strong>Web3</strong></td><td>ethers.js v6</td></tr>
                                    <tr><td><strong>Smart Contracts</strong></td><td>Solidity 0.8.24 + Hardhat</td></tr>
                                    <tr><td><strong>Thư viện SC</strong></td><td>OpenZeppelin v5 (ERC-20, Ownable, Pausable, ReentrancyGuard, TimelockController)</td></tr>
                                    <tr><td><strong>Đa ngôn ngữ</strong></td><td>react-i18next (EN / VI / ZH)</td></tr>
                                    <tr><td><strong>Thông báo</strong></td><td>react-toastify</td></tr>
                                    <tr><td><strong>Routing</strong></td><td>react-router-dom v7</td></tr>
                                    <tr><td><strong>E2E Testing</strong></td><td>Playwright</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">2.3 Cài đặt Frontend</h3>
                        <CodeBlock lang="bash">{`# 1. Clone repository
git clone \u003cREPOSITORY_URL\u003e
cd dapp-web3

# 2. Cài đặt dependencies
yarn install

# 3. Chạy development server
yarn dev`}</CodeBlock>
                        <div className="pdoc-info-card pdoc-info-card--info">
                            <span className="pdoc-info-card-icon">🌐</span>
                            <span className="pdoc-info-card-text">Mở trình duyệt tại: <strong>http://localhost:5173</strong></span>
                        </div>
                    </div>

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">2.4 Cài đặt Smart Contract (Dành cho kỹ thuật)</h3>
                        <CodeBlock lang="bash">{`# 1. Di chuyển vào thư mục contracts
cd contracts

# 2. Cài đặt dependencies
npm install

# 3. Biên dịch smart contracts
npx hardhat compile

# 4. Chạy unit tests
npx hardhat test

# 5. Deploy lên BSC Testnet
DEPLOYER_PRIVATE_KEY=0x_YOUR_PRIVATE_KEY \\
  npx hardhat run scripts/deploy.ts --network bscTestnet`}</CodeBlock>
                        <div className="pdoc-info-card pdoc-info-card--warning">
                            <span className="pdoc-info-card-icon">⚠️</span>
                            <span className="pdoc-info-card-text">Private key cần được bảo mật tuyệt đối, <strong>KHÔNG commit vào git</strong>.</span>
                        </div>
                    </div>

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">2.5 Build Production</h3>
                        <CodeBlock lang="bash">{`# Build frontend cho production
yarn build

# Preview bản build
yarn preview`}</CodeBlock>
                    </div>

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">2.6 Chạy E2E Tests</h3>
                        <CodeBlock lang="bash">{`# Chạy toàn bộ Playwright E2E tests
yarn test:e2e

# Chạy với giao diện Playwright UI
yarn test:e2e:ui`}</CodeBlock>
                    </div>

                    {/* ═══ SECTION 3: User Guide ═══ */}
                    <Section id="user-guide" title="3. Hướng dẫn sử dụng (User Guide)" accent="cyan"
                        icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="22" height="18" rx="3" ry="3" /><line x1="1" y1="9" x2="23" y2="9" /></svg>} />

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">3.1 Kết nối ví MetaMask</h3>
                        <ol className="pdoc-steps">
                            <li className="pdoc-step"><span className="pdoc-step-num">1</span><span className="pdoc-step-text">Cài đặt extension <strong>MetaMask</strong> trên trình duyệt từ <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer">metamask.io</a></span></li>
                            <li className="pdoc-step"><span className="pdoc-step-num">2</span><span className="pdoc-step-text">Tạo hoặc import ví MetaMask</span></li>
                            <li className="pdoc-step"><span className="pdoc-step-num">3</span><span className="pdoc-step-text">Truy cập ứng dụng tại <code>http://localhost:5173</code> (local) hoặc domain đã triển khai</span></li>
                            <li className="pdoc-step"><span className="pdoc-step-num">4</span><span className="pdoc-step-text">Nhấn nút <strong>"Connect MetaMask"</strong> trên trang chủ hoặc nút ví ở thanh header</span></li>
                            <li className="pdoc-step"><span className="pdoc-step-num">5</span><span className="pdoc-step-text">Xác nhận kết nối trong popup MetaMask</span></li>
                        </ol>
                        <div className="pdoc-info-card pdoc-info-card--security">
                            <span className="pdoc-info-card-icon">✅</span>
                            <span className="pdoc-info-card-text">Sau khi kết nối thành công, giao diện sẽ hiển thị địa chỉ ví, số dư BNB, số dư COW và các panel thao tác.</span>
                        </div>
                    </div>

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">3.2 Chuyển đổi mạng (Network Switching)</h3>
                        <p className="pdoc-text">
                            Ứng dụng hỗ trợ chuyển đổi giữa <strong>BSC Mainnet</strong> (Chain ID: 56) và <strong>BSC Testnet</strong> (Chain ID: 97). Nhấn vào <strong>Network Switcher</strong> trên thanh header → Chọn mạng mong muốn → MetaMask sẽ yêu cầu xác nhận.
                        </p>
                        <div className="pdoc-info-card pdoc-info-card--info">
                            <span className="pdoc-info-card-icon">💡</span>
                            <span className="pdoc-info-card-text">Để thử nghiệm, nên sử dụng <strong>BSC Testnet</strong> với tBNB miễn phí từ <a href="https://www.bnbchain.org/en/testnet-faucet" target="_blank" rel="noopener noreferrer">BNB Faucet</a>.</span>
                        </div>
                    </div>

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">3.3 Mint COW Token (Nạp BNB → Nhận COW)</h3>
                        <ol className="pdoc-steps">
                            <li className="pdoc-step"><span className="pdoc-step-num">1</span><span className="pdoc-step-text">Chuyển sang tab <strong>"Mint"</strong> trong Action Panel</span></li>
                            <li className="pdoc-step"><span className="pdoc-step-num">2</span><span className="pdoc-step-text">Nhập số lượng <strong>BNB</strong> muốn nạp</span></li>
                            <li className="pdoc-step"><span className="pdoc-step-num">3</span><span className="pdoc-step-text">Hệ thống tự động hiển thị <strong>preview</strong>: số COW nhận được, spread fee, mint fee</span></li>
                            <li className="pdoc-step"><span className="pdoc-step-num">4</span><span className="pdoc-step-text">Nhấn nút <strong>"Mint COW"</strong></span></li>
                            <li className="pdoc-step"><span className="pdoc-step-num">5</span><span className="pdoc-step-text">Xác nhận giao dịch trong <strong>MetaMask</strong></span></li>
                            <li className="pdoc-step"><span className="pdoc-step-num">6</span><span className="pdoc-step-text">Chờ giao dịch được xác nhận trên blockchain</span></li>
                            <li className="pdoc-step"><span className="pdoc-step-num">7</span><span className="pdoc-step-text">Số dư COW sẽ được <strong>cập nhật tự động</strong></span></li>
                        </ol>

                        <h4 className="pdoc-subtitle" style={{ fontSize: '0.9rem', marginTop: '16px' }}>Công thức tính:</h4>
                        <div className="pdoc-formula">
                            <p className="pdoc-formula-line"><strong>USD Value</strong> = BNB × Giá BNB/USD (từ Chainlink)</p>
                            <p className="pdoc-formula-line"><strong>COW trước phí</strong> = USD Value × LTV (80%)</p>
                            <p className="pdoc-formula-line"><strong>Spread Fee</strong> = COW trước phí × 1%</p>
                            <p className="pdoc-formula-line"><strong>Mint Fee</strong> = COW trước phí × 0.3%</p>
                            <p className="pdoc-formula-line"><strong>COW nhận được</strong> = COW trước phí - Spread Fee - Mint Fee</p>
                        </div>
                    </div>

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">3.4 Burn COW Token (Đốt COW → Nhận lại BNB)</h3>
                        <ol className="pdoc-steps">
                            <li className="pdoc-step"><span className="pdoc-step-num">1</span><span className="pdoc-step-text">Chuyển sang tab <strong>"Burn"</strong> trong Action Panel</span></li>
                            <li className="pdoc-step"><span className="pdoc-step-num">2</span><span className="pdoc-step-text">Nhập số lượng <strong>COW</strong> muốn đốt</span></li>
                            <li className="pdoc-step"><span className="pdoc-step-num">3</span><span className="pdoc-step-text">Hệ thống hiển thị <strong>preview</strong>: số BNB nhận lại, spread fee, burn fee</span></li>
                            <li className="pdoc-step"><span className="pdoc-step-num">4</span><span className="pdoc-step-text">Nhấn nút <strong>"Burn COW"</strong></span></li>
                            <li className="pdoc-step"><span className="pdoc-step-num">5</span><span className="pdoc-step-text">Xác nhận giao dịch trong <strong>MetaMask</strong></span></li>
                            <li className="pdoc-step"><span className="pdoc-step-num">6</span><span className="pdoc-step-text">BNB sẽ được <strong>trả về ví</strong> sau khi giao dịch confirmed</span></li>
                        </ol>
                        <div className="pdoc-info-card pdoc-info-card--warning">
                            <span className="pdoc-info-card-icon">⚠️</span>
                            <span className="pdoc-info-card-text">Bạn chỉ có thể burn COW tối đa bằng số lượng đã mint (theo vị thế thế chấp cá nhân).</span>
                        </div>
                    </div>

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">3.5 Xem Treasury Dashboard</h3>
                        <p className="pdoc-text">Sau khi kết nối ví, phần <strong>Treasury Dashboard</strong> sẽ hiển thị:</p>
                        <div className="pdoc-table-wrapper">
                            <table className="pdoc-table">
                                <thead><tr><th>Chỉ số</th><th>Mô tả</th></tr></thead>
                                <tbody>
                                    <tr><td><strong>Total Collateral</strong></td><td>Tổng BNB đang được thế chấp trong contract</td></tr>
                                    <tr><td><strong>Total Supply</strong></td><td>Tổng COW token đang lưu hành</td></tr>
                                    <tr><td><strong>Backing Ratio</strong></td><td>Tỷ lệ bảo chứng (USD giá trị tài sản / tổng cung COW)</td></tr>
                                    <tr><td><strong>BNB Price</strong></td><td>Giá BNB/USD hiện tại từ Chainlink Oracle</td></tr>
                                    <tr><td><strong>Your Position</strong></td><td>Vị thế cá nhân: BNB locked, COW minted, collateral ratio</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">3.6 Xem lịch sử giao dịch</h3>
                        <p className="pdoc-text">
                            Phần <strong>Transaction History</strong> hiển thị danh sách các sự kiện Mint/Burn/Liquidate gần đây trên blockchain, bao gồm: loại giao dịch, số lượng token & BNB, phí đã trả, và link xem chi tiết trên BscScan.
                        </p>
                    </div>

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">3.7 Chuyển đổi ngôn ngữ</h3>
                        <p className="pdoc-text">
                            Nhấn vào <strong>Language Switcher</strong> trên thanh header → Chọn: 🇬🇧 English, 🇻🇳 Tiếng Việt, hoặc 🇨🇳 中文.
                        </p>
                    </div>

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">3.8 Trang Wallet & Documentation</h3>
                        <p className="pdoc-text">
                            Truy cập <code>/wallet</code> để xem trang quản lý ví chi tiết. Truy cập <code>/docs</code> để xem tài liệu kỹ thuật tích hợp sẵn trong ứng dụng.
                        </p>
                    </div>

                    {/* ═══ SECTION 4: Folder Structure ═══ */}
                    <Section id="folder-structure" title="4. Cấu trúc thư mục (Folder Structure)" accent="amber"
                        icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>} />

                    <div className="pdoc-block">
                        <div className="pdoc-tree-wrapper">
                            <pre className="pdoc-tree"><code>{`dapp-web3/
├── index.html                    # Entry point HTML
├── package.json                  # Dependencies & scripts
├── vite.config.ts                # Vite bundler configuration
│
├── src/                          # MÃ NGUỒN FRONTEND
│   ├── main.tsx                  # React entry point, routing
│   ├── App.tsx                   # Component chính, trang chủ
│   │
│   ├── components/               # React UI Components
│   │   ├── ActionPanel.tsx       # Panel Mint/Burn (core)
│   │   ├── WalletButton.tsx      # Nút kết nối ví
│   │   ├── WalletStats.tsx       # Hiển thị số dư
│   │   ├── NetworkSwitcher.tsx   # Chuyển đổi mạng
│   │   ├── LanguageSwitcher.tsx  # Chuyển ngôn ngữ
│   │   ├── TreasuryDashboard.tsx # Dashboard treasury
│   │   ├── TransactionHistory.tsx# Lịch sử giao dịch
│   │   └── ContractInfo.tsx      # Thông tin contract
│   │
│   ├── hooks/                    # React Custom Hooks
│   │   ├── useWallet.ts          # Quản lý MetaMask
│   │   ├── useCOWContract.ts     # COW Token contract
│   │   ├── useTransaction.ts     # Xử lý giao dịch
│   │   └── useTransactionHistory.ts
│   │
│   ├── contracts/cowConfig.ts    # ABI & địa chỉ contract
│   ├── config/networks.ts        # Cấu hình mạng
│   │
│   ├── i18n/locales/             # Đa ngôn ngữ
│   │   ├── en.json               # English
│   │   ├── vi.json               # Tiếng Việt
│   │   └── zh.json               # 中文
│   │
│   └── pages/                    # Các trang
│       ├── WalletPage.tsx        # Quản lý ví nâng cao
│       └── DocumentPage.tsx      # Tài liệu kỹ thuật
│
├── contracts/                    # SMART CONTRACTS
│   ├── contracts/
│   │   ├── COWToken.sol          # ⭐ Contract chính
│   │   └── COWTimelock.sol       # Timelock admin
│   ├── scripts/deploy.ts         # Script deploy
│   └── test/                     # Hardhat unit tests
│
└── e2e/                          # E2E TESTS (Playwright)`}</code></pre>
                        </div>
                    </div>

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">Giải thích các file quan trọng</h3>
                        <div className="pdoc-table-wrapper">
                            <table className="pdoc-table">
                                <thead><tr><th>File</th><th>Vai trò</th></tr></thead>
                                <tbody>
                                    <tr><td><code>src/App.tsx</code></td><td>Component gốc, layout chính, header, footer, tích hợp tất cả components</td></tr>
                                    <tr><td><code>src/hooks/useWallet.ts</code></td><td>Hook quản lý toàn bộ vòng đời kết nối MetaMask</td></tr>
                                    <tr><td><code>src/hooks/useCOWContract.ts</code></td><td>Hook gọi smart contract COW Token: số dư, preview, mint, burn</td></tr>
                                    <tr><td><code>src/components/ActionPanel.tsx</code></td><td>Panel Mint/Burn chính — input, validation, preview, gửi giao dịch</td></tr>
                                    <tr><td><code>src/contracts/cowConfig.ts</code></td><td>ABI tối giản (Human-Readable) & mapping địa chỉ contract theo chain</td></tr>
                                    <tr><td><code>src/config/networks.ts</code></td><td>Cấu hình tất cả mạng blockchain (BSC, ETH, Polygon, Arbitrum, Optimism…)</td></tr>
                                    <tr><td><code>contracts/COWToken.sol</code></td><td><strong>Smart contract chính</strong> — logic mint, burn, liquidation, oracle</td></tr>
                                    <tr><td><code>contracts/COWTimelock.sol</code></td><td>TimelockController — mọi thay đổi admin chờ 48 giờ</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* ═══ SECTION 5: Troubleshooting ═══ */}
                    <Section id="troubleshooting" title="5. Quản lý lỗi & Bảo trì (Troubleshooting)" accent="red"
                        icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>} />

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">5.1 Lỗi thường gặp phía Frontend</h3>
                        <div className="pdoc-table-wrapper">
                            <table className="pdoc-table">
                                <thead><tr><th>#</th><th>Lỗi</th><th>Nguyên nhân</th><th>Cách xử lý</th></tr></thead>
                                <tbody>
                                    <tr><td>1</td><td><strong>"MetaMask not detected"</strong></td><td>Chưa cài MetaMask</td><td>Cài extension từ metamask.io</td></tr>
                                    <tr><td>2</td><td><strong>"Wrong network"</strong></td><td>Ví ở mạng không được hỗ trợ</td><td>Chuyển sang BSC Testnet (Chain ID: 97)</td></tr>
                                    <tr><td>3</td><td><strong>"User rejected"</strong></td><td>Từ chối giao dịch trong MetaMask</td><td>Nhấn lại và chấp nhận</td></tr>
                                    <tr><td>4</td><td><strong>Trang trắng sau build</strong></td><td>Lỗi TypeScript / Vite</td><td>Chạy <code>yarn build</code> để xem chi tiết</td></tr>
                                    <tr><td>5</td><td><strong>Không hiển thị số dư COW</strong></td><td>Contract chưa deploy trên mạng</td><td>Chuyển sang BSC Testnet (0x61)</td></tr>
                                    <tr><td>6</td><td><strong>Giao dịch pending lâu</strong></td><td>Gas price thấp / mạng tắc</td><td>Tăng gas trong MetaMask</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">5.2 Lỗi thường gặp phía Smart Contract</h3>
                        <div className="pdoc-table-wrapper">
                            <table className="pdoc-table">
                                <thead><tr><th>#</th><th>Lỗi (Error)</th><th>Nguyên nhân</th><th>Cách xử lý</th></tr></thead>
                                <tbody>
                                    <tr><td>1</td><td><code>ZeroAmount()</code></td><td>Mint với 0 BNB</td><td>Nhập số BNB {'>'} 0</td></tr>
                                    <tr><td>2</td><td><code>InsufficientBalance</code></td><td>Burn nhiều hơn số dư</td><td>Giảm số lượng burn</td></tr>
                                    <tr><td>3</td><td><code>NoPosition()</code></td><td>Burn khi chưa có vị thế</td><td>Cần mint COW trước</td></tr>
                                    <tr><td>4</td><td><code>StalePrice</code></td><td>Giá Oracle cũ {'>'} 1 giờ</td><td>Chờ Chainlink cập nhật</td></tr>
                                    <tr><td>5</td><td><code>PositionHealthy</code></td><td>Thanh lý vị thế khỏe mạnh</td><td>Vị thế {'>'} 105%, không thể thanh lý</td></tr>
                                    <tr><td>6</td><td><code>TransferFailed()</code></td><td>Chuyển BNB thất bại</td><td>Kiểm tra contract, thử lại</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">5.3 Bảo trì định kỳ</h3>
                        <div className="pdoc-table-wrapper">
                            <table className="pdoc-table">
                                <thead><tr><th>Hạng mục</th><th>Tần suất</th><th>Hành động</th></tr></thead>
                                <tbody>
                                    <tr><td>Cập nhật dependencies</td><td>Hàng tháng</td><td><code>yarn upgrade --latest</code></td></tr>
                                    <tr><td>Kiểm tra health contract</td><td>Hàng tuần</td><td>Xem backing ratio trên dashboard, đảm bảo {'>'} 100%</td></tr>
                                    <tr><td>Backup private keys</td><td>Một lần</td><td>Lưu deployer + owner key ở nơi an toàn</td></tr>
                                    <tr><td>Giám sát Oracle</td><td>Liên tục</td><td>Đảm bảo Chainlink price feed hoạt động</td></tr>
                                    <tr><td>Review phí</td><td>Hàng quý</td><td>Điều chỉnh spread/mint/burn fees nếu cần</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">5.4 Các lệnh hữu ích</h3>
                        <CodeBlock lang="bash">{`# Kiểm tra lỗi TypeScript
yarn build

# Lint code
yarn lint

# Chạy E2E tests
yarn test:e2e

# Chạy Hardhat tests cho smart contract
cd contracts && npx hardhat test`}</CodeBlock>
                    </div>

                    {/* ═══ SECTION 6: Support ═══ */}
                    <Section id="support" title="6. Liên hệ & Hỗ trợ" accent="blue"
                        icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>} />

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">6.1 Thông tin liên hệ</h3>
                        <div className="pdoc-table-wrapper">
                            <table className="pdoc-table">
                                <thead><tr><th>Kênh</th><th>Chi tiết</th></tr></thead>
                                <tbody>

                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">6.2 Quy trình báo lỗi</h3>
                        <p className="pdoc-text">Khi gặp lỗi, vui lòng cung cấp:</p>
                        <ol className="pdoc-steps">
                            <li className="pdoc-step"><span className="pdoc-step-num">1</span><span className="pdoc-step-text"><strong>Mô tả lỗi</strong>: Lỗi gì, xảy ra ở đâu</span></li>
                            <li className="pdoc-step"><span className="pdoc-step-num">2</span><span className="pdoc-step-text"><strong>Các bước tái tạo</strong>: Bước 1 → Bước 2 → ...</span></li>
                            <li className="pdoc-step"><span className="pdoc-step-num">3</span><span className="pdoc-step-text"><strong>Kết quả mong đợi</strong> vs <strong>Kết quả thực tế</strong></span></li>
                            <li className="pdoc-step"><span className="pdoc-step-num">4</span><span className="pdoc-step-text"><strong>Ảnh chụp màn hình</strong> (nếu có)</span></li>
                            <li className="pdoc-step"><span className="pdoc-step-num">5</span><span className="pdoc-step-text"><strong>Thông tin môi trường</strong>: trình duyệt, MetaMask version, Chain ID, Console logs</span></li>
                        </ol>
                    </div>

                    <div className="pdoc-block">
                        <h3 className="pdoc-subtitle">6.3 Thời gian phản hồi (SLA)</h3>
                        <div className="pdoc-table-wrapper">
                            <table className="pdoc-table">
                                <thead><tr><th>Mức độ</th><th>Thời gian phản hồi</th><th>Ví dụ</th></tr></thead>
                                <tbody>
                                    <tr><td><span className="pdoc-sla-badge pdoc-sla-badge--critical">🔴 Critical</span></td><td>Trong vòng 4 giờ</td><td>Contract bị tấn công, mất funds</td></tr>
                                    <tr><td><span className="pdoc-sla-badge pdoc-sla-badge--high">🟡 High</span></td><td>Trong vòng 24 giờ</td><td>Không thể mint/burn, giao diện crash</td></tr>
                                    <tr><td><span className="pdoc-sla-badge pdoc-sla-badge--normal">🟢 Normal</span></td><td>Trong vòng 3 ngày</td><td>Lỗi hiển thị UI, dịch sai ngôn ngữ</td></tr>
                                    <tr><td><span className="pdoc-sla-badge pdoc-sla-badge--low">⚪ Low</span></td><td>Trong vòng 7 ngày</td><td>Đề xuất cải tiến, feature request</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="pdoc-footer">
                        <p className="pdoc-footer-text">
                            📝 Tài liệu được cập nhật lần cuối: <strong>13/03/2026</strong> &nbsp;·&nbsp; © 2026 TokenDev Development Team
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
