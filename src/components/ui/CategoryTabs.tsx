import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CategoryTabsProps {
  categories: string[];
  selected: string;
  onChange: (category: string) => void;
}

export default function CategoryTabs({ categories, selected, onChange }: CategoryTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll selected category into view
    const selectedIndex = categories.indexOf(selected);
    if (selectedIndex !== -1 && scrollRef.current) {
      const container = scrollRef.current;
      const buttons = container.querySelectorAll('button');
      const button = buttons[selectedIndex];
      if (button) {
        const containerRect = container.getBoundingClientRect();
        const buttonRect = button.getBoundingClientRect();
        const scrollLeft = button.offsetLeft - containerRect.width / 2 + buttonRect.width / 2;
        container.scrollTo({ left: Math.max(0, scrollLeft), behavior: 'smooth' });
      }
    }
  }, [selected, categories]);

  return (
    <div className="pb-1 w-full">
      <div
        ref={scrollRef}
        className="flex overflow-x-auto hide-scrollbar px-8 gap-8"
      >
        {categories.map((category) => {
          const isSelected = selected === category;

          return (
            <button
              key={category}
              onClick={() => onChange(category)}
              className="relative py-2 px-1 whitespace-nowrap flex-shrink-0"
            >
              <span
                className={`text-wrap transition-all ${
                  isSelected ? 'font-bold text-btn-active' : 'font-medium text-white'
                }`}
              >
                {category}
              </span>

              {isSelected && (
                <motion.div
                  layoutId="categoryIndicator"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-[30px] bg-btn-active rounded-full shadow-sm"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

