import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "City Bets 2026 — Palpites da Copa" },
      { name: "description", content: "Faça seus palpites para Brasil vs Haiti e Holanda vs Japão e acompanhe seu histórico." },
      { property: "og:title", content: "City Bets 2026" },
      { property: "og:description", content: "Palpites esportivos: Brasil vs Haiti e Holanda vs Japão." },
    ],
  }),
  component: Index,
});

type Match = {
  id: string;
  home: string;
  away: string;
  homeFlag: string;
  awayFlag: string;
  date: string;
  time: string;
};

type Pick = "home" | "draw" | "away";

type HistoryItem = {
  id: string;
  matchId: string;
  matchLabel: string;
  pick: Pick;
  pickLabel: string;
  at: string;
};

const MATCHES: Match[] = [
  {
    id: "bra-hai",
    home: "Brasil",
    away: "Haiti",
    homeFlag: "🇧🇷",
    awayFlag: "🇭🇹",
    date: "21/06/2026",
    time: "21:30",
  },
  {
    id: "ned-jpn",
    home: "Holanda",
    away: "Japão",
    homeFlag: "🇳🇱",
    awayFlag: "🇯🇵",
    date: "15/06/2026",
    time: "16:00",
  },
];

const STORAGE_KEY = "citybets2026-history";

function Index() {
  const [selections, setSelections] = useState<Record<string, Pick | undefined>>({});
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setHistory(JSON.parse(raw));
    } catch {}
  }, []);

  const persist = (next: HistoryItem[]) => {
    setHistory(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const submit = (match: Match) => {
    const pick = selections[match.id];
    if (!pick) return;
    const pickLabel =
      pick === "home" ? match.home : pick === "away" ? match.away : "Empate";
    const item: HistoryItem = {
      id: crypto.randomUUID(),
      matchId: match.id,
      matchLabel: `${match.home} vs ${match.away}`,
      pick,
      pickLabel,
      at: new Date().toLocaleString("pt-BR"),
    };
    persist([item, ...history]);
    setSelections((s) => ({ ...s, [match.id]: undefined }));
  };

  const clear = () => persist([]);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_#0f2e1a,_#050b08)] text-emerald-50">
      <header className="border-b border-emerald-500/20 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-400 text-emerald-950 font-black text-lg shadow-[0_0_30px_rgba(52,211,153,0.5)]">
              CB
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">City Bets <span className="text-emerald-400">2026</span></h1>
              <p className="text-xs text-emerald-200/60">Palpites da Copa</p>
            </div>
          </div>
          <span className="hidden sm:inline rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
            ● Ao vivo
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <section>
          <h2 className="mb-6 text-2xl font-bold">Jogos em destaque</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {MATCHES.map((m) => {
              const sel = selections[m.id];
              return (
                <div
                  key={m.id}
                  className="rounded-2xl border border-emerald-500/20 bg-emerald-950/40 p-6 shadow-xl backdrop-blur transition hover:border-emerald-400/40"
                >
                  <div className="mb-4 flex items-center justify-between text-xs text-emerald-200/70">
                    <span>📅 {m.date}</span>
                    <span>⏰ {m.time}</span>
                  </div>
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-4xl">{m.homeFlag}</span>
                      <span className="font-semibold">{m.home}</span>
                    </div>
                    <span className="text-2xl font-black text-emerald-400/60">VS</span>
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-4xl">{m.awayFlag}</span>
                      <span className="font-semibold">{m.away}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      { k: "home" as Pick, l: m.home },
                      { k: "draw" as Pick, l: "Empate" },
                      { k: "away" as Pick, l: m.away },
                    ]).map((o) => (
                      <button
                        key={o.k}
                        onClick={() => setSelections((s) => ({ ...s, [m.id]: o.k }))}
                        className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                          sel === o.k
                            ? "border-emerald-400 bg-emerald-400 text-emerald-950"
                            : "border-emerald-500/30 bg-emerald-900/30 text-emerald-100 hover:border-emerald-400/60"
                        }`}
                      >
                        {o.l}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => submit(m)}
                    disabled={!sel}
                    className="mt-4 w-full rounded-lg bg-emerald-400 px-4 py-2.5 font-semibold text-emerald-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-emerald-900/50 disabled:text-emerald-200/40"
                  >
                    Confirmar palpite
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-12">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Histórico de palpites</h2>
            {history.length > 0 && (
              <button
                onClick={clear}
                className="text-xs text-emerald-300/70 underline-offset-4 hover:text-emerald-300 hover:underline"
              >
                Limpar tudo
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-emerald-500/20 bg-emerald-950/20 p-10 text-center text-emerald-200/60">
              Nenhum palpite ainda. Faça seu primeiro acima.
            </div>
          ) : (
            <ul className="space-y-2">
              {history.map((h) => (
                <li
                  key={h.id}
                  className="flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-950/40 px-5 py-3"
                >
                  <div>
                    <p className="font-semibold">{h.matchLabel}</p>
                    <p className="text-xs text-emerald-200/60">{h.at}</p>
                  </div>
                  <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-sm font-medium text-emerald-300">
                    {h.pickLabel}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <footer className="border-t border-emerald-500/10 py-6 text-center text-xs text-emerald-200/40">
        © 2026 City Bets — apenas para diversão
      </footer>
    </div>
  );
}
