"use client";
import Image from "next/image";
import { Button } from "./button";
import { PhoneIcon } from "lucide-react";
import { useEffect, useState } from "react";

function Timer({ startSeconds = 272 }: { startSeconds?: number }) {
  const [s, setS] = useState(startSeconds);
  useEffect(() => {
    const id = setInterval(() => setS((p) => p + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const m = Math.floor(s / 60)
    .toString()
    .padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return (
    <span className="text-xs text-white/50 tabular-nums">
      {m}:{sec}
    </span>
  );
}
export const Overview = () => {
  const [micOn, setMicOn] = useState(false);
  const [camOn, setCamOn] = useState(false);
  const [chatOpen, setChatOpen] = useState(true);
  return (
    <div>
      <div className="flex border-b bg-[#30302e]  px-8 py-4 justify-between">
        <div className="flex items-end ">
          <Image src="/img/logo.png" alt="Logo" width={100} height={100} />
          <h1 className="text-2xl md:block hidden text-custom font-bold">MECAL.AI</h1>
        </div>
        <div className="flex text-[16px] h-10 items-end gap-2">
          <Button className="md:block hidden" variant="outline">Features</Button>
          <Button className="md:block hidden" variant="outline">Pricing</Button>
          <Button variant="custom">Try Free</Button>
        </div>
      </div>
      <section className="relative overflow-hidden text-center px-6 py-20 bg-[#1e1e1b] border-b bg-dots">
        <div className="absolute top-6 left-6 text-sm bg-white px-3 py-1 rounded-full shadow floaty">
          🟢 Tiếng Việt tự nhiên
        </div>
        <div className="absolute top-6 right-6 text-sm bg-white px-3 py-1 rounded-full shadow floaty">
          ⚡ &lt;300ms
        </div>
        <div className="absolute md:block hidden bottom-6 left-6 text-sm bg-white px-3 py-1 rounded-full shadow floaty">
          🔒 Bảo mật
        </div>
        <div className="absolute md:block hidden bottom-6 right-6 text-sm bg-white px-3 py-1 rounded-full shadow floaty">
          🟣 Điều chỉnh giọng nói tùy thích
        </div>

        <div className="relative flex items-center justify-center mb-6">
          <div className="absolute ring"></div>
          <div className="absolute ring"></div>
          <div className="absolute ring"></div>

          <div className="w-20 h-20 bg-background-custom rounded-full flex items-center justify-center text-white text-xl z-10 shadow-lg">
            <PhoneIcon />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 bg-blue-50 text-background-custom text-sm px-4 py-1 rounded-full mb-4">
          <span className="w-2 h-2 bg-background-custom rounded-full animate-pulse"></span>
          AI đang hoạt động
        </div>

        <h1 className="text-3xl md:text-5xl text-white font-bold leading-tight mb-4">
          Trò chuyện trực tiếp
          <br />
          với <span className="text-background-custom">trí tuệ nhân tạo</span>
        </h1>

        <p className="text-[#a5aab6] max-w-md mx-auto mb-8">
          Giao tiếp tự nhiên bằng giọng nói — AI lắng nghe và phản hồi ngay lập
          tức.
        </p>

        <div className="flex justify-center gap-4">
          <Button className="flex items-center gap-2 bg-background-custom text-white px-6 py-3 rounded-full">
            Gọi ngay
          </Button>
          <Button className="px-5 py-3  border rounded-full ">
            Try Free
          </Button>
        </div>
      </section>
      <section className="w-full mx-auto md:px-50 px-4 py-10">
        <p className="text-xl font-bold uppercase tracking-widest  mb-4">
          Tính năng nổi bật
        </p>

        <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
          <div className="bg-white border rounded-xl p-4">
            <div className="mb-2">🎙</div>
            <h3 className="font-medium text-xl">Nhận dạng giọng nói</h3>
            <p className="text-sm text-gray-500">Hiểu tiếng Việt tự nhiên</p>
          </div>

          <div className="bg-white border rounded-xl p-4">
            <div className="mb-2">⚡</div>
            <h3 className="font-medium text-xl">Phản hồi tức thì</h3>
            <p className="text-sm text-gray-500">Độ trễ thấp</p>
          </div>

          <div className="bg-white border rounded-xl p-4">
            <div className="mb-2">🧠</div>
            <h3 className="font-medium text-xl">Hiểu ngữ cảnh</h3>
            <p className="text-sm text-gray-500">Không lặp lại</p>
          </div>

          <div className="bg-white border rounded-xl p-4">
            <div className="mb-2">🔒</div>
            <h3 className="font-medium text-xl">Bảo mật</h3>
            <p className="text-sm text-gray-500">End-to-end</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-[10px] mt-6">
          {[
            { num: "98%", label: "Độ chính xác" },
            { num: "<0.3s", label: "Thời gian phản hồi" },
            { num: "24/7", label: "Luôn sẵn sàng" },
          ].map((s) => (
            <div key={s.label} className="bg-muted rounded-lg p-4 text-center">
              <span className="font-display text-[21px] font-semibold text-[#185FA5] block">
                {s.num}
              </span>
              <span className="text-[11px] text-muted-foreground mt-[2px] block">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      <div className="bg-[#30302e] p-5">
        <div className="flex items-center gap-2.5 px-5 py-4 max-w-150 mx-auto">
          <div className="flex-1 h-px bg-border/20" />
          <span className="text-[16px] text-white">cuộc gọi mẫu</span>
          <div className="flex-1 h-px bg-border/20" />
        </div>
        <div className="bg-[#0a0f1a] rounded-2xl overflow-hidden font-sans">
          {/* ── topbar ── */}
          <div className="flex items-center justify-between px-4 py-3 bg-white/[0.04] border-b border-white/[0.07]">
            <div className="flex items-center gap-2">
              <div className="w-[26px] h-[26px] bg-[#185FA5] rounded-lg flex items-center justify-center shrink-0">
                <svg
                  className="w-[14px] h-[14px] fill-white"
                  viewBox="0 0 24 24"
                >
                  <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
                </svg>
              </div>
              <span className="text-[13px] font-medium text-white/90">
                Tư vấn lập trình Python
              </span>
            </div>

            <div className="flex items-center gap-[6px]">
              <span className="w-[7px] h-[7px] bg-[#E24B4A] rounded-full animate-[rpulse_1.5s_infinite]" />
              <Timer />
            </div>

            <div className="flex items-center gap-[6px]">
              {[
                "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z",
                "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z",
              ].map((p, i) => (
                <button
                  key={i}
                  className="w-[30px] h-[30px] rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors"
                >
                  <svg
                    className="w-[14px] h-[14px] fill-white/60"
                    viewBox="0 0 24 24"
                  >
                    <path d={p} />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* ── tiles ── */}
          <div className="grid grid-cols-2 gap-1 p-1 min-h-[320px]">
            {/* AI tile */}
            <div className="bg-[#0d1829] border border-[#185FA5]/30 rounded-xl flex flex-col items-center justify-center relative min-h-[150px]">
              <div className="relative flex flex-col items-center justify-center mb-3">
                <span className="absolute w-[90px] h-[90px] rounded-full border-[1.5px] border-[#185FA5]/40 animate-[orbring_2s_ease-in-out_infinite]" />
                <span className="absolute w-[110px] h-[110px] rounded-full border-[1.5px] border-[#185FA5]/40 animate-[orbring_2s_ease-in-out_0.5s_infinite]" />
                <div className="w-[72px] h-[72px] bg-[#185FA5] rounded-full flex items-center justify-center relative z-10">
                  <svg className="w-8 h-8 fill-white" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                  </svg>
                </div>
              </div>

              <div className="flex items-center gap-[3px] mb-2">
                {[8, 12, 18, 12, 8, 14, 10].map((h, i) => (
                  <span
                    key={i}
                    className="inline-block w-[3px] bg-[#5DCAA5] rounded-sm animate-wave"
                    style={{ height: h, animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>

              <div className="absolute bottom-[10px] left-3 flex items-center gap-[5px] bg-black/50 rounded-md px-2 py-[3px]">
                <svg
                  className="w-[11px] h-[11px] fill-white/60"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                </svg>
                <span className="text-[11px] text-white/85">
                  voiAI Assistant
                </span>
              </div>
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#1D9E75] rounded-full animate-[rpulse_1s_infinite]" />
            </div>

            {/* User tile */}
            <div className="bg-[#111520] rounded-xl flex flex-col items-center justify-center relative min-h-[150px]">
              <div className="w-16 h-16 rounded-full bg-[#1e2a3a] border-2 border-white/10 flex items-center justify-center font-display text-xl font-bold text-white/70 mb-[10px]">
                TN
              </div>
              <span className="text-[11px] text-white/35">Micro đang tắt</span>

              <div className="absolute bottom-[10px] left-3 flex items-center gap-[5px] bg-black/50 rounded-md px-2 py-[3px]">
                <svg
                  className="w-[11px] h-[11px] fill-white/60"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
                <span className="text-[11px] text-white/85">Bạn</span>
              </div>
              {!micOn && (
                <div className="absolute top-2 right-2 flex items-center gap-[3px] bg-[#E24B4A]/20 border border-[#E24B4A]/40 rounded-md px-[7px] py-[2px]">
                  <svg
                    className="w-[10px] h-[10px] fill-[#F09595]"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z" />
                  </svg>
                  <span className="text-[10px] text-[#F09595]">Tắt mic</span>
                </div>
              )}
            </div>
          </div>

          {/* ── subtitle ── */}
          <div className="bg-white/[0.04] border-t border-white/[0.07] px-4 py-[10px] min-h-[44px] flex items-center">
            <p className="text-[13px] text-white/80 leading-relaxed">
              <span className="text-[#5DCAA5] font-medium mr-[6px]">
                voiAI:
              </span>
              Để xử lý list comprehension trong Python, bạn có thể viết như
              sau...
              <span className="inline-block w-[2px] h-[13px] bg-[#5DCAA5] rounded-sm align-middle ml-[2px] animate-[blink_0.9s_infinite]" />
            </p>
          </div>

          {/* ── controls ── */}
          <div className="flex items-center justify-center gap-[10px] px-4 py-[14px] bg-white/[0.02] border-t border-white/[0.07]">
            {[
              {
                label: "Micro",
                active: micOn,
                danger: !micOn,
                onClick: () => setMicOn(!micOn),
                path: micOn
                  ? "M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"
                  : "M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z",
              },
              {
                label: "Camera",
                active: camOn,
                onClick: () => setCamOn(!camOn),
                path: "M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z",
              },
              {
                label: "Chat",
                active: chatOpen,
                onClick: () => setChatOpen(!chatOpen),
                path: "M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z",
              },
              {
                label: "Tài liệu",
                path: "M20 19.59V8l-6-6H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c.45 0 .85-.15 1.19-.4l-4.43-4.43c-.8.52-1.74.83-2.76.83-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5c0 1.02-.31 1.96-.83 2.75L20 19.59zM9 13c0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3-3 1.34-3 3z",
              },
              {
                label: "Thêm",
                path: "M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z",
              },
            ].map(({ label, active, danger, onClick, path }) => (
              <div key={label} className="flex flex-col items-center gap-[3px]">
                <button
                  onClick={onClick}
                  className={[
                    "w-11 h-11 rounded-full border flex items-center justify-center cursor-pointer transition-all hover:scale-105",
                    danger
                      ? "bg-[#E24B4A]/20 border-[#E24B4A]/40"
                      : active
                        ? "bg-[#185FA5]/30 border-[#185FA5]/50"
                        : "bg-white/[0.06] border-white/[0.12] hover:bg-white/[0.12]",
                  ].join(" ")}
                >
                  <svg
                    className={[
                      "w-4.5 h-4.5",
                      danger
                        ? "fill-[#F09595]"
                        : active
                          ? "fill-[#85B7EB]"
                          : "fill-white/80",
                    ].join(" ")}
                    viewBox="0 0 24 24"
                  >
                    <path d={path} />
                  </svg>
                </button>
                <span className="text-[10px] text-white/30">{label}</span>
              </div>
            ))}

            {/* End call */}
            <div className="flex flex-col items-center gap-[3px]">
              <button className="w-13 h-13 rounded-full bg-[#A32D2D]/50 border border-[#E24B4A]/50 flex items-center justify-center cursor-pointer hover:bg-[#A32D2D]/75 transition-colors">
                <svg className="w-5.5 h-5.5 fill-white" viewBox="0 0 24 24">
                  <path
                    d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"
                    transform="rotate(135 12 12)"
                  />
                </svg>
              </button>
              <span className="text-[10px] text-white/30">Kết thúc</span>
            </div>
          </div>

          {/* ── chat panel ── */}
          {chatOpen && (
            <div className="mx-1 mb-1 bg-[#0d1120] rounded-xl border border-white/[0.06] overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.06]">
                <span className="text-[11px] text-white/40 font-medium tracking-[0.05em] uppercase">
                  Tin nhắn trong cuộc gọi
                </span>
              </div>
              <div className="p-3 flex flex-col gap-2">
                {[
                  {
                    sender: "AI",
                    side: "left",
                    avatar: "#185FA5",
                    text: "Xin chào! Tôi sẵn sàng hỗ trợ bạn về Python hôm nay.",
                    time: "04:01",
                  },
                  {
                    sender: "TN",
                    side: "right",
                    avatar: "#2d3748",
                    text: "Giải thích list comprehension giúp tôi nhé",
                    time: "04:18",
                  },
                  {
                    sender: "AI",
                    side: "left",
                    avatar: "#185FA5",
                    text: "Đang giải thích bằng giọng nói cho bạn nghe... 🎙",
                    time: "04:32",
                  },
                ].map(({ sender, side, avatar, text, time }) => (
                  <div
                    key={time}
                    className={`flex gap-[7px] items-start ${side === "right" ? "flex-row-reverse" : ""}`}
                  >
                    <div
                      className="w-5.5 h-5.5 rounded-full flex items-center justify-center text-[9px] font-semibold text-white shrink-0 mt-[1px]"
                      style={{ background: avatar }}
                    >
                      {sender}
                    </div>
                    <div
                      className={`flex flex-col ${side === "right" ? "items-end" : ""}`}
                    >
                      <div
                        className={`text-[12px] text-white/80 leading-relaxed px-[10px] py-[6px] rounded-[10px] max-w-[85%] ${side === "right" ? "rounded-tr-[3px] bg-[#185FA5]/25" : "rounded-tl-[3px] bg-white/[0.06]"}`}
                      >
                        {text}
                      </div>
                      <span className="text-[10px] text-white/20 mt-[2px]">
                        {time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <footer className=" bg-[#252526] border-t border-border/20">
        <div
          className=" md:mx-32 mx-0 px-6 pt-8 pb-6 grid grid-cols-2 md:grid-cols-[1.6fr_1fr_1fr] gap-8"
         
        >
          {/* brand */}
          <div>
            <a href="#" className="flex items-center gap-[9px] no-underline">
              <div className="w-[34px] h-[34px] bg-[#185FA5] rounded-[10px] flex items-center justify-center relative shrink-0">
                <Image src="/img/logo.png" alt="Logo" width={24} height={24} />
                
              </div>
              <span className="font-display text-[17px] font-bold tracking-[-0.02em] text-custom">
                MecalAI
              </span>
            </a>
            <p className="text-[15px] text-muted-foreground leading-[1.65] mt-3 max-w-[200px]">
              Nền tảng gọi AI hàng đầu Việt Nam — kết nối thông minh, tức thì và
              an toàn.
            </p>
            <div className="flex gap-2 mt-4">
              {[
                "M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z",
                "M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h8.615v-6.96h-2.338v-2.725h2.338v-2c0-2.325 1.42-3.592 3.5-3.592.699-.002 1.399.034 2.095.107v2.42h-1.435c-1.128 0-1.348.538-1.348 1.325v1.735h2.697l-.35 2.725h-2.348V21H20a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1z",
                "M21.593 7.203a2.506 2.506 0 0 0-1.762-1.766C18.265 5.007 12 5 12 5s-6.264-.007-7.831.404a2.56 2.56 0 0 0-1.766 1.778c-.413 1.566-.417 4.814-.417 4.814s-.004 3.264.406 4.814c.23.857.905 1.534 1.763 1.765 1.582.43 7.83.437 7.83.437s6.265.007 7.831-.403a2.515 2.515 0 0 0 1.767-1.763c.414-1.565.417-4.812.417-4.812s.02-3.265-.407-4.831zM9.998 15.005l.005-6 5.207 3.005-5.212 2.995z",
              ].map((path, i) => (
                <button
                  key={i}
                  className="w-[30px] h-[30px] rounded-lg border border-border/20 bg-transparent flex items-center justify-center cursor-pointer transition-all hover:border-border/40 hover:bg-muted"
                >
                  <svg
                    className="w-[14px] h-[14px] fill-muted-foreground"
                    viewBox="0 0 24 24"
                  >
                    <path d={path} />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* Sản phẩm */}
          <div>
            <h5 className="text-[14px] font-medium text-white mb-3 tracking-[0.02em]">
              Sản phẩm
            </h5>
            {["Tính năng", "Bảng giá", "API", "Cập nhật"].map((item) => (
              <a
                key={item}
                href="#"
                className="block text-[14px] text-muted-foreground no-underline mb-2 cursor-pointer transition-colors hover:text-foreground"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Hỗ trợ */}
          <div>
            <h5 className="text-[14px] font-medium text-white mb-3 tracking-[0.02em]">
              Hỗ trợ
            </h5>
            {["Trung tâm hỗ trợ", "Bảo mật", "Điều khoản", "Liên hệ"].map(
              (item) => (
                <a
                  key={item}
                  href="#"
                  className="block text-[14px] text-muted-foreground no-underline mb-2 cursor-pointer transition-colors hover:text-foreground"
                >
                  {item}
                </a>
              ),
            )}
          </div>
        </div>

        {/* bottom bar */}
        <div className="border-t border-border/20  mx-auto px-6 py-4   gap-2">
          <p className="text-[11px] w-full text-center text-muted-foreground/50">
            © 2026 MecalAI. Bảo lưu mọi quyền.
          </p>
        </div>
      </footer>
    </div>
  );
};
