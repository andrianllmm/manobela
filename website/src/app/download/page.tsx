import type { Metadata } from 'next';
import { useMemo } from 'react';
import { LandingNavbar } from '@/components/navbar';
import { LandingFooter } from '@/components/footer';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import QRCode from 'react-qr-code';

export const metadata: Metadata = {
  title: 'Download Manobela',
  description: 'Download the latest Manobela mobile app.',
  keywords: ['mobile', 'app', 'download'],
};

export default function DownloadPage() {
  const appVersion = process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0';

  const apkUrl = process.env.NEXT_PUBLIC_APK_URL || '/releases/manobela.apk';

  const qrUrl = useMemo(() => {
    const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    return `${base}${apkUrl}`;
  }, [apkUrl]);

  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />

      <main className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <section className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Download Manobela</h1>
            <p className="mt-3 text-base md:text-lg text-muted-foreground">
              Get the latest version of the mobile app for Android.
            </p>

            <div className="mt-8 flex flex-col items-center gap-4">
              <Button asChild className="w-full max-w-xs">
                <a href={apkUrl} download>
                  Download APK
                </a>
              </Button>
              <p className="text-sm text-muted-foreground">
                Version: <span className="font-bold">{appVersion}</span>
              </p>
            </div>
          </section>

          <Separator className="my-10" />

          <section className="text-center space-y-4">
            <h2 className="text-xl font-semibold">Scan to Download</h2>
            <div className="inline-block bg-white p-4 rounded-xl">
              <QRCode value={qrUrl} size={180} />
            </div>
            <p className="text-sm text-muted-foreground">
              Scan with your phone camera to download directly.
            </p>
          </section>

          <Separator className="my-10" />

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">How to Install</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Download the APK using the button above.</li>
              <li>Open the downloaded file on your Android device.</li>
              <li>If prompted, enable installation from unknown sources.</li>
              <li>Follow the on-screen instructions to install.</li>
            </ol>
            <p className="text-xs text-muted-foreground mt-6 text-center">
              By downloading, you agree to our Terms of Service and Privacy Policy.
            </p>
          </section>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
