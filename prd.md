# AI Work Intelligence OS — Product Build Prompt

> Give this document in full to your AI builder tool. It covers the complete product — what it is, how it behaves, every screen, every interaction, and every AI capability. Do not skip any section.

---

## SECTION 1: WHAT YOU ARE BUILDING

Build a web application called **AI Work Intelligence OS**.

This is a personal AI-powered work operating system. It is the single place a knowledge worker starts and ends their day.

The core promise of this product is simple:

> The user talks naturally. The AI listens, understands, and automatically organizes everything into a structured workspace — tasks, notes, decisions, reflections, and career memory.

The user never manually creates a task. Never opens a separate notes app. Never writes a journal entry from scratch. Never struggles to remember what they decided six weeks ago or why.

They simply talk. The system does the rest.

This product is not a task manager. It is not a notes app. It is not a journal. It is a **personal work intelligence layer** — a thinking partner, a planning assistant, a decision historian, a reflection engine, and a career growth tracker — all in one place.

---

## SECTION 2: THE USER

The primary users are knowledge workers who deal with high volumes of unstructured thinking every day.

Examples:
- Product Managers who juggle decisions, PRDs, stakeholder conversations, and roadmaps
- Founders managing strategy, team, product, and growth simultaneously
- Designers tracking feedback, design rationale, and iteration context
- Developers navigating technical decisions, architecture notes, and sprint work
- Consultants managing client context, deliverables, and strategic insights
- Researchers handling ideas, hypotheses, reading notes, and findings

What all of these users share:
- Their thoughts are fast and unstructured
- Their work is spread across too many tools
- They rarely reflect on what they've done
- They forget key decisions and why they were made
- They struggle to demonstrate their impact at review time

This product solves all of these problems from one place.

---

## SECTION 3: THE CORE EXPERIENCE PRINCIPLE

Everything in this product flows from one principle:

**One input → Many structured outputs.**

The user types or speaks one natural message. The AI reads it and automatically produces multiple organized outputs — whichever are relevant — across tasks, notes, decisions, reflections, and the timeline.

Example: User types:

> "Need to finish the duplicate management PRD by Friday, discuss merge edge cases with engineering tomorrow, and we decided not to support cross-entity comparison for now because it adds too much onboarding complexity."

From that single message, the AI automatically creates:

- **Task 1:** Finish Duplicate Management PRD — due Friday, high priority
- **Task 2:** Discuss merge edge cases with Engineering — due tomorrow
- **Decision:** Not supporting cross-entity comparison — with reasoning captured
- **Timeline Events:** Both tasks and the decision are logged to the work history

The user sees all of this appear in the right panel as the AI responds. They did not open a task creation modal. They did not fill any form. They just talked.

This principle must be honored throughout every design and interaction decision.

---

## SECTION 4: HOW THE AI THINKS

The AI must behave as an intelligent extraction engine, not a chatbot.

When a user submits a message, the AI does the following internally:

### Step 1 — Understand intent
Before classifying anything, the AI asks itself: What is the user actually trying to do? Are they offloading work they need to do? Are they recording something that happened? Are they reflecting? Are they making a decision?

### Step 2 — Classify each piece of the message
A single message may contain multiple types of content. The AI identifies each.

| Classification | When to use it |
|---|---|
| **Task** | User mentions something they need to do, finish, follow up on, or revisit |
| **Note** | User shares information, context, or explanation that should be saved |
| **Decision** | User explains a choice that was made and/or why it was made |
| **Reflection** | User expresses what they learned, observed, or felt about work |
| **Idea** | User surfaces a future possibility or hypothesis |
| **Blocker** | User mentions something stopping progress |
| **Reminder** | User mentions needing to be reminded about something later |
| **Meeting** | User references a discussion or conversation |
| **Insight** | User shares a strategic or professional learning |

### Step 3 — Extract structured fields
For each classified piece of content, the AI extracts relevant fields automatically.

For Tasks: title, due date (from natural language like "Friday" or "next week"), priority (from urgency signals), related project.

For Decisions: what was decided, why, what alternatives existed, what was traded off, what risks are involved.

For Reflections: what went well, what was hard, what was learned, what should change.

### Step 4 — Assign a confidence level
If the AI is very sure about an extraction, it marks it as **high confidence** and creates it automatically. If it is less certain, it marks it as **medium** and flags it for the user to confirm. If it is unsure, it asks a clarifying question before creating anything.

### Step 5 — Connect to existing context
Before creating a new task or note, the AI checks existing entries. If a related task already exists, it links rather than duplicates. If a decision relates to a prior note, it references it.

### Step 6 — Respond conversationally AND generate structured output simultaneously
The AI replies to the user in a warm, intelligent, conversational tone — like a thoughtful colleague — while also generating the structured objects that appear in the right panel. The conversation and the workspace updates happen together.

---

## SECTION 5: THE APPLICATION LAYOUT

The application has three zones:

---

### Zone 1 — Left Sidebar (Navigation)

A fixed vertical sidebar on the left side. Minimal. Icons with labels.

Navigation items, in this order:
1. **Today** — the home / dashboard view
2. **Inbox** — unprocessed or unconfirmed AI extractions
3. **Tasks** — all tasks, Kanban and list views
4. **Notes** — all AI-generated and manual notes
5. **Decisions** — the decision repository
6. **Reflections** — weekly and monthly reflections
7. **Timeline** — chronological work history
8. **Portfolio** — career highlights and achievements
9. **Search** — semantic search across everything

At the very bottom of the sidebar:
- User avatar / name
- Settings

The active page item should be clearly highlighted. Sidebar should be collapsible on smaller screens.

---

### Zone 2 — Center (Main Workspace)

This is the most important zone. It occupies the majority of the screen.

On the **Today / Home page**, this is the AI conversation workspace. The user types here. The AI responds here. This is the beating heart of the product.

On other pages (Tasks, Notes, Decisions, etc.), this zone becomes the content view for that section.

---

### Zone 3 — Right Panel (AI Output Panel)

A contextual panel on the right side that appears when the AI has generated output.

This panel shows:
- Tasks just created (as task cards)
- Notes just created (as note cards)
- Decisions just captured (as decision cards)
- Connections to existing content
- AI confidence indicators

On non-conversation pages, this panel may show related context, suggestions, or a summary of the current view.

---

## SECTION 6: THE TODAY PAGE (HOME)

This is the default landing page when the user opens the app.

### Top section
A warm greeting with the current date and day.

Examples:
- "Good morning. Here's where things stand."
- "Tuesday, 15 January. You have 4 things in motion."

Below the greeting, a single-line AI context summary. This is generated from the user's actual data. Examples:
- "3 tasks are due this week. 1 decision from last Thursday remains open. You haven't reflected in 8 days."
- "Good start today — 2 tasks completed. 1 blocker is waiting on Engineering."

This summary must be dynamic and based on real stored data, not placeholder text.

---

### Center — The Conversation Workspace

This is the AI conversation area. Large, calm, generous.

At the very first open (empty state), the AI speaks first:
> "What's on your mind today? Tell me about your work — tasks, thoughts, decisions, anything."

The input bar is at the bottom of the conversation area. It is a large, inviting multi-line text input. It supports hitting Enter to send (with Shift+Enter for new lines). There is also a Send button.

As the conversation grows, messages appear chronologically like a chat. User messages are right-aligned. AI messages are left-aligned with a subtle AI indicator.

The AI's messages serve two purposes simultaneously:
1. A natural language conversational reply that acknowledges what the user said
2. A structured extraction summary that tells the user what was captured

Example AI message structure:
> "Got it. I've pulled out a few things from that.
> 
> I created a task to finish the PRD — I'll flag it as high priority with a Friday deadline. The edge case discussion with Engineering is set for tomorrow. And I've logged the decision not to support cross-entity comparison, with your reasoning captured.
> 
> One thing I wasn't sure about — when you said 'revisit pricing later,' did you mean you want a reminder, or is there a specific task you have in mind?"

Notice: warm, clear, helpful. Never robotic. Never just a list of confirmations.

---

### Bottom section of Today page
Below the conversation area (or accessible by scrolling), show:

- **Today's Task List:** All tasks due today or flagged as today's focus
- **What's Pending:** Tasks that are overdue or blocked
- **Recent Decisions:** Last 2–3 decisions logged
- **AI Suggestion Strip:** 2–3 short smart suggestions based on context. Examples:
  - "You haven't reflected this week. Want to do a quick end-of-day check-in?"
  - "The PRD review task has been 'In Progress' for 4 days. Is it still on track?"
  - "You mentioned pricing 3 times this week. Should we create a dedicated note?"

---

## SECTION 7: THE TASKS PAGE

### Layout
Two views available via toggle: **Kanban** and **List**.

Default to Kanban.

---

### Kanban View
Six columns:

| Column | Color Indicator |
|---|---|
| Not Started | Neutral / grey |
| Planned | Soft blue |
| In Progress | Amber |
| Waiting | Purple |
| Blocked | Red |
| Completed | Green |

Each column is scrollable. Tasks appear as cards.

---

### Task Card Design
Each card shows:
- Task title (prominent)
- Due date (if exists) — shown with a small calendar icon; overdue dates are shown in red
- Priority badge — High / Medium / Low with color coding
- Project tag (if assigned)
- Tags (up to 2–3 visible, rest truncated)
- Small indicator if the task has linked notes or decisions
- AI confidence indicator (subtle — a small dot or label)

Clicking a task card opens a detailed side drawer or modal with:
- Full title and description
- All fields (due date, priority, status, project, tags)
- All linked notes
- All linked decisions
- The original conversation snippet that created this task
- Ability to edit any field manually
- Status change dropdown
- Delete option

---

### List View
A clean table layout with columns:
- Title
- Status
- Priority
- Due Date
- Project
- Tags
- Created

Rows are sortable by any column. Clicking a row opens the same detailed drawer.

---

### Filters and Search
At the top of the Tasks page:
- Filter by: Status, Priority, Project, Tag, Due Date range
- Sort by: Due Date, Priority, Created Date
- Search bar: searches task titles and descriptions

---

### Manual Task Creation
A "+ Add Task" button in the top right. Clicking it opens a simple modal with a text input. The user types naturally (e.g., "Review QA findings by end of week"). The AI extracts the title, due date, and priority automatically and fills in the form fields. The user can adjust before saving.

This reinforces the core principle — even manual creation is AI-assisted.

---

## SECTION 8: THE NOTES PAGE

Notes are automatically generated. They are not the user's primary job to write.

### Layout
A grid of note cards by default. Option to switch to a list view.

Notes are grouped by **Category / Topic** (auto-assigned by AI). Examples:
- Strategy
- Engineering
- Product Decisions
- Learnings
- Customer
- Architecture
- Team

---

### Note Card Design
Each card shows:
- Title (bold)
- First 2–3 lines of content (truncated)
- Category label
- Tags
- Date created
- Related task count (if linked)

Clicking a card opens the full note in a reading/editing view. The full note is shown in clean readable formatting. The user can edit, add to, or delete the note.

---

### Search
The search bar at the top is semantic. The user can search by meaning, not just keywords.

Example: Searching "pricing thinking" should surface notes about pricing strategy, pricing decisions, revenue model — even if those exact words weren't used.

This requires sending the search query to Claude and having it match against note content semantically.

---

### Manual Note Creation
A "+ Add Note" button. User types freely. AI formats and categorizes it automatically.

---

## SECTION 9: THE DECISIONS PAGE

This is one of the most distinctive and valuable parts of the product.

### Purpose
Most people forget why they made decisions. This page is a permanent, searchable log of every decision ever made — with full reasoning preserved.

### Layout
Card-based repository. Cards are ordered by date, newest first.

Filter by: Project, Date Range, Tag.

Search: semantic search over decision content.

---

### Decision Card Design
Each decision card shows:
- Decision title (bold, clear)
- "Why" — the reasoning (2–3 lines, truncated)
- Tradeoffs (brief)
- Related project or task
- Date

A colored left border on the card indicates the associated project or category.

Clicking a card opens the full decision detail view with all fields:
- **Decision:** What was decided
- **Why:** The core reasoning
- **Alternatives Considered:** What else was on the table
- **Tradeoffs:** What was gained, what was given up
- **Risks:** What could go wrong
- **Linked Tasks:** Any tasks related to this decision
- **Linked Notes:** Any supporting context
- **Date logged**

All fields are editable. The user can enrich decisions after the AI captures them.

---

### Manual Decision Logging
A "+ Log Decision" button. User types the decision naturally. AI extracts all fields. User reviews and confirms.

---

## SECTION 10: THE REFLECTIONS PAGE

### Purpose
Weekly and monthly reflections generated automatically from the user's actual work data — tasks, decisions, notes, and conversation history.

### Layout
A vertical feed of reflection cards, newest first. Toggle between Weekly and Monthly views.

---

### Weekly Reflection Card
Shows:
- Week label (e.g., "Week of 13 January")
- AI-generated summary paragraph (2–4 sentences)
- Wins section (bullet list)
- Challenges section (bullet list)
- Learnings section (bullet list)
- Improvement suggestions (1–2 items)
- Mood score (1–10, optional user input)

The AI generates the weekly reflection automatically by analyzing:
- All tasks completed that week
- Tasks that slipped or were blocked
- Decisions made
- Notes written
- Conversation themes

The user can also add manual reflections or annotations to any auto-generated entry.

---

### Monthly Reflection Card
More comprehensive. Includes:
- Month label
- Themes of the month (AI-detected recurring topics)
- Major wins
- Biggest challenges
- Skills and areas of growth
- Productivity patterns (e.g., "You completed most work midweek")
- Suggested focus areas for next month
- Portfolio-worthy work identified

---

### Manual Reflection Entry
A "+ Reflect Now" button. The AI asks a set of guided questions:
- "What went well this week?"
- "What was harder than expected?"
- "What did you learn?"
- "What would you do differently?"

User answers each naturally. AI generates a structured reflection from the answers.

---

## SECTION 11: THE TIMELINE PAGE

### Purpose
A chronological visual history of everything the user has done inside the product — every task completed, note written, decision made, reflection logged.

### Layout
A vertical timeline feed. Events are grouped by day.

---

### Timeline Event Design
Each event is a small card on the timeline with:
- Icon indicating event type (task icon, note icon, decision icon, etc.)
- Short summary text
- Timestamp
- Color coding by event type

Events should be visually distinct by type:
- Tasks: blue indicator
- Notes: green indicator
- Decisions: purple indicator
- Reflections: gold indicator

---

### Filtering
Filter by event type: All / Tasks / Notes / Decisions / Reflections.
Filter by date range.

---

## SECTION 12: THE PORTFOLIO PAGE

### Purpose
Automatically surface career-worthy achievements from the user's work history. Help the user identify their most impactful work for resumes, performance reviews, and promotion cases.

### How it works
The AI continuously analyzes the full work history and identifies:
- Complex problems solved
- Major decisions made
- Impact created
- Leadership moments
- Skill growth areas

---

### Layout
A grid of **Portfolio Cards**.

Each card represents a significant work achievement and includes:
- Project or work area title
- AI-generated impact description (2–4 sentences in strong, results-oriented language)
- Timeline: when this work happened
- Related tasks and decisions
- A "Use This" button that copies a formatted resume-ready bullet point

---

### Resume Bullet Generation
Clicking "Use This" on any portfolio card lets the user:
- View an AI-generated resume bullet for that achievement
- Edit it
- Copy it to clipboard

Example AI-generated bullet:
> "Led product decision to simplify duplicate management architecture, eliminating cross-entity comparison complexity and reducing onboarding friction — captured full decision rationale and stakeholder alignment."

---

### Portfolio Review Prompt
A button at the top: "Generate Portfolio Review." This triggers the AI to do a full analysis of the user's work history and produce a summary of:
- Their strongest work
- Their most impactful decisions
- Skills demonstrated
- Growth trajectory

---

## SECTION 13: SEARCH

The Search page provides semantic, meaning-based search across the entire workspace.

User types a query naturally. Examples:
- "pricing discussions"
- "decisions made in December"
- "anything related to engineering delays"
- "what did I learn about stakeholder management"

Results are grouped by type: Tasks / Notes / Decisions / Reflections / Timeline.

Each result shows a short excerpt with the matching content highlighted.

Search is powered by Claude — user queries are sent to the AI which matches against stored content semantically.

---

## SECTION 14: AI CONVERSATION — DETAILED BEHAVIOR RULES

These rules govern how the AI must behave throughout the product.

---

### Rule 1: Always respond conversationally first
The AI never just outputs a structured list. It always speaks like a thoughtful colleague. After the conversational response, it tells the user what was created.

---

### Rule 2: Ask one clarifying question at a time
If the AI is uncertain about something, it asks one focused question — never a list of questions. It creates what it is confident about and asks only about what it is not.

---

### Rule 3: Detect natural language dates
The AI must convert every natural language time reference into an actual date.

| User says | AI interprets as |
|---|---|
| "tomorrow" | next calendar day |
| "Friday" | the coming Friday |
| "next week" | Monday of next week |
| "end of month" | last day of current month |
| "in two weeks" | 14 days from today |
| "by EOD" | today at 11:59 PM |

---

### Rule 4: Never create duplicates
If a task already exists with a similar title and project, the AI should update or reference it — not create a new one.

---

### Rule 5: Understand project context
If the user mentions a project name that has been referenced before, the AI should link new content to that project automatically.

---

### Rule 6: Surface patterns proactively
When the AI notices patterns across the conversation history, it should mention them. Examples:
- "You've mentioned pricing three times this week — should we make this a tracked topic?"
- "This is the second time the QA conversation has slipped. Want to flag this as a recurring blocker?"

---

### Rule 7: End-of-day mode
If it is late in the working day (after 5pm in the user's timezone), the AI should proactively offer an end-of-day check-in:
> "It's getting late. Want to do a quick wrap-up? I can show you what got done today and what's carrying over."

---

### Rule 8: Low confidence transparency
When the AI is not fully confident in an extraction, it says so plainly and asks. It does not silently create something it is uncertain about.

Example:
> "I wasn't sure if 'check in with the team' was a task you want me to track or just a passing thought. Want me to create a task for that?"

---

### Rule 9: Weekly recap prompt
Every Monday morning, the AI proactively surfaces the previous week's summary in the conversation:
> "Welcome back. Last week you completed 7 tasks, made 3 decisions, and noted a learning about stakeholder alignment. Want to see the full weekly recap before we start today?"

---

### Rule 10: The AI is never passive
The AI always has something useful to offer. When the user just opens the app without typing, the AI should offer context based on data — what's pending, what was due, what decisions are open. It never just shows a blank input waiting.

---

## SECTION 15: EMPTY STATES

Every section must have a meaningful, non-generic empty state. These should reinforce the product's value and guide the user toward action.

| Page | Empty State Message |
|---|---|
| Tasks | "No tasks yet. Tell me what you're working on and I'll organize it for you." |
| Notes | "Start a conversation and I'll build your notes automatically." |
| Decisions | "Every important decision you make will live here — with your full reasoning preserved." |
| Reflections | "Your first reflection will be ready after a week of use. I'm already watching." |
| Timeline | "Your work history starts now. Everything you do will be remembered here." |
| Portfolio | "As you work, I'll identify your most impactful moments and build your portfolio." |

---

## SECTION 16: DESIGN LANGUAGE AND VISUAL TONE

The visual experience should feel: **dark, calm, focused, premium, intelligent.**

Reference points: a tool built for serious deep workers who appreciate simplicity and depth over flashy UI.

---

### Color Philosophy
- Dark background. Near-black canvas, not pure black.
- Cards and surfaces slightly lighter than the background — creating depth without harshness.
- One warm accent color (a muted gold or amber) used sparingly for AI-generated highlights and key moments.
- A cool accent (muted blue) for links, interactive elements, and AI output indicators.
- Green for completed/success. Red for blocked/overdue. Amber for warnings.

---

### Typography Philosophy
- Use a serif or transitional font for headings and display text — something with character and intelligence.
- Use a clean, readable geometric or humanist sans-serif for body text and UI labels.
- Large type where it matters. Small type where it supports.
- Strong typographic hierarchy: the most important information on any screen should be immediately obvious.

---

### Spacing and Layout Philosophy
- Generous whitespace. Never crowd elements.
- Cards have clear breathing room between them.
- The conversation area in the center feels like a document — calm, large, readable.
- The right panel is always a step "quieter" than the center — it supports, not competes.

---

### Interaction Philosophy
- Subtle hover states. Elements respond to the user without shouting.
- Smooth transitions on panel openings, card appearances, and AI output appearing.
- When AI output appears in the right panel, cards should appear with a gentle fade or slide-in — never a jarring pop.
- Loading states should be meaningful. When the AI is processing, show something that communicates intelligence at work — not just a spinner.

---

### What to avoid
- No bright white backgrounds. No harsh contrast.
- No corporate dashboard aesthetic — this is personal and human, not enterprise.
- No emoji in the UI (unless in user-generated content).
- No cluttered toolbars or buttons-for-everything design.
- No generic AI purple gradients.
- The app should feel like it was designed by a thoughtful human, not generated by a template.

---

## SECTION 17: NOTIFICATIONS AND SMART PROMPTS

The AI proactively surfaces these smart prompts throughout the experience (shown as non-intrusive banners or conversation messages):

- When a task is 2 days from its due date with no status update: "This task is due soon and still shows as Not Started. Is it on track?"
- When a task has been In Progress for more than 5 days: "This has been in progress for a while. Is there a blocker?"
- When the user hasn't reflected in 7+ days: "You haven't reflected this week. Want me to generate a summary of what's happened?"
- When a topic appears in conversation 3+ times without a dedicated note: "You keep coming back to [topic]. Should I create a dedicated note or project for it?"
- On Monday: previous week's recap offer.
- On Friday afternoon: end-of-week reflection prompt.

---

## SECTION 18: DATA PERSISTENCE

All user data must persist between sessions. The application must feel continuous — as if the AI remembers everything from yesterday, last week, and last month.

Store:
- All tasks
- All notes
- All decisions
- All reflections
- All timeline events
- The full conversation history

When the app loads, restore the full conversation history and all workspace data so the user can continue exactly where they left off.

---

## SECTION 19: THE FIRST-TIME USER EXPERIENCE

When a user opens the app for the first time (no data stored), they see:

1. A brief, elegant welcome screen (3–5 seconds, not a long onboarding). It should simply set the tone:
   > "Your work, organized. Automatically."
   > "Just tell me what's on your mind."

2. The app transitions directly into the Today page with the conversation workspace active.

3. The AI speaks first with an inviting, warm opening message that explains what to do:
   > "Hello. I'm your work intelligence layer. Tell me what you're working on today — tasks, decisions, thoughts, anything — and I'll organize it all for you automatically. You never need to create a task or file a note. Just talk."

4. The user types their first message and the experience begins.

There should be no tutorial, no onboarding checklist, no popups asking for preferences. The product teaches itself through use.

---

## SECTION 20: SUCCESS FEELING

When this product is built correctly, users should feel the following after using it for one week:

- "This understands my work better than I do."
- "I can't believe how much I've captured without effort."
- "I finally know why I made that decision last month."
- "I have a real picture of what I've accomplished."
- "I don't want to start my day anywhere else."

Every design decision, every AI response, every interaction — ask: does this move the user closer to feeling that way?

If yes, ship it. If no, reconsider.

---

*End of Product Build Prompt.*
*Build something worth returning to every morning.*