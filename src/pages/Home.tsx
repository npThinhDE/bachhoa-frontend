import Hero from '../components/Hero';

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Banner */}
      <Hero />


      <section className="container mx-auto px-4 py-4 flex justify-center gap-8 flex-wrap">
        <img
          src="/wallpaper.png"
          alt="Bách Hóa Online Banner 1"
          className="rounded-2xl shadow-lg w-[48%] object-cover"
        />
        <img
          src="/wallpaper_2.jpg"
          alt="Bách Hóa Online Banner 2"
          className="rounded-2xl shadow-lg w-[48%] object-cover"
        />
      </section>
    </div>
  );
}