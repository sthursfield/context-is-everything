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
  // DATA INFRASTRUCTURE (5 questions)
  {
    id: 'data-1',
    category: 'data',
    question: 'How accessible is your data across different departments and systems?',
    options: [
      { text: 'Fragmented across siloed systems with limited integration', score: 1, insight: 'Data silos will significantly limit AI effectiveness' },
      { text: 'Partially integrated with manual bridging between key systems', score: 2, insight: 'Some foundation exists but requires significant effort' },
      { text: 'Well-integrated with standardised APIs and data pipelines', score: 3, insight: 'Strong foundation for AI implementation' },
      { text: 'Fully unified with real-time data synchronisation and governance', score: 4, insight: 'Excellent infrastructure ready for advanced AI' }
    ]
  },
  {
    id: 'data-2',
    category: 'data',
    question: 'What is the quality and consistency of your data across systems?',
    options: [
      { text: 'Inconsistent formats, frequent errors, significant cleaning required', score: 1, insight: 'Data quality must be addressed before AI adoption' },
      { text: 'Generally reliable with known quality issues in specific areas', score: 2, insight: 'Targeted data quality improvements needed' },
      { text: 'High quality with established standards and validation processes', score: 3, insight: 'Data quality supports AI implementation' },
      { text: 'Enterprise-grade with automated quality monitoring and remediation', score: 4, insight: 'Premium data foundation for AI excellence' }
    ]
  },
  {
    id: 'data-3',
    category: 'data',
    question: 'How would you describe your data governance and security practices?',
    options: [
      { text: 'Informal or inconsistent governance with basic security', score: 1, insight: 'Governance gaps create significant AI risks' },
      { text: 'Documented policies with partial implementation and monitoring', score: 2, insight: 'Governance foundation needs strengthening' },
      { text: 'Comprehensive framework with active monitoring and compliance', score: 3, insight: 'Solid governance supports responsible AI' },
      { text: 'World-class governance with automated compliance and privacy controls', score: 4, insight: 'Governance excellence enables advanced AI' }
    ]
  },
  {
    id: 'data-4',
    category: 'data',
    question: 'What volume and variety of relevant data do you have available?',
    options: [
      { text: 'Limited data or highly fragmented across unconnected sources', score: 1, insight: 'Data volume may limit AI effectiveness' },
      { text: 'Adequate data in key areas but gaps in coverage or history', score: 2, insight: 'Sufficient for initial AI projects with targeted scope' },
      { text: 'Rich datasets across most business functions with good history', score: 3, insight: 'Strong data foundation for diverse AI applications' },
      { text: 'Comprehensive multi-year datasets across all key business areas', score: 4, insight: 'Exceptional data assets for sophisticated AI' }
    ]
  },
  {
    id: 'data-5',
    category: 'data',
    question: 'How prepared is your infrastructure to handle AI workloads?',
    options: [
      { text: 'Legacy systems with limited processing capacity or cloud access', score: 1, insight: 'Infrastructure modernisation required for AI' },
      { text: 'Mix of legacy and modern with some cloud capabilities', score: 2, insight: 'Infrastructure investments needed for scale' },
      { text: 'Modern cloud-based infrastructure with scalable compute resources', score: 3, insight: 'Infrastructure ready for AI implementation' },
      { text: 'Enterprise AI platform with specialised compute and MLOps capabilities', score: 4, insight: 'Premium infrastructure for AI at scale' }
    ]
  },

  // ORGANISATIONAL CULTURE (5 questions)
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
  {
    id: 'culture-4',
    category: 'culture',
    question: 'How do different departments collaborate on cross-functional initiatives?',
    options: [
      { text: 'Siloed departments with minimal collaboration or shared goals', score: 1, insight: 'Organisational alignment needed before AI projects' },
      { text: 'Some collaboration but challenged by competing priorities', score: 2, insight: 'Cross-functional sponsorship critical for AI success' },
      { text: 'Regular cross-functional work with established collaboration models', score: 3, insight: 'Collaboration patterns support AI implementation' },
      { text: 'Deeply integrated teams with shared metrics and agile practices', score: 4, insight: 'Exceptional collaboration enables AI excellence' }
    ]
  },
  {
    id: 'culture-5',
    category: 'culture',
    question: 'How does your organisation handle change and transformation?',
    options: [
      { text: 'Struggles with change initiatives; low adoption rates', score: 1, insight: 'Change management must precede AI adoption' },
      { text: 'Mixed results with change depending on leadership and communication', score: 2, insight: 'Structured change management essential for AI' },
      { text: 'Generally successful with established change frameworks', score: 3, insight: 'Change capabilities support AI transformation' },
      { text: 'Continuous transformation mindset with high adaptation rates', score: 4, insight: 'Change excellence accelerates AI adoption' }
    ]
  },

  // TECHNICAL CAPABILITIES (4 questions)
  {
    id: 'technical-1',
    category: 'technical',
    question: 'What technical talent do you have available for AI projects?',
    options: [
      { text: 'No in-house AI/ML expertise; dependent on external support', score: 1, insight: 'Partner ecosystem critical for AI success' },
      { text: 'Limited technical skills; could hire or partner for AI projects', score: 2, insight: 'Build vs buy decisions needed for AI capabilities' },
      { text: 'Some data science/engineering talent with AI potential', score: 3, insight: 'Upskilling and targeted hiring will accelerate AI' },
      { text: 'Dedicated AI/ML team with proven delivery track record', score: 4, insight: 'Strong technical foundation for AI innovation' }
    ]
  },
  {
    id: 'technical-2',
    category: 'technical',
    question: 'How mature are your software development and DevOps practices?',
    options: [
      { text: 'Manual processes with limited automation or version control', score: 1, insight: 'DevOps maturity required for sustainable AI' },
      { text: 'Basic CI/CD with some automation but inconsistent practices', score: 2, insight: 'MLOps foundation needs development' },
      { text: 'Mature DevOps with automated testing and deployment pipelines', score: 3, insight: 'DevOps practices support AI operations' },
      { text: 'Advanced DevOps with observability, security, and MLOps integration', score: 4, insight: 'Excellent technical practices for AI at scale' }
    ]
  },
  {
    id: 'technical-3',
    category: 'technical',
    question: 'What is your experience with deploying and maintaining production systems?',
    options: [
      { text: 'Limited production experience; rely on vendors for critical systems', score: 1, insight: 'Operational capabilities needed for AI ownership' },
      { text: 'Some production systems with basic monitoring and support', score: 2, insight: 'Operational maturity required for AI responsibility' },
      { text: 'Robust production operations with SLAs and incident management', score: 3, insight: 'Strong operations foundation for AI deployment' },
      { text: 'World-class site reliability with automated ops and observability', score: 4, insight: 'Operational excellence enables AI at scale' }
    ]
  },
  {
    id: 'technical-4',
    category: 'technical',
    question: 'How capable are your existing systems at integrating new technologies?',
    options: [
      { text: 'Tightly coupled legacy systems with difficult integration', score: 1, insight: 'System modernisation required before AI integration' },
      { text: 'Some integration capability but requires significant custom work', score: 2, insight: 'Integration layer needed for AI adoption' },
      { text: 'Modern architecture with API-first design and standard integrations', score: 3, insight: 'Architecture ready for AI integration' },
      { text: 'Microservices with event-driven architecture and API management', score: 4, insight: 'Exceptional architecture for AI ecosystem' }
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

    // Determine readiness level
    let readinessLevel: Results['readinessLevel'];
    if (overall < 35) readinessLevel = 'exploring';
    else if (overall < 60) readinessLevel = 'emerging';
    else if (overall < 80) readinessLevel = 'advancing';
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
                {results.readinessLevel === 'emerging' && 'You have some AI foundations in place and are ready to begin pilot projects. Strategic focus on capability building will accelerate your progress.'}
                {results.readinessLevel === 'advancing' && 'You\'re actively implementing AI with measurable results. Continue scaling successful initiatives while strengthening remaining capability gaps.'}
                {results.readinessLevel === 'leading' && 'You\'re demonstrating AI leadership with mature capabilities across all dimensions. Focus on innovation and ecosystem development.'}
              </p>
            </div>
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

          <div className="space-y-3">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(question.id, option.score)}
                className="w-full text-left p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-sm font-semibold text-gray-600 group-hover:text-blue-600">
                      {idx + 1}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 group-hover:text-blue-900">
                      {option.text}
                    </p>
                    <p className="text-sm text-gray-500 mt-1 group-hover:text-blue-700">
                      {option.insight}
                    </p>
                  </div>
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
