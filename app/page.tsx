'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RefreshCw, Quote, Github, Info, Share2, History as HistoryIcon } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Image from "next/image";
import { newItems } from "@/data/new-items";
import { items51to100 } from "@/data/items-51-100";
import { items101to150 } from "@/data/items-101-150";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============================================
// 🍜 世界美食圖鑑 - World Food Encyclopedia
// ============================================

const items = [
  // 1. 日本 - 壽司
  {
    name: "壽司 (Sushi)",
    theme: "#e11d48",
    image: "/items/01-sushi.webp",
    description: `壽司，這道享譽全球的日本料理，其歷史可追溯至西元前四世紀的東南亞。最初的壽司並非我們今日所見的模樣，而是一種將魚肉與米飯層層堆疊、發酵保存的古老技法，稱為「熟壽司」。經過數月的乳酸發酵，米飯會變得粘稠而酸，魚肉則獲得獨特的風味與延長的保存期限。

這道料理隨著稻作文化的傳播，於西元八世紀傳入日本。到了江戶時代（1603-1868），一位名叫華屋與兵衛的料理人進行了革命性的創新——他將新鮮的生魚片直接覆蓋在醋飯上，創造出「握壽司」，徹底改變了壽司的面貌。

正統的壽司製作極為講究：米飯需使用特定品種的短粒米，煮熟後拌入由米醋、糖、鹽調製的「壽司醋」；魚料的選擇與熟成同樣重要，頂級的鮪魚腹肉需經過恰當的熟成才能展現其油脂的醇厚。一位壽司職人的養成往往需要十年以上的修行，單是煮飯一項技藝就需要三年時間精通。`
  },
  // 2. 義大利 - 披薩
  {
    name: "披薩 (Pizza)",
    theme: "#f97316",
    image: "/items/02-pizza.webp",
    description: `披薩的起源可追溯至古代地中海文明。希臘人、埃及人與羅馬人都有在扁平麵餅上放置橄欖油與香料的飲食習慣。然而，現代披薩的誕生地無疑是義大利南部的那不勒斯。

十六世紀，番茄從美洲傳入歐洲後，那不勒斯的窮苦階層開始將這種當時被視為有毒的「金蘋果」鋪在麵餅上食用。這種街頭小食逐漸演變為我們熟知的披薩。1889年，那不勒斯披薩師傅拉斐爾·埃斯波西托為了紀念義大利王后瑪格麗特的來訪，創造了一款以紅色番茄、白色莫札瑞拉起司、綠色羅勒葉裝飾的披薩——正是義大利國旗的三色。這款披薩被命名為「瑪格麗特披薩」，至今仍是最經典的口味。

傳統的那不勒斯披薩有著嚴格的規範：麵團必須以高筋麵粉、水、鹽和酵母製作，經過至少八小時的發酵；烤製則需使用攝氏四百八十五度的柴燒窯爐，僅需六十至九十秒即可完成。2017年，那不勒斯披薩的製作技藝被聯合國教科文組織列為人類非物質文化遺產。`
  },
  // 3. 墨西哥 - 塔可
  {
    name: "塔可 (Taco)",
    theme: "#eab308",
    image: "/items/03-taco.webp",
    description: `塔可，這道墨西哥的國民美食，其歷史與玉米的馴化密不可分。考古學證據顯示，早在西元前七千年，中美洲的原住民就已經開始種植玉米。阿茲特克人將磨碎的玉米糊製成薄餅，稱為「托爾蒂亞」(Tortilla)，這便是塔可的前身。

「Taco」一詞的確切起源眾說紛紜。一種說法認為它來自納瓦特爾語的「tlahco」，意為「半邊」或「在中間」，形容折疊的形狀。另一種有趣的說法則與十八世紀墨西哥銀礦有關——礦工們使用小張紙包裹火藥來爆破岩石，這種紙包被稱為「taco」，後來街頭小販開始用類似的方式包裹食物，這個名稱便延續下來。

傳統的墨西哥街頭塔可與美式塔可截然不同。正宗的玉米薄餅是以石灰水處理過的玉米（稱為「尼克斯塔瑪化」處理）磨成的麵團製作，這個古老的工序不僅能釋放玉米中的菸鹼酸，還能賦予獨特的風味。配料通常選用燉煮的豬肉、牛舌、或是以辣椒與香料醃製的肉類，佐以新鮮的洋蔥丁、芫荽葉與萊姆汁。`
  },
  // 4. 泰國 - 打拋豬
  {
    name: "打拋豬 (Pad Kra Pao)",
    theme: "#22c55e",
    image: "/items/04-pad-kra-pao.webp",
    description: `打拋豬，泰語稱為「Pad Kra Pao Moo」，是泰國最具代表性的家常料理之一。這道看似簡單的快炒菜餚，實則蘊含著泰國料理的精髓——酸、甜、鹹、辣四味的完美平衡。

「Kra Pao」指的是打拋葉，一種與甜羅勒截然不同的泰國聖羅勒。這種草本植物在泰國傳統醫學中被視為神聖之物，據說能驅邪避凶、淨化身心。打拋葉帶有獨特的胡椒與丁香混合的香氣，加熱後會釋放出濃郁的芳香，是這道料理不可替代的靈魂。

傳統的打拋豬製作講究「鑊氣」——需要使用高溫的炒鍋，在極短的時間內完成烹調。首先將大蒜與朝天椒以杵臼搗碎（而非切碎），讓其釋放出更濃郁的風味；接著在滾燙的油鍋中爆香，加入肉末快速翻炒，最後加入魚露、蠔油、糖及大把的打拋葉。上桌時必須配上一顆荷包蛋，蛋黃流淌在米飯上，與辛香的肉末交融，這便是泰國人心中最療癒的滋味。這道菜在泰國街頭隨處可見，價格親民，卻是連頂級餐廳都難以完美複製的庶民美食。`
  },
  // 5. 法國 - 可頌
  {
    name: "可頌 (Croissant)",
    theme: "#d4a574",
    image: "/items/05-croissant.webp",
    description: `可頌，這款彎月形的酥皮麵包，其身世充滿了浪漫的傳說。最廣為流傳的故事發生在1683年的維也納——當時鄂圖曼土耳其帝國圍攻這座城市，據說是維也納的麵包師傅們在深夜聽到了土耳其軍隊挖掘地道的聲響，及時發出警報，拯救了整座城市。為了慶祝勝利，他們創作了這款模仿土耳其國旗上新月圖案的麵包。

然而，歷史學家對此說法多持保留態度。較為可信的記載顯示，可頌是1839年由奧地利企業家奧古斯特·湯恩在巴黎開設的「維也納麵包房」引入法國的。最初的版本只是普通的酵母麵包，直到二十世紀初，法國的麵包師傅們才發展出今日我們熟知的千層酥皮製法。

正統的可頌製作是一門精密的工藝。麵團需經過至少三次的「折疊」，每次將奶油包裹其中，然後擀平、折疊、冷藏。這個程序會產生二十七層交替的麵皮與奶油。在高溫烤製時，奶油中的水分蒸發，將層層麵皮撐開，形成獨特的蜂窩狀結構。一個理想的可頌應該具備深琥珀色的酥脆外殼、如羽毛般輕盈的內裡，以及純正奶油的濃郁香氣。`
  },
  // 6. 印度 - 咖哩
  {
    name: "咖哩 (Curry)",
    theme: "#ca8a04",
    image: "/items/06-curry.webp",
    description: `「咖哩」一詞的起源本身就是一段殖民歷史的縮影。這個詞來自泰米爾語的「kari」，意為「醬汁」或「燉菜」。當十七世紀英國東印度公司的商人與士兵來到印度次大陸時，他們用這個詞籠統地稱呼所有帶有濃郁醬汁的印度料理——儘管在印度本土，從未有過一道菜直接叫做「咖哩」。

印度料理的精髓在於「瑪莎拉」(Masala)——香料的混合藝術。每個家庭、每個地區都有自己獨特的香料配方，可能包含薑黃、芫荽籽、孜然、肉桂、丁香、小豆蔻、黑胡椒等數十種香料。這些香料不僅提供風味，在阿育吠陀醫學傳統中，更被認為具有療癒身體、平衡體質的功效。

值得一提的是，「咖哩粉」這個概念其實是英國人的發明。十八世紀，返回英國的殖民者渴望重現印度的風味，於是商人們將多種香料預先混合成便利的粉末出售。這種簡化的版本隨後傳播到世界各地，在日本演變為溫醇甘甜的國民美食，在泰國與椰奶結合成為芳香四溢的綠咖哩、紅咖哩，在馬來西亞則與在地食材融合，創造出獨具特色的咖哩叻沙。`
  },
  // 7. 韓國 - 烤肉
  {
    name: "韓式烤肉 (Korean BBQ)",
    theme: "#dc2626",
    image: "/items/07-korean-bbq.webp",
    description: `韓式烤肉的歷史可追溯至高句麗時代（西元前37年至西元668年）的「貊炙」——一種將肉類串起在火上燒烤的料理方式。然而，現代韓式烤肉的雛形真正成形於朝鮮時代（1392-1897），當時的宮廷料理中就已經出現了以醬油、糖、芝麻油、大蒜醃製牛肉的「不高基」（Bulgogi，意為「火肉」）。

韓式烤肉之所以獨特，在於它將烹飪過程本身轉變為一種社交儀式。圍坐在嵌有烤爐的餐桌旁，食客們親手翻烤肉片，肉的滋滋聲響、升騰的煙霧、撲鼻的香氣，都成為用餐體驗不可分割的一部分。這種互動式的用餐方式強調的是「情」——韓國文化中人與人之間深厚的情感聯繫。

烤肉的配角同樣不可忽視：將烤好的肉片包裹在新鮮的生菜葉中，佐以蒜片、青辣椒、包飯醬（ssamjang），再配上種類繁多的小菜——醃蘿蔔、涼拌豆芽、炒魚板、泡菜——這才是完整的韓式烤肉體驗。許多傳統餐廳至今仍使用木炭燒烤，他們堅信只有木炭的火候才能賦予肉品獨特的煙燻風味與恰到好處的焦香。`
  },
  // 8. 越南 - 河粉
  {
    name: "河粉 (Pho)",
    theme: "#84cc16",
    image: "/items/08-pho.webp",
    description: `河粉的誕生是東西飲食文化碰撞的結晶。十九世紀末至二十世紀初，法國殖民統治下的越南北部，法國人對牛肉的大量需求改變了當地的飲食生態。越南廚師們開始利用法國人不吃的牛骨熬製湯底，並與中國南方移民帶來的河粉結合，創造出這道獨具特色的料理。「Pho」這個名稱據說源自法語的「pot-au-feu」（火上鍋，一種法式燉菜），也有說法認為它來自廣東話的「粉」。

河粉的靈魂在於那碗清亮卻風味濃郁的湯頭。傳統的製法需要將牛骨以小火慢燉至少八小時，期間不斷撇去浮沫以保持湯色澄澈。香料的運用極為關鍵：八角、桂皮、丁香、芫荽籽、小茴香——這些香料需先經過乾鍋烘烤以激發香氣，然後裝入布袋中與牛骨同煮。成品的湯頭應該清澈見底，卻蘊含著層次分明的滋味。

越南南北兩地的河粉風格截然不同。北方河粉（源自河內）講究質樸，湯頭清淡，配料簡單，僅以蔥花和芫荽點綴；南方河粉（盛行於西貢）則口味較甜，會額外附上滿滿一盤新鮮香草、豆芽、辣椒與檸檬，供食客自行調配。這種南北差異至今仍是越南人津津樂道的文化話題。`
  },
  ...newItems,
  ...items51to100,
  ...items101to150
];

import { useMagicalSounds } from "@/hooks/use-magical-sounds";
import { Play, ChevronUp, ChevronDown } from "lucide-react";

export default function Home() {
  const [selectedItem, setSelectedItem] = useState(items[0]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
  const [history, setHistory] = useState<{ item: typeof items[0], soundIndex: number }[]>([]);

  const { playNote, playSequence } = useMagicalSounds();

  const drawFortune = () => {
    setIsSpinning(true);
    setTimeout(() => {
      const randomItem = items[Math.floor(Math.random() * items.length)];

      setSelectedItem(randomItem);

      const seedIndex = playNote();
      setHistory(prev => [{ item: randomItem, soundIndex: seedIndex }, ...prev]);

      setIsSpinning(false);
    }, 1000);
  };

  const restoreHistory = (historyItem: { item: typeof items[0] }) => {
    if (isSpinning) return;
    setSelectedItem(historyItem.item);
  };

  return (
    <div className="relative h-[100dvh] flex flex-col overflow-hidden bg-[#09090b] text-white" >
      <div
        className="absolute inset-0 transition-colors duration-1000 -z-10"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${selectedItem.theme}15 0%, #09090b 80%)`
        }}
      />

      <header className="px-6 py-4 flex justify-between items-center z-50 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-white flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-black" />
          </div>
          <h1 className="font-black tracking-tight text-sm">世界美食圖鑑</h1>
        </div>
        <div className="flex items-center gap-3">
          <Github className="w-4 h-4 text-zinc-600" />
          <Info className="w-4 h-4 text-zinc-600" />
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row items-center justify-center p-6 gap-8 md:gap-16 min-h-0">
        <div className="relative shrink-0 flex items-center justify-center">
          <motion.div
            key={selectedItem.name}
            animate={{
              rotate: isSpinning ? 360 : 0,
              scale: isSpinning ? 0.8 : 1
            }}
            transition={{ type: "spring", stiffness: 100 }}
            className="z-10 text-white"
          >
            <div
              className="w-48 h-48 md:w-80 md:h-80 rounded-3xl glass-panel flex items-center justify-center animate-float relative overflow-hidden"
              style={{
                boxShadow: `0 0 60px ${selectedItem.theme}33`,
                background: `linear-gradient(135deg, ${selectedItem.theme}44 0%, transparent 100%)`
              }}
            >
              <div className="w-full h-full absolute inset-0 blur-2xl opacity-20" style={{ backgroundColor: selectedItem.theme }} />
              {selectedItem.image ? (
                <div className="relative w-full h-full p-2">
                  <Image
                    src={selectedItem.image}
                    alt={selectedItem.name}
                    fill
                    className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)] filter contrast-125 saturate-110"
                    priority
                    sizes="(max-width: 768px) 192px, 320px"
                  />
                </div>
              ) : (
                <Sparkles className="w-16 h-16 md:w-32 md:h-32 opacity-10 filter blur-[2px]" />
              )}
            </div>
          </motion.div>

          <div className="absolute inset-[-20%] border border-white/5 rounded-[3rem] -z-10 animate-[spin_15s_linear_infinite]" />
          <div className="absolute inset-[-40%] border border-white/5 rounded-[4rem] -z-10 animate-[spin_25s_linear_infinite_reverse] opacity-50" />
        </div>

        <div className="flex flex-col gap-6 w-full max-w-lg shrink min-h-0">
          <div className="glass-panel rounded-2xl p-6 md:p-8 space-y-4 relative overflow-hidden flex flex-col max-h-[50vh] md:max-h-[60vh]">
            <div className="space-y-1">
              <span className="text-[10px] font-black tracking-[0.3em] text-zinc-500 uppercase">今日美食</span>
              <h2 className="text-xl md:text-3xl font-bold font-serif text-white truncate flex items-center justify-center sm:justify-start">
                {(() => {
                  const parts = selectedItem.name.split(' (');
                  if (parts.length === 2) {
                    return (
                      <>
                        <span>{parts[0]}</span>
                        <span className="text-base md:text-lg ml-6 font-sans font-normal opacity-70 tracking-wide">
                          {parts[1].replace(')', '')}
                        </span>
                      </>
                    );
                  }
                  return <span>{selectedItem.name}</span>;
                })()}
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <AnimatePresence mode="wait">
                {!isSpinning ? (
                  <motion.div
                    key={selectedItem.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm md:text-base leading-relaxed text-zinc-300 whitespace-pre-line"
                  >
                    {selectedItem.description.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="mb-4 last:mb-0 text-justify">
                        {paragraph}
                      </p>
                    ))}
                  </motion.div>
                ) : (
                  <div className="w-full space-y-3">
                    <div className="h-4 bg-white/5 rounded w-full animate-pulse" />
                    <div className="h-4 bg-white/5 rounded w-11/12 animate-pulse" />
                    <div className="h-4 bg-white/5 rounded w-full animate-pulse" />
                    <div className="h-4 bg-white/5 rounded w-3/4 animate-pulse" />
                    <div className="h-4 bg-white/5 rounded w-full animate-pulse" />
                    <div className="h-4 bg-white/5 rounded w-5/6 animate-pulse" />
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <button
            onClick={drawFortune}
            disabled={isSpinning}
            className="
              relative group py-4 px-8 bg-white text-black rounded-xl font-black text-base
              hover:scale-[1.02] active:scale-95 transition-all w-full
              disabled:opacity-50 flex items-center justify-center gap-2 overflow-hidden
            "
          >
            {isSpinning ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            <span>{isSpinning ? "探索中..." : "隨機探索"}</span>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-orange-400 via-purple-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </button>

          <div className="flex justify-center h-8">
            <AnimatePresence>
              {history.length > 1 && (
                <motion.button
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onClick={() => {
                    const indices = history.map(h => h.soundIndex).reverse();
                    playSequence(indices, 30);
                  }}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full transition-all text-[10px] font-bold tracking-wider uppercase text-zinc-400 hover:text-white hover:bg-white/10"
                >
                  <Play size={10} className="fill-current" />
                  <span>Play Journey (30s)</span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <footer className="px-6 py-2 flex flex-col gap-2 shrink-0 bg-black/60 backdrop-blur-md border-t border-white/5 transition-all duration-300 ease-in-out">
        <button
          onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
          className="flex items-center justify-between w-full p-2 hover:bg-white/5 rounded-lg transition-colors group"
        >
          <div className="flex items-center gap-2">
            <HistoryIcon size={12} className="text-zinc-500 group-hover:text-zinc-300" />
            <span className="text-[10px] font-black tracking-widest text-zinc-500 group-hover:text-zinc-300 uppercase">探索紀錄 ({history.length})</span>
          </div>
          {isHistoryExpanded ? <ChevronDown size={14} className="text-zinc-500" /> : <ChevronUp size={14} className="text-zinc-500" />}
        </button>

        <AnimatePresence>
          {isHistoryExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap content-start gap-2 pb-4 max-h-[30vh] overflow-y-auto custom-scrollbar">
                <div className="flex flex-wrap content-start gap-2 pb-2">
                  {history.length > 0 ? history.map((historyItem, i) => (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      key={`${historyItem.item.name}-${i}`}
                      onClick={() => restoreHistory(historyItem)}
                      layout
                      className="pl-1.5 pr-3 py-1.5 rounded-full bg-white/5 border border-white/5 flex items-center gap-2 cursor-pointer hover:bg-white/10 hover:border-white/20 transition-all group"
                    >
                      <div className="relative w-8 h-8 rounded-full overflow-hidden bg-black/40 ring-1 ring-white/10 group-hover:ring-white/30 transition-all">
                        {historyItem.item.image && (
                          <Image
                            src={historyItem.item.image}
                            alt={historyItem.item.name}
                            fill
                            className="object-cover"
                            sizes="32px"
                          />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-zinc-400 group-hover:text-zinc-200 whitespace-nowrap uppercase leading-none transition-colors">
                          {historyItem.item.name.split(' ')[0]}
                        </span>
                      </div>
                    </motion.div>
                  )) : (
                    <div className="w-full flex justify-center py-4">
                      <span className="text-[10px] text-zinc-800 font-bold uppercase tracking-widest italic">等待您的第一次探索...</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </footer>
    </div >
  );
}