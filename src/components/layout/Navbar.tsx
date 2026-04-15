import Link from "next/link";

const navItems = [
  { label: "Start Survey", href: "/start-survey" },
  { label: "View Guideline", href: "/view-guideline" },
  { label: "Random Survey", href: "/random-survey6" },
  { label: "Perception Profile", href: "/perception-profile" },
];

export default function Navbar() {
  return (
    <section
      className="glass-panel fade-rise w-full max-w-3xl rounded-4xl p-4 sm:p-8 md:p-10"
      aria-label="Option chooser"
    >
      <p className="mb-2 text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-teal-700/80 sm:text-xs sm:tracking-[0.3em]">
        Image Sense
      </p>
      <h1 className="mb-6 text-center text-2xl font-bold text-slate-800 sm:mb-8 sm:text-4xl">Choose Your Experience</h1>
      <nav className="w-full">
        <ul className="grid list-none grid-cols-1 gap-4 p-0 sm:gap-5">
          {navItems.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="group inline-block w-full rounded-3xl border border-cyan-100/80 bg-linear-to-r from-cyan-50 to-sky-100/70 px-5 py-4 text-center text-base font-semibold text-slate-700 no-underline transition duration-300 hover:-translate-y-1 hover:border-cyan-300 hover:text-slate-900 hover:shadow-[0_12px_24px_rgba(2,132,199,0.18)] sm:px-8 sm:py-7 sm:text-xl"
              >
                <span className="inline-flex items-center gap-2">
                  {item.label}
                  <span className="translate-y-px text-cyan-700 opacity-0 transition group-hover:opacity-100">+</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
