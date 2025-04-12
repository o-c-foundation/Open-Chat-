"use client";

import { useState } from "react";
import Link from "next/link";

const Footer = () => {
  const [cookieConsent, setCookieConsent] = useState(false);
  const [showConsentBanner, setShowConsentBanner] = useState(true);

  // Check if cookie consent is already stored
  useState(() => {
    if (typeof window !== 'undefined') {
      const storedConsent = localStorage.getItem("cookie-consent");
      if (storedConsent === "accepted") {
        setCookieConsent(true);
        setShowConsentBanner(false);
      }
    }
  });

  const acceptCookies = () => {
    setCookieConsent(true);
    setShowConsentBanner(false);
    localStorage.setItem("cookie-consent", "accepted");
  };

  return (
    <>
      {showConsentBanner && (
        <div className="fixed bottom-0 inset-x-0 z-50 p-3 sm:p-4 bg-cyber-dark/90 border-t border-cyber-blue/30">
          <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <p className="text-xs sm:text-sm text-gray-300 text-center sm:text-left">
              We use cookies to enhance your experience. By continuing to visit this site, you agree to our use of cookies.
            </p>
            <div className="flex gap-2">
              <button
                onClick={acceptCookies}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-cyber-blue hover:bg-cyber-blue/80 text-white rounded-md text-xs sm:text-sm transition-colors"
              >
                Accept
              </button>
              <Link
                href="/privacy"
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-transparent border border-cyber-blue/50 hover:border-cyber-blue text-cyber-blue rounded-md text-xs sm:text-sm transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-cyber-dark border-t border-cyber-blue/20 py-8 sm:py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="flex flex-col">
              <h3 className="text-cyber-blue font-semibold text-lg mb-3">OpenChat</h3>
              <p className="text-gray-400 text-xs sm:text-sm mb-4">
                A decentralized, testnet-only messaging platform for secure blockchain communication.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://github.com/your-repo/openchat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-cyber-blue transition-colors"
                  aria-label="GitHub"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
                <a
                  href="https://t.me/openchat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-cyber-blue transition-colors"
                  aria-label="Telegram"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.568 7.341c-.115.54-.399.674-.81.419l-2.248-1.66-1.075 1.037c-.125.125-.23.23-.468.23-.239 0-.199-.089-.283-.316l-.64-2.105-2.356-1.028c-.505-.174-.505-.537.117-.8l9.105-3.493c.424-.199.797.104.616.8z" />
                  </svg>
                </a>
                <a
                  href="mailto:contact@openchat.example.com"
                  className="text-gray-400 hover:text-cyber-blue transition-colors"
                  aria-label="Email"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="flex flex-col">
              <h3 className="text-cyber-blue font-semibold text-lg mb-3">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/tutorials" className="text-gray-400 hover:text-cyber-blue transition-colors text-xs sm:text-sm">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-400 hover:text-cyber-blue transition-colors text-xs sm:text-sm">
                    FAQ
                  </Link>
                </li>
                <li>
                  <a 
                    href="https://github.com/your-repo/openchat/issues" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-cyber-blue transition-colors text-xs sm:text-sm"
                  >
                    Report Issues
                  </a>
                </li>
              </ul>
            </div>

            <div className="flex flex-col">
              <h3 className="text-cyber-blue font-semibold text-lg mb-3">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/terms" className="text-gray-400 hover:text-cyber-blue transition-colors text-xs sm:text-sm">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-400 hover:text-cyber-blue transition-colors text-xs sm:text-sm">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/disclaimer" className="text-gray-400 hover:text-cyber-blue transition-colors text-xs sm:text-sm">
                    Data Use Disclaimer
                  </Link>
                </li>
              </ul>
            </div>

            <div className="flex flex-col">
              <h3 className="text-cyber-blue font-semibold text-lg mb-3">Newsletter</h3>
              <p className="text-gray-400 text-xs sm:text-sm mb-3">
                Subscribe to stay updated with the latest features and releases.
              </p>
              <form className="flex flex-col space-y-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="px-3 py-1.5 sm:py-2 bg-cyber-dark border border-cyber-blue/30 rounded-md focus:outline-none focus:ring-1 focus:ring-cyber-blue text-gray-300 text-xs sm:text-sm"
                />
                <button
                  type="submit"
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-cyber-blue hover:bg-cyber-blue/80 text-white rounded-md transition-colors text-xs sm:text-sm"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          <div className="mt-8 sm:mt-10 pt-4 sm:pt-6 border-t border-cyber-blue/10">
            <div className="text-center text-gray-500 text-xs sm:text-sm">
              <p>
                © {new Date().getFullYear()} OpenChat. All rights reserved.
                {" "}
                <a 
                  href="https://opencryptofoundation.com/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-cyber-blue hover:text-cyber-blue/80 transition-colors"
                >
                  Brought to you by The Open Crypto Foundation
                </a>
              </p>
              <p className="mt-2 max-w-3xl mx-auto">
                <strong>OpenChat Privacy and Data Use Disclaimer:</strong> This application operates exclusively on blockchain testnets.
                All data including messages and user information is stored on public test blockchains and should not contain sensitive information.
                No real cryptocurrency is used or required.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
