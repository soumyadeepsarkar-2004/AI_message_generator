# AI Message Generator - WebApp

A powerful, browser-based AI message generator that creates personalized messages for various occasions using intelligent template matching.

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- No server required - runs entirely in the browser!

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/soumyadeepsarkar-2004/AI_message_generator.git
   cd AI_message_generator/webapp
   ```

2. **Run locally (Option 1 - Direct):**
   Simply open `index.html` in your browser:
   ```bash
   # Windows
   start index.html
   
   # macOS
   open index.html
   
   # Linux
   xdg-open index.html
   ```

3. **Run locally (Option 2 - Local Server):**
   ```bash
   # Using Node.js (recommended)
   npm start
   # Opens at http://localhost:3000
   
   # Or using Python
   python -m http.server 3000
   # Visit http://localhost:3000
   ```

## ✨ Features

### Core Capabilities
- **🤖 Smart Template Matching** - AI-powered categorization of message requests
- **📝 8+ Message Categories** - Diwali, Christmas, New Year, Birthday, Business, Promotional, Thank You, Reminders
- **✏️ Customizable Placeholders** - Personalize messages with dynamic fields (name, company, date, etc.)
- **🔄 Multiple Alternatives** - Get 3+ alternative message variations per generation
- **📊 Analytics Dashboard** - Track usage statistics and generation history
- **💾 Auto-Save History** - Automatic local storage of generated messages
- **📤 Export Options** - Copy to clipboard, download as text, or export full history
- **🌙 Night Mode** - Dark theme for comfortable viewing

### User Experience
- **🎯 Quick Examples** - One-click prompt templates for common scenarios
- **⚡ Instant Generation** - Fast template matching and message creation
- **📱 Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **♿ Accessible** - Keyboard navigation and screen reader support
- **🔒 Privacy-First** - All processing happens locally, no data sent to servers

## 📖 Usage Guide

### Generating Your First Message

1. **Enter Your Request:**
   - Type a natural language description in the text area
   - Example: "I want to send Diwali wishes to my customers"

2. **Generate:**
   - Click the "🚀 Generate Message" button
   - Wait for the AI to process your request

3. **Customize:**
   - Fill in the placeholder fields (name, company, etc.)
   - Preview the customized message in real-time

4. **Use Your Message:**
   - Click "📋 Copy" to copy to clipboard
   - Click "💾 Download" to save as a text file
   - Use alternative variations if needed

### Quick Examples

Use the pre-defined quick examples for common scenarios:
- **Diwali Greetings** - Festival wishes for customers/clients
- **Christmas Wishes** - Holiday messages for business contacts
- **New Year Message** - New Year greetings for team members
- **Birthday Wishes** - Personalized birthday messages
- **Thank You Note** - Professional thank you messages
- **Congratulations** - Achievement celebration messages

### Advanced Features

#### History Management
- View all previously generated messages
- Re-use prompts from history
- Delete individual history items
- Clear entire history with one click

#### Settings Panel
Access via the "⚙️ Settings" button:
- **Show Analytics** - Toggle analytics display on/off
- **Auto-save History** - Enable/disable automatic history saving
- **Enable Bulk Mode** - Generate multiple variations at once (future feature)

#### Export Options
- **Copy to Clipboard** - Instant copy with visual confirmation
- **Download as TXT** - Save individual messages as text files
- **Export All Data** - Download complete history as JSON

## 🏗️ Architecture

### Project Structure
```
webapp/
├── index.html                           # Main HTML file with app shell
├── assets/
│   ├── css/
│   │   └── message-generator-fixed.css  # Complete styling
│   └── js/
│       ├── message-generator-core.js    # Core logic & templates
│       └── message-generator-ui.js      # UI components & interactions
├── sw.js                                # Service Worker (PWA support)
├── package.json                         # Project metadata
└── README.md                            # This file
```

### Core Components

#### 1. MessageGeneratorCore (`message-generator-core.js`)
Handles the business logic:
- **Template Management** - Stores and retrieves message templates
- **Category Detection** - Analyzes prompts to determine message category
- **Template Selection** - Selects best matching template based on confidence
- **Message Customization** - Replaces placeholders with user values
- **Validation** - Validates messages and provides suggestions

Key Methods:
- `generateMessage(prompt)` - Main entry point for message generation
- `detectCategory(prompt)` - Categorizes user prompts using keyword matching
- `selectBestTemplate(category, prompt)` - Selects optimal template
- `customizeMessage(message, values)` - Replaces placeholders with actual values
- `validateMessage(message)` - Validates and provides warnings

#### 2. MessageGeneratorUI (`message-generator-ui.js`)
Manages the user interface:
- **UI Rendering** - Creates and updates DOM elements
- **Event Handling** - Manages user interactions
- **State Management** - Handles app state and localStorage
- **Notifications** - Shows success/error messages
- **History Management** - Tracks and displays generation history
- **Analytics** - Calculates and displays usage statistics

Key Methods:
- `generateMessage()` - Handles generation button click
- `displayResult(result, prompt)` - Renders generated message
- `copyToClipboard(text)` - Copies text to clipboard
- `downloadMessage()` - Downloads message as file
- `exportData()` - Exports all data as JSON

### Data Flow
```
User Input (Prompt)
    ↓
MessageGeneratorUI.generateMessage()
    ↓
MessageGeneratorCore.generateMessage()
    ↓
Category Detection → Template Selection
    ↓
Return: {message, category, placeholders, confidence, alternatives, suggestions}
    ↓
MessageGeneratorUI.displayResult()
    ↓
User Customization (Fill Placeholders)
    ↓
Export/Copy/Download
```

## 🎨 Customization

### Adding New Templates

Edit `message-generator-core.js` to add templates:

```javascript
this.templates = {
    // Add your category
    myCategory: [
        {
            template: "Your message with {placeholder}",
            placeholders: ["placeholder"],
            category: "myCategory",
            confidence: 0.9
        }
    ]
};

// Add keywords for detection
this.keywordMap = {
    myCategory: ["keyword1", "keyword2", "phrase"]
};
```

### Styling Customization

Modify CSS variables in `message-generator-fixed.css`:

```css
:root {
    --primary-color: #6366f1;      /* Main theme color */
    --primary-dark: #4f46e5;       /* Darker shade */
    --primary-light: #818cf8;      /* Lighter shade */
    --bg-primary: #ffffff;         /* Background */
    --text-primary: #1f2937;       /* Text color */
}
```

## 🔧 Configuration

### Settings (LocalStorage)
The app stores settings in browser localStorage:
- `msg-gen-settings` - User preferences
- `msg-gen-history` - Generation history
- `msg-gen-analytics` - Usage statistics

### Options
When initializing, you can pass options:

```javascript
const generator = new MessageGeneratorUI('containerId', {
    showAnalytics: true,      // Show analytics panel
    showHistory: true,        // Show history panel
    maxHistoryItems: 10,      // Max history entries
    enableAutoSave: true      // Auto-save to localStorage
});
```

## 🌐 Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Core Functionality | 90+ | 88+ | 14+ | 90+ |
| LocalStorage | ✅ | ✅ | ✅ | ✅ |
| Clipboard API | ✅ | ✅ | 13.1+ | ✅ |
| CSS Backdrop Filter | 76+ | 103+ | 15.4+ | 79+ |
| Service Worker | 45+ | 44+ | 11.1+ | 17+ |

## 📱 Mobile Support

The app is fully responsive and works on:
- iOS Safari 14+
- Chrome Mobile 90+
- Firefox Mobile 88+
- Samsung Internet 13+

Touch-optimized UI elements and mobile-friendly layouts ensure smooth experience.

## 🔒 Privacy & Security

- **No Server Required** - Runs 100% in your browser
- **No Data Collection** - Zero tracking or analytics sent externally
- **Local Storage Only** - All data stays on your device
- **No API Calls** - No external dependencies or network requests
- **Open Source** - Full code transparency

## 🐛 Troubleshooting

### Common Issues

**Issue: Generator not loading**
- Check browser console for errors
- Ensure JavaScript is enabled
- Try hard refresh (Ctrl+F5 / Cmd+Shift+R)

**Issue: Templates not matching correctly**
- Use more specific keywords in your prompt
- Try the quick examples to see expected format
- Check that your prompt includes category keywords

**Issue: Clipboard copy not working**
- Ensure browser supports Clipboard API
- Grant clipboard permissions if prompted
- Use HTTPS or localhost (required by browsers)

**Issue: History not saving**
- Check browser allows localStorage
- Ensure you're not in private/incognito mode
- Check localStorage quota isn't exceeded

## 🤝 Contributing

Want to improve the message generator? Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Test thoroughly
5. Commit (`git commit -m 'Add AmazingFeature'`)
6. Push (`git push origin feature/AmazingFeature`)
7. Open a Pull Request

### Development Guidelines
- Maintain consistent code style
- Add comments for complex logic
- Test on multiple browsers
- Update documentation for new features
- Keep changes minimal and focused

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

**Soumyadeep Sarkar**
- GitHub: [@soumyadeepsarkar-2004](https://github.com/soumyadeepsarkar-2004)
- Project: [AI_message_generator](https://github.com/soumyadeepsarkar-2004/AI_message_generator)

## 🙏 Acknowledgments

- Modern UI/UX design principles
- Community feedback and suggestions
- Open source inspiration

## 📞 Support

Need help?
1. Check this README for answers
2. Visit [Issues](https://github.com/soumyadeepsarkar-2004/AI_message_generator/issues)
3. Create a new issue with:
   - Browser and version
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable

---

**Made with ❤️ for better communication**

*Last Updated: October 2025*