/**
 * FAQ Matcher - Intelligent keyword matching for election questions
 * Helps find the best matching FAQ answers
 */

import { FAQItem } from '../types/index';

/**
 * Election-specific FAQ database
 */
export const ELECTION_FAQ: FAQItem[] = [
  {
    id: 'faq-001',
    question: 'How do I register to vote?',
    answer:
      'You can register to vote online, by mail, or in person at your local election office. You must be at least 18 years old, a U.S. citizen, and a resident of your state for at least 30 days before the election.',
    category: 'registration',
    keywords: ['register', 'voter registration', 'register to vote', 'eligibility', 'how to register'],
    translations: {
      es: {
        question: '¿Cómo me registro para votar?',
        answer:
          'Puede registrarse para votar en línea, por correo o en persona en su oficina electoral local.',
      },
      fr: {
        question: 'Comment m\'inscrire pour voter?',
        answer: 'Vous pouvez vous inscrire en ligne, par courrier ou en personne.',
      },
    },
  },
  {
    id: 'faq-002',
    question: 'What ID do I need to bring to vote?',
    answer:
      'You should bring a valid photo ID such as a driver\'s license, passport, or state ID. If you don\'t have photo ID, you may still vote but may need to sign an affidavit.',
    category: 'voting',
    keywords: ['ID', 'identification', 'what to bring', 'ballot', 'voting requirements'],
    translations: {
      es: {
        question: '¿Qué identificación necesito?',
        answer: 'Debe traer una identificación con foto válida.',
      },
    },
  },
  {
    id: 'faq-003',
    question: 'When is Election Day?',
    answer:
      'Election Day in the United States is always held on Tuesday after the first Monday in November. Check your local election website for specific dates.',
    category: 'voting',
    keywords: ['election day', 'voting date', 'when to vote', 'ballot day'],
    translations: {
      es: {
        question: '¿Cuándo es el Día de Elecciones?',
        answer: 'El Día de Elecciones es el martes después del primer lunes de noviembre.',
      },
    },
  },
  {
    id: 'faq-004',
    question: 'How do I find my polling location?',
    answer:
      'You can find your polling location by visiting your state\'s election website or using the "Where to Vote" tool. You can search by address or zip code.',
    category: 'voting',
    keywords: ['polling location', 'polling station', 'voting location', 'where to vote', 'find polling place'],
    translations: {
      es: {
        question: '¿Dónde puedo votar?',
        answer: 'Visite el sitio web de elecciones de su estado o use la herramienta "Where to Vote".',
      },
    },
  },
  {
    id: 'faq-005',
    question: 'Can I vote early?',
    answer:
      'Yes! Most states offer early voting either in person or by mail-in ballot. Early voting typically begins 2-3 weeks before Election Day. Check your state\'s website for specific dates and locations.',
    category: 'voting',
    keywords: ['early voting', 'early vote', 'mail-in', 'absentee', 'before election day'],
    translations: {
      es: {
        question: '¿Puedo votar anticipadamente?',
        answer: 'Sí, la mayoría de los estados ofrecen votación anticipada.',
      },
    },
  },
  {
    id: 'faq-006',
    question: 'What is the registration deadline?',
    answer:
      'Voter registration deadlines vary by state, but most require registration by 30 days before Election Day. Some states offer same-day registration.',
    category: 'registration',
    keywords: ['deadline', 'registration deadline', 'when to register', 'last day to register'],
    translations: {
      es: {
        question: '¿Cuál es la fecha límite de registro?',
        answer: 'Los plazos varían según el estado, pero la mayoría requiere registro 30 días antes.',
      },
    },
  },
  {
    id: 'faq-007',
    question: 'How are votes counted?',
    answer:
      'Votes are typically counted by voting machines or by hand depending on your location. All votes are counted and verified multiple times to ensure accuracy.',
    category: 'results',
    keywords: ['vote counting', 'count votes', 'how votes are counted', 'results'],
    translations: {
      es: {
        question: '¿Cómo se cuentan los votos?',
        answer: 'Los votos se cuentan a máquina o a mano y se verifican varias veces.',
      },
    },
  },
  {
    id: 'faq-008',
    question: 'What if I make a mistake on my ballot?',
    answer:
      'If you make a mistake on a paper ballot, ask a poll worker for a replacement ballot. If using a voting machine, you can usually select "Start Over" or inform a poll worker.',
    category: 'voting',
    keywords: ['mistake', 'error', 'ballot error', 'wrong vote', 'correction'],
    translations: {
      es: {
        question: '¿Qué pasa si me equivoco?',
        answer: 'Pídele a un trabajador electoral un nuevo boletín de reemplazo.',
      },
    },
  },
  {
    id: 'faq-009',
    question: 'Am I eligible to vote?',
    answer:
      'To be eligible to vote, you must be: at least 18 years old, a U.S. citizen, a registered voter, and not currently imprisoned for a felony conviction.',
    category: 'eligibility',
    keywords: ['eligible', 'eligibility', 'can i vote', 'requirements', 'qualify'],
    translations: {
      es: {
        question: '¿Soy elegible para votar?',
        answer:
          'Para ser elegible debe tener al menos 18 años, ser ciudadano de EE.UU. y estar registrado.',
      },
    },
  },
  {
    id: 'faq-010',
    question: 'What if I have a disability?',
    answer:
      'Polling places must be accessible to voters with disabilities. You can request assistance, use a voting machine with accessibility features, or apply for an absentee ballot.',
    category: 'accessibility',
    keywords: [
      'disability',
      'accessible',
      'accessibility',
      'wheelchair',
      'hearing impaired',
      'assistance',
      'accomodations',
    ],
    translations: {
      es: {
        question: '¿Y si tengo una discapacidad?',
        answer: 'Los lugares de votación deben ser accesibles. Puede solicitar asistencia.',
      },
    },
  },
  {
    id: 'faq-011',
    question: 'Can I bring someone to help me vote?',
    answer:
      'You can bring someone to assist you, or poll workers are available to help. However, certain people like employers or union representatives cannot assist you.',
    category: 'voting',
    keywords: ['help', 'assistant', 'bring someone', 'poll worker', 'assistance'],
    translations: {
      es: {
        question: '¿Puedo traer a alguien para que me ayude?',
        answer: 'Puede traer a alguien para que lo ayude, o los trabajadores electorales están disponibles.',
      },
    },
  },
  {
    id: 'faq-012',
    question: 'What is majority vs plurality?',
    answer:
      'A majority is more than 50% of the total votes. Plurality is the largest number of votes, even if not a majority. Most elections use plurality voting.',
    category: 'results',
    keywords: ['majority', 'plurality', 'winning', 'results', 'vote count'],
    translations: {
      es: {
        question: '¿Qué es mayoría vs pluralidad?',
        answer: 'La mayoría es más del 50% de los votos. La pluralidad es el mayor número de votos.',
      },
    },
  },
  {
    id: 'faq-013',
    question: 'How long do I have to vote on Election Day?',
    answer:
      'Polling places are typically open from 7am to 8pm on Election Day. As long as you arrive before closing, you can vote. Check your local voting hours.',
    category: 'voting',
    keywords: ['hours', 'voting hours', 'open', 'close', 'time to vote'],
    translations: {
      es: {
        question: '¿Cuánto tiempo tengo para votar?',
        answer: 'Las urnas están abiertas de 7am a 8pm. Si llega antes del cierre, puede votar.',
      },
    },
  },
  {
    id: 'faq-014',
    question: 'Can I vote if I just moved?',
    answer:
      'If you moved within the same state, you may need to re-register. If you moved to a new state, you must register in your new state. Same-day registration is available in many states.',
    category: 'registration',
    keywords: ['moved', 'new address', 'moved states', 're-register', 'change address'],
    translations: {
      es: {
        question: '¿Puedo votar si me mudé?',
        answer: 'Si se mudó, es posible que deba registrarse de nuevo en su nuevo estado.',
      },
    },
  },
  {
    id: 'faq-015',
    question: 'What happens if I vote twice?',
    answer:
      'Voting twice is illegal and a serious crime. Election officials verify that each person votes only once using voter rolls and records.',
    category: 'voting',
    keywords: ['double voting', 'vote twice', 'illegal', 'fraud', 'violation'],
    translations: {
      es: {
        question: '¿Qué pasa si voto dos veces?',
        answer: 'Votar dos veces es ilegal y un crimen grave.',
      },
    },
  },
  {
    id: 'faq-016',
    question: 'How do I request an absentee ballot?',
    answer:
      'Contact your local election office or visit your state\'s website. Most states allow you to request an absentee ballot online, by mail, or in person.',
    category: 'voting',
    keywords: ['absentee', 'mail-in ballot', 'request ballot', 'remote voting'],
    translations: {
      es: {
        question: '¿Cómo solicito un voto en ausencia?',
        answer:
          'Comuníquese con su oficina electoral local o visite el sitio web de su estado.',
      },
    },
  },
  {
    id: 'faq-017',
    question: 'When will election results be available?',
    answer:
      'Results are typically available on election night or the next morning. Final results may take days if there are close races or recounts.',
    category: 'results',
    keywords: ['results', 'outcome', 'winner', 'results available', 'when results'],
    translations: {
      es: {
        question: '¿Cuándo estarán disponibles los resultados?',
        answer: 'Los resultados suelen estar disponibles la noche electoral o la mañana siguiente.',
      },
    },
  },
  {
    id: 'faq-018',
    question: 'Can I change my vote after voting?',
    answer:
      'Once you submit your ballot, you typically cannot change your vote. However, you may be able to request an absentee or early voting ballot before Election Day.',
    category: 'voting',
    keywords: ['change vote', 'undo vote', 'revise', 'after voting', 'submit'],
    translations: {
      es: {
        question: '¿Puedo cambiar mi voto después de votEr?',
        answer: 'Una vez que envía su papeleta, normalmente no puede cambiar su voto.',
      },
    },
  },
  {
    id: 'faq-019',
    question: 'What documents do I need to register?',
    answer:
      'Most states require: proof of U.S. citizenship, proof of state residency, proof of age, and a valid ID. Requirements vary by state.',
    category: 'registration',
    keywords: ['documents', 'proof', 'citizenship', 'residency', 'ID', 'requirements'],
    translations: {
      es: {
        question: '¿Qué documentos necesito para registrarme?',
        answer: 'La mayoría de los estados requieren prueba de ciudadanía y residencia del estado.',
      },
    },
  },
  {
    id: 'faq-020',
    question: 'How do I check my voter registration status?',
    answer:
      'Visit your state\'s election website or use the "Check Voter Registration" tool. You can usually search by name or ID number.',
    category: 'registration',
    keywords: ['check registration', 'registered', 'status', 'verify registration'],
    translations: {
      es: {
        question: '¿Cómo verifico el estado de mi registro electoral?',
        answer: 'Visite el sitio web de elecciones de su estado o use la herramienta de verificación.',
      },
    },
  },
];

/**
 * Normalize text for comparison
 * @param text - Text to normalize
 * @returns Normalized text
 */
const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .trim();
};

/**
 * Calculate similarity score between two strings
 * @param str1 - First string
 * @param str2 - Second string
 * @returns Similarity score 0-1
 */
const calculateSimilarity = (str1: string, str2: string): number => {
  const normalized1 = normalizeText(str1);
  const normalized2 = normalizeText(str2);

  if (normalized1 === normalized2) return 1;

  const longer =
    normalized1.length > normalized2.length ? normalized1 : normalized2;
  const shorter =
    normalized1.length > normalized2.length ? normalized2 : normalized1;

  if (longer.length === 0) return 1;

  const editDistance = getLevenshteinDistance(shorter, longer);
  return (longer.length - editDistance) / longer.length;
};

/**
 * Calculate Levenshtein distance between two strings
 * @param str1 - First string
 * @param str2 - Second string
 * @returns Edit distance
 */
const getLevenshteinDistance = (str1: string, str2: string): number => {
  const track = Array(str2.length + 1)
    .fill(null)
    .map(() => Array(str1.length + 1).fill(0));

  for (let i = 0; i <= str1.length; i++) {
    track[0][i] = i;
  }

  for (let j = 0; j <= str2.length; j++) {
    track[j][0] = j;
  }

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1,
        track[j - 1][i] + 1,
        track[j - 1][i - 1] + indicator
      );
    }
  }

  return track[str2.length][str1.length];
};

/**
 * Find best matching FAQ for a question
 * @param question - User question
 * @param language - Language code (default 'en')
 * @returns Best matching FAQ item or null
 */
export const findBestMatch = (
  question: string,
  language: string = 'en'
): FAQItem | null => {
  if (!question || question.trim().length === 0) {
    return null;
  }

  const normalizedQuestion = normalizeText(question);
  const questionWords = normalizedQuestion.split(/\s+/);

  let bestMatch: { faq: FAQItem; score: number } | null = null;

  for (const faq of ELECTION_FAQ) {
    let score = 0;

    // Check direct question match
    const questionMatch = calculateSimilarity(question, faq.question);
    score += questionMatch * 40;

    // Check keyword matches
    const matchedKeywords = faq.keywords.filter((keyword) =>
      questionWords.some(
        (word) =>
          calculateSimilarity(word, keyword) > 0.7 ||
          keyword.includes(word)
      )
    );
    score += matchedKeywords.length * 15;

    // Check answer relevance
    if (matchedKeywords.length > 0) {
      score += 10;
    }

    // Update best match if this is better
    if (!bestMatch || score > bestMatch.score) {
      bestMatch = { faq, score };
    }
  }

  // Return match only if score is high enough
  return bestMatch && bestMatch.score >= 20 ? bestMatch.faq : null;
};

/**
 * Find multiple matching FAQs for a question
 * @param question - User question
 * @param limit - Maximum number of results
 * @returns Array of matching FAQ items sorted by relevance
 */
export const findMatches = (question: string, limit: number = 5): FAQItem[] => {
  const normalizedQuestion = normalizeText(question);
  const questionWords = normalizedQuestion.split(/\s+/);

  const matches: { faq: FAQItem; score: number }[] = [];

  for (const faq of ELECTION_FAQ) {
    let score = 0;

    // Check question similarity
    const questionMatch = calculateSimilarity(question, faq.question);
    score += questionMatch * 40;

    // Check keyword matches
    const matchedKeywords = faq.keywords.filter((keyword) =>
      questionWords.some(
        (word) =>
          calculateSimilarity(word, keyword) > 0.7 ||
          keyword.includes(word)
      )
    );
    score += matchedKeywords.length * 15;

    if (matchedKeywords.length > 0) {
      score += 10;
    }

    if (score > 0) {
      matches.push({ faq, score });
    }
  }

  // Sort by score descending
  return matches
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((m) => m.faq);
};

/**
 * Get FAQ by category
 * @param category - FAQ category
 * @returns Array of FAQs in the category
 */
export const getFAQByCategory = (
  category: string
): FAQItem[] => {
  return ELECTION_FAQ.filter((faq) => faq.category === category);
};

/**
 * Get all FAQ categories
 * @returns Array of unique categories
 */
export const getFAQCategories = (): string[] => {
  return Array.from(new Set(ELECTION_FAQ.map((faq) => faq.category)));
};
