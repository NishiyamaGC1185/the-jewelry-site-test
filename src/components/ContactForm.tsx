"use client";

import { useState, type FormEvent } from "react";
import { content, PRIVACY_URL, type Lang } from "@/content/site";

// On the Sakura server the enquiry goes to its own contact.php (server/contact/), which emails
// it; the build sets NEXT_PUBLIC_CONTACT_ENDPOINT for that. Elsewhere (the GitHub demo, no PHP)
// Web3Forms emails it: its access key is public by design. Without either, sending reports a failure.
const ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ?? "";
const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "";

/** Sends the fields to contact.php or Web3Forms; both answer JSON with `success`. */
function send(v: Record<string, string>, type: string, lang: Lang) {
  if (ENDPOINT) {
    return fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ type, company: v.company, name: v.name, email: v.email, tel: v.tel, date: v.date, guests: v.guests, message: v.message, lang }),
    });
  }
  return fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: ACCESS_KEY,
      subject: `【THE JEWELRY】お問い合わせ / Enquiry: ${type} — ${v.company}`,
      from_name: "THE JEWELRY Website",
      email: v.email, // used as the reply-to address
      "種別 / Type": type,
      "会社名・団体名 / Company": v.company,
      "お名前 / Name": v.name,
      "メール / Email": v.email,
      "電話番号 / Phone": v.tel || "-",
      "希望時期 / Preferred timing": v.date || "-",
      "想定人数 / Expected guests": v.guests || "-",
      "内容 / Message": v.message,
      "言語 / Site language": lang === "ja" ? "日本語" : "English",
    }),
  });
}

type Status = "idle" | "sending" | "sent" | "failed";

/** Enquiry form: validates, then emails the enquiry (contact.php on Sakura, else Web3Forms). */
export function ContactForm({ lang }: { lang: Lang }) {
  const f = content[lang].contact.form;
  const [type, setType] = useState(f.types[0]);
  const [status, setStatus] = useState<Status>("idle");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    if (!ENDPOINT && !ACCESS_KEY) {
      setStatus("failed");
      return;
    }
    const v = Object.fromEntries(new FormData(form)) as Record<string, string>;
    if (v.botcheck) return; // honeypot filled in: a bot
    setStatus("sending");
    try {
      const res = await send(v, type, lang);
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.message ?? res.statusText);
      form.reset();
      setType(f.types[0]);
      setStatus("sent");
    } catch {
      setStatus("failed");
    }
  };

  const note = { idle: "", sending: f.sending, sent: f.sent, failed: f.failed }[status];
  const input = "mt-2 block w-full border-0 border-b border-white/25 bg-transparent px-0 py-3 text-base text-white outline-none transition placeholder:text-white/50 focus:border-accent-hi";
  const label = "block text-[11px] tracking-[.18em] text-white/85";
  const req = <span className="ml-2 text-accent">{f.required}</span>;

  return (
    <form onSubmit={onSubmit} className="rv grid gap-8 md:grid-cols-2" noValidate={false}>
      <fieldset className="md:col-span-2">
        <legend className={label}>{f.type}</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {f.types.map((t) => (
            <label key={t} className="cursor-pointer">
              <input type="radio" name="type" value={t} checked={type === t} onChange={() => setType(t)} className="peer sr-only" />
              <span className="inline-block border border-white/25 px-4 py-2 text-sm transition peer-checked:border-white peer-checked:bg-white peer-checked:text-black peer-focus-visible:outline peer-focus-visible:outline-2">{t}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <label className={label}>{f.company}{req}<input name="company" required autoComplete="organization" className={input} /></label>
      <label className={label}>{f.name}{req}<input name="name" required autoComplete="name" className={input} /></label>
      <label className={label}>{f.email}{req}<input name="email" type="email" required autoComplete="email" className={input} /></label>
      <label className={label}>{f.tel}<input name="tel" type="tel" autoComplete="tel" className={input} /></label>
      <label className={label}>{f.date}<input name="date" placeholder={f.datePh} className={input} /></label>
      <label className={label}>{f.guests}<input name="guests" placeholder={f.guestsPh} className={input} /></label>
      <label className={`${label} md:col-span-2`}>{f.message}{req}<textarea name="message" rows={5} required className={`${input} resize-y`} /></label>
      {/* honeypot: hidden from people, bots fill it in */}
      <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <label className="flex items-center gap-3 text-sm text-white/85 md:col-span-2">
        <input type="checkbox" required className="size-4 accent-white" />
        <span>{f.agree[0]}<a href={PRIVACY_URL} target="_blank" rel="noopener" className="underline underline-offset-4">{f.agree[1]}</a>{f.agree[2]}</span>
      </label>
      <div className="md:col-span-2">
        <button type="submit" disabled={status === "sending"} className="btn btn-accent w-full disabled:opacity-50 md:w-auto">{status === "sending" ? f.sending : `${f.submit} →`}</button>
        <p className={`mt-4 text-sm ${status === "failed" ? "text-rose-300" : "text-accent"}`} role="status" aria-live="polite">{note}</p>
      </div>
    </form>
  );
}
