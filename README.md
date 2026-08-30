# Foos Trainer

A production-ready Progressive Web App (PWA) for training foosball reaction-based execution of drills.

## Features

- 🎮 **Multiple Trainers**: 5-Bar and 3-Bar trainers with customizable drills
- ⚡ **Reaction Training**: Hidden random delays between preparation and drill reveal
- 🔊 **Audio Cues**: Optional sound effects and drill name speech synthesis
- 📱 **Progressive Web App**: Installable on mobile and desktop, works offline
- 📊 **Session Statistics**: Detailed analytics including average delay, fastest/longest delays, drill distribution
- 💾 **Local Storage**: All sessions saved locally on device
- 📤 **Export**: Download session data as CSV or JSON
- 🌓 **Dark Mode**: Dark theme support
- ♿ **Accessible**: Keyboard accessible and screen reader friendly

## Tech Stack

- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Tailwind CSS** - Styling
- **PWA Plugin** - Progressive Web App support
- **Web Speech API** - Drill name speech synthesis
- **Web Audio API** - Sound cues

## Installation

1. Clone the repository or download the project
2. Navigate to the project directory:
   ```bash
   cd foos-trainer
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

## Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Building for Production

Create an optimized production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Usage

### Setup Screen

1. **Select Trainer**: Choose between 5-Bar or 3-Bar trainer
2. **Configure Preparation Interval**: Set time between repetitions (in seconds)
3. **Set Repetitions**: Choose number of reps to perform
4. **Select Drills**: Enable/disable specific drills or select all
5. **Set Random Delay Range**: Configure min/max delay (in seconds)
   - Default 5-Bar: 0-10s
   - Default 3-Bar: 0-15s
6. **Audio Options**:
   - Play sound cue: Beep sound when drill is revealed
   - Speak drill name: Text-to-speech for drill name
   - Visual flash: Screen flash on drill reveal
7. **Start Session**: Begin training

### Training Screen

- **Get Ready Phase**: Shows "Get Ready" during preparation interval
- **Hidden Delay**: Random delay between 0-10s (or configured range) - duration is hidden
- **Drill Reveal**: Large drill name appears with optional audio/visual cues
- **Next Rep**: Automatically moves to next repetition
- **Stop Session**: Stop training and view results

### Results Screen

- **Statistics Dashboard**: Average delay, fastest/longest delays, total reps
- **Drill Distribution**: Visual breakdown of which drills appeared
- **Detailed Results**: Table with per-rep statistics
- **Export Options**: Download session as CSV or JSON
- **Navigation**: View history or start new session

### History Screen

- **Session List**: All previous training sessions
- **Quick Stats**: Rep count and average delay per session
- **Drill Summary**: Which drills were performed in each session
- **View Details**: Click any session to see full results

## Installation as PWA

### On Mobile:

1. Open the app in your mobile browser
2. Tap the share/menu button
3. Select "Install app" or "Add to Home Screen"
4. App will be added as an installable app

### On Desktop:

1. Open the app in Chrome/Edge
2. Click the install icon in the address bar
3. Select "Install" in the dialog
4. App will open as a standalone window

## Extending with New Trainers

To add new trainers, modify `src/types/trainers.ts`:

```typescript
export const TRAINERS: Record<string, Trainer> = {
  '5bar': { /* existing */ },
  '3bar': { /* existing */ },
  'mytrainer': {
    id: 'mytrainer',
    name: 'My Trainer',
    defaultMinDelay: 0,
    defaultMaxDelay: 20,
    drills: [
      { id: 'drill1', name: 'Drill 1' },
      { id: 'drill2', name: 'Drill 2' },
    ],
  },
};
```

## Project Structure

```
src/
├── components/          # React components
│   ├── SetupScreen.tsx      # Configuration screen
│   ├── TrainingScreen.tsx    # Active training screen
│   ├── ResultsScreen.tsx     # Session results
│   └── HistoryScreen.tsx     # Session history
├── context/            # React Context
│   └── AppContext.tsx       # App state management
├── hooks/              # Custom React hooks
│   └── useTrainingSession.ts # Training session logic
├── types/              # TypeScript definitions
│   ├── index.ts             # Core types
│   └── trainers.ts          # Trainer configurations
├── utils/              # Utility functions
│   └── index.ts             # Storage, shuffle bag, stats, export
├── App.tsx             # Main app component
├── main.tsx            # Entry point
└── index.css           # Global styles + Tailwind
```

## Performance Optimizations

- Code splitting via Vite
- CSS minification with Tailwind
- Service worker caching static assets
- Lazy component rendering based on screen state

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### App not installing as PWA
- Ensure you're using HTTPS (or localhost for development)
- Check browser supports PWA installation
- Verify manifest.json is loaded

### Audio cues not working
- Check browser has microphone/speaker permissions
- Some browsers require user interaction first
- Verify volume is not muted

### Speech synthesis not available
- Some browsers don't support Web Speech API
- Try different browser if feature not working
- Check browser language settings

## Data Privacy

- All data is stored locally on your device
- No data is sent to external servers
- Export data to back up sessions locally

## Future Enhancements

- [ ] Multiple drill sequence patterns
- [ ] Video recording of drills
- [ ] Cloud sync across devices
- [ ] Team statistics and leaderboards
- [ ] Drill video demonstrations
- [ ] Advanced analytics and trends
- [ ] Custom drill creation UI
- [ ] Multiplayer training sessions

## License

MIT License - Feel free to use and modify for personal or commercial projects.

## Contributing

Contributions welcome! Areas for improvement:
- UI/UX enhancements
- Additional trainer types
- Performance optimizations
- Accessibility improvements
- Mobile responsive refinements

## Support

For issues or questions, please review the code or create an issue in the repository.

---

**Enjoy your training! 🎯**
