import { ProfileCard, ProfileData } from "@/components/ProfileCard";

const mockProfile: ProfileData = {
  url: "https://thelouqii.com/",
  name: "Thelouqii",
  profile_type: "Fashion Brand",
  short_description:
    "Thelouqii is a fashion brand specializing in unique bohemian and elegant apparel, featuring a range of kaftans, kimonos, and versatile sets.",
  long_description:
    "Thelouqii offers a distinctive collection of clothing inspired by bohemian and nomadic aesthetics. Their range includes luxurious kaftans, stylish kimonos, vests, tops, dresses, and pants, all crafted to embody an elegant yet free-spirited style. With items like the 'Gypsy fur kimono' and 'Desert kaftan', Thelouqii provides chic and comfortable fashion for those who appreciate unique designs and global influences.",
  image_urls: [
    "https://thelouqii.com/cdn/shop/files/DSC_4251-2.jpg?v=1752582644width=1946",
    "https://thelouqii.com/cdn/shop/files/80F16B40-E9F1-4AEA-9F5F-C7A4B16ED3A3.jpg?v=1769384805&width=1946",
    "https://thelouqii.com/cdn/shop/files/6ED080E4-8A9C-4347-B791-B329AEF82C6B.jpg?v=1769384805&width=1946",
    "https://thelouqii.com/cdn/shop/files/preview_images/35847aefdcff4bb7a35800a023fa1b54.thumbnail.0000000000.jpg?v=1769526111&width=1946",
    "https://thelouqii.com/cdn/shop/files/685F9670-E8F0-4F59-8D3C-884EA4F226CF.jpg?v=1769384805&width=1946",
    "https://thelouqii.com/cdn/shop/files/EA2A3E38-B09D-4F60-A4F5-E0314F59D101.jpg?v=1769384805&width=1946",
    "https://thelouqii.com/cdn/shop/files/94606BF8-C11A-4AD9-8031-87114F728C0C.jpg?v=1769384805&width=1946",
    "https://thelouqii.com/cdn/shop/files/303F659A-AF00-4FE5-8E36-E8EEA5A5DDDC.jpg?v=1769384390&width=1946",
  ],
  keywords: [
    "#BohemianFashion",
    "#Kaftans",
    "#Kimonos",
    "#EthnicChic",
    "#NomadStyle",
    "#LuxuryApparel",
  ],
};

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 p-6 md:p-12 lg:p-24 overflow-x-hidden">
      <main className="max-w-6xl mx-auto flex flex-col items-center gap-16">
        <div className="text-center space-y-6 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-zinc-50">
            Featured Creatives
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 font-medium">
            Explore unique visual narratives from around the world. Every card tells a story of culture, art, and vision.
          </p>
        </div>
        
        <div className="w-full flex justify-center items-start gap-8 flex-wrap">
           <ProfileCard profile={mockProfile} />
        </div>
      </main>
    </div>
  );
}
