export interface Example {
  title: string;
  description: string;
  code: string;
  functions?: string;
  tags: string[];
}

export const EXAMPLES: Example[] = [
  {
    title: "Counter App",
    description:
      "Learn the basics: state, show statements, events, and actions",
    tags: ["Beginner", "State", "Events"],
    code: `# Simple Counter Example
# Demonstrates: state, show statements, events, and actions

There is a number called count starting at 0.

Show a heading saying "Counter App".
Show a text saying "hello world".
Show a text saying "Current count: {count}".

Show a button saying "Increment".
Show a button saying "Decrement".
Show a button saying "Reset".

When I click the button "Increment",
increase count by 1.

When I click the button "Decrement",
decrease count by 1.

When I click the button "Reset",
set count to 0.`,
  },
  {
    title: "Todo List",
    description: "Work with lists, for-each loops, and dynamic data",
    tags: ["Lists", "Loops", "Input"],
    code: `# Todo List Example
# Demonstrates: lists, for-each loops, and list manipulation

There is a list called todos starting empty.
There is a text called inputText starting at "".

Show a heading saying "My Todo List".

# Input area
Show an input called inputText.
Show a button saying "Add Todo".

# Add todo when button clicked
When I click the button "Add Todo",
add inputText to todos.
set inputText to "".

# Display all todos
For each item in todos,
show a text saying "• {item}".`,
  },
  {
    title: "Profile Settings",
    description: "Use conditionals, booleans, and toggle actions",
    tags: ["Conditionals", "Boolean", "State"],
    code: `# Profile Settings Example
# Demonstrates: conditionals, multiple state types, and toggle

There is a text called username starting at "Guest".
There is a boolean called isLoggedIn starting at false.
There is a number called score starting at 0.

Show a heading saying "User Profile".

# Login/Logout button
Show a button saying "Toggle Login".

When I click the button "Toggle Login",
toggle isLoggedIn.

# Conditional display based on login status
If isLoggedIn is equal to true,
show a text saying "Welcome, {username}!".
show a text saying "Your score: {score}".

If isLoggedIn is equal to false,
show a text saying "Please log in to view your profile.".

# Score controls (only visible when logged in)
If isLoggedIn is equal to true,
show a button saying "Earn Points".

When I click the button "Earn Points",
increase score by 10.

# High score message
If score is greater than 50,
show a text saying "🎉 High score achieved!".`,
  },
  {
    title: "Custom Widgets & Actions",
    description: "Extend Lingo with custom widgets and actions via JavaScript",
    tags: ["Advanced", "Custom", "Extensibility"],
    code: `# Custom Widgets Example
# This demonstrates using custom widgets defined in functions.js

There is a number called clicks starting at 0.

Show a heading saying "Custom Widgets & Actions Demo".

# Use custom card widget
Show a card with title "Welcome" and description "This is a custom card widget!".

Show a card with title "Features" and description "You can create any custom widget you want.".

# Use custom alert widget
Show a alert with message "This is an info alert" and type "info".

Show a alert with message "Warning: Custom widgets are powerful!" and type "warning".

# Use custom badge widget  
Show a badge with text "New" and color "blue".
Show a badge with text "Premium" and color "gold".
Show a badge with text "Sale" and color "red".

# Standard widgets and custom actions
Show a heading saying "Click Counter".

Show a button saying "Click me".
Show a button saying "Add One".
Show a button saying "Double".
Show a button saying "Reset".
Show a button saying "Divide By".

Show a text saying "Clicks: {clicks}".

# Standard increase action
When I click the button "Click me",
increase clicks by 1.

# Custom actions
When I click the button "Add One",
addOne clicks.

When I click the button "Double",
double clicks.

When I click the button "Reset",
reset clicks.

When I click the button "Divide By",
divideBy clicks with factor "2".`,
    functions: `// Custom card widget
export function card(root, title, description) {
  const cardEl = document.createElement('div');
  cardEl.style.cssText = 'border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px; margin: 8px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);';
  
  const titleEl = document.createElement('h3');
  titleEl.textContent = title;
  titleEl.style.marginTop = '0';
  cardEl.appendChild(titleEl);
  
  const descEl = document.createElement('p');
  descEl.textContent = description;
  descEl.style.marginBottom = '0';
  descEl.style.color = '#666';
  cardEl.appendChild(descEl);
  
  root.appendChild(cardEl);
  return cardEl;
}

// Custom alert widget
export function alert(root, message, type = 'info') {
  const alertEl = document.createElement('div');
  const colors = {
    info: '#2196F3',
    warning: '#FF9800',
    error: '#f44336',
    success: '#4CAF50',
  };
  
  alertEl.style.cssText = 'background-color: ' + (colors[type] || colors.info) + '22; border-left: 4px solid ' + (colors[type] || colors.info) + '; padding: 12px 16px; margin: 8px 0; border-radius: 4px;';
  
  alertEl.textContent = message;
  root.appendChild(alertEl);
  return alertEl;
}

// Custom badge widget
export function badge(root, text, color) {
  const badgeEl = document.createElement('span');
  badgeEl.textContent = text;
  badgeEl.style.cssText = 'display: inline-block; background-color: ' + color + '; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold; margin: 4px;';
  
  root.appendChild(badgeEl);
  return badgeEl;
}

// Custom action: Add one
export function addOne(signal) {
  signal.set(signal.get() + 1);
}

// Custom action: Double
export function double(signal) {
  signal.set(signal.get() * 2);
}

// Custom action: Reset
export function reset(signal) {
  signal.set(0);
}

// Custom action: Divide by factor
export function divideBy(signal, factor) {
  signal.set(signal.get() / parseInt(factor, 10));
}`,
  },
  {
    title: "Text Formatting",
    description: "Style text with various formatting options",
    tags: ["Widgets", "Formatting", "UI"],
    code: `# Text Formatting Example
# Demonstrates: Using various HTML-like widgets with English-friendly names

There is a text called userName starting at "Alice".

Show a heading saying "Text Formatting Demo".

# Paragraph
Show a paragraph saying "This is a paragraph of text.".

# Text formatting
Show an italic saying "This text is in italics.".
Show a bold saying "This text is bold.".
Show a strong saying "This text has strong emphasis.".
Show an emphasis saying "This text is emphasized.".
Show an underline saying "This text is underlined.".

# More formatting
Show a small saying "This is small text.".
Show a mark saying "This text is highlighted.".
Show a deleted saying "This text is deleted.".
Show a strikethrough saying "This text is struck through.".
Show a code saying "console.log('Hello')".

# Layout containers
Show a container saying "This is a container (div).".
Show a section saying "This is a section.".

# Links and lists
Show a link saying "Click here to visit".
Show an unorderedlist saying "".
Show a listitem saying "First item".
Show a listitem saying "Second item".

# Dynamic content
Show an italic saying "Welcome, {userName}!".
Show a paragraph saying "User {userName} is currently logged in.".`,
  },
  {
    title: "Styling & Layout",
    description:
      "Use colors, alignment, and layout containers to style your UI",
    tags: ["Styling", "Layout", "Design"],
    code: `# Styling Demo
# Demonstrates: colored text, centered alignment, row and column layouts

There is a number called count starting at 0.

Show a heading saying "Styling Demo" centered and colored blue.

Show a text saying "This text is green and centered" colored green and centered.

Show a text saying "This text is red and aligned right" colored red and aligned right.

Show a row containing,
show a text saying "Item 1" colored purple.
show a text saying "Item 2" colored orange.
show a text saying "Item 3" colored teal.

Show a column gap "10px" containing,
show a text saying "First in column" background lightblue.
show a text saying "Second in column" background lightgreen.
show a text saying "Third in column" background lightyellow.

Show a button saying "Increment".
Show a text saying "Count: {count}".

When I click the button "Increment",
increase count by 1.`,
  },
  {
    title: "API Handling",
    description: "Make API calls and display dynamic data",
    tags: ["API", "Dynamic Data", "Advanced"],
    code: `# Cat Facts API Example
# Demonstrates: API calls with custom functions and displaying fetched data

There is a list called facts starting empty.
There is a number called factCount starting at 3.

Show a heading saying "🐱 Cat Facts from MeowFacts API".

Show a text saying "Number of facts to fetch: {factCount}".
Show a button saying "Fetch Cat Facts".
Show a button saying "Fetch More (5 facts)".

# Fetch facts when button clicked
When I click the button "Fetch Cat Facts",
fetchMeowFacts facts.

When I click the button "Fetch More (5 facts)",
fetchMultipleMeowFacts facts with count "5".

# Display all fetched facts
For each fact in facts,
show a text saying "🐱 {fact}".
`,
  },
];
