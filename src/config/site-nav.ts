// Single source of truth for the THE SUSTAINOMICS information architecture.
// Mirrors "THE SUSTAINOMICS" 9-section menu document. Drives the top nav,
// the per-section dropdowns, the category sub-tab rows, and the "More" mega panel.

export interface SubTab {
	label: string;
	slug: string;
	desc?: string;
}

export interface Section {
	label: string;
	slug: string;
	href: string;
	/** "category" sections render a Bloomberg-style /category/<slug> page driven by the
	 *  `category` taxonomy. "media" sections own a dedicated collection/route. */
	kind: "category" | "media";
	blurb: string;
	subtabs: SubTab[];
	/** When true, the top nav shows no caret/dropdown for this section (subtabs still
	 *  power that section's own in-page filter tabs, e.g. /video's tab row). */
	noDropdown?: boolean;
}

const slugify = (s: string): string =>
	s
		.toLowerCase()
		.replace(/&/g, " and ")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");

const sub = (label: string, desc: string): SubTab => ({ label, slug: slugify(label), desc });

export const SECTIONS: Section[] = [
	{
		label: "Markets",
		slug: "markets",
		href: "/category/markets",
		kind: "category",
		blurb: "Capital flows, valuations, and the instruments financing the transition.",
		subtabs: [
			sub("M&A", "Mergers, corporate restructuring, and global buyouts"),
			sub("Investment", "Private equity, venture funding, and asset allocation"),
			sub("Public Equities", "Global indices, ticker tracking, and market valuations"),
			sub("Commodities", "Energy, materials, and sustainable resource trading"),
			sub("Fixed Income", "Green bonds, sovereign debt, and climate financing"),
			sub("Crypto & Digital Assets", "Web3 finance, tokenomics, and decentralized markets"),
			sub("Emerging Markets", "High-growth corridors and frontier economic flows"),
		],
	},
	{
		label: "Finance",
		slug: "finance",
		href: "/category/finance",
		kind: "category",
		blurb: "Banking, capital raising, and the plumbing of corporate money.",
		subtabs: [
			sub("Enterprise", "Corporate banking, treasury management, and fiscal risk"),
			sub("MSME", "Micro, Small & Medium Enterprise financing and lines of credit"),
			sub("Startups", "Early-stage funding, valuations, and seed capital"),
			sub("Fintech", "Digital banking ecosystems, payment gateways, and tech infrastructure"),
			sub("Deals & Underwriting", "IPO tracking, capital raises, and league tables"),
			sub("Venture Capital", "Institutional backing, growth equity, and LP/GP strategies"),
			sub("Central Banking", "Monetary policy, liquidity injections, and currency stabilization"),
		],
	},
	{
		label: "Economics",
		slug: "economics",
		href: "/category/economics",
		kind: "category",
		blurb: "Trade, labor, and the macro forces shaping the global economy.",
		subtabs: [
			sub("International Trade", "Global freight, tariffs, corridors, and supply logistics"),
			sub("Diaspora", "Remittance flows, cross-border talent networks, and brain-gain capital"),
			sub("Policy & Regulation", "Sovereign laws, tax mandates, and international compliance"),
			sub("Labor & Employment", "Human capital indices, future of work, and labor economics"),
			sub("Macro Indicators", "Global GDP forecasts, inflation tracking, and yield curves"),
			sub("Development Economics", "Infrastructure loans, multilateral banks, and poverty metrics"),
			sub("Trade Alliances", "Bilateral treaties, economic unions, and protectionism trends"),
		],
	},
	{
		label: "Industries",
		slug: "industries",
		href: "/category/industries",
		kind: "category",
		blurb: "The real economy — from farms and factories to logistics and health.",
		subtabs: [
			sub("Agriculture & Food", "AgTech, vertical farming, global food security, and supply networks"),
			sub("Fashion", "Sustainable textiles, retail supply chains, and circular economy"),
			sub("Energy & Utilities", "Grid transitions, renewables, and oil/gas decarbonization"),
			sub("Supply Chain & Logistics", "Global manufacturing, shipping routes, and inventory data"),
			sub("Real Estate", "Smart urban spaces, sustainable commercial property, and construction"),
			sub("Healthcare & Biotech", "Pharmaceutical pipelines, digital health, and life sciences"),
			sub("Consumer Goods", "Retail markets, consumer behavior shifts, and packaging trends"),
		],
	},
	{
		label: "Tech",
		slug: "tech",
		href: "/category/tech",
		kind: "category",
		blurb: "Innovation, AI, and the engineering of the climate-tech frontier.",
		subtabs: [
			sub("Innovation", "R&D pipelines, emerging patent databases, and industrial shifts"),
			sub("Artificial Intelligence", "Generative models, predictive analytics, and automated work"),
			sub("CleanTech", "Climate tech engineering, carbon capture, and battery storage"),
			sub("Cybersecurity", "Data compliance, enterprise threat matrices, and secure architecture"),
			sub("SaaS & Cloud", "Software ecosystems, enterprise cloud data, and storage"),
			sub("Frontier Tech", "Quantum computing, robotics, and aerospace tech ecosystems"),
			sub("Tech Policy", "Data privacy legislation, antitrust cases, and AI safety boards"),
		],
	},
	{
		label: "ESG",
		slug: "esg",
		href: "/category/esg",
		kind: "category",
		blurb: "Environmental, social, and governance benchmarks that move markets.",
		subtabs: [
			sub("DE&I", "Diversity tracking, corporate social policies, and workplace mobility"),
			sub("Womenomics", "Gender wage gap data, female boardroom metrics, and economic parity"),
			sub("Climate & Net Zero", "Carbon mapping, industrial compliance, and carbon markets"),
			sub("Governance", "Board composition, shareholder activism, and ethical accounting"),
			sub("Green Standards", "Global sustainability taxonomies and corporate disclosures"),
			sub("Social Impact", "Human rights due diligence, community investment, and labor welfare"),
			sub("Circular Economy", "Waste management benchmarks, recycling laws, and product life"),
		],
	},
	{
		label: "Magazine",
		slug: "magazine",
		href: "/magazine",
		kind: "media",
		blurb: "Long-form journalism — read every issue as articles or as the full PDF.",
		subtabs: [
			sub("Partnership", "Long-form analysis of cross-industry and public-private alliances"),
			sub("Profiles", "In-depth professional journeys of CEOs and economic visionaries"),
			sub("Features", "Narrative, investigative pieces on macroeconomic pivots"),
			sub("Special Reports", "Quarterly trend forecast dossiers and deep thematic reports"),
			sub("The Brief", "Fast-read breakdowns of the week's critical market updates"),
			sub("Pursuits", "Luxury sustainable living, executive lifestyle, and travel infrastructure"),
			sub("Innovators List", "Annual ranking of businesses disrupting traditional industries"),
		],
	},
	{
		label: "Opinion",
		slug: "opinion",
		href: "/opinion",
		kind: "media",
		blurb: "Perspectives, commentary, and analysis from the THE SUSTAINOMICS editorial team and leading voices in sustainable economics.",
		subtabs: [
			sub("THE SUSTAINOMICS Show", "Flagship analysis covering markets, economics, and ESG"),
			sub("Founder Stories", "Conversations detailing the scale journey of Startups & MSMEs"),
			sub("Global Alliances", "Deep dives into International Trade, Partnerships, and Diaspora"),
			sub("Women in Lead", "Audio spotlights on executive parity and Womenomics strategies"),
			sub("Market Daily", "A brief daily rundown of international opening bells and trends"),
			sub("Tech Horizons", "Weekly episodes detailing the frontier of Innovation and AI"),
			sub("Green Economy", "Commentary on sustainability economics, circular models, and transition finance"),
			sub("Policy Watch", "Opinion on regulation, governance, and the politics of decarbonisation"),
			sub("Capital Chronicles", "Views on climate finance, ESG capital allocation, and investment strategy"),
			sub("ESG Watch", "Critical takes on ESG ratings, disclosure standards, and corporate accountability"),
		],
	},
	{
		label: "Video",
		slug: "video",
		href: "/video",
		kind: "media",
		blurb: "Live broadcasts, explainers, and studio interviews from the THE SUSTAINOMICS desk.",
		subtabs: [
			sub("The Sustainomics", ""),
			sub("Global Business Services", ""),
			sub("Global Founders", ""),
			sub("Global SMBs", ""),
			sub("Diaspora Affairs", ""),
			sub("Global Alliances", ""),
			sub("Women in Lead", ""),
			sub("Tech Horizons", ""),
			sub("Innovation Edge", ""),
			sub("Executive Suite", ""),
			sub("Aerospace, Defence & Deeptech", ""),
			sub("HRM & Organizational Development", ""),
			sub("Agriculture, Food & Nutrition", ""),
			sub("Investment Insights", ""),
			sub("Global Cooperative", ""),
		],
	},
];

export const getSection = (slug: string): Section | undefined =>
	SECTIONS.find((s) => s.slug === slug);

// Columns for the "More" mega-menu panel (mirrors the Bloomberg multi-column layout).
export interface MegaLink {
	label: string;
	href: string;
}
export interface MegaColumn {
	heading: string;
	links: MegaLink[];
}

export const MEGA_COLUMNS: MegaColumn[] = [
	{
		heading: "News",
		links: SECTIONS.filter((s) => s.kind === "category").map((s) => ({
			label: s.label,
			href: s.href,
		})),
	},
	{
		heading: "Media",
		links: [
			{ label: "Magazine", href: "/magazine" },
			{ label: "Opinion", href: "/opinion" },
			{ label: "Video", href: "/video" },
			{ label: "Live TV", href: "/video" },
		],
	},
	{
		heading: "Explore",
		links: [
			{ label: "Special Reports", href: "/category/economics?topic=macro-indicators" },
			{ label: "Innovators List", href: "/magazine" },
			{ label: "The Brief", href: "/magazine" },
			{ label: "Newsletters", href: "/newsletter" },
			{ label: "Search", href: "/search" },
		],
	},
	{
		heading: "Company",
		links: [
			{ label: "About", href: "/pages/about" },
			{ label: "Submit a Tip", href: "/pages/submit-a-tip" },
			{ label: "Advertise", href: "/pages/advertise" },
			{ label: "RSS Feed", href: "/rss.xml" },
		],
	},
];

// Sections shown directly in the top category bar (the rest live under "More").
export const PRIMARY_BAR: Section[] = SECTIONS;
