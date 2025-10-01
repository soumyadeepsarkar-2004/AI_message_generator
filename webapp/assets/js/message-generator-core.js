class MessageGeneratorCore {
    constructor() {
        this.templates = {
            diwali: [
                {
                    template: "Hello {name}, Diwali greetings! We wish you prosperity, happiness, and joy this festive season. {company}",
                    placeholders: ["name", "company"],
                    category: "diwali",
                    confidence: 0.9
                },
                {
                    template: "Dear {name}, May this Diwali bring endless joy, prosperity, and success to you and your family. Best wishes from {company}.",
                    placeholders: ["name", "company"],
                    category: "diwali",
                    confidence: 0.85
                },
                {
                    template: "Wishing you a very Happy Diwali {name}! May the festival of lights illuminate your path to success and happiness.",
                    placeholders: ["name"],
                    category: "diwali",
                    confidence: 0.8
                }
            ],
            christmas: [
                {
                    template: "Dear {name}, Merry Christmas and a Happy New Year! May this season bring you joy, peace, and prosperity. {company}",
                    placeholders: ["name", "company"],
                    category: "christmas",
                    confidence: 0.9
                },
                {
                    template: "Wishing you {name} and your family a wonderful Christmas filled with love, laughter, and cherished moments.",
                    placeholders: ["name"],
                    category: "christmas",
                    confidence: 0.85
                }
            ],
            newyear: [
                {
                    template: "Dear {name}, Happy New Year! May this year bring you new opportunities, success, and happiness. Best regards, {company}",
                    placeholders: ["name", "company"],
                    category: "newyear",
                    confidence: 0.9
                },
                {
                    template: "Hi {name}, Wishing you a fantastic New Year ahead! May all your dreams come true in {year}.",
                    placeholders: ["name", "year"],
                    category: "newyear",
                    confidence: 0.8
                }
            ],
            birthday: [
                {
                    template: "Happy Birthday {name}! Wishing you a wonderful year ahead filled with joy, success, and all your heart's desires.",
                    placeholders: ["name"],
                    category: "birthday",
                    confidence: 0.9
                },
                {
                    template: "Dear {name}, Many happy returns of the day! May this special day bring you happiness and good fortune. From {company}",
                    placeholders: ["name", "company"],
                    category: "birthday",
                    confidence: 0.85
                }
            ],
            business: [
                {
                    template: "Dear {name}, Thank you for your continued partnership with {company}. We look forward to serving you better.",
                    placeholders: ["name", "company"],
                    category: "business",
                    confidence: 0.9
                },
                {
                    template: "Hi {name}, We're excited to share updates about {service} with you. Contact us at {contact} for more information.",
                    placeholders: ["name", "service", "contact"],
                    category: "business",
                    confidence: 0.85
                }
            ],
            promotional: [
                {
                    template: "Dear {name}, Special offer just for you! Get {discount}% off on {product}. Valid until {date}. {company}",
                    placeholders: ["name", "discount", "product", "date", "company"],
                    category: "promotional",
                    confidence: 0.9
                },
                {
                    template: "Hi {name}, Don't miss our exclusive sale! Save big on {category} products. Shop now at {website}",
                    placeholders: ["name", "category", "website"],
                    category: "promotional",
                    confidence: 0.8
                }
            ],
            thankyou: [
                {
                    template: "Dear {name}, Thank you for choosing {company}. Your trust means everything to us.",
                    placeholders: ["name", "company"],
                    category: "thankyou",
                    confidence: 0.9
                },
                {
                    template: "Hi {name}, We appreciate your business! Thank you for being a valued customer of {company}.",
                    placeholders: ["name", "company"],
                    category: "thankyou",
                    confidence: 0.85
                }
            ],
            reminder: [
                {
                    template: "Dear {name}, This is a friendly reminder about your {appointment} scheduled for {date} at {time}.",
                    placeholders: ["name", "appointment", "date", "time"],
                    category: "reminder",
                    confidence: 0.9
                },
                {
                    template: "Hi {name}, Don't forget about {event} on {date}. We look forward to seeing you there!",
                    placeholders: ["name", "event", "date"],
                    category: "reminder",
                    confidence: 0.8
                }
            ]
        };

        this.keywordMap = {
            diwali: ["diwali", "deepavali", "festival of lights", "hindu festival", "lamp", "celebration"],
            christmas: ["christmas", "xmas", "holiday", "santa", "festive", "december"],
            newyear: ["new year", "resolution", "january", "fresh start", "2024", "2025"],
            birthday: ["birthday", "anniversary", "celebration", "special day", "wishes"],
            business: ["business", "partnership", "professional", "corporate", "service"],
            promotional: ["offer", "discount", "sale", "promotion", "deal", "special price"],
            thankyou: ["thank", "appreciate", "gratitude", "grateful", "thanks"],
            reminder: ["reminder", "appointment", "meeting", "schedule", "don't forget"]
        };
    }

    generateMessage(prompt) {
        try {
            if (!prompt || typeof prompt !== 'string') {
                throw new Error('Invalid prompt provided');
            }

            const normalizedPrompt = prompt.toLowerCase().trim();
            const category = this.detectCategory(normalizedPrompt);
            const template = this.selectBestTemplate(category, normalizedPrompt);

            if (!template) {
                return this.generateGenericMessage(prompt);
            }

            return {
                message: template.template,
                category: template.category,
                placeholders: template.placeholders,
                confidence: template.confidence,
                alternatives: this.getAlternatives(category, template),
                suggestions: this.getSuggestions(template)
            };
        } catch (error) {
            console.error('Error generating message:', error);
            return {
                message: "Hello {name}, Thank you for your message. We appreciate your interest.",
                category: "generic",
                placeholders: ["name"],
                confidence: 0.5,
                alternatives: [],
                suggestions: [],
                error: error.message
            };
        }
    }

    detectCategory(prompt) {
        let bestCategory = 'business';
        let highestScore = 0;

        for (const [category, keywords] of Object.entries(this.keywordMap)) {
            let score = 0;
            keywords.forEach(keyword => {
                if (prompt.includes(keyword)) {
                    score += keyword.length; // Longer keywords get higher weight
                }
            });

            if (score > highestScore) {
                highestScore = score;
                bestCategory = category;
            }
        }

        return bestCategory;
    }

    selectBestTemplate(category, prompt) {
        const templates = this.templates[category];
        if (!templates || templates.length === 0) {
            return null;
        }

        // For now, return the highest confidence template
        // In future, could implement more sophisticated matching
        return templates.reduce((best, current) => 
            current.confidence > best.confidence ? current : best
        );
    }

    generateGenericMessage(prompt) {
        return {
            message: "Hello {name}, Thank you for reaching out. We appreciate your interest and will get back to you soon. Best regards, {company}",
            category: "generic",
            placeholders: ["name", "company"],
            confidence: 0.6,
            alternatives: [
                "Dear {name}, We have received your message and will respond shortly. Thank you for contacting {company}.",
                "Hi {name}, Thanks for your message. Our team will review it and get back to you as soon as possible."
            ],
            suggestions: [
                "Consider adding more specific keywords to get better template matches",
                "Try mentioning the occasion or purpose of your message"
            ]
        };
    }

    getAlternatives(category, selectedTemplate) {
        const templates = this.templates[category] || [];
        return templates
            .filter(template => template !== selectedTemplate)
            .map(template => template.template)
            .slice(0, 3); // Limit to 3 alternatives
    }

    getSuggestions(template) {
        const suggestions = [];
        
        if (template.placeholders.length > 2) {
            suggestions.push("Consider customizing all placeholders for better personalization");
        }
        
        if (template.confidence < 0.8) {
            suggestions.push("Try being more specific in your prompt for better matches");
        }
        
        suggestions.push("Review the message tone to ensure it matches your brand voice");
        
        return suggestions;
    }

    customizeMessage(message, values) {
        try {
            if (!message || typeof message !== 'string') {
                throw new Error('Invalid message template');
            }

            if (!values || typeof values !== 'object') {
                return message;
            }

            let customized = message;
            
            Object.entries(values).forEach(([placeholder, value]) => {
                if (value && value.trim()) {
                    const regex = new RegExp(`\\{${placeholder}\\}`, 'g');
                    customized = customized.replace(regex, value.trim());
                }
            });

            return customized;
        } catch (error) {
            console.error('Error customizing message:', error);
            return message;
        }
    }

    extractPlaceholders(message) {
        if (!message || typeof message !== 'string') {
            return [];
        }

        const matches = message.match(/\{([^}]+)\}/g);
        if (!matches) return [];

        return matches.map(match => match.slice(1, -1));
    }

    validateMessage(message) {
        const result = {
            isValid: true,
            errors: [],
            warnings: []
        };

        if (!message || typeof message !== 'string') {
            result.isValid = false;
            result.errors.push('Message cannot be empty');
            return result;
        }

        if (message.length < 10) {
            result.warnings.push('Message seems too short');
        }

        if (message.length > 500) {
            result.warnings.push('Message might be too long for some channels');
        }

        const placeholders = this.extractPlaceholders(message);
        if (placeholders.length === 0) {
            result.warnings.push('Consider adding personalization placeholders');
        }

        return result;
    }

    getCategories() {
        return Object.keys(this.templates);
    }

    getStats() {
        const categories = this.getCategories();
        const totalTemplates = categories.reduce((sum, category) => 
            sum + this.templates[category].length, 0
        );

        return {
            totalCategories: categories.length,
            totalTemplates: totalTemplates,
            categoriesWithTemplates: categories.length,
            averageTemplatesPerCategory: Math.round(totalTemplates / categories.length)
        };
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = MessageGeneratorCore;
}

if (typeof window !== 'undefined') {
    window.MessageGeneratorCore = MessageGeneratorCore;
}