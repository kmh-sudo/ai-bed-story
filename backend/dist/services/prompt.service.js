export class PromptService {
    static buildStoryPrompt({ childName, age, theme, moral, length, }) {
        const lengthGuide = {
            short: "200-300 words",
            medium: "400-600 words",
            long: "700-1000 words",
        };
        const basePrompt = `Create a magical bedtime story for ${childName}, who is ${age} years old.`;
        const themeSection = theme
            ? `The story should be about: ${theme}.`
            : "Choose an age-appropriate, imaginative theme.";
        const moralSection = moral
            ? `Include this moral lesson: ${moral}.`
            : "Include a gentle, positive life lesson.";
        const lengthSection = `The story should be approximately ${lengthGuide[length]}.`;
        //     const styleGuide = `
        // Style guidelines:
        // - Use simple, age-appropriate language for a ${age}-year-old
        // - Make it warm, comforting, and suitable for bedtime
        // - Include vivid imagery and gentle adventure
        // - End with a peaceful, sleep-inducing conclusion
        // - Use the child's name (${childName}) as the main character
        // - Format with clear paragraphs for easy reading
        // `;
        const styleGuide = `
Style guidelines:
- Use simple, rhythmic language for a ${age}-year-old.
- Character: Use ${childName} as the protagonist.
- Tone: Start cozy, transition to gentle adventure, and end with "sleepy-heavy" vibes.
- Sensory Focus: Include soft sounds (rustling leaves, gentle wind) and calming scents.
- Interaction: Add 1-2 tiny pauses or gentle questions for ${childName} to keep them engaged.
- Pacing: Shorten the sentences and use "softer" words (e.g., drift, glow, hum, snuggle) as the story reaches the end.
- Conclusion: A specific "goodnight" ritual within the story (e.g., tucking in the stars).
`;
        return `${basePrompt}\n\n${themeSection}\n${moralSection}\n${lengthSection}\n${styleGuide}`;
    }
    static buildTranslationPrompt(englishText) {
        return `You are a professional storyteller and translator fluent in both English and Burmese (Myanmar).

    Task: Translate the following English bedtime story into natural, flowing, and warm Burmese.

    IMPORTANT TRANSLATION GUIDELINES:
    - DO NOT translate word-for-word. Focus on the *meaning* and *feeling*.
    - Use "Natural Burmese" (Speaking style/Literary style mix that sounds good for storytelling).
    - Use polite and warm expressions (e.g., using "ကွပ်" or "ဗျ" where appropriate for dialogue, or warm sentence endings).
    - The tone should be soothing, magical, and perfect for reading to a child at bedtime.
    - Adapt colloquialisms to culturally appropriate Burmese equivalents.
    - Keep the formatting (paragraphs) consistent with the original.
    - Output ONLY the Burmese translation. No introductory text.

    English story:
    ${englishText}

    Burmese Translation:`;
    }
}
//# sourceMappingURL=prompt.service.js.map