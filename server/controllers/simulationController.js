const Simulation = require('../models/Simulation');
const { AppError } = require('../middleware/errorHandler');

const generateSimulationResults = (parameters, scenarioType) => {
  const {
    population = 1000000,
    developmentLevel = 'medium',
    climateRisk = 'medium',
    landCategory = 'agricultural',
  } = parameters;

  const baseMultiplier = { low: 0.8, medium: 1.0, high: 1.2 }[developmentLevel] || 1.0;
  const riskMultiplier = { low: 0.9, medium: 1.0, high: 1.15 }[climateRisk] || 1.0;
  const isCurrent = scenarioType === 'current';

  return {
    landUseImpact: {
      agriculturalChange: isCurrent ? -2.1 : -1.2,
      urbanGrowth: isCurrent ? 3.8 : 2.5,
      forestCover: isCurrent ? -0.8 : -0.3,
      description: isCurrent
        ? 'Current trends show accelerating urban expansion with agricultural land loss'
        : 'Proposed policy shows improved land use balance with reduced agricultural loss',
    },
    economicImpact: {
      gdpContribution: (isCurrent ? 2.1 : 3.4) * baseMultiplier,
      employmentGenerated: Math.floor(population * (isCurrent ? 0.02 : 0.035)),
      investmentAttractionScore: isCurrent ? 62 : 78,
      description: isCurrent
        ? 'Economic gains from urbanization offset partially by agricultural losses'
        : 'Balanced development approach shows higher economic returns',
    },
    environmentalImpact: {
      carbonSequestration: isCurrent ? -15 : 8,
      waterRetention: isCurrent ? -8 : 5,
      biodiversityScore: isCurrent ? 45 : 62,
      description: isCurrent
        ? 'Environmental degradation continues under current policies'
        : 'Significant environmental improvements projected under proposed policy',
    },
    socialImpact: {
      displacementRisk: isCurrent ? 'High' : 'Low',
      accessToLandScore: isCurrent ? 58 : 74,
      conflictReduction: isCurrent ? -5 : 28,
      description: isCurrent
        ? 'Social tensions remain high due to inequitable land distribution'
        : 'Policy reforms show measurable improvement in social equity',
    },
    infrastructureImpact: {
      connectivityScore: isCurrent ? 65 : 82,
      publicServicesAccess: isCurrent ? 60 : 78,
      disasterPreparedness: isCurrent ? 48 : 70,
      description: isCurrent
        ? 'Infrastructure development is reactive rather than planned'
        : 'Proactive infrastructure planning enables better service delivery',
    },
    overallScore: isCurrent ? 52 : 74,
    confidence: 0.7,
  };
};

// @desc    Run simulation
// @route   POST /api/simulation/run
// @access  Private (researcher, government, admin)
exports.runSimulation = async (req, res, next) => {
  try {
    const { title, parameters } = req.body;

    if (!parameters || !parameters.region) {
      return next(new AppError('Please provide simulation parameters including region', 400));
    }

    const currentScenarioResults = generateSimulationResults(parameters, 'current');
    const proposedScenarioResults = generateSimulationResults(parameters, 'proposed');

    const simulation = await Simulation.create({
      title: title || `Simulation - ${parameters.region} - ${new Date().toLocaleDateString()}`,
      createdBy: req.user._id,
      parameters,
      scenarios: [
        {
          name: 'Scenario A - Current Policy',
          description: 'Baseline scenario with existing policies',
          policyChanges: ['No changes to current land use policies'],
          results: currentScenarioResults,
        },
        {
          name: 'Scenario B - Proposed Policy',
          description: 'Reform scenario with proposed interventions',
          policyChanges: [
            'Stricter agricultural land protection',
            'Urban development in designated zones only',
            'Mandatory green belt preservation',
            'Digital land records integration',
          ],
          results: proposedScenarioResults,
        },
      ],
      status: 'completed',
    });

    res.status(201).json({
      success: true,
      disclaimer:
        'SIMULATION BASED ON DEMO/MODEL DATA – Not an official government prediction. Results are illustrative only.',
      data: simulation,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user's simulations
// @route   GET /api/simulation
// @access  Private
exports.getSimulations = async (req, res, next) => {
  try {
    const simulations = await Simulation.find({ createdBy: req.user._id }).sort('-createdAt');
    res.status(200).json({ success: true, count: simulations.length, data: simulations });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single simulation
// @route   GET /api/simulation/:id
// @access  Private
exports.getSimulation = async (req, res, next) => {
  try {
    const simulation = await Simulation.findById(req.params.id).populate('createdBy', 'name organization');
    if (!simulation) return next(new AppError('Simulation not found', 404));

    if (simulation.createdBy._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new AppError('Not authorized to view this simulation', 403));
    }

    res.status(200).json({ success: true, data: simulation });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete simulation
// @route   DELETE /api/simulation/:id
// @access  Private
exports.deleteSimulation = async (req, res, next) => {
  try {
    const simulation = await Simulation.findById(req.params.id);
    if (!simulation) return next(new AppError('Simulation not found', 404));

    if (simulation.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new AppError('Not authorized', 403));
    }

    await simulation.deleteOne();
    res.status(200).json({ success: true, message: 'Simulation deleted' });
  } catch (err) {
    next(err);
  }
};
