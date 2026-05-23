import React from 'react';

interface BadgeProps {
  icon: string;
  label: string;
}

const PartnerBadge: React.FC<BadgeProps> = ({ icon, label }) => {
  return (
    <div className="bg-white border-2 border-gray-mid rounded-xl p-[16px_22px] text-[13px] font-bold text-green-dark text-center min-w-[110px] transition-all duration-200 hover:border-green-main hover:shadow-[0_4px_14px_rgba(45,122,45,0.14)] leading-tight">
      <div className="text-[24px] mb-1.5">{icon}</div>
      <div className="whitespace-pre-line">{label}</div>
    </div>
  );
};

interface AccreditationSectionProps {
  data: {
    title: string;
    description: string;
    badges: BadgeProps[];
  };
}

const AccreditationSection: React.FC<AccreditationSectionProps> = ({ data }) => {
  return (
    <div className="bg-green-pale px-10 py-12 flex flex-col lg:flex-row items-center gap-16">
      <div className="flex-1">
        <h3 className="text-[22px] font-extrabold text-green-dark mb-3">
          {data.title}
        </h3>
        <p className="text-[14.5px] text-text-mid leading-[1.75]">
          {data.description}
        </p>
      </div>
      <div className="flex gap-4 flex-wrap justify-center shrink-0">
        {data.badges.map((badge, idx) => (
          <PartnerBadge key={idx} {...badge} />
        ))}
      </div>
    </div>
  );
};

export default AccreditationSection;
