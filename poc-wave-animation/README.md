# Wave Animation POC

A standalone proof of concept for testing wave animations on mountain contour rings.

## Features

### Interactive Controls
- **Wave Speed**: Adjust animation timing (1-20 seconds)
- **Phase Offset**: Control delay between rings (0-2 radians)
- **Elevation Spacing**: Ring separation distance (0.1-3 units)
- **Wave Amplitude**: Animation intensity (0.1-2x)
- **Wave Direction**: Center→Out, Out→Center, Bottom→Top, Top→Bottom
- **Wave Function**: Sine, Cosine, Sawtooth, Triangle, Square waves

### Real-Time Feedback
- Live FPS counter
- Ring count display
- Pause/Resume controls
- Reset to defaults

## Usage

1. Open `index.html` in any modern browser
2. Adjust parameters using the control panel
3. Watch wave patterns propagate through the rings
4. Find optimal settings for your use case

## Implementation Notes

- Uses Three.js r128 for 3D rendering
- Simple ring geometries for fast testing
- Real-time parameter updates
- Performance monitoring

## Testing Different Patterns

Try these combinations:
- **Gentle Waves**: Speed=8, Phase=0.2, Amplitude=0.6, Sine
- **Ripple Effect**: Speed=4, Phase=0.5, Direction=Outward, Sine
- **Mechanical**: Speed=3, Phase=0.3, Square wave
- **Organic**: Speed=12, Phase=0.15, Triangle wave

Perfect for testing before implementing in the main project!