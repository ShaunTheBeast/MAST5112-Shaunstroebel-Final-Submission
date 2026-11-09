# The Brass Bell - Chef's Menu Manager & POS System
**Student Name:** Shaun Stroebel  
**Student Number:** ST10507489  
**Module:** MAST5112 (Mobile App and Web Development)  
**Project Scenario:** The Brass Bell Restaurant, Kalk Bay, Cape Town  

---

## 📌 Project Overview
This project represents the final Portfolio of Evidence (PoE) submission for **MAST5112**. Building upon the foundational application created in Part 2, this version has been significantly enhanced into a robust, professional hospitality point-of-sale (POS) and menu management system tailored for **The Brass Bell** in Kalk Bay. 

The application streamlines kitchen operations by allowing chefs and front-of-house staff to manage dishes, filter courses, calculate real-time totals with VAT, process orders, and inspect comprehensive menu analytics.

---

## 🛠️ Change Log & Refactoring (Part 2 to Final PoE)

The following enhancements and architectural refactoring were implemented to meet all assessment criteria:

### 1. Manage Menu Items (25 Marks)
* **Full CRUD Functionality:** Added robust capabilities allowing users to create, view, update, and delete menu items seamlessly.
* **Real-Time UI Updates:** State management ensures any modifications (edits or deletions) reflect immediately across the active menu and order terminal without requiring app reloads.
* **Enhanced Form Validation:** Implemented strict inline validation checks preventing empty fields, zero/negative pricing, or invalid formatting, accompanied by clear error banners.

### 2. Search and Filter Menu Items (20 Marks)
* **Dynamic Search:** Added an instant keyword search bar matching user queries against dish titles and descriptions.
* **Course Filtering:** Interactive course pills (*All, Starter, Main Course, Dessert*) allow chefs to instantly narrow down the menu view.
* **Clear State Handling:** Filters can be toggled or cleared effortlessly to return to the full menu overview.

### 3. Display Menu Statistics (20 Marks)
* **Overview Metrics:** Designed a dedicated Analytics tab showing the total number of menu items and the average price across all dishes in South African Rand (ZAR R).
* **Course Breakdown Visualizer:** Displays the exact count of items available in each course category accompanied by dynamic visual progress bars.

### 4. Application Enhancements & Code Architecture (20 Marks)
* **Professional Layout & Styling:** Upgraded the visual hierarchy with a modern, high-contrast dark theme reflecting a sleek restaurant operating system.
* **Modular Code Structure:** Utilized optimized React hooks (`useMemo`, `useState`) to separate business logic, UI components, and state calculations cleanly, eliminating code redundancy.
* **Enhanced POS Workflow:** Extended the app beyond a basic list into an active table order terminal supporting item quantities, table assignments, and 15% VAT calculation.

### 5. User Experience (10 Marks)
* **Intuitive Navigation:** Clean tab-based navigation connecting the Menu, POS Terminal, and Analytics modules.
* **Feedback Systems:** Integrated confirmation alerts and success dialogs to provide clear user feedback during order checkouts and item deletions.

---

## 🚀 YouTube Video Demonstration Link
* **Video Link:** (dont forget to link shaunie boy)
* *Note: The video demonstration covers adding, editing, and deleting menu items, searching, course filtering, viewing menu statistics, and the overall functionality of the completed POS application in accordance with PoE guidelines.*

---

## 📱 How to Run the Application

1. Ensure your environment has Node.js and React Native CLI configured.
2. Clone or extract the project repository.
3. Install dependencies:
   ```bash
   npm install