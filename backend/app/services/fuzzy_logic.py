import numpy as np

class FuzzyDecisionEngine:
    def __init__(self):
        # Define fuzzy membership functions
        self.confidence_ranges = {
            'low': (0, 0, 0.5),
            'medium': (0.3, 0.5, 0.7),
            'high': (0.5, 1, 1)
        }
        
        self.spam_ranges = {
            'low': (0, 0, 0.4),
            'medium': (0.2, 0.5, 0.8),
            'high': (0.6, 1, 1)
        }
        
        self.toxic_ranges = {
            'low': (0, 0, 0.3),
            'medium': (0.2, 0.5, 0.8),
            'high': (0.7, 1, 1)
        }
        
        # Fuzzy rules (IF-THEN rules)
        self.rules = [
            # Rule 1: IF toxic is HIGH THEN block
            {'condition': lambda t, s, c: self._get_membership(t, self.toxic_ranges['high']),
             'action': 'blocked', 'weight': 1.0},
            
            # Rule 2: IF spam is HIGH AND confidence is HIGH THEN block
            {'condition': lambda t, s, c: min(self._get_membership(s, self.spam_ranges['high']),
                                            self._get_membership(c, self.confidence_ranges['high'])),
             'action': 'blocked', 'weight': 0.9},
            
            # Rule 3: IF spam is MEDIUM AND confidence is HIGH THEN flag
            {'condition': lambda t, s, c: min(self._get_membership(s, self.spam_ranges['medium']),
                                            self._get_membership(c, self.confidence_ranges['high'])),
             'action': 'flagged', 'weight': 0.7},
            
            # Rule 4: IF confidence is LOW THEN flag
            {'condition': lambda t, s, c: self._get_membership(c, self.confidence_ranges['low']),
             'action': 'flagged', 'weight': 0.6},
            
            # Rule 5: IF spam is LOW AND toxic is LOW THEN allow
            {'condition': lambda t, s, c: min(self._get_membership(s, self.spam_ranges['low']),
                                            self._get_membership(t, self.toxic_ranges['low'])),
             'action': 'allowed', 'weight': 0.8},
            
            # Rule 6: IF toxic is MEDIUM AND confidence is HIGH THEN block
            {'condition': lambda t, s, c: min(self._get_membership(t, self.toxic_ranges['medium']),
                                            self._get_membership(c, self.confidence_ranges['high'])),
             'action': 'blocked', 'weight': 0.8}
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
        """Convert fuzzy outputs to crisp decision using weighted average"""
        action_scores = {'allowed': [], 'flagged': [], 'blocked': []}
        
        # Collect all rule activations for each action
        for rule_strength, action, weight in rule_outputs:
            if rule_strength > 0:
                action_scores[action].append(rule_strength * weight)
        
        # Calculate final scores for each action
        final_scores = {}
        for action, scores in action_scores.items():
            if scores:
                final_scores[action] = max(scores)  # Use maximum activation
            else:
                final_scores[action] = 0.0
        
        # Find the action with highest score
        best_action = max(final_scores, key=final_scores.get)
        best_score = final_scores[best_action]
        
        return best_action, best_score, final_scores
    
    def make_decision(self, ai_result: dict) -> dict:
        """Main fuzzy inference system"""
        spam_probability = ai_result['probabilities'].get('spam', 0)
        toxic_probability = ai_result['probabilities'].get('toxic', 0)
        confidence = ai_result['confidence']
        
        # Fuzzification: Apply all rules
        rule_outputs = []
        
        for rule in self.rules:
            # Calculate rule strength (degree of activation)
            rule_strength = rule['condition'](toxic_probability, spam_probability, confidence)
            rule_outputs.append((rule_strength, rule['action'], rule['weight']))
        
        # Defuzzification: Convert to crisp output
        decision, score, all_scores = self._defuzzify(rule_outputs)
        
        # Create detailed output for debugging
        fuzzy_details = {
            'membership_degrees': {
                'confidence': {
                    'low': self._get_membership(confidence, self.confidence_ranges['low']),
                    'medium': self._get_membership(confidence, self.confidence_ranges['medium']),
                    'high': self._get_membership(confidence, self.confidence_ranges['high'])
                },
                'spam': {
                    'low': self._get_membership(spam_probability, self.spam_ranges['low']),
                    'medium': self._get_membership(spam_probability, self.spam_ranges['medium']),
                    'high': self._get_membership(spam_probability, self.spam_ranges['high'])
                },
                'toxic': {
                    'low': self._get_membership(toxic_probability, self.toxic_ranges['low']),
                    'medium': self._get_membership(toxic_probability, self.toxic_ranges['medium']),
                    'high': self._get_membership(toxic_probability, self.toxic_ranges['high'])
                }
            },
            'rule_activations': [(f"Rule {i+1}", strength, action) 
                               for i, (strength, action, _) in enumerate(rule_outputs)],
            'action_scores': all_scores
        }
        
        return {
            'decision': decision,
            'score': score,
            'spam_prob': spam_probability,
            'toxic_prob': toxic_probability,
            'confidence': confidence,
            'fuzzy_details': fuzzy_details
        }

fuzzy_engine = FuzzyDecisionEngine()