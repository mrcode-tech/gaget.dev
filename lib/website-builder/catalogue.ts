import type { FieldDefinition, Sample, TaxonomyCategory } from "./model";

const field = (
  id: string,
  label: string,
  kind: FieldDefinition["kind"],
  defaultValue: string,
  options: Partial<FieldDefinition> = {},
): FieldDefinition => ({ id, label, kind, defaultValue, ...options });

const sample = (
  definition: Omit<Sample, "version" | "lifecycle" | "secondaryStyles" | "purposes" | "keywords" | "configuration"> &
    Partial<Pick<Sample, "secondaryStyles" | "purposes" | "keywords" | "configuration">>,
): Sample => ({
  version: "1.0.0",
  lifecycle: "published",
  secondaryStyles: [],
  purposes: ["general-business"],
  keywords: [],
  ...definition,
});

export const TAXONOMY: TaxonomyCategory[] = [
  { id: "navigation", name: "Navigation", description: "Help visitors understand where they are and move around the website.", types: [
    { id: "header", name: "Header and navigation", description: "The shared top-level brand and navigation area." },
    { id: "sidebar-navigation", name: "Sidebar navigation", description: "Navigation for information-rich or application-like websites." },
    { id: "breadcrumbs", name: "Breadcrumbs", description: "Show the visitor's location within a page hierarchy." },
  ] },
  { id: "introduction", name: "Introduction", description: "Introduce the website, a page, or an important announcement.", types: [
    { id: "hero", name: "Hero", description: "The main introductory message and primary action." },
    { id: "page-intro", name: "Page introduction", description: "A clear heading and context for an inner page." },
    { id: "announcement", name: "Announcement banner", description: "A concise, time-sensitive message." },
  ] },
  { id: "products-services", name: "Products and services", description: "Present things people can buy, explore, or request.", types: [
    { id: "category-grid", name: "Category presentation", description: "Help visitors browse groups of products or services." },
    { id: "product-grid", name: "Product grid or list", description: "Present multiple products in a consistent collection." },
    { id: "featured-product", name: "Featured product", description: "Give one product or offer a stronger editorial focus." },
    { id: "service-cards", name: "Service cards", description: "Explain a set of professional services." },
    { id: "pricing", name: "Pricing", description: "Explain available plans, packages, or rates." },
  ] },
  { id: "content", name: "Content", description: "Explain ideas, stories, features, and useful information.", types: [
    { id: "features", name: "Features and benefits", description: "Explain the practical value of an offering." },
    { id: "story", name: "Story and about", description: "Share background, approach, or point of view." },
    { id: "process", name: "Process and steps", description: "Explain how a service or experience works." },
    { id: "statistics", name: "Statistics", description: "Present meaningful facts or measurable outcomes." },
    { id: "article", name: "Editorial article", description: "Feature a publication or long-form story." },
  ] },
  { id: "media-portfolio", name: "Media and portfolio", description: "Showcase visual work, projects, and media.", types: [
    { id: "portfolio-grid", name: "Portfolio gallery", description: "Present selected projects or creative work." },
    { id: "team", name: "Team", description: "Introduce people behind an organization." },
    { id: "video", name: "Video feature", description: "Provide context for a video or moving image." },
  ] },
  { id: "social-proof", name: "Social proof", description: "Build confidence through customer and community evidence.", types: [
    { id: "testimonial", name: "Testimonials", description: "Share a first-person customer or partner quote." },
    { id: "reviews", name: "Reviews and ratings", description: "Summarize customer feedback." },
    { id: "trust", name: "Trust indicators", description: "Present credentials, guarantees, or client relationships." },
  ] },
  { id: "conversion", name: "Conversion and actions", description: "Help visitors take a relevant next step.", types: [
    { id: "contact", name: "Call to action", description: "Invite visitors to take one clear action." },
    { id: "contact-form", name: "Contact form", description: "Collect a visitor enquiry." },
    { id: "newsletter", name: "Newsletter signup", description: "Invite visitors to receive updates." },
    { id: "booking", name: "Booking action", description: "Help visitors enquire about availability." },
  ] },
  { id: "information", name: "Information", description: "Answer questions and provide practical details.", types: [
    { id: "faq", name: "Frequently asked questions", description: "Answer common visitor questions." },
    { id: "contact-details", name: "Contact information", description: "Show ways to reach a business or organization." },
    { id: "location", name: "Location and hours", description: "Present a location and opening information." },
  ] },
  { id: "footer", name: "Footer and closing", description: "Close pages with identity, navigation, and useful details.", types: [
    { id: "footer", name: "Footer", description: "Provide closing navigation and site information." },
  ] },
  { id: "utility", name: "Utility and feedback", description: "Support visitor orientation and system feedback.", types: [
    { id: "alert", name: "Alert", description: "Communicate an important status or notice." },
    { id: "search", name: "Search", description: "Help visitors find content." },
  ] },
];

export const CATALOGUE: Sample[] = [
  sample({ id: "hero-editorial", type: "hero", category: "Introduction", subcategory: "Hero", rendererKey: "hero-editorial", name: "Editorial split", description: "A large statement balanced with an image-led composition.", rationale: "Pairs a strong editorial headline with supporting imagery and a clear action.", style: "Editorial", accent: "#b66d4e", layout: "hero", purposes: ["store", "portfolio", "general-business"], keywords: ["introduction", "headline", "image", "split"], fields: [
    field("eyebrow", "Eyebrow", "text", "A considered collection"), field("title", "Title", "text", "Objects made to be lived with", { required: true, maxLength: 90 }), field("body", "Description", "textarea", "Thoughtful design for everyday rituals.", { maxLength: 280 }), field("button", "Button label", "text", "Explore collection", { maxLength: 36 }), field("image", "Image", "image", "", { placeholderPurpose: "Wide hero image that supports the main message" }),
  ] }),
  sample({ id: "hero-bold", type: "hero", category: "Introduction", subcategory: "Hero", rendererKey: "hero-bold", name: "Bold centered", description: "A confident centered introduction with strong typographic hierarchy.", rationale: "Keeps attention on one clear message and one primary action.", style: "Expressive", accent: "#6b7e65", layout: "banner", purposes: ["services", "creator", "general-business"], keywords: ["centered", "bold", "statement"], fields: [
    field("eyebrow", "Eyebrow", "text", "Independent by nature"), field("title", "Title", "text", "Make room for better ideas", { required: true, maxLength: 90 }), field("body", "Description", "textarea", "A small studio with a clear point of view.", { maxLength: 280 }), field("button", "Button label", "text", "Discover more", { maxLength: 36 }), field("image", "Image", "image", "", { placeholderPurpose: "Optional supporting image" }),
  ] }),
  sample({ id: "hero-minimal", type: "hero", category: "Introduction", subcategory: "Hero", rendererKey: "hero-minimal", name: "Minimal image", description: "A quiet full-width image followed by a focused introduction.", rationale: "Lets imagery set the mood while keeping the message calm and direct.", style: "Minimal", accent: "#8c7b9b", layout: "split", purposes: ["portfolio", "store", "creator"], keywords: ["minimal", "image-led", "quiet"], fields: [
    field("eyebrow", "Eyebrow", "text", "New season"), field("title", "Title", "text", "Less, but considered", { required: true, maxLength: 90 }), field("body", "Description", "textarea", "A focused edit of useful, lasting things.", { maxLength: 280 }), field("button", "Button label", "text", "View the edit", { maxLength: 36 }), field("image", "Image", "image", "", { placeholderPurpose: "Wide visual that carries the opening mood" }),
  ] }),
  sample({ id: "header-editorial", type: "header", category: "Navigation", subcategory: "Header", rendererKey: "header-editorial", name: "Editorial wordmark", description: "A restrained wordmark with compact text navigation.", rationale: "Works well when brand identity and editorial content should lead.", style: "Editorial", accent: "#806a56", purposes: ["portfolio", "creator", "general-business"], keywords: ["header", "navigation", "wordmark"], fields: [
    field("brand", "Brand name", "text", "North Studio", { required: true, maxLength: 32 }), field("nav1", "First link", "text", "Work"), field("nav2", "Second link", "text", "About"), field("nav3", "Third link", "text", "Journal"), field("action", "Action label", "text", "Contact"),
  ], configuration: [{ id: "density", label: "Navigation density", defaultValue: "comfortable", options: ["compact", "comfortable"] }] }),
  sample({ id: "header-minimal", type: "header", category: "Navigation", subcategory: "Header", rendererKey: "header-minimal", name: "Centered minimal", description: "Centered brand identity with a small set of quiet links.", rationale: "Keeps navigation visually light for focused portfolios and publications.", style: "Minimal", accent: "#6e756d", purposes: ["portfolio", "creator", "organization"], keywords: ["header", "centered", "minimal"], fields: [
    field("brand", "Brand name", "text", "Field Notes", { required: true, maxLength: 32 }), field("nav1", "First link", "text", "Stories"), field("nav2", "Second link", "text", "Studio"), field("nav3", "Third link", "text", "Contact"),
  ] }),
  sample({ id: "header-commerce", type: "header", category: "Navigation", subcategory: "Header", rendererKey: "header-commerce", name: "Storefront navigation", description: "A commerce-oriented header with utility links and a visible bag label.", rationale: "Makes key shopping destinations and the cart easy to find.", style: "Contemporary", accent: "#9b865c", purposes: ["store"], keywords: ["store", "shop", "cart", "header"], fields: [
    field("brand", "Store name", "text", "Common Ground", { required: true, maxLength: 32 }), field("nav1", "First link", "text", "Shop"), field("nav2", "Second link", "text", "Collections"), field("nav3", "Third link", "text", "Our story"), field("action", "Bag label", "text", "Bag (0)"),
  ] }),
  sample({ id: "category-tiles", type: "category-grid", category: "Products and services", subcategory: "Categories", rendererKey: "category-tiles", name: "Category tiles", description: "A set of visual entry points into product or service categories.", rationale: "Helps visitors choose a direction before browsing individual items.", style: "Contemporary", accent: "#b98d62", purposes: ["store", "services"], keywords: ["category", "tiles", "browse"], fields: [
    field("title", "Section title", "text", "Explore by collection", { required: true }), field("item1", "Category one", "text", "Everyday objects"), field("item2", "Category two", "text", "For the home"), field("item3", "Category three", "text", "Small essentials"),
  ] }),
  sample({ id: "product-grid-editorial", type: "product-grid", category: "Products and services", subcategory: "Product grid", rendererKey: "product-grid-editorial", name: "Editorial product grid", description: "A spacious three-item product collection with editorial labels.", rationale: "Gives products room to breathe and keeps product details secondary to imagery.", style: "Editorial", accent: "#9b865c", purposes: ["store"], keywords: ["products", "grid", "collection"], fields: [
    field("title", "Section title", "text", "A few things we love", { required: true }), field("item1", "Product one", "text", "Everyday vessel"), field("item2", "Product two", "text", "Soft linen throw"), field("item3", "Product three", "text", "Stoneware cup"),
  ], configuration: [{ id: "columns", label: "Columns", defaultValue: "3", options: ["2", "3"] }] }),
  sample({ id: "product-grid-compact", type: "product-grid", category: "Products and services", subcategory: "Product grid", rendererKey: "product-grid-compact", name: "Compact product cards", description: "A denser product layout with clear labels and prices.", rationale: "Supports quick scanning when visitors are comparing several items.", style: "Contemporary", accent: "#6d7f70", purposes: ["store"], keywords: ["products", "cards", "price", "grid"], fields: [
    field("title", "Section title", "text", "Shop the edit", { required: true }), field("item1", "Product one", "text", "Canvas tote · £24"), field("item2", "Product two", "text", "Desk tray · £32"), field("item3", "Product three", "text", "Daily journal · £18"),
  ], configuration: [{ id: "columns", label: "Columns", defaultValue: "3", options: ["2", "3", "4"] }] }),
  sample({ id: "featured-product", type: "featured-product", category: "Products and services", subcategory: "Featured product", rendererKey: "featured-product", name: "Featured product story", description: "One product presented with a larger image area and supporting copy.", rationale: "Creates space to explain why a particular product matters.", style: "Luxury", accent: "#a17f5a", purposes: ["store"], keywords: ["featured", "product", "promotion"], fields: [
    field("title", "Product name", "text", "The everyday chair", { required: true }), field("body", "Description", "textarea", "A simple form, carefully made for long days and slow mornings."), field("price", "Price", "text", "£240"), field("button", "Action label", "text", "Discover the details"), field("image", "Product image", "image", "", { placeholderPurpose: "Portrait product image" }),
  ] }),
  sample({ id: "features-grid", type: "features", category: "Content", subcategory: "Benefits", rendererKey: "features-grid", name: "Three benefits", description: "Three concise value propositions in a balanced grid.", rationale: "Makes the practical value of an offering easy to scan.", style: "Geometric", accent: "#6b7e65", purposes: ["store", "services", "organization"], keywords: ["features", "benefits", "value"], fields: [
    field("title", "Title", "text", "Made for everyday life", { required: true }), field("item1", "First benefit", "text", "Thoughtful materials"), field("item2", "Second benefit", "text", "Designed to last"), field("item3", "Third benefit", "text", "Made with care"),
  ] }),
  sample({ id: "story-split", type: "story", category: "Content", subcategory: "About", rendererKey: "story-split", name: "Story with image", description: "Narrative copy beside a supporting image.", rationale: "Combines a personal story with a visual reference.", style: "Editorial", accent: "#b66d4e", purposes: ["portfolio", "services", "organization"], keywords: ["story", "about", "image"], fields: [
    field("title", "Title", "text", "A little about our approach", { required: true }), field("body", "Story", "textarea", "We believe the best things earn their place through usefulness, craft and care."), field("image", "Image", "image", "", { placeholderPurpose: "Supporting image that adds context to the story" }),
  ] }),
  sample({ id: "story-timeline", type: "story", category: "Content", subcategory: "About", rendererKey: "story-timeline", name: "Milestone story", description: "A sequence of short milestones that explains a journey.", rationale: "Makes a longer organizational or founder story easier to follow.", style: "Classic", accent: "#7e8b78", purposes: ["organization", "services", "general-business"], keywords: ["timeline", "milestones", "history"], fields: [
    field("title", "Title", "text", "A journey shaped by people", { required: true }), field("item1", "First milestone", "text", "2018 · A small beginning"), field("item2", "Second milestone", "text", "2021 · Growing together"), field("item3", "Third milestone", "text", "Today · Looking ahead"),
  ] }),
  sample({ id: "collection-cards", type: "category-grid", category: "Products and services", subcategory: "Collections", rendererKey: "collection-cards", name: "Collection cards", description: "A visual three-item collection for products or services.", rationale: "Uses consistent cards to make several destinations easy to compare.", style: "Contemporary", accent: "#9b865c", purposes: ["store", "services"], keywords: ["collection", "cards", "services"], fields: [
    field("title", "Title", "text", "Explore the collection", { required: true }), field("item1", "Item one", "text", "The essentials"), field("item2", "Item two", "text", "New arrivals"), field("item3", "Item three", "text", "Best loved"),
  ] }),
  sample({ id: "service-cards", type: "service-cards", category: "Products and services", subcategory: "Services", rendererKey: "service-cards", name: "Service overview", description: "Three service cards with concise descriptions.", rationale: "Makes a professional service offering understandable at a glance.", style: "Minimal", accent: "#718477", purposes: ["services", "general-business"], keywords: ["services", "consulting", "offer"], fields: [
    field("title", "Section title", "text", "How we can help", { required: true }), field("item1", "Service one", "text", "Strategy and direction"), field("item2", "Service two", "text", "Design and delivery"), field("item3", "Service three", "text", "Ongoing support"),
  ] }),
  sample({ id: "portfolio-grid", type: "portfolio-grid", category: "Media and portfolio", subcategory: "Portfolio", rendererKey: "portfolio-grid", name: "Selected work", description: "An image-led grid for selected projects or creative work.", rationale: "Lets visual work lead while keeping project titles easy to scan.", style: "Editorial", accent: "#877b70", purposes: ["portfolio", "creator"], keywords: ["portfolio", "projects", "gallery"], fields: [
    field("title", "Section title", "text", "Selected work", { required: true }), field("item1", "Project one", "text", "A quieter kind of living"), field("item2", "Project two", "text", "Objects in context"), field("item3", "Project three", "text", "A study in form"),
  ] }),
  sample({ id: "team-grid", type: "team", category: "Media and portfolio", subcategory: "People", rendererKey: "team-grid", name: "People behind the work", description: "A small team introduction with names and roles.", rationale: "Adds human context to a studio, organization, or service.", style: "Classic", accent: "#75856f", purposes: ["organization", "services", "non-profit"], keywords: ["team", "people", "staff"], fields: [
    field("title", "Section title", "text", "Meet the team", { required: true }), field("item1", "Person one", "text", "Avery · Creative director"), field("item2", "Person two", "text", "Sam · Project lead"), field("item3", "Person three", "text", "Riley · Research"),
  ] }),
  sample({ id: "testimonial-quote", type: "testimonial", category: "Social proof", subcategory: "Testimonials", rendererKey: "testimonial-quote", name: "Featured quote", description: "A single testimonial with clear attribution.", rationale: "Gives one customer perspective room and emphasis.", style: "Editorial", accent: "#8c7b9b", purposes: ["store", "services", "general-business"], keywords: ["testimonial", "quote", "customer"], fields: [
    field("quote", "Quote", "textarea", "“A thoughtful experience from beginning to end.”", { required: true }), field("author", "Attribution", "text", "A happy customer"),
  ] }),
  sample({ id: "review-strip", type: "reviews", category: "Social proof", subcategory: "Reviews", rendererKey: "review-strip", name: "Review highlights", description: "A compact row of customer feedback highlights.", rationale: "Provides multiple short proof points without interrupting the page flow.", style: "Contemporary", accent: "#b18c5e", purposes: ["store", "services"], keywords: ["reviews", "ratings", "trust"], fields: [
    field("title", "Section title", "text", "Kind words from customers", { required: true }), field("item1", "Review one", "text", "Beautifully made and thoughtfully packed."), field("item2", "Review two", "text", "Helpful from the first question."), field("item3", "Review three", "text", "A pleasure to work with."),
  ] }),
  sample({ id: "faq-list", type: "faq", category: "Information", subcategory: "FAQ", rendererKey: "faq-list", name: "Open questions", description: "A simple list of common questions and concise answers.", rationale: "Reduces uncertainty by placing practical answers near the relevant content.", style: "Minimal", accent: "#778477", purposes: ["store", "services", "organization"], keywords: ["faq", "questions", "answers"], fields: [
    field("title", "Section title", "text", "A few useful answers", { required: true }), field("item1", "Question one", "text", "How long does delivery take?"), field("answer1", "Answer one", "textarea", "Most orders arrive within three to five working days."), field("item2", "Question two", "text", "Can I ask for more information?"), field("answer2", "Answer two", "textarea", "Yes. Contact the team and we will be happy to help."),
  ] }),
  sample({ id: "contact-banner", type: "contact", category: "Conversion and actions", subcategory: "Call to action", rendererKey: "contact-banner", name: "Contact callout", description: "A focused invitation to take the next step.", rationale: "Creates a clear closing action after the visitor has enough context.", style: "Contemporary", accent: "#6b7e65", purposes: ["services", "portfolio", "general-business"], keywords: ["contact", "call to action", "enquiry"], fields: [
    field("title", "Title", "text", "Have a project in mind?", { required: true }), field("body", "Description", "textarea", "Tell us what you are looking for."), field("button", "Button label", "text", "Get in touch"),
  ] }),
  sample({ id: "cta-minimal", type: "contact", category: "Conversion and actions", subcategory: "Call to action", rendererKey: "cta-minimal", name: "Minimal action panel", description: "A quiet, centered invitation with one simple action.", rationale: "Works as a calm next step in an editorial or service-led page.", style: "Minimal", accent: "#7b8c7c", purposes: ["portfolio", "creator", "services"], keywords: ["cta", "action", "contact"], fields: [
    field("title", "Title", "text", "Start a conversation", { required: true }), field("body", "Description", "textarea", "Share a little about what you have in mind."), field("button", "Button label", "text", "Say hello"),
  ] }),
  sample({ id: "contact-details", type: "contact-details", category: "Information", subcategory: "Contact", rendererKey: "contact-details", name: "Contact details", description: "A practical contact block with email, phone, and location.", rationale: "Makes essential contact routes easy to find and use.", style: "Classic", accent: "#7c887c", purposes: ["organization", "services", "general-business"], keywords: ["contact", "email", "phone", "address"], fields: [
    field("title", "Title", "text", "Visit or get in touch", { required: true }), field("email", "Email", "url", "mailto:hello@example.test"), field("phone", "Phone", "text", "+44 20 0000 0000"), field("location", "Location", "text", "London, United Kingdom"),
  ] }),
  sample({ id: "newsletter-panel", type: "newsletter", category: "Conversion and actions", subcategory: "Newsletter", rendererKey: "newsletter-panel", name: "Newsletter invitation", description: "A compact signup invitation with supporting copy.", rationale: "Offers a low-pressure way to stay connected after a visit.", style: "Organic", accent: "#7a8a72", purposes: ["creator", "publication", "store"], keywords: ["newsletter", "updates", "subscribe"], fields: [
    field("title", "Title", "text", "A note from the studio", { required: true }), field("body", "Description", "textarea", "Occasional updates, new work, and things worth sharing."), field("button", "Button label", "text", "Join the list"),
  ] }),
  sample({ id: "trust-strip", type: "trust", category: "Social proof", subcategory: "Trust indicators", rendererKey: "trust-strip", name: "Service assurances", description: "A row of practical assurances or credentials.", rationale: "Surfaces useful confidence-building information without a large section.", style: "Geometric", accent: "#6b7e65", purposes: ["store", "services"], keywords: ["trust", "delivery", "guarantee"], fields: [
    field("item1", "First assurance", "text", "Carefully packed"), field("item2", "Second assurance", "text", "Thoughtful support"), field("item3", "Third assurance", "text", "Easy returns"),
  ] }),
  sample({ id: "stats-band", type: "statistics", category: "Content", subcategory: "Statistics", rendererKey: "stats-band", name: "Numbers with context", description: "A row of three figures with short explanations.", rationale: "Makes scale or impact understandable when the numbers are meaningful.", style: "Geometric", accent: "#8a796c", purposes: ["organization", "services", "non-profit"], keywords: ["statistics", "numbers", "impact"], fields: [
    field("title", "Title", "text", "A little progress over time"), field("item1", "First figure", "text", "12 years · Experience"), field("item2", "Second figure", "text", "240 · Projects"), field("item3", "Third figure", "text", "18 · Partners"),
  ] }),
  sample({ id: "process-steps", type: "process", category: "Content", subcategory: "Process", rendererKey: "process-steps", name: "A clear process", description: "Three steps that explain what happens next.", rationale: "Reduces uncertainty around a service or multi-step experience.", style: "Minimal", accent: "#728576", purposes: ["services", "organization"], keywords: ["process", "steps", "how it works"], fields: [
    field("title", "Title", "text", "How we work together", { required: true }), field("item1", "Step one", "text", "Start with a conversation"), field("item2", "Step two", "text", "Shape a clear plan"), field("item3", "Step three", "text", "Make it happen"),
  ] }),
  sample({ id: "article-feature", type: "article", category: "Content", subcategory: "Editorial", rendererKey: "article-feature", name: "Featured story", description: "A publication-style feature with a lead image and excerpt.", rationale: "Gives one story a strong entry point within an editorial website.", style: "Editorial", accent: "#8b7465", purposes: ["publication", "creator", "organization"], keywords: ["article", "journal", "publication"], fields: [
    field("eyebrow", "Category", "text", "Field notes"), field("title", "Article title", "text", "The value of making time", { required: true }), field("body", "Excerpt", "textarea", "A short reflection on attention, craft, and the everyday."), field("author", "Author", "text", "The editorial team"), field("image", "Lead image", "image", "", { placeholderPurpose: "Landscape image for the featured story" }),
  ] }),
  sample({ id: "footer-simple", type: "footer", category: "Footer and closing", subcategory: "Footer", rendererKey: "footer-simple", name: "Simple footer", description: "A compact closing section with useful links.", rationale: "Closes the page with a recognizable identity and a small amount of useful detail.", style: "Minimal", accent: "#3e4a43", purposes: ["all"], keywords: ["footer", "brand", "closing"], fields: [
    field("brand", "Brand", "text", "Your brand"), field("note", "Closing note", "text", "Thoughtfully made."), field("copyright", "Copyright", "text", "© 2026"),
  ] }),
  sample({ id: "footer-columns", type: "footer", category: "Footer and closing", subcategory: "Footer", rendererKey: "footer-columns", name: "Multi-column footer", description: "A more detailed footer with grouped navigation.", rationale: "Supports websites with several important information destinations.", style: "Classic", accent: "#48534c", purposes: ["store", "organization", "general-business"], keywords: ["footer", "columns", "navigation"], fields: [
    field("brand", "Brand", "text", "Common Ground"), field("note", "Closing note", "text", "Useful things, thoughtfully chosen."), field("nav1", "First link", "text", "About"), field("nav2", "Second link", "text", "Contact"), field("nav3", "Third link", "text", "Help"),
  ] }),
];

export const SAMPLE_STYLES = ["Minimal", "Editorial", "Contemporary", "Expressive", "Luxury", "Classic", "Organic", "Geometric", "Playful", "Industrial"] as const;
export const WEBSITE_PURPOSES = [
  { id: "store", label: "Store / commerce" },
  { id: "services", label: "Professional services" },
  { id: "portfolio", label: "Personal portfolio" },
  { id: "creator", label: "Creator / publication" },
  { id: "organization", label: "Organization" },
  { id: "non-profit", label: "Non-profit organization" },
  { id: "community", label: "Community" },
  { id: "event", label: "Event" },
  { id: "general-business", label: "General business" },
] as const;
