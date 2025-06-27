export default function Card({ title, content, icon }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-xl hover:shadow-emerald-500/20 transition-all hover:-translate-y-1 cursor-pointer">
      {icon && <div className="text-4xl text-emerald-400 mb-4">{icon}</div>}
      <h3 className="text-xl font-bold mb-2 text-emerald-300">{title}</h3>
      <p className="text-slate-300">{content}</p>
    </div>
  );
} 