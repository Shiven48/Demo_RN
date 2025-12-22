import { motion } from 'framer-motion';

interface PillSwitchProps {
  options: string[];
  selected: string;
  onChange: (value: string) => void;
}

export default function PillSwitch({ options, selected, onChange }: PillSwitchProps) {
  const selectedIndex = options.indexOf(selected);

  return (
    <div className="mx-4 mb-4">
      <div className="relative flex bg-btn-inactive rounded-full py-2 px-1 border border-btn-active/20">
        {/* Animated Background */}
        <motion.div
          className="absolute top-1 bottom-1 bg-btn-active rounded-full"
          initial={false}
          animate={{
            x: `${selectedIndex * 100}%`,
            width: `${100 / options.length}%`,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{ left: '4px', right: '4px' }}
        />

        {options.map((option) => (
          <button
            key={option}
            onClick={() => onChange(option)}
            className="flex-1 py-2 px-3 rounded-xl relative z-10 transition-colors"
          >
            <span
              className={`text-center font-bold text-xs tracking-wide ${
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

