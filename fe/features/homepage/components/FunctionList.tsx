// ─────────────────────────────────────────────
// FunctionList — Section dịch vụ hỗ trợ thí sinh
// ─────────────────────────────────────────────

import ServiceCard from './ServiceCard';
import type { ServiceItem } from '@/features/homepage/bloc/homepage.state';

interface FunctionListProps {
  services: ServiceItem[];
}

export default function FunctionList({ services }: FunctionListProps) {
  return (
    <section className="px-10 py-16">
      {/* Section header */}
      <p className="text-[13px] font-bold uppercase tracking-[2px] mb-2 text-green-main">
        Dịch vụ tuyển sinh
      </p>
      <h2 className="text-[30px] font-extrabold mb-9 pl-4 text-green-dark border-l-[5px] border-gold">
        Hỗ Trợ Thí Sinh
      </h2>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-5">
        {services.map((service) => (
          <ServiceCard key={service.id} {...service} />
        ))}
      </div>
    </section>
  );
}