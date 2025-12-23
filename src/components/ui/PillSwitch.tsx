import { motion } from 'framer-motion';

interface PillSwitchProps {
  options: string[];
  selected: string;
  onChange: (value: string) => void;
}
export default function PillSwitch({ options, selected, onChange }: PillSwitchProps) {
  const selectedIndex = options.indexOf(selected);
  const totalOptions = options.length;

  return (
    <div className="mx-4 mb-4">
      {/* Added p-1 to container to create a gutter */}
      <div className="relative flex bg-btn-inactive rounded-full p-1 border border-btn-active/20">
        {/* Animated Background */}
        <motion.div
          className="absolute top-1 bottom-1 bg-btn-active rounded-full"
          initial={false}
          animate={{
            // Calculation: move by (100% / total) for each index
            x: `${selectedIndex * 100}%`,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{ 
            width: `calc(100% / ${totalOptions} - 8px)`, // Subtract padding offset
            left: '4px' 
          }}
        />

        {options.map((option) => (
          <button
            key={option}
            onClick={() => onChange(option)}
            // Ensure button takes equal share of space
            className="flex-1 py-2 px-3 rounded-full relative z-10 transition-colors"
          >
            <span className={`text-center block font-bold text-xs tracking-wide ${
                selected === option ? 'text-txt-active' : 'text-txt-inactive/40'
              }`}
            >
              {option}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}