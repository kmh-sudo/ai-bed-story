import React, { useEffect, useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useLocation, useNavigate } from 'react-router-dom';
import { storyAPI } from '../services/api';

interface StoryData {
  story: string;
  metadata: {
    childName: string;
    age: number;
    theme?: string;
    length: string;
    generatedAt: string;
  };
}

export const StoryDisplay: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const storyData = location.state?.storyData as StoryData;
  const [isReading, setIsReading] = useState(false);
  const [activeTab, setActiveTab] = useState<'english' | 'burmese'>('english');
  const [translatedStory, setTranslatedStory] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: contentRef,
    documentTitle: `${storyData.metadata.childName}'s Bedtime Story`,
  });

  useEffect(() => {
    if (!storyData) {
      navigate('/');
      return;
    }
    setTimeout(() => setIsReading(true), 500);
  }, [storyData, navigate]);

  if (!storyData) {
    return null;
  }

  const handleNewStory = () => {
    navigate('/');
  };

  const handleTabChange = async (tab: 'english' | 'burmese') => {
    setActiveTab(tab);
    
    if (tab === 'burmese' && !translatedStory && !isTranslating) {
      setIsTranslating(true);
      setTranslationError(null);
      
      try {
        const response = await storyAPI.translateStory(storyData.story);
        if (response.success && response.translation) {
          setTranslatedStory(response.translation);
        } else {
          setTranslationError(response.error || 'Translation failed');
        }
      } catch (err) {
        setTranslationError(err instanceof Error ? err.message : 'Translation failed');
      } finally {
        setIsTranslating(false);
      }
    }
  };

  const renderStorySection = (text: string, language: 'burmese' | 'english', index: number) => {
    const paragraphs = text.trim().split('\n\n');
    
    return (
      <div key={index} className={`story-section ${language}`}>
        {/* Language tags removed as we now use tabs */}
        
        <div className="story-text-container">
          {paragraphs.map((paragraph, pIndex) => (
            <p 
              key={pIndex} 
              className="story-paragraph" 
              style={{ animationDelay: `${(pIndex) * 0.1}s` }}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="story-page">
      <div className="stars-bg"></div>
      <div className="stars-bg stars-bg-slow"></div>
      <div className="moon-decoration"></div>

      <div className="story-page-container">
        <div className={`story-header ${isReading ? 'fade-in' : ''}`}>
          <button className="back-button" onClick={handleNewStory}>
            ← New Story
          </button>
          <h1 className="story-title">
            ✨ {storyData.metadata.childName}'s Bedtime Story
          </h1>
          <div className="story-meta">
            <span className="meta-item">📅 {new Date(storyData.metadata.generatedAt).toLocaleDateString()}</span>
            <span className="meta-item">📖 {storyData.metadata.length}</span>
            {storyData.metadata.theme && (
              <span className="meta-item">🎭 {storyData.metadata.theme}</span>
            )}
          </div>
        </div>

        <div className={`story-content ${isReading ? 'fade-in-delayed' : ''}`}>
          <div className="tabs-container">
            <button 
              className={`tab-button ${activeTab === 'english' ? 'active' : ''}`}
              onClick={() => handleTabChange('english')}
            >
              🇬🇧 English
            </button>
            {/* <button 
              className={`tab-button ${activeTab === 'burmese' ? 'active' : ''}`}
              onClick={() => handleTabChange('burmese')}
            >
              🇲🇲 ဗမာဘာသာ
            </button> */}
          </div>

          <div className="story-book" ref={contentRef}>
            {activeTab === 'english' && renderStorySection(storyData.story, 'english', 0)}
            
            {activeTab === 'burmese' && (
              <>
                {isTranslating ? (
                  <div className="tab-content-loader">
                    <span className="spinner" style={{ width: '40px', height: '40px' }}></span>
                    <p>Translating story to Burmese...</p>
                  </div>
                ) : translationError ? (
                  <div className="error-message">
                    {translationError}
                    <button 
                      className="btn-translate" 
                      onClick={() => handleTabChange('burmese')}
                      style={{ marginTop: '1rem' }}
                    >
                      Retry Translation
                    </button>
                  </div>
                ) : translatedStory ? (
                  renderStorySection(translatedStory, 'burmese', 1)
                ) : null}
              </>
            )}
          </div>
        </div>

        <div className={`story-actions ${isReading ? 'fade-in-delayed-2' : ''}`}>
          <div className="story-actions-inner">
            <button className="action-button action-button-primary" onClick={handleNewStory}>
              🌟 Create Another Story
            </button>
            <button 
              className="action-button action-button-secondary"
              onClick={() => handlePrint()}
            >
              📥 Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
