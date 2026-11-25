export const samplePortfolio = {
  name: "Mara Ellis",
  role: "Independent art director & visual storyteller",
  location: "Copenhagen, Denmark",
  introduction: "I build thoughtful identities and digital experiences for people shaping a more considered future.",
  biography: "Mara is an independent art director working across identity, editorial, and digital experiences. Her practice brings clarity to complex ideas through research, collaboration, and a strong sense of visual rhythm.",
  availability: "Available for selected collaborations",
  projects: [
    { id: "northline", number: "01", title: "Northline Journal", category: "Editorial identity", year: "2025", description: "A new visual language for stories about place, culture, and the outdoors.", imageLabel: "Landscape / Field notes" },
    { id: "form-and-field", number: "02", title: "Form & Field", category: "Brand strategy", year: "2024", description: "A flexible identity system for a studio exploring objects and everyday rituals.", imageLabel: "Objects / Material study" },
    { id: "common-ground", number: "03", title: "Common Ground", category: "Digital experience", year: "2024", description: "A welcoming digital home for a community growing more sustainable cities.", imageLabel: "Community / Urban life" }
  ],
  contact: "hello@maraellis.studio"
} as const;
