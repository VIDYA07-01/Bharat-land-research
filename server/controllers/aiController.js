const Research = require('../models/Research');
const Dataset = require('../models/Dataset');
const Policy = require('../models/Policy');
const CaseStudy = require('../models/CaseStudy');

// Mock AI response generator for demo purposes
const generateMockAIResponse = (query, relatedResearch, relatedDatasets, relatedPolicies) => {
  const queryLower = query.toLowerCase();

  let answer = '';

  if (queryLower.includes('land dispute') || queryLower.includes('dispute')) {
    answer = `Based on available research, land disputes in India are primarily categorized into boundary disputes, ownership conflicts, encroachment cases, and tribal land rights issues. Studies indicate that over 66% of civil litigation in India relates to land disputes. Key factors include inadequate land records digitization, overlapping claims, and lack of clear titling systems. Evidence suggests that digital land record management systems like DILRMP significantly reduce new disputes.`;
  } else if (queryLower.includes('urban') || queryLower.includes('urbanization')) {
    answer = `Research indicates India's urban land area has expanded approximately 18% over the past decade. Major urban centers show conversion of agricultural and peri-urban land at accelerating rates. Studies from Maharashtra and Karnataka highlight challenges in planned urban growth. Smart city initiatives and urban land use policies have shown measurable improvement in structured development.`;
  } else if (queryLower.includes('climate') || queryLower.includes('drought') || queryLower.includes('flood')) {
    answer = `Climate vulnerability research reveals significant regional variations. Rajasthan and Gujarat face high drought risks, while coastal states and Gangetic plains face flood-related land vulnerability. Land degradation affects approximately 29.7% of India's total geographical area. Research recommends watershed management, agroforestry, and climate-resilient farming practices as key interventions.`;
  } else if (queryLower.includes('karnataka')) {
    answer = `Research on Karnataka highlights significant land-use changes primarily in the Bangalore Metropolitan Region and coastal districts. Agricultural land conversion for industrial and residential use has accelerated since 2015. The state has implemented digital land records (Bhoomi) which has reduced disputes. Forest fragmentation in the Western Ghats remains a key concern in multiple studies.`;
  } else if (queryLower.includes('agricultural') || queryLower.includes('agriculture')) {
    answer = `Agricultural land research highlights key trends: net sown area has been declining at 0.5% annually over the past decade. Studies emphasize diversification, soil health management, and micro-irrigation as solutions. PM-KISAN and other schemes show positive impact data, with 11.5 crore farmers benefiting. Research suggests land consolidation policies can improve productivity by 15-22%.`;
  } else if (queryLower.includes('gis') || queryLower.includes('geospatial')) {
    answer = `GIS-based research has revolutionized land governance in India. Key applications include cadastral mapping, land use classification, crop area estimation, and urban growth monitoring. Integrated use of satellite imagery with ground-truth data has improved record accuracy. ISRO and Survey of India collaboration has produced high-resolution land use maps for over 600 districts.`;
  } else if (queryLower.includes('policy') || queryLower.includes('governance')) {
    answer = `Land governance policy research suggests that transparent, technology-driven systems significantly reduce disputes and improve administration efficiency. The Digital India Land Records Modernization Programme (DILRMP) has digitized land records across most states. Evidence shows that well-implemented land policies can increase agricultural productivity by 12-18% and reduce litigation costs by 30%.`;
  } else {
    answer = `Based on the land governance knowledge base, your query relates to ongoing research in land management, policy implementation, and governance. Available research suggests evidence-based approaches combining geospatial technology, digital record-keeping, and community participation yield the best outcomes for sustainable land governance. Please refine your query for more specific results.`;
  }

  return answer;
};

// @desc    AI Research Assistant query
// @route   POST /api/ai/query
// @access  Public
exports.queryAssistant = async (req, res, next) => {
  try {
    const { query } = req.body;

    if (!query || query.trim().length < 3) {
      return res.status(400).json({ success: false, error: 'Please provide a valid query' });
    }

    const queryTerms = query.split(' ').filter((w) => w.length > 3).slice(0, 5);
    const searchRegex = new RegExp(queryTerms.join('|'), 'i');

    const [relatedResearch, relatedDatasets, relatedPolicies, relatedCaseStudies] =
      await Promise.all([
        Research.find({
          status: { $in: ['approved', 'published'] },
          $or: [
            { title: searchRegex },
            { abstract: searchRegex },
            { keywords: { $in: queryTerms } },
          ],
        }).select('title authors institution publicationYear abstract category').limit(5),

        Dataset.find({
          status: { $in: ['approved', 'published'] },
          $or: [{ name: searchRegex }, { description: searchRegex }],
        }).select('name description category state year').limit(4),

        Policy.find({
          status: 'published',
          $or: [{ name: searchRegex }, { description: searchRegex }],
        }).select('name department category year state').limit(4),

        CaseStudy.find({
          status: { $in: ['approved', 'published'] },
          $or: [{ title: searchRegex }, { problem: searchRegex }],
        }).select('title location category problem').limit(3),
      ]);

    const answer = generateMockAIResponse(query, relatedResearch, relatedDatasets, relatedPolicies);

    res.status(200).json({
      success: true,
      disclaimer: 'AI response is generated from demo data for prototype purposes. Not an official government AI system.',
      data: {
        query,
        answer,
        relatedResearch,
        relatedDatasets,
        relatedPolicies,
        relatedCaseStudies,
        confidence: 0.78,
        sources: relatedResearch.length + relatedDatasets.length + relatedPolicies.length,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Research summarization
// @route   POST /api/ai/summarize
// @access  Private (researcher+)
exports.summarizeResearch = async (req, res, next) => {
  try {
    const { researchId, text } = req.body;

    let content = text || '';
    let title = 'Provided Text';

    if (researchId) {
      const research = await Research.findById(researchId);
      if (!research) return res.status(404).json({ success: false, error: 'Research not found' });
      content = research.abstract || '';
      title = research.title;
    }

    if (!content) {
      return res.status(400).json({ success: false, error: 'No content to summarize' });
    }

    const wordCount = content.split(' ').length;
    const sentences = content.split('.').filter((s) => s.trim().length > 0);
    const summary = sentences.slice(0, Math.min(3, sentences.length)).join('. ') + '.';

    const keyPoints = [
      'Key findings highlight the importance of evidence-based land governance approaches.',
      'Geospatial technologies play a critical role in modern land management systems.',
      'Community participation and transparent processes improve policy outcomes.',
      'Digital record-keeping reduces disputes and improves administrative efficiency.',
    ].slice(0, Math.min(3, Math.ceil(wordCount / 100)));

    res.status(200).json({
      success: true,
      disclaimer: 'Summary generated by demo AI module. For research purposes only.',
      data: {
        title,
        originalLength: wordCount,
        summary,
        keyPoints,
        themes: ['Land Governance', 'Policy', 'Digital Systems'],
        methodology: 'Extractive summarization (Demo)',
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Research recommendations
// @route   GET /api/ai/recommendations
// @access  Public
exports.getRecommendations = async (req, res, next) => {
  try {
    const { category, state } = req.query;

    const query = { status: { $in: ['approved', 'published'] } };
    if (category) query.category = new RegExp(category, 'i');
    if (state) query.state = new RegExp(state, 'i');

    const research = await Research.find(query)
      .sort('-viewCount -downloadCount')
      .select('title authors institution publicationYear category abstract')
      .limit(8);

    const datasets = await Dataset.find({
      status: { $in: ['approved', 'published'] },
      ...(category && { category: new RegExp(category, 'i') }),
    }).sort('-downloadCount').select('name description category year').limit(5);

    res.status(200).json({
      success: true,
      data: {
        recommendedResearch: research,
        recommendedDatasets: datasets,
        basedOn: { category, state },
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Trend analysis
// @route   POST /api/ai/trends
// @access  Private (researcher+)
exports.analyzeTrends = async (req, res, next) => {
  try {
    const { category, state, timeRange } = req.body;

    const trendData = {
      period: timeRange || '2015-2024',
      region: state || 'National',
      category: category || 'Land Use',
      disclaimer: 'DEMO DATA – Trend analysis based on sample data, not official statistics.',
      trends: [
        { indicator: 'Urban Expansion', direction: 'increasing', rate: '+2.8% per year', confidence: 'High' },
        { indicator: 'Agricultural Land', direction: 'decreasing', rate: '-0.6% per year', confidence: 'High' },
        { indicator: 'Forest Cover', direction: 'slight decrease', rate: '-0.2% per year', confidence: 'Medium' },
        { indicator: 'Land Disputes', direction: 'decreasing', rate: '-3.1% per year', confidence: 'Medium' },
        { indicator: 'Digital Records', direction: 'increasing', rate: '+12% per year', confidence: 'High' },
      ],
      keyInsights: [
        'Urban sprawl is the dominant land-use change driver',
        'Agricultural-to-urban conversion is accelerating in peri-urban zones',
        'Digital land governance has significantly reduced processing times',
        'Climate-vulnerable zones show higher land degradation rates',
      ],
    };

    res.status(200).json({ success: true, data: trendData });
  } catch (err) {
    next(err);
  }
};
