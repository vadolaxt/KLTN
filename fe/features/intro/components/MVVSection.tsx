import React from 'react';

interface MVVCardProps {
  type: 'mission' | 'vision' | 'values';
  icon: string;
  label: string;
  title: string;
  text?: string;
  items?: string[];
}

const MVVCard: React.FC<MVVCardProps> = ({ type, icon, label, title, text, items }) => {
  const styles = {
    mission: 'bg-gradient-to-br from-[#1a4a1a] to-[#2d7a2d] text-white',
    vision: 'bg-white border-2 border-gray-mid text-text-dark',
    values: 'bg-gradient-to-br from-[#7a5c1a] to-[#c9a227] text-white',
  };

  const labelStyles = {
    mission: 'text-white/60',
    vision: 'text-green-main',
    values: 'text-white/60',
  };

  const titleStyles = {
    mission: 'text-white',
    vision: 'text-green-dark',
    values: 'text-white',
  };

  return (
    <div className={`rounded-2xl p-[36px_30px] relative overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl ${styles[type]}`}>
      <div className={`w-[60px] h-[60px] rounded-2xl flex items-center justify-center mb-5 text-[28px] ${
        type === 'vision' ? 'bg-green-pale' : 'bg-white/15'
      }`}>
        {icon}
      </div>
      
      <div className={`text-[11px] font-bold uppercase tracking-[2px] mb-2.5 ${labelStyles[type]}`}>
        {label}
      </div>
      
      <h3 className={`text-[22px] font-extrabold mb-3.5 leading-tight ${titleStyles[type]}`}>
        {title}
      </h3>
      
      {text && <p className={`text-[14px] leading-[1.75] ${type === 'vision' ? 'text-text-mid' : 'text-white/85'}`}>{text}</p>}
      
      {items && (
        <div className="mt-4 space-y-2.5">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2.5 text-[14px] font-semibold text-white/90">
              <div className="w-2 h-2 bg-gold-light rounded-full shrink-0"></div>
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface MVVItem {
  icon: string;
  label: string;
  title: string;
  text?: string;
  items?: string[];
}

interface MVVSectionProps {
  data: {
    mission: MVVItem;
    vision: MVVItem;
    values: MVVItem;
  };
}

const MVVSection: React.FC<MVVSectionProps> = ({ data }) => {
  return (
    <section id="mvv" className="px-10 py-16">
      <div className="text-[13px] font-bold text-green-main uppercase tracking-[2px] mb-2">
        Định hướng chiến lược
      </div>
      <h2 className="text-[30px] font-extrabold text-green-dark mb-9 border-l-5 border-gold pl-4">
        Sứ Mệnh, Tầm Nhìn & Giá Trị Cốt Lõi
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MVVCard type="mission" {...data.mission} />
        <MVVCard type="vision" {...data.vision} />
        <MVVCard type="values" {...data.values} />
      </div>
    </section>
  );
};

export default MVVSection;
