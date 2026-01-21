🎲 Project Hilo

    A web-based Hi-Lo dice statistics application built as an internship project.
The system allows users to roll three dice, record history, and analyze statistical frequencies such as individual faces, pairs, triples, and sums.

📌 Project Overview

Project Name: Project Hilo
Type: Frontend Web Application
Purpose: Practice React, state management, and UI design for internship-level experience

Project Hilo simulates a traditional Hi-Lo dice game and visualizes historical outcomes in a clean, modern UI.

🚀 Features

🎲 Roll 3 dice randomly

✍️ Manual dice input (Entry)

📊 Dice statistics analysis

Individual face frequency (1–6)

Pair combinations

Triple combinations

Sum of dice values

🧮 Percentage calculation per outcome

🗂 Display recent roll history

♻️ Reset all history

🎨 Responsive UI with Tailwind CSS


🛠 Tech Stack

React  19.2.0 (Functional Components & Hooks)

Vite 7.2.4 (Build tool & dev server)

Tailwind CSS 3.4.19 (Utility-first CSS framework)

JavaScript (ES6+)

Git & GitHub (Version control)

📦 Installation
1. Clone repository
bashgit clone https://github.com/yourusername/project-hilo.git
cd project-hilo
2. Install dependencies
bashnpm install
3. Run development server
bashnpm run dev

📁 Project Structure
project-hilo/
├── src/
│   ├── components/
│   │   ├── HiLoStatistics.jsx    # Main component
│   │   ├── DiceInput.jsx          # Input section
│   │   ├── LastRollDisplay.jsx   # Display last roll
│   │   ├── FilterButton.jsx      # Filter buttons
│   │   ├── StatsTable.jsx        # Statistics table
│   │   ├── HistoryStrip.jsx      # History list
│   │   ├── ResetConfirmModal.jsx # Reset confirmation
│   │   ├── SuccessToast.jsx      # Success notification
│   │   ├── Tooltip.jsx           # Tooltip component
│   │   └── DiceFace.jsx          # Dice face display
│   ├── App.jsx                    # App root
│   ├── App.css                    # Global styles
│   └── main.jsx                   # Entry point
├── public/                        # Static assets
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md