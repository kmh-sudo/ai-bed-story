import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storyAPI } from '../services/api';
import type { StoryRequest } from '../services/api';


export const StoryGenerator: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<StoryRequest>({
        childName: '',
        age: 6,
        theme: '',
        moral: '',
        length: 'short',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await storyAPI.generateStory(formData);
            if (response.success && response.data) {
                // Navigate to story display page
                navigate('/story', { state: { storyData: response.data } });
            } else {
                setError(response.error || 'Failed to generate story');
                setLoading(false);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            setLoading(false);
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'age' ? parseInt(value) || 0 : value,
        }));
    };

    return (
        <div className="container">
            <div className="generator-header">
                <h1 className="page-title">
                    ✨ AI Bed Story Generator
                </h1>
                <p className="page-subtitle">
                    Create magical, personalized bed stories for your little ones
                </p>
            </div>

            <div className="card">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="childName">
                            Child's Name *
                        </label>
                        <input
                            type="text"
                            id="childName"
                            name="childName"
                            className="form-input"
                            value={formData.childName}
                            onChange={handleInputChange}
                            placeholder="Enter child's name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="age">
                            Age *
                        </label>
                        <input
                            type="number"
                            id="age"
                            name="age"
                            className="form-input"
                            value={formData.age}
                            onChange={handleInputChange}
                            min="1"
                            max="12"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="theme">
                            Story Theme (Optional)
                        </label>
                        <input
                            type="text"
                            id="theme"
                            name="theme"
                            className="form-input"
                            value={formData.theme}
                            onChange={handleInputChange}
                            placeholder="e.g., Space adventure, Underwater kingdom, Magic forest"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="moral">
                            Moral Lesson (Optional)
                        </label>
                        <textarea
                            id="moral"
                            name="moral"
                            className="form-textarea"
                            value={formData.moral}
                            onChange={handleInputChange}
                            placeholder="e.g., The importance of kindness, Being brave"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="length">
                            Story Length
                        </label>
                        <select
                            id="length"
                            name="length"
                            className="form-select"
                            value={formData.length}
                            onChange={handleInputChange}
                        >
                            <option value="short">Short (2-3 minutes)</option>
                            <option value="medium">Medium (5-7 minutes)</option>
                            {/* <option value="long">Long (10-15 minutes)</option> */}
                        </select>
                    </div>

                    {error && (
                        <div className="error-message">
                            <strong>Error:</strong> {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ width: '100%' }}
                    >
                        {loading ? (
                            <>
                                <span className="spinner"></span>
                                Generating magical story...
                            </>
                        ) : (
                            <>
                                🌙 Generate Bed Story
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};
