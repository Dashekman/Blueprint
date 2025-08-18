// Premium Personality Tests - Comprehensive Question Sets
// Each test has 40+ questions for maximum precision

export const premiumTests = {
  bigFive: {
    id: 'bigFive',
    name: 'Big Five Personality (NEO-PI)',
    subtitle: 'The Gold Standard of Personality Psychology',
    description: 'Discover your core personality dimensions through the most scientifically validated model in psychology. Unlock deep insights into your Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism.',
    duration: '15-20 minutes',
    isPremium: true,
    category: 'Core Personality',
    puzzlePiece: 'constellation-core',
    icon: '🧠',
    color: 'blue',
    dimensions: ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism'],
    questions: [
      // Extraversion (8 questions)
      { id: 1, text: "I am the life of the party.", dimension: "extraversion", reverse: false },
      { id: 2, text: "I don't talk a lot.", dimension: "extraversion", reverse: true },
      { id: 3, text: "I feel comfortable around people.", dimension: "extraversion", reverse: false },
      { id: 4, text: "I keep in the background.", dimension: "extraversion", reverse: true },
      { id: 5, text: "I start conversations.", dimension: "extraversion", reverse: false },
      { id: 6, text: "I have little to say.", dimension: "extraversion", reverse: true },
      { id: 7, text: "I talk to a lot of different people at parties.", dimension: "extraversion", reverse: false },
      { id: 8, text: "I don't like to draw attention to myself.", dimension: "extraversion", reverse: true },
      
      // Agreeableness (8 questions)
      { id: 9, text: "I feel others' emotions.", dimension: "agreeableness", reverse: false },
      { id: 10, text: "I am not interested in other people's problems.", dimension: "agreeableness", reverse: true },
      { id: 11, text: "I feel little concern for others.", dimension: "agreeableness", reverse: true },
      { id: 12, text: "I insult people.", dimension: "agreeableness", reverse: true },
      { id: 13, text: "I have a soft heart.", dimension: "agreeableness", reverse: false },
      { id: 14, text: "I am not really interested in others.", dimension: "agreeableness", reverse: true },
      { id: 15, text: "I take time out for others.", dimension: "agreeableness", reverse: false },
      { id: 16, text: "I sympathize with others' feelings.", dimension: "agreeableness", reverse: false },
      
      // Conscientiousness (8 questions)
      { id: 17, text: "I am always prepared.", dimension: "conscientiousness", reverse: false },
      { id: 18, text: "I leave my belongings around.", dimension: "conscientiousness", reverse: true },
      { id: 19, text: "I pay attention to details.", dimension: "conscientiousness", reverse: false },
      { id: 20, text: "I make a mess of things.", dimension: "conscientiousness", reverse: true },
      { id: 21, text: "I get chores done right away.", dimension: "conscientiousness", reverse: false },
      { id: 22, text: "I often forget to put things back in their proper place.", dimension: "conscientiousness", reverse: true },
      { id: 23, text: "I like order.", dimension: "conscientiousness", reverse: false },
      { id: 24, text: "I shirk my duties.", dimension: "conscientiousness", reverse: true },
      
      // Neuroticism (8 questions)
      { id: 25, text: "I get stressed out easily.", dimension: "neuroticism", reverse: false },
      { id: 26, text: "I am relaxed most of the time.", dimension: "neuroticism", reverse: true },
      { id: 27, text: "I worry about things.", dimension: "neuroticism", reverse: false },
      { id: 28, text: "I seldom feel blue.", dimension: "neuroticism", reverse: true },
      { id: 29, text: "I am easily disturbed.", dimension: "neuroticism", reverse: false },
      { id: 30, text: "I get upset easily.", dimension: "neuroticism", reverse: false },
      { id: 31, text: "I change my mood a lot.", dimension: "neuroticism", reverse: false },
      { id: 32, text: "I have frequent mood swings.", dimension: "neuroticism", reverse: false },
      
      // Openness (8+ questions)
      { id: 33, text: "I have a rich vocabulary.", dimension: "openness", reverse: false },
      { id: 34, text: "I have difficulty understanding abstract ideas.", dimension: "openness", reverse: true },
      { id: 35, text: "I have a vivid imagination.", dimension: "openness", reverse: false },
      { id: 36, text: "I am not interested in abstract ideas.", dimension: "openness", reverse: true },
      { id: 37, text: "I have excellent ideas.", dimension: "openness", reverse: false },
      { id: 38, text: "I do not have a good imagination.", dimension: "openness", reverse: true },
      { id: 39, text: "I am quick to understand things.", dimension: "openness", reverse: false },
      { id: 40, text: "I use difficult words.", dimension: "openness", reverse: false },
      { id: 41, text: "I spend time reflecting on things.", dimension: "openness", reverse: false },
      { id: 42, text: "I am full of ideas.", dimension: "openness", reverse: false }
    ]
  },

  values: {
    id: 'values',
    name: 'Personal Values (Schwartz Portrait)',
    subtitle: 'What Truly Motivates You',
    description: 'Uncover your core values and life priorities through the comprehensive Schwartz Value System. Understand what drives your decisions and shapes your worldview.',
    duration: '12-15 minutes',
    isPremium: true,
    category: 'Core Motivations',
    puzzlePiece: 'constellation-values',
    icon: '⭐',
    color: 'purple',
    dimensions: ['Power', 'Achievement', 'Hedonism', 'Stimulation', 'Self-Direction', 'Universalism', 'Benevolence', 'Tradition', 'Conformity', 'Security'],
    questions: [
      // Power (4 questions)
      { id: 1, text: "It's important to have the respect and admiration of others.", dimension: "power" },
      { id: 2, text: "It's important to be wealthy and have expensive things.", dimension: "power" },
      { id: 3, text: "It's important to be in charge and tell others what to do.", dimension: "power" },
      { id: 4, text: "It's important that people recognize what you achieve.", dimension: "power" },
      
      // Achievement (4 questions)
      { id: 5, text: "It's important to show your abilities and be admired for them.", dimension: "achievement" },
      { id: 6, text: "It's important to be very successful and that people recognize your achievements.", dimension: "achievement" },
      { id: 7, text: "It's important to be ambitious and want to show how capable you are.", dimension: "achievement" },
      { id: 8, text: "It's important to get ahead in life and be more successful than others.", dimension: "achievement" },
      
      // Hedonism (4 questions)
      { id: 9, text: "It's important to have a good time and treat yourself well.", dimension: "hedonism" },
      { id: 10, text: "It's important to seek fun and things that give you pleasure.", dimension: "hedonism" },
      { id: 11, text: "It's important to enjoy life's pleasures.", dimension: "hedonism" },
      { id: 12, text: "It's important to have all sorts of experiences and enjoy them.", dimension: "hedonism" },
      
      // Stimulation (4 questions)
      { id: 13, text: "It's important to try new and different things in life.", dimension: "stimulation" },
      { id: 14, text: "It's important to take risks and seek adventure.", dimension: "stimulation" },
      { id: 15, text: "It's important to have an exciting and challenging life.", dimension: "stimulation" },
      { id: 16, text: "It's important to be daring and seek adventure and risk.", dimension: "stimulation" },
      
      // Self-Direction (4 questions)
      { id: 17, text: "It's important to think of new ideas and be creative.", dimension: "self-direction" },
      { id: 18, text: "It's important to make your own decisions about your life.", dimension: "self-direction" },
      { id: 19, text: "It's important to be independent and self-reliant.", dimension: "self-direction" },
      { id: 20, text: "It's important to be curious and try to understand everything.", dimension: "self-direction" },
      
      // Universalism (4 questions)
      { id: 21, text: "It's important that every person in the world has equal opportunities.", dimension: "universalism" },
      { id: 22, text: "It's important to listen to people who are different from you.", dimension: "universalism" },
      { id: 23, text: "It's important to protect the environment and care for nature.", dimension: "universalism" },
      { id: 24, text: "It's important to understand different kinds of people.", dimension: "universalism" },
      
      // Benevolence (4 questions)  
      { id: 25, text: "It's important to help the people around you.", dimension: "benevolence" },
      { id: 26, text: "It's important to care for the well-being of people you're close to.", dimension: "benevolence" },
      { id: 27, text: "It's important to be loyal to your friends and family.", dimension: "benevolence" },
      { id: 28, text: "It's important to forgive people who have hurt you.", dimension: "benevolence" },
      
      // Tradition (4 questions)
      { id: 29, text: "It's important to follow traditions and customs.", dimension: "tradition" },
      { id: 30, text: "It's important to maintain traditional values and ways of thinking.", dimension: "tradition" },
      { id: 31, text: "It's important to respect the customs that traditional culture provides.", dimension: "tradition" },
      { id: 32, text: "It's important to preserve cultural traditions and heritage.", dimension: "tradition" },
      
      // Conformity (4 questions)
      { id: 33, text: "It's important to always behave properly and avoid doing anything people would say is wrong.", dimension: "conformity" },
      { id: 34, text: "It's important to be polite to other people all the time.", dimension: "conformity" },
      { id: 35, text: "It's important never to annoy or irritate others.", dimension: "conformity" },
      { id: 36, text: "It's important to avoid anything that people would consider inappropriate.", dimension: "conformity" },
      
      // Security (4+ questions)
      { id: 37, text: "It's important to live in secure and safe surroundings.", dimension: "security" },
      { id: 38, text: "It's important that the government provides safety from all threats.", dimension: "security" },
      { id: 39, text: "It's important to have a stable government and social order.", dimension: "security" },
      { id: 40, text: "It's important to avoid disease and protect your health.", dimension: "security" },
      { id: 41, text: "It's important to have financial security and not worry about money.", dimension: "security" },
      { id: 42, text: "It's important to live in a predictable and orderly world.", dimension: "security" }
    ]
  },

  riasec: {
    id: 'riasec',
    name: 'Career Interest (Holland RIASEC)',
    subtitle: 'Your Professional DNA',
    description: 'Discover your ideal career path through Holland\'s scientifically-proven career interest model. Find careers that align with your natural interests and personality.',
    duration: '10-12 minutes',
    isPremium: true,
    category: 'Career & Work',
    puzzlePiece: 'constellation-career',
    icon: '🎯',
    color: 'green',
    dimensions: ['Realistic', 'Investigative', 'Artistic', 'Social', 'Enterprising', 'Conventional'],
    questions: [
      // Realistic (7 questions)
      { id: 1, text: "I like to work on cars, machines, or other mechanical equipment.", dimension: "realistic" },
      { id: 2, text: "I like to build things with my hands.", dimension: "realistic" },
      { id: 3, text: "I like to work outdoors.", dimension: "realistic" },
      { id: 4, text: "I like to use tools and operate machinery.", dimension: "realistic" },
      { id: 5, text: "I like to fix or repair things.", dimension: "realistic" },
      { id: 6, text: "I like jobs that involve physical activity.", dimension: "realistic" },
      { id: 7, text: "I like to work with my hands to create or fix things.", dimension: "realistic" },
      
      // Investigative (7 questions)
      { id: 8, text: "I like to work with numbers and solve mathematical problems.", dimension: "investigative" },
      { id: 9, text: "I like to conduct scientific experiments.", dimension: "investigative" },
      { id: 10, text: "I like to analyze and understand how things work.", dimension: "investigative" },
      { id: 11, text: "I like to research and study complex topics.", dimension: "investigative" },
      { id: 12, text: "I enjoy working independently on intellectual challenges.", dimension: "investigative" },
      { id: 13, text: "I like to use scientific methods to solve problems.", dimension: "investigative" },
      { id: 14, text: "I'm curious about how and why things happen.", dimension: "investigative" },
      
      // Artistic (7 questions)
      { id: 15, text: "I like to express myself through creative work.", dimension: "artistic" },
      { id: 16, text: "I enjoy creating art, music, or writing.", dimension: "artistic" },
      { id: 17, text: "I like to work in unstructured environments.", dimension: "artistic" },
      { id: 18, text: "I like to use my imagination and creativity.", dimension: "artistic" },
      { id: 19, text: "I enjoy performing for others.", dimension: "artistic" },
      { id: 20, text: "I like to work on creative projects.", dimension: "artistic" },
      { id: 21, text: "I prefer jobs that allow for self-expression.", dimension: "artistic" },
      
      // Social (7 questions)
      { id: 22, text: "I like to help people solve their problems.", dimension: "social" },
      { id: 23, text: "I like to teach or train others.", dimension: "social" },
      { id: 24, text: "I enjoy working closely with people to help them.", dimension: "social" },
      { id: 25, text: "I like to participate in meetings and group discussions.", dimension: "social" },
      { id: 26, text: "I enjoy counseling people about their problems.", dimension: "social" },
      { id: 27, text: "I like to work in teams and collaborate with others.", dimension: "social" },
      { id: 28, text: "I want to contribute to society and help others.", dimension: "social" },
      
      // Enterprising (7 questions)
      { id: 29, text: "I like to lead others and take charge.", dimension: "enterprising" },
      { id: 30, text: "I enjoy selling products or ideas to others.", dimension: "enterprising" },
      { id: 31, text: "I like to make important decisions.", dimension: "enterprising" },
      { id: 32, text: "I enjoy competing with others to win.", dimension: "enterprising" },
      { id: 33, text: "I like to persuade others to do things my way.", dimension: "enterprising" },
      { id: 34, text: "I want to start my own business someday.", dimension: "enterprising" },
      { id: 35, text: "I like to organize activities and events.", dimension: "enterprising" },
      
      // Conventional (7+ questions)
      { id: 36, text: "I like to work with data and keep accurate records.", dimension: "conventional" },
      { id: 37, text: "I enjoy organizing information and files.", dimension: "conventional" },
      { id: 38, text: "I like to follow clearly defined procedures.", dimension: "conventional" },
      { id: 39, text: "I prefer structured work environments.", dimension: "conventional" },
      { id: 40, text: "I like to work with budgets and financial information.", dimension: "conventional" },
      { id: 41, text: "I enjoy detailed clerical or administrative work.", dimension: "conventional" },
      { id: 42, text: "I like jobs that have clear rules and procedures to follow.", dimension: "conventional" }
    ]
  },

  darkTriad: {
    id: 'darkTriad',
    name: 'Dark Triad (SD3)',
    subtitle: 'Your Shadow Self',
    description: 'Explore the darker aspects of personality through scientifically validated measures of Machiavellianism, Narcissism, and Psychopathy. Gain self-awareness for personal growth.',
    duration: '8-10 minutes',
    isPremium: true,
    category: 'Shadow Psychology',
    puzzlePiece: 'constellation-shadow',
    icon: '🌑',
    color: 'gray',
    dimensions: ['Machiavellianism', 'Narcissism', 'Psychopathy'],
    questions: [
      // Machiavellianism (14 questions)
      { id: 1, text: "It's not wise to tell your secrets.", dimension: "machiavellianism" },
      { id: 2, text: "I like to use clever manipulation to get my way.", dimension: "machiavellianism" },
      { id: 3, text: "Whatever it takes, you must get the important people on your side.", dimension: "machiavellianism" },
      { id: 4, text: "Avoid direct conflict with others because they may be useful in the future.", dimension: "machiavellianism" },
      { id: 5, text: "It's wise to keep track of information that you can use against people later.", dimension: "machiavellianism" },
      { id: 6, text: "You should wait for the right time to get back at people.", dimension: "machiavellianism" },
      { id: 7, text: "There are things you should hide from other people to preserve your reputation.", dimension: "machiavellianism" },
      { id: 8, text: "Make sure your plans benefit yourself, not others.", dimension: "machiavellianism" },
      { id: 9, text: "Most people can be manipulated.", dimension: "machiavellianism" },
      { id: 10, text: "People see me as a natural leader.", dimension: "machiavellianism" },
      { id: 11, text: "I hate being the center of attention.", dimension: "machiavellianism", reverse: true },
      { id: 12, text: "Many group activities tend to be dull without me.", dimension: "machiavellianism" },
      { id: 13, text: "I know that I am special because everyone keeps telling me so.", dimension: "machiavellianism" },
      { id: 14, text: "I like to get acquainted with important people.", dimension: "machiavellianism" },
      
      // Narcissism (14 questions)
      { id: 15, text: "I like to get acquainted with important people.", dimension: "narcissism" },
      { id: 16, text: "I feel embarrassed if someone compliments me.", dimension: "narcissism", reverse: true },
      { id: 17, text: "I have been compared to famous people.", dimension: "narcissism" },
      { id: 18, text: "I am an average person.", dimension: "narcissism", reverse: true },
      { id: 19, text: "I insist on getting the respect I deserve.", dimension: "narcissism" },
      { id: 20, text: "I like to show off my body.", dimension: "narcissism" },
      { id: 21, text: "I can read people like a book.", dimension: "narcissism" },
      { id: 22, text: "I see myself as a good leader.", dimension: "narcissism" },
      { id: 23, text: "I am more capable than other people.", dimension: "narcissism" },
      { id: 24, text: "I am going to be a great person.", dimension: "narcissism" },
      { id: 25, text: "I can make anybody believe anything I want them to.", dimension: "narcissism" },
      { id: 26, text: "People suffering from incurable diseases should have the choice of being put painlessly to death.", dimension: "narcissism" },
      { id: 27, text: "I am not concerned with what other people think of me.", dimension: "narcissism" },
      { id: 28, text: "I would like to be a recognized authority on some subject.", dimension: "narcissism" },
      
      // Psychopathy (14+ questions)
      { id: 29, text: "It's true that I can be mean to others.", dimension: "psychopathy" },
      { id: 30, text: "People who mess with me always regret it.", dimension: "psychopathy" },
      { id: 31, text: "I have never gotten into trouble with the law.", dimension: "psychopathy", reverse: true },
      { id: 32, text: "I like to get revenge on authorities.", dimension: "psychopathy" },
      { id: 33, text: "I avoid dangerous situations.", dimension: "psychopathy", reverse: true },
      { id: 34, text: "Payback needs to be quick and nasty.", dimension: "psychopathy" },
      { id: 35, text: "People often say I'm out of control.", dimension: "psychopathy" },
      { id: 36, text: "It's true that I can be mean to others.", dimension: "psychopathy" },
      { id: 37, text: "I have never been arrested.", dimension: "psychopathy", reverse: true },
      { id: 38, text: "I don't regret my behavior.", dimension: "psychopathy" },
      { id: 39, text: "I have made mistakes that hurt people close to me.", dimension: "psychopathy" },
      { id: 40, text: "I often admire a really clever scam.", dimension: "psychopathy" },
      { id: 41, text: "I tell people what they want to hear so that they will do what I want them to do.", dimension: "psychopathy" },
      { id: 42, text: "I would enjoy having many sexual partners.", dimension: "psychopathy" }
    ]
  },

  grit: {
    id: 'grit',
    name: 'Grit & Goal Orientation',
    subtitle: 'Your Persistence & Drive',
    description: 'Measure your passion and perseverance for long-term goals. Discover how your goal orientation and grit contribute to your success and achievement.',
    duration: '10-12 minutes',
    isPremium: true,
    category: 'Achievement & Goals',
    puzzlePiece: 'constellation-drive',
    icon: '🔥',
    color: 'orange',
    dimensions: ['Grit', 'Performance Goal Orientation', 'Learning Goal Orientation', 'Avoidance Goal Orientation'],
    questions: [
      // Grit - Consistency of Interests (6 questions)
      { id: 1, text: "New ideas and projects sometimes distract me from previous ones.", dimension: "grit-consistency", reverse: true },
      { id: 2, text: "Setbacks don't discourage me.", dimension: "grit-consistency" },
      { id: 3, text: "I have been obsessed with a certain idea or project for a short time but later lost interest.", dimension: "grit-consistency", reverse: true },
      { id: 4, text: "I am a hard worker.", dimension: "grit-consistency" },
      { id: 5, text: "I often set a goal but later choose to pursue a different one.", dimension: "grit-consistency", reverse: true },
      { id: 6, text: "I have difficulty maintaining my focus on projects that take more than a few months to complete.", dimension: "grit-consistency", reverse: true },
      
      // Grit - Perseverance of Effort (6 questions)
      { id: 7, text: "I finish whatever I begin.", dimension: "grit-perseverance" },
      { id: 8, text: "I am diligent.", dimension: "grit-perseverance" },
      { id: 9, text: "I have overcome setbacks to conquer an important challenge.", dimension: "grit-perseverance" },
      { id: 10, text: "I am not easily discouraged.", dimension: "grit-perseverance" },
      { id: 11, text: "I work very hard without giving up.", dimension: "grit-perseverance" },
      { id: 12, text: "I continue working hard even when I face failure.", dimension: "grit-perseverance" },
      
      // Performance Goal Orientation (10 questions)
      { id: 13, text: "I want to show others that I can perform well on my job.", dimension: "performance-goal" },
      { id: 14, text: "I'm concerned with showing that I can perform better than my coworkers.", dimension: "performance-goal" },
      { id: 15, text: "I try to figure out what it takes to prove my ability to others on my job.", dimension: "performance-goal" },
      { id: 16, text: "I enjoy it when others at work are aware of how well I am doing.", dimension: "performance-goal" },
      { id: 17, text: "I prefer to work on projects where I can prove my ability to others.", dimension: "performance-goal" },
      { id: 18, text: "I would prefer to work on a task that is pretty easy, so I can perform it well.", dimension: "performance-goal" },
      { id: 19, text: "I'm concerned about taking on a task at work if my performance would be poor.", dimension: "performance-goal" },
      { id: 20, text: "I avoid taking on new tasks when there is a risk that I will perform poorly.", dimension: "performance-goal" },
      { id: 21, text: "I prefer to avoid situations where I might perform poorly.", dimension: "performance-goal" },
      { id: 22, text: "I dislike feedback that tells me I have performed poorly compared to others.", dimension: "performance-goal" },
      
      // Learning Goal Orientation (10 questions)
      { id: 23, text: "I am willing to select a challenging assignment that I can learn a lot from.", dimension: "learning-goal" },
      { id: 24, text: "I often look for opportunities to develop new skills and knowledge.", dimension: "learning-goal" },
      { id: 25, text: "I enjoy challenging and difficult tasks where I'll learn new skills.", dimension: "learning-goal" },
      { id: 26, text: "For me, development of my abilities is important enough to take risks.", dimension: "learning-goal" },
      { id: 27, text: "I prefer to work in situations that require a high level of ability and talent.", dimension: "learning-goal" },
      { id: 28, text: "I like challenging assignments because I can learn from them.", dimension: "learning-goal" },
      { id: 29, text: "I do my best when I'm working on a fairly difficult task.", dimension: "learning-goal" },
      { id: 30, text: "I try hard to improve on my past performance.", dimension: "learning-goal" },
      { id: 31, text: "The opportunity to do challenging work is important to me.", dimension: "learning-goal" },
      { id: 32, text: "When I fail to complete a difficult task, I plan to try harder the next time.", dimension: "learning-goal" },
      
      // Avoidance Goal Orientation (10+ questions)
      { id: 33, text: "I prefer to avoid situations where I might receive a negative evaluation.", dimension: "avoidance-goal" },
      { id: 34, text: "I'm concerned about the possibility of receiving negative feedback.", dimension: "avoidance-goal" },
      { id: 35, text: "I spend a lot of time thinking about whether my performance is adequate.", dimension: "avoidance-goal" },
      { id: 36, text: "I worry about the possibility of being judged incompetent.", dimension: "avoidance-goal" },
      { id: 37, text: "I am often concerned that I may not learn as much as I could in my job.", dimension: "avoidance-goal" },
      { id: 38, text: "I wonder if I have the ability to perform well in my job.", dimension: "avoidance-goal" },
      { id: 39, text: "I'm concerned that my coworkers may think I lack ability.", dimension: "avoidance-goal" },
      { id: 40, text: "I sometimes think to myself 'What if I can't perform well enough on this job?'", dimension: "avoidance-goal" },
      { id: 41, text: "I prefer to work on tasks that don't stretch my abilities too much.", dimension: "avoidance-goal" },
      { id: 42, text: "I often think about whether I have the necessary skills for my work.", dimension: "avoidance-goal" }
    ]
  },

  chronotype: {
    id: 'chronotype',
    name: 'Chronotype & Sleep Patterns (MEQ)',
    subtitle: 'Your Natural Rhythm',
    description: 'Discover your optimal sleep-wake cycle and energy patterns. Learn when you naturally perform best and how to optimize your daily schedule.',
    duration: '8-10 minutes',
    isPremium: true,
    category: 'Health & Wellness',
    puzzlePiece: 'constellation-rhythm',
    icon: '🌙',
    color: 'indigo',
    dimensions: ['Morningness-Eveningness', 'Sleep Quality', 'Sleep Hygiene'],
    questions: [
      // Morningness-Eveningness Questionnaire (19 questions)
      { 
        id: 1, 
        text: "If you were entirely free to plan your day, at what time would you choose to get up?", 
        dimension: "morningness",
        type: "time",
        options: [
          { value: 6, label: "5:00 AM - 6:30 AM", score: 5 },
          { value: 5, label: "6:30 AM - 7:45 AM", score: 4 },
          { value: 4, label: "7:45 AM - 9:45 AM", score: 3 },
          { value: 3, label: "9:45 AM - 11:00 AM", score: 2 },
          { value: 2, label: "11:00 AM - 12:00 PM", score: 1 }
        ]
      },
      { 
        id: 2, 
        text: "If you were entirely free to plan your evening, at what time would you choose to go to bed?", 
        dimension: "morningness",
        type: "time",
        options: [
          { value: 5, label: "8:00 PM - 9:00 PM", score: 5 },
          { value: 4, label: "9:00 PM - 10:15 PM", score: 4 },
          { value: 3, label: "10:15 PM - 12:30 AM", score: 3 },
          { value: 2, label: "12:30 AM - 1:45 AM", score: 2 },
          { value: 1, label: "1:45 AM - 3:00 AM", score: 1 }
        ]
      },
      { 
        id: 3, 
        text: "How dependent are you on being woken up by an alarm clock?", 
        dimension: "morningness",
        type: "scale",
        options: [
          { value: 4, label: "Not at all dependent", score: 4 },
          { value: 3, label: "Slightly dependent", score: 3 },
          { value: 2, label: "Fairly dependent", score: 2 },
          { value: 1, label: "Very dependent", score: 1 }
        ]
      },
      { 
        id: 4, 
        text: "How easy do you find it to get up in the morning?", 
        dimension: "morningness",
        type: "scale",
        options: [
          { value: 4, label: "Very easy", score: 4 },
          { value: 3, label: "Fairly easy", score: 3 },
          { value: 2, label: "Fairly difficult", score: 2 },
          { value: 1, label: "Very difficult", score: 1 }
        ]
      },
      { 
        id: 5, 
        text: "How alert do you feel during the first half hour after you wake up in the morning?", 
        dimension: "morningness",
        type: "scale",
        options: [
          { value: 4, label: "Very alert", score: 4 },
          { value: 3, label: "Fairly alert", score: 3 },
          { value: 2, label: "Fairly drowsy", score: 2 },
          { value: 1, label: "Very drowsy", score: 1 }
        ]
      },
      { 
        id: 6, 
        text: "How is your appetite during the first half hour after you wake up?", 
        dimension: "morningness",
        type: "scale",
        options: [
          { value: 4, label: "Very good", score: 4 },
          { value: 3, label: "Fairly good", score: 3 },
          { value: 2, label: "Fairly poor", score: 2 },
          { value: 1, label: "Very poor", score: 1 }
        ]
      },
      { 
        id: 7, 
        text: "During the first half hour after you wake up in the morning, how tired do you feel?", 
        dimension: "morningness",
        type: "scale",
        options: [
          { value: 1, label: "Very tired", score: 1 },
          { value: 2, label: "Fairly tired", score: 2 },
          { value: 3, label: "Fairly refreshed", score: 3 },
          { value: 4, label: "Very refreshed", score: 4 }
        ]
      },
      { 
        id: 8, 
        text: "If you have no commitments the next day, at what time would you go to bed compared to your usual bedtime?", 
        dimension: "morningness",
        type: "scale",
        options: [
          { value: 4, label: "Seldom or never later", score: 4 },
          { value: 3, label: "Less than 1 hour later", score: 3 },
          { value: 2, label: "1-2 hours later", score: 2 },
          { value: 1, label: "More than 2 hours later", score: 1 }
        ]
      },
      { 
        id: 9, 
        text: "You have decided to engage in some physical exercise. A friend suggests that you do this one hour twice a week and the best time for him is between 7:00-8:00 AM. Bearing in mind nothing else but your own 'feeling best' rhythm, how do you think you would perform?", 
        dimension: "morningness",
        type: "scale",
        options: [
          { value: 4, label: "Would be on good form", score: 4 },
          { value: 3, label: "Would be on reasonable form", score: 3 },
          { value: 2, label: "Would find it difficult", score: 2 },
          { value: 1, label: "Would find it very difficult", score: 1 }
        ]
      },
      { 
        id: 10, 
        text: "At what time in the evening do you feel tired and, as a result, in need of sleep?", 
        dimension: "morningness",
        type: "time",
        options: [
          { value: 5, label: "8:00 PM - 9:00 PM", score: 5 },
          { value: 4, label: "9:00 PM - 10:15 PM", score: 4 },
          { value: 3, label: "10:15 PM - 12:45 AM", score: 3 },
          { value: 2, label: "12:45 AM - 2:00 AM", score: 2 },
          { value: 1, label: "2:00 AM - 3:00 AM", score: 1 }
        ]
      },
      
      // Sleep Quality Questions (15 questions)
      { id: 11, text: "I have trouble falling asleep.", dimension: "sleep-quality", reverse: true },
      { id: 12, text: "I wake up several times during the night.", dimension: "sleep-quality", reverse: true },
      { id: 13, text: "I wake up too early and can't get back to sleep.", dimension: "sleep-quality", reverse: true },
      { id: 14, text: "I feel refreshed when I wake up.", dimension: "sleep-quality" },
      { id: 15, text: "I get enough sleep to feel rested.", dimension: "sleep-quality" },
      { id: 16, text: "My sleep is restless and disturbed.", dimension: "sleep-quality", reverse: true },
      { id: 17, text: "I have difficulty staying asleep.", dimension: "sleep-quality", reverse: true },
      { id: 18, text: "I feel satisfied with my sleep.", dimension: "sleep-quality" },
      { id: 19, text: "My sleep quality is poor.", dimension: "sleep-quality", reverse: true },
      { id: 20, text: "I have trouble getting to sleep within 30 minutes.", dimension: "sleep-quality", reverse: true },
      { id: 21, text: "I feel drowsy during the day.", dimension: "sleep-quality", reverse: true },
      { id: 22, text: "I take naps during the day because I'm tired.", dimension: "sleep-quality", reverse: true },
      { id: 23, text: "I feel alert and energetic during my waking hours.", dimension: "sleep-quality" },
      { id: 24, text: "I have vivid, disturbing dreams that wake me up.", dimension: "sleep-quality", reverse: true },
      { id: 25, text: "I sleep deeply and peacefully.", dimension: "sleep-quality" },
      
      // Sleep Hygiene Questions (15+ questions)
      { id: 26, text: "I go to bed at the same time every night.", dimension: "sleep-hygiene" },
      { id: 27, text: "I wake up at the same time every morning, even on weekends.", dimension: "sleep-hygiene" },
      { id: 28, text: "I use my bedroom only for sleeping.", dimension: "sleep-hygiene" },
      { id: 29, text: "I avoid caffeine in the evening.", dimension: "sleep-hygiene" },
      { id: 30, text: "I avoid large meals close to bedtime.", dimension: "sleep-hygiene" },
      { id: 31, text: "I exercise regularly, but not close to bedtime.", dimension: "sleep-hygiene" },
      { id: 32, text: "I keep my bedroom cool, quiet, and dark.", dimension: "sleep-hygiene" },
      { id: 33, text: "I have a relaxing bedtime routine.", dimension: "sleep-hygiene" },
      { id: 34, text: "I avoid screens (TV, phone, computer) before bed.", dimension: "sleep-hygiene" },
      { id: 35, text: "I avoid alcohol before bedtime.", dimension: "sleep-hygiene" },
      { id: 36, text: "I limit daytime naps to 30 minutes or less.", dimension: "sleep-hygiene" },
      { id: 37, text: "I get natural sunlight exposure during the day.", dimension: "sleep-hygiene" },
      { id: 38, text: "I manage stress and worry before bedtime.", dimension: "sleep-hygiene" },
      { id: 39, text: "I avoid clock-watching when I can't sleep.", dimension: "sleep-hygiene" },
      { id: 40, text: "My mattress and pillows are comfortable and supportive.", dimension: "sleep-hygiene" },
      { id: 41, text: "I avoid smoking, especially in the evening.", dimension: "sleep-hygiene" },
      { id: 42, text: "I reserve my bed for sleep and intimacy only.", dimension: "sleep-hygiene" }
    ]
  },

  numerology: {
    id: 'numerology',
    name: 'Numerology Profile',
    subtitle: 'The Numbers That Shape You',
    description: 'Discover the hidden meanings in your birth date and name through ancient numerological wisdom. Uncover your life path, destiny, and personality numbers.',
    duration: '5-7 minutes',
    isPremium: true,
    category: 'Spiritual & Esoteric',
    puzzlePiece: 'constellation-cosmic',
    icon: '🔢',
    color: 'yellow',
    dimensions: ['Life Path', 'Expression', 'Soul Urge', 'Personality', 'Birthday', 'Challenge'],
    questions: [
      // Numerology doesn't use traditional questions but rather calculations based on:
      // - Birth Date (for Life Path Number)
      // - Full Birth Name (for Expression Number)  
      // - Vowels in Name (for Soul Urge Number)
      // - Consonants in Name (for Personality Number)
      // - Birth Day (for Birthday Number)
      
      // We'll create input fields for the required data
      { 
        id: 1, 
        type: "date",
        text: "What is your full birth date?", 
        dimension: "birth-date",
        placeholder: "MM/DD/YYYY",
        required: true
      },
      { 
        id: 2, 
        type: "text",
        text: "What is your full birth name (first, middle, last as it appears on your birth certificate)?", 
        dimension: "birth-name",
        placeholder: "Enter your full legal birth name",
        required: true
      },
      { 
        id: 3, 
        type: "text",
        text: "What name do you commonly go by now?", 
        dimension: "current-name",
        placeholder: "The name you use daily",
        required: false
      },
      { 
        id: 4, 
        type: "select",
        text: "Which aspect of numerology interests you most?", 
        dimension: "focus-area",
        options: [
          { value: "life-path", label: "Life Path - My overall life journey and purpose" },
          { value: "relationships", label: "Relationships - Compatibility and connections" },
          { value: "career", label: "Career - Professional direction and success" },
          { value: "personal-growth", label: "Personal Growth - Inner development" },
          { value: "spirituality", label: "Spirituality - Connection to higher purpose" },
          { value: "challenges", label: "Life Challenges - Obstacles and lessons" }
        ],
        required: true
      },
      { 
        id: 5, 
        type: "multiselect",
        text: "Which numbers have been significant in your life? (Select all that apply)", 
        dimension: "significant-numbers",
        options: [
          { value: 1, label: "1 - Leadership, independence" },
          { value: 2, label: "2 - Cooperation, partnership" },
          { value: 3, label: "3 - Creativity, communication" },
          { value: 4, label: "4 - Stability, hard work" },
          { value: 5, label: "5 - Freedom, adventure" },
          { value: 6, label: "6 - Nurturing, responsibility" },
          { value: 7, label: "7 - Spirituality, analysis" },
          { value: 8, label: "8 - Material success, power" },
          { value: 9, label: "9 - Completion, humanitarian" },
          { value: 11, label: "11 - Intuition, inspiration" },
          { value: 22, label: "22 - Master builder, practical idealism" },
          { value: 33, label: "33 - Master teacher, healing" }
        ]
      }
    ]
  }
};

export default premiumTests;