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
      className="w-full max-w-2xl rounded-4xl border border-slate-200 bg-white p-8 shadow-xl sm:p-10"
      aria-label="Option chooser"
    >
      <h1 className="mb-6 text-center text-xl font-semibold uppercase tracking-wide text-slate-600 sm:text-2xl">
        Choose an Option
      </h1>
      <nav className="w-full">
        <ul className="grid list-none grid-cols-1 gap-4 p-0 sm:gap-5">
          {navItems.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="inline-block w-full rounded-3xl border border-blue-100 bg-linear-to-b from-sky-50 to-blue-50 px-6 py-6 text-center text-xl font-semibold text-slate-700 no-underline transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700 hover:shadow-lg sm:px-8 sm:py-7 sm:text-2xl"
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
