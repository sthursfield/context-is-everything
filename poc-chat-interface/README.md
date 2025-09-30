# Chat Interface POC

A standalone testing environment for experimenting with the chat bar interface from context-is-everything.com.

## Features

### 🎨 **Visual Controls**
- **Blur Intensity**: Test different blur effects (0-10px)
- **Shadow Intensity**: Adjust drop shadow depth (5-50px)
- **Border Radius**: Experiment with corner roundness (8-40px)
- **Backdrop Blur**: Control glass-morphism effect (0-40px)

### ✨ **Animation Effects**
- **Glow Effect**: Animated border glow
- **Pulse Animation**: Breathing shadow effect
- **Floating Animation**: Gentle vertical movement
- **Typing Indicator**: Animated dots during "response"

### 🔘 **Button States**
- **Inactive**: Default gray state
- **Active**: Brand red when text is entered
- **Loading**: Spinning animation during send

### 🎛️ **Interactive Features**
- **Real-time updates** as you adjust controls
- **Focus/blur states** with enhanced styling
- **Input detection** automatically activates send button
- **Simulated sending** with typing animation response

## Usage

1. Open `index.html` in any modern browser
2. Use the control panel to experiment with different effects
3. Type in the chat input to see real-time changes
4. Test button states and animations

## Keyboard Shortcuts

- **Ctrl/Cmd + T**: Simulate typing a random message
- **Ctrl/Cmd + R**: Reset all settings to defaults

## Implementation Notes

- Based on actual styles from context-is-everything.com
- Uses glass-morphism with backdrop-filter
- Smooth CSS transitions for all effects
- Responsive design considerations
- Brand colors (#BC302C) matching main site

## Testing Scenarios

Try these combinations:

**🪟 Glass Effect**
- Backdrop Blur: 30px
- Shadow: 25
- Border Radius: 20px
- Animation: Floating

**🌟 Dramatic Glow**
- Animation: Glow Effect
- Shadow: 40
- Border Radius: 32px

**💫 Subtle Elegance**
- Backdrop Blur: 15px
- Shadow: 12
- Radius: 24px
- Animation: Pulse

Perfect for testing before implementing changes in the main codebase!