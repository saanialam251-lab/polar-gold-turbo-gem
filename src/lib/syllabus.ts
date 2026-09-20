import type { Chapter, ClassId, Subject } from "./types";

export const CLASSES: ClassId[] = [9, 10, 11, 12];
export const SUBJECTS: Subject[] = ["Physics", "Chemistry", "Mathematics"];

export const CLASS_META: Record<
  ClassId,
  { label: string; note: string; year: string }
> = {
  9: {
    label: "Class 9",
    note: "New NCERT 2026–27 · NEP redesign",
    year: "2026–27",
  },
  10: {
    label: "Class 10",
    note: "Board year · NCERT 2025–26",
    year: "2025–26",
  },
  11: {
    label: "Class 11",
    note: "Foundation for JEE / NEET",
    year: "NCERT",
  },
  12: {
    label: "Class 12",
    note: "Board + entrance overlap",
    year: "NCERT",
  },
};

function ch(
  order: number,
  id: string,
  name: string,
  topics: string[],
): Chapter {
  return {
    id,
    name,
    order,
    topics: topics.map((name, i) => ({
      id: `topic-${String(i + 1).padStart(2, "0")}-${name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")}`,
      name,
      order: i + 1,
    })),
  };
}

export const SYLLABUS: Record<ClassId, Record<Subject, Chapter[]>> = {
  9: {
    Physics: [
      ch(1, "chapter-01-describing-motion-around-us", "Describing Motion Around Us", [
        "Distance and Displacement",
        "Speed and Velocity",
        "Acceleration",
        "Graphical Representation of Motion",
        "Equations of Motion",
        "Uniform Circular Motion",
        "Relative Motion",
      ]),
      ch(2, "chapter-02-how-forces-affect-motion", "How Forces Affect Motion", [
        "Force: Concept, Magnitude and Direction",
        "Balanced and Unbalanced Forces",
        "Force of Friction",
        "Newton's First Law",
        "Newton's Second Law",
        "Newton's Third Law",
        "Momentum and Conservation",
        "Applications of Laws of Motion",
      ]),
      ch(3, "chapter-03-work-energy-simple-machines", "Work, Energy and Simple Machines", [
        "Work Done by a Constant Force",
        "Kinetic Energy",
        "Potential Energy",
        "Work–Energy Theorem",
        "Conservation of Energy",
        "Power",
        "Simple Machines",
        "Mechanical Advantage",
      ]),
      ch(4, "chapter-04-sound-waves", "Sound Waves: Characteristics and Applications", [
        "Production and Propagation of Sound",
        "Sound as a Longitudinal Wave",
        "Wave Characteristics",
        "Speed of Sound",
        "Pitch and Loudness",
        "Echo and Reverberation",
        "Echolocation",
      ]),
    ],
    Chemistry: [
      ch(1, "chapter-01-exploring-mixtures", "Exploring Mixtures and Their Separation", [
        "Homogeneous and Heterogeneous Mixtures",
        "Solutions, Suspensions and Colloids",
        "Concentration of Solutions",
        "Solubility and Temperature",
        "Filtration, Evaporation, Crystallisation",
        "Distillation, Chromatography",
        "Applications of Separation",
      ]),
      ch(2, "chapter-02-journey-inside-atom", "Structure of an Atom", [
        "Subatomic Particles",
        "Thomson's Model",
        "Rutherford's Model",
        "Bohr's Model",
        "Electron Distribution",
        "Atomic Number and Mass Number",
        "Valency",
        "Isotopes and Isobars",
      ]),
      ch(3, "chapter-03-atomic-foundations-matter", "Atoms and Molecules", [
        "Law of Conservation of Mass",
        "Law of Constant Proportions",
        "Dalton's Atomic Theory",
        "Molecules of Elements and Compounds",
        "Ions and Ionic Compounds",
        "Writing Chemical Formulae",
        "Molecular Mass",
        "Mole Concept",
      ]),
    ],
    Mathematics: [
      ch(1, "chapter-01-use-of-coordinates", "Orienting Yourself: Coordinates", [
        "Cartesian Plane and Axes",
        "Coordinates of a Point",
        "Plotting Points",
        "Quadrants and Signs",
        "Distance from Axes",
        "Applications of Coordinate Geometry",
      ]),
      ch(2, "chapter-02-linear-polynomials", "Introduction to Linear Polynomials", [
        "Polynomials in One Variable",
        "Degree and Types",
        "Zeros of a Polynomial",
        "Remainder Theorem",
        "Factor Theorem",
        "Factorisation",
        "Algebraic Identities",
      ]),
      ch(3, "chapter-03-world-of-numbers", "The World of Numbers", [
        "Natural, Integer, Rational, Irrational",
        "Number Line",
        "Terminating and Non-terminating Decimals",
        "nth Root of Real Numbers",
        "Laws of Exponents",
        "Rationalisation",
        "Surds",
      ]),
      ch(4, "chapter-04-exploring-algebraic-identities", "Exploring Algebraic Identities", [
        "Standard Identities",
        "Expanding Using Identities",
        "Factorisation Using Identities",
        "Applications in Simplification",
        "Evaluation Using Identities",
        "Problem Solving",
      ]),
      ch(5, "chapter-05-geometry", "I'm Up and Down, and Round and Round", [
        "Lines and Angles",
        "Triangles and their Properties",
        "Congruence of Triangles",
        "Quadrilaterals",
        "Circles",
        "Angle Sum Properties",
      ]),
      ch(6, "chapter-06-perimeter-area", "Measuring Space: Perimeter and Area", [
        "Perimeter and Area of Rectangles, Triangles",
        "Parallelograms and Trapeziums",
        "Circumference and Area of a Circle",
        "Sectors and Segments",
        "Surface Area of Solids",
        "Volume of Solids",
        "Applications",
      ]),
      ch(7, "chapter-07-introduction-probability", "The Mathematics of Maybe", [
        "Chance and Randomness",
        "Experiments and Outcomes",
        "Empirical Probability",
        "Events and Favourable Outcomes",
        "Probability Scale",
        "Simple Numerical Problems",
      ]),
      ch(8, "chapter-08-sequences-progressions", "Predicting What Comes Next", [
        "Patterns and Sequences",
        "Arithmetic Progressions",
        "Sum of First n Terms of an AP",
        "Geometric Progressions",
        "Applications of Progressions",
      ]),
    ],
  },
  10: {
    Physics: [
      ch(1, "chapter-01-light-reflection-refraction", "Light: Reflection and Refraction", [
        "Laws of Reflection",
        "Image Formation by Mirrors",
        "Mirror Formula and Magnification",
        "Laws of Refraction and Snell's Law",
        "Refraction through Glass Slab",
        "Lenses: Image Formation",
        "Lens Formula and Power",
        "Total Internal Reflection",
      ]),
      ch(2, "chapter-02-human-eye-colourful-world", "The Human Eye and the Colourful World", [
        "Structure of the Human Eye",
        "Accommodation and Vision Defects",
        "Dispersion of Light",
        "Scattering of Light",
        "Atmospheric Refraction",
        "Twinkling of Stars",
      ]),
      ch(3, "chapter-03-electricity", "Electricity", [
        "Electric Current and Circuit",
        "Potential Difference and Ohm's Law",
        "Resistance and Resistivity",
        "Series and Parallel Resistors",
        "Heating Effect of Current",
        "Electric Power and Energy",
        "Domestic Circuits and Safety",
      ]),
      ch(4, "chapter-04-magnetic-effects-current", "Magnetic Effects of Electric Current", [
        "Magnetic Field due to a Current",
        "Right-Hand Thumb Rule",
        "Circular Loop and Solenoid",
        "Force on a Current-carrying Conductor",
        "Electric Motor",
        "Electromagnetic Induction",
        "Electric Generator",
      ]),
    ],
    Chemistry: [
      ch(1, "chapter-01-chemical-reactions-equations", "Chemical Reactions and Equations", [
        "Types of Chemical Reactions",
        "Balancing Chemical Equations",
        "Combination and Decomposition",
        "Displacement Reactions",
        "Oxidation and Reduction",
        "Corrosion and Rancidity",
      ]),
      ch(2, "chapter-02-acids-bases-salts", "Acids, Bases and Salts", [
        "Properties of Acids and Bases",
        "pH Scale and Indicators",
        "Neutralisation",
        "Salts and their Types",
        "Common Salt and its Compounds",
        "Baking Soda and Washing Soda",
        "Plaster of Paris",
      ]),
      ch(3, "chapter-03-metals-nonmetals", "Metals and Non-metals", [
        "Physical Properties",
        "Chemical Properties of Metals",
        "Reactivity Series",
        "Displacement Reactions",
        "Extraction of Metals",
        "Corrosion and Prevention",
        "Ionic Compounds",
      ]),
      ch(4, "chapter-04-carbon-compounds", "Carbon and its Compounds", [
        "Bonding in Carbon",
        "Versatile Nature of Carbon",
        "Hydrocarbons",
        "Isomerism",
        "Functional Groups and Nomenclature",
        "Alcohols and Carboxylic Acids",
        "Soaps and Detergents",
      ]),
    ],
    Mathematics: [
      ch(1, "chapter-01-real-numbers", "Real Numbers", [
        "Euclid's Division Lemma",
        "Fundamental Theorem of Arithmetic",
        "HCF and LCM",
        "Irrational Numbers",
        "Decimal Expansion",
      ]),
      ch(2, "chapter-02-polynomials", "Polynomials", [
        "Zeroes of a Polynomial",
        "Relationship between Zeroes and Coefficients",
        "Division Algorithm",
        "Quadratic and Cubic Polynomials",
      ]),
      ch(3, "chapter-03-linear-equations-two-variables", "Pair of Linear Equations", [
        "Graphical Method",
        "Substitution Method",
        "Elimination Method",
        "Cross-Multiplication",
        "Consistency of Equations",
        "Word Problems",
      ]),
      ch(4, "chapter-04-quadratic-equations", "Quadratic Equations", [
        "Standard Form",
        "Factorisation Method",
        "Completing the Square",
        "Quadratic Formula",
        "Nature of Roots",
        "Word Problems",
      ]),
      ch(5, "chapter-05-arithmetic-progressions", "Arithmetic Progressions", [
        "nth Term of an AP",
        "Sum of First n Terms",
        "Properties of AP",
        "Word Problems",
      ]),
      ch(6, "chapter-06-triangles", "Triangles", [
        "Similar Figures",
        "Similarity of Triangles",
        "Basic Proportionality Theorem",
        "Areas of Similar Triangles",
        "Pythagoras Theorem",
      ]),
      ch(7, "chapter-07-coordinate-geometry", "Coordinate Geometry", [
        "Distance Formula",
        "Section Formula",
        "Midpoint Formula",
        "Area of a Triangle",
        "Collinearity of Points",
      ]),
      ch(8, "chapter-08-introduction-trigonometry", "Introduction to Trigonometry", [
        "Trigonometric Ratios",
        "Ratios of Specific Angles",
        "Complementary Angles",
        "Trigonometric Identities",
      ]),
      ch(9, "chapter-09-applications-trigonometry", "Some Applications of Trigonometry", [
        "Heights and Distances",
        "Angle of Elevation and Depression",
        "Line of Sight",
        "Word Problems",
      ]),
      ch(10, "chapter-10-circles", "Circles", [
        "Tangent to a Circle",
        "Properties of Tangents",
        "Tangent from an External Point",
        "Theorems on Tangents",
      ]),
      ch(11, "chapter-11-areas-related-circles", "Areas Related to Circles", [
        "Area of a Circle and Sector",
        "Area of a Segment",
        "Length of an Arc",
        "Combinations of Plane Figures",
      ]),
      ch(12, "chapter-12-surface-areas-volumes", "Surface Areas and Volumes", [
        "Surface Area of Combination of Solids",
        "Volume of Combination of Solids",
        "Conversion of Solids",
        "Frustum of a Cone",
      ]),
      ch(13, "chapter-13-statistics", "Statistics", [
        "Mean of Grouped Data",
        "Mode of Grouped Data",
        "Median of Grouped Data",
        "Cumulative Frequency",
        "Ogive Curves",
      ]),
      ch(14, "chapter-14-probability", "Probability", [
        "Theoretical Probability",
        "Equally Likely Outcomes",
        "Complementary Events",
        "Dice, Coins and Cards",
      ]),
    ],
  },
  11: {
    Physics: [
      ch(1, "chapter-01-units-measurements", "Units and Measurements", [
        "SI Units",
        "Significant Figures",
        "Dimensions",
        "Dimensional Analysis",
        "Errors in Measurement",
      ]),
      ch(2, "chapter-02-motion-straight-line", "Motion in a Straight Line", [
        "Position and Displacement",
        "Velocity and Speed",
        "Acceleration",
        "Kinematic Equations",
        "Graphical Analysis",
        "Relative Velocity",
      ]),
      ch(3, "chapter-03-motion-plane", "Motion in a Plane", [
        "Scalars and Vectors",
        "Vector Addition",
        "Resolution of Vectors",
        "Projectile Motion",
        "Uniform Circular Motion",
      ]),
      ch(4, "chapter-04-laws-of-motion", "Laws of Motion", [
        "Newton's Laws",
        "Conservation of Momentum",
        "Friction",
        "Circular Motion Dynamics",
      ]),
      ch(5, "chapter-05-work-energy-power", "Work, Energy and Power", [
        "Work Done by a Force",
        "Work–Energy Theorem",
        "Potential Energy",
        "Conservation of Mechanical Energy",
        "Collisions",
      ]),
      ch(6, "chapter-06-system-particles-rotational", "System of Particles and Rotational Motion", [
        "Centre of Mass",
        "Torque and Angular Momentum",
        "Moment of Inertia",
        "Rotational Dynamics",
      ]),
      ch(7, "chapter-07-gravitation", "Gravitation", [
        "Kepler's Laws",
        "Universal Law of Gravitation",
        "Gravitational Constant",
        "Acceleration due to Gravity",
        "Gravitational Potential Energy",
        "Escape Velocity",
        "Earth Satellites",
        "Energy of an Orbiting Satellite",
      ]),
      ch(8, "chapter-08-mechanical-properties-solids", "Mechanical Properties of Solids", [
        "Stress and Strain",
        "Hooke's Law",
        "Elastic Moduli",
        "Elastic Potential Energy",
      ]),
      ch(9, "chapter-09-mechanical-properties-fluids", "Mechanical Properties of Fluids", [
        "Pressure and Pascal's Law",
        "Bernoulli's Principle",
        "Viscosity",
        "Surface Tension",
      ]),
      ch(10, "chapter-10-thermal-properties-matter", "Thermal Properties of Matter", [
        "Thermal Expansion",
        "Specific Heat and Calorimetry",
        "Change of State",
        "Heat Transfer",
      ]),
      ch(11, "chapter-11-thermodynamics", "Thermodynamics", [
        "Zeroth Law",
        "First Law of Thermodynamics",
        "Thermodynamic Processes",
        "Second Law and Heat Engines",
        "Carnot Engine",
      ]),
      ch(12, "chapter-12-kinetic-theory", "Kinetic Theory", [
        "Kinetic Theory of an Ideal Gas",
        "Pressure of an Ideal Gas",
        "Equipartition of Energy",
        "Mean Free Path",
      ]),
      ch(13, "chapter-13-oscillations", "Oscillations", [
        "Simple Harmonic Motion",
        "Energy in SHM",
        "Simple Pendulum",
        "Damped and Forced Oscillations",
      ]),
      ch(14, "chapter-14-waves", "Waves", [
        "Progressive Waves",
        "Speed of a Travelling Wave",
        "Superposition and Beats",
        "Standing Waves",
        "Doppler Effect",
      ]),
    ],
    Chemistry: [
      ch(1, "chapter-01-basic-concepts-chemistry", "Some Basic Concepts of Chemistry", [
        "Mole Concept",
        "Stoichiometry",
        "Empirical and Molecular Formulae",
        "Concentration Terms",
      ]),
      ch(2, "chapter-02-structure-of-atom", "Structure of Atom", [
        "Atomic Models",
        "Photoelectric Effect",
        "Bohr's Model",
        "Quantum Mechanical Model",
        "Electronic Configuration",
      ]),
      ch(3, "chapter-03-classification-periodicity", "Classification of Elements and Periodicity", [
        "Modern Periodic Table",
        "Atomic and Ionic Radii",
        "Ionisation Enthalpy",
        "Electronegativity",
      ]),
      ch(4, "chapter-04-chemical-bonding", "Chemical Bonding and Molecular Structure", [
        "Ionic and Covalent Bonding",
        "VSEPR Theory",
        "Hybridisation",
        "Molecular Orbital Theory",
        "Hydrogen Bonding",
      ]),
      ch(5, "chapter-05-states-of-matter", "States of Matter", [
        "Gas Laws",
        "Ideal Gas Equation",
        "Kinetic Molecular Theory",
        "Real Gases",
      ]),
      ch(6, "chapter-06-thermodynamics", "Thermodynamics", [
        "First Law and Enthalpy",
        "Hess's Law",
        "Entropy and Gibbs Energy",
        "Spontaneity",
      ]),
      ch(7, "chapter-07-equilibrium", "Equilibrium", [
        "Equilibrium Constant",
        "Le Chatelier's Principle",
        "Ionic Equilibrium and pH",
        "Buffer Solutions",
        "Solubility Product",
      ]),
      ch(8, "chapter-08-redox-reactions", "Redox Reactions", [
        "Oxidation Number",
        "Balancing Redox Equations",
        "Types of Redox Reactions",
      ]),
      ch(9, "chapter-09-hydrogen", "Hydrogen", [
        "Dihydrogen",
        "Hydrides",
        "Water and Hydrogen Peroxide",
      ]),
      ch(10, "chapter-10-s-block-elements", "s-Block Elements", [
        "Alkali Metals",
        "Alkaline Earth Metals",
        "Important Compounds",
      ]),
      ch(11, "chapter-11-p-block-elements", "p-Block Elements (13 & 14)", [
        "Boron Family",
        "Carbon Family",
        "Allotropes of Carbon",
      ]),
      ch(12, "chapter-12-organic-chemistry-basics", "Organic Chemistry: Basic Principles", [
        "Nomenclature",
        "Isomerism",
        "Electronic Effects",
        "Reactive Intermediates",
      ]),
      ch(13, "chapter-13-hydrocarbons", "Hydrocarbons", [
        "Alkanes",
        "Alkenes",
        "Alkynes",
        "Aromatic Hydrocarbons",
      ]),
      ch(14, "chapter-14-environmental-chemistry", "Environmental Chemistry", [
        "Air Pollution",
        "Ozone Depletion",
        "Water and Soil Pollution",
      ]),
    ],
    Mathematics: [
      ch(1, "chapter-01-sets", "Sets", ["Types of Sets", "Operations on Sets", "Venn Diagrams"]),
      ch(2, "chapter-02-relations-functions", "Relations and Functions", [
        "Relations",
        "Types of Functions",
        "Composition and Inverse",
      ]),
      ch(3, "chapter-03-trigonometric-functions", "Trigonometric Functions", [
        "Radian Measure",
        "Identities",
        "Trigonometric Equations",
      ]),
      ch(4, "chapter-04-complex-numbers", "Complex Numbers and Quadratic Equations", [
        "Argand Plane",
        "Modulus and Argument",
        "Quadratic Equations",
      ]),
      ch(5, "chapter-05-linear-inequalities", "Linear Inequalities", [
        "Inequalities in One Variable",
        "Graphical Solution in a Plane",
      ]),
      ch(6, "chapter-06-permutations-combinations", "Permutations and Combinations", [
        "Permutations",
        "Combinations",
        "Applications",
      ]),
      ch(7, "chapter-07-binomial-theorem", "Binomial Theorem", [
        "General Term",
        "Middle Term",
        "Applications",
      ]),
      ch(8, "chapter-08-sequences-series", "Sequences and Series", [
        "Arithmetic Progression",
        "Geometric Progression",
        "Special Series",
      ]),
      ch(9, "chapter-09-straight-lines", "Straight Lines", [
        "Slope of a Line",
        "Various Forms of Equation",
        "Distance Formulae",
      ]),
      ch(10, "chapter-10-conic-sections", "Conic Sections", [
        "Circle",
        "Parabola",
        "Ellipse",
        "Hyperbola",
      ]),
      ch(11, "chapter-11-3d-geometry", "Introduction to Three-Dimensional Geometry", [
        "Coordinates in Space",
        "Distance and Section Formula",
        "Direction Cosines",
      ]),
      ch(12, "chapter-12-limits-derivatives", "Limits and Derivatives", [
        "Limits",
        "Derivatives",
        "Product and Quotient Rules",
      ]),
      ch(13, "chapter-13-statistics", "Statistics", [
        "Mean Deviation",
        "Variance and Standard Deviation",
      ]),
      ch(14, "chapter-14-probability", "Probability", [
        "Axiomatic Approach",
        "Addition and Multiplication Theorems",
        "Bayes' Theorem",
      ]),
    ],
  },
  12: {
    Physics: [
      ch(1, "chapter-01-electric-charges-fields", "Electric Charges and Fields", [
        "Coulomb's Law",
        "Electric Field",
        "Electric Dipole",
        "Gauss's Law",
      ]),
      ch(2, "chapter-02-electrostatic-potential-capacitance", "Electrostatic Potential and Capacitance", [
        "Electrostatic Potential",
        "Capacitors",
        "Dielectrics",
        "Energy Stored in a Capacitor",
      ]),
      ch(3, "chapter-03-current-electricity", "Current Electricity", [
        "Drift Velocity",
        "Ohm's Law and Resistivity",
        "Kirchhoff's Laws",
        "Wheatstone Bridge",
        "Cells and EMF",
      ]),
      ch(4, "chapter-04-moving-charges-magnetism", "Moving Charges and Magnetism", [
        "Lorentz Force",
        "Biot–Savart Law",
        "Ampere's Circuital Law",
        "Moving Coil Galvanometer",
      ]),
      ch(5, "chapter-05-magnetism-matter", "Magnetism and Matter", [
        "Bar Magnet",
        "Earth's Magnetism",
        "Magnetic Properties of Materials",
      ]),
      ch(6, "chapter-06-electromagnetic-induction", "Electromagnetic Induction", [
        "Faraday's Laws",
        "Lenz's Law",
        "Self and Mutual Inductance",
      ]),
      ch(7, "chapter-07-alternating-current", "Alternating Current", [
        "AC through LCR",
        "Resonance",
        "Power Factor",
        "Transformer",
      ]),
      ch(8, "chapter-08-electromagnetic-waves", "Electromagnetic Waves", [
        "Displacement Current",
        "EM Spectrum",
      ]),
      ch(9, "chapter-09-ray-optics", "Ray Optics and Optical Instruments", [
        "Mirrors and Lenses",
        "Prism and Dispersion",
        "Microscope and Telescope",
      ]),
      ch(10, "chapter-10-wave-optics", "Wave Optics", [
        "Huygens' Principle",
        "Young's Double Slit",
        "Diffraction",
        "Polarisation",
      ]),
      ch(11, "chapter-11-dual-nature-radiation-matter", "Dual Nature of Radiation and Matter", [
        "Photoelectric Effect",
        "de Broglie Hypothesis",
      ]),
      ch(12, "chapter-12-atoms", "Atoms", [
        "Rutherford's Model",
        "Bohr's Model",
        "Hydrogen Spectrum",
      ]),
      ch(13, "chapter-13-nuclei", "Nuclei", [
        "Radioactivity",
        "Binding Energy",
        "Fission and Fusion",
      ]),
      ch(14, "chapter-14-semiconductor-electronics", "Semiconductor Electronics", [
        "p–n Junction",
        "Diodes and Rectifiers",
        "Transistors",
        "Logic Gates",
      ]),
    ],
    Chemistry: [
      ch(1, "chapter-01-solutions", "Solutions", [
        "Concentration Units",
        "Raoult's Law",
        "Colligative Properties",
        "van't Hoff Factor",
      ]),
      ch(2, "chapter-02-electrochemistry", "Electrochemistry", [
        "Galvanic Cells",
        "Nernst Equation",
        "Conductance",
        "Electrolysis",
      ]),
      ch(3, "chapter-03-chemical-kinetics", "Chemical Kinetics", [
        "Rate Law",
        "Order and Molecularity",
        "First Order Reactions",
        "Arrhenius Equation",
      ]),
      ch(4, "chapter-04-d-f-block-elements", "d- and f-Block Elements", [
        "Transition Metals",
        "KMnO₄ and K₂Cr₂O₇",
        "Lanthanoids and Actinoids",
      ]),
      ch(5, "chapter-05-coordination-compounds", "Coordination Compounds", [
        "Werner's Theory",
        "Nomenclature and Isomerism",
        "VBT and CFT",
      ]),
      ch(6, "chapter-06-haloalkanes-haloarenes", "Haloalkanes and Haloarenes", [
        "Nomenclature",
        "SN1 and SN2",
        "Elimination Reactions",
      ]),
      ch(7, "chapter-07-alcohols-phenols-ethers", "Alcohols, Phenols and Ethers", [
        "Preparation of Alcohols",
        "Acidity of Phenols",
        "Ethers",
      ]),
      ch(8, "chapter-08-aldehydes-ketones-acids", "Aldehydes, Ketones and Carboxylic Acids", [
        "Nucleophilic Addition",
        "Tests for Aldehydes",
        "Carboxylic Acids",
      ]),
      ch(9, "chapter-09-amines", "Amines", [
        "Basic Character of Amines",
        "Diazonium Salts",
      ]),
      ch(10, "chapter-10-biomolecules", "Biomolecules", [
        "Carbohydrates",
        "Proteins",
        "Nucleic Acids",
      ]),
    ],
    Mathematics: [
      ch(1, "chapter-01-relations-functions", "Relations and Functions", [
        "Types of Relations",
        "Types of Functions",
        "Invertible Functions",
      ]),
      ch(2, "chapter-02-inverse-trigonometric-functions", "Inverse Trigonometric Functions", [
        "Principal Value Branch",
        "Properties",
      ]),
      ch(3, "chapter-03-matrices", "Matrices", [
        "Types of Matrices",
        "Operations",
        "Inverse by Elementary Operations",
      ]),
      ch(4, "chapter-04-determinants", "Determinants", [
        "Properties of Determinants",
        "Adjoint and Inverse",
        "Cramer's Rule",
      ]),
      ch(5, "chapter-05-continuity-differentiability", "Continuity and Differentiability", [
        "Continuity",
        "Chain Rule",
        "Logarithmic Differentiation",
        "Second Order Derivatives",
      ]),
      ch(6, "chapter-06-applications-derivatives", "Applications of Derivatives", [
        "Rate of Change",
        "Tangents and Normals",
        "Maxima and Minima",
      ]),
      ch(7, "chapter-07-integrals", "Integrals", [
        "Substitution",
        "Partial Fractions",
        "Integration by Parts",
        "Definite Integrals",
      ]),
      ch(8, "chapter-08-applications-integrals", "Applications of Integrals", [
        "Area under Simple Curves",
        "Area between Two Curves",
      ]),
      ch(9, "chapter-09-differential-equations", "Differential Equations", [
        "Variable Separable",
        "Homogeneous DE",
        "Linear DE",
      ]),
      ch(10, "chapter-10-vector-algebra", "Vector Algebra", [
        "Dot Product",
        "Cross Product",
        "Scalar Triple Product",
      ]),
      ch(11, "chapter-11-3d-geometry", "Three-Dimensional Geometry", [
        "Equation of a Line",
        "Equation of a Plane",
        "Shortest Distance",
      ]),
      ch(12, "chapter-12-linear-programming", "Linear Programming", [
        "Formulation of LPP",
        "Graphical Method",
      ]),
      ch(13, "chapter-13-probability", "Probability", [
        "Conditional Probability",
        "Bayes' Theorem",
        "Binomial Distribution",
      ]),
    ],
  },
};

export function getChapter(classId: ClassId, subject: Subject, chapterId: string) {
  return SYLLABUS[classId][subject].find((c) => c.id === chapterId);
}

export function getTopic(classId: ClassId, subject: Subject, chapterId: string, topicId: string) {
  return getChapter(classId, subject, chapterId)?.topics.find((t) => t.id === topicId);
}

export function subjectAccent(subject: Subject) {
  if (subject === "Physics") return "physics" as const;
  if (subject === "Chemistry") return "chem" as const;
  return "math" as const;
}
