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
      className="w-full max-w-4xl rounded-2xl border border-slate-200 bg-white p-5 shadow-xl"
      aria-label="Option chooser"
    >
      <h1 className="mb-3 text-center text-sm font-semibold uppercase tracking-wide text-slate-600 sm:text-lg">
        Choose an Option
      </h1>
      <nav className="w-full">
        <ul className="grid list-none grid-cols-1 gap-2.5 p-0 sm:grid-cols-2 sm:gap-3">
          {navItems.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="inline-block w-full rounded-xl border border-blue-100 bg-linear-to-b from-sky-50 to-blue-50 px-3 py-3 text-center text-sm font-semibold text-slate-700 no-underline transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700 hover:shadow-lg sm:px-4 sm:py-4"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
