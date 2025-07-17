type InfoCardProps = {
  icon: string;
  label: string;
  value: string | number | null | undefined;
  color: 'green' | 'orange' | 'purple' | 'cyan';
};

export default function InfoCard({ icon, label, value, color }: InfoCardProps) {
  const colorClasses = {
    green: 'from-green-100 border-green-200 text-green-700',
    orange: 'from-orange-100 border-orange-200 text-orange-700',
    purple: 'from-purple-100 border-purple-200 text-purple-700',
    cyan: 'from-cyan-100 border-cyan-200 text-cyan-700',
  };

  return (
    <div className={`flex items-center gap-3 p-4 bg-gradient-to-r ${colorClasses[color]} to-white rounded-lg shadow-sm border`}>
      <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow">
        {icon}
      </span>
      <span className={`font-semibold`}>{label}:</span>
      <span className="text-gray-800">{value ?? '--'}</span>
    </div>
  );
}