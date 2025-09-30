// Wave Animation POC
class WaveAnimationPOC {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.rings = [];
        this.animationId = null;
        this.isPaused = false;

        // Animation parameters
        this.params = {
            waveSpeed: 6,
            phaseOffset: 0.3,
            elevationSpacing: 0.5,
            waveAmplitude: 1.0,
            waveDirection: 'outward',
            waveFunction: 'sine',
            offScreenDistance: 5,
            rotationSpeed: 1.0,
            rotationAxis: 'x'
        };

        // Performance tracking
        this.fps = 0;
        this.lastTime = 0;
        this.frameCount = 0;
        this.fpsUpdateTime = 0;

        this.init();
        this.setupControls();
        this.animate();
    }

    init() {
        const container = document.getElementById('container');

        // Scene
        this.scene = new THREE.Scene();

        // Camera
        this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 5000);
        this.camera.position.set(0, 0, 10);
        this.camera.lookAt(0, 0, 0);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0);
        container.appendChild(this.renderer.domElement);

        // Create mountain rings
        this.createMountainRings();

        // Handle resize
        window.addEventListener('resize', () => this.onWindowResize());
    }

    async createMountainRings() {
        // Create mountain-like contour shapes for more realistic appearance
        const contourConfigs = [
            { points: this.generateMountainContour(3.5, 64, 0.3, 0.8), index: 0 }, // Outer ridge
            { points: this.generateMountainContour(2.8, 56, 0.25, 0.6), index: 1 }, // Upper slopes
            { points: this.generateMountainContour(2.2, 48, 0.2, 0.45), index: 2 }, // Mid slopes
            { points: this.generateMountainContour(1.9, 44, 0.18, 0.35), index: 3 }, // Mid-lower slopes
            { points: this.generateMountainContour(1.6, 40, 0.15, 0.3), index: 4 }, // Lower slopes
            { points: this.generateMountainContour(1.0, 32, 0.1, 0.2), index: 5 }, // Valley
            { points: this.generateMountainContour(0.5, 24, 0.05, 0.1), index: 6 }  // Inner peak
        ];

        contourConfigs.forEach((config, index) => {
            const geometry = new THREE.BufferGeometry().setFromPoints(config.points);

            // Single line material for clean contour look
            const material = new THREE.LineBasicMaterial({
                color: 0xff8800,
                linewidth: 2,
                transparent: true,
                opacity: 0.9
            });

            const contourLine = new THREE.LineLoop(geometry, material);

            // Store ring data
            contourLine.userData = {
                elevation: -2 + index * this.params.elevationSpacing,
                ringIndex: index,
                baseElevation: -2 + index * this.params.elevationSpacing,
                originalZ: 0
            };

            // Start at z = 0 (flat)
            contourLine.position.z = 0;

            this.rings.push(contourLine);
            this.scene.add(contourLine);
        });

        console.log(`Created ${this.rings.length} mountain contour lines`);
        document.getElementById('ringCount').textContent = this.rings.length;
    }

    // Generate smooth organic mountain contour shapes using curves
    generateMountainContour(baseRadius, segments, irregularity, peakiness) {
        // First generate control points with noise
        const controlPoints = [];
        const controlSegments = Math.max(12, Math.floor(segments / 4)); // Fewer control points for smoother curves

        for (let i = 0; i < controlSegments; i++) {
            const angle = (i / controlSegments) * Math.PI * 2;

            // Base circular shape
            let radius = baseRadius;

            // Add mountain-like irregularities using multiple sine waves
            const noiseFreq1 = 2.3; // Primary mountain features (non-integer for organic feel)
            const noiseFreq2 = 4.7; // Secondary ridges and valleys
            const noiseFreq3 = 8.1; // Fine details
            const noiseFreq4 = 12.9; // Very fine details

            const noise1 = Math.sin(angle * noiseFreq1) * irregularity;
            const noise2 = Math.sin(angle * noiseFreq2 + 1.2) * irregularity * 0.4;
            const noise3 = Math.cos(angle * noiseFreq3 + 2.1) * irregularity * 0.2;
            const noise4 = Math.sin(angle * noiseFreq4 + 3.7) * irregularity * 0.1;

            // Add peaks and valleys with organic variation
            const peakNoise = Math.sin(angle * 2.7 + 0.5) * peakiness;
            const valleyNoise = Math.cos(angle * 1.3 + 1.8) * peakiness * 0.6;

            radius += noise1 + noise2 + noise3 + noise4 + peakNoise + valleyNoise;

            // Ensure minimum radius
            radius = Math.max(radius, baseRadius * 0.3);

            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            controlPoints.push(new THREE.Vector3(x, y, 0));
        }

        // Now create smooth curve through control points using Catmull-Rom spline
        const curve = new THREE.CatmullRomCurve3(controlPoints, true); // true = closed curve
        const smoothPoints = curve.getPoints(segments);

        return smoothPoints;
    }

    updateWaveAnimation(time) {
        if (this.isPaused || this.rings.length === 0) return;

        const waveTime = time / 1000 * (2 * Math.PI / this.params.waveSpeed);

        // Update scene rotation for mountain/funnel transformation
        this.updateSceneRotation(time);

        this.rings.forEach((ring, index) => {
            // Calculate phase offset based on direction
            let phaseOffset = 0;
            switch(this.params.waveDirection) {
                case 'outward':
                    phaseOffset = index * this.params.phaseOffset;
                    break;
                case 'inward':
                    phaseOffset = (this.rings.length - index - 1) * this.params.phaseOffset;
                    break;
                case 'forward':
                    phaseOffset = index * this.params.phaseOffset;
                    break;
                case 'backward':
                    phaseOffset = (this.rings.length - index - 1) * this.params.phaseOffset;
                    break;
            }

            // Calculate wave value based on function type
            let waveValue;
            const t = waveTime + phaseOffset;

            switch(this.params.waveFunction) {
                case 'sine':
                    waveValue = Math.sin(t);
                    break;
                case 'cosine':
                    waveValue = Math.cos(t);
                    break;
                case 'sawtooth':
                    waveValue = 2 * (t / (2 * Math.PI) - Math.floor(t / (2 * Math.PI) + 0.5));
                    break;
                case 'triangle':
                    const saw = 2 * (t / (2 * Math.PI) - Math.floor(t / (2 * Math.PI) + 0.5));
                    waveValue = 2 * Math.abs(saw) - 1;
                    break;
                case 'square':
                    waveValue = Math.sign(Math.sin(t));
                    break;
                default:
                    waveValue = Math.sin(t);
            }

            // Normalize to 0-1 range and apply amplitude
            const normalizedWave = (waveValue + 1) / 2 * this.params.waveAmplitude;

            // Apply to ring elevation and off-screen movement
            const targetElevation = ring.userData.baseElevation * normalizedWave;
            ring.position.z = targetElevation;

            // Add off-screen movement - rings move toward/away from camera
            const offScreenOffset = Math.sin(waveTime + phaseOffset) * this.params.offScreenDistance;
            ring.position.z += offScreenOffset;
        });
    }

    updateSceneRotation(time) {
        if (this.params.rotationSpeed === 0) return;

        // Create rotation cycle - slower than wave for dramatic effect
        const rotationTime = time / 1000 * this.params.rotationSpeed * 0.1; // Much slower rotation

        switch(this.params.rotationAxis) {
            case 'x':
                // X-axis rotation: 0° = top view, 90° = mountain side view, 180° = funnel view
                this.scene.rotation.x = Math.sin(rotationTime) * Math.PI * 0.8; // ±144° range
                break;

            case 'y':
                // Y-axis rotation: spinning around
                this.scene.rotation.y = rotationTime;
                break;

            case 'z':
                // Z-axis rotation: rolling
                this.scene.rotation.z = Math.sin(rotationTime) * Math.PI * 0.5; // ±90° range
                break;

            case 'xy':
                // Combined X+Y for complex 3D rotation
                this.scene.rotation.x = Math.sin(rotationTime) * Math.PI * 0.6;
                this.scene.rotation.y = Math.cos(rotationTime * 0.7) * Math.PI * 0.4;
                break;
        }
    }

    animate(time = 0) {
        this.animationId = requestAnimationFrame((t) => this.animate(t));

        // Update FPS
        this.updateFPS(time);

        // Update wave animation
        this.updateWaveAnimation(time);

        // Rotation is now handled in updateWaveAnimation

        // Render
        this.renderer.render(this.scene, this.camera);
    }

    updateFPS(time) {
        this.frameCount++;

        if (time > this.fpsUpdateTime + 1000) {
            this.fps = Math.round((this.frameCount * 1000) / (time - this.fpsUpdateTime));
            document.getElementById('fps').textContent = this.fps;
            this.frameCount = 0;
            this.fpsUpdateTime = time;
        }
    }

    setupControls() {
        // Wave Speed
        const waveSpeedSlider = document.getElementById('waveSpeed');
        const waveSpeedValue = document.getElementById('waveSpeedValue');
        waveSpeedSlider.addEventListener('input', (e) => {
            this.params.waveSpeed = parseFloat(e.target.value);
            waveSpeedValue.textContent = e.target.value;
        });

        // Phase Offset
        const phaseOffsetSlider = document.getElementById('phaseOffset');
        const phaseOffsetValue = document.getElementById('phaseOffsetValue');
        phaseOffsetSlider.addEventListener('input', (e) => {
            this.params.phaseOffset = parseFloat(e.target.value);
            phaseOffsetValue.textContent = e.target.value;
        });

        // Elevation Spacing
        const elevationSpacingSlider = document.getElementById('elevationSpacing');
        const elevationSpacingValue = document.getElementById('elevationSpacingValue');
        elevationSpacingSlider.addEventListener('input', (e) => {
            this.params.elevationSpacing = parseFloat(e.target.value);
            elevationSpacingValue.textContent = e.target.value;
            this.updateElevationSpacing();
        });

        // Wave Amplitude
        const waveAmplitudeSlider = document.getElementById('waveAmplitude');
        const waveAmplitudeValue = document.getElementById('waveAmplitudeValue');
        waveAmplitudeSlider.addEventListener('input', (e) => {
            this.params.waveAmplitude = parseFloat(e.target.value);
            waveAmplitudeValue.textContent = e.target.value;
        });

        // Off-Screen Distance
        const offScreenDistanceSlider = document.getElementById('offScreenDistance');
        const offScreenDistanceValue = document.getElementById('offScreenDistanceValue');
        offScreenDistanceSlider.addEventListener('input', (e) => {
            this.params.offScreenDistance = parseFloat(e.target.value);
            offScreenDistanceValue.textContent = e.target.value;
        });

        // Camera Z Position
        const cameraZSlider = document.getElementById('cameraZ');
        const cameraZValue = document.getElementById('cameraZValue');
        cameraZSlider.addEventListener('input', (e) => {
            const newZ = parseFloat(e.target.value);
            this.camera.position.z = newZ;
            cameraZValue.textContent = e.target.value;
        });

        // Rotation Speed
        const rotationSpeedSlider = document.getElementById('rotationSpeed');
        const rotationSpeedValue = document.getElementById('rotationSpeedValue');
        rotationSpeedSlider.addEventListener('input', (e) => {
            this.params.rotationSpeed = parseFloat(e.target.value);
            rotationSpeedValue.textContent = e.target.value;
        });

        // Rotation Axis
        const rotationAxisSelect = document.getElementById('rotationAxis');
        rotationAxisSelect.addEventListener('change', (e) => {
            this.params.rotationAxis = e.target.value;
        });

        // Wave Direction
        const waveDirectionSelect = document.getElementById('waveDirection');
        waveDirectionSelect.addEventListener('change', (e) => {
            this.params.waveDirection = e.target.value;
        });

        // Wave Function
        const waveFunctionSelect = document.getElementById('waveFunction');
        waveFunctionSelect.addEventListener('change', (e) => {
            this.params.waveFunction = e.target.value;
        });

        // Pause/Resume
        const pauseBtn = document.getElementById('pauseBtn');
        pauseBtn.addEventListener('click', () => {
            this.isPaused = !this.isPaused;
            pauseBtn.textContent = this.isPaused ? 'Resume' : 'Pause';
        });

        // Reset
        const resetBtn = document.getElementById('resetBtn');
        resetBtn.addEventListener('click', () => {
            this.resetAnimation();
        });
    }

    updateElevationSpacing() {
        this.rings.forEach((ring, index) => {
            ring.userData.baseElevation = -2 + index * this.params.elevationSpacing;
        });
    }

    resetAnimation() {
        // Reset all rings to flat position
        this.rings.forEach((ring) => {
            ring.position.z = 0;
        });

        // Reset rotation
        this.scene.rotation.y = 0;

        // Reset parameters to defaults
        this.params = {
            waveSpeed: 6,
            phaseOffset: 0.3,
            elevationSpacing: 0.5,
            waveAmplitude: 1.0,
            waveDirection: 'outward',
            waveFunction: 'sine',
            offScreenDistance: 5,
            rotationSpeed: 1.0,
            rotationAxis: 'x'
        };

        // Update UI
        document.getElementById('waveSpeed').value = 6;
        document.getElementById('waveSpeedValue').textContent = '6';
        document.getElementById('phaseOffset').value = 0.3;
        document.getElementById('phaseOffsetValue').textContent = '0.3';
        document.getElementById('elevationSpacing').value = 0.5;
        document.getElementById('elevationSpacingValue').textContent = '0.5';
        document.getElementById('waveAmplitude').value = 1.0;
        document.getElementById('waveAmplitudeValue').textContent = '1.0';
        document.getElementById('offScreenDistance').value = 5;
        document.getElementById('offScreenDistanceValue').textContent = '5';
        document.getElementById('cameraZ').value = 10;
        document.getElementById('cameraZValue').textContent = '10';
        document.getElementById('rotationSpeed').value = 1.0;
        document.getElementById('rotationSpeedValue').textContent = '1.0';
        document.getElementById('rotationAxis').value = 'x';
        document.getElementById('waveDirection').value = 'outward';
        document.getElementById('waveFunction').value = 'sine';

        // Reset camera and scene positions
        this.camera.position.z = 10;
        this.scene.rotation.x = 0;
        this.scene.rotation.y = 0;
        this.scene.rotation.z = 0;

        this.updateElevationSpacing();
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    dispose() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.renderer) {
            this.renderer.dispose();
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.waveAnimationPOC = new WaveAnimationPOC();
});