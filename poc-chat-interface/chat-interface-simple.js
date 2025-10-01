// Chat Interface POC - Final Version
class ChatInterfacePOC {
    constructor() {
        this.chatWrapper = document.getElementById('chatWrapper');
        this.chatInput = document.getElementById('chatInput');
        this.sendButton = document.getElementById('sendButton');
        this.typingAnimation = document.getElementById('typingAnimation');

        this.params = {
            integrationStyle: 'none' // Will be set in init
        };

        this.init();
        this.setupInputHandlers();
    }

    init() {
        console.log('🎨 Chat Interface POC initialized');

        // Set responsive integration style
        this.params.integrationStyle = this.getResponsiveIntegrationStyle();

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
            this.updateButtonState(hasValue ? 'active' : 'inactive');
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

        // Handle quick start button clicks
        document.addEventListener('click', (e) => {
            if (e.target.dataset.action) {
                this.handleQuickStartAction(e.target.dataset.action);
            }
        });
    }

    handleSend() {
        const message = this.chatInput.value.trim();
        if (!message) return;

        console.log('📤 Sending message:', message);

        // Simulate sending
        this.updateButtonState('loading');

        // Clear input
        this.chatInput.value = '';
        this.sendButton.classList.remove('active');

        // Show typing animation
        this.showTypingAnimation();

        // Simulate response after 2 seconds
        setTimeout(() => {
            this.hideTypingAnimation();
            this.updateButtonState('inactive');
            console.log('✅ Response received');
        }, 2000);
    }

    updateButtonState(state) {
        // Remove all state classes
        this.sendButton.classList.remove('active', 'loading');

        switch (state) {
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
            if (element) {
                element.classList.remove('active');
                if (id === 'dropdownContainer') {
                    element.style.display = 'none';
                }
            }
        });

        // Remove wrapper classes
        this.chatWrapper.classList.remove('tab-style-wrapper', 'expandable-container');

        // Show selected integration
        switch (this.params.integrationStyle) {
            case 'inline-pills':
                const inlinePills = document.getElementById('inlinePills');
                if (inlinePills) inlinePills.classList.add('active');
                break;

            case 'tab-style':
                const tabQuickStart = document.getElementById('tabQuickStart');
                if (tabQuickStart) tabQuickStart.classList.add('active');
                this.chatWrapper.classList.add('tab-style-wrapper');
                break;

            default:
                // None selected
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
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.chatPOC = new ChatInterfacePOC();

    console.log('🚀 Chat Interface POC Ready!');
    console.log('📱 Mobile: Tab Style | 🖥️ Desktop: Inline Pills');
});