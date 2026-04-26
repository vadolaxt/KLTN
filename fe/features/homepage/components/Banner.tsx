// ─────────────────────────────────────────────
// Banner — Hero section trang chủ
// ─────────────────────────────────────────────

export default function Banner() {
  return (
    <section className="relative min-h-[420px] flex items-center overflow-hidden bg-[linear-gradient(135deg,#0d2b0d_0%,#1e5c1e_40%,#2d7a2d_70%,#1a4a1a_100%)]">
      {/* Pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-100" />

      {/* Decorative seal */}
      <div className="absolute left-[80px] top-1/2 -translate-y-1/2 w-[280px] h-[280px] opacity-[0.18]">
        <div className="w-full h-full rounded-full flex items-center justify-center text-[60px] font-black border-4 border-white/30 text-white/40">
          NLU
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 py-[60px] pr-[60px] ml-[420px]">
        <h1 className="font-black text-white leading-none tracking-[-1px] text-[72px] drop-shadow-[0_4px_24px_rgba(0,0,0,0.3)] font-vietnam">
          TUYỂN SINH
        </h1>
        <h2 className="text-white font-extrabold text-[40px] mt-2 tracking-[-0.5px]">
          TRƯỜNG ĐẠI HỌC <span className="text-gold-light">NÔNG LÂM TP.HCM</span>
        </h2>
        <p className="mt-4 mb-8 text-[20px] italic font-normal text-white/85">
          Hành trình kiến tạo tương lai vững chắc
        </p>
        <button className="px-9 py-4 text-[16px] font-extrabold tracking-[0.3px] rounded-lg transition-all duration-200 bg-gold text-[#1a1a1a] shadow-[0_4px_20px_rgba(201,162,39,0.4)] hover:bg-gold-light hover:-translate-y-[2px] hover:shadow-[0_8px_28px_rgba(201,162,39,0.5)]">
          Xem Ngay Phương Thức Xét Tuyển →
        </button>
      </div>
    </section>
  );
}