import numpy as np

class FuzzyDecisionEngine:
    def __init__(self):
        # Enhanced fuzzy membership functions with better granularity
        self.confidence_ranges = {
            'very_low': (0, 0, 0.2),
            'low': (0.1, 0.3, 0.5),
            'medium': (0.4, 0.6, 0.8),
            'high': (0.7, 0.85, 1),
            'very_high': (0.9, 1, 1)
        }
        
        self.spam_ranges = {
            'very_low': (0, 0, 0.15),
            'low': (0.1, 0.25, 0.4),
            'medium': (0.3, 0.5, 0.7),
            'high': (0.6, 0.8, 0.95),
            'very_high': (0.85, 1, 1)
        }
        
        self.toxic_ranges = {
            'very_low': (0, 0, 0.1),
            'low': (0.05, 0.2, 0.35),
            'medium': (0.25, 0.45, 0.65),
            'high': (0.55, 0.75, 0.9),
            'very_high': (0.8, 1, 1)
        }
        
        # Message length consideration
        self.length_ranges = {
            'very_short': (0, 0, 20),
            'short': (10, 50, 100),
            'medium': (80, 150, 250),
            'long': (200, 400, 600),
            'very_long': (500, 1000, 2000)
        }
        
        # Enhanced fuzzy rules with more sophisticated logic
        self.rules = [
            # Critical blocking rules - only for extreme cases
            {'condition': lambda t, s, c, l: min(self._get_membership(t, self.toxic_ranges['very_high']),
                                                self._get_membership(c, self.confidence_ranges['high'])),
             'action': 'blocked', 'weight': 1.0, 'description': 'Very high toxicity with high confidence'},
            
            {'condition': lambda t, s, c, l: min(self._get_membership(t, self.toxic_ranges['high']),
                                                self._get_membership(c, self.confidence_ranges['very_high'])),
             'action': 'blocked', 'weight': 0.95, 'description': 'High toxicity with very high confidence'},
            
            # Spam with high confidence rules - more restrictive
            {'condition': lambda t, s, c, l: min(self._get_membership(s, self.spam_ranges['very_high']),
                                                self._get_membership(c, self.confidence_ranges['very_high']),
                                                self._get_membership(t, self.toxic_ranges['medium'])),
             'action': 'blocked', 'weight': 0.9, 'description': 'Very high spam with very high confidence and medium toxicity'},
            
            # Medium toxicity with context
            {'condition': lambda t, s, c, l: min(self._get_membership(t, self.toxic_ranges['medium']),
                                                self._get_membership(c, self.confidence_ranges['high']),
                                                self._get_membership(l, self.length_ranges['short'])),
             'action': 'blocked', 'weight': 0.8, 'description': 'Medium toxicity, high confidence, short message'},
            
            # Flagging rules - much more restrictive
            {'condition': lambda t, s, c, l: min(self._get_membership(t, self.toxic_ranges['high']),
                                                self._get_membership(c, self.confidence_ranges['high'])),
             'action': 'flagged', 'weight': 0.75, 'description': 'High toxicity with high confidence'},
            
            # Context-aware rules
            {'condition': lambda t, s, c, l: min(self._get_membership(s, self.spam_ranges['high']),
                                                self._get_membership(l, self.length_ranges['very_long'])),
             'action': 'flagged', 'weight': 0.65, 'description': 'High spam in very long message'},
            
            # Allow rules - more permissive
            {'condition': lambda t, s, c, l: min(self._get_membership(s, self.spam_ranges['very_low']),
                                                self._get_membership(t, self.toxic_ranges['very_low'])),
             'action': 'allowed', 'weight': 1.0, 'description': 'Very low spam and toxicity'},
            
            {'condition': lambda t, s, c, l: min(self._get_membership(s, self.spam_ranges['low']),
                                                self._get_membership(t, self.toxic_ranges['low'])),
             'action': 'allowed', 'weight': 0.9, 'description': 'Low spam and toxicity'},
            
            {'condition': lambda t, s, c, l: min(self._get_membership(s, self.spam_ranges['medium']),
                                                self._get_membership(t, self.toxic_ranges['very_low']),
                                                self._get_membership(c, self.confidence_ranges['high'])),
             'action': 'allowed', 'weight': 0.8, 'description': 'Medium spam but very low toxicity with high confidence'},
            
            # Length-based adjustments
            {'condition': lambda t, s, c, l: min(self._get_membership(l, self.length_ranges['very_short']),
                                                self._get_membership(c, self.confidence_ranges['low'])),
             'action': 'flagged', 'weight': 0.5, 'description': 'Very short message with low confidence'}
        ]
    
    def _triangular_membership(self, x, a, b, c):
        """Calculate triangular membership function"""
        if x <= a or x >= c:
            return 0.0
        elif a < x <= b:
            return (x - a) / (b - a)
        elif b < x < c:
            return (c - x) / (c - b)
        else:
            return 0.0
    
    def _get_membership(self, value, range_tuple):
        """Get membership degree for a value in a fuzzy set"""
        a, b, c = range_tuple
        return self._triangular_membership(value, a, b, c)
    
    def _defuzzify(self, rule_outputs):
        """Enhanced defuzzification with weighted aggregation"""
        action_scores = {'allowed': [], 'flagged': [], 'blocked': []}
        
        # Collect all rule activations for each action
        for rule_strength, action, weight, _ in rule_outputs:
            if rule_strength > 0:
                action_scores[action].append(rule_strength * weight)
        
        # Calculate final scores using both max and average for robustness
        final_scores = {}
        for action, scores in action_scores.items():
            if scores:
                # Combine maximum activation with weighted average
                max_score = max(scores)
                avg_score = sum(scores) / len(scores)
                final_scores[action] = 0.7 * max_score + 0.3 * avg_score
            else:
                final_scores[action] = 0.0
        
        # Find the action with highest score
        best_action = max(final_scores, key=final_scores.get)
        best_score = final_scores[best_action]
        
        # Apply minimum threshold for decisions - much more permissive
        if best_score < 0.8:
            best_action = 'allowed'  # Default to allow if no strong signal
        
        return best_action, best_score, final_scores
    
    def make_decision(self, ai_result: dict, message_text: str = "") -> dict:
        """Enhanced fuzzy inference system with context awareness"""
        spam_probability = ai_result['probabilities'].get('spam', 0)
        toxic_probability = ai_result['probabilities'].get('toxic', 0)
        confidence = ai_result['confidence']
        message_length = len(message_text)
        
        # Fuzzification: Apply all rules
        rule_outputs = []
        
        for i, rule in enumerate(self.rules):
            # Calculate rule strength (degree of activation)
            rule_strength = rule['condition'](toxic_probability, spam_probability, confidence, message_length)
            rule_outputs.append((rule_strength, rule['action'], rule['weight'], rule.get('description', f'Rule {i+1}')))
        
        # Defuzzification: Convert to crisp output
        decision, score, all_scores = self._defuzzify(rule_outputs)
        
        # Create detailed output for debugging
        fuzzy_details = {
            'membership_degrees': {
                'confidence': {
                    'very_low': self._get_membership(confidence, self.confidence_ranges['very_low']),
                    'low': self._get_membership(confidence, self.confidence_ranges['low']),
                    'medium': self._get_membership(confidence, self.confidence_ranges['medium']),
                    'high': self._get_membership(confidence, self.confidence_ranges['high']),
                    'very_high': self._get_membership(confidence, self.confidence_ranges['very_high'])
                },
                'spam': {
                    'very_low': self._get_membership(spam_probability, self.spam_ranges['very_low']),
                    'low': self._get_membership(spam_probability, self.spam_ranges['low']),
                    'medium': self._get_membership(spam_probability, self.spam_ranges['medium']),
                    'high': self._get_membership(spam_probability, self.spam_ranges['high']),
                    'very_high': self._get_membership(spam_probability, self.spam_ranges['very_high'])
                },
                'toxic': {
                    'very_low': self._get_membership(toxic_probability, self.toxic_ranges['very_low']),
                    'low': self._get_membership(toxic_probability, self.toxic_ranges['low']),
                    'medium': self._get_membership(toxic_probability, self.toxic_ranges['medium']),
                    'high': self._get_membership(toxic_probability, self.toxic_ranges['high']),
                    'very_high': self._get_membership(toxic_probability, self.toxic_ranges['very_high'])
                },
                'length': {
                    'very_short': self._get_membership(message_length, self.length_ranges['very_short']),
                    'short': self._get_membership(message_length, self.length_ranges['short']),
                    'medium': self._get_membership(message_length, self.length_ranges['medium']),
                    'long': self._get_membership(message_length, self.length_ranges['long']),
                    'very_long': self._get_membership(message_length, self.length_ranges['very_long'])
                }
            },
            'rule_activations': [(desc, strength, action) 
                               for strength, action, _, desc in rule_outputs if strength > 0],
            'action_scores': all_scores,
            'message_length': message_length
        }
        
        return {
            'decision': decision,
            'score': score,
            'spam_prob': spam_probability,
            'toxic_prob': toxic_probability,
            'confidence': confidence,
            'message_length': message_length,
            'fuzzy_details': fuzzy_details
        }

fuzzy_engine = FuzzyDecisionEngine()