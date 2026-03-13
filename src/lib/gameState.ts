export const TOTAL_BUDGET = 1500;

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
  { id: 'skilli', name: 'Skilli the Fox', emoji: '🦊', description: 'Quick & Clever!', trait: 'Budget Expert' },
  { id: 'bolt', name: 'Bolt the Robot', emoji: '🤖', description: 'Beep Boop!', trait: 'Strategy Master' },
  { id: 'luna', name: 'Luna the Cat', emoji: '🐈', description: 'Calm & Creative!', trait: 'Idea Gen' },
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
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'If you enter an amusement park, what would you do first?',
    options: [
      { label: 'A', text: 'Try the biggest ride', image: '/assets/items/thunder_coaster.png' },
      { label: 'B', text: 'Explore smaller fun rides', image: '/assets/items/spinning_teacups.png' },
      { label: 'C', text: 'Look for food and games', image: '/assets/items/funny_fries.png' },
    ],
    correctIndex: 1,
    explanation: 'Exploring smaller rides first is a great way to start your adventure!',
  },
  {
    id: 2,
    question: 'If you had limited money, what would you do?',
    options: [
      { label: 'A', text: 'Spend on thrilling rides', image: '/assets/items/ferris_wheel.png' },
      { label: 'B', text: 'Balance rides and food', image: '/assets/items/glitter_pizza.png' },
      { label: 'C', text: 'Save some money for activities', image: '/assets/items/photo_booth.png' },
    ],
    correctIndex: 1,
    explanation: 'Balancing your budget helps ensure you have fun all day long!',
  },
  {
    id: 3,
    question: 'Which part of an amusement park do you enjoy most?',
    options: [
      { label: 'A', text: 'Thrill rides', image: '/assets/items/bumper_cars.png' },
      { label: 'B', text: 'Food stalls', image: '/assets/items/rainbow_ice_cream.png' },
      { label: 'C', text: 'Games and activities', image: '/assets/items/arcade_zone.png' },
    ],
    correctIndex: 0, // No wrong answer for preference, but we'll mark one for logic
    explanation: 'There are so many fun things to do! Thrill rides are a park favorite!',
  },
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
