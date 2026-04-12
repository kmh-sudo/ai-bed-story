const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

export type StoryRequest = {
  childName: string;
  age: number;
  theme?: string;
  moral?: string;
  length: 'short' | 'medium' | 'long';
};

export type StoryResponse = {
  success: boolean;
  data?: {
    story: string;
    metadata: {
      childName: string;
      age: number;
      theme?: string;
      length: string;
      generatedAt: string;
    };
  };
  error?: string;
};

export const storyAPI = {
  async generateStory(request: StoryRequest): Promise<StoryResponse> {
    const response = await fetch(`${API_URL}/api/story/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate story');
    }

    return response.json();
  },

  async translateStory(englishStory: string): Promise<{ success: boolean; translation?: string; error?: string }> {
    const response = await fetch(`${API_URL}/api/story/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: englishStory }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to translate story');
    }

    return response.json();
  },

  async getVoices() {
    const response = await fetch(`${API_URL}/api/story/voices`);
    return response.json();
  },
};
