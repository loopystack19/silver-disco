# The Portfolio Builder Network: Project Sprint Module

This document outlines the UI and core functionality for the "Project Sprint Module," a key part of the Portfolio Builder Network web app designed to simulate real-world job experience for students and graduates using publicly available data and academic verification.

---

## 1. UI Philosophy: The Professional Workspace

The application's design prioritizes a **Minimalist, High-Contrast "Office Suite"** aesthetic, emphasizing clarity and professionalism.

* **Aesthetic:** Clean, structured, and focused.
* **Color Palette:** Near-white/light gray backgrounds with a deep, professional **Accent Blue/Teal** for primary actions. Semantic colors (Green, Yellow, Red) are used for status and difficulty tags.
* **Typography:** Clear **sans-serif font** with generous white space to enhance readability.
* **Interaction Goal:** Guide users through a structured, professional workflow and prevent premature or incomplete submissions.

---

## 2. Project Dashboard (`/projects`)

This is the main view for browsing and selecting a project.

### Layout & Functionality

* **Filter Bar:** Located at the top, allowing quick filtering of available Sprints.
    * **Filters:** Interactive dropdowns for **Role** (e.g., Data Analyst, UX Designer), **Data Source** (Kaggle, GitHub, Public API), and **Difficulty** (Beginner, Intermediate, Advanced). All filtering is immediate and additive (AND logic).
* **Project Card (Component):** Displays essential project information at a glance in a responsive grid.
    * **Content:** Project Title (bold), Role Tag (colored pill), Difficulty Tag (semantic color), Key Skill Tags (e.g., Python, Figma), and Estimated Duration (e.g., "30 hours").
    * **Action:** A primary "Start Sprint" button links directly to the Project Detail page.

---

## 3. Project Sprint Guide (`/projects/:id`)

This page is the simulation environment, divided into two fixed columns.

### A. Left Sidebar: Status Tracker (Fixed)

This column provides continuous project context and student tracking.

* **Progress:** A **circular progress indicator** showing the completion status (Not Started, In Progress, Submitted).
* **Key Details:** Non-editable display of Role, Estimated Time, and the direct **external link** to the real data/open-source issue.
* **Deliverables Checklist:** A simple, user-toggleable list of required deliverables. **Crucially, these checkboxes are for personal tracking only and do not gate submission.**

### B. Main Content Area: The Structured Brief (Scrollable)

This section provides the simulation and core instructions, ensuring the student focuses on professional output.

| Section Title (Collapsible) | Content & Functionality | Simulation Goal |
| :--- | :--- | :--- |
| **The Client & Goal** | Fictional company background, project objective, and expected business value. | Provides real-world context and justification for the work. |
| **Source Data & Tools** | Direct **clickable links** to the *real* external data and the **required software stack** (e.g., Tableau, React, etc.). | Connects academic skills to industry-standard tools and real data sets. |
| **Detailed Deliverables** | Strict specifications for output (e.g., "Must be $\le 5$ pages," "Include fully commented code"). | Enforces professional quality and adherence to strict project requirements. |
| **Simulated Stakeholder Review** | Content is initially hidden. A button labeled **"Simulate 1st Draft Review"** must be clicked to reveal pre-written, complex **stakeholder feedback** (revisions). | **Integrity/Exposure Gate:** Forces students to handle mandatory iteration and feedback, a core part of real-world jobs. |

---

## 4. Submission & Verification Module

This is the final step, designed to enforce CV best practices and enable academic verification.

### A. Submission Form

* **Public Link Input (Required):** Input for the final public deliverable (GitHub, Figma, Tableau Public, etc.). **Must enforce URL validation.**
* **Impact Statement Generator (Required):** A text area that forces the user to write their CV bullet point before submitting.
    * **Prompt:** "**Draft Your Impact-Based CV Statement** (Max 200 Chars)."
    * **Guidance:** A tooltip/modal explains the required **Action-Result-Impact** format.

### B. Verification & Integrity Gates

The system generates a **Verification Package** (Student info, Project Brief, Deliverable Link, Impact Statement) sent to a verifying lecturer.

* **Final Submission Button:** "**Complete & Submit Sprint**."
    * **Conditional Logic (Integrity Check):** The button is **DISABLED** until:
        1.  Primary Deliverable Link is a valid URL.
        2.  The Impact Statement is drafted.
        3.  The **Stakeholder Review section has been revealed** (proving the student engaged in the revision process).

### C. Lecturer Portal Functionality (Backend)

* **Review Page:** Lecturers receive a link to a page showing the student's submission and the original brief.
* **Mandatory Integrity Checkboxes:** The lecturer must check boxes confirming:
    * "I have verified the submission is functional and matches the original brief."
    * "The work demonstrates the expected level of skill."
    * "The work is the student's original effort."
* **Approval & Output:** Upon approval, the system generates a **Verifiable Digital Badge/Certificate** containing the **Approved Impact Statement** and the lecturer's name, linked back to the Project Brief for employer verification.