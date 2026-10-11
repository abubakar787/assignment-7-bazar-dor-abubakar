 # 🛒 Bazar Dor — Daily Market Price Tracker

Bazar Dor is a responsive web application that helps users explore daily market prices of essential grocery items in Bangladesh. Users can browse products, compare prices, explore categories, and view market price details through a clean and user-friendly interface.

## 🌐 Project Links

- **GitHub Repository:** https://github.com/abubakar787/assignment-7-bazar-dor-abubakar
- **Live Website:** Add your deployed website URL here.

## ✨ Key Features

1. **Daily Market Prices** — Browse available market prices for essential products.
2. **Product Categories** — Explore products by categories such as rice, lentils, oil, vegetables, fish, meat, eggs, and spices.
3. **Product Details** — View product information, price summaries, and market-wise price details.
4. **Price Sorting** — Sort category products by price in ascending or descending order.
5. **Authentication** — Sign up and sign in using email and password.
6. **Social Login** — Google and GitHub authentication using Better Auth.
7. **Protected Pages** — Restrict access to product details where authentication is required.
8. **User Profile** — View and update profile information.
9. **Responsive Design** — Designed for mobile, tablet, and desktop screens.
10. **Loading and Error States** — Provide feedback while data is loading or when an operation fails.

## 🧰 Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- Better Auth
- MongoDB
- Sonner Toast Notifications
- REST API
- Git and GitHub

## 📦 Installation

### Prerequisites

- Node.js
- npm
- MongoDB connection string
- Google and GitHub OAuth credentials for social login

### 1. Clone the repository

```bash
git clone https://github.com/abubakar787/assignment-7-bazar-dor-abubakar.git
```

### 2. Navigate to the project directory

```bash
cd assignment-7-bazar-dor-abubakar
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the project root and configure the environment variables required by the application.

Use the variable names from your existing `.env` configuration and `.env.example`, if available. These may include:

- `DATABASE_URL`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `NEXT_PUBLIC_APP_URL`
- `BETTER_AUTH_GOOGLE_CLIENT_ID`
- `BETTER_AUTH_GOOGLE_SECRET`
- `BETTER_AUTH_GITHUB_CLIENT_ID`
- `BETTER_AUTH_GITHUB_SECRET`

Use your own credentials. **Never commit `.env` or expose database passwords, OAuth secrets, or authentication secrets publicly.**

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```text
src/
├── app/
│   ├── api/
│   ├── category/
│   ├── product/
│   ├── profile/
│   ├── signin/
│   ├── signup/
│   ├── layout.tsx
│   └── page.tsx
└── lib/
    ├── api.ts
    ├── auth.ts
    └── auth-client.ts
```

## 🔐 Authentication

Bazar Dor uses Better Auth for email/password authentication and Google/GitHub social sign-in. MongoDB stores authentication-related data. Protected pages require a valid user session.

## 🚀 Deployment

The application can be deployed on Vercel or another compatible Next.js hosting platform.

1. Import the GitHub repository into Vercel.
2. Configure the required environment variables.
3. Verify the production application URL and OAuth callback settings.
4. Deploy the application.
5. Test registration, sign-in, social login, product pages, and responsive layouts.

## 👨‍💻 Author

**Abu Bakar**

GitHub: https://github.com/abubakar787

## 📄 License

This project was developed for educational and assignment purposes.
