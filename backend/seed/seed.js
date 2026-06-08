import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

dotenv.config();

const categories = [
  { name: 'Vegetables', slug: 'vegetables', icon: '🥦', description: 'Fresh farm vegetables' },
  { name: 'Fruits', slug: 'fruits', icon: '🍎', description: 'Seasonal fresh fruits' },
  { name: 'Cakes', slug: 'cakes', icon: '🎂', description: 'Delicious baked cakes' },
  { name: 'Biscuits', slug: 'biscuits', icon: '🍪', description: 'Crunchy cookies and biscuits' },
  { name: 'Dairy', slug: 'dairy', icon: '🥛', description: 'Milk, cheese and dairy products' },
  { name: 'Beverages', slug: 'beverages', icon: '🧃', description: 'Drinks and juices' },
];

const getProducts = (cats) => {
  const catMap = {};
  cats.forEach(c => { catMap[c.slug] = c._id; });

  return [
    // Vegetables
    { name: 'Carrot', price: 1.99, unit: 'kg', category: catMap['vegetables'], image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400', description: 'Fresh organic carrots' },
    { name: 'Broccoli', price: 2.49, unit: 'piece', category: catMap['vegetables'], image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400', description: 'Fresh green broccoli' },
    { name: 'Tomato', price: 1.49, unit: 'kg', category: catMap['vegetables'], image: 'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=400', description: 'Ripe red tomatoes' },
    { name: 'Spinach', price: 1.29, unit: 'pack', category: catMap['vegetables'], image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400', description: 'Fresh baby spinach leaves' },
    { name: 'Cucumber', price: 0.99, unit: 'piece', category: catMap['vegetables'], image: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=400', description: 'Cool and crisp cucumber' },
    { name: 'Bell Pepper', price: 1.79, unit: 'piece', category: catMap['vegetables'], image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400', description: 'Colorful bell peppers' },
    // Fruits
    { name: 'Apple', price: 3.49, unit: 'kg', category: catMap['fruits'], image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400', description: 'Sweet red apples' },
    { name: 'Banana', price: 1.99, unit: 'pack', category: catMap['fruits'], image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400', description: 'Fresh yellow bananas' },
    { name: 'Mango', price: 2.99, unit: 'piece', category: catMap['fruits'], image: 'https://images.unsplash.com/photo-1605027990121-cbae9e0642df?w=400', description: 'Sweet tropical mangoes' },
    { name: 'Grapes', price: 4.49, unit: 'kg', category: catMap['fruits'], image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400', description: 'Seedless green grapes' },
    { name: 'Strawberry', price: 3.99, unit: 'pack', category: catMap['fruits'], image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400', description: 'Fresh red strawberries' },
    { name: 'Orange', price: 2.49, unit: 'kg', category: catMap['fruits'], image: 'https://images.unsplash.com/photo-1548505743-5b9773f65ea6?w=400', description: 'Juicy sweet oranges' },
    // Cakes
    { name: 'Chocolate Cake', price: 18.99, unit: 'piece', category: catMap['cakes'], image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', description: 'Rich chocolate layer cake' },
    { name: 'Vanilla Sponge', price: 15.99, unit: 'piece', category: catMap['cakes'], image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400', description: 'Light and fluffy vanilla cake' },
    { name: 'Red Velvet', price: 22.99, unit: 'piece', category: catMap['cakes'], image: 'https://images.unsplash.com/photo-1586788224331-947f68671cf1?w=400', description: 'Classic red velvet with cream cheese' },
    { name: 'Fruit Cake', price: 19.99, unit: 'piece', category: catMap['cakes'], image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400', description: 'Mixed fruit celebration cake' },
    // Biscuits
    { name: 'Butter Cookies', price: 4.99, unit: 'pack', category: catMap['biscuits'], image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400', description: 'Crispy Danish butter cookies' },
    { name: 'Chocolate Chip', price: 5.49, unit: 'pack', category: catMap['biscuits'], image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400', description: 'Classic chocolate chip cookies' },
    { name: 'Digestive Biscuits', price: 3.99, unit: 'pack', category: catMap['biscuits'], image: 'https://images.unsplash.com/photo-1598373182133-52452f7691ef?w=400', description: 'Wholesome digestive biscuits' },
    { name: 'Oreo Pack', price: 6.99, unit: 'pack', category: catMap['biscuits'], image: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400', description: 'Classic cream-filled sandwich cookies' },
    // Dairy
    { name: 'Fresh Milk', price: 2.29, unit: 'litre', category: catMap['dairy'], image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400', description: 'Full-cream fresh milk' },
    { name: 'Cheddar Cheese', price: 5.99, unit: 'pack', category: catMap['dairy'], image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400', description: 'Aged cheddar cheese block' },
    // Beverages
    { name: 'Orange Juice', price: 3.49, unit: 'litre', category: catMap['beverages'], image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400', description: 'Fresh-squeezed orange juice' },
    { name: 'Green Tea', price: 4.99, unit: 'pack', category: catMap['beverages'], image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400', description: 'Premium Japanese green tea' },
  ];
};

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // Clear existing
  await Category.deleteMany({});
  await Product.deleteMany({});
  await User.deleteMany({ role: 'admin' });

  // Seed categories
  const cats = await Category.insertMany(categories);
  console.log('✅ Categories seeded');

  // Seed products
  await Product.insertMany(getProducts(cats));
  console.log('✅ Products seeded');

  // Create admin
  await User.create({
    name: 'Admin',
    email: 'admin@shop.com',
    password: 'admin123',
    role: 'admin'
  });
  console.log('✅ Admin user created: admin@shop.com / admin123');

  await mongoose.disconnect();
  console.log('🎉 Seeding complete!');
}

seed().catch(console.error);