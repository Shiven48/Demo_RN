interface ColorSelectorProps {
  color: string;
  isSelected?: boolean;
  onPress?: () => void;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

const SIZE_CONFIG = {
  small: {
    container: 'w-8 h-8',
    colorCircle: 'w-5 h-5',
  },
  medium: {
    container: 'w-10 h-10',
    colorCircle: 'w-6 h-6',
  },
  large: {
    container: 'w-10 h-10',
    colorCircle: 'w-8 h-8',
  },
};

export default function ColorSelector({
  color,
  isSelected = false,
  onPress,
  size = 'medium',
  disabled = false,
}: ColorSelectorProps) {
  const config = SIZE_CONFIG[size];
  const isInteractive = !!onPress && !disabled;

  const getBackgroundColor = (colorName: string) => {
    return colorName.toLowerCase() === 'white' ? '#FFFFFF' : colorName.toLowerCase();
  };

  return (
    <button
      onClick={isInteractive ? onPress : undefined}
      disabled={!isInteractive}
      className={`${config.container} rounded-full flex items-center justify-center border-2 ${
        isSelected ? 'border-brand-teal' : 'border-transparent'
      } ${isInteractive ? 'hover:scale-95 cursor-pointer' : 'cursor-default'} transition-transform`}
    >
      <div
        className={`${config.colorCircle} rounded-full border shadow-sm ${
          size === 'large' ? 'border-gray-200' : 'border-2 border-brand-teal'
        }`}
        style={{ backgroundColor: getBackgroundColor(color) }}
      />
    </button>
  );
}

