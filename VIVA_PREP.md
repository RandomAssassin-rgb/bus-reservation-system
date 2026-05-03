# 🎓 TransitFlow Elite: Viva Study Guide & Concept Explanations

Use this guide to master the technical aspects of your project for your oral exams and report.

---

### 1. DDL, DML, and DQL (The Basics)
*   **Explain it like this**: "My project uses **DDL** (Data Definition Language) to create the architecture (Tables for Buses, Routes, and Schedules). I used **DML** (Data Manipulation Language) to populate the network with over 1,000 real-time schedules. Every time a user searches, the app executes **DQL** (Data Query Language) with multi-table joins to find the best routes."
*   **Key Code**: `INSERT INTO` (DML), `CREATE TABLE` (DDL), `SELECT ... JOIN` (DQL).

### 2. Normalization: 1NF to 3NF (The Cleanliness)
*   **Viva Question**: "Why didn't you put all the bus info inside the schedules table?"
*   **Pro Answer**: "That would cause **Redundancy and Update Anomalies**. If a bus number changed, I'd have to edit 100 schedules. By following **3rd Normal Form (3NF)**, I separated them. Now, I change the bus info in one place (the Buses table), and all schedules update automatically."
*   **Implementation**: Three distinct tables: `buses`, `routes`, and `schedules` linked by Foreign Keys.

### 3. TCL, DCL, and Locking (The Security)
*   **Viva Question**: "How do you handle two people booking the same seat at the exact same millisecond?"
*   **Pro Answer**: "I implemented **Exclusive Row-Level Locking** using `FOR UPDATE`. When a booking starts, the database 'freezes' that specific schedule row. Any other user trying to book that same seat will be forced to wait until the first transaction is **COMMITTED** (TCL)."
*   **Key Code**: `SELECT ... FOR UPDATE` (Locking), `GRANT` (DCL permission control).

### 4. PL/SQL: Triggers, Procedures, & Functions (The Intelligence)
*   **The Difference**:
    -   **Trigger**: An "Autopilot" that runs automatically when data changes (e.g., updating the `updated_at` column).
    -   **Procedure**: A "Stored Program" used for complex tasks like the `secure_reservation` process.
    -   **Function**: A mathematical tool that calculates things, like `get_available_seats`.
*   **Why use them?**: "Keeping logic in the Database (PL/SQL) is faster and more secure than doing it in the Frontend."

### 5. Database Connectivity (The Bridge)
*   **The Workflow**: "My Next.js frontend uses a secure API key to talk to the Supabase PostgreSQL engine. We use **Row Level Security (RLS)** as a firewall to ensure users can only see their own bookings."

---

### 🏆 Top 3 Viva Tips:
1.  **Mention ACID Properties**: Mentioning that your bookings are "Atomic" (all or nothing) and "Consistent" will impress any examiner.
2.  **Explain the View**: Tell them you created a `route_performance_intel` **VIEW** to avoid writing complex JOINs every time you need analytics.
3.  **Scale**: Highlight that your `massive_seed.sql` proved the database can handle enterprise-scale loads (1,000+ active rows).

---
*Good luck with your Viva! You have built a production-grade system.*
