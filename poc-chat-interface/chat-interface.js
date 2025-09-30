// Chat Interface POC - Interactive Testing Environment
class ChatInterfacePOC {
    constructor() {
        this.chatWrapper = document.getElementById('chatWrapper');
        this.chatInput = document.getElementById('chatInput');
        this.sendButton = document.getElementById('sendButton');
        this.typingAnimation = document.getElementById('typingAnimation');

        this.params = {
            blurIntensity: 0,
            shadowIntensity: 15,
            borderRadius: 24,
            backdropBlur: 20,
            animationType: 'none',
            buttonState: 'inactive'
        };

        this.init();
        this.setupControls();
        this.setupInputHandlers();
    }

    init() {
        console.log('🎨 Chat Interface POC initialized');
        this.updateStyles();
    }

    setupControls() {
        // Blur Intensity
        const blurSlider = document.getElementById('blurIntensity');
        const blurValue = document.getElementById('blurValue');
        blurSlider.addEventListener('input', (e) => {
            this.params.blurIntensity = parseFloat(e.target.value);
            blurValue.textContent = e.target.value;
            this.updateStyles();
        });

        // Shadow Intensity
        const shadowSlider = document.getElementById('shadowIntensity');
        const shadowValue = document.getElementById('shadowValue');
        shadowSlider.addEventListener('input', (e) => {
            this.params.shadowIntensity = parseFloat(e.target.value);
            shadowValue.textContent = e.target.value;
            this.updateStyles();
        });

        // Border Radius
        const radiusSlider = document.getElementById('borderRadius');
        const radiusValue = document.getElementById('radiusValue');
        radiusSlider.addEventListener('input', (e) => {
            this.params.borderRadius = parseFloat(e.target.value);
            radiusValue.textContent = e.target.value;
            this.updateStyles();
        });

        // Backdrop Blur
        const backdropSlider = document.getElementById('backdropBlur');
        const backdropValue = document.getElementById('backdropValue');
        backdropSlider.addEventListener('input', (e) => {
            this.params.backdropBlur = parseFloat(e.target.value);
            backdropValue.textContent = e.target.value;
            this.updateStyles();
        });

        // Animation Type
        const animationSelect = document.getElementById('animationType');
        animationSelect.addEventListener('change', (e) => {
            this.params.animationType = e.target.value;
            this.updateAnimations();
        });

        // Button State
        const buttonStateSelect = document.getElementById('buttonState');
        buttonStateSelect.addEventListener('change', (e) => {
            this.params.buttonState = e.target.value;
            this.updateButtonState();
        });
    }

    setupInputHandlers() {
        // Input focus/blur events
        this.chatInput.addEventListener('focus', () => {
            this.chatWrapper.classList.add('focused');
            console.log('💬 Input focused');
        });

        this.chatInput.addEventListener('blur', () => {
            this.chatWrapper.classList.remove('focused');
            console.log('💬 Input blurred');
        });

        // Input change events
        this.chatInput.addEventListener('input', (e) => {
            const hasValue = e.target.value.trim().length > 0;
            this.sendButton.classList.toggle('active', hasValue);

            if (hasValue) {
                this.params.buttonState = 'active';
                document.getElementById('buttonState').value = 'active';
            } else {
                this.params.buttonState = 'inactive';
                document.getElementById('buttonState').value = 'inactive';
            }
            this.updateButtonState();
        });

        // Send button click
        this.sendButton.addEventListener('click', () => {
            if (this.chatInput.value.trim()) {
                this.handleSend();
            }
        });

        // Enter key
        this.chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && this.chatInput.value.trim()) {
                this.handleSend();
            }
        });
    }

    handleSend() {
        const message = this.chatInput.value.trim();
        if (!message) return;

        console.log('📤 Sending message:', message);

        // Simulate sending
        this.params.buttonState = 'loading';
        document.getElementById('buttonState').value = 'loading';
        this.updateButtonState();

        // Clear input
        this.chatInput.value = '';
        this.sendButton.classList.remove('active');

        // Show typing animation
        this.showTypingAnimation();

        // Simulate response after 2 seconds
        setTimeout(() => {
            this.hideTypingAnimation();
            this.params.buttonState = 'inactive';
            document.getElementById('buttonState').value = 'inactive';
            this.updateButtonState();
            console.log('✅ Response received');
        }, 2000);
    }

    updateStyles() {
        const { blurIntensity, shadowIntensity, borderRadius, backdropBlur } = this.params;

        // Apply blur effect
        if (blurIntensity > 0) {
            this.chatWrapper.style.filter = `blur(${blurIntensity}px)`;
        } else {
            this.chatWrapper.style.filter = 'none';
        }

        // Apply border radius
        this.chatWrapper.style.borderRadius = `${borderRadius}px`;

        // Apply backdrop blur and shadow
        this.chatWrapper.style.backdropFilter = `blur(${backdropBlur}px) saturate(180%)`;
        this.chatWrapper.style.boxShadow = `
            0 8px ${shadowIntensity * 2}px rgba(0, 0, 0, 0.15),
            0 1px 0 rgba(255, 255, 255, 0.8) inset
        `;

        // Update hover shadow
        const hoverShadow = `
            0 ${shadowIntensity * 0.8}px ${shadowIntensity * 2.5}px rgba(0, 0, 0, 0.2),
            0 1px 0 rgba(255, 255, 255, 0.9) inset
        `;

        // Create/update dynamic style element
        let styleElement = document.getElementById('dynamic-styles');
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = 'dynamic-styles';
            document.head.appendChild(styleElement);
        }

        styleElement.textContent = `
            .chat-input-wrapper:hover {
                box-shadow: ${hoverShadow} !important;
            }
            .chat-input-wrapper:focus-within {
                box-shadow:
                    0 ${shadowIntensity}px ${shadowIntensity * 3}px rgba(0, 0, 0, 0.25),
                    0 1px 0 rgba(255, 255, 255, 1) inset,
                    0 0 0 3px rgba(188, 48, 44, 0.1) !important;
            }
        `;
    }

    updateAnimations() {
        // Remove all animation classes
        this.chatWrapper.classList.remove('glow-effect', 'pulse-animation', 'floating-animation');
        this.typingAnimation.classList.remove('active');

        // Apply selected animation
        switch (this.params.animationType) {
            case 'glow':
                this.chatWrapper.classList.add('glow-effect');
                setTimeout(() => {
                    this.chatWrapper.classList.add('active');
                }, 100);
                break;

            case 'pulse':
                this.chatWrapper.classList.add('pulse-animation');
                break;

            case 'float':
                this.chatWrapper.classList.add('floating-animation');
                break;

            case 'typing':
                this.showTypingAnimation();
                break;

            case 'none':
            default:
                // Remove active states
                this.chatWrapper.classList.remove('active');
                break;
        }
    }

    updateButtonState() {
        const { buttonState } = this.params;

        // Remove all state classes
        this.sendButton.classList.remove('active', 'loading');

        switch (buttonState) {
            case 'active':
                this.sendButton.classList.add('active');
                this.sendButton.style.background = '#BC302C';
                this.sendButton.style.color = 'white';
                break;

            case 'loading':
                this.sendButton.classList.add('loading');
                this.sendButton.style.background = '#BC302C';
                this.sendButton.style.color = 'white';
                break;

            case 'inactive':
            default:
                this.sendButton.style.background = '#e5e7eb';
                this.sendButton.style.color = '#9ca3af';
                break;
        }
    }

    showTypingAnimation() {
        this.typingAnimation.classList.add('active');
    }

    hideTypingAnimation() {
        this.typingAnimation.classList.remove('active');
    }

    // Demo functions for testing
    simulateTyping() {
        const messages = [
            "How can we help?",
            "What's working elsewhere that you're considering?",
            "Tell us about your biggest challenge",
            "What would success look like for you?"
        ];

        const randomMessage = messages[Math.floor(Math.random() * messages.length)];

        this.chatInput.value = '';
        this.chatInput.focus();

        // Simulate typing
        let i = 0;
        const typeInterval = setInterval(() => {
            if (i < randomMessage.length) {
                this.chatInput.value += randomMessage[i];
                this.chatInput.dispatchEvent(new Event('input'));
                i++;
            } else {
                clearInterval(typeInterval);
            }
        }, 80);
    }

    reset() {
        // Reset all parameters
        this.params = {
            blurIntensity: 0,
            shadowIntensity: 15,
            borderRadius: 24,
            backdropBlur: 20,
            animationType: 'none',
            buttonState: 'inactive'
        };

        // Reset UI
        document.getElementById('blurIntensity').value = 0;
        document.getElementById('blurValue').textContent = '0';
        document.getElementById('shadowIntensity').value = 15;
        document.getElementById('shadowValue').textContent = '15';
        document.getElementById('borderRadius').value = 24;
        document.getElementById('radiusValue').textContent = '24';
        document.getElementById('backdropBlur').value = 20;
        document.getElementById('backdropValue').textContent = '20';
        document.getElementById('animationType').value = 'none';
        document.getElementById('buttonState').value = 'inactive';

        this.chatInput.value = '';
        this.updateStyles();
        this.updateAnimations();
        this.updateButtonState();

        console.log('🔄 Interface reset to defaults');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.chatPOC = new ChatInterfacePOC();

    // Add keyboard shortcuts for testing
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 't':
                    e.preventDefault();
                    window.chatPOC.simulateTyping();
                    break;
                case 'r':
                    e.preventDefault();
                    window.chatPOC.reset();
                    break;
            }
        }
    });

    console.log('🚀 Chat Interface POC Ready!');
    console.log('💡 Keyboard shortcuts:');
    console.log('   Ctrl/Cmd + T: Simulate typing');
    console.log('   Ctrl/Cmd + R: Reset interface');
});