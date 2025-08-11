from typing import Dict, Any, Tuple
import json

class TestScoringService:
    """Service for scoring personality tests and determining result types"""
    
    @staticmethod
    def score_mbti(answers: Dict[str, Any]) -> Tuple[str, Dict[str, Any], float]:
        """Score MBTI test and return type, scores, and confidence"""
        scores = {'E': 0, 'I': 0, 'S': 0, 'N': 0, 'T': 0, 'F': 0, 'J': 0, 'P': 0}
        
        # Count preferences based on answers
        for answer in answers.values():
            if answer in scores:
                scores[answer] += 1
        
        # Determine type
        personality_type = (
            ('E' if scores['E'] > scores['I'] else 'I') +
            ('S' if scores['S'] > scores['N'] else 'N') +
            ('T' if scores['T'] > scores['F'] else 'T') +
            ('J' if scores['J'] > scores['P'] else 'J')
        )
        
        # Calculate confidence based on clarity of preferences
        total_answers = len(answers)
        if total_answers == 0:
            confidence = 0.0
        else:
            # Calculate how decisive the preferences are
            e_i_diff = abs(scores['E'] - scores['I']) / max(scores['E'] + scores['I'], 1)
            s_n_diff = abs(scores['S'] - scores['N']) / max(scores['S'] + scores['N'], 1)
            t_f_diff = abs(scores['T'] - scores['F']) / max(scores['T'] + scores['F'], 1)
            j_p_diff = abs(scores['J'] - scores['P']) / max(scores['J'] + scores['P'], 1)
            
            # Average preference clarity
            avg_clarity = (e_i_diff + s_n_diff + t_f_diff + j_p_diff) / 4
            confidence = min(0.5 + (avg_clarity * 0.4), 0.95)  # 0.5 to 0.95 range
        
        return personality_type, scores, confidence
    
    @staticmethod
    def score_enneagram(answers: Dict[str, Any]) -> Tuple[str, Dict[str, Any], float]:
        """Score Enneagram test and return type, scores, and confidence"""
        # Simplified scoring - map questions to types
        type_scores = {str(i): 0 for i in range(1, 10)}
        
        # Question to type mapping (simplified)
        question_type_map = {
            1: '4',   # romantic/imaginative -> Type 4
            2: '2',   # taking on responsibilities -> Type 2  
            3: '8',   # aggressive/assertive -> Type 8
            4: '5',   # trouble expressing feelings -> Type 5
            5: '2',   # supportive/giving -> Type 2
            6: '7',   # spontaneous/fun-loving -> Type 7
            7: '1',   # idealistic/improve things -> Type 1
            8: '1',   # getting things done perfectly -> Type 1
            9: '3',   # competitive/image-conscious -> Type 3
            10: '5',  # studious/intellectually curious -> Type 5
            11: '1',  # responsible/hard-working -> Type 1
            12: '4',  # moody/self-absorbed -> Type 4
            13: '3',  # determined/driven -> Type 3
            14: '9',  # easy-going/agreeable -> Type 9
            15: '6'   # concerned with security -> Type 6
        }
        
        # Score based on intensity of answers
        for q_id, answer_value in answers.items():
            q_num = int(q_id)
            if q_num in question_type_map:
                target_type = question_type_map[q_num]
                # Higher score for stronger agreement
                if isinstance(answer_value, int):
                    type_scores[target_type] += answer_value
        
        # Find dominant type
        dominant_type = max(type_scores.keys(), key=lambda k: type_scores[k])
        max_score = type_scores[dominant_type]
        
        # Calculate confidence based on score separation
        sorted_scores = sorted(type_scores.values(), reverse=True)
        if len(sorted_scores) > 1 and sorted_scores[0] > 0:
            separation = (sorted_scores[0] - sorted_scores[1]) / sorted_scores[0]
            confidence = min(0.6 + (separation * 0.3), 0.9)
        else:
            confidence = 0.5
            
        return dominant_type, type_scores, confidence
    
    @staticmethod
    def score_disc(answers: Dict[str, Any]) -> Tuple[str, Dict[str, Any], float]:
        """Score DISC test and return type, scores, and confidence"""
        scores = {'D': 0, 'I': 0, 'S': 0, 'C': 0}
        
        # Count preferences
        for answer in answers.values():
            if answer in scores:
                scores[answer] += 1
        
        # Find dominant type
        dominant_type = max(scores.keys(), key=lambda k: scores[k])
        max_score = scores[dominant_type]
        total = sum(scores.values())
        
        # Calculate confidence based on dominance
        if total > 0:
            dominance_ratio = max_score / total
            confidence = min(0.6 + (dominance_ratio - 0.25) * 1.6, 0.9)
        else:
            confidence = 0.5
            
        return dominant_type, scores, confidence
    
    @staticmethod
    def score_human_design(answers: Dict[str, Any]) -> Tuple[str, Dict[str, Any], float]:
        """Score Human Design assessment"""
        # Extract key information
        birth_data = {
            'date': answers.get(1, ''),
            'time': answers.get(2, ''),
            'location': answers.get(3, '')
        }
        
        decision_making = answers.get(4, 'emotional')
        energy_pattern = answers.get(5, 'manifesting-generator')
        
        # Simplified type determination based on responses
        type_mapping = {
            'manifesting-generator': 'Manifesting Generator',
            'generator': 'Generator', 
            'projector': 'Projector',
            'manifestor': 'Manifestor',
            'reflector': 'Reflector'
        }
        
        authority_mapping = {
            'emotional': 'Emotional Authority',
            'sacral': 'Sacral Authority',
            'splenic': 'Splenic Authority',
            'ego': 'Ego Authority',
            'self-projected': 'Self-Projected Authority',
            'mental': 'Mental Authority',
            'lunar': 'Lunar Authority'
        }
        
        result_type = type_mapping.get(energy_pattern, 'Manifesting Generator')
        authority = authority_mapping.get(decision_making, 'Emotional Authority')
        
        scores = {
            'type': result_type,
            'authority': authority,
            'birth_data': birth_data
        }
        
        # Confidence based on completeness of birth data
        data_completeness = sum([1 for v in birth_data.values() if v.strip()])
        confidence = min(0.4 + (data_completeness / 3) * 0.4, 0.75)  # Max 0.75 for entertainment
        
        return result_type, scores, confidence
    
    @classmethod
    def score_test(cls, test_id: str, answers: Dict[str, Any]) -> Tuple[str, Dict[str, Any], float]:
        """Route to appropriate scoring method"""
        scoring_methods = {
            'mbti': cls.score_mbti,
            'enneagram': cls.score_enneagram,
            'disc': cls.score_disc,
            'humanDesign': cls.score_human_design
        }
        
        if test_id not in scoring_methods:
            return "unknown", {}, 0.0
            
        return scoring_methods[test_id](answers)
    
    @staticmethod
    def get_test_metadata(test_id: str) -> Dict[str, Any]:
        """Get metadata about a specific test"""
        metadata = {
            'mbti': {
                'name': 'Myers-Briggs Type Indicator',
                'category': 'evidence-based',
                'source': 'Psychological theory by Myers & Briggs',
                'question_count': 20,
                'duration': '15-20 minutes'
            },
            'enneagram': {
                'name': 'Enneagram Personality Types',
                'category': 'evidence-based',
                'source': 'Enneagram Institute methodology',
                'question_count': 15,
                'duration': '20-25 minutes'
            },
            'disc': {
                'name': 'DISC Behavioral Assessment',
                'category': 'evidence-based',
                'source': 'DISC behavioral assessment model',
                'question_count': 10,
                'duration': '10-15 minutes'
            },
            'humanDesign': {
                'name': 'Human Design System',
                'category': 'entertainment/spiritual',
                'source': 'Human Design System (entertainment/spiritual guidance)',
                'question_count': 5,
                'duration': '5 minutes + birth data'
            }
        }
        
        return metadata.get(test_id, {})