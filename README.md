<div align="center">

# 🚀 Mini GitHub

## A Modern, Full-Stack GitHub Clone

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](./LICENSE)

</div>

---

## ✨ Features

### 🔐 **Authentication & Security**

- Secure user registration and login
- JWT-based authentication
- Password encryption with bcrypt
- Protected routes and API endpoints

### 📦 **Repository Management**

- Create public/private repositories
- Upload and manage files
- Delete repositories with confirmation
- Repository search and filtering
- Star and unstar repositories
- Pin favorite repositories to profile

### 👥 **Social Features**

- User profiles with customizable information
- Follow/unfollow users
- Real-time notifications
- Activity tracking
- Starred repositories tab

### 🎨 **Modern UI/UX**

- GitHub-inspired design system
- Light and dark mode support
- Fully responsive layout
- Smooth animations and transitions
- Intuitive navigation
- Empty states and loading indicators

### 📊 **Additional Features**

- Commit history with date grouping
- Issues tracking system
- Pull requests interface
- File browser with syntax highlighting
- Markdown rendering
- Search functionality

---

## 🛠️ Tech Stack

<table>
<tr>
<td valign="top" width="50%">

### Frontend

- **Framework:** React 19
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **State Management:** React Context
- **Routing:** Hash-based routing

</td>
<td valign="top" width="50%">

### Backend

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas
- **ODM:** Mongoose
- **Authentication:** JWT
- **Security:** bcryptjs

</td>
</tr>
</table>

---

## 🚀 Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account

### Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/pratham-prog861/mini-github.git
   cd mini-github
   ```

2. **Install dependencies**

   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Configure environment variables**

   Create `server/.env`:

   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secure_secret_key
   NODE_ENV=development
   ```

   Create `client/.env.local`:

   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the application**

   ```bash
   # Terminal 1 - Start backend
   cd server
   npm run dev

   # Terminal 2 - Start frontend
   cd client
   npm run dev
   ```

5. **Open your browser**

   Navigate to `http://localhost:3000`

---

## 📁 Project Structure

```bash
mini-github/
├── client/                      # Frontend application
│   ├── components/             # Reusable UI components
│   │   ├── DeleteRepoModal.tsx
│   │   ├── FileBrowser.tsx
│   │   ├── Header.tsx
│   │   └── ...
│   ├── context/                # Global state management
│   │   └── AppContext.tsx
│   ├── pages/                  # Page components
│   │   ├── DashboardPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── RepoPage.tsx
│   │   └── ...
│   ├── services/               # API service layer
│   │   └── api.ts
│   └── types.ts                # TypeScript definitions
│
├── server/                      # Backend application
│   └── src/
│       ├── config/             # Configuration files
│       │   └── database.js
│       ├── middleware/         # Express middleware
│       │   └── auth.js
│       ├── models/             # Mongoose models
│       │   ├── User.js
│       │   ├── Repository.js
│       │   └── File.js
│       ├── routes/             # API routes
│       │   ├── auth.js
│       │   ├── repositories.js
│       │   └── users.js
│       └── index.js            # Server entry point
│
├── LICENSE                      # MIT License
└── README.md                    # This file
```

---

## 🎯 Roadmap

### Completed ✅

- [x] User authentication and authorization
- [x] Repository CRUD operations
- [x] File upload and management
- [x] Star/unstar repositories
- [x] Pin repositories to profile
- [x] Delete repositories with confirmation
- [x] Light/dark mode support
- [x] Notifications system
- [x] Commit history
- [x] Issues tracking
- [x] Pull requests interface

### In Progress 🚧

- [ ] README rendering
- [ ] Code syntax highlighting
- [ ] File editing in browser

### Planned 📋

- [ ] Repository forking
- [ ] Advanced search
- [ ] User activity feed
- [ ] Repository insights
- [ ] Webhooks
- [ ] CI/CD integration

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 👨‍💻 Author

**Pratham Darji**

- GitHub: [@Pratham-Prog861](https://github.com/Pratham-Prog861)

---

## 🙏 Acknowledgments

- Inspired by [GitHub](https://github.com)
- Built with modern web technologies
- Special thanks to the open-source community

---

<div align="center">

**[⬆ Back to Top](#-mini-github)**

Made with ❤️ by Pratham Darji

</div>
