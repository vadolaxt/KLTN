import React from 'react';

interface TimelineItemProps {
  year: string;
  badge: string;
  title: string;
  description: string;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ year, badge, title, description }) => {
  return (
    <div className="relative flex gap-0 mb-10 last:mb-0">
      <div className="w-[130px] shrink-0 text-right pr-7 pt-1 font-vietnam text-[28px] font-bold text-green-main leading-none">
        {year}
      </div>
      
      {/* Dot and Line */}
      <div className="absolute left-[121px] top-2 w-5 h-5 bg-gold rounded-full border-3 border-white shadow-[0_0_0_3px_#2d7a2d] z-10 shrink-0"></div>
      
      <div className="flex-1 pl-9 pt-0">
        <span className="inline-block bg-green-pale text-green-main text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-[0.5px] mb-2">
          {badge}
        </span>
        <h3 className="text-[16px] font-bold text-green-dark mb-1.5">{title}</h3>
        <p className="text-[14px] text-text-mid leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

interface HistoryTimelineProps {
  data: TimelineItemProps[];
}

const HistoryTimeline: React.FC<HistoryTimelineProps> = ({ data }) => {
  return (
    <section id="history" className="bg-gray-light px-10 py-16">
      <div className="mb-2">
        <div className="text-[13px] font-bold text-green-main uppercase tracking-[2px] mb-2">
          Quá trình phát triển
        </div>
        <h2 className="text-[30px] font-extrabold text-green-dark mb-9 border-l-5 border-gold pl-4">
          Lịch Sử Hình Thành
        </h2>
      </div>

      <div className="relative mt-2">
        {/* Continuous Line */}
        <div className="absolute left-[130px] top-0 bottom-0 w-[3px] bg-gradient-to-b from-green-main to-green-light rounded-sm"></div>
        
        {data.map((item, idx) => (
          <TimelineItem key={idx} {...item} />
        ))}
      </div>
    </section>
  );
};

export default HistoryTimeline;
