import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Bell, Camera, Image as ImageIcon, Mail, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import homeMock from "@/assets/mock-home.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "sisi — a journey with your inner companion" },
      { name: "description", content: "Walk with your fox each day." },
    ],
  }),
  component: Journey,
});

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return "Good evening";
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function formatToday() {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());
}

function Journey() {
  const navigate = useNavigate();
  const [name, setName] = useState("Jisoo");
  const [today, setToday] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.localStorage.getItem("sisi:onboarded")) {
      navigate({ to: "/onboarding", replace: true });
      return;
    }
    setName(window.localStorage.getItem("sisi:name") || "Jisoo");
    setToday(formatToday());
  }, [navigate]);

  const bgStyle = useMemo(
    () => ({
      backgroundImage: `url(${homeMock.url})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }),
    [],
  );

  return (
    <PhoneFrame>
      <div className="relative min-h-[820px] overflow-hidden" style={bgStyle}>
        <div className="px-8 pt-10 pb-28">
          <div className="flex items-start justify-between">
            <div>
              <p className="serif text-[1.05rem] text-ink">{today}</p>
              <h1 className="mt-6 serif text-[4rem] leading-[0.9] text-ink">
                {greeting()},
                <br />
                {name}
              </h1>
            </div>
            <button
              type="button"
              aria-label="Notifications"
              className="mt-1 text-ink"
            >
              <Bell size={26} strokeWidth={1.8} />
            </button>
          </div>

          <div className="mt-10 flex justify-center">
            <div className="h-14 w-14 rounded-full bg-paper/75 backdrop-blur-[2px] shadow-[0_0_30px_rgba(255,244,188,0.65)] grid place-items-center">
              <Star className="h-8 w-8 fill-[rgba(255,219,97,0.9)] text-white stroke-[1.5]" />
            </div>
          </div>
        </div>

        <Link
          to="/capture"
          aria-label="Capture a moment"
          className="absolute right-8 bottom-42 h-[74px] w-[74px] rounded-full border border-white/65 bg-paper/45 backdrop-blur-md grid place-items-center shadow-[0_24px_50px_rgba(68,86,167,0.18)]"
        >
          <Camera size={28} strokeWidth={1.8} className="text-ink" />
        </Link>

        <nav className="absolute left-8 right-8 bottom-7 rounded-[2rem] border border-white/80 bg-paper/55 backdrop-blur-xl shadow-[0_24px_60px_rgba(80,100,170,0.18)] px-8 py-5">
          <ul className="flex items-center justify-between text-ink">
            <li>
              <Link to="/" aria-label="Home" className="grid place-items-center">
                <HomeTab active icon={<div className="h-[54px] w-[54px] rounded-[1.2rem] bg-paper grid place-items-center shadow-[0_8px_18px_rgba(0,0,0,0.06)]"><HomeIcon /></div>} />
              </Link>
            </li>
            <li>
              <Link to="/postcards" aria-label="Postcards" className="grid place-items-center">
                <ImageIcon size={28} strokeWidth={1.8} />
              </Link>
            </li>
            <li>
              <Link to="/messages" aria-label="Messages" className="grid place-items-center">
                <Mail size={28} strokeWidth={1.8} />
              </Link>
            </li>
            <li>
              <Link to="/stars" aria-label="Stars" className="grid place-items-center">
                <Star size={28} strokeWidth={1.8} />
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </PhoneFrame>
  );
}

function HomeTab({ icon }: { active?: boolean; icon: React.ReactNode }) {
  return <>{icon}</>;
}

function HomeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M3.5 10.5L12 4L20.5 10.5V20H3.5V10.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9.5 20V13.5H14.5V20" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}
