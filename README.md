# 🧠 AI Quiz Maker

An intelligent quiz generation platform built with **Next.js**, **Prisma**, **Neon (Postgres)**, and **Google Gemini API**.  
This app allows users to generate quizzes dynamically, attempt them, and track results — all powered by AI.  

---

## 🚀 Features
- 🔐 Authentication (JWT-based login & signup)  
- 📝 AI-Powered Quiz Generation using Google Gemini API  
- 📊 Database Integration with Neon (PostgreSQL + Prisma ORM)  
- 🎯 Quiz Attempt Tracking  
- 🎨 Modern UI with Next.js 15 + Tailwind CSS  
- ☁️ Deployment Ready with Vercel  

---

## 🛠️ Tech Stack
- **Frontend:** Next.js 15, React 19, Tailwind CSS  
- **Backend:** Next.js API Routes  
- **Database:** PostgreSQL (Neon)  
- **ORM:** Prisma  
- **Auth:** JSON Web Tokens (JWT) + bcrypt  
- **AI Integration:** Google Generative AI (Gemini API)  

---

## 📂 Project Structure
ai-quiz-maker/
│── prisma/ # Prisma schema & migrations
│── app/ # Next.js App Router (pages, API routes)
│── components/ # Reusable UI components
│── styles/ # Global styles
│── package.json # Project config & scripts
│── .env # Environment variables

yaml
Copy code

---

## ⚙️ Setup Instructions  

### 1️⃣ Clone the repository
```sh
git clone https://github.com/Zaheen06/ai-quiz-maker.git
cd ai-quiz-maker
2️⃣ Install dependencies
sh
Copy code
npm install
3️⃣ Configure environment variables
Create a .env file in the root folder and add:

env
Copy code
DATABASE_URL="your_neon_postgres_url"
JWT_SECRET="your_jwt_secret"
GEMINI_API_KEY="your_google_gemini_api_key"
4️⃣ Setup Prisma & Database
sh
Copy code
npx prisma generate
npx prisma db push
5️⃣ Run the development server
sh
Copy code
npm run dev
Visit 👉 http://localhost:3000

🚀 Deployment
This project is ready to deploy on Vercel.

Make sure to set the same .env variables in your Vercel dashboard.

Vercel automatically builds using:

json
Copy code
"scripts": {
  "build": "prisma generate && next build",
  "postinstall": "prisma generate"
}
📸 Screenshots (optional)
(You can add screenshots of your UI here once ready)

🤝 Contributing
Pull requests are welcome! If you’d like to contribute, fork the repo and submit a PR.

📜 License
This project is licensed under the MIT License.

✨ Made with ❤️ by Zaheen06

vbnet
Copy code
