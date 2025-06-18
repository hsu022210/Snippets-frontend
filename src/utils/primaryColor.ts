export const PRIMARY_COLOR_KEY = 'snippets-primary-color';

export const PRIMARY_COLORS = [
  // Blues
  { value: '#AFD0D6', label: 'Light Blue' },
  { value: '#91B7C7', label: 'Sky Blue' },
  { value: '#0E79B2', label: 'Ocean Blue' },
  { value: '#0d6efd', label: 'Bootstrap Blue' },
  { value: '#345995', label: 'Navy Blue' },
  { value: '#084C61', label: 'Dark Blue' },
  { value: '#7EA0B7', label: 'Blue Gray' },
  { value: '#3D5A6C', label: 'Steel Blue' },
  
  // Greens
  { value: '#73E2A7', label: 'Mint Green' },
  { value: '#739E82', label: 'Sage Green' },
  { value: '#1C7C54', label: 'Forest Green' },
  { value: '#61988E', label: 'Teal' },
  { value: '#466365', label: 'Dark Teal' },
  
  // Grays
  { value: '#ADBABD', label: 'Light Gray' },
  { value: '#878787', label: 'Gray' },
  { value: '#433A3F', label: 'Charcoal' },
  
  // Purples
  { value: '#690375', label: 'Purple' },
  { value: '#493843', label: 'Dark Purple' },
  { value: '#B0228C', label: 'Fandango' },
  { value: '#A08794', label: 'Mauve' },
  
  // Reds/Oranges
  { value: '#FF3C38', label: 'Vermilion' },
  { value: '#FF6B6B', label: 'Coral Red' },
  { value: '#FF9770', label: 'Peach' },
  { value: '#FE480B', label: 'Tangelo' },
  { value: '#F39237', label: 'Orange' },
  { value: '#BF1363', label: 'Pink' },
  
  // Yellows
  { value: '#F9DC5C', label: 'Yellow' }
];

export const getPrimaryColor = (): string => {
  const stored = localStorage.getItem(PRIMARY_COLOR_KEY);
  return stored || '#0d6efd'; // Default to Bootstrap blue
};

export const setPrimaryColor = (color: string): void => {
  localStorage.setItem(PRIMARY_COLOR_KEY, color);
};

export const getPrimaryColorLabel = (color: string): string => {
  const colorOption = PRIMARY_COLORS.find(c => c.value === color);
  return colorOption ? colorOption.label : 'Custom';
}; 