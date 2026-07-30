import buildCatalog from "@/data/builds.json";

type Build = {
  id: number;
  name: string;
  category: string;
  function_keywords: string[];
  deployed_url: string;
  repo?: string;
  date: string;
  what_it_does: string;
  status?: string;
};

const builds = [...(buildCatalog.builds as Build[])].sort((a, b) =>
  b.date.localeCompare(a.date),
);
const liveBuilds = builds.filter((build) => build.status !== "rejected");
const rejectedBuilds = builds.filter((build) => build.status === "rejected");
const categoryCounts = liveBuilds.reduce<Record<string, number>>((acc, build) => {
  acc[build.category] = (acc[build.category] ?? 0) + 1;
  return acc;
}, {});
const categories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);
const latestBuild = liveBuilds[0];

function titleize(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function BuildCard({ build, featured = false }: { build: Build; featured?: boolean }) {
  return (
    <article
      className={[
        "rounded-3xl border p-6 shadow-sm transition-transform duration-200 hover:-translate-y-1",
        featured
          ? "border-emerald-400/60 bg-emerald-400/10 shadow-emerald-500/10"
          : "border-white/10 bg-white/5",
      ].join(" ")}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
            {titleize(build.category)}
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-white">{build.name}</h3>
          <p className="mt-1 text-sm text-white/55">{build.date}</p>
        </div>
        {featured ? (
          <span className="rounded-full border border-emerald-300/40 bg-emerald-300/15 px-3 py-1 text-xs font-medium text-emerald-100">
            Latest build
          </span>
        ) : null}
      </div>

      <p className="mt-4 text-sm leading-7 text-white/78">{build.what_it_does}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {build.function_keywords.map((keyword) => (
          <span
            key={`${build.id}-${keyword}`}
            className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/68"
          >
            {keyword}
          </span>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <a
          className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-emerald-200"
          href={build.deployed_url}
          rel="noreferrer"
          target="_blank"
        >
          Open build ↗
        </a>
        {build.repo ? (
          <a
            className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white/88 transition hover:border-emerald-300/50 hover:text-emerald-200"
            href={build.repo}
            rel="noreferrer"
            target="_blank"
          >
            Repo ↗
          </a>
        ) : null}
      </div>
    </article>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_40%),linear-gradient(180deg,_#07111f,_#020617_55%,_#01030a)] text-white">
      <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-10">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur md:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.34em] text-emerald-300">
                Saki Builds
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                A live catalog of nightly builds, shipped by Saki.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
                Every card links to the deployed app, and when available, the repo behind it.
                The list is sourced from the nightly build registry and refreshed after new builds land.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-white/45">Live</p>
                <p className="mt-2 text-3xl font-semibold">{liveBuilds.length}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-white/45">Rejected</p>
                <p className="mt-2 text-3xl font-semibold">{rejectedBuilds.length}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-white/45">Categories</p>
                <p className="mt-2 text-3xl font-semibold">{categories.length}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-white/45">Latest</p>
                <p className="mt-2 text-lg font-semibold leading-6">{latestBuild?.name ?? "—"}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {categories.map(([category, count]) => (
              <span
                key={category}
                className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-sm text-emerald-100"
              >
                {titleize(category)} · {count}
              </span>
            ))}
          </div>
        </section>

        {latestBuild ? (
          <section className="mt-10">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-white/45">Freshest ship</p>
                <h2 className="mt-1 text-2xl font-semibold">Newest live build</h2>
              </div>
            </div>
            <BuildCard build={latestBuild} featured />
          </section>
        ) : null}

        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-white/45">Archive</p>
              <h2 className="mt-1 text-2xl font-semibold">Live build index</h2>
            </div>
            <p className="text-sm text-white/55">Newest first</p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {liveBuilds.map((build, index) => (
              <BuildCard key={build.id} build={build} featured={index === 0} />
            ))}
          </div>
        </section>

        {rejectedBuilds.length > 0 ? (
          <section className="mt-12 rounded-[2rem] border border-amber-300/12 bg-amber-300/6 p-8">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.28em] text-amber-200/70">Do not repeat</p>
              <h2 className="mt-1 text-2xl font-semibold text-amber-50">Rejected archetypes</h2>
              <p className="mt-3 text-sm leading-7 text-amber-50/75">
                These stay visible so the nightly system does not circle back into the same low-value pattern.
              </p>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {rejectedBuilds.map((build) => (
                <article key={build.id} className="rounded-3xl border border-amber-200/10 bg-black/15 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-xl font-semibold text-amber-50">{build.name}</h3>
                    <span className="rounded-full border border-amber-200/20 px-3 py-1 text-xs text-amber-100/80">
                      {titleize(build.category)}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-amber-50/70">{build.what_it_does}</p>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
