import pickle
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.model_selection import cross_val_score
import re
import os
import string

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
    
    def _preprocess_text(self, text: str) -> str:
        """Enhanced text preprocessing"""
        # Convert to lowercase
        text = text.lower()
        
        # Remove URLs
        text = re.sub(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', '', text)
        
        # Remove email addresses
        text = re.sub(r'\S+@\S+', '', text)
        
        # Remove excessive punctuation
        text = re.sub(r'[!]{2,}', '!', text)
        text = re.sub(r'[?]{2,}', '?', text)
        text = re.sub(r'[.]{2,}', '.', text)
        
        # Remove excessive whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Remove leading/trailing whitespace
        text = text.strip()
        
        return text
    
    def _train_model(self):
        # Load training data from files
        spam_messages, ham_messages, toxic_messages = self._load_training_data()
        
        # Preprocess all messages
        spam_messages = [self._preprocess_text(msg) for msg in spam_messages]
        ham_messages = [self._preprocess_text(msg) for msg in ham_messages]
        toxic_messages = [self._preprocess_text(msg) for msg in toxic_messages]
        
        # Combine datasets
        messages = spam_messages + ham_messages + toxic_messages
        labels = (
            ['spam'] * len(spam_messages) + 
            ['ham'] * len(ham_messages) + 
            ['toxic'] * len(toxic_messages)
        )
        
        # Create enhanced pipeline
        self.model = Pipeline([
            ('tfidf', TfidfVectorizer(
                stop_words='english', 
                lowercase=True,
                max_features=10000,  # Increased features
                ngram_range=(1, 3),  # Include trigrams
                min_df=2,  # Ignore terms that appear in less than 2 documents
                max_df=0.95,  # Ignore terms that appear in more than 95% of documents
                sublinear_tf=True,  # Use sublinear tf scaling
                norm='l2'  # L2 normalization
            )),
            ('classifier', LogisticRegression(
                C=1.0,
                max_iter=1000,
                random_state=42,
                class_weight='balanced'  # Handle class imbalance
            ))
        ])
        
        # Train model
        self.model.fit(messages, labels)
        
        # Evaluate model performance
        scores = cross_val_score(self.model, messages, labels, cv=5, scoring='accuracy')
        
        print(f"Model trained with {len(messages)} messages:")
        print(f"- Spam: {len(spam_messages)}")
        print(f"- Ham: {len(ham_messages)}")
        print(f"- Toxic: {len(toxic_messages)}")
        print(f"- Cross-validation accuracy: {scores.mean():.3f} (+/- {scores.std() * 2:.3f})")
    
    def classify_message(self, message: str) -> dict:
        # Preprocess message
        cleaned_message = self._preprocess_text(message)
        
        # Handle empty messages
        if not cleaned_message.strip():
            return {
                'prediction': 'ham',
                'confidence': 0.5,
                'probabilities': {'ham': 0.5, 'spam': 0.25, 'toxic': 0.25}
            }
        
        # Get prediction and probability
        prediction = self.model.predict([cleaned_message])[0]
        probabilities = self.model.predict_proba([cleaned_message])[0]
        
        # Get class names
        classes = self.model.classes_
        
        # Create probability dict with all classes
        prob_dict = {cls: 0.0 for cls in ['ham', 'spam', 'toxic']}
        for cls, prob in zip(classes, probabilities):
            prob_dict[cls] = prob
        
        # Calculate confidence with entropy-based measure
        entropy = -sum(p * np.log(p + 1e-10) for p in probabilities if p > 0)
        max_entropy = np.log(len(classes))
        confidence = 1 - (entropy / max_entropy)
        
        return {
            'prediction': prediction,
            'confidence': confidence,
            'probabilities': prob_dict,
            'raw_probabilities': probabilities.tolist(),
            'message_length': len(message),
            'cleaned_length': len(cleaned_message)
        }

ai_classifier = AIClassifier()