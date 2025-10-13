class MessageGeneratorUI {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            throw new Error(`Container with id '${containerId}' not found`);
        }

        this.core = new MessageGeneratorCore();
        this.options = {
            showAnalytics: true,
            showHistory: true,
            maxHistoryItems: 10,
            enableAutoSave: true,
            ...options
        };

        this.state = {
            currentMessage: null,
            history: this.loadHistory(),
            analytics: this.loadAnalytics()
        };

        this.init();
    }

    init() {
        this.createHTML();
        this.bindEvents();
        this.updateAnalytics();
        this.renderHistory();
        this.setupAutoSave();
    }

    createHTML() {
        this.container.innerHTML = `
            <div class="msg-generator">
                <div class="msg-gen-header">
                    <h2>AI Message Generator</h2>
                    <p>Generate personalized messages for any occasion with intelligent templates</p>
                    <div class="msg-gen-stats">
                        <div class="stat">
                            <strong id="total-generated">0</strong>
                            <span>Generated</span>
                        </div>
                        <div class="stat">
                            <strong id="total-categories">${this.core.getCategories().length}</strong>
                            <span>Categories</span>
                        </div>
                        <div class="stat">
                            <strong id="total-templates">${this.core.getStats().totalTemplates}</strong>
                            <span>Templates</span>
                        </div>
                    </div>
                    <button id="nightModeToggle" class="btn btn-outline" style="position:absolute;top:18px;right:18px;z-index:2;">
                        🌙 Night Mode
                    </button>
                </div>

                <!-- Input Section -->
                <div class="msg-gen-input-section">
                    <div class="input-group">
                        <label for="user-prompt">Describe the message you want to generate:</label>
                        <div class="input-wrapper">
                            <textarea 
                                id="user-prompt" 
                                placeholder="e.g., I want to send Diwali wishes to my customers"
                                rows="3"
                                maxlength="500"
                                aria-label="Message description"
                            ></textarea>
                            <div class="char-counter">
                                <span id="char-count">0</span> / 500 characters
                            </div>
                        </div>
                    </div>
                    
                    <div class="input-actions">
                        <button id="generate-btn" class="btn btn-primary">
                            🚀 Generate Message
                        </button>
                        <button id="clear-btn" class="btn btn-secondary">
                            🗑️ Clear
                        </button>
                        <button id="settings-btn" class="btn btn-outline">
                            ⚙️ Settings
                        </button>
                    </div>

                    <div class="quick-prompts">
                        <p>Quick examples:</p>
                        <div class="prompt-tags">
                            <span class="prompt-tag" data-prompt="I want to send Diwali wishes to my customers">Diwali Greetings</span>
                            <span class="prompt-tag" data-prompt="Christmas message for clients">Christmas Wishes</span>
                            <span class="prompt-tag" data-prompt="New Year message for team">New Year Message</span>
                            <span class="prompt-tag" data-prompt="Birthday wishes for employee">Birthday Wishes</span>
                            <span class="prompt-tag" data-prompt="Thank you message for customers">Thank You Note</span>
                            <span class="prompt-tag" data-prompt="Congratulations message for achievement">Congratulations</span>
                        </div>
                    </div>
                </div>

                <!-- Result Section -->
                <div id="result-section" class="msg-gen-result-section" style="display: none;">
                    <div id="loading-spinner" class="loading-spinner" style="display: none;">
                        <div class="spinner"></div>
                        <p>Generating your message...</p>
                    </div>
                    <div id="result-content" class="result-content"></div>
                </div>

                ${this.options.showHistory ? `
                <!-- History Section -->
                <div class="msg-gen-history-section">
                    <h3>📚 Message History</h3>
                    <div id="history-list" class="history-list">
                        <div class="empty-state">No messages generated yet. Start by entering a prompt above!</div>
                    </div>
                </div>
                ` : ''}

                ${this.options.showAnalytics ? `
                <!-- Analytics Section -->
                <div class="msg-gen-analytics-section">
                    <h3>📊 Analytics</h3>
                    <div class="analytics-grid">
                        <div class="analytics-card">
                            <div class="analytics-number" id="analytics-total">0</div>
                            <div class="analytics-label">Total Generated</div>
                        </div>
                        <div class="analytics-card">
                            <div class="analytics-number" id="analytics-today">0</div>
                            <div class="analytics-label">Today</div>
                        </div>
                        <div class="analytics-card">
                            <div class="analytics-number" id="analytics-categories">0</div>
                            <div class="analytics-label">Categories Used</div>
                        </div>
                        <div class="analytics-card">
                            <div class="analytics-number" id="analytics-avg-confidence">0%</div>
                            <div class="analytics-label">Avg Confidence</div>
                        </div>
                    </div>
                </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * Bind event listeners to UI elements
     * Sets up all interactive functionality including buttons, keyboard shortcuts, and input handlers
     */
    bindEvents() {
        document.getElementById('generate-btn').addEventListener('click', () => {
            this.generateMessage();
        });
        document.getElementById('clear-btn').addEventListener('click', () => {
            this.clearInput();
        });
        document.getElementById('settings-btn').addEventListener('click', () => {
            this.showSettings();
        });
        
        const promptInput = document.getElementById('user-prompt');
        const charCount = document.getElementById('char-count');
        
        // Character counter
        promptInput.addEventListener('input', () => {
            const length = promptInput.value.length;
            charCount.textContent = length;
            
            // Visual feedback for character limit
            if (length > 450) {
                charCount.style.color = '#ef4444'; // Red warning
            } else if (length > 400) {
                charCount.style.color = '#f59e0b'; // Orange warning
            } else {
                charCount.style.color = ''; // Default
            }
        });
        
        // Keyboard shortcut: Ctrl+Enter to generate
        promptInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                this.generateMessage();
            }
        });
        
        // Quick prompt tags
        document.querySelectorAll('.prompt-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                const prompt = tag.getAttribute('data-prompt');
                promptInput.value = prompt;
                // Update character count
                charCount.textContent = prompt.length;
                this.generateMessage();
            });
        });
        
        // Night mode toggle
        document.getElementById('nightModeToggle').addEventListener('click', () => {
            document.body.classList.toggle('night-mode');
            this.container.classList.toggle('night-mode');
            const button = document.getElementById('nightModeToggle');
            button.textContent = document.body.classList.contains('night-mode') ? '☀️ Day Mode' : '🌙 Night Mode';
        });
    }

    /**
     * Generate a message from user input with enhanced validation
     * Validates input, generates message, displays results, and updates history
     * @async
     */
    async generateMessage() {
        const promptInput = document.getElementById('user-prompt');
        const prompt = promptInput.value.trim();

        // Enhanced input validation
        if (!prompt) {
            this.showError('Please enter a message description');
            promptInput.focus();
            return;
        }

        if (prompt.length < 5) {
            this.showError('Please enter a more detailed description (at least 5 characters)');
            promptInput.focus();
            return;
        }

        if (prompt.length > 500) {
            this.showError('Description is too long. Please keep it under 500 characters');
            return;
        }

        try {
            this.showLoading(true);
            
            // Simulate AI processing delay
            await this.delay(1000);
            
            const result = this.core.generateMessage(prompt);
            
            // Check for generation errors
            if (result.error) {
                this.showError('Generation issue: ' + result.error);
            }
            
            this.state.currentMessage = result;
            
            this.displayResult(result, prompt);
            this.addToHistory(prompt, result);
            this.updateAnalytics();
            
        } catch (error) {
            console.error('Error in generateMessage:', error);
            this.showError('Failed to generate message: ' + error.message);
        } finally {
            this.showLoading(false);
        }
    }

    displayResult(result, originalPrompt) {
        const resultContent = document.getElementById('result-content');
        const resultSection = document.getElementById('result-section');
        
        const confidenceClass = result.confidence >= 0.8 ? 'high' : 
                               result.confidence >= 0.6 ? 'medium' : 'low';
        
        resultContent.innerHTML = `
            <!-- Generated Message -->
            <div class="generated-message">
                <div class="message-header">
                    <h3>Generated Message</h3>
                    <span class="confidence-badge ${confidenceClass}">
                        ${Math.round(result.confidence * 100)}% Match
                    </span>
                </div>
                
                <div class="message-text">${result.message}</div>
                
                <div class="message-actions">
                    <button class="btn btn-success" onclick="window.messageGeneratorInstance.copyToClipboard('${result.message.replace(/'/g, "\\'")}')">
                        📋 Copy Message
                    </button>
                    <button class="btn btn-info" onclick="window.messageGeneratorInstance.showCustomization()">
                        ✏️ Customize
                    </button>
                    <button class="btn btn-secondary" onclick="window.messageGeneratorInstance.regenerateMessage()">
                        🔄 Regenerate
                    </button>
                </div>
            </div>

            <!-- Customization Section -->
            <div id="customization-section" class="customization-section" style="display: none;">
                <h3>Customize Your Message</h3>
                <div id="placeholder-inputs" class="placeholder-inputs">
                    ${this.createPlaceholderInputs(result.placeholders)}
                </div>
                <div class="final-message" id="final-message" style="display: none;">
                    <h4>Final Message</h4>
                    <div id="customized-text" class="customized-text"></div>
                    <div class="final-actions">
                        <button class="btn btn-success" onclick="window.messageGeneratorInstance.copyCustomizedMessage()">
                            📋 Copy Final Message
                        </button>
                        <button class="btn btn-info" onclick="window.messageGeneratorInstance.downloadMessage()">
                            💾 Download
                        </button>
                    </div>
                </div>
            </div>

            <!-- Alternatives -->
            ${result.alternatives && result.alternatives.length > 0 ? `
            <div class="alternatives-section">
                <h3>Alternative Messages</h3>
                <div class="alternatives-grid">
                    ${result.alternatives.map((alt, index) => `
                        <div class="alternative-item">
                            <div class="alternative-text">${alt}</div>
                            <button class="btn btn-sm btn-outline" onclick="window.messageGeneratorInstance.useAlternative(${index})">
                                Use This
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}

            <!-- Suggestions -->
            ${result.suggestions && result.suggestions.length > 0 ? `
            <div class="suggestions-section">
                <h3>Suggestions</h3>
                <div class="suggestions-list">
                    ${result.suggestions.map(suggestion => `
                        <div class="suggestion-item">
                            <span class="suggestion-icon">💡</span>
                            <span class="suggestion-text">${suggestion}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}
        `;

        resultSection.style.display = 'block';
        resultSection.scrollIntoView({ behavior: 'smooth' });
    }

    createPlaceholderInputs(placeholders) {
        if (!placeholders || placeholders.length === 0) {
            return '<div class="no-placeholders">No customizable fields in this message</div>';
        }

        return placeholders.map(placeholder => `
            <div class="placeholder-input-group">
                <label for="placeholder-${placeholder}">${this.formatPlaceholderLabel(placeholder)}:</label>
                <input 
                    type="text" 
                    id="placeholder-${placeholder}" 
                    placeholder="Enter ${placeholder}" 
                    oninput="window.messageGeneratorInstance.updateCustomizedMessage()"
                />
            </div>
        `).join('');
    }

    formatPlaceholderLabel(placeholder) {
        return placeholder.charAt(0).toUpperCase() + placeholder.slice(1).replace(/([A-Z])/g, ' $1');
    }

    showCustomization() {
        const section = document.getElementById('customization-section');
        if (!section) return;
        section.style.display = section.style.display === 'none' || section.style.display === '' ? 'block' : 'none';
        if (section.style.display === 'block') {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }

    updateCustomizedMessage() {
        if (!this.state.currentMessage) return;

        let customizedText = this.state.currentMessage.message;
        const placeholders = this.state.currentMessage.placeholders || [];

        placeholders.forEach(placeholder => {
            const input = document.getElementById(`placeholder-${placeholder}`);
            if (input && input.value.trim()) {
                const regex = new RegExp(`\\{${placeholder}\\}`, 'gi');
                customizedText = customizedText.replace(regex, input.value.trim());
            }
        });

        const finalMessage = document.getElementById('final-message');
        const customizedTextEl = document.getElementById('customized-text');
        
        if (customizedTextEl) {
            customizedTextEl.textContent = customizedText;
            finalMessage.style.display = 'block';
        }
    }

    copyToClipboard(text) {
        if (typeof copyToClipboard === 'function') {
            copyToClipboard(text);
        } else {
            navigator.clipboard.writeText(text).then(() => {
                this.showSuccess('Message copied to clipboard!');
            }).catch(() => {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                this.showSuccess('Message copied to clipboard!');
            });
        }
    }

    copyCustomizedMessage() {
        const customizedText = document.getElementById('customized-text');
        if (customizedText) {
            this.copyToClipboard(customizedText.textContent);
        }
    }

    downloadMessage() {
        const customizedText = document.getElementById('customized-text');
        const text = customizedText ? customizedText.textContent : this.state.currentMessage?.message || '';
        
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `message_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showSuccess('Message downloaded successfully!');
    }

    useAlternative(index) {
        if (this.state.currentMessage?.alternatives?.[index]) {
            const alternative = this.state.currentMessage.alternatives[index];
            this.state.currentMessage.message = alternative;
            
            // Update the displayed message
            const messageText = document.querySelector('.message-text');
            if (messageText) {
                messageText.textContent = alternative;
            }
            
            this.showSuccess('Alternative message selected!');
        }
    }

    regenerateMessage() {
        const prompt = document.getElementById('user-prompt').value.trim();
        if (prompt) {
            this.generateMessage();
        }
    }

    showSettings() {
        if (typeof showModal === 'function') {
            showModal('settingsModal');
        }
    }

    clearInput() {
        document.getElementById('user-prompt').value = '';
        document.getElementById('result-section').style.display = 'none';
    }

    showLoading(show) {
        const spinner = document.getElementById('loading-spinner');
        const resultSection = document.getElementById('result-section');
        
        if (show) {
            spinner.style.display = 'block';
            resultSection.style.display = 'block';
            resultSection.scrollIntoView({ behavior: 'smooth' });
        } else {
            spinner.style.display = 'none';
        }
    }

    showError(message) {
        if (typeof showNotification === 'function') {
            showNotification(message, 'error');
        } else {
            alert('Error: ' + message);
        }
    }

    showSuccess(message) {
        if (typeof showNotification === 'function') {
            showNotification(message, 'success');
        } else {
            console.log('Success: ' + message);
        }
    }

    addToHistory(prompt, result) {
        if (!this.options.enableAutoSave) return;

        const historyItem = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            prompt: prompt,
            message: result.message,
            category: result.category,
            confidence: result.confidence
        };

        this.state.history.unshift(historyItem);
        
        // Keep only the latest items
        if (this.state.history.length > this.options.maxHistoryItems) {
            this.state.history = this.state.history.slice(0, this.options.maxHistoryItems);
        }

        this.saveHistory();
        this.renderHistory();
    }

    clearHistory() {
        this.state.history = [];
        this.saveHistory();
        this.renderHistory();
        this.updateAnalytics();
    }

    renderHistory() {
        const historyList = document.getElementById('history-list');
        if (!historyList) return;

        if (this.state.history.length === 0) {
            historyList.innerHTML = '<div class="empty-state">No messages generated yet. Start by entering a prompt above!</div>';
            return;
        }

        historyList.innerHTML = this.state.history.map(item => `
            <div class="history-item" data-id="${item.id}">
                <div class="history-header">
                    <span class="history-category">${item.category}</span>
                    <span class="history-time">${this.formatDate(item.timestamp)}</span>
                </div>
                <div class="history-prompt">${item.prompt}</div>
                <div class="history-message">${item.message.substring(0, 100)}${item.message.length > 100 ? '...' : ''}</div>
                <div class="history-actions">
                    <button class="btn btn-sm btn-outline" onclick="window.messageGeneratorInstance.reUseHistoryItem(${item.id})">
                        🔄 Reuse
                    </button>
                    <button class="btn btn-sm btn-secondary" onclick="window.messageGeneratorInstance.deleteHistoryItem(${item.id})">
                        🗑️ Delete
                    </button>
                </div>
            </div>
        `).join('');
    }

    reUseHistoryItem(id) {
        const item = this.state.history.find(h => h.id === id);
        if (item) {
            document.getElementById('user-prompt').value = item.prompt;
            this.generateMessage();
        }
    }

    deleteHistoryItem(id) {
        this.state.history = this.state.history.filter(h => h.id !== id);
        this.saveHistory();
        this.renderHistory();
        this.updateAnalytics();
    }

    updateAnalytics() {
        const analytics = this.calculateAnalytics();
        
        const totalEl = document.getElementById('analytics-total');
        const todayEl = document.getElementById('analytics-today');
        const categoriesEl = document.getElementById('analytics-categories');
        const avgConfidenceEl = document.getElementById('analytics-avg-confidence');
        
        if (totalEl) totalEl.textContent = analytics.total;
        if (todayEl) todayEl.textContent = analytics.today;
        if (categoriesEl) categoriesEl.textContent = analytics.categories;
        if (avgConfidenceEl) avgConfidenceEl.textContent = analytics.avgConfidence + '%';
        
        // Update header stats
        const totalGeneratedEl = document.getElementById('total-generated');
        if (totalGeneratedEl) totalGeneratedEl.textContent = analytics.total;
    }

    calculateAnalytics() {
        const today = new Date().toDateString();
        const todayItems = this.state.history.filter(item => 
            new Date(item.timestamp).toDateString() === today
        );
        
        const categories = [...new Set(this.state.history.map(item => item.category))];
        const avgConfidence = this.state.history.length > 0 
            ? Math.round(this.state.history.reduce((sum, item) => sum + item.confidence, 0) / this.state.history.length * 100)
            : 0;

        return {
            total: this.state.history.length,
            today: todayItems.length,
            categories: categories.length,
            avgConfidence: avgConfidence
        };
    }

    exportData() {
        return {
            exportedAt: new Date().toISOString(),
            history: this.state.history,
            analytics: this.calculateAnalytics(),
            version: '1.0.0'
        };
    }

    setupAutoSave() {
        if (this.options.enableAutoSave) {
            // Save every 30 seconds
            setInterval(() => {
                this.saveHistory();
                this.saveAnalytics();
            }, 30000);
        }
    }

    loadHistory() {
        try {
            const saved = localStorage.getItem('messageGenerator_history');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.warn('Failed to load history:', error);
            return [];
        }
    }

    saveHistory() {
        try {
            localStorage.setItem('messageGenerator_history', JSON.stringify(this.state.history));
        } catch (error) {
            console.warn('Failed to save history:', error);
        }
    }

    loadAnalytics() {
        try {
            const saved = localStorage.getItem('messageGenerator_analytics');
            return saved ? JSON.parse(saved) : {};
        } catch (error) {
            console.warn('Failed to load analytics:', error);
            return {};
        }
    }

    saveAnalytics() {
        try {
            const analytics = this.calculateAnalytics();
            localStorage.setItem('messageGenerator_analytics', JSON.stringify(analytics));
        } catch (error) {
            console.warn('Failed to save analytics:', error);
        }
    }

    formatDate(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        
        return date.toLocaleDateString();
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

function initMessageGenerator(containerId, options = {}) {
    try {
        const ui = new MessageGeneratorUI(containerId, options);
        window.messageGeneratorInstance = ui;
        return ui;
    } catch (error) {
        console.error('Failed to initialize Message Generator:', error);
        return null;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = MessageGeneratorUI;
    }

    if (typeof window !== 'undefined') {
        window.MessageGeneratorUI = MessageGeneratorUI;
        window.initMessageGenerator = initMessageGenerator;
    }
});