import Providers from "./providers";


export const metadata = {
  title: "Next.js App",
  description: "Next.js App Router Layout",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <Providers>{children}</Providers>

        
      </body>
    </html>
  );
}
