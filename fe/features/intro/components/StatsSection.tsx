import React from 'react';

interface StatBoxProps {
  icon: string;
  value: string;
  label: string;
}

const StatBox: React.FC<StatBoxProps> = ({ icon, value, label }) => {
  return (
    <div className="p-[40px_24px] text-center bg-white/3 transition-colors duration-200 hover:bg-white/10">
      <div className="text-[28px] mb-3">{icon}</div>
      <div className="font-vietnam text-[52px] font-bold text-gold-light leading-none mb-2">
        {value}
      </div>
      <div className="text-[13px] text-white/65 font-medium">
        {label}
      </div>
    </div>
  );
};

interface StatsSectionProps {
  data: StatBoxProps[];
}

const StatsSection: React.FC<StatsSectionProps> = ({ data }) => {
  return (
    <section id="stats" className="bg-gradient-to-br from-[#0d2b0d] to-[#1a4a1a] px-10 py-16">
      <div className="text-[13px] font-bold text-gold-light uppercase tracking-[2px] mb-2">
        Thành tựu
      </div>
      <h2 className="text-[30px] font-extrabold text-white mb-9 border-l-5 border-gold pl-4">
        Con Số Ấn Tượng
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-[2px] bg-white/6 rounded-2xl overflow-hidden">
        {data.map((stat, idx) => (
          <StatBox key={idx} {...stat} />
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
