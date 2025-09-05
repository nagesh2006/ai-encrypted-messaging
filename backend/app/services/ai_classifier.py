import pickle
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
import re
import os

class AIClassifier:
    def __init__(self):
        self.model = None
        self._train_model()
    
    def _load_training_data(self):
        """Load training data from files"""
        data_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'data')
        
        # Load spam messages
        spam_file = os.path.join(data_dir, 'spam_messages.txt')
        with open(spam_file, 'r', encoding='utf-8') as f:
            spam_messages = [line.strip() for line in f if line.strip()]
        
        # Load ham messages
        ham_file = os.path.join(data_dir, 'ham_messages.txt')
        with open(ham_file, 'r', encoding='utf-8') as f:
            ham_messages = [line.strip() for line in f if line.strip()]
        
        # Load toxic messages
        toxic_file = os.path.join(data_dir, 'toxic_messages.txt')
        with open(toxic_file, 'r', encoding='utf-8') as f:
            toxic_messages = [line.strip() for line in f if line.strip()]
        
        return spam_messages, ham_messages, toxic_messages
    
    def _train_model(self):
        # Load training data from files
        spam_messages, ham_messages, toxic_messages = self._load_training_data()
        
        # Combine datasets
        messages = spam_messages + ham_messages + toxic_messages
        labels = (
            ['spam'] * len(spam_messages) + 
            ['ham'] * len(ham_messages) + 
            ['toxic'] * len(toxic_messages)
        )
        
        # Create pipeline with better preprocessing
        self.model = Pipeline([
            ('tfidf', TfidfVectorizer(
                stop_words='english', 
                lowercase=True,
                max_features=5000,
                ngram_range=(1, 2)  # Include bigrams for better context
            )),
            ('classifier', MultinomialNB(alpha=0.1))
        ])
        
        # Train model
        self.model.fit(messages, labels)
        
        print(f"Model trained with {len(messages)} messages:")
        print(f"- Spam: {len(spam_messages)}")
        print(f"- Ham: {len(ham_messages)}")
        print(f"- Toxic: {len(toxic_messages)}")
    
    def classify_message(self, message: str) -> dict:
        # Clean message
        cleaned_message = re.sub(r'[^a-zA-Z\s]', '', message.lower())
        
        # Get prediction and probability
        prediction = self.model.predict([cleaned_message])[0]
        probabilities = self.model.predict_proba([cleaned_message])[0]
        
        # Get class names
        classes = self.model.classes_
        
        # Create probability dict
        prob_dict = {cls: prob for cls, prob in zip(classes, probabilities)}
        
        return {
            'prediction': prediction,
            'confidence': max(probabilities),
            'probabilities': prob_dict
        }

ai_classifier = AIClassifier()