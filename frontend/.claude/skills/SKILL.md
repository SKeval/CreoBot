# Frontend Design Skill — CreoBot

## Design Principles
- Avoid generic AI aesthetic — aim for agency-quality output
- Dark theme: background #0a0a0a, surface #111111, border #1a1a1a
- Never use random colors — always use design tokens

## Typography
- Headings: font-bold, tracking-tight
- Body: text-gray-400, leading-relaxed
- Scale: text-sm / text-base / text-lg / text-xl / text-2xl / text-4xl / text-6xl

## Spacing
- Base grid: 8px
- Section padding: py-24
- Component gap: gap-6 or gap-8
- Max content width: max-w-6xl mx-auto px-6

## Colors
- Primary: blue-600 / blue-500 (hover)
- Accent: purple-600
- Background: gray-950
- Surface: gray-900
- Border: gray-800
- Text primary: white
- Text secondary: gray-400
- Success: green-400
- Warning: yellow-400

## Animation Rules (Framer Motion)
- All sections: fade up on scroll entry
- Cards: staggered reveal with 0.1s delay each
- Buttons: scale on hover (1.02), smooth transition
- Page load: fade in over 0.4s
- Never use jarring or fast animations — keep it smooth

## Component Patterns
- Cards: rounded-2xl, border border-gray-800, bg-gray-900, p-6
- Buttons primary: bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg font-semibold
- Buttons secondary: border border-gray-700 hover:border-gray-500 px-6 py-3 rounded-lg
- Inputs: bg-gray-800 border border-gray-700 rounded-lg px-4 py-3

## Rules
- Mobile-first, fully responsive
- No random hex codes — use Tailwind tokens only
- Every interactive element must have a hover state
- Sections must breathe — generous whitespace