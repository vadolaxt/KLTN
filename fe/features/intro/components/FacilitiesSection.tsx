import React from 'react';

interface FacilityCardProps {
  icon: string;
  name: string;
  desc: string;
  colorClass: string;
}

const FacilityCard: React.FC<FacilityCardProps> = ({ icon, name, desc, colorClass }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border-1.5 border-gray-mid transition-all duration-250 hover:shadow-[0_10px_32px_rgba(45,122,45,0.15)] hover:border-green-light hover:-translate-y-1">
      <div className={`w-full h-[180px] flex items-center justify-center text-[52px] relative overflow-hidden ${colorClass}`}>
        {icon}
      </div>
      <div className="p-5">
        <h3 className="text-[15px] font-bold text-green-dark mb-2">{name}</h3>
        <p className="text-[13px] text-text-light leading-relaxed">{desc}</p>
      </div>
    </div>
  );
};

interface FacilitiesSectionProps {
  data: FacilityCardProps[];
}

const FacilitiesSection: React.FC<FacilitiesSectionProps> = ({ data }) => {
  return (
    <section id="facilities" className="bg-gray-light px-10 py-16">
      <div className="text-[13px] font-bold text-green-main uppercase tracking-[2px] mb-2">
        Hạ tầng giáo dục
      </div>
      <h2 className="text-[30px] font-extrabold text-green-dark mb-9 border-l-5 border-gold pl-4">
        Cơ Sở Vật Chất
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {data.map((facility, idx) => (
          <FacilityCard key={idx} {...facility} />
        ))}
      </div>
    </section>
  );
};

export default FacilitiesSection;
