<div align="center">
  <img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 🧠 TeamFinder

I developed a web application that streamlines team formation for university students.  
The platform features a guided profile creation system where students select their **major**, **specialization**, and **skills**.  

I integrated **Google’s Gemini API** to analyze these profiles and generate intelligent teammate recommendations with **compatibility scores** and **reasoning**.  
The result is a **data-driven tool** that takes the guesswork out of building project teams.

---

## 🚀 Run and Deploy Your AI Studio App

This contains everything you need to run your app locally.

🔗 **View your app in AI Studio:**  
[AI Studio App Link](https://ai.studio/apps/drive/1K78bN4EnZuxljg3vuhPcdhSnRz91OJw4)

---

## 🧩 Run Locally

**Prerequisites:**  
- [Node.js](https://nodejs.org/)

### Steps:
1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Start dev server:**
   ```bash
   npm run dev
   ```

---

## Pylint Application (Python)

A small CLI application is included in `pylint_app/` that uses the `pylint` library programmatically.

### Install Python dependency
```bash
python -m pip install -r requirements-pylint-app.txt
```

### Run the app
```bash
python -m pylint_app pylint_app
```

### Optional flags
```bash
python -m pylint_app pylint_app --min-score 8.0 --json-out reports/pylint-report.json
```
