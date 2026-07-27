# AGENTS.md

# Laundry Wangi

This repository contains a Laundry Management System.

Always follow these instructions before generating or modifying code.

---

# Tech Stack

Frontend

- React
- Vite
- JavaScript (ES Modules)
- JSX

Backend

- Node.js
- Express
- ES Modules (.mjs)

Database

- MySQL

Authentication

- JWT
- bcrypt

IDE

- WebStorm

---

# Project Structure

backend/
Frontend API server

frontend/
Current React application (MAIN FRONTEND)

frontend_vanilla/
Legacy frontend.
DO NOT modify this folder unless explicitly requested.

---

# General Rules

Always preserve the current project structure.

Do not rename folders.

Do not rename existing files unless requested.

Never introduce a different framework.

Do not migrate to TypeScript.

Use ES Modules.

Keep backend and frontend separated.

---

# Backend Rules

Use Express best practices.

Use async/await.

Never use callback-style code.

Always use try/catch.

Validate every request.

Never expose sensitive information.

Never hardcode credentials.

Read configuration from .env.

Always use prepared queries.

Never concatenate SQL strings.

Keep routes clean.

Business logic belongs outside route definitions whenever possible.

---

# Frontend Rules

Use functional React components.

Use hooks.

Avoid duplicate components.

Reuse Navbar and Footer.

Keep pages inside

src/pages

Keep reusable UI inside

src/components

Do not add unnecessary dependencies.

Prefer plain CSS.

---

# Coding Style

Use descriptive variable names.

Keep functions small.

One responsibility per function.

Avoid deeply nested if statements.

Prefer early return.

Write readable code over clever code.

---

# Error Handling

Every async function must have proper error handling.

Never ignore Promise rejections.

Return meaningful HTTP status codes.

Example

200 OK

201 Created

400 Bad Request

401 Unauthorized

403 Forbidden

404 Not Found

500 Internal Server Error

---

# Database

Never drop tables.

Never remove columns without permission.

Never modify production data.

Generate ALTER statements instead of destructive SQL.

Use transactions when updating multiple tables.

---

# Security

Sanitize input.

Validate input.

Hash passwords using bcrypt.

Never store plaintext passwords.

Use JWT middleware.

Never expose secret keys.

---

# Before Editing

Before changing code:

1. Explain what will be changed.

2. Explain why.

3. List affected files.

4. Wait for confirmation if changes are large.

---

# Refactoring

Refactoring must not change behavior.

Improve readability.

Reduce duplication.

Keep public API unchanged.

---

# New Features

When implementing a new feature:

1. Analyze current architecture.

2. Reuse existing code.

3. Keep naming consistent.

4. Avoid duplicate logic.

5. Update imports.

---

# Bug Fixes

When fixing bugs:

Explain

- root cause

- solution

- affected files

Do not introduce unrelated changes.

---

# React

Prefer

useState

useEffect

useMemo

only when necessary.

Avoid unnecessary re-renders.

Keep components focused.

---

# Express

Keep index.mjs simple.

Avoid putting all logic in one file.

As the project grows, suggest moving to folders such as:

routes/

controllers/

middlewares/

services/

models/

Only perform this restructuring if explicitly requested.

---

# AI Behaviour

When answering:

Think before editing.

Prefer improving existing code.

Avoid rewriting complete files.

Preserve formatting.

Respect existing architecture.

---

# Never Do

Do not change frontend_vanilla.

Do not delete files.

Do not replace React with another framework.

Do not change database schema without permission.

Do not install packages unless necessary.

Do not change environment variables.

---

# Preferred Workflow

Analyze

↓

Plan

↓

Explain

↓

Implement

↓

Review

↓

Optimize

---

Always prioritize maintainability, readability, and security over writing shorter code.