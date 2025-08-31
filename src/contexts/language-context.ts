import { createContext } from 'react';

export interface LanguageContextType {
  language: 'EN' | 'AR';
  toggleLanguage: () => void;
  t: (key: string) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const translations = {
  EN: {
    // Header
    home: 'Home',
    products: 'Products',
    about: 'About',
    contact: 'Contact',
    cart: 'Cart',
    
    // Hero Section
    touchOfWard: 'Touch of Ward',
    welcomeTo: 'Welcome to',
    rozesGallery: 'Rozes Gallery',
    heroDescription: 'Discover luxury jewelry, exquisite roses, and elegant accessories that embody sophistication and grace.',
    exploreCollection: 'Explore Collection',
    ourStory: 'Our Story',
    
    // Featured Products
    featuredCollection: 'Featured Collection',
    curatedFor: 'Curated for',
    elegance: 'Elegance',
    featuredDescription: 'Handpicked pieces that represent the finest in luxury and craftsmanship',
    viewAllProducts: 'View All Products',
    
    // Special Offers
    specialOffers: 'Special Offers',
    offersDescription: 'Limited time deals on our most beloved pieces',
    shopNow: 'Shop Now',
    
    // About Section
    aboutRozesGallery: 'About Rozes Gallery',
    ourStoryTitle: 'Our Story',
    aboutDescription: 'At Rozes Gallery, we believe in the power of beauty to transform lives. Our journey began with a simple vision: to bring elegance and luxury to everyone through carefully curated collections.',
    touchOfWardTitle: 'Touch of Ward',
    touchOfWardDescription1: '"Touch of Ward" represents our commitment to adding a special touch to every moment. Ward, meaning guardian or protector, symbolizes our dedication to protecting the beauty and elegance in life\'s precious moments.',
    touchOfWardDescription2: 'Every product in our gallery is more than just an item – it\'s a piece of artistry designed to enhance your most treasured experiences and create lasting memories.',
    ourValues: 'Our Values',
    valuesDescription: 'The principles that guide us in creating exceptional experiences',
    luxury: 'Luxury',
    luxuryDescription: 'We believe in providing only the finest quality products that embody elegance and sophistication.',
    excellence: 'Excellence',
    excellenceDescription: 'We strive for perfection in every aspect of our business, from product quality to customer service.',
    innovation: 'Innovation',
    innovationDescription: 'Constantly evolving our collection with the latest trends while maintaining timeless elegance.',
    trust: 'Trust',
    trustDescription: 'Building lasting relationships with our customers through transparency and reliability.',
    
    // Stats
    ourJourneyInNumbers: 'Our Journey in Numbers',
    celebratingMilestones: 'Celebrating milestones that matter',
    happyCustomers: 'Happy Customers',
    premiumProducts: 'Premium Products',
    experience: 'Experience',
    satisfactionRate: 'Satisfaction Rate',
    
    // Contact Section
    getInTouch: 'Get in Touch',
    contactUs: 'Contact Us',
    contactDescription: 'We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.',
    phone: 'Phone',
    email: 'Email',
    location: 'Location',
    businessHours: 'Business Hours',
    phoneNumber: '+01515695312',
    phoneHours: '24/7',
    emailAddress: 'rozesgallery@gmail.com',
    emailResponse: 'We reply within 24 hours',
    address: 'Cairo',
    addressDetails: 'Egypt',
    hours: '24/7',
    hoursDetails: '24/7',
    sendMessage: 'Send us a Message',
    name: 'Name',
    subject: 'Subject',
    message: 'Message',
    namePlaceholder: 'Your full name',
    emailPlaceholder: 'your@email.com',
    subjectPlaceholder: 'How can we help you?',
    messagePlaceholder: 'Tell us about your inquiry...',
    sendMessageBtn: 'Send Message',
    
    // Footer
    followUs: 'Follow Us',
    stayConnected: 'Stay connected with us on social media',
    allRightsReserved: 'All rights reserved.',
    quickLinks: 'Quick Links',
    customerService: 'Customer Service',
    shipping: 'Shipping & Returns',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
  },
  AR: {
    // Header
    home: 'الرئيسية',
    products: 'المنتجات',
    about: 'عنا',
    contact: 'اتصل بنا',
    cart: 'السلة',
    
    // Hero Section
    touchOfWard: 'لمسة وارد',
    welcomeTo: 'مرحباً بكم في',
    rozesGallery: 'معرض الورود',
    heroDescription: 'اكتشفوا المجوهرات الفاخرة والورود الرائعة والإكسسوارات الأنيقة التي تجسد الرقي والأناقة.',
    exploreCollection: 'استكشف المجموعة',
    ourStory: 'قصتنا',
    
    // Featured Products
    featuredCollection: 'المجموعة المميزة',
    curatedFor: 'منتقاة من أجل',
    elegance: 'الأناقة',
    featuredDescription: 'قطع مختارة بعناية تمثل أرقى ما في الرفاهية والحرفية',
    viewAllProducts: 'عرض جميع المنتجات',
    
    // Special Offers
    specialOffers: 'عروض خاصة',
    offersDescription: 'عروض لفترة محدودة على أحب القطع لدينا',
    shopNow: 'تسوق الآن',
    
    // About Section
    aboutRozesGallery: 'عن معرض الورود',
    ourStoryTitle: 'قصتنا',
    aboutDescription: 'في معرض الورود، نؤمن بقوة الجمال في تحويل الحياة. بدأت رحلتنا برؤية بسيطة: جلب الأناقة والرفاهية للجميع من خلال مجموعات منتقاة بعناية.',
    touchOfWardTitle: 'لمسة وارد',
    touchOfWardDescription1: '"لمسة وارد" تمثل التزامنا بإضافة لمسة خاصة لكل لحظة. وارد، التي تعني الحارس أو الحامي، ترمز إلى تفانينا في حماية الجمال والأناقة في لحظات الحياة الثمينة.',
    touchOfWardDescription2: 'كل منتج في معرضنا هو أكثر من مجرد قطعة – إنه عمل فني مصمم لتعزيز تجاربكم الأثمن وخلق ذكريات دائمة.',
    ourValues: 'قيمنا',
    valuesDescription: 'المبادئ التي ترشدنا في خلق تجارب استثنائية',
    luxury: 'الرفاهية',
    luxuryDescription: 'نؤمن بتقديم أرقى المنتجات التي تجسد الأناقة والتطور.',
    excellence: 'التميز',
    excellenceDescription: 'نسعى للكمال في كل جانب من جوانب أعمالنا، من جودة المنتج إلى خدمة العملاء.',
    innovation: 'الابتكار',
    innovationDescription: 'تطوير مجموعتنا باستمرار مع أحدث الاتجاهات مع الحفاظ على الأناقة الخالدة.',
    trust: 'الثقة',
    trustDescription: 'بناء علاقات دائمة مع عملائنا من خلال الشفافية والموثوقية.',
    
    // Stats
    ourJourneyInNumbers: 'رحلتنا بالأرقام',
    celebratingMilestones: 'نحتفل بالإنجازات المهمة',
    happyCustomers: 'عميل سعيد',
    premiumProducts: 'منتج متميز',
    experience: 'سنوات خبرة',
    satisfactionRate: 'معدل الرضا',
    
    // Contact Section
    getInTouch: 'تواصل معنا',
    contactUs: 'اتصل بنا',
    contactDescription: 'نحب أن نسمع منكم. أرسلوا لنا رسالة وسنرد في أقرب وقت ممكن.',
    phone: 'الهاتف',
    email: 'البريد الإلكتروني',
    location: 'الموقع',
    businessHours: 'ساعات العمل',
    phoneNumber: '+01515695312',
    phoneHours: 'متاح 24 ساعة',
    emailAddress: 'rozesgallery@gmail.com',
    emailResponse: 'نرد خلال 24 ساعة',
    address: 'القاهرة',
    addressDetails: 'مصر',
    hours: 'متاح 24 ساعة',
    hoursDetails: 'متاح 24 ساعة',
    sendMessage: 'أرسل لنا رسالة',
    name: 'الاسم',
    subject: 'الموضوع',
    message: 'الرسالة',
    namePlaceholder: 'اسمكم الكامل',
    emailPlaceholder: 'بريدكم@الإلكتروني.com',
    subjectPlaceholder: 'كيف يمكننا مساعدتكم؟',
    messagePlaceholder: 'أخبرونا عن استفساركم...',
    sendMessageBtn: 'إرسال الرسالة',
    
    // Footer
    followUs: 'تابعونا',
    stayConnected: 'ابقوا على تواصل معنا عبر وسائل التواصل الاجتماعي',
    allRightsReserved: 'جميع الحقوق محفوظة.',
    quickLinks: 'روابط سريعة',
    customerService: 'خدمة العملاء',
    shipping: 'الشحن والإسترداد',
    privacyPolicy: 'سياسة الخصوصية',
    termsOfService: 'شروط الخدمة',
  },
} as const;
