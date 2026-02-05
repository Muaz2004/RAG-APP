import { motion } from "framer-motion";
import { FileText } from "lucide-react";

export default function ResultList({ results }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      variants={container} 
      initial="hidden" 
      animate="show" 
      className="grid gap-4"
    >
      {results.map((chunk, i) => (
        <motion.div 
          variants={item}
          key={i} 
          className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all cursor-default"
        >
          <div className="flex items-start gap-4">
            <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-indigo-100 transition-colors">
              <FileText size={16} className="text-slate-500 group-hover:text-indigo-600" />
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">Reference #{i + 1}</span>
              <p className="text-slate-600 text-sm mt-1 leading-relaxed">{chunk}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}