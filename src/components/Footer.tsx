import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Footer.css';

export function Footer() {
  const { t } = useTranslation();

  const whitePaperUrl = 'https://coinofworldcow.gitbook.io/coinofworldcow-docs';

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="logo-icon-wrapper">
                <img src="/media/cow_sp.gif" alt="COW Logo" className="footer-logo-img" />
              </div>
              <span className="logo-text">COW <span className="logo-accent">Stablecoin</span></span>
            </div>
            <p className="footer-tagline">{t('footer.tagline')}</p>
            <div className="footer-socials">

              <a href="https://x.com/CoinOfTheWorld" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="X (Twitter)">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
              <a href="https://t.me/COWCommunityOfficial" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Telegram">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg>
              </a>
            </div>
            <a href={whitePaperUrl} target="_blank" rel="noopener noreferrer" className="footer-whitepaper-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              {t('footer.whitePaper')}
            </a>
          </div>

          {/* Quick Links */}
          <div className="footer-column">
            <h4 className="footer-heading">{t('footer.product')}</h4>
            <ul className="footer-links">
              <li><a href="/#mint">{t('footer.mintTokens')}</a></li>
              <li><a href="/#burn">{t('footer.burnTokens')}</a></li>
              <li><a href="/#swap">{t('footer.tokenSwap')}</a></li>
              <li><a href="/#staking">{t('footer.staking')}</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="footer-column">
            <h4 className="footer-heading">{t('footer.resources')}</h4>
            <ul className="footer-links">
              <li><Link to="/docs">{t('footer.documentation')}</Link></li>
              <li><Link to="/documentation">{t('footer.productDocs')}</Link></li>
              <li><Link to="/smart-contract">{t('footer.smartContractGuide')}</Link></li>
              <li><Link to="/wallet">{t('footer.walletPage')}</Link></li>
              <li><Link to="/testing-report">{t('footer.testingReport', 'Testing Report')}</Link></li>
            </ul>
          </div>

          {/* External Links */}
          <div className="footer-column">
            <h4 className="footer-heading">{t('footer.links')}</h4>
            <ul className="footer-links">
              <li><a href="https://ethereum.org" target="_blank" rel="noopener noreferrer">{t('footer.ethereum')}</a></li>
              <li><a href="https://metamask.io" target="_blank" rel="noopener noreferrer">{t('footer.metaMask')}</a></li>
              <li><a href="https://www.bnbchain.org" target="_blank" rel="noopener noreferrer">BNB Chain</a></li>
              <li><a href="#faq">{t('footer.faq')}</a></li>
            </ul>
          </div>


        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p className="footer-copyright">{t('footer.copyright')}</p>
          <div className="footer-bottom-links">
            <a href="#privacy">{t('footer.privacy')}</a>
            <span className="footer-divider">·</span>
            <a href="#terms">{t('footer.terms')}</a>
            <span className="footer-divider">·</span>
            <a href="#cookies">{t('footer.cookies')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
