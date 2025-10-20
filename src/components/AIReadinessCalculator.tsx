'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Question {
  id: string;
  category: 'data' | 'culture' | 'technical' | 'governance' | 'strategy';
  question: string;
  options: {
    text: string;
    score: number;
    insight: string;
  }[];
}

interface Results {
  overall: number;
  categories: {
    data: number;
    culture: number;
    technical: number;
    governance: number;
    strategy: number;
  };
  readinessLevel: 'exploring' | 'emerging' | 'advancing' | 'leading';
  strengths: string[];
  opportunities: string[];
  nextSteps: string[];
}

const questions: Question[] = [
  // DATA INFRASTRUCTURE (3 questions)
  {
    id: 'data-1',
    category: 'data',
    question: 'Can your teams easily access and share data across different departments?',
    options: [
      { text: 'No - data is trapped in separate systems that don\'t talk to each other', score: 1, insight: 'Data silos will significantly limit AI effectiveness' },
      { text: 'Sometimes - but it requires manual work to combine information', score: 2, insight: 'Some foundation exists but requires significant effort' },
      { text: 'Yes - our systems connect well and data flows between them', score: 3, insight: 'Strong foundation for AI implementation' },
      { text: 'Absolutely - data is unified and updates in real-time across all systems', score: 4, insight: 'Excellent infrastructure ready for advanced AI' },
      { text: 'Not sure / Don\'t know enough to answer', score: 2, insight: 'A data audit would reveal integration opportunities' }
    ]
  },
  {
    id: 'data-2',
    category: 'data',
    question: 'How accurate and reliable is the data in your systems?',
    options: [
      { text: 'Often inconsistent or contains errors that need manual correction', score: 1, insight: 'Data quality must be addressed before AI adoption' },
      { text: 'Generally reliable, but we know certain areas have quality issues', score: 2, insight: 'Targeted data quality improvements needed' },
      { text: 'High quality with clear standards for how data should be entered', score: 3, insight: 'Data quality supports AI implementation' },
      { text: 'Excellent - we automatically monitor and fix data quality issues', score: 4, insight: 'Premium data foundation for AI excellence' },
      { text: 'Not sure / Don\'t know enough to answer', score: 2, insight: 'Understanding your data landscape is a good first step' }
    ]
  },
  {
    id: 'data-3',
    category: 'data',
    question: 'Are your technology systems modern enough to handle new AI capabilities?',
    options: [
      { text: 'No - we mainly run older systems with limited capacity', score: 1, insight: 'Infrastructure modernisation required for AI' },
      { text: 'Mixed - some modern systems but also legacy technology', score: 2, insight: 'Infrastructure investments needed for scale' },
      { text: 'Yes - we use modern cloud-based systems that can scale up', score: 3, insight: 'Infrastructure ready for AI implementation' },
      { text: 'Absolutely - we have enterprise-grade platforms built for AI', score: 4, insight: 'Premium infrastructure for AI at scale' },
      { text: 'Not sure / Don\'t know enough to answer', score: 2, insight: 'A technical audit would clarify your infrastructure readiness' }
    ]
  },

  // ORGANISATIONAL CULTURE (3 questions)
  {
    id: 'culture-1',
    category: 'culture',
    question: 'How does your leadership team view AI adoption?',
    options: [
      { text: 'Sceptical or waiting for others to prove the value first', score: 1, insight: 'Leadership alignment critical before proceeding' },
      { text: 'Interested but uncertain about business case and priorities', score: 2, insight: 'Executive education and proof points needed' },
      { text: 'Actively supportive with allocated budget and strategic priority', score: 3, insight: 'Strong leadership foundation for AI success' },
      { text: 'AI is core to business strategy with C-suite accountability', score: 4, insight: 'Exceptional leadership commitment to AI transformation' }
    ]
  },
  {
    id: 'culture-2',
    category: 'culture',
    question: 'What is your organisation\'s appetite for experimentation and learning?',
    options: [
      { text: 'Risk-averse culture with resistance to new approaches', score: 1, insight: 'Cultural change required before AI adoption' },
      { text: 'Cautious but willing to pilot new technologies with clear ROI', score: 2, insight: 'Start with low-risk, high-value proof of concepts' },
      { text: 'Encourages innovation with acceptance of intelligent failure', score: 3, insight: 'Healthy culture for AI experimentation' },
      { text: 'Innovation-driven with systematic experimentation frameworks', score: 4, insight: 'Optimal culture for AI-driven transformation' }
    ]
  },
  {
    id: 'culture-3',
    category: 'culture',
    question: 'How skilled is your workforce in working with data and technology?',
    options: [
      { text: 'Limited digital literacy with resistance to new tools', score: 1, insight: 'Significant training investment required' },
      { text: 'Basic digital skills with willingness to learn new technologies', score: 2, insight: 'User-friendly AI tools with comprehensive training needed' },
      { text: 'Strong digital literacy with some analytics/technical capabilities', score: 3, insight: 'Workforce ready to adopt AI-augmented workflows' },
      { text: 'Data-driven culture with technical talent and continuous learning', score: 4, insight: 'Workforce primed for sophisticated AI collaboration' }
    ]
  },
  // TECHNICAL CAPABILITIES (3 questions)
  {
    id: 'technical-1',
    category: 'technical',
    question: 'Do you have people in-house with AI or data science skills?',
    options: [
      { text: 'No - we would need to bring in external help for AI projects', score: 1, insight: 'Partner ecosystem critical for AI success' },
      { text: 'Not currently, but we could hire or partner for AI expertise', score: 2, insight: 'Build vs buy decisions needed for AI capabilities' },
      { text: 'Yes - we have some data or technical people who could learn AI', score: 3, insight: 'Upskilling and targeted hiring will accelerate AI' },
      { text: 'Yes - we have a dedicated AI/data science team with proven results', score: 4, insight: 'Strong technical foundation for AI innovation' }
    ]
  },
  {
    id: 'technical-2',
    category: 'technical',
    question: 'Can your existing systems easily integrate with new AI tools and services?',
    options: [
      { text: 'No - our systems are quite rigid and difficult to connect to new tools', score: 1, insight: 'System modernisation required before AI integration' },
      { text: 'Possible but requires significant custom development work', score: 2, insight: 'Integration layer needed for AI adoption' },
      { text: 'Yes - our systems have modern APIs and can connect to new services', score: 3, insight: 'Architecture ready for AI integration' },
      { text: 'Absolutely - we have enterprise platforms designed for easy integration', score: 4, insight: 'Exceptional architecture for AI ecosystem' }
    ]
  },
  {
    id: 'technical-3',
    category: 'technical',
    question: 'How confident are you in deploying and maintaining business-critical systems?',
    options: [
      { text: 'Limited - we rely heavily on vendors for critical systems', score: 1, insight: 'Operational capabilities needed for AI ownership' },
      { text: 'Some capability - we run systems but with basic monitoring', score: 2, insight: 'Operational maturity required for AI responsibility' },
      { text: 'Strong - we run production systems with SLAs and incident processes', score: 3, insight: 'Strong operations foundation for AI deployment' },
      { text: 'World-class - automated operations with comprehensive monitoring', score: 4, insight: 'Operational excellence enables AI at scale' }
    ]
  },

  // GOVERNANCE & ETHICS (3 questions)
  {
    id: 'governance-1',
    category: 'governance',
    question: 'How prepared are you to address AI ethics and bias concerns?',
    options: [
      { text: 'Haven\'t considered AI ethics or bias implications', score: 1, insight: 'Ethics framework essential before AI deployment' },
      { text: 'Aware of concerns but no formal framework or processes', score: 2, insight: 'Ethics guidelines needed before scaling AI' },
      { text: 'Established ethics principles with review processes for AI', score: 3, insight: 'Ethics foundation supports responsible AI' },
      { text: 'Comprehensive ethics framework with bias testing and monitoring', score: 4, insight: 'Ethics excellence enables trusted AI' }
    ]
  },
  {
    id: 'governance-2',
    category: 'governance',
    question: 'What governance structures exist for AI decision-making and accountability?',
    options: [
      { text: 'No formal governance for AI projects or decisions', score: 1, insight: 'Governance framework required before AI adoption' },
      { text: 'Ad-hoc oversight with unclear accountability for AI outcomes', score: 2, insight: 'Clear governance structures needed for AI trust' },
      { text: 'Defined governance with clear roles and approval processes', score: 3, insight: 'Governance structures support AI accountability' },
      { text: 'Mature governance with AI ethics board and stakeholder oversight', score: 4, insight: 'Exceptional governance for responsible AI at scale' }
    ]
  },
  {
    id: 'governance-3',
    category: 'governance',
    question: 'How do you handle regulatory compliance and risk management?',
    options: [
      { text: 'Reactive compliance with limited risk assessment processes', score: 1, insight: 'Risk framework needed before AI deployment' },
      { text: 'Basic compliance with growing awareness of AI-specific risks', score: 2, insight: 'AI risk assessment processes required' },
      { text: 'Proactive compliance with integrated risk management', score: 3, insight: 'Risk management supports safe AI adoption' },
      { text: 'Industry-leading compliance with AI-specific risk frameworks', score: 4, insight: 'Risk excellence enables confident AI deployment' }
    ]
  },

  // STRATEGIC READINESS (3 questions)
  {
    id: 'strategy-1',
    category: 'strategy',
    question: 'How clear is your AI strategy and its alignment with business objectives?',
    options: [
      { text: 'No defined AI strategy or understanding of potential value', score: 1, insight: 'Strategy development critical before AI investment' },
      { text: 'Exploring AI possibilities but unclear on priorities and roadmap', score: 2, insight: 'Strategic clarity needed before scaling AI' },
      { text: 'Clear AI strategy with prioritised use cases and business alignment', score: 3, insight: 'Strong strategic foundation for AI success' },
      { text: 'AI integral to business strategy with measurable outcomes and investment', score: 4, insight: 'Exceptional strategic clarity for AI transformation' }
    ]
  },
  {
    id: 'strategy-2',
    category: 'strategy',
    question: 'What is your approach to measuring AI value and ROI?',
    options: [
      { text: 'No framework for measuring AI impact or value', score: 1, insight: 'Value measurement framework needed for AI justification' },
      { text: 'Informal assessment of AI benefits without rigorous tracking', score: 2, insight: 'Metrics framework required for AI accountability' },
      { text: 'Defined success metrics with regular tracking and reporting', score: 3, insight: 'Measurement discipline supports AI investment' },
      { text: 'Comprehensive value framework with leading/lagging indicators', score: 4, insight: 'Measurement excellence drives AI optimisation' }
    ]
  },
  {
    id: 'strategy-3',
    category: 'strategy',
    question: 'How mature is your approach to AI vendor and partner ecosystem?',
    options: [
      { text: 'No vendor strategy; reactive purchasing as needs arise', score: 1, insight: 'Ecosystem strategy needed for AI success' },
      { text: 'Some vendor relationships but no strategic partner approach', score: 2, insight: 'Strategic partnerships will accelerate AI' },
      { text: 'Defined vendor strategy with established partner relationships', score: 3, insight: 'Partner ecosystem supports AI implementation' },
      { text: 'Strategic ecosystem with co-innovation and capability sharing', score: 4, insight: 'Partnership excellence multiplies AI impact' }
    ]
  }
];

const categoryNames = {
  data: 'Data Infrastructure',
  culture: 'Organisational Culture',
  technical: 'Technical Capabilities',
  governance: 'Governance & Ethics',
  strategy: 'Strategic Readiness'
};

const categoryWeights = {
  data: 0.25,
  culture: 0.25,
  technical: 0.20,
  governance: 0.15,
  strategy: 0.15
};

export default function AIReadinessCalculator() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [results, setResults] = useState<Results | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (questionId: string, score: number) => {
    const newAnswers = { ...answers, [questionId]: score };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults(newAnswers);
    }
  };

  const calculateResults = (finalAnswers: Record<string, number>) => {
    // Calculate category scores
    const categoryScores = {
      data: 0,
      culture: 0,
      technical: 0,
      governance: 0,
      strategy: 0
    };

    const categoryCounts = {
      data: 0,
      culture: 0,
      technical: 0,
      governance: 0,
      strategy: 0
    };

    questions.forEach(q => {
      const score = finalAnswers[q.id] || 0;
      categoryScores[q.category] += score;
      categoryCounts[q.category]++;
    });

    // Normalise to 0-100 scale
    const categories = {
      data: (categoryScores.data / (categoryCounts.data * 4)) * 100,
      culture: (categoryScores.culture / (categoryCounts.culture * 4)) * 100,
      technical: (categoryScores.technical / (categoryCounts.technical * 4)) * 100,
      governance: (categoryScores.governance / (categoryCounts.governance * 4)) * 100,
      strategy: (categoryScores.strategy / (categoryCounts.strategy * 4)) * 100
    };

    // Calculate weighted overall score
    const overall =
      categories.data * categoryWeights.data +
      categories.culture * categoryWeights.culture +
      categories.technical * categoryWeights.technical +
      categories.governance * categoryWeights.governance +
      categories.strategy * categoryWeights.strategy;

    // Determine readiness level (adjusted thresholds for better distribution)
    let readinessLevel: Results['readinessLevel'];
    if (overall < 40) readinessLevel = 'exploring';
    else if (overall < 65) readinessLevel = 'emerging';
    else if (overall < 85) readinessLevel = 'advancing';
    else readinessLevel = 'leading';

    // Identify strengths and opportunities
    const categoryArray = Object.entries(categories).map(([key, value]) => ({
      category: key as keyof typeof categories,
      score: value
    }));

    const strengths = categoryArray
      .filter(c => c.score >= 65)
      .map(c => categoryNames[c.category]);

    const opportunities = categoryArray
      .filter(c => c.score < 65)
      .sort((a, b) => a.score - b.score)
      .map(c => categoryNames[c.category]);

    // Generate next steps based on readiness level and weakest areas
    const nextSteps = generateNextSteps(readinessLevel, categories, overall);

    setResults({
      overall: Math.round(overall),
      categories,
      readinessLevel,
      strengths,
      opportunities,
      nextSteps
    });

    setShowResults(true);
  };

  const generateNextSteps = (
    level: Results['readinessLevel'],
    categories: Results['categories'],
    overall: number
  ): string[] => {
    const steps: string[] = [];

    // Find weakest category
    const weakest = Object.entries(categories).sort((a, b) => a[1] - b[1])[0];
    const strongest = Object.entries(categories).sort((a, b) => b[1] - a[1])[0];

    if (level === 'exploring') {
      steps.push('Begin with AI literacy programmes for leadership and key stakeholders');
      steps.push(`Address critical gaps in ${categoryNames[weakest[0] as keyof typeof categoryNames]}`);
      steps.push('Identify a low-risk, high-value pilot project to build organisational confidence');
      steps.push('Establish governance framework and ethics principles before deployment');
    } else if (level === 'emerging') {
      steps.push(`Strengthen ${categoryNames[weakest[0] as keyof typeof categoryNames]} to enable broader AI adoption`);
      steps.push('Launch proof-of-concept projects in areas of strategic priority');
      steps.push('Build technical capabilities through targeted hiring or strategic partnerships');
      steps.push('Develop measurement framework to track AI value and learning');
    } else if (level === 'advancing') {
      steps.push(`Continue building ${categoryNames[weakest[0] as keyof typeof categoryNames]} to world-class standards`);
      steps.push('Scale successful pilots into production with robust MLOps practices');
      steps.push('Establish centre of excellence to share learnings and accelerate adoption');
      steps.push('Develop AI-native products or capabilities for competitive advantage');
    } else {
      steps.push('Share AI success stories and learnings to inspire the broader ecosystem');
      steps.push('Explore cutting-edge AI capabilities in areas like agentic systems or multimodal AI');
      steps.push('Build strategic partnerships for co-innovation and capability development');
      steps.push('Consider how AI can fundamentally reshape your business model and value proposition');
    }

    return steps;
  };

  const resetCalculator = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setResults(null);
    setShowResults(false);
  };

  const getShareText = (score: number, level: string) => {
    const levelText = level === 'exploring' ? 'Exploring AI Potential' :
                      level === 'emerging' ? 'Emerging AI Capabilities' :
                      level === 'advancing' ? 'Advancing AI Maturity' :
                      'Leading with AI';
    return `I scored ${score}/100 (${levelText}) on the AI Readiness Calculator. Discover your organisation's AI readiness: https://www.context-is-everything.com/tools/ai-readiness-calculator`;
  };

  const shareOnLinkedIn = () => {
    if (!results) return;
    const text = getShareText(results.overall, results.readinessLevel);
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://www.context-is-everything.com/tools/ai-readiness-calculator')}&summary=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareOnTwitter = () => {
    if (!results) return;
    const text = getShareText(results.overall, results.readinessLevel);
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (showResults && results) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Overall Score */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Your AI Readiness Assessment</h2>
            <div className="relative w-48 h-48 mx-auto">
              <svg className="transform -rotate-90 w-48 h-48">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  className="text-gray-200"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 88}`}
                  strokeDashoffset={`${2 * Math.PI * 88 * (1 - results.overall / 100)}`}
                  className="text-blue-600 transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl font-bold">{results.overall}</div>
                  <div className="text-sm text-gray-600">out of 100</div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold capitalize">
                {results.readinessLevel === 'exploring' && 'Exploring AI Potential'}
                {results.readinessLevel === 'emerging' && 'Emerging AI Capabilities'}
                {results.readinessLevel === 'advancing' && 'Advancing AI Maturity'}
                {results.readinessLevel === 'leading' && 'Leading with AI'}
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {results.readinessLevel === 'exploring' && 'You\'re in the early stages of understanding AI\'s potential for your organisation. Focus on building foundational capabilities and organisational alignment.'}
                {results.readinessLevel === 'emerging' && 'You\'re in a strong position to begin meaningful AI adoption. You have critical foundations in place - now it\'s about strategic prioritisation and targeted capability building in specific areas. This is exactly where most successful AI transformations begin.'}
                {results.readinessLevel === 'advancing' && 'You\'re actively implementing AI with measurable results. Continue scaling successful initiatives while strengthening remaining capability gaps.'}
                {results.readinessLevel === 'leading' && 'You\'re demonstrating AI leadership with mature capabilities across all dimensions. Focus on innovation and ecosystem development.'}
              </p>
            </div>
          </div>

          {/* Social Sharing */}
          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={shareOnLinkedIn}
              className="flex items-center gap-2 bg-[#0077B5] hover:bg-[#006399] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
              Share on LinkedIn
            </button>
            <button
              onClick={shareOnTwitter}
              className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              Share on X
            </button>
          </div>

          {/* Category Breakdown */}
          <div className="bg-gray-50 rounded-lg p-6 space-y-4">
            <h3 className="text-xl font-semibold">Category Breakdown</h3>
            {Object.entries(results.categories).map(([key, score]) => (
              <div key={key} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{categoryNames[key as keyof typeof categoryNames]}</span>
                  <span className="text-sm text-gray-600">{Math.round(score)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className={`h-3 rounded-full ${
                      score >= 75 ? 'bg-green-500' :
                      score >= 50 ? 'bg-blue-500' :
                      score >= 35 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Strengths */}
          {results.strengths.length > 0 && (
            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
              <h3 className="text-xl font-semibold text-green-900 mb-3">Your Strengths</h3>
              <ul className="space-y-2">
                {results.strengths.map((strength, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span className="text-green-900">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Opportunities */}
          {results.opportunities.length > 0 && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
              <h3 className="text-xl font-semibold text-blue-900 mb-3">Growth Opportunities</h3>
              <ul className="space-y-2">
                {results.opportunities.map((opportunity, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-blue-600 mr-2">→</span>
                    <span className="text-blue-900">{opportunity}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-r-lg">
            <h3 className="text-xl font-semibold text-purple-900 mb-3">Recommended Next Steps</h3>
            <ol className="space-y-3">
              {results.nextSteps.map((step, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-purple-600 font-semibold mr-3">{idx + 1}.</span>
                  <span className="text-purple-900">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 text-center space-y-4">
            <h3 className="text-2xl font-bold">Ready to Discuss Your AI Journey?</h3>
            <p className="text-blue-100 max-w-2xl mx-auto">
              This assessment provides a high-level view of your AI readiness. For a detailed consultation and personalised roadmap, let's talk about your specific context and objectives.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a
                href="mailto:hello@context-is-everything.com?subject=AI Readiness Assessment Discussion"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Schedule a Consultation
              </a>
              <button
                onClick={resetCalculator}
                className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
              >
                Retake Assessment
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span className="text-sm text-gray-500">
            {categoryNames[question.category]}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-gray-900">
            {question.question}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(question.id, option.score)}
                className="text-left p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center">
                      <span className="text-xs font-semibold text-gray-600 group-hover:text-blue-600">
                        {idx + 1}
                      </span>
                    </div>
                    <p className="font-medium text-gray-900 group-hover:text-blue-900 text-sm">
                      {option.text}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 group-hover:text-blue-700 pl-8">
                    {option.insight}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Navigation */}
          {currentQuestion > 0 && (
            <button
              onClick={() => setCurrentQuestion(currentQuestion - 1)}
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              ← Previous Question
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
