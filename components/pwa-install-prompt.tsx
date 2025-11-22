"use client";

import { useState, useEffect } from "react";
import { X, Download, Smartphone, Share, Plus, MoreVertical } from "lucide-react";
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

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  const [isAndroidDevice, setIsAndroidDevice] = useState(false);

  useEffect(() => {
    // Check device type
    setIsIOSDevice(isIOS());
    setIsAndroidDevice(isAndroid());

    // Check if already installed
    if (isStandalone()) {
      setIsInstalled(true);
      return;
    }

    // Check if user dismissed the prompt before
    const dismissedTime = localStorage.getItem("pwa-prompt-dismissed");
    if (dismissedTime) {
      const hoursSinceDismissed = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60);
      // Show again after 24 hours
      if (hoursSinceDismissed < 24) {
        setDismissed(true);
        return;
      }
    }

    // For iOS, show custom instructions after delay
    if (isIOS()) {
      setTimeout(() => {
        if (!dismissed) {
          setShowIOSInstructions(true);
        }
      }, 2000);
      return;
    }

    // Listen for the install prompt event (Android/Desktop)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show banner after a short delay
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
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // For Android, if beforeinstallprompt doesn't fire after 3 seconds, show manual instructions
    const androidFallbackTimer = setTimeout(() => {
      if (isAndroid() && !deferredPrompt && !dismissed) {
        setShowBanner(true);
      }
    }, 3000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      clearTimeout(androidFallbackTimer);
    };
  }, [dismissed, deferredPrompt]);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      // If no deferred prompt (Android fallback), show instructions
      if (isAndroidDevice) {
        setShowBanner(false);
        setShowIOSInstructions(true); // Reuse for Android instructions
      }
      return;
    }

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setIsInstalled(true);
    }

    setShowBanner(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setShowIOSInstructions(false);
    setDismissed(true);
    localStorage.setItem("pwa-prompt-dismissed", Date.now().toString());
  };

  // Don't render anything if installed
  if (isInstalled) return null;

  return (
    <>
      {/* iOS/Android Manual Install Instructions */}
      {showIOSInstructions && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md shadow-2xl animate-in slide-in-from-bottom-5">
            <div className="p-5">
              <button
                onClick={handleDismiss}
                className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Smartphone className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">
                  Install Tompo&apos;s Auto
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Add to your home screen for the best experience
                </p>
              </div>

              {isIOSDevice ? (
                /* iOS Instructions */
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      1
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Tap the Share button</p>
                      <p className="text-gray-500 text-xs mt-0.5">
                        Look for <Share className="h-4 w-4 inline text-blue-600" /> at the bottom of your browser
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      2
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Scroll and tap &quot;Add to Home Screen&quot;</p>
                      <p className="text-gray-500 text-xs mt-0.5">
                        Look for <Plus className="h-4 w-4 inline text-gray-600" /> Add to Home Screen
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      3
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Tap &quot;Add&quot;</p>
                      <p className="text-gray-500 text-xs mt-0.5">
                        Confirm by tapping Add in the top right corner
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* Android Instructions (fallback) */
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      1
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Tap the menu button</p>
                      <p className="text-gray-500 text-xs mt-0.5">
                        Look for <MoreVertical className="h-4 w-4 inline text-gray-600" /> at the top right of your browser
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      2
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Tap &quot;Add to Home screen&quot;</p>
                      <p className="text-gray-500 text-xs mt-0.5">
                        Or &quot;Install app&quot; if available
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      3
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Confirm installation</p>
                      <p className="text-gray-500 text-xs mt-0.5">
                        Tap &quot;Add&quot; or &quot;Install&quot; to confirm
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <Button
                onClick={handleDismiss}
                className="w-full mt-5 bg-blue-600 hover:bg-blue-700"
              >
                Got it
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Install Banner (Android/Desktop with beforeinstallprompt) */}
      {showBanner && !showIOSInstructions && (
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
                Add to your home screen for quick access
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
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <Download className="h-4 w-4 mr-1.5" />
              Install
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
  const [showInstructions, setShowInstructions] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  const [isAndroidDevice, setIsAndroidDevice] = useState(false);

  useEffect(() => {
    setIsIOSDevice(isIOS());
    setIsAndroidDevice(isAndroid());

    // Check if already installed
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
    // For iOS or Android without beforeinstallprompt, show instructions
    if (!deferredPrompt) {
      if (isIOSDevice || isAndroidDevice) {
        setShowInstructions(true);
      }
      return;
    }

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  // Don't show if installed
  if (isInstalled) return null;

  // Show button on iOS/Android even without beforeinstallprompt
  const shouldShowButton = deferredPrompt || isIOSDevice || isAndroidDevice;
  if (!shouldShowButton) return null;

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleInstall}
        className={className}
      >
        <Download className="h-4 w-4 mr-1.5" />
        Install App
      </Button>

      {/* Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md shadow-2xl animate-in slide-in-from-bottom-5">
            <div className="p-5">
              <button
                onClick={() => setShowInstructions(false)}
                className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Smartphone className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">
                  Install Tompo&apos;s Auto
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Add to your home screen for the best experience
                </p>
              </div>

              {isIOSDevice ? (
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      1
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Tap the Share button</p>
                      <p className="text-gray-500 text-xs mt-0.5">
                        Look for <Share className="h-4 w-4 inline text-blue-600" /> at the bottom of your browser
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      2
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Tap &quot;Add to Home Screen&quot;</p>
                      <p className="text-gray-500 text-xs mt-0.5">
                        Look for <Plus className="h-4 w-4 inline text-gray-600" /> Add to Home Screen
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      3
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Tap &quot;Add&quot;</p>
                      <p className="text-gray-500 text-xs mt-0.5">
                        Confirm by tapping Add in the top right corner
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      1
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Tap the menu button</p>
                      <p className="text-gray-500 text-xs mt-0.5">
                        Look for <MoreVertical className="h-4 w-4 inline text-gray-600" /> at the top right
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      2
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Tap &quot;Add to Home screen&quot;</p>
                      <p className="text-gray-500 text-xs mt-0.5">
                        Or &quot;Install app&quot; if available
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      3
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Confirm installation</p>
                      <p className="text-gray-500 text-xs mt-0.5">
                        Tap &quot;Add&quot; or &quot;Install&quot;
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <Button
                onClick={() => setShowInstructions(false)}
                className="w-full mt-5 bg-blue-600 hover:bg-blue-700"
              >
                Got it
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
