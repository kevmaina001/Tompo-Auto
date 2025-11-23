"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Download, Smartphone, Share2, PlusSquare, MoreVertical, CheckCircle2, ArrowDown } from "lucide-react";
import { Button } from "./ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// Detect iOS device
function isIOS() {
  if (typeof window === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as typeof window & { MSStream?: unknown }).MSStream;
}

// Detect if running in standalone mode (already installed)
function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

// Detect Android
function isAndroid() {
  if (typeof window === "undefined") return false;
  return /Android/.test(navigator.userAgent);
}

// Detect Safari browser
function isSafari() {
  if (typeof window === "undefined") return false;
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [iosStep, setIosStep] = useState(0);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  const [installing, setInstalling] = useState(false);

  // Check if just installed (first launch in standalone mode)
  useEffect(() => {
    if (isStandalone()) {
      const hasSeenWelcome = localStorage.getItem("pwa-welcome-shown");
      if (!hasSeenWelcome) {
        setShowWelcome(true);
        localStorage.setItem("pwa-welcome-shown", "true");
      }
      setIsInstalled(true);
    }
  }, []);

  useEffect(() => {
    // Check device type
    setIsIOSDevice(isIOS());

    // Check if already installed
    if (isStandalone()) {
      setIsInstalled(true);
      return;
    }

    // Check if user dismissed the prompt before
    const dismissedTime = localStorage.getItem("pwa-prompt-dismissed");
    if (dismissedTime) {
      const hoursSinceDismissed = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60);
      if (hoursSinceDismissed < 24) {
        setDismissed(true);
        return;
      }
    }

    // For iOS, show guide after delay
    if (isIOS() && isSafari()) {
      setTimeout(() => {
        if (!dismissed) {
          setShowIOSGuide(true);
        }
      }, 2000);
      return;
    }

    // Listen for the install prompt event (Android/Desktop)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => {
        if (!dismissed) {
          setShowBanner(true);
        }
      }, 2000);
    };

    // Listen for successful installation
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowBanner(false);
      setDeferredPrompt(null);
      setShowWelcome(true);
      localStorage.setItem("pwa-welcome-shown", "true");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [dismissed]);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;

    setInstalling(true);
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setIsInstalled(true);
      setShowWelcome(true);
    }

    setShowBanner(false);
    setDeferredPrompt(null);
    setInstalling(false);
  }, [deferredPrompt]);

  const handleDismiss = () => {
    setShowBanner(false);
    setShowIOSGuide(false);
    setDismissed(true);
    localStorage.setItem("pwa-prompt-dismissed", Date.now().toString());
  };

  const handleCloseWelcome = () => {
    setShowWelcome(false);
  };

  // iOS step progression
  const nextIOSStep = () => {
    if (iosStep < 2) {
      setIosStep(iosStep + 1);
    } else {
      setShowIOSGuide(false);
      setDismissed(true);
      localStorage.setItem("pwa-prompt-dismissed", Date.now().toString());
    }
  };

  // Don't render anything if installed (except welcome screen)
  if (isInstalled && !showWelcome) return null;

  return (
    <>
      {/* Welcome Screen - shown after successful installation */}
      {showWelcome && (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-600 to-blue-800 z-50 flex items-center justify-center p-4">
          <div className="text-center text-white max-w-sm">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Welcome to Tompo&apos;s Auto!</h1>
            <p className="text-blue-100 mb-8">
              App installed successfully. Enjoy quick access to quality auto parts!
            </p>
            <Button
              onClick={handleCloseWelcome}
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg font-semibold"
            >
              Start Shopping
            </Button>
          </div>
        </div>
      )}

      {/* iOS Safari Visual Guide */}
      {showIOSGuide && isIOSDevice && (
        <div className="fixed inset-0 bg-black/80 z-50">
          {/* Dismiss button */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white z-50"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Step 0: Point to Share button */}
          {iosStep === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-24">
              <div className="text-center text-white mb-8 px-4">
                <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Share2 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Step 1: Tap Share</h3>
                <p className="text-white/70">Tap the share button at the bottom of your screen</p>
              </div>

              {/* Animated arrow pointing down to share button */}
              <div className="animate-bounce">
                <ArrowDown className="h-12 w-12 text-blue-400" />
              </div>

              {/* Highlight area at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-16 border-t-4 border-blue-400 bg-blue-400/20" />

              <button
                onClick={nextIOSStep}
                className="absolute bottom-20 left-1/2 -translate-x-1/2 text-blue-400 text-sm underline"
              >
                I tapped Share, next step →
              </button>
            </div>
          )}

          {/* Step 1: Add to Home Screen */}
          {iosStep === 1 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
              <div className="text-center text-white">
                <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <PlusSquare className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Step 2: Add to Home Screen</h3>
                <p className="text-white/70 mb-6">Scroll down and tap &quot;Add to Home Screen&quot;</p>

                {/* Mock menu item */}
                <div className="bg-white rounded-xl p-4 max-w-xs mx-auto mb-8 shadow-xl">
                  <div className="flex items-center gap-3 text-gray-800">
                    <PlusSquare className="h-6 w-6 text-blue-600" />
                    <span className="font-medium">Add to Home Screen</span>
                  </div>
                </div>

                <button
                  onClick={nextIOSStep}
                  className="text-blue-400 text-sm underline"
                >
                  I found it, next step →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Confirm Add */}
          {iosStep === 2 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
              <div className="text-center text-white">
                <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Step 3: Tap &quot;Add&quot;</h3>
                <p className="text-white/70 mb-6">Tap Add in the top right corner to install</p>

                {/* Mock header */}
                <div className="bg-gray-800 rounded-xl p-4 max-w-xs mx-auto mb-8">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-400">Cancel</span>
                    <span className="text-white font-medium">Add to Home Screen</span>
                    <span className="text-blue-400 font-bold">Add</span>
                  </div>
                </div>

                <Button
                  onClick={nextIOSStep}
                  className="bg-green-500 hover:bg-green-600 px-8"
                >
                  Done! Open from Home Screen
                </Button>
              </div>
            </div>
          )}

          {/* Progress dots */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
            {[0, 1, 2].map((step) => (
              <div
                key={step}
                className={`w-2 h-2 rounded-full transition-colors ${
                  step === iosStep ? "bg-blue-400" : "bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Android/Desktop Install Banner - Direct Install */}
      {showBanner && !showIOSGuide && deferredPrompt && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-50 animate-in slide-in-from-bottom-5">
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Smartphone className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                Install Tompo&apos;s Auto
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Quick access from your home screen
              </p>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDismiss}
              className="flex-1"
            >
              Not now
            </Button>
            <Button
              size="sm"
              onClick={handleInstall}
              disabled={installing}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {installing ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Installing...
                </span>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-1.5" />
                  Install Now
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

// Separate component for install button to use in navbar/footer
export function InstallAppButton({ className = "" }: { className?: string }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [iosStep, setIosStep] = useState(0);
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    setIsIOSDevice(isIOS());

    if (isStandalone()) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    // For iOS, show the visual guide
    if (isIOSDevice && isSafari()) {
      setShowIOSGuide(true);
      return;
    }

    // For Android/Desktop with native prompt
    if (deferredPrompt) {
      setInstalling(true);
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
      setInstalling(false);
      return;
    }

    // For Android without prompt, show guide
    if (isAndroid()) {
      setShowIOSGuide(true);
    }
  };

  const nextIOSStep = () => {
    if (iosStep < 2) {
      setIosStep(iosStep + 1);
    } else {
      setShowIOSGuide(false);
      setIosStep(0);
    }
  };

  // Don't show if installed
  if (isInstalled) return null;

  // Show button on iOS/Android even without beforeinstallprompt
  const shouldShowButton = deferredPrompt || isIOSDevice || isAndroid();
  if (!shouldShowButton) return null;

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleInstall}
        disabled={installing}
        className={className}
      >
        {installing ? (
          <span className="h-4 w-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        ) : (
          <>
            <Download className="h-4 w-4 mr-1.5" />
            Install App
          </>
        )}
      </Button>

      {/* iOS/Android Visual Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 bg-black/80 z-50">
          <button
            onClick={() => { setShowIOSGuide(false); setIosStep(0); }}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white z-50"
          >
            <X className="h-6 w-6" />
          </button>

          {isIOSDevice ? (
            <>
              {/* iOS Steps */}
              {iosStep === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-24">
                  <div className="text-center text-white mb-8 px-4">
                    <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Share2 className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Step 1: Tap Share</h3>
                    <p className="text-white/70">Tap the share button below</p>
                  </div>
                  <div className="animate-bounce">
                    <ArrowDown className="h-12 w-12 text-blue-400" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-16 border-t-4 border-blue-400 bg-blue-400/20" />
                  <button onClick={nextIOSStep} className="absolute bottom-20 text-blue-400 text-sm underline">
                    Next step →
                  </button>
                </div>
              )}

              {iosStep === 1 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
                  <div className="text-center text-white">
                    <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <PlusSquare className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Step 2: Add to Home Screen</h3>
                    <p className="text-white/70 mb-6">Scroll and tap &quot;Add to Home Screen&quot;</p>
                    <div className="bg-white rounded-xl p-4 max-w-xs mx-auto mb-8">
                      <div className="flex items-center gap-3 text-gray-800">
                        <PlusSquare className="h-6 w-6 text-blue-600" />
                        <span className="font-medium">Add to Home Screen</span>
                      </div>
                    </div>
                    <button onClick={nextIOSStep} className="text-blue-400 text-sm underline">
                      Next step →
                    </button>
                  </div>
                </div>
              )}

              {iosStep === 2 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
                  <div className="text-center text-white">
                    <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Step 3: Tap &quot;Add&quot;</h3>
                    <p className="text-white/70 mb-6">Tap Add to finish installation</p>
                    <Button onClick={nextIOSStep} className="bg-green-500 hover:bg-green-600 px-8">
                      Done!
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Android Steps */}
              {iosStep === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-start pt-16">
                  <div className="text-center text-white px-4">
                    <div className="animate-bounce mb-4">
                      <ArrowDown className="h-12 w-12 text-blue-400 rotate-180" />
                    </div>
                    <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <MoreVertical className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Step 1: Tap Menu</h3>
                    <p className="text-white/70">Tap the 3 dots at the top right</p>
                  </div>
                  <div className="absolute top-0 right-0 w-16 h-16 border-4 border-blue-400 rounded-bl-xl bg-blue-400/20" />
                  <button onClick={nextIOSStep} className="absolute bottom-20 text-blue-400 text-sm underline">
                    Next step →
                  </button>
                </div>
              )}

              {iosStep === 1 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
                  <div className="text-center text-white">
                    <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Download className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Step 2: Install App</h3>
                    <p className="text-white/70 mb-6">Tap &quot;Install app&quot; or &quot;Add to Home screen&quot;</p>
                    <div className="bg-white rounded-xl p-4 max-w-xs mx-auto mb-8">
                      <div className="flex items-center gap-3 text-gray-800">
                        <Download className="h-6 w-6 text-blue-600" />
                        <span className="font-medium">Install app</span>
                      </div>
                    </div>
                    <button onClick={nextIOSStep} className="text-blue-400 text-sm underline">
                      Next step →
                    </button>
                  </div>
                </div>
              )}

              {iosStep === 2 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
                  <div className="text-center text-white">
                    <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Step 3: Confirm</h3>
                    <p className="text-white/70 mb-6">Tap Install to finish</p>
                    <Button onClick={nextIOSStep} className="bg-green-500 hover:bg-green-600 px-8">
                      Done!
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Progress dots */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
            {[0, 1, 2].map((step) => (
              <div
                key={step}
                className={`w-2 h-2 rounded-full transition-colors ${
                  step === iosStep ? "bg-blue-400" : "bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
