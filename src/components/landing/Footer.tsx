import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] px-4 py-12 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium tracking-tight text-white">Waitplay</p>
          <p className="mt-1.5 text-sm text-zinc-500">
            Make Waiting for AI Fun. Wait-layer SDK and app by XElvolution.
          </p>
        </div>
        <div className="flex flex-wrap gap-5 text-sm text-zinc-400">
          <Link href="/#metrics" className="transition hover:text-white">
            Metrics
          </Link>
          <Link href="/#modes" className="transition hover:text-white">
            Modes
          </Link>
          <Link href="/session" className="transition hover:text-white">
            Session
          </Link>
          <a
            href="https://github.com/xElvolution/waitplay"
            className="transition hover:text-white"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
