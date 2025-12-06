import { useState, useEffect } from 'react';
import '../styles/components.css';

function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(true); // Always start with true to show button

  useEffect(() => {
    // Create a global variable to store the prompt event
    window.deferredPromptEvent = null;
    
    // Handler for beforeinstallprompt event
    const beforeInstallPromptHandler = (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      window.deferredPromptEvent = e;
      setDeferredPrompt(e);
      // Update UI to show the install button
      setIsInstallable(true);
      console.log('App can be installed, showing install button');
    };

    // Handler for appinstalled event
    const appInstalledHandler = () => {
      // Log the installation to analytics
      console.log('PWA was installed');
    };

    // Add event listeners
    window.addEventListener('beforeinstallprompt', beforeInstallPromptHandler);
    window.addEventListener('appinstalled', appInstalledHandler);

    // Check if the app is already in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('App is already installed, but still showing button for testing');
    }

    return () => {
      // Remove event listeners with the same handler references
      window.removeEventListener('beforeinstallprompt', beforeInstallPromptHandler);
      window.removeEventListener('appinstalled', appInstalledHandler);
    };
  }, []);

  const handleInstallClick = async () => {
    // Try to use the stored prompt event first
    const promptEvent = window.deferredPromptEvent || deferredPrompt;
    
    if (!promptEvent) {
      console.log('No installation prompt available, trying alternative methods');
      
      // Check if it's iOS
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      
      if (isIOS) {
        // Show iOS-specific instructions
        alert('To install this app on iOS: tap the share button and then "Add to Home Screen"');
      } else {
        // Try to trigger the browser's own install UI for other platforms
        if ('serviceWorker' in navigator && 'PushManager' in window) {
          try {
            // Make sure service worker is registered
            await navigator.serviceWorker.register('/sw.js');
            alert('To install: Look for "Install" or "+" in your browser\'s address bar or menu');
          } catch (err) {
            console.error('Service worker registration failed:', err);
            alert('Please use your browser menu to install this app to your home screen');
          }
        } else {
          alert('Please use your browser menu to install this app to your home screen');
        }
      }
      return;
    }
    
    try {
      // Show the install prompt
      promptEvent.prompt();
      
      // Wait for the user to respond to the prompt
      const { outcome } = await promptEvent.userChoice;
      
      // Clear the stored prompt
      window.deferredPromptEvent = null;
      setDeferredPrompt(null);
      
      if (outcome === 'accepted') {
        console.log('User accepted the installation');
      } else {
        console.log('User dismissed the installation');
      }
    } catch (error) {
      console.error('Error during installation:', error);
      alert('There was a problem with the installation. Please try again later.');
    }
  };

  return (
    <button 
      className="pwa-install-button" 
      onClick={handleInstallClick}
      aria-label="Install app"
      disabled={!isInstallable}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>
      {isInstallable ? 'Install App' : 'Installing...'}
    </button>
  );
}

export default PWAInstallButton;