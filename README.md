# 📚 BookBarter - Your Community Book Exchange App

![BookBarter Banner](https://placehold.co/600x400/1E90FF/ffffff?text=BookBarter&font=Raleway)

A mobile app that makes it easy to give away or exchange books with others around you. Built with modern technologies for a seamless experience.

---

## 🌟 Key Features

| Feature                   | Description                                         |
| ------------------------- | --------------------------------------------------- |
| 📖 **Book Listings**      | Browse and search books available in your community |
| 📸 **Multi-image Upload** | Add multiple photos of your books                   |
| 🔄 **Exchange System**    | Request books for exchange or giveaway              |
| 🔔 **Request Management** | Track pending, accepted, and rejected requests      |
| 📚 **Book History**       | View your completed exchanges and giveaways         |
| 🔒 **Secure Auth**        | Supabase-powered authentication                     |

---

## 🛠 Tech Stack

### Frontend

[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge\&logo=react\&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/-Expo-000020?style=for-the-badge\&logo=expo\&logoColor=white)](https://expo.io/)
[![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=for-the-badge\&logo=typescript\&logoColor=white)](https://www.typescriptlang.org/)
[![NativeWind](https://img.shields.io/badge/-NativeWind-06B6D4?style=for-the-badge\&logo=tailwind-css\&logoColor=white)](https://www.nativewind.dev/)

### Backend & Database

[![Supabase](https://img.shields.io/badge/-Supabase-3ECF8E?style=for-the-badge\&logo=supabase\&logoColor=white)](https://supabase.io/)
[![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-4169E1?style=for-the-badge\&logo=postgresql\&logoColor=white)](https://www.postgresql.org/)

### State Management & Utilities

[![TanStack Query](https://img.shields.io/badge/-TanStack%20Query-FF4154?style=for-the-badge\&logo=react-query\&logoColor=white)](https://tanstack.com/query/latest)

---

## 📂 Project Structure

```bash
BookBarter/
├── src/
│   ├── app/               # Screens and navigation (Expo Router)
│   ├── components/        # Shared components like BookCard, Button
│   ├── api/               # React Query hooks and Supabase API logic
│   ├── constants/         # Book conditions, tags, etc.
│   ├── contexts/          # Context Providers like Auth Context
│   ├── lib/               # Supabase client setup and helpers
│   └── global.css         # Tailwind styles via NativeWind
├── assets/                # Fonts, images, icons
├── supabase/              # Supabase SQL files and setup
├── tailwind.config.js     # Tailwind configuration
├── app.json               # Expo app configuration
├── tsconfig.json          # TypeScript configuration
└── README.md              # You are here
```

---

## 🚀 Getting Started

### Prerequisites

* Node.js (v16 or later)
* Expo CLI (`npm install -g expo-cli`)
* Supabase Project (with credentials)

### Installation

```bash
git clone https://github.com/your-username/BookBarter.git
cd BookBarter
npm install
```

### Environment Variables

Create a `.env` file:

```env
SUPABASE_URL=your-url
SUPABASE_ANON_KEY=your-anon-key
```

### Run the App

```bash
npx expo start
```

---

## 📝 To-Do / Upcoming

* Full profile pages
* Messaging between users
* Notifications system
* Location based book listings
* UI/UX improvements

---

## 📸 Screenshots
<p align="center">
  <img src="./assets/screenshots/explore.jpg" alt="Explore Books" width="23%" />
  <img src="assets/screenshots/book-details.jpg" alt="Book Details" width="23%" />
  <img src="./assets/screenshots/requests.jpg" alt="Requests" width="23%" />
  <img src="assets/screenshots/profile.jpg" alt="Profile" width="23%" />
</p>

More screenshots can be found in the `assets/screenshots` directory.
## 🤝 Contributing

Contributions are welcome!

```bash
git checkout -b feature/YourFeature
commit -m "Add YourFeature"
git push origin feature/YourFeature
```

Then open a Pull Request.

---

## 📄 License

Distributed under the MIT License.

---
