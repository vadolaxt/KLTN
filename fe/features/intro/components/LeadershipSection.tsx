import React from 'react';

interface LeaderCardProps {
  avatar: string;
  name: string;
  title: string;
}

const LeaderCard: React.FC<LeaderCardProps> = ({ avatar, name, title }) => {
  return (
    <div className="group text-center p-[32px_20px] border-1.5 border-gray-mid rounded-2xl transition-all duration-250 relative overflow-hidden hover:shadow-[0_8px_28px_rgba(45,122,45,0.14)] hover:border-green-light hover:-translate-y-1">
      {/* Top Border Indicator */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-green-main scale-x-0 transition-transform duration-250 group-hover:scale-x-100 origin-left"></div>
      
      <div className="w-[90px] h-[90px] rounded-full mx-auto mb-4 flex items-center justify-center text-[32px] font-black text-white bg-gradient-to-br from-green-dark to-green-main border-3 border-gold font-vietnam">
        {avatar}
      </div>
      <h3 className="text-[15px] font-bold text-green-dark mb-1">{name}</h3>
      <p className="text-[13px] text-text-light leading-[1.45] whitespace-pre-line">{title}</p>
    </div>
  );
};

interface LeadershipSectionProps {
  data: LeaderCardProps[];
}

const LeadershipSection: React.FC<LeadershipSectionProps> = ({ data }) => {
  return (
    <section id="leadership" className="px-10 py-16">
      <div className="text-[13px] font-bold text-green-main uppercase tracking-[2px] mb-2">
        Tổ chức
      </div>
      <h2 className="text-[30px] font-extrabold text-green-dark mb-9 border-l-5 border-gold pl-4">
        Ban Lãnh Đạo Nhà Trường
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.map((leader, idx) => (
          <LeaderCard key={idx} {...leader} />
        ))}
      </div>
    </section>
  );
};

export default LeadershipSection;
