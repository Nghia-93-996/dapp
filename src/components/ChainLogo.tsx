import './ChainLogo.css';

interface ChainLogoProps {
    chainId: string | null;
    size?: number;
}

/**
 * Renders the official chain logo SVG for common networks.
 * Falls back to a colored dot for unknown chains.
 */
export function ChainLogo({ chainId, size = 18 }: ChainLogoProps) {
    switch (chainId) {
        // BNB Smart Chain (Mainnet + Testnet)
        case '0x38':
        case '0x61':
            return (
                <div className="chain-logo chain-logo-bnb" style={{ width: size, height: size }}>
                    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
                        <circle cx="16" cy="16" r="16" fill="#F0B90B" />
                        <path d="M16 6L11.6 10.4L13.4 12.2L16 9.6L18.6 12.2L20.4 10.4L16 6Z" fill="white" />
                        <path d="M22 12.4L20.2 14.2L22.8 16.8L25.4 14.2L22 12.4Z" fill="white" />
                        <path d="M10 12.4L6.6 14.2L9.2 16.8L11.8 14.2L10 12.4Z" fill="white" />
                        <path d="M16 14.2L13.4 16.8L15.2 18.6L16 19.4L16.8 18.6L18.6 16.8L16 14.2Z" fill="white" />
                        <path d="M11.8 19.4L9.2 16.8L6.6 19.4L9.2 22L11.8 19.4Z" fill="white" />
                        <path d="M22.8 16.8L20.2 19.4L22.8 22L25.4 19.4L22.8 16.8Z" fill="white" />
                        <path d="M16 21.2L13.4 18.6L11.6 20.4L16 24.8L20.4 20.4L18.6 18.6L16 21.2Z" fill="white" />
                    </svg>
                </div>
            );

        // Ethereum (Mainnet + Sepolia)
        case '0x1':
        case '0xaa36a7':
            return (
                <div className="chain-logo chain-logo-eth" style={{ width: size, height: size }}>
                    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
                        <circle cx="16" cy="16" r="16" fill="#627EEA" />
                        <path d="M16.5 4V13.07L23.97 16.26L16.5 4Z" fill="white" fillOpacity="0.6" />
                        <path d="M16.5 4L9 16.26L16.5 13.07V4Z" fill="white" />
                        <path d="M16.5 21.97V28L24 17.62L16.5 21.97Z" fill="white" fillOpacity="0.6" />
                        <path d="M16.5 28V21.97L9 17.62L16.5 28Z" fill="white" />
                        <path d="M16.5 20.57L24 16.26L16.5 13.07V20.57Z" fill="white" fillOpacity="0.2" />
                        <path d="M9 16.26L16.5 20.57V13.07L9 16.26Z" fill="white" fillOpacity="0.6" />
                    </svg>
                </div>
            );

        // Polygon
        case '0x89':
            return (
                <div className="chain-logo chain-logo-polygon" style={{ width: size, height: size }}>
                    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
                        <circle cx="16" cy="16" r="16" fill="#8247E5" />
                        <path d="M21.2 13.2C20.8 12.9 20.3 12.9 19.9 13.2L17.4 14.7L15.7 15.7L13.2 17.2C12.8 17.5 12.3 17.5 11.9 17.2L9.9 16C9.5 15.7 9.3 15.3 9.3 14.8V12.5C9.3 12 9.5 11.6 9.9 11.3L11.9 10.1C12.3 9.8 12.8 9.8 13.2 10.1L15.2 11.3C15.6 11.6 15.8 12 15.8 12.5V14L17.5 12.9V11.4C17.5 10.9 17.3 10.5 16.9 10.2L13.3 8.1C12.9 7.8 12.4 7.8 12 8.1L8.3 10.2C7.9 10.5 7.7 10.9 7.7 11.4V15.7C7.7 16.2 7.9 16.6 8.3 16.9L12 19C12.4 19.3 12.9 19.3 13.3 19L15.8 17.5L17.5 16.5L20 15C20.4 14.7 20.9 14.7 21.3 15L23.3 16.2C23.7 16.5 23.9 16.9 23.9 17.4V19.7C23.9 20.2 23.7 20.6 23.3 20.9L21.3 22.1C20.9 22.4 20.4 22.4 20 22.1L18 20.9C17.6 20.6 17.4 20.2 17.4 19.7V18.2L15.7 19.3V20.8C15.7 21.3 15.9 21.7 16.3 22L20 24.1C20.4 24.4 20.9 24.4 21.3 24.1L25 22C25.4 21.7 25.6 21.3 25.6 20.8V16.5C25.6 16 25.4 15.6 25 15.3L21.2 13.2Z" fill="white" />
                    </svg>
                </div>
            );

        // Arbitrum
        case '0xa4b1':
            return (
                <div className="chain-logo chain-logo-arb" style={{ width: size, height: size }}>
                    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
                        <circle cx="16" cy="16" r="16" fill="#2D374B" />
                        <path d="M18.5 11L16 16L20.5 23H24L18.5 11Z" fill="#28A0F0" />
                        <path d="M13.5 11L8 23H11.5L16 16L13.5 11Z" fill="white" />
                        <path d="M16 16L11.5 23H20.5L16 16Z" fill="#28A0F0" />
                    </svg>
                </div>
            );

        default:
            return (
                <div
                    className="chain-logo chain-logo-default"
                    style={{ width: size, height: size, background: '#8B5CF6' }}
                />
            );
    }
}
