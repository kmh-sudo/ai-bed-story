interface StoryPromptParams {
    childName: string;
    age: number;
    theme?: string;
    moral?: string;
    length: "short" | "medium" | "long";
}
export declare class PromptService {
    static buildStoryPrompt({ childName, age, theme, moral, length, }: StoryPromptParams): string;
    static buildTranslationPrompt(englishText: string): string;
}
export {};
//# sourceMappingURL=prompt.service.d.ts.map