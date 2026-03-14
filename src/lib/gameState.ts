export const TOTAL_BUDGET = 1500;

export interface SouvenirDesign {
  color: string;
  icon: string;
  pattern: 'none' | 'sparkles' | 'stripes' | 'stars';
  shape: 'circle' | 'hexagon' | 'star';
}

export const SOUVENIR_PATTERNS = [
  { id: 'none', label: 'Solid Color', icon: '🎨' },
  { id: 'sparkles', label: 'Sparkles', icon: '✨' },
  { id: 'stripes', label: 'Stripes', icon: '🦓' },
  { id: 'stars', label: 'Mini Stars', icon: '⭐' },
];

export const SOUVENIR_SHAPES = [
  { id: 'circle', label: 'Classic Circle', icon: '⭕' },
  { id: 'hexagon', label: 'Modern Hex', icon: '⬢' },
  { id: 'star', label: 'Super Star', icon: '⭐' },
];

export type RideType = 'small' | 'big';
export type ItemCategory = 'ride' | 'meal' | 'activity';

export interface ParkItem {
  id: string;
  name: string;
  cost: number;
  category: ItemCategory;
  emoji: string;
  description: string;
  isOutdoor?: boolean;
  color: string;
  imageUrl: string;
}

export interface AvatarOption {
  id: string;
  name: string;
  emoji: string;
  description: string;
  trait: string;
}

export interface EarnedBadge {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

export const AVATAR_OPTIONS: AvatarOption[] = [
  { id: 'girl', name: 'Girl', emoji: '👧', description: 'Smart & Creative!', trait: 'Adventure Explorer' },
  { id: 'boy', name: 'Boy', emoji: '👦', description: 'Brave & Curious!', trait: 'Strategy Master' },
];

export type WeatherType = 'sunny' | 'rainy' | 'holiday';

export interface WeatherOption {
  type: WeatherType;
  name: string;
  emoji: string;
  modifier: string;
  description: string;
}

export const WEATHER_OPTIONS: WeatherOption[] = [
  { type: 'sunny', name: 'Perfectly Sunny', emoji: '☀️', modifier: 'None', description: 'A great day for rides!' },
  { type: 'rainy', name: 'Rainy Adventure', emoji: '🌦️', modifier: 'Meals & Activities are 20% cheaper!', description: 'Outdoor big rides might be slippery!' },
  { type: 'holiday', name: 'Busy Holiday', emoji: '🎉', modifier: 'Everything costs ₹50 more!', description: 'Crowded but festive!' },
];

export const PARK_ITEMS: ParkItem[] = [
  { id: 'r1', name: 'Thunder Coaster', cost: 400, category: 'ride', emoji: '🎢', description: 'The fastest ride in the park!', isOutdoor: true, color: 'primary', imageUrl: '/assets/items/thunder_coaster.png' },
  { id: 'r2', name: 'Giant Ferris Wheel', cost: 400, category: 'ride', emoji: '🎡', description: 'Amazing views from the top!', isOutdoor: true, color: 'purple', imageUrl: '/assets/items/ferris_wheel.png' },
  { id: 'r3', name: 'Spinning Teacups', cost: 200, category: 'ride', emoji: '☕', description: 'Whirl and twirl around!', isOutdoor: false, color: 'accent', imageUrl: '/assets/items/spinning_teacups.png' },
  { id: 'r4', name: 'Carousel', cost: 200, category: 'ride', emoji: '🎠', description: 'A classic ride for everyone.', isOutdoor: true, color: 'pink', imageUrl: '/assets/items/carousel.png' },
  { id: 'r5', name: 'Bumper Cars', cost: 200, category: 'ride', emoji: '🚗', description: 'Bump into your friends!', isOutdoor: false, color: 'secondary', imageUrl: '/assets/items/bumper_cars.png' },
  { id: 'r6', name: 'Jungle Safari', cost: 400, category: 'ride', emoji: '🦁', description: 'See wild animals up close!', isOutdoor: true, color: 'orange', imageUrl: '/assets/items/jungle_safari.png' },
  
  { id: 'm1', name: 'Funny Fries', cost: 100, category: 'meal', emoji: '🍟', description: 'Crispy and golden!', color: 'orange', imageUrl: '/assets/items/funny_fries.png' },
  { id: 'm2', name: 'Glitter Pizza', cost: 100, category: 'meal', emoji: '🍕', description: 'A cheesy treat!', color: 'sunny', imageUrl: '/assets/items/glitter_pizza.png' },
  { id: 'm3', name: 'Rainbow Ice Cream', cost: 100, category: 'meal', emoji: '🍦', description: 'Cool and sweet!', color: 'pink', imageUrl: '/assets/items/rainbow_ice_cream.png' },
  
  { id: 'a1', name: 'Arcade Zone', cost: 100, category: 'activity', emoji: '🕹️', description: 'Play the latest games!', color: 'secondary', imageUrl: '/assets/items/arcade_zone.png' },
  { id: 'a2', name: 'Photo Booth', cost: 100, category: 'activity', emoji: '📸', description: 'Take silly memories home.', color: 'purple', imageUrl: '/assets/items/photo_booth.png' },
  { id: 'a3', name: 'Face Painting', cost: 100, category: 'activity', emoji: '🎨', description: 'Transform into a tiger!', color: 'accent', imageUrl: '/assets/items/face_painting.png' },
];

export interface QuizQuestion {
  id: number;
  question: string;
  options: { label: string; text: string; image?: string }[];
  correctIndex: number;
  explanation: string;
  round?: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // Round 1
  {
    id: 1,
    round: 'Round 1: Quick Budget Quiz',
    question: 'You enter the amusement park with ₹1,500. What should you do first?',
    options: [
      { label: 'A', text: 'Spend it all on the biggest ride', image: '/assets/items/thunder_coaster.png' },
      { label: 'B', text: 'Plan how to use the money', image: '/assets/items/animated_map_bg.png' },
      { label: 'C', text: 'Buy food immediately', image: '/assets/items/funny_fries.png' },
    ],
    correctIndex: 1,
    explanation: 'Planning helps you spend wisely and avoid running out of money.',
  },
  {
    id: 2,
    round: 'Round 1: Quick Budget Quiz',
    question: 'A big ride costs ₹400. If you take 2 big rides, how much will you spend?',
    options: [
      { label: 'A', text: '₹600', image: '/assets/items/ferris_wheel.png' },
      { label: 'B', text: '₹700' },
      { label: 'C', text: '₹800' },
    ],
    correctIndex: 2,
    explanation: '₹400 + ₹400 = ₹800. Remember your math!',
  },
  {
    id: 3,
    round: 'Round 1: Quick Budget Quiz',
    question: 'A snack costs ₹100 and a game costs ₹100. What is the total cost?',
    options: [
      { label: 'A', text: '₹150' },
      { label: 'B', text: '₹200', image: '/assets/items/glitter_pizza.png' },
      { label: 'C', text: '₹300' },
    ],
    correctIndex: 1,
    explanation: '₹100 + ₹100 = ₹200. Yummy and fun!',
  },
  {
    id: 4,
    round: 'Round 1: Quick Budget Quiz',
    question: 'If you spend ₹1,200 from ₹1,500, how much money is left?',
    options: [
      { label: 'A', text: '₹200' },
      { label: 'B', text: '₹300' },
      { label: 'C', text: '₹400' },
    ],
    correctIndex: 1,
    explanation: '₹1,500 - ₹1,200 = ₹300. You still have some money left!',
  },
  
  // Round 2
  {
    id: 5,
    round: 'Round 2: Spend Smart Challenge',
    question: 'Your team wants: 1 Big Ride (₹400), 2 Small Rides (₹200 each), and 1 Snack (₹100). How much money will you spend?',
    options: [
      { label: 'A', text: '₹700' },
      { label: 'B', text: '₹800' },
      { label: 'C', text: '₹900' },
    ],
    correctIndex: 2,
    explanation: '₹400 + ₹200 + ₹200 + ₹100 = ₹900. You will have ₹600 left from your ₹1,500 budget!',
  },
  {
    id: 6,
    round: 'Round 2: Spend Smart Challenge',
    question: 'If you only have ₹300 left, what is the smartest choice?',
    options: [
      { label: 'A', text: 'Spend everything on one ride', image: '/assets/items/thunder_coaster.png' },
      { label: 'B', text: 'Save some and buy a snack', image: '/assets/items/rainbow_ice_cream.png' },
      { label: 'C', text: 'Ignore the money', image: '/assets/items/jungle_safari.png' },
    ],
    correctIndex: 1,
    explanation: 'Smart budgeting includes saving and spending wisely.',
  },

  // Round 3
  {
    id: 7,
    round: 'Round 3: Save • Spend • Share',
    question: 'One friend forgot money for snacks. What should your team do?',
    options: [
      { label: 'A', text: 'Ignore them' },
      { label: 'B', text: 'Share food with them', image: '/assets/items/glitter_pizza.png' },
      { label: 'C', text: 'Tell them to watch' },
    ],
    correctIndex: 1,
    explanation: 'Sharing builds team spirit and kindness! Sharing is caring.',
  },
  {
    id: 8,
    round: 'Round 3: Save • Spend • Share',
    question: 'If you save ₹200 from ₹1,500, how much did you spend?',
    options: [
      { label: 'A', text: '₹1,200' },
      { label: 'B', text: '₹1,300' },
      { label: 'C', text: '₹1,400' },
    ],
    correctIndex: 1,
    explanation: '₹1,500 - ₹200 = ₹1,300. You spent most of it!',
  },

  // Riddles
  {
    id: 9,
    round: 'Budget Riddles',
    question: 'I help you plan before you buy. I stop your money from saying goodbye. People use me before they spend. What am I?',
    options: [
      { label: 'A', text: 'A Budget' },
      { label: 'B', text: 'A Wallet' },
      { label: 'C', text: 'A Receipt' },
    ],
    correctIndex: 0,
    explanation: 'A budget is your plan for how to use your money wisely!',
  },
  {
    id: 10,
    round: 'Budget Riddles',
    question: 'I can be big or small. People scream when they ride me at the park. But if I cost ₹400, you must think before trying me. What am I?',
    options: [
      { label: 'A', text: 'A Monster' },
      { label: 'B', text: 'A Big Ride', image: '/assets/items/thunder_coaster.png' },
      { label: 'C', text: 'A Haunted House' },
    ],
    correctIndex: 1,
    explanation: 'Big rides are super fun but cost more money!',
  },
  {
    id: 11,
    round: 'Budget Riddles',
    question: 'If you keep some money for later and do not spend it now, what smart habit are you showing?',
    options: [
      { label: 'A', text: 'Shopping' },
      { label: 'B', text: 'Sharing' },
      { label: 'C', text: 'Saving' },
    ],
    correctIndex: 2,
    explanation: 'Saving is a great way to have fun later or buy something bigger!',
  },
  {
    id: 12,
    round: 'Budget Riddles',
    question: 'You have ₹1,500. You buy: 1 Big Ride (₹400), 2 Small Rides (₹200 each), 1 Snack (₹100), 1 Activity (₹100). How much money is left?',
    options: [
      { label: 'A', text: '₹300' },
      { label: 'B', text: '₹400' },
      { label: 'C', text: '₹500' },
    ],
    correctIndex: 2,
    explanation: 'Total spent = ₹400 + ₹200 + ₹200 + ₹100 + ₹100 = ₹1,000. So, ₹1,500 - ₹1,000 = ₹500 left!',
  },

  // Final Thinking Question
  {
    id: 13,
    round: 'Final Thinking Question',
    question: 'If you had ₹500 left at the park, would you SAVE it, SPEND it, or SHARE it?',
    options: [
      { label: 'A', text: 'SAVE it for later!' },
      { label: 'B', text: 'SPEND it on more fun!' },
      { label: 'C', text: 'SHARE it with friends!' },
    ],
    correctIndex: -1, 
    explanation: "All choices are great! Saving builds for the future, spending enjoys the moment wisely, and sharing spreads happiness!",
  }
];

export interface ItinerarySlot {
  id: string;
  label: string;
  itemId: string | null;
}

export const DEFAULT_ITINERARY: ItinerarySlot[] = [
  { id: 'slot-1', label: '🌅 Arrival at Park', itemId: null },
  { id: 'slot-2', label: '🎢 First Ride', itemId: null },
  { id: 'slot-3', label: '🎠 Second Ride', itemId: null },
  { id: 'slot-4', label: '🍕 Meal Break', itemId: null },
  { id: 'slot-5', label: '🎯 Activity Time', itemId: null },
  { id: 'slot-6', label: '🎡 Final Ride', itemId: null },
];
