from typing import Dict, Any, Tuple, List
import json
import statistics
from datetime import datetime

class PremiumTestScoringService:
    """Enhanced service for scoring premium personality tests"""
    
    @staticmethod
    def score_big_five(answers: Dict[str, Any]) -> Tuple[Dict[str, float], Dict[str, Any], float]:
        """Score Big Five test and return dimension scores, analysis, and confidence"""
        
        # Question to dimension mapping with reverse scoring
        question_dimensions = {
            # Extraversion
            1: {'dimension': 'extraversion', 'reverse': False},
            2: {'dimension': 'extraversion', 'reverse': True},
            3: {'dimension': 'extraversion', 'reverse': False},
            4: {'dimension': 'extraversion', 'reverse': True},
            5: {'dimension': 'extraversion', 'reverse': False},
            6: {'dimension': 'extraversion', 'reverse': True},
            7: {'dimension': 'extraversion', 'reverse': False},
            8: {'dimension': 'extraversion', 'reverse': True},
            
            # Agreeableness  
            9: {'dimension': 'agreeableness', 'reverse': False},
            10: {'dimension': 'agreeableness', 'reverse': True},
            11: {'dimension': 'agreeableness', 'reverse': True},
            12: {'dimension': 'agreeableness', 'reverse': True},
            13: {'dimension': 'agreeableness', 'reverse': False},
            14: {'dimension': 'agreeableness', 'reverse': True},
            15: {'dimension': 'agreeableness', 'reverse': False},
            16: {'dimension': 'agreeableness', 'reverse': False},
            
            # Conscientiousness
            17: {'dimension': 'conscientiousness', 'reverse': False},
            18: {'dimension': 'conscientiousness', 'reverse': True},
            19: {'dimension': 'conscientiousness', 'reverse': False},
            20: {'dimension': 'conscientiousness', 'reverse': True},
            21: {'dimension': 'conscientiousness', 'reverse': False},
            22: {'dimension': 'conscientiousness', 'reverse': True},
            23: {'dimension': 'conscientiousness', 'reverse': False},
            24: {'dimension': 'conscientiousness', 'reverse': True},
            
            # Neuroticism
            25: {'dimension': 'neuroticism', 'reverse': False},
            26: {'dimension': 'neuroticism', 'reverse': True},
            27: {'dimension': 'neuroticism', 'reverse': False},
            28: {'dimension': 'neuroticism', 'reverse': True},
            29: {'dimension': 'neuroticism', 'reverse': False},
            30: {'dimension': 'neuroticism', 'reverse': False},
            31: {'dimension': 'neuroticism', 'reverse': False},
            32: {'dimension': 'neuroticism', 'reverse': False},
            
            # Openness
            33: {'dimension': 'openness', 'reverse': False},
            34: {'dimension': 'openness', 'reverse': True},
            35: {'dimension': 'openness', 'reverse': False},
            36: {'dimension': 'openness', 'reverse': True},
            37: {'dimension': 'openness', 'reverse': False},
            38: {'dimension': 'openness', 'reverse': True},
            39: {'dimension': 'openness', 'reverse': False},
            40: {'dimension': 'openness', 'reverse': False},
            41: {'dimension': 'openness', 'reverse': False},
            42: {'dimension': 'openness', 'reverse': False},
        }
        
        # Initialize dimension scores
        dimension_scores = {
            'openness': [],
            'conscientiousness': [],
            'extraversion': [],
            'agreeableness': [],
            'neuroticism': []
        }
        
        # Process answers
        for question_id, answer in answers.items():
            q_id = int(question_id)
            if q_id in question_dimensions:
                dimension = question_dimensions[q_id]['dimension']
                reverse = question_dimensions[q_id]['reverse']
                
                # Reverse score if needed (1->5, 2->4, 3->3, 4->2, 5->1)
                if reverse:
                    score = 6 - int(answer)
                else:
                    score = int(answer)
                
                dimension_scores[dimension].append(score)
        
        # Calculate average scores for each dimension (0-100 scale)
        final_scores = {}
        for dimension, scores in dimension_scores.items():
            if scores:
                avg_score = statistics.mean(scores)
                # Convert to 0-100 scale
                final_scores[dimension] = round((avg_score - 1) / 4 * 100, 1)
            else:
                final_scores[dimension] = 50.0  # Default to neutral
        
        # Generate analysis
        analysis = PremiumTestScoringService._generate_big_five_analysis(final_scores)
        
        # Calculate confidence based on consistency of answers
        confidence = PremiumTestScoringService._calculate_consistency_confidence(dimension_scores)
        
        return final_scores, analysis, confidence
    
    @staticmethod
    def score_values(answers: Dict[str, Any]) -> Tuple[Dict[str, float], Dict[str, Any], float]:
        """Score Schwartz Values test"""
        
        # Map questions to value dimensions
        value_dimensions = {
            # Power
            1: 'power', 2: 'power', 3: 'power', 4: 'power',
            # Achievement  
            5: 'achievement', 6: 'achievement', 7: 'achievement', 8: 'achievement',
            # Hedonism
            9: 'hedonism', 10: 'hedonism', 11: 'hedonism', 12: 'hedonism',
            # Stimulation
            13: 'stimulation', 14: 'stimulation', 15: 'stimulation', 16: 'stimulation',
            # Self-Direction
            17: 'self_direction', 18: 'self_direction', 19: 'self_direction', 20: 'self_direction',
            # Universalism
            21: 'universalism', 22: 'universalism', 23: 'universalism', 24: 'universalism',
            # Benevolence
            25: 'benevolence', 26: 'benevolence', 27: 'benevolence', 28: 'benevolence',
            # Tradition
            29: 'tradition', 30: 'tradition', 31: 'tradition', 32: 'tradition',
            # Conformity
            33: 'conformity', 34: 'conformity', 35: 'conformity', 36: 'conformity',
            # Security
            37: 'security', 38: 'security', 39: 'security', 40: 'security', 41: 'security', 42: 'security'
        }
        
        # Initialize value scores
        value_scores = {
            'power': [], 'achievement': [], 'hedonism': [], 'stimulation': [],
            'self_direction': [], 'universalism': [], 'benevolence': [], 
            'tradition': [], 'conformity': [], 'security': []
        }
        
        # Process answers
        for question_id, answer in answers.items():
            q_id = int(question_id)
            if q_id in value_dimensions:
                dimension = value_dimensions[q_id]
                value_scores[dimension].append(int(answer))
        
        # Calculate final scores
        final_scores = {}
        for value, scores in value_scores.items():
            if scores:
                avg_score = statistics.mean(scores)
                final_scores[value] = round((avg_score - 1) / 4 * 100, 1)
            else:
                final_scores[value] = 50.0
        
        # Generate analysis
        analysis = PremiumTestScoringService._generate_values_analysis(final_scores)
        
        # Calculate confidence
        confidence = PremiumTestScoringService._calculate_consistency_confidence(value_scores)
        
        return final_scores, analysis, confidence
    
    @staticmethod 
    def score_riasec(answers: Dict[str, Any]) -> Tuple[Dict[str, float], Dict[str, Any], float]:
        """Score Holland RIASEC career interest test"""
        
        # Map questions to RIASEC dimensions
        riasec_dimensions = {
            # Realistic (1-7)
            1: 'realistic', 2: 'realistic', 3: 'realistic', 4: 'realistic',
            5: 'realistic', 6: 'realistic', 7: 'realistic',
            
            # Investigative (8-14)
            8: 'investigative', 9: 'investigative', 10: 'investigative', 11: 'investigative',
            12: 'investigative', 13: 'investigative', 14: 'investigative',
            
            # Artistic (15-21)
            15: 'artistic', 16: 'artistic', 17: 'artistic', 18: 'artistic',
            19: 'artistic', 20: 'artistic', 21: 'artistic',
            
            # Social (22-28)
            22: 'social', 23: 'social', 24: 'social', 25: 'social',
            26: 'social', 27: 'social', 28: 'social',
            
            # Enterprising (29-35)
            29: 'enterprising', 30: 'enterprising', 31: 'enterprising', 32: 'enterprising',
            33: 'enterprising', 34: 'enterprising', 35: 'enterprising',
            
            # Conventional (36-42)
            36: 'conventional', 37: 'conventional', 38: 'conventional', 39: 'conventional',
            40: 'conventional', 41: 'conventional', 42: 'conventional'
        }
        
        # Initialize RIASEC scores
        riasec_scores = {
            'realistic': [], 'investigative': [], 'artistic': [],
            'social': [], 'enterprising': [], 'conventional': []
        }
        
        # Process answers
        for question_id, answer in answers.items():
            q_id = int(question_id)
            if q_id in riasec_dimensions:
                dimension = riasec_dimensions[q_id]
                riasec_scores[dimension].append(int(answer))
        
        # Calculate final scores
        final_scores = {}
        for interest, scores in riasec_scores.items():
            if scores:
                avg_score = statistics.mean(scores)
                final_scores[interest] = round((avg_score - 1) / 4 * 100, 1)
            else:
                final_scores[interest] = 50.0
        
        # Generate analysis
        analysis = PremiumTestScoringService._generate_riasec_analysis(final_scores)
        
        # Calculate confidence
        confidence = PremiumTestScoringService._calculate_consistency_confidence(riasec_scores)
        
        return final_scores, analysis, confidence
    
    @staticmethod
    def score_dark_triad(answers: Dict[str, Any]) -> Tuple[Dict[str, float], Dict[str, Any], float]:
        """Score Dark Triad (SD3) test"""
        
        # Map questions to dark triad dimensions
        triad_dimensions = {
            # Machiavellianism (1-14)
            1: 'machiavellianism', 2: 'machiavellianism', 3: 'machiavellianism', 4: 'machiavellianism',
            5: 'machiavellianism', 6: 'machiavellianism', 7: 'machiavellianism', 8: 'machiavellianism',
            9: 'machiavellianism', 10: 'machiavellianism', 11: 'machiavellianism', 12: 'machiavellianism',
            13: 'machiavellianism', 14: 'machiavellianism',
            
            # Narcissism (15-28)
            15: 'narcissism', 16: 'narcissism', 17: 'narcissism', 18: 'narcissism',
            19: 'narcissism', 20: 'narcissism', 21: 'narcissism', 22: 'narcissism',
            23: 'narcissism', 24: 'narcissism', 25: 'narcissism', 26: 'narcissism',
            27: 'narcissism', 28: 'narcissism',
            
            # Psychopathy (29-42)
            29: 'psychopathy', 30: 'psychopathy', 31: 'psychopathy', 32: 'psychopathy',
            33: 'psychopathy', 34: 'psychopathy', 35: 'psychopathy', 36: 'psychopathy',
            37: 'psychopathy', 38: 'psychopathy', 39: 'psychopathy', 40: 'psychopathy',
            41: 'psychopathy', 42: 'psychopathy'
        }
        
        # Reverse scored items
        reverse_items = {11, 16, 18, 31, 33, 37, 39}
        
        # Initialize scores
        triad_scores = {
            'machiavellianism': [], 'narcissism': [], 'psychopathy': []
        }
        
        # Process answers
        for question_id, answer in answers.items():
            q_id = int(question_id)
            if q_id in triad_dimensions:
                dimension = triad_dimensions[q_id]
                
                # Reverse score if needed
                if q_id in reverse_items:
                    score = 6 - int(answer)
                else:
                    score = int(answer)
                
                triad_scores[dimension].append(score)
        
        # Calculate final scores
        final_scores = {}
        for trait, scores in triad_scores.items():
            if scores:
                avg_score = statistics.mean(scores)
                final_scores[trait] = round((avg_score - 1) / 4 * 100, 1)
            else:
                final_scores[trait] = 50.0
        
        # Generate analysis
        analysis = PremiumTestScoringService._generate_dark_triad_analysis(final_scores)
        
        # Calculate confidence
        confidence = PremiumTestScoringService._calculate_consistency_confidence(triad_scores)
        
        return final_scores, analysis, confidence
    
    @staticmethod
    def score_grit(answers: Dict[str, Any]) -> Tuple[Dict[str, float], Dict[str, Any], float]:
        """Score Grit and Goal Orientation test"""
        
        # Map questions to dimensions
        grit_dimensions = {
            # Grit - Consistency (1-6)
            1: 'grit_consistency', 2: 'grit_consistency', 3: 'grit_consistency',
            4: 'grit_consistency', 5: 'grit_consistency', 6: 'grit_consistency',
            
            # Grit - Perseverance (7-12)
            7: 'grit_perseverance', 8: 'grit_perseverance', 9: 'grit_perseverance',
            10: 'grit_perseverance', 11: 'grit_perseverance', 12: 'grit_perseverance',
            
            # Performance Goal Orientation (13-22)
            13: 'performance_goal', 14: 'performance_goal', 15: 'performance_goal', 16: 'performance_goal',
            17: 'performance_goal', 18: 'performance_goal', 19: 'performance_goal', 20: 'performance_goal',
            21: 'performance_goal', 22: 'performance_goal',
            
            # Learning Goal Orientation (23-32)
            23: 'learning_goal', 24: 'learning_goal', 25: 'learning_goal', 26: 'learning_goal',
            27: 'learning_goal', 28: 'learning_goal', 29: 'learning_goal', 30: 'learning_goal',
            31: 'learning_goal', 32: 'learning_goal',
            
            # Avoidance Goal Orientation (33-42)
            33: 'avoidance_goal', 34: 'avoidance_goal', 35: 'avoidance_goal', 36: 'avoidance_goal',
            37: 'avoidance_goal', 38: 'avoidance_goal', 39: 'avoidance_goal', 40: 'avoidance_goal',
            41: 'avoidance_goal', 42: 'avoidance_goal'
        }
        
        # Reverse scored items (for grit consistency)
        reverse_items = {1, 3, 5, 6}
        
        # Initialize scores
        grit_scores = {
            'grit_consistency': [], 'grit_perseverance': [],
            'performance_goal': [], 'learning_goal': [], 'avoidance_goal': []
        }
        
        # Process answers
        for question_id, answer in answers.items():
            q_id = int(question_id)
            if q_id in grit_dimensions:
                dimension = grit_dimensions[q_id]
                
                # Reverse score if needed
                if q_id in reverse_items:
                    score = 6 - int(answer)
                else:
                    score = int(answer)
                
                grit_scores[dimension].append(score)
        
        # Calculate final scores
        final_scores = {}
        for dimension, scores in grit_scores.items():
            if scores:
                avg_score = statistics.mean(scores)
                final_scores[dimension] = round((avg_score - 1) / 4 * 100, 1)
            else:
                final_scores[dimension] = 50.0
        
        # Calculate overall grit score
        if final_scores['grit_consistency'] and final_scores['grit_perseverance']:
            final_scores['overall_grit'] = round((final_scores['grit_consistency'] + final_scores['grit_perseverance']) / 2, 1)
        
        # Generate analysis
        analysis = PremiumTestScoringService._generate_grit_analysis(final_scores)
        
        # Calculate confidence
        confidence = PremiumTestScoringService._calculate_consistency_confidence(grit_scores)
        
        return final_scores, analysis, confidence
    
    @staticmethod
    def score_chronotype(answers: Dict[str, Any]) -> Tuple[Dict[str, float], Dict[str, Any], float]:
        """Score Chronotype and Sleep Quality test"""
        
        # Map questions to dimensions
        chrono_dimensions = {
            # Morningness-Eveningness (1-10)
            1: 'morningness', 2: 'morningness', 3: 'morningness', 4: 'morningness',
            5: 'morningness', 6: 'morningness', 7: 'morningness', 8: 'morningness',
            9: 'morningness', 10: 'morningness',
            
            # Sleep Quality (11-25)
            11: 'sleep_quality', 12: 'sleep_quality', 13: 'sleep_quality', 14: 'sleep_quality',
            15: 'sleep_quality', 16: 'sleep_quality', 17: 'sleep_quality', 18: 'sleep_quality',
            19: 'sleep_quality', 20: 'sleep_quality', 21: 'sleep_quality', 22: 'sleep_quality',
            23: 'sleep_quality', 24: 'sleep_quality', 25: 'sleep_quality',
            
            # Sleep Hygiene (26-42)
            26: 'sleep_hygiene', 27: 'sleep_hygiene', 28: 'sleep_hygiene', 29: 'sleep_hygiene',
            30: 'sleep_hygiene', 31: 'sleep_hygiene', 32: 'sleep_hygiene', 33: 'sleep_hygiene',
            34: 'sleep_hygiene', 35: 'sleep_hygiene', 36: 'sleep_hygiene', 37: 'sleep_hygiene',
            38: 'sleep_hygiene', 39: 'sleep_hygiene', 40: 'sleep_hygiene', 41: 'sleep_hygiene',
            42: 'sleep_hygiene'
        }
        
        # Reverse scored items
        reverse_items = {11, 12, 13, 16, 17, 19, 20, 21, 22, 24}
        
        # Initialize scores
        chrono_scores = {
            'morningness': [], 'sleep_quality': [], 'sleep_hygiene': []
        }
        
        # Process answers
        for question_id, answer in answers.items():
            q_id = int(question_id)
            if q_id in chrono_dimensions:
                dimension = chrono_dimensions[q_id]
                
                # Handle different question types
                if q_id <= 10:  # MEQ questions with specific scoring
                    if isinstance(answer, dict) and 'score' in answer:
                        score = answer['score']
                    else:
                        score = int(answer)
                else:
                    # Regular Likert scale questions
                    if q_id in reverse_items:
                        score = 6 - int(answer)
                    else:
                        score = int(answer)
                
                chrono_scores[dimension].append(score)
        
        # Calculate final scores
        final_scores = {}
        for dimension, scores in chrono_scores.items():
            if scores:
                if dimension == 'morningness':
                    # Special scoring for MEQ
                    total_score = sum(scores)
                    final_scores[dimension] = round((total_score / len(scores)) * 10, 1)
                else:
                    avg_score = statistics.mean(scores)
                    final_scores[dimension] = round((avg_score - 1) / 4 * 100, 1)
            else:
                final_scores[dimension] = 50.0
        
        # Generate analysis
        analysis = PremiumTestScoringService._generate_chronotype_analysis(final_scores)
        
        # Calculate confidence
        confidence = PremiumTestScoringService._calculate_consistency_confidence(chrono_scores)
        
        return final_scores, analysis, confidence
    
    @staticmethod
    def score_numerology(answers: Dict[str, Any]) -> Tuple[Dict[str, Any], Dict[str, Any], float]:
        """Score Numerology profile based on birth date and name"""
        
        birth_date = answers.get('1')  # Birth date
        birth_name = answers.get('2', '').upper()  # Full birth name
        current_name = answers.get('3', '').upper()  # Current name
        focus_area = answers.get('4', 'life-path')  # Focus area
        
        if not birth_date or not birth_name:
            return {}, {"error": "Birth date and name are required"}, 0.0
        
        # Parse birth date
        try:
            if isinstance(birth_date, str):
                if '/' in birth_date:
                    month, day, year = map(int, birth_date.split('/'))
                else:
                    # Handle other date formats
                    from datetime import datetime
                    date_obj = datetime.strptime(birth_date, '%Y-%m-%d')
                    month, day, year = date_obj.month, date_obj.day, date_obj.year
            else:
                # Assume it's already parsed
                month, day, year = birth_date['month'], birth_date['day'], birth_date['year']
        except:
            return {}, {"error": "Invalid birth date format"}, 0.0
        
        # Calculate numerology numbers
        def reduce_number(num):
            """Reduce number to single digit (except master numbers 11, 22, 33)"""
            while num > 9 and num not in [11, 22, 33]:
                num = sum(int(digit) for digit in str(num))
            return num
        
        def letter_to_number(letter):
            """Convert letter to numerology number"""
            letter_values = {
                'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9,
                'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 6, 'P': 7, 'Q': 8, 'R': 9,
                'S': 1, 'T': 2, 'U': 3, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8
            }
            return letter_values.get(letter, 0)
        
        # Life Path Number (from birth date)
        life_path = reduce_number(month + day + sum(int(digit) for digit in str(year)))
        
        # Expression Number (from birth name)
        expression = reduce_number(sum(letter_to_number(char) for char in birth_name.replace(' ', '')))
        
        # Soul Urge Number (vowels in name)
        vowels = 'AEIOU'
        soul_urge = reduce_number(sum(letter_to_number(char) for char in birth_name if char in vowels))
        
        # Personality Number (consonants in name)
        personality = reduce_number(sum(letter_to_number(char) for char in birth_name if char.isalpha() and char not in vowels))
        
        # Birthday Number
        birthday = reduce_number(day)
        
        scores = {
            'life_path': life_path,
            'expression': expression,
            'soul_urge': soul_urge,
            'personality': personality,
            'birthday': birthday
        }
        
        # Generate analysis
        analysis = PremiumTestScoringService._generate_numerology_analysis(scores, focus_area)
        
        return scores, analysis, 0.95  # High confidence for mathematical calculation
    
    @staticmethod
    def _calculate_consistency_confidence(dimension_scores: Dict[str, List[float]]) -> float:
        """Calculate confidence based on answer consistency"""
        all_variances = []
        
        for dimension, scores in dimension_scores.items():
            if len(scores) > 1:
                variance = statistics.variance(scores)
                all_variances.append(variance)
        
        if not all_variances:
            return 0.75  # Default confidence
        
        # Lower variance = higher confidence
        avg_variance = statistics.mean(all_variances)
        # Convert variance to confidence (inverse relationship)
        confidence = max(0.5, min(0.95, 0.95 - (avg_variance / 10)))
        
        return round(confidence, 2)
    
    @staticmethod
    def _generate_big_five_analysis(scores: Dict[str, float]) -> Dict[str, Any]:
        """Generate Big Five personality analysis"""
        
        # Determine personality profile
        profile = {}
        for dimension, score in scores.items():
            if score >= 70:
                level = "Very High"
            elif score >= 60:
                level = "High"
            elif score >= 40:
                level = "Moderate"
            elif score >= 30:
                level = "Low"
            else:
                level = "Very Low"
            
            profile[dimension] = {
                "score": score,
                "level": level,
                "description": PremiumTestScoringService._get_big_five_description(dimension, score)
            }
        
        return {
            "profile": profile,
            "summary": PremiumTestScoringService._generate_big_five_summary(scores),
            "strengths": PremiumTestScoringService._identify_big_five_strengths(scores),
            "development_areas": PremiumTestScoringService._identify_big_five_development_areas(scores)
        }
    
    @staticmethod
    def _get_big_five_description(dimension: str, score: float) -> str:
        """Get description for Big Five dimension score"""
        descriptions = {
            "openness": {
                "high": "You are imaginative, creative, and open to new experiences. You enjoy abstract thinking and artistic pursuits.",
                "moderate": "You balance practicality with openness to new ideas. You appreciate both tradition and innovation.",
                "low": "You prefer familiar approaches and concrete thinking. You value practicality and established methods."
            },
            "conscientiousness": {
                "high": "You are organized, disciplined, and goal-oriented. You plan ahead and follow through on commitments.",
                "moderate": "You balance structure with flexibility. You can be organized when needed but also adaptable.",
                "low": "You prefer spontaneity and flexibility. You may struggle with long-term planning and organization."
            },
            "extraversion": {
                "high": "You are outgoing, energetic, and social. You gain energy from being around others.",
                "moderate": "You balance social interaction with solitude. You can be outgoing in some situations and reserved in others.",
                "low": "You prefer quiet environments and small groups. You gain energy from solitude and reflection."
            },
            "agreeableness": {
                "high": "You are cooperative, trusting, and empathetic. You prioritize harmony and helping others.",
                "moderate": "You balance cooperation with assertiveness. You can be both supportive and competitive when needed.",
                "low": "You are independent and competitive. You prioritize your own needs and can be skeptical of others' motives."
            },
            "neuroticism": {
                "high": "You may experience more frequent stress, anxiety, or emotional ups and downs. You are sensitive to negative emotions.",
                "moderate": "You have typical emotional responses. You can handle stress reasonably well but may occasionally feel overwhelmed.",
                "low": "You are emotionally stable and resilient. You remain calm under pressure and recover quickly from setbacks."
            }
        }
        
        if score >= 60:
            level = "high"
        elif score >= 40:
            level = "moderate"
        else:
            level = "low"
        
        return descriptions.get(dimension, {}).get(level, "No description available")
    
    @staticmethod
    def _generate_big_five_summary(scores: Dict[str, float]) -> str:
        """Generate overall Big Five summary"""
        highest = max(scores, key=scores.get)
        lowest = min(scores, key=scores.get)
        
        return f"Your personality is characterized by {highest.replace('_', ' ')} as your strongest trait and {lowest.replace('_', ' ')} as your most moderate trait. This combination creates a unique personality profile that influences how you interact with the world, make decisions, and form relationships."
    
    @staticmethod
    def _identify_big_five_strengths(scores: Dict[str, float]) -> List[str]:
        """Identify strengths based on Big Five scores"""
        strengths = []
        
        if scores['openness'] >= 60:
            strengths.append("Creative and innovative thinking")
        if scores['conscientiousness'] >= 60:
            strengths.append("Strong organizational and planning skills")
        if scores['extraversion'] >= 60:
            strengths.append("Excellent social and communication skills")
        if scores['agreeableness'] >= 60:
            strengths.append("Strong interpersonal and teamwork abilities")
        if scores['neuroticism'] <= 40:
            strengths.append("Emotional stability and stress resilience")
        
        return strengths if strengths else ["Balanced personality across all dimensions"]
    
    @staticmethod
    def _identify_big_five_development_areas(scores: Dict[str, float]) -> List[str]:
        """Identify development areas based on Big Five scores"""
        development_areas = []
        
        if scores['openness'] <= 40:
            development_areas.append("Exploring new experiences and creative pursuits")
        if scores['conscientiousness'] <= 40:
            development_areas.append("Improving organization and goal-setting skills")
        if scores['extraversion'] <= 40:
            development_areas.append("Building social connections and networking")
        if scores['agreeableness'] <= 40:
            development_areas.append("Developing empathy and collaborative skills")
        if scores['neuroticism'] >= 60:
            development_areas.append("Managing stress and emotional regulation")
        
        return development_areas if development_areas else ["Continue maintaining your balanced personality"]
    
    # Additional analysis methods for other tests would go here...
    # (Due to length constraints, I'm showing the pattern for Big Five)
    
    @staticmethod
    def _generate_values_analysis(scores: Dict[str, float]) -> Dict[str, Any]:
        """Generate Schwartz Values analysis"""
        # Simplified analysis - in practice would be more detailed
        top_values = sorted(scores.items(), key=lambda x: x[1], reverse=True)[:3]
        return {
            "top_values": [{"value": val, "score": score} for val, score in top_values],
            "summary": f"Your core values are centered around {top_values[0][0].replace('_', ' ')}, {top_values[1][0].replace('_', ' ')}, and {top_values[2][0].replace('_', ' ')}."
        }
    
    @staticmethod
    def _generate_riasec_analysis(scores: Dict[str, float]) -> Dict[str, Any]:
        """Generate RIASEC career analysis"""
        top_interests = sorted(scores.items(), key=lambda x: x[1], reverse=True)[:3]
        return {
            "top_interests": [{"interest": interest, "score": score} for interest, score in top_interests],
            "career_code": "".join([interest[0].upper() for interest, _ in top_interests]),
            "summary": f"Your career interests align most with {top_interests[0][0]}, {top_interests[1][0]}, and {top_interests[2][0]} fields."
        }
    
    @staticmethod
    def _generate_dark_triad_analysis(scores: Dict[str, float]) -> Dict[str, Any]:
        """Generate Dark Triad analysis with sensitivity"""
        return {
            "scores": scores,
            "summary": "These scores reflect certain personality tendencies. Remember that everyone has complex motivations, and these results are for self-awareness and growth.",
            "note": "High scores don't define you - they're opportunities for self-reflection and personal development."
        }
    
    @staticmethod
    def _generate_grit_analysis(scores: Dict[str, float]) -> Dict[str, Any]:
        """Generate Grit and Goal Orientation analysis"""
        overall_grit = scores.get('overall_grit', 50)
        return {
            "grit_level": "High" if overall_grit >= 70 else "Moderate" if overall_grit >= 40 else "Developing",
            "scores": scores,
            "summary": f"Your grit score of {overall_grit}/100 indicates {'strong' if overall_grit >= 70 else 'moderate' if overall_grit >= 40 else 'developing'} persistence and passion for long-term goals."
        }
    
    @staticmethod
    def _generate_chronotype_analysis(scores: Dict[str, float]) -> Dict[str, Any]:
        """Generate Chronotype analysis"""
        morningness = scores.get('morningness', 50)
        
        if morningness >= 70:
            chronotype = "Strong Morning Type"
        elif morningness >= 60:
            chronotype = "Moderate Morning Type"
        elif morningness >= 40:
            chronotype = "Neither Type"
        elif morningness >= 30:
            chronotype = "Moderate Evening Type"
        else:
            chronotype = "Strong Evening Type"
        
        return {
            "chronotype": chronotype,
            "scores": scores,
            "summary": f"You are a {chronotype.lower()}, which affects your optimal times for productivity, exercise, and social activities."
        }
    
    @staticmethod
    def _generate_numerology_analysis(scores: Dict[str, Any], focus_area: str) -> Dict[str, Any]:
        """Generate Numerology analysis"""
        
        number_meanings = {
            1: "Leadership, independence, innovation",
            2: "Cooperation, diplomacy, partnership",
            3: "Creativity, communication, optimism",
            4: "Stability, hard work, organization",
            5: "Freedom, adventure, versatility",
            6: "Nurturing, responsibility, healing",
            7: "Spirituality, analysis, introspection",
            8: "Material success, authority, achievement",
            9: "Completion, humanitarianism, wisdom",
            11: "Intuition, inspiration, enlightenment",
            22: "Master builder, practical idealism",
            33: "Master teacher, spiritual healing"
        }
        
        analysis = {}
        for number_type, number in scores.items():
            analysis[number_type] = {
                "number": number,
                "meaning": number_meanings.get(number, "Unique spiritual significance")
            }
        
        return {
            "numbers": analysis,
            "life_path_focus": f"Your life path number {scores['life_path']} suggests a journey focused on {number_meanings.get(scores['life_path'], 'spiritual growth')}",
            "summary": f"Your numerology profile reveals a combination of {number_meanings.get(scores['life_path'], 'spiritual')} and {number_meanings.get(scores['expression'], 'expressive')} energies."
        }