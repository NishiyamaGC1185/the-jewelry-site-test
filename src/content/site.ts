// All copy for the site, per language. Pages and components read from here only.
// Based on the 2026-10-16 hearing sheet: museum + event venue, official bookings from 1 Nov 2026.

export type Lang = "ja" | "en";
export type PageKey = "home" | "about" | "spaces" | "events" | "visit" | "news" | "contact";

export const PAGES: PageKey[] = ["home", "about", "spaces", "events", "visit", "news", "contact"];

/** Path of a page in a language, e.g. path("en", "about") → "/en/about/". */
export function path(lang: Lang, page: PageKey): string {
  const root = lang === "ja" ? "/" : "/en/";
  return page === "home" ? root : `${root}${page}/`;
}

// Set when the site is served from a sub-path (GitHub Pages: /the-jewelry).
export const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const asset = (p: string) => `${BASE}${p}`;

export const IG_URL = "https://www.instagram.com/thejewelry_official/";
export const COMPANY_URL = "https://symphonicsourire.com/";
export const PRIVACY_URL = "https://symphonicsourire.com/privacypolicy.html";
export const MAP_EMBED = "https://www.google.com/maps?q=%E5%A4%A7%E9%98%AA%E5%B8%82%E4%BD%8F%E4%B9%8B%E6%B1%9F%E5%8C%BA%E5%8D%97%E6%B8%AF%E5%8C%972-5-20&z=15&output=embed";

type Hero = { kicker: string; title: string; lead: string; image: string };
type Space = { no: string; name: string; en: string; capacity: string; body: string; uses: string[]; image: string };

/** One train route chart: each path runs from `from` through its legs to Cosmosquare Station. */
export type Route = { caption: string; paths: { from: string; legs: { line: string; min: string; color: string; to?: string }[] }[] };

const LINE = { midosuji: "#e5171f", chuo: "#029a4a", nankai: "#5b4aae", jr: "#1b1b1b" };
export const PARKING_URL = "https://times-info.net/P27-osaka/C125/park-detail-BUK0078037/";

export type Content = {
  meta: Record<PageKey, { title: string; description: string }>;
  nav: { labels: Record<PageKey, string>; cta: string; ctaShort: string; menu: string; close: string };
  notice: { text: string; link: string };
  common: { guests: string; more: string; pending: string };
  footer: { address: string; tagline: string; company: string; privacy: string; rights: string };
  home: {
    kicker: string;
    title: [string, string];
    lead: string;
    ctaPrimary: string;
    ctaSecondary: string;
    caption: string;
    statementLabel: string;
    statement: string;
    statementBody: string;
    figures: { value: string; unit: string; label: string }[];
    spacesTitle: string;
    spacesLead: string;
    window: { kicker: string; title: string; body: string };
    lights: { before: string; after: string };
    relaunch: { date: string; title: string; body: string; cta: string };
    programmeTitle: string;
    visitTitle: string;
    visitBody: string;
    newsTitle: string;
    contactTitle: string;
    contactBody: string;
  };
  about: { hero: Hero; chapters: { no: string; title: string; body: string; image: string }[]; quote: string };
  spaces: { hero: Hero; spaces: Space[]; combineTitle: string; combineBody: string; usesLabel: string; capacityLabel: string };
  events: {
    hero: Hero;
    intro: { title: string; body: string; cta: string };
    typesTitle: string;
    types: { no: string; title: string; en: string; body: string; more: string; card: string; images: string[]; facts: { label: string; value: string }[] }[];
    spacesTitle: string;
    flowTitle: string;
    flow: { no: string; title: string; body: string }[];
  };
  visit: {
    hero: Hero;
    hoursTitle: string;
    hours: string;
    hoursNote: string;
    addressTitle: string;
    address: string[];
    trainsTitle: string;
    trains: string[];
    timesTitle: string;
    times: { from: string; time: string }[];
    parkingTitle: string;
    parking: string;
    parkingLink: string;
    parkingAtc: string;
    routesTitle: string;
    window: { title: string; body: string };
    routes: Route[];
    routeEnd: { station: string; walk: string; note: string };
  };
  news: {
    hero: Hero;
    items: { id: string; date: string; title: string; body: string; image: string }[];
    feedTitle: string;
    eventsTitle: string;
    labels: { news: string; event: string };
    readMore: string;
    viewOnIg: string;
    back: string;
    viewAll: string;
    comingSoon: string;
    igNote: string;
    follow: string;
  };
  contact: {
    hero: Hero;
    intro: string;
    dmTitle: string;
    dmBody: string;
    form: {
      type: string;
      types: string[];
      company: string;
      name: string;
      email: string;
      tel: string;
      date: string;
      datePh: string;
      guests: string;
      guestsPh: string;
      message: string;
      agree: [string, string, string];
      submit: string;
      required: string;
      sending: string;
      sent: string;
      failed: string;
    };
  };
};

const IMG = (n: string) => asset(`/images/${n}`);

const ja: Content = {
  meta: {
    home: { title: "THE JEWELRY｜大阪湾のイベント施設", description: "大阪湾に面したイベント施設、THE JEWELRY。展示会、ブランドイベント、レセプションなどの会場利用をご相談いただけます。" },
    about: { title: "施設について｜THE JEWELRY", description: "大阪湾に面したイベント施設 THE JEWELRY。ドーム、外周部、エントランス館内の特徴と、会場利用についてご紹介します。" },
    spaces: { title: "スペース｜THE JEWELRY", description: "ドーム、外周部、エントランス館内。目的と規模にあわせた三つの空間。" },
    events: { title: "催事・展示｜THE JEWELRY", description: "展覧会、ブランドイベント、レセプション、催事。ご利用の流れ。" },
    visit: { title: "ご来館案内｜THE JEWELRY", description: "開館時間、アクセス、所要時間、駐車場のご案内。" },
    news: { title: "お知らせ｜THE JEWELRY", description: "THE JEWELRY からのお知らせと公式Instagram。" },
    contact: { title: "お問い合わせ｜THE JEWELRY", description: "会場利用のご相談は、フォームまたは公式InstagramのDMで承ります。" },
  },
  nav: {
    labels: { home: "ホーム", about: "THE JEWELRYについて", spaces: "会場のご案内", events: "イベントの開催について", visit: "アクセス・ご来場案内", news: "お知らせ", contact: "ご相談・お問い合わせ" },
    cta: "会場利用のご相談",
    ctaShort: "ご相談",
    menu: "メニュー",
    close: "閉じる",
  },
  notice: { text: "2026年11月1日より、イベント・展示のご相談を正式に受け付けます。", link: "ご相談はこちら" },
  common: { guests: "名", more: "詳しく見る", pending: "ご利用可能な人数・レイアウト・設備は、催事の内容に応じてお問い合わせください。" },
  footer: {
    address: "〒559-0034 大阪市住之江区南港北2-5-20",
    tagline: "Event Venue, Osaka Bay",
    company: "運営会社",
    privacy: "プライバシーポリシー",
    rights: "© Symphonic Sourire Co., Ltd.",
  },
  home: {
    kicker: "Event Venue ・ Osaka Bay",
    title: ["大阪湾で、", "心が動くイベントを。"],
    lead: "大阪湾の景色とともに、心に残るイベントを。展示会・ブランドイベント・レセプションなどの会場利用をご相談ください。",
    ctaPrimary: "会場利用のご相談",
    ctaSecondary: "会場を見る",
    caption: "THE JEWELRY ― 催事に合わせて選べる空間。大阪ベイエリア。",
    statementLabel: "Our Story",
    statement: "人が集まり、心が動く。大阪湾から、忘れられない一日を。",
    statementBody: "大阪ベイエリアに建つドーム型の展示施設。展覧会、アートインスタレーションから、ブランド発表会、レセプションまで。光をまとう空間が、特別な一日を演出します。",
    figures: [
      { value: "Osaka Bay", unit: "", label: "大阪湾のイベント施設" },
      { value: "3", unit: "空間", label: "目的に合わせたスペース" },
      { value: "10", unit: "分", label: "コスモスクエア駅から徒歩約" },
    ],
    spacesTitle: "三つの空間",
    spacesLead: "催事の規模と目的に合わせて、会場の選び方や組み合わせをご相談いただけます。",
    window: {
      kicker: "Osaka Bay",
      title: "海に浮かぶ、光のドーム。",
      body: "大阪湾の水辺に佇むTHE JEWELRY。昼は空を映し、夜は光をまとう、ベイエリアの新しいランドマークです。",
    },
    lights: { before: "日が沈むと、", after: "イベントが、夜を彩る。" },
    relaunch: {
      date: "11.01",
      title: "イベント・展示のご相談、正式受付を開始します。",
      body: "日程・規模・内容がまだ決まっていなくても大丈夫です。会場のご見学を含め、まずはお気軽にご相談ください。",
      cta: "ご相談フォームへ",
    },
    programmeTitle: "ご利用シーン",
    visitTitle: "アクセス・ご来場案内",
    visitBody: "コスモスクエア駅・トレードセンター前駅から徒歩約10分。開催情報をご確認のうえお越しください。",
    newsTitle: "お知らせ",
    contactTitle: "思い描くイベントを、お聞かせください。",
    contactBody: "企画のご相談から会場見学まで。お問い合わせフォームまたは公式InstagramのDMで、お気軽にご連絡ください。",
  },
  about: {
    hero: { kicker: "About", title: "THE JEWELRYについて", lead: "人が集まり、心が動く。大阪湾のイベント施設。", image: IMG("atelier-sunset.jpg") },
    chapters: [
      { no: "I", title: "大阪湾に面したイベント会場", body: "THE JEWELRYは、大阪市南港の大阪湾に面したイベント施設です。博物館として生まれたドームを活かし、イベント会場・ギャラリーとしてのご利用を受け付けています。展覧会、ブランドイベント、レセプションなど、開催したい内容をお聞かせください。", image: IMG("waterfront-bluehour.jpg") },
      { no: "II", title: "催事に合わせて選べる空間", body: "ドーム、海に面した外周部、エントランス館内。それぞれの特徴を活かして、催事の内容に合う会場づくりをご相談いただけます。照明や音響、展示物の設置など、ご希望の演出や必要な設備もあわせてお知らせください。", image: IMG("atelier-sail.jpg") },
      { no: "III", title: "主催する方にも、訪れる方にも", body: "開催をご検討の方は、日程や企画が未定の段階でもご相談ください。会場のご見学をご希望の場合も、お問い合わせから承ります。一般のご来場は催事・展示の開催時に限ります。開催日時や入場条件は、各イベントの案内をご確認ください。", image: IMG("about-bay.jpg") },
    ],
    quote: "人が集う。想いが伝わる。記憶に残る一日に。",
  },
  spaces: {
    hero: { kicker: "Spaces", title: "会場のご案内", lead: "開催するイベントに合わせて、三つの会場から。", image: IMG("atelier-dome.jpg") },
    usesLabel: "主な用途",
    capacityLabel: "収容人数",
    spaces: [
      { no: "Pl. 01", name: "ドーム", en: "The Dome", capacity: "", body: "ドームならではの広がりを活かした、印象に残る会場づくりに。展示会や新作発表、ライブ・パフォーマンスなどの企画をご相談ください。", uses: ["展覧会・インスタレーション", "ブランド発表会", "ライブ・パフォーマンス"], image: IMG("atelier-dome.jpg") },
      { no: "Pl. 02", name: "外周部", en: "Outer Area", capacity: "", body: "大阪湾に面した屋外エリア。マルシェや屋外展示など、水辺の開放感を活かしたイベントをご相談いただけます。", uses: ["催事・マーケット", "フェスティバル", "野外展示"], image: IMG("atelier-blue.jpg") },
      { no: "Pl. 03", name: "エントランス館内", en: "Entrance Hall", capacity: "", body: "落ち着いた館内空間。小規模な展示、レセプション、プライベートイベントに。", uses: ["小規模展示", "レセプション", "記者発表"], image: IMG("atelier-hall.jpg") },
    ],
    combineTitle: "空間を組み合わせて",
    combineBody: "展示と交流会を分けるなど、複数の空間を活かした開催方法もご相談いただけます。利用できる範囲や条件は、催事の内容に応じてご案内します。",
  },
  events: {
    hero: { kicker: "Exhibitions & Events", title: "イベントの開催について", lead: "展示会からブランドイベント、レセプションまで。大阪湾で、思い描くイベントを。", image: IMG("atelier-reception.jpg") },
    intro: {
      title: "開催したいイベントを、お聞かせください。",
      body: "イベントの目的や日程、想定人数、ご希望の演出に合わせて、会場の使い方をご相談いただけます。以下はご利用の一例です。実施内容・設備・利用条件は、個別にご案内します。",
      cta: "会場利用のご相談",
    },
    typesTitle: "ご利用シーン",
    types: [
      {
        no: "01", title: "展覧会・アート展示", en: "Exhibitions",
        body: "企画展、アートインスタレーション、写真展など。作品の魅力を伝える展示会場としてご相談いただけます。",
        more: "作品のサイズや展示方法、来場者の動線に合わせて、会場の使い方をご相談いただけます。ドームのほか、小規模な展示にはエントランス館内もご検討ください。",
        card: IMG("atelier-sail.jpg"),
        images: [IMG("atelier-sail.jpg"), IMG("ev-sail.jpg"), IMG("ev-dome.jpg")],
        facts: [
          { label: "おすすめの空間", value: "ドーム／エントランス館内" },
          { label: "収容人数", value: "会場・レイアウトにより異なります。ご希望人数をお知らせください。" },
          { label: "主な用途", value: "企画展・アートインスタレーション・写真展" },
        ],
      },
      {
        no: "02", title: "ブランドイベント", en: "Brand events",
        body: "新作発表会、ファッションショー、ポップアップなど。ブランドの魅力や世界観を、来場者の記憶に残るかたちで。",
        more: "発表会、内覧会、交流の場など、企画に合わせたレイアウトをご相談ください。複数の会場を使う場合の利用範囲や条件も、個別にご案内します。",
        card: IMG("event-runway.jpg"),
        images: [IMG("event-runway.jpg"), IMG("atelier-light.jpg"), IMG("ev-hall.jpg"), IMG("ev-sign.jpg")],
        facts: [
          { label: "おすすめの空間", value: "ドーム／エントランス館内" },
          { label: "収容人数", value: "会場・レイアウトにより異なります。ご希望人数をお知らせください。" },
          { label: "主な用途", value: "新作発表会・ポップアップ・メディア向け内覧会" },
        ],
      },
      {
        no: "03", title: "レセプション・パーティー", en: "Receptions",
        body: "周年記念、企業パーティー、交流会など。大阪湾の景色を背景に、人が集うひとときを。",
        more: "大切なゲストを迎える会場として。人数や進行、飲食のご希望などを伺い、利用できる会場や条件をご案内します。",
        card: IMG("atelier-reception.jpg"),
        images: [IMG("atelier-reception.jpg"), IMG("ev-sunset-lounge.jpg"), IMG("ev-evening.jpg")],
        facts: [
          { label: "おすすめの空間", value: "ドーム／エントランス館内" },
          { label: "収容人数", value: "会場・レイアウトにより異なります。ご希望人数をお知らせください。" },
          { label: "主な用途", value: "周年記念・企業パーティー・ガラディナー" },
        ],
      },
      {
        no: "04", title: "催事・マーケット", en: "Fairs & markets",
        body: "物産展、見本市、マルシェなど。商品や地域の魅力を届ける催事の会場として。",
        more: "出店内容やブース数、来場者の動線に合わせて、屋外エリアの使い方をご相談ください。屋内会場との組み合わせについてもお問い合わせいただけます。",
        card: IMG("prog-festival.jpg"),
        images: [IMG("ev-sunset.jpg"), IMG("ev-dusk-gold.jpg"), IMG("ev-dusk.jpg")],
        facts: [
          { label: "おすすめの空間", value: "外周部／ドーム" },
          { label: "収容人数", value: "会場・レイアウトにより異なります。ご希望人数をお知らせください。" },
          { label: "主な用途", value: "物産展・見本市・マルシェ・フェスティバル" },
        ],
      },
    ],
    spacesTitle: "会場のご案内",
    flowTitle: "ご利用の流れ",
    flow: [
      { no: "01", title: "ご相談", body: "フォームまたはInstagramのDMより、催事の内容・ご希望時期・想定人数などを、分かる範囲でお知らせください。" },
      { no: "02", title: "内容の確認", body: "担当者よりご連絡し、日程・規模・ご要望を伺います。" },
      { no: "03", title: "会場見学・お打ち合わせ", body: "会場をご案内し、空間の使い方や条件をご相談します。" },
      { no: "04", title: "ご契約・開催", body: "日程・利用内容・条件の合意とご契約を経て、開催に向けた準備を進めます。" },
    ],
  },
  visit: {
    hero: { kicker: "Visit", title: "アクセス・ご来場案内", lead: "大阪湾のイベント施設へ。開催日時・入場条件をご確認のうえ、お越しください。", image: IMG("atelier-colonnade.jpg") },
    hoursTitle: "開館時間",
    hours: "催事・展示の開催時に開館",
    hoursNote: "開館日・時間、チケットの有無、入場条件はイベントごとに異なります。ご来場前に、主催者からのご案内をご確認ください。カフェの常設営業は行っていません。",
    addressTitle: "所在地",
    address: ["〒559-0034", "大阪市住之江区南港北2-5-20"],
    trainsTitle: "最寄り駅",
    trains: ["Osaka Metro 中央線「コスモスクエア駅」徒歩約10分", "ニュートラム「トレードセンター前駅」徒歩約10分"],
    timesTitle: "アクセスのご案内",
    times: [
      { from: "大阪駅・新大阪駅方面", time: "中央線へ乗り換え" },
      { from: "最寄り駅から", time: "徒歩約10分" },
      { from: "関西国際空港から", time: "下記の鉄道ルートをご確認ください" },
    ],
    parkingTitle: "駐車場",
    parking: "最寄りの駐車場（タイムズ）をご利用ください。混雑時はATC駐車場もご利用いただけます。",
    parkingLink: "最寄りの駐車場情報（タイムズ）",
    parkingAtc: "ATC駐車場から THE JEWELRY（徒歩約8分）",
    routesTitle: "電車でのアクセス",
    window: { title: "大阪湾のほとり、南港へ。", body: "コスモスクエア駅、トレードセンター前駅から徒歩約10分。イベントの開催日時と会場をご確認のうえ、お時間に余裕をもってお越しください。" },
    routes: [
      {
        caption: "大阪駅・新大阪駅から",
        paths: [
          { from: "新大阪駅", legs: [{ line: "大阪メトロ御堂筋線", min: "10分", color: LINE.midosuji, to: "本町駅" }, { line: "大阪メトロ中央線", min: "14分", color: LINE.chuo }] },
          { from: "大阪駅", legs: [{ line: "JR環状線", min: "8分", color: LINE.jr, to: "弁天町駅" }, { line: "大阪メトロ中央線", min: "8分", color: LINE.chuo }] },
        ],
      },
      {
        caption: "関西国際空港から",
        paths: [
          { from: "関西空港", legs: [{ line: "南海特急ラピート", min: "40分", color: LINE.nankai, to: "なんば駅" }, { line: "大阪メトロ御堂筋線", min: "4分", color: LINE.midosuji, to: "本町駅" }, { line: "大阪メトロ中央線", min: "14分", color: LINE.chuo }] },
          { from: "関西空港", legs: [{ line: "JR関空快速", min: "69分", color: LINE.jr, to: "弁天町駅" }, { line: "大阪メトロ中央線", min: "8分", color: LINE.chuo }] },
        ],
      },
    ],
    routeEnd: { station: "コスモスクエア駅", walk: "徒歩 約10分", note: "表示の乗車時間は目安です。待ち時間・乗り換え・徒歩の時間は含みません。最新の経路・運行状況は各交通機関でご確認ください。" },
  },
  news: {
    hero: { kicker: "News", title: "お知らせ", lead: "THE JEWELRY からの最新情報。", image: IMG("atelier-evening.jpg") },
    items: [
      { id: "2026-11-01-open", date: "2026.11.01", title: "イベント・展示のご相談の受付を開始しました", body: "本日より、催事・展示の主催者さまからのご依頼を正式に受け付けます。", image: IMG("news-open.jpg") },
      { id: "2026-10-31-renewal", date: "2026.10.31", title: "公式サイトをリニューアルしました", body: "THE JEWELRY 公式サイトを全面リニューアルしました。", image: IMG("news-renewal.jpg") },
    ],
    feedTitle: "お知らせ・イベント",
    eventsTitle: "開催情報",
    labels: { news: "NEWS", event: "EVENT" },
    readMore: "詳しく見る",
    viewOnIg: "Instagramで見る",
    back: "お知らせ一覧へ",
    viewAll: "一覧を見る",
    comingSoon: "近日公開予定",
    igNote: "催事・展示の最新の様子は、公式Instagramでご覧いただけます。",
    follow: "Instagramをフォロー",
  },
  contact: {
    hero: { kicker: "Contact", title: "ご相談・お問い合わせ", lead: "会場利用のご相談をお待ちしています。", image: IMG("atelier-sea.jpg") },
    intro: "会場利用・展示・出店・取材などのお問い合わせを承ります。ご希望の内容、時期、想定人数など、分かる範囲でお知らせください。企画段階や会場見学のご相談も受け付けています。",
    dmTitle: "Instagramでのお問い合わせ",
    dmBody: "公式Instagramのダイレクトメッセージでも、ご相談を受け付けています。",
    form: {
      type: "ご相談内容",
      types: ["催事・イベント", "展示・展覧会", "取材・メディア", "その他"],
      company: "会社名・団体名",
      name: "お名前",
      email: "メールアドレス",
      tel: "電話番号",
      date: "ご希望時期",
      datePh: "例）2027年春ごろ",
      guests: "想定人数",
      guestsPh: "例）500名",
      message: "お問い合わせ内容",
      agree: ["", "プライバシーポリシー", "に同意する"],
      submit: "送信する",
      required: "必須",
      sending: "送信しています…",
      sent: "お問い合わせありがとうございます。内容を確認のうえ、担当者よりご連絡いたします。",
      failed: "送信できませんでした。時間をおいて再度お試しいただくか、Instagram DMでご連絡ください。",
    },
  },
};

const en: Content = {
  meta: {
    home: { title: "THE JEWELRY | Event Venue, Osaka Bay", description: "An event venue on Osaka Bay for exhibitions, brand events, receptions and more. Enquire about hosting your next event at THE JEWELRY." },
    about: { title: "About | THE JEWELRY", description: "Discover THE JEWELRY, an event venue on Osaka Bay, and its Dome, Waterfront and Entrance Hall." },
    spaces: { title: "Spaces | THE JEWELRY", description: "The Dome, the Outer Area and the Entrance Hall: three spaces for every scale." },
    events: { title: "Exhibitions & Events | THE JEWELRY", description: "Exhibitions, brand events, receptions and fairs, and how to book." },
    visit: { title: "Visit | THE JEWELRY", description: "Opening hours, address, travel times and parking." },
    news: { title: "News | THE JEWELRY", description: "News from THE JEWELRY and our official Instagram." },
    contact: { title: "Contact | THE JEWELRY", description: "Propose an event or exhibition via the form or Instagram DM." },
  },
  nav: {
    labels: { home: "Home", about: "About THE JEWELRY", spaces: "Our spaces", events: "Host an event", visit: "Access & visitor information", news: "News", contact: "Enquiries & contact" },
    cta: "Host an event",
    ctaShort: "Contact",
    menu: "Menu",
    close: "Close",
  },
  notice: { text: "From 1 November 2026, we officially welcome proposals for events and exhibitions.", link: "Get in touch" },
  common: { guests: "guests", more: "Discover", pending: "Guest numbers, layouts and equipment depend on the event. Please enquire about your requirements." },
  footer: {
    address: "2-5-20 Nanko-kita, Suminoe-ku, Osaka 559-0034",
    tagline: "Event Venue, Osaka Bay",
    company: "Company",
    privacy: "Privacy policy",
    rights: "© Symphonic Sourire Co., Ltd.",
  },
  home: {
    kicker: "Event Venue · Osaka Bay",
    title: ["The Jewelry,", "restarted."],
    lead: "Host your next exhibition, brand event or reception on the shores of Osaka Bay.",
    ctaPrimary: "Host an event",
    ctaSecondary: "Explore the spaces",
    caption: "THE JEWELRY — a dome wrapped in light. Osaka Bay Area.",
    statementLabel: "Our Story",
    statement: "Bring people together for an unforgettable event on Osaka Bay.",
    statementBody: "A dome-shaped exhibition hall on the Osaka Bay Area. From exhibitions and art installations to brand launches and receptions, a space wrapped in light sets the scene for a special day.",
    figures: [
      { value: "Osaka Bay", unit: "", label: "Waterfront event venue" },
      { value: "3", unit: "", label: "Distinct spaces" },
      { value: "10", unit: "min", label: "Approx. walk from Cosmosquare" },
    ],
    spacesTitle: "Three spaces",
    spacesLead: "Used alone or together, chosen to suit the scale and purpose of your event.",
    window: {
      kicker: "Osaka Bay",
      title: "A dome of light on the water.",
      body: "Set on the edge of Osaka Bay, THE JEWELRY reflects the sky by day and glows by night: a new landmark for the Bay Area.",
    },
    lights: { before: "As the sun goes down,", after: "the Jewelry puts on its light." },
    relaunch: {
      date: "11.01",
      title: "We now officially welcome events and exhibitions.",
      body: "No need to have dates, size or details fixed yet. Get in touch, and we can arrange a site visit too.",
      cta: "Go to the enquiry form",
    },
    programmeTitle: "What you can host",
    visitTitle: "Plan your visit",
    visitBody: "About 10 minutes on foot from Cosmosquare or Trade Center-mae Station. Check your event’s information before visiting.",
    newsTitle: "News",
    contactTitle: "Let’s plan your special day.",
    contactBody: "Organisers and exhibitors can reach us through the form or by Instagram DM.",
  },
  about: {
    hero: { kicker: "About", title: "About", lead: "An event venue on Osaka Bay, bringing people together.", image: IMG("atelier-sunset.jpg") },
    chapters: [
      { no: "I", title: "An event venue on Osaka Bay", body: "THE JEWELRY is an event venue in Nanko, Osaka. Originally built as a museum, its dome now welcomes enquiries for events and gallery use, from exhibitions and brand events to receptions. Tell us what you would like to host.", image: IMG("waterfront-bluehour.jpg") },
      { no: "II", title: "Spaces for your event", body: "Choose from the Dome, the Waterfront and the Entrance Hall. Discuss how each space could work for your event, including your lighting, sound and installation requirements.", image: IMG("atelier-sail.jpg") },
      { no: "III", title: "For organisers and visitors", body: "Organisers are welcome to enquire before dates or plans are finalised, including requests for a site visit. Public access is during events and exhibitions. Visitors should check each organiser’s dates, times and admission requirements.", image: IMG("about-bay.jpg") },
    ],
    quote: "A new stage for expression and encounters.",
  },
  spaces: {
    hero: { kicker: "Spaces", title: "Spaces", lead: "Three spaces for every scale and purpose.", image: IMG("atelier-dome.jpg") },
    usesLabel: "Ideal for",
    capacityLabel: "Capacity",
    spaces: [
      { no: "Pl. 01", name: "The Dome", en: "The Dome", capacity: "", body: "Our signature circular hall. With lighting effects, ideal for immersive exhibitions and launches.", uses: ["Exhibitions & installations", "Brand launches", "Live performances"], image: IMG("atelier-dome.jpg") },
      { no: "Pl. 02", name: "Outer Area", en: "Outer Area", capacity: "", body: "An outdoor area facing Osaka Bay. Discuss markets, outdoor exhibitions and events that make use of the waterfront setting.", uses: ["Fairs & markets", "Festivals", "Outdoor exhibitions"], image: IMG("atelier-blue.jpg") },
      { no: "Pl. 03", name: "Entrance Hall", en: "Entrance Hall", capacity: "", body: "A calm indoor space for small exhibitions, receptions and private events.", uses: ["Small exhibitions", "Receptions", "Press events"], image: IMG("atelier-hall.jpg") },
    ],
    combineTitle: "Combine the spaces",
    combineBody: "Spaces can be combined, for example an exhibition in the Dome with a reception in the Outer Area. We will propose the best layout for your event.",
  },
  events: {
    hero: { kicker: "Exhibitions & Events", title: "Exhibitions & Events", lead: "Host exhibitions, brand events and receptions on Osaka Bay.", image: IMG("atelier-reception.jpg") },
    intro: {
      title: "Tell us about the event you have in mind.",
      body: "Discuss your event’s purpose, preferred dates, guest numbers and production requirements. The uses below are examples; availability, equipment and terms are confirmed individually.",
      cta: "Propose an event",
    },
    typesTitle: "What you can host",
    types: [
      {
        no: "01", title: "Exhibitions", en: "Art & culture",
        body: "Curated shows, art installations and photography exhibitions. Discuss a setting that brings your work to your audience.",
        more: "Discuss the layout, display methods and visitor flow that suit your work. Alongside the Dome, consider the Entrance Hall for smaller exhibitions.",
        card: IMG("atelier-sail.jpg"),
        images: [IMG("atelier-sail.jpg"), IMG("ev-sail.jpg"), IMG("ev-dome.jpg")],
        facts: [
          { label: "Suggested spaces", value: "The Dome / Entrance Hall" },
          { label: "Capacity", value: "Guest numbers depend on the space and layout. Please enquire." },
          { label: "Ideal for", value: "Curated shows, art installations, photography" },
        ],
      },
      {
        no: "02", title: "Brand events", en: "Launches & pop-ups",
        body: "Product launches, fashion shows and pop-ups. Bring your brand’s character and ideas to life in a setting guests will remember.",
        more: "Discuss layouts for launches, previews and networking. We will explain the available spaces and terms for using more than one area.",
        card: IMG("event-runway.jpg"),
        images: [IMG("event-runway.jpg"), IMG("atelier-light.jpg"), IMG("ev-hall.jpg"), IMG("ev-sign.jpg")],
        facts: [
          { label: "Suggested spaces", value: "The Dome / Entrance Hall" },
          { label: "Capacity", value: "Guest numbers depend on the space and layout. Please enquire." },
          { label: "Ideal for", value: "Product launches, pop-ups, press previews" },
        ],
      },
      {
        no: "03", title: "Receptions", en: "Parties & galas",
        body: "Anniversaries, corporate parties and gatherings, with Osaka Bay as a backdrop.",
        more: "A special night with the bay view as a backdrop. For smaller receptions, the Entrance Hall is also available.",
        card: IMG("atelier-reception.jpg"),
        images: [IMG("atelier-reception.jpg"), IMG("ev-sunset-lounge.jpg"), IMG("ev-evening.jpg")],
        facts: [
          { label: "Suggested spaces", value: "The Dome / Entrance Hall" },
          { label: "Capacity", value: "Guest numbers depend on the space and layout. Please enquire." },
          { label: "Ideal for", value: "Anniversaries, corporate parties, gala dinners" },
        ],
      },
      {
        no: "04", title: "Fairs & markets", en: "Large-scale events",
        body: "Regional fairs, trade shows and markets: bring products, ideas and communities together.",
        more: "Discuss booth numbers, visitor flow and how the outdoor area could work for your event. Enquire about combining indoor and outdoor spaces.",
        card: IMG("prog-festival.jpg"),
        images: [IMG("ev-sunset.jpg"), IMG("ev-dusk-gold.jpg"), IMG("ev-dusk.jpg")],
        facts: [
          { label: "Suggested spaces", value: "Outer Area / The Dome" },
          { label: "Capacity", value: "Guest numbers depend on the space and layout. Please enquire." },
          { label: "Ideal for", value: "Regional fairs, trade shows, markets, festivals" },
        ],
      },
    ],
    spacesTitle: "Spaces",
    flowTitle: "How it works",
    flow: [
      { no: "01", title: "Enquire", body: "Tell us about your event through the form or Instagram DM." },
      { no: "02", title: "We reply", body: "Our team contacts you to discuss dates, scale and requirements." },
      { no: "03", title: "Site visit", body: "We show you around and talk through layouts and terms." },
      { no: "04", title: "Confirm & host", body: "After the terms are agreed and the booking is contracted, preparations can begin. An enquiry alone does not confirm a booking." },
    ],
  },
  visit: {
    hero: { kicker: "Visit", title: "Plan your visit", lead: "Visit our event venue on Osaka Bay. Check event times and admission requirements before travelling.", image: IMG("atelier-colonnade.jpg") },
    hoursTitle: "Opening hours",
    hours: "Open during events and exhibitions",
    hoursNote: "Dates, opening hours, tickets and admission requirements vary by event. Check the organiser’s information before visiting. The venue does not operate as a daily café.",
    addressTitle: "Address",
    address: ["2-5-20 Nanko-kita, Suminoe-ku,", "Osaka 559-0034, Japan"],
    trainsTitle: "Nearest stations",
    trains: ["10 min walk from Cosmosquare Station (Osaka Metro Chuo Line)", "10 min walk from Trade Center-mae Station (New Tram)"],
    timesTitle: "Getting here",
    times: [
      { from: "From Osaka / Shin-Osaka", time: "Connect to the Chuo Line" },
      { from: "From the nearest stations", time: "Approx. 10 min on foot" },
      { from: "From Kansai International Airport", time: "See the rail routes below" },
    ],
    parkingTitle: "Parking",
    parking: "Please use the nearest car park (Times). When busy, the ATC car park is also available.",
    parkingLink: "Nearest car park (Times)",
    parkingAtc: "From the ATC car park to THE JEWELRY (approx. 8 min walk)",
    routesTitle: "By train",
    window: { title: "On the waterfront at Nanko, Osaka Bay.", body: "About 10 minutes on foot from Cosmosquare and Trade Center-mae stations. Check your event’s time and location, and allow enough time for your journey." },
    routes: [
      {
        caption: "From Osaka / Shin-Osaka Station",
        paths: [
          { from: "Shin-Osaka Sta.", legs: [{ line: "Osaka Metro Midosuji Line", min: "10 min", color: LINE.midosuji, to: "Hommachi Sta." }, { line: "Osaka Metro Chuo Line", min: "14 min", color: LINE.chuo }] },
          { from: "Osaka Sta.", legs: [{ line: "JR Loop Line", min: "8 min", color: LINE.jr, to: "Bentencho Sta." }, { line: "Osaka Metro Chuo Line", min: "8 min", color: LINE.chuo }] },
        ],
      },
      {
        caption: "From Kansai International Airport",
        paths: [
          { from: "Kansai Airport", legs: [{ line: "Nankai Limited Express Rapi:t", min: "40 min", color: LINE.nankai, to: "Namba Sta." }, { line: "Osaka Metro Midosuji Line", min: "4 min", color: LINE.midosuji, to: "Hommachi Sta." }, { line: "Osaka Metro Chuo Line", min: "14 min", color: LINE.chuo }] },
          { from: "Kansai Airport", legs: [{ line: "JR Kansai Airport Rapid", min: "69 min", color: LINE.jr, to: "Bentencho Sta." }, { line: "Osaka Metro Chuo Line", min: "8 min", color: LINE.chuo }] },
        ],
      },
    ],
    routeEnd: { station: "Cosmosquare Sta.", walk: "approx. 10 min walk", note: "Train times are approximate and exclude waiting, transfers and walking. Check the transport operator’s latest journey information before travelling." },
  },
  news: {
    hero: { kicker: "News", title: "News", lead: "The latest from THE JEWELRY.", image: IMG("atelier-evening.jpg") },
    items: [
      { id: "2026-11-01-open", date: "2026.11.01", title: "We are now accepting event and exhibition proposals", body: "From today, we officially welcome proposals from event and exhibition organisers.", image: IMG("news-open.jpg") },
      { id: "2026-10-31-renewal", date: "2026.10.31", title: "Our website has been renewed", body: "The official THE JEWELRY website has been fully renewed.", image: IMG("news-renewal.jpg") },
    ],
    feedTitle: "News & Events",
    eventsTitle: "What’s on",
    labels: { news: "NEWS", event: "EVENT" },
    readMore: "Read more",
    viewOnIg: "View on Instagram",
    back: "Back to News",
    viewAll: "View all",
    comingSoon: "Coming soon",
    igNote: "See our latest events and exhibitions on our official Instagram.",
    follow: "Follow on Instagram",
  },
  contact: {
    hero: { kicker: "Contact", title: "Contact", lead: "We look forward to hearing about your event.", image: IMG("atelier-sea.jpg") },
    intro: "Enquire about venue hire, exhibitions, participation or press visits. Share your plans, preferred timing and expected guest numbers where known. Early ideas and site visit requests are welcome.",
    dmTitle: "Or message us on Instagram",
    dmBody: "We also accept enquiries by direct message on our official Instagram.",
    form: {
      type: "Enquiry type",
      types: ["Event", "Exhibition", "Press & media", "Other"],
      company: "Company / organisation",
      name: "Name",
      email: "Email",
      tel: "Phone",
      date: "Preferred timing",
      datePh: "e.g. spring 2027",
      guests: "Expected guests",
      guestsPh: "e.g. 500",
      message: "Message",
      agree: ["I agree to the ", "privacy policy", ""],
      submit: "Send",
      required: "Required",
      sending: "Sending…",
      sent: "Thank you for your enquiry. Our team will review it and get back to you.",
      failed: "Your message could not be sent. Please try again later, or reach us by Instagram DM.",
    },
  },
};

export const content: Record<Lang, Content> = { ja, en };

