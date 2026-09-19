# 📚 Library Management System (LMS) - Frontend

A modern, responsive, and role-based web application for managing library operations, book circulation, catalog discovery, and user accounts. Built with **React 19**, **Vite**, **Bootstrap 5**, **React Router v7**, and **Chart.js**, this client connects seamlessly to a backend REST API to deliver dedicated experiences for **Admins**, **Librarians**, and **Members**.

---

## 🌟 Key Features

### 1. 🛡️ Role-Based Access Control (RBAC)
- **Role-Aware Navigation & Guards**: Secure route protection via `RoleProtectedRoute` that redirects users based on their authenticated role (`Admin`, `Librarian`, or `Member`).
- **Session & Token Management**: JWT authentication handled via Axios interceptors with automatic token injection and handling for expired sessions (`401 Unauthorized`).

---

### 2. 👑 Admin Portal
- **Analytics Dashboard**: Real-time KPI summaries, circulation statistics, category distributions, and monthly trends powered by **Chart.js** (`react-chartjs-2`).
- **Book Management**: Full CRUD operations (Add, Edit, View, Delete) for the library catalog with image upload support.
- **Category & Taxonomy Management**: Organize books into categories and genres.
- **Author & Publisher Directories**: Create, update, and manage author bios and publisher profiles.
- **User Management**: Oversee all registered users, assign or update user roles, and activate/deactivate accounts.
- **Admin Profile**: Manage administrative credentials and profile details.

---

### 3. 📖 Librarian Portal
- **Circulation Desk**:
  - **Issue Books**: Process book loans directly to members.
  - **Return Books**: Log returned books, inspect return conditions, and track return dates.
- **Borrow Requests Workflow**: Review, approve, or reject online borrow requests submitted by members.
- **Member Directory**: Inspect member records, active loans, and borrowing history.
- **Librarian Dashboard**: Daily operational overview, active loans, pending approvals, and overdue alerts.
- **Librarian Profile**: Manage librarian profile information.

---

### 4. 🎓 Member Experience
- **Catalog Browsing & Search**: Search books by title, author, category, or publisher with clean filtering.
- **Book Details**: Detailed book information, availability status, synopsis, and an instant request-to-borrow option.
- **Member Profile & Dashboard**: Track active borrowed books, loan history, and personal details.
- **Help & FAQ Center**: Built-in guidance for borrowing rules, return deadlines, and FAQs.
- **Authentication Flows**:
  - User Registration with **Email OTP Verification**.
  - Login with JWT token issuance.
  - **Forgot Password** & **Reset Password** workflows using email OTP verification.

---

## 🛠️ Tech Stack

| Category | Technologies / Libraries |
| :--- | :--- |
| **Core Framework** | [React 19](https://react.dev/), [Vite](https://vitejs.dev/) |
| **Routing** | [React Router DOM v7](https://reactrouter.com/) |
| **UI & Styling** | [Bootstrap 5](https://getbootstrap.com/), [React-Bootstrap](https://react-bootstrap.github.io/), [Bootstrap Icons](https://icons.getbootstrap.com/), [Styled Components](https://styled-components.com/) |
| **Charts & Visuals** | [Chart.js](https://www.chartjs.org/), [react-chartjs-2](https://react-chartjs-2.js.org/) |
| **HTTP & API** | [Axios](https://axios-http.com/) (with interceptors for JWT & error handling) |
| **Feedback & Alerts** | [react-hot-toast](https://react-hot-toast.com/) |
| **Code Quality** | ESLint |

---

## 📁 Project Structure

```text
frontend/
├── public/                  # Static assets
├── src/
│   ├── assets/              # Images, icons, and illustrations
│   ├── components/          # Reusable UI components
│   │   ├── auth/            # Auth-specific widgets (headers, steps)
│   │   ├── layout/          # Navbar, sidebar, and footer components
│   │   ├── ui/              # Reusable buttons, badges, modals, cards
│   │   └── Loginform.jsx    # Authentication forms
│   ├── context/             # React contexts (e.g., ToastContext)
│   ├── hook/                # Custom React hooks
│   ├── layouts/             # Role-specific layouts
│   │   ├── AdminLayout.jsx
│   │   ├── LibrarianLayout.jsx
│   │   └── MemberLayout.jsx
│   ├── page/                # Application views / pages
│   │   ├── admin/           # Admin views (Dashboard, Books, Authors, Users, etc.)
│   │   ├── Librarian/       # Librarian views (Issue, Return, Requests, Members)
│   │   └── member/          # Member views (Home, Books, Detail, Profile, Auth)
│   ├── routes/              # Route configuration and route guards
│   │   ├── AppRoutes.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── RoleProtectedRoute.jsx
│   ├── services/            # API service calls (Axios integration)
│   │   ├── api.js           # Axios instance with interceptors
│   │   ├── authService.js   # Login, register, OTP verification, password reset
│   │   ├── booksService.js  # Book catalog operations
│   │   ├── borrow.js        # Book issue & return transactions
│   │   ├── borrowRequest.js # Member borrow requests
│   │   ├── authorService.js # Author management
│   │   ├── publishersService.js # Publisher management
│   │   ├── categoryService.js   # Category management
│   │   ├── userService.js   # User management
│   │   └── memberService.js # Member profile & data
│   ├── utils/               # Helper utilities (auth token/role storage)
│   ├── validations/         # Form validation rules
│   ├── App.jsx              # Root component
│   └── main.jsx             # React entry point
├── .env                     # Local environment variables
├── .example.env             # Example environment template
├── package.json             # Dependencies and scripts
└── vite.config.js           # Vite configuration
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory (based on `.example.env`):

```env
# URL for uploaded book covers / general uploads
VITE_API_URL=http://localhost:3000/uploads/

# Base REST API endpoint
VITE_BASE_URL=http://localhost:3000/api

# URL for uploaded user avatars / profile pictures
VITE_PROFILE_URL=http://localhost:3000/uploads/profiles
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: `v18.x` or higher recommended
- **npm** or **yarn** / **pnpm**
- Running LMS Backend API (e.g. at `http://localhost:3000`)

### 2. Installation
Clone the repository and install the dependencies:

```bash
# Clone repository
git clone https://github.com/CMMakara/FrontEndLMS.git
cd FrontEndLMS

# Install dependencies
npm install
```

### 3. Running Development Server
Start the local development server with Hot Module Replacement (HMR):

```bash
npm run dev
```
The app will be accessible at: `http://localhost:5173` (or the port displayed in your terminal).

### 4. Build for Production
Create an optimized production build in the `dist/` directory:

```bash
npm run build
```

You can preview the production build locally using:

```bash
npm run preview
```

### 5. Linting
Run ESLint to check for code quality and syntax issues:

```bash
npm run lint
```

---

## 🔐 User Roles & Access Summary

| Role | Default Route | Key Responsibilities |
| :--- | :--- | :--- |
| **Admin** | `/admin` | System analytics, user roles, catalog configuration (books, categories, authors, publishers). |
| **Librarian** | `/librarian` | Daily book circulation (issue/return), reviewing borrow requests, member overviews. |
| **Member** | `/` | Book browsing, search, view details, submitting borrow requests, loan history. |

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
