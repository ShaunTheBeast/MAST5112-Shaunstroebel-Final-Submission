# MAST5112-Shaunstroebel-Final-Submission
The Brass Bell POS &amp; Menu Manager — A React Native hospitality point-of-sale and menu management system tailored for The Brass Bell in Kalk Bay, Cape Town. Features full CRUD dish management, multi-field search, course filtering, real-time analytics, and an integrated 15% VAT order checkout terminal.
The Brass Bell — Chef's Menu Manager & POS System

Module: MAST5112 — Mobile App & Web Development

Student Name: Shaun Stroebel

Student ID: ST10507489

Institution: The Independent Institute of Education (IIE)

Scenario: The Brass Bell Restaurant (Kalk Bay, Cape Town)

📌 Project Overview

The Brass Bell POS & Menu Manager is a cross-platform React Native mobile application built for high-volume restaurant operations in Kalk Bay, Cape Town. Developed for the MAST5112 Portfolio of Evidence (PoE), the system allows head chefs and floor managers to manage menu items in real time while providing waitstaff with an active Point-of-Sale (POS) order terminal.

The project demonstrates production-grade state management, input validation, memoized filtering pipelines, financial calculations (15% South African VAT), and responsive dark-themed visual architecture.

✨ Key Features & Functionality

1. Menu Management (CRUD)

Create: Add new dishes via an interactive modal form with validation.

Read: View detailed menu items categorized by course with custom price formatting (ZAR R).

Update: Modify dish titles, descriptions, pricing, preparation times, and assigned courses.

Delete: Remove dishes from the active menu with visual confirmation dialogs.

2. Real-Time Search & Filtering

Multi-Field Search: Instant case-insensitive keyword search matching across dish titles (item.name) and ingredient descriptions (item.description).

Course Category Filtering: Horizontal filter pills (All, Starter, Main Course, Dessert) to isolate menu sections.

3. Hospitality POS & Order Terminal

Active Table Orders: Assign orders to designated dining areas (Table 1, Table 2, Table 3, Patio 4).

Dynamic Quantity Adjusters: Increase/decrease dish quantities directly on active tickets.

Financial Calculations: Dynamic breakdown of Subtotal, 15% South African Value-Added Tax (VAT), and Grand Total.

Kitchen Ticket Generation: Modal checkout confirmation simulating live kitchen order transmission.

4. Live Analytics & Sales Dashboard

Menu Metrics Engine: Memoized computation of total active menu dishes and overall average ZAR price.

Course Distribution: Visual progress bars displaying item distribution across Starter, Main, and Dessert categories.

🛠️ Technology Stack & Dependencies

Framework: React Native (0.76.5 / 0.79.2)

Core Library: React 18.3.1

Performance: React Hooks (useState, useMemo, useCallback)

CLI & Tooling: @react-native-community/cli

Language: JavaScript (ES6+) / TypeScript definitions

🚀 Local Execution & Setup Guide

Prerequisites

Node.js (v18.0.0 or higher)

npm or yarn

Android Studio (for emulator execution) or a physical mobile device with USB/Wireless Debugging enabled.

Installation Steps

Clone the Repository:

git clone https://github.com/your-username/ST10507489-MAST5112-PoE.git
cd ST10507489-MAST5112-PoE


Install Node Dependencies:

npm install


Start the Metro Bundler:

npm start


(Or run npx react-native start --reset-cache if clearing cache is required).

Deploy to Android Device / Emulator:
In a separate terminal window, run:

npx react-native run-android


📂 Project Structure

├── App.js                 # Main application logic, state management, POS cart, and UI views
├── app.json               # Application configuration manifest & bundle identifiers
├── package.json           # Dependencies, scripts, and devDependencies
├── babel.config.js        # Babel compiler configuration
├── index.js               # Application entry point (AppRegistry)
├── metro.config.js        # Metro bundler configuration
└── README.md              # Project documentation


📹 Video Demonstration Link

A comprehensive 5–8 minute unlisted YouTube video demonstrating full CRUD functionality, search/filtering workflows, POS order processing, and analytics is available below:

🔗 Watch YouTube Demonstration Video

📜 Academic References

Facebook Open Source, 2024. React Native Documentation: Component Lifecycle and State Management. Available at: https://reactnative.dev/docs/getting-started

Freeman, A., 2023. Pro React 18: Developing Enterprise Mobile and Web Applications. 4th ed. New York: Apress.

The Independent Institute of Education (IIE), 2026. MAST5112 Module Manual & Portfolio of Evidence Guide. Johannesburg: IIE.

South African Revenue Service (SARS), 2024. Value-Added Tax Act No. 89 of 1991: Standard Rate VAT (15%) Provisions. Pretoria: SARS.
