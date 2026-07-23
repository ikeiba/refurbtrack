---
name: save-note
description: "Use when you want to store an explanation in Obsidian"
---

# Save Technical Note to Obsidian (RefurbTrack)

When the user invokes this skill, your objective is to extract the latest detailed technical explanation regarding the project's architecture or implementation and log it into their Obsidian vault.

## 1. Structure and Target Files
* **Central File (Index / MOC):** `/mnt/c/Users/iker/Documents/uni/personal_learning/RefurbTrack/RefurbTrack_Architecture.md`
* **Notes Directory:** Must be located in the project's specific folder within the vault (`RefurbTrack_docs/`).

## 2. Execution Rules:

### Step A: Determine Note Type & Naming
Analyze the explanation and classify it into one of two categories:
1. **Concept Note (Theory):** General framework knowledge (e.g., `Django_Serializers.md`, `Nextjs_ServerComponents.md`).
2. **Component Note (Implementation):** Specific project code or architecture (e.g., `AlertSerializer.md`, `AuthMiddleware.md`).
*Use descriptive names without spaces.*

### Step B: Create or Update the Detail Note
1. **If the file already exists:** Append the new content at the end of the file, indicating the update date with a horizontal divider (`---`).
2. **Internal Note Format:**
   * **Frontmatter (YAML):** Include hierarchical tags (e.g., `tags: [refurbtrack, backend, serializers]`) and the creation/modification date.
   * **Cross-Linking:** If writing a Component Note, you MUST include a wiki-link to its parent Concept Note under a "Related Concepts" section (e.g., `[[Django_Serializers]]`).
   * **Backlink Section:** Every note MUST include a return link to the main index at the very bottom: `[[RefurbTrack_Architecture|← Back to Main Index]]`.
   * **Clear Structure:** Use clean Markdown syntax, language-tagged code blocks (`python`, `typescript`, etc.), and LaTeX equations ONLY if mathematical formulas are involved.

### Step C: Update the Central File (MOC)
1. Review the central file `RefurbTrack_Architecture.md`.
2. Identify the correct category based on the core architectural blocks of the project:
   * `### ⚙️ Backend (Django & API)`
   * `### ⚛️ Frontend (Next.js & UI)`
   * `### 🕷️ Scraper & Data Pipeline`
   * `### ☁️ Infrastructure & DevOps (Docker, Celery, Postgres)`
   * `### 🧠 Core Architecture & Theory` (Use this specifically for Concept Notes)
3. Insert the Wiki Link (`[[File_Name]]`) under the correct subsection. 
   * *Deduplication Rule:* If the link already exists under that subsection, do not duplicate it.

## 3. Expected Final Output Example (Component Note):

---
tags:
  - refurbtrack
  - backend
  - serializers
date: {{CURRENT_DATE}}
---

# Explanation: AlertSerializer

## 📌 Context and Purpose
[Brief description of what this component solves in the project]

## 🧠 Related Concepts
* Framework Theory: [[Django_Serializers]]

## 🛠️ Implementation Details
[Detailed technical explanation + Code snippets if applicable]

---
🔗 **Navigation:** [[RefurbTrack_Architecture|← Back to Main Index]]