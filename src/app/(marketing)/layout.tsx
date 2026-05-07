import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Navbar />
      {/* Konten akan otomatis berada di bawah navbar pada halaman about/docs */}
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
