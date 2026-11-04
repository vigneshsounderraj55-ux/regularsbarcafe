import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL || '';
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(url, anonKey, {
  auth: { persistSession: true, autoRefreshToken: true },
});

export const FALLBACK_MENU = [
  { id: 'f1', name: 'Flat White', description: 'Velvet microfoam over a double ristretto — smooth and balanced.', price: null, image_url: 'https://images.pexels.com/photos/15747033/pexels-photo-15747033.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'coffee', is_available: true, is_featured: true, sort_order: 1 },
  { id: 'f2', name: 'Mocha', description: 'Espresso, steamed milk and rich chocolate — a comforting classic.', price: null, image_url: 'https://images.pexels.com/photos/19723753/pexels-photo-19723753.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'coffee', is_available: true, is_featured: true, sort_order: 2 },
  { id: 'f3', name: 'Cappuccino', description: 'Espresso topped with airy steamed milk and a dusting of cocoa.', price: null, image_url: 'https://images.pexels.com/photos/14630362/pexels-photo-14630362.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'coffee', is_available: true, is_featured: false, sort_order: 3 },
  { id: 'f4', name: 'Latte', description: 'Silky steamed milk poured over espresso, finished with latte art.', price: null, image_url: 'https://images.pexels.com/photos/14633306/pexels-photo-14633306.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'coffee', is_available: true, is_featured: false, sort_order: 4 },
  { id: 'f5', name: 'Iced Spanish Latte', description: 'Bold espresso, chilled milk and condensed milk over ice — a house favourite.', price: null, image_url: 'https://images.pexels.com/photos/35213548/pexels-photo-35213548.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'cold-coffee', is_available: true, is_featured: true, sort_order: 1 },
  { id: 'f6', name: 'Cold Coffee', description: 'Slow-blended cold coffee — rich, smooth and refreshing.', price: null, image_url: 'https://images.pexels.com/photos/37604037/pexels-photo-37604037.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'cold-coffee', is_available: true, is_featured: true, sort_order: 2 },
  { id: 'f7', name: 'Iced Mocha', description: 'Espresso, chocolate and chilled milk over ice.', price: null, image_url: 'https://images.pexels.com/photos/38430631/pexels-photo-38430631.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'cold-coffee', is_available: true, is_featured: false, sort_order: 3 },
  { id: 'f8', name: 'Peach Iced Tea', description: 'Fresh-brewed tea, peach and a hint of citrus over ice.', price: null, image_url: 'https://images.pexels.com/photos/5598273/pexels-photo-5598273.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'iced-beverages', is_available: true, is_featured: true, sort_order: 1 },
  { id: 'f9', name: 'Iced Latte', description: 'Chilled milk and espresso over ice — clean and crisp.', price: null, image_url: 'https://images.pexels.com/photos/36590025/pexels-photo-36590025.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'iced-beverages', is_available: true, is_featured: false, sort_order: 2 },
  { id: 'f10', name: 'Masala Chai', description: 'Spiced milk tea brewed the traditional way.', price: null, image_url: 'https://images.pexels.com/photos/13383489/pexels-photo-13383489.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'tea', is_available: true, is_featured: false, sort_order: 1 },
  { id: 'f11', name: 'Hot Chocolate', description: 'Rich chocolate, steamed milk and whipped cream.', price: null, image_url: 'https://images.pexels.com/photos/29642267/pexels-photo-29642267.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'tea', is_available: true, is_featured: false, sort_order: 2 },
  { id: 'f12', name: 'Chicken Sandwich', description: 'Seasoned chicken, fresh greens and house spread on toasted bread.', price: null, image_url: 'https://images.pexels.com/photos/36673264/pexels-photo-36673264.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'sandwiches', is_available: true, is_featured: true, sort_order: 1 },
  { id: 'f13', name: 'Mushroom Sandwich', description: 'Sautéed mushrooms, herbs and melted cheese — a no-nonsense favourite.', price: null, image_url: 'https://images.pexels.com/photos/34227758/pexels-photo-34227758.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'sandwiches', is_available: true, is_featured: true, sort_order: 2 },
  { id: 'f14', name: 'Veg Sandwich', description: 'Garden vegetables, feta and greens on rustic bread.', price: null, image_url: 'https://images.pexels.com/photos/28396795/pexels-photo-28396795.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'sandwiches', is_available: true, is_featured: false, sort_order: 3 },
  { id: 'f15', name: 'Loaded Fries', description: 'Golden fries with cream sauce and house seasoning.', price: null, image_url: 'https://images.pexels.com/photos/4394048/pexels-photo-4394048.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'snacks', is_available: true, is_featured: false, sort_order: 1 },
  { id: 'f16', name: 'Crispy Fries', description: 'Classic golden fries served with a house dip.', price: null, image_url: 'https://images.pexels.com/photos/5652262/pexels-photo-5652262.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'snacks', is_available: true, is_featured: false, sort_order: 2 },
];

export const FALLBACK_GALLERY = [
  { id: 'g1', image_url: 'https://images.pexels.com/photos/34338427/pexels-photo-34338427.jpeg?auto=compress&cs=tinysrgb&w=800', alt_text: 'Warm and inviting rustic coffee shop interior with wooden furniture and soft lighting', size: 'big', sort_order: 1 },
  { id: 'g2', image_url: 'https://images.pexels.com/photos/17641094/pexels-photo-17641094.jpeg?auto=compress&cs=tinysrgb&w=600', alt_text: 'Barista skillfully pours coffee into a red cup', size: 'tall', sort_order: 2 },
  { id: 'g3', image_url: 'https://images.pexels.com/photos/39047893/pexels-photo-39047893.jpeg?auto=compress&cs=tinysrgb&w=600', alt_text: 'Cozy cafe interior with warm pendant lights and elegant decor', size: 'standard', sort_order: 3 },
  { id: 'g4', image_url: 'https://images.pexels.com/photos/2251752/pexels-photo-2251752.jpeg?auto=compress&cs=tinysrgb&w=600', alt_text: 'Intricate latte art in a teal mug', size: 'standard', sort_order: 4 },
  { id: 'g5', image_url: 'https://images.pexels.com/photos/4920899/pexels-photo-4920899.jpeg?auto=compress&cs=tinysrgb&w=800', alt_text: 'Friends playing board games in a cozy café', size: 'wide', sort_order: 5 },
  { id: 'g6', image_url: 'https://images.pexels.com/photos/34255748/pexels-photo-34255748.jpeg?auto=compress&cs=tinysrgb&w=600', alt_text: 'Barista serving a beautifully crafted latte', size: 'tall', sort_order: 6 },
  { id: 'g7', image_url: 'https://images.pexels.com/photos/35213548/pexels-photo-35213548.jpeg?auto=compress&cs=tinysrgb&w=600', alt_text: 'Refreshing iced coffee with ice cubes', size: 'standard', sort_order: 7 },
  { id: 'g8', image_url: 'https://images.pexels.com/photos/35518412/pexels-photo-35518412.jpeg?auto=compress&cs=tinysrgb&w=600', alt_text: 'Warm and inviting interior of a rustic cafe', size: 'standard', sort_order: 8 },
  { id: 'g9', image_url: 'https://images.pexels.com/photos/39910783/pexels-photo-39910783.jpeg?auto=compress&cs=tinysrgb&w=800', alt_text: 'Friends laughing and enjoying coffee at a cozy cafe', size: 'wide', sort_order: 9 },
  { id: 'g10', image_url: 'https://images.pexels.com/photos/34258683/pexels-photo-34258683.jpeg?auto=compress&cs=tinysrgb&w=600', alt_text: 'Macro shot of roasted coffee beans', size: 'standard', sort_order: 10 },
  { id: 'g11', image_url: 'https://images.pexels.com/photos/7898213/pexels-photo-7898213.jpeg?auto=compress&cs=tinysrgb&w=600', alt_text: 'Rustic coffee shop interior with wooden furniture and vintage elements', size: 'tall', sort_order: 11 },
  { id: 'g12', image_url: 'https://images.pexels.com/photos/36673264/pexels-photo-36673264.jpeg?auto=compress&cs=tinysrgb&w=600', alt_text: 'Delicious sandwich with chips and a cold drink', size: 'standard', sort_order: 12 },
];

export const FALLBACK_REVIEWS = [
  { id: 'r1', quote: 'Great coffee and fast service. Very genz coded. Do try their iced spanish latte!', source: 'Google Review', sort_order: 1 },
  { id: 'r2', quote: 'The ambience is very cozy with board games around to chill and hangout with friends. Their mocha coffee was good. Loved the ambiance and the food.', source: 'Google Review', sort_order: 2 },
  { id: 'r3', quote: 'A nice new cafe place in HRBR layout. Went during Saturday afternoon, had chicken sandwich, mushroom sandwich and cold coffee. All of that was no nonsense food. Food was good and atmosphere was better.', source: 'Google Review', sort_order: 3 },
];

export const FALLBACK_CONTACT = {
  address_line1: 'Regulars Coffee Bar',
  address_line2: 'HRBR Layout, Kalyan Nagar,',
  address_line3: 'Bengaluru, Karnataka, India.',
  instagram_url: 'https://www.instagram.com/regularscoffeebar/',
  google_maps_query: 'HRBR Layout Kalyan Nagar Bengaluru Karnataka',
  hours_line1: 'Hours to be confirmed by the owner.',
  hours_line2: '',
  phone: '',
};

export async function fetchMenu() {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data && data.length > 0 ? data : FALLBACK_MENU;
  } catch {
    return FALLBACK_MENU;
  }
}

export async function fetchGallery() {
  try {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data && data.length > 0 ? data : FALLBACK_GALLERY;
  } catch {
    return FALLBACK_GALLERY;
  }
}

export async function fetchReviews() {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('is_featured', true)
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data && data.length > 0 ? data : FALLBACK_REVIEWS;
  } catch {
    return FALLBACK_REVIEWS;
  }
}

export async function fetchContactInfo() {
  try {
    const { data, error } = await supabase
      .from('contact_info')
      .select('*')
      .eq('id', 1)
      .maybeSingle();
    if (error) throw error;
    return data || FALLBACK_CONTACT;
  } catch {
    return FALLBACK_CONTACT;
  }
}
