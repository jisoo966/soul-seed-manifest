import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/PhoneFrame";
import { BackButton } from "@/components/BackButton";
import detailMock from "@/assets/mock-detail.png.asset.json";

export const Route = createFileRoute("/postcards/$id")({
  head: () => ({ meta: [{ title: "Postcard — sisi" }] }),
  component: PostcardDetail,
});

function PostcardDetail() {
  return (
    <PhoneFrame hideTabs>
      <div
        className="relative min-h-[820px] overflow-hidden"
        style={{
          backgroundImage: `url(${detailMock.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute left-10 top-8 z-10">
          <BackButton to="/postcards" />
        </div>

        <div className="absolute inset-x-8 bottom-20 z-10 space-y-4">
          <button type="button" className="w-full rounded-[1.8rem] bg-lavender/60 px-8 py-5 serif text-[1.1rem] text-ink shadow-[0_18px_40px_rgba(77,93,170,0.14)] backdrop-blur-sm">
            View Postcard
          </button>
          <Link
            to="/"
            className="block w-full rounded-[1.8rem] bg-paper/70 px-8 py-5 text-center serif text-[1.1rem] text-ink shadow-[0_18px_40px_rgba(77,93,170,0.08)] backdrop-blur-sm"
          >
            Continue Journey
          </Link>
        </div>
      </div>
    </PhoneFrame>
  );
}
