# Rozes Gallery - E-commerce Platform

An elegant e-commerce platform for selling flowers and gifts, built with modern web technologies.

## Features

- **Product Management**: Browse, search, and filter a wide range of floral products
- **Shopping Cart**: Add items, adjust quantities, and manage your shopping cart
- **User Authentication**: Secure user accounts and guest checkout options
- **Order Management**: Track orders and view order history
- **Admin Dashboard**: Comprehensive admin panel for:
  - Product management
  - Order processing
  - Coupon management
  - Special offers
  - Sales analytics

## Tech Stack

- **Frontend**:
  - React with TypeScript
  - Vite for build tooling
  - Tailwind CSS for styling
  - shadcn/ui for UI components
  
- **Backend/Services**:
  - Firebase Authentication
  - Firestore Database
  - Firebase Storage

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```sh
git clone https://github.com/AhmadEkramy/rozes-gallery.git
cd rozes-gallery
```

2. Install dependencies:
```sh
npm install
# or
yarn install
```

3. Start the development server:
```sh
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
rozes-gallery/
├── src/
│   ├── components/     # Reusable UI components
│   ├── contexts/       # React context providers
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility functions and configurations
│   ├── pages/         # Page components
│   └── assets/        # Static assets
├── public/            # Public static files
└── types/            # TypeScript type definitions
```

## Features in Detail

### Customer Features
- Browse products with detailed descriptions
- Add items to cart
- Apply discount coupons
- Guest checkout option
- Order tracking
- Responsive design for mobile and desktop

### Admin Features
- Product management (CRUD operations)
- Order processing and status updates
- Coupon creation and management
- Special offers management
- Sales and analytics dashboard
- Customer order history

## Security

- Firebase Authentication for user management
- Secure admin access control
- Protected API routes
- Data validation and sanitization

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details
