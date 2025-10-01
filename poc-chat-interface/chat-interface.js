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
            borderRadius: 5,
            backdropBlur: 20,
            animationType: 'none',
            buttonState: 'inactive',
            integrationStyle: this.getResponsiveIntegrationStyle()
        };

        this.init();
        this.setupInputHandlers();
    }

    init() {
        console.log('🎨 Chat Interface POC initialized');
        this.updateStyles();
        this.updateIntegrationStyle();

        // Handle window resize for responsive integration
        window.addEventListener('resize', () => {
            const newStyle = this.getResponsiveIntegrationStyle();
            if (newStyle !== this.params.integrationStyle) {
                this.params.integrationStyle = newStyle;
                this.updateIntegrationStyle();
            }
        });
    }

    getResponsiveIntegrationStyle() {
        return window.innerWidth <= 768 ? 'tab-style' : 'inline-pills';
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

        // Integration Style
        const integrationSelect = document.getElementById('integrationStyle');
        integrationSelect.addEventListener('change', (e) => {
            this.params.integrationStyle = e.target.value;
            this.updateIntegrationStyle();
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

        // Dropdown functionality
        const dropdownTrigger = document.getElementById('dropdownTrigger');
        const dropdownMenu = document.getElementById('dropdownMenu');

        if (dropdownTrigger && dropdownMenu) {
            dropdownTrigger.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdownMenu.classList.toggle('active');
                console.log('📋 Dropdown toggled:', dropdownMenu.classList.contains('active'));
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!dropdownTrigger.contains(e.target) && !dropdownMenu.contains(e.target)) {
                    dropdownMenu.classList.remove('active');
                }
            });
        }

        // Handle quick start button clicks
        document.addEventListener('click', (e) => {
            if (e.target.dataset.action) {
                this.handleQuickStartAction(e.target.dataset.action);
                dropdownMenu.classList.remove('active');
            }
        });

        // Expand on focus functionality
        this.chatInput.addEventListener('focus', () => {
            if (this.params.integrationStyle === 'expand-on-focus') {
                this.chatWrapper.classList.add('expanded');
                const expandElement = document.getElementById('expandQuickStart');
                if (expandElement) {
                    expandElement.classList.add('active');
                    console.log('✨ Expand on focus activated');
                }
            }
        });

        this.chatInput.addEventListener('blur', (e) => {
            if (this.params.integrationStyle === 'expand-on-focus') {
                // Check if the blur is not because of clicking on expand buttons
                const expandElement = document.getElementById('expandQuickStart');
                if (expandElement && !expandElement.contains(e.relatedTarget)) {
                    setTimeout(() => {
                        this.chatWrapper.classList.remove('expanded');
                        expandElement.classList.remove('active');
                        console.log('✨ Expand on focus deactivated');
                    }, 150);
                }
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

    updateIntegrationStyle() {
        // Hide all integration elements
        const elements = [
            'inlinePills',
            'floatingQuickStart',
            'sidebarQuickStart',
            'expandQuickStart',
            'dropdownContainer',
            'tabQuickStart'
        ];

        elements.forEach(id => {
            const element = document.getElementById(id);
            element.classList.remove('active');
            if (id === 'dropdownContainer') {
                element.style.display = 'none'; // Hide dropdown by default
            }
        });

        // Remove wrapper classes
        this.chatWrapper.classList.remove('tab-style-wrapper', 'expandable-container');

        // Show selected integration
        switch (this.params.integrationStyle) {
            case 'inline-pills':
                document.getElementById('inlinePills').classList.add('active');
                break;

            case 'floating-above':
                document.getElementById('floatingQuickStart').classList.add('active');
                break;

            case 'sidebar-left':
                document.getElementById('sidebarQuickStart').classList.add('active');
                break;

            case 'expand-on-focus':
                this.chatWrapper.classList.add('expandable-container');
                // Will be activated on focus
                break;

            case 'dropdown-menu':
                const dropdownContainer = document.getElementById('dropdownContainer');
                dropdownContainer.style.display = 'block';
                dropdownContainer.classList.add('active');
                break;

            case 'tab-style':
                document.getElementById('tabQuickStart').classList.add('active');
                this.chatWrapper.classList.add('tab-style-wrapper');
                break;

            case 'none':
            default:
                // All hidden by default
                break;
        }

        console.log('🎨 Integration style updated:', this.params.integrationStyle);
    }

    handleQuickStartAction(action) {
        console.log('🚀 Quick start action:', action);

        // Simulate the action with visual feedback
        const messages = {
            'team': 'Foundation: Strategic Approach & Team Expertise',
            'whatwedo': 'While competitors use generic ChatGPT, we give you something different...'
        };

        // Set input value and trigger send
        this.chatInput.value = messages[action] || `Quick start: ${action}`;
        this.chatInput.dispatchEvent(new Event('input'));

        // Auto-send after a brief delay
        setTimeout(() => {
            this.handleSend();
        }, 500);
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
            buttonState: 'inactive',
            integrationStyle: 'none'
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
        document.getElementById('integrationStyle').value = 'none';

        this.chatInput.value = '';
        this.updateStyles();
        this.updateAnimations();
        this.updateButtonState();
        this.updateIntegrationStyle();

        console.log('🔄 Interface reset to defaults');
    }

    setupControlToggle() {
        const controlsToggle = document.getElementById('controlsToggle');
        const controls = document.getElementById('controls');

        controlsToggle.addEventListener('click', () => {
            controls.classList.toggle('collapsed');
            console.log('🎛️ Controls toggled');
        });

        // Auto-collapse on mobile initially
        if (window.innerWidth <= 768) {
            controls.classList.add('collapsed');
        }

        // Handle resize events
        window.addEventListener('resize', () => {
            if (window.innerWidth <= 768 && !controls.classList.contains('collapsed')) {
                controls.classList.add('collapsed');
            }
        });
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