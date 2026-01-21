# Tailwind CSS Setup Guide for Angular

This guide explains how to install and configure Tailwind CSS in an Angular project.

## Prerequisites

- Angular 17+ project
- Node.js and npm installed

## Installation Steps

### 1. Install Tailwind CSS and Dependencies

```bash
npm install -D tailwindcss postcss autoprefixer
```

**Note:** Use Tailwind CSS v3.x for better compatibility with Angular's build system. Avoid v4.x as it requires additional PostCSS plugin setup.

### 2. Initialize Tailwind Configuration

Create `tailwind.config.js` in the project root:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 3. Create PostCSS Configuration

Create `postcss.config.js` in the project root:

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### 4. Add Tailwind Directives to Global Styles

Add the Tailwind directives to your `src/styles.scss` (or `styles.css`) file:

```scss
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Your other global styles here */
```

## Usage

After installation, you can use Tailwind utility classes in your Angular templates:

```html
<div class="flex items-center justify-between p-4 bg-blue-500">
  <h1 class="text-2xl font-bold text-white">Hello Tailwind</h1>
  <button class="px-4 py-2 bg-white text-blue-500 rounded hover:bg-gray-100">
    Click me
  </button>
</div>
```

## Troubleshooting

### Error: "tailwindcss directly as a PostCSS plugin"

If you see this error:
```
Error: It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin.
```

**Solution:**
1. Make sure you're using Tailwind CSS v3.x (not v4.x)
2. Verify your `postcss.config.js` uses `tailwindcss: {}` not `@tailwindcss/postcss`
3. Restart your development server after configuration changes

### Check Your Versions

```bash
npm list tailwindcss
```

Should show `tailwindcss@^3.4.0` or similar.

## Additional Configuration

### Customizing Theme

Edit `tailwind.config.js` to customize colors, fonts, spacing, etc:

```javascript
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        'custom-blue': '#1e40af',
      },
    },
  },
  plugins: [],
}
```

### Purge/Content Configuration

The `content` array tells Tailwind which files to scan for class names. Make sure all your component templates are included:

```javascript
content: [
  "./src/**/*.{html,ts}",  // Scans all HTML and TS files in src/
]
```

## Files Created/Modified

- ✅ `tailwind.config.js` - Tailwind configuration
- ✅ `postcss.config.js` - PostCSS configuration  
- ✅ `src/styles.scss` - Added Tailwind directives
- ✅ `package.json` - Added dependencies

## Reference

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Angular + Tailwind Guide](https://tailwindcss.com/docs/guides/angular)
