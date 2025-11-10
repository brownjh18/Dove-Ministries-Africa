// Floating Devotion Widget
class DevotionWidget {
    constructor() {
        this.container = null;
        this.isCollapsed = false;
        this.devotions = [];
        this.currentDevotionIndex = 0;

        // Check if mobile and set initial collapsed state
        const isMobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (isMobile) {
            this.isCollapsed = true;
        }

        this.init();
    }

    init() {
        this.createWidget();
        this.loadCollapsedState(); // Load saved state first
        this.loadDevotions();
        this.setupEventListeners();
        this.startAutoRotate();
        this.checkMobileAndMinimize();
    }

    createWidget() {
        // Create the floating container
        this.container = document.createElement('div');
        this.container.className = 'floating-devotion';
        this.container.innerHTML = `
            <div class="devotion-header">
                <h3>Latest Devotion</h3>
                <button class="devotion-toggle" id="devotion-toggle">−</button>
            </div>
            <div class="devotion-content">
                <div class="devotion-loading">
                    <div>Loading latest devotion...</div>
                </div>
            </div>
            <div class="devotion-footer">
                <a href="https://whatsapp.com/channel/0029VbBnc5fAInPmFKe8Qi3P" target="_blank" class="devotion-link">
                    <i class="fab fa-whatsapp"></i>
                    Follow on WhatsApp
                </a>
            </div>
        `;

        document.body.appendChild(this.container);
    }

    async loadDevotions() {
        try {
            // Try to fetch latest devotions from WhatsApp channel
            const channelData = await this.fetchWhatsAppChannel();
            if (channelData && channelData.length > 0) {
                this.devotions = channelData;
            } else {
                // Fallback to sample devotions if WhatsApp fetch fails
                this.devotions = await this.getSampleDevotions();
            }
            this.displayDevotion();
        } catch (error) {
            console.error('Error loading devotions:', error);
            // Fallback to sample devotions on error
            this.devotions = await this.getSampleDevotions();
            this.displayDevotion();
        }
    }

    async fetchWhatsAppChannel() {
        try {
            // Fetch from local devotions.json file that can be updated by webhook
            const response = await fetch('/devotions.json', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch devotions: ${response.status}`);
            }

            const data = await response.json();

            if (data.devotions && data.devotions.length > 0) {
                // Parse the latest devotion from the JSON data
                const latestDevotion = data.devotions[0];
                return [this.parseWhatsAppMessage({ text: latestDevotion.message })];
            }

            return null;
        } catch (error) {
            console.warn('Could not fetch from devotions.json:', error);
            return null;
        }
    }

    parseWhatsAppMessage(message) {
        // Parse WhatsApp message into devotion format
        const text = message.text || message.body || '';

        // Try to extract components from the message
        const lines = text.trim().split('\n');
        let date = '', greeting = '', verse = '', textContent = '', closing = '';

        // Extract date (first line)
        if (lines[0] && /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(lines[0].trim())) {
            date = lines[0].trim();
            lines.shift();
        }

        // Extract greeting
        if (lines[0] && lines[0].toLowerCase().includes('good morning')) {
            greeting = lines[0].trim().replace(',', '');
            lines.shift();
        }

        // Find verse (usually contains Bible reference)
        const verseIndex = lines.findIndex(line =>
            line.includes('Proverbs') || line.includes('Psalm') ||
            line.includes('John') || line.includes('Matthew') ||
            line.includes('Romans') || line.includes('Ephesians') ||
            line.includes('Philippians') || line.includes('Colossians') ||
            line.includes('Timothy') || line.includes('Peter') ||
            line.includes('James') || line.includes('Hebrews') ||
            line.includes('Revelation')
        );

        if (verseIndex !== -1) {
            verse = lines[verseIndex].trim();
            lines.splice(verseIndex, 1);
        }

        // Find closing (usually ends with TY....... or similar)
        const closingIndex = lines.findIndex(line =>
            line.includes('TY.......') || line.includes('Have a blessed day')
        );

        if (closingIndex !== -1) {
            closing = lines.slice(closingIndex).join(' ').trim();
            lines.splice(closingIndex);
        }

        // The remaining text is the main message
        textContent = lines.join(' ').trim();

        return {
            date: date || new Date().toLocaleDateString('en-US'),
            title: "Daily Devotion",
            text: textContent,
            verse: verse,
            greeting: greeting || "Good morning",
            closing: closing || "Have a blessed day and may God bless you. TY......."
        };
    }

    async getSampleDevotions() {
        // Fallback sample devotions when WhatsApp API is not available
        return [
            {
                date: "7/11/2025",
                title: "Hard Work and God's Blessing",
                text: "Hard work is the key to success but remember, it is God who blesses hard work. Hard work without God is in vain. The Apostle Peter learned that the hard way in the scripture of John 21:1-7. God is the one who blesses our hard work. When we are lazy and hate hard work, our work will constantly be admiring what others have. It is time to stop admiring, it is time to arise and work hard, trusting God to surprise us and bless us. As long as we call upon Him as we work hard, He will not fail us. Our hard work is not what brings about success but it is God. As long as we trust in Him. As you go out to work today. Speak to God first and see what He does.",
                verse: "Proverbs 13:4  The soul of the sluggard desireth, and hath nothing: but the soul of the diligent shall be made fat.",
                greeting: "Good morning",
                closing: "Have a blessed day and may God bless you. TY......."
            }
        ];
    }

    displayDevotion() {
        if (this.devotions.length === 0) return;

        // Always show the latest (first) devotion
        const devotion = this.devotions[0];
        const content = this.container.querySelector('.devotion-content');

        // Create share URL and text
        const shareText = encodeURIComponent(`Daily Devotion: ${devotion.title}\n\n${devotion.verse}\n\n${devotion.text}\n\n- Dove Ministries Africa`);
        const shareUrl = encodeURIComponent(window.location.href);
        const fullShareText = encodeURIComponent(`Check out this daily devotion from Dove Ministries Africa:\n\n"${devotion.verse}"\n\n${devotion.text}\n\nRead more at: ${window.location.href}`);

        content.innerHTML = `
            <div class="devotion-item">
                <div class="devotion-date">${devotion.date}</div>
                <div class="devotion-greeting">${devotion.greeting},</div>
                <div class="devotion-verse" style="margin-bottom: 16px; font-weight: 600;">${devotion.verse}</div>
                <div class="devotion-title" style="font-weight: 600; margin-bottom: 12px;">LESSON IDEA:</div>
                <div class="devotion-text">${devotion.text}</div>
                <div class="devotion-closing" style="margin-top: 16px; font-style: italic; color: #555;">${devotion.closing}</div>

                <!-- Share Buttons -->
                <div class="devotion-share" style="margin-top: 20px; padding-top: 16px; border-top: 1px solid rgba(0,0,0,0.1);">
                    <div style="font-size: 14px; font-weight: 600; color: #333; margin-bottom: 12px;">Share this devotion:</div>
                    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                        <a href="https://wa.me/?text=${fullShareText}" target="_blank" class="share-btn whatsapp" title="Share on WhatsApp">
                            <i class="fab fa-whatsapp"></i>
                        </a>
                        <a href="https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${shareText}" target="_blank" class="share-btn facebook" title="Share on Facebook">
                            <i class="fab fa-facebook-f"></i>
                        </a>
                        <a href="https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}" target="_blank" class="share-btn twitter" title="Share on Twitter">
                            <i class="fab fa-twitter"></i>
                        </a>
                        <a href="https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}" target="_blank" class="share-btn linkedin" title="Share on LinkedIn">
                            <i class="fab fa-linkedin-in"></i>
                        </a>
                        <button onclick="copyToClipboard('${devotion.verse}\n\n${devotion.text}\n\n- Dove Ministries Africa')" class="share-btn copy" title="Copy to clipboard">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    showError() {
        const content = this.container.querySelector('.devotion-content');
        content.innerHTML = `
            <div class="devotion-error">
                <div>Unable to load devotion</div>
                <div style="font-size: 12px; margin-top: 8px;">Please check your connection</div>
            </div>
        `;
    }

    setupEventListeners() {
        // Toggle collapse/expand
        const toggleBtn = this.container.querySelector('#devotion-toggle');
        toggleBtn.addEventListener('click', () => {
            this.toggleWidget();
        });

        // Click on collapsed widget to expand
        this.container.addEventListener('click', (e) => {
            if (this.isCollapsed && !e.target.closest('.devotion-toggle')) {
                this.expandWidget();
            }
        });
    }

    toggleWidget() {
        if (this.isCollapsed) {
            this.expandWidget();
        } else {
            this.collapseWidget();
        }
    }

    collapseWidget() {
        this.container.classList.add('collapsed');
        this.isCollapsed = true;
        const toggleBtn = this.container.querySelector('#devotion-toggle');
        toggleBtn.textContent = '+';
        this.saveCollapsedState();
    }

    expandWidget() {
        this.container.classList.remove('collapsed');
        this.isCollapsed = false;
        const toggleBtn = this.container.querySelector('#devotion-toggle');
        toggleBtn.textContent = '−';
        this.saveCollapsedState();
    }

    startAutoRotate() {
        // Since we now show only the latest devotion, no rotation is needed
        // The widget will always show the most recent devotion from the WhatsApp channel
        return;
    }

    // Method to manually update devotions (could be called from external API)
    updateDevotions(newDevotions) {
        // Since we only show the latest devotion, take the first one from the array
        if (newDevotions && newDevotions.length > 0) {
            this.devotions = [newDevotions[0]];
            this.currentDevotionIndex = 0;
            this.displayDevotion();
        }
    }

    // Method to add a new devotion from WhatsApp channel
    addNewDevotion(whatsappMessage) {
        try {
            const newDevotion = this.parseWhatsAppMessage({ text: whatsappMessage });

            // Replace the current devotion with the new one (since we only show the latest)
            this.devotions = [newDevotion];
            this.currentDevotionIndex = 0;
            this.displayDevotion();

            console.log('Latest devotion updated from WhatsApp:', newDevotion);
            return true;
        } catch (error) {
            console.error('Error parsing WhatsApp message:', error);
            return false;
        }
    }

    // Method to manually refresh devotions from WhatsApp
    async refreshFromWhatsApp() {
        try {
            const channelData = await this.fetchWhatsAppChannel();
            if (channelData && channelData.length > 0) {
                this.devotions = channelData;
                this.displayDevotion();
                console.log('Devotions refreshed from WhatsApp channel');
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error refreshing from WhatsApp:', error);
            return false;
        }
    }

    // Copy to clipboard function
    copyToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                // Show success feedback
                this.showCopyFeedback('Copied to clipboard!');
            }).catch(() => {
                this.fallbackCopyTextToClipboard(text);
            });
        } else {
            this.fallbackCopyTextToClipboard(text);
        }
    }

    fallbackCopyTextToClipboard(text) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand('copy');
            this.showCopyFeedback('Copied to clipboard!');
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
            this.showCopyFeedback('Failed to copy');
        }

        textArea.remove();
    }

    showCopyFeedback(message) {
        // Create a temporary feedback element
        const feedback = document.createElement('div');
        feedback.textContent = message;
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 10000;
            pointer-events: none;
            animation: fadeInOut 2s ease-in-out;
        `;

        // Add fade animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translate(-50%, -50%) translateY(10px); }
                10%, 90% { opacity: 1; transform: translate(-50%, -50%) translateY(0); }
                100% { opacity: 0; transform: translate(-50%, -50%) translateY(-10px); }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(feedback);

        setTimeout(() => {
            feedback.remove();
            style.remove();
        }, 2000);
    }

    checkMobileAndMinimize() {
        // Check if device is mobile/tablet
        const isMobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        if (isMobile && !this.isCollapsed) {
            // Delay minimization slightly to ensure widget is fully loaded
            setTimeout(() => {
                this.collapseWidget();
            }, 1000);
        }
    }

    // Method to persist collapsed state in localStorage
    saveCollapsedState() {
        localStorage.setItem('devotionWidgetCollapsed', this.isCollapsed);
    }

    // Method to load collapsed state from localStorage
    loadCollapsedState() {
        const savedState = localStorage.getItem('devotionWidgetCollapsed');
        if (savedState !== null) {
            this.isCollapsed = JSON.parse(savedState);
            if (this.isCollapsed) {
                this.collapseWidget();
            } else {
                this.expandWidget();
            }
        }
    }
}

// Initialize the widget when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DevotionWidget();
});

// Export for potential external use
window.DevotionWidget = DevotionWidget;