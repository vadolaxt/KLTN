interface EmptyScoreCellProps {
  label?: string;
}

export default function EmptyScoreCell({ label = '-' }: EmptyScoreCellProps) {
  return (
    <span className="inline-flex min-h-8 min-w-[82px] items-center justify-center rounded-md border border-dashed border-gray-mid bg-white px-3 text-[12px] font-bold text-text-light transition-colors group-hover:border-green-light group-hover:text-green-main">
      {label}
    </span>
  );
}
