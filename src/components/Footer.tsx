import React from 'react';
import { Rocket, Mail, MessageSquareHeart } from 'lucide-react';

function Footer() {
  return (
    <footer className="mt-12 sm:mt-16 pb-6 sm:pb-8 text-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-custom-darkest">
            <span>Tool by Maurice Greenland</span>
            <Rocket className="w-5 sm:w-6 h-5 sm:h-6 text-custom-primary" />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
            <a
              href="https://getck.mauricegreenland.com/ai-odyssey-newsletter-signup"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-custom-primary hover:text-custom-primary-dark font-medium transition-colors touch-manipulation"
            >
              <Mail className="w-5 h-5" />
              <span>Get our FREE AI Newsletter</span>
            </a>

            <a
              href="https://senja.io/p/maurice-greenland/r/UZsE1h"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-custom-primary hover:text-custom-primary-dark font-medium transition-colors touch-manipulation"
            >
              <MessageSquareHeart className="w-5 h-5" />
              <span>Share your thoughts!</span>
            </a>
          </div>

          <p className="text-custom-medium-gray max-w-2xl text-sm sm:text-base px-4">
            This tool uses AI to generate SEO-optimized meta title suggestions. Results may vary and should be reviewed for accuracy.
          </p>

          <a
            href="https://mauricegreenland.com/free-ai-tools-for-bloggers"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 sm:px-8 py-3 bg-custom-darkest text-white rounded-full hover:bg-custom-dark-gray transition-colors font-medium touch-manipulation min-h-[48px] flex items-center justify-center"
          >
            More Free Tools
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;