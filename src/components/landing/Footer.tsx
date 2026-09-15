import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/5 px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium text-white">Waitplay</p>
          <p className="mt-1 text-sm text-zinc-500">
            Make Waiting for AI Fun. Built for Commons Made by XElvolution.
          </p>
        </div>
        <div className="flex gap-4 text-sm text-zinc-400">
          <Link href="/demo" className="hover:text-white">
            Demo
          </Link>
          <Link href="/history" className="hover:text-white">
            History
          </Link>
          <a
            href="https://github.com/xElvolution/waitplay"
            className="hover:text-white"
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
