export type DesignStyle = {
  id: string;
  name: string;
  subtitle: string;
  period: string;
  description: string;
  history: string;
  principles: string[];
  palette: { name: string; value: string; role: string }[];
  typography: { role: string; recommendation: string }[];
  layout: string;
  iconography: string;
  components: string;
  implementation: string;
};

export const designStyles: DesignStyle[] = [
  {
    id: "bauhaus", name: "Bauhaus", subtitle: "Art, craft, and technology as one", period: "1919–1933",
    description: "A functional visual language built from geometry, primary colors, experimentation, and the belief that form should serve purpose.",
    history: "Founded by Walter Gropius in Weimar in 1919, the Bauhaus brought fine art, craft, and industrial design into a shared educational project. Its school moved to Dessau and Berlin before closing in 1933, but its teaching and visual language had a lasting influence on modern design.",
    principles: ["Form follows function", "Geometric primitives and clear structure", "Primary colors used with intent", "Typography treated as an expressive design element"],
    palette: [{name:"Signal red",value:"#E53935",role:"Emphasis"},{name:"Primary blue",value:"#2455D6",role:"Secondary accent"},{name:"School yellow",value:"#F5C928",role:"Highlight"},{name:"Ink",value:"#171717",role:"Text"}],
    typography: [{role:"Display",recommendation:"Geometric sans serif with confident weight and compact line-height."},{role:"Body",recommendation:"Neutral sans serif, highly legible, with short measure."}],
    layout: "Use an asymmetrical modular grid, strong alignment, circles and rectangles as structural elements, and generous negative space around functional groups.",
    iconography: "Prefer simple geometric symbols, circles, squares, and lines. Icons should be reduced to their most recognizable construction.",
    components: "Use hard-edged blocks, visible dividers, bold labels, and direct action buttons. Decoration should communicate hierarchy or function.",
    implementation: "Build a small spacing scale, CSS grid, geometric shape primitives, and a restricted color palette. Use CSS custom properties for the palette and avoid using color as the only status cue."
  },
  {
    id: "swiss", name: "Swiss Style", subtitle: "Clarity through grid and typography", period: "1950s–1960s",
    description: "The International Typographic Style prioritizes objective communication, precise grids, asymmetric composition, and disciplined sans-serif typography.",
    history: "The International Typographic Style developed in Switzerland in the 1950s, with influential work by designers including Josef Müller-Brockmann and Armin Hofmann. It became widely known for grid systems, sans-serif type, photography, and clear visual communication.",
    principles: ["Objective, content-led communication", "Asymmetric grid composition", "Typographic hierarchy over decoration", "Consistent alignment and spacing"],
    palette: [{name:"Paper",value:"#F4F2EC",role:"Canvas"},{name:"Black",value:"#171717",role:"Text"},{name:"Signal red",value:"#E23B32",role:"Accent"},{name:"Cool grey",value:"#B8B8B2",role:"Structure"}],
    typography: [{role:"Display",recommendation:"Grotesk sans serif, large scale, tight leading, and deliberate line breaks."},{role:"Body",recommendation:"Highly readable neo-grotesk with clear size and weight contrast."}],
    layout: "Use a consistent multi-column grid, strict baselines, aligned edges, and generous but measured whitespace. Let the grid be visible through the composition, not necessarily through lines.",
    iconography: "Use restrained, functional pictograms with consistent stroke weight and geometry. Photography and typography should carry most of the message.",
    components: "Use typographic labels, thin rules, simple rectangular controls, and consistent spacing. Avoid decorative shadows and unnecessary rounding.",
    implementation: "Define grid columns and gutters as CSS variables. Use a type scale, fluid display sizes, and semantic spacing tokens. Tailwind grid utilities can implement the structure while CSS variables preserve the style palette."
  },
  {
    id: "minimalism", name: "Minimalism", subtitle: "Less, with greater intention", period: "1960s–present",
    description: "A reduction-oriented approach that removes nonessential elements so content, proportion, material, and interaction can become more apparent.",
    history: "Minimalism has roots across modern art, architecture, and graphic design. In visual communication it is not simply the absence of decoration: it depends on deliberate hierarchy, proportion, restraint, and careful attention to detail.",
    principles: ["Remove what does not support the message", "Use space as an active compositional element", "Limit typefaces and colors", "Make interaction states quiet but unmistakable"],
    palette: [{name:"Warm white",value:"#F7F6F2",role:"Canvas"},{name:"Charcoal",value:"#20201E",role:"Text"},{name:"Stone",value:"#C9C6BF",role:"Secondary"},{name:"Moss",value:"#65745C",role:"Accent"}],
    typography: [{role:"Display",recommendation:"A restrained contemporary sans or carefully chosen serif with generous whitespace."},{role:"Body",recommendation:"Comfortable reading size, open line-height, and low visual noise."}],
    layout: "Use a narrow set of alignments, large margins, few columns, and carefully controlled content density. Every element should earn its place.",
    iconography: "Use icons only when they improve recognition. Prefer simple line symbols with consistent optical weight.",
    components: "Use quiet surfaces, subtle borders, minimal radii, and clear focus states. Avoid ornament that competes with content.",
    implementation: "Start with a neutral semantic palette, a small spacing scale, and a restrained type system. Use CSS variables for theme values and ensure focus indicators remain visible."
  },
  {
    id: "art-deco", name: "Art Deco", subtitle: "Geometry, symmetry, and ornament", period: "1920s–1930s",
    description: "A decorative modern style combining streamlined geometry, symmetry, luxurious materials, and stylized motifs.",
    history: "Art Deco emerged internationally in the 1920s and became prominent in architecture, interiors, fashion, and graphic arts. The 1925 Exposition Internationale in Paris helped popularize the movement's name and visual language.",
    principles: ["Strong symmetry and vertical emphasis", "Stepped forms, fans, and sunburst motifs", "Metallic accents against deep colors", "Ornament organized by geometry"],
    palette: [{name:"Midnight",value:"#17212B",role:"Canvas"},{name:"Champagne",value:"#D8B77A",role:"Metallic accent"},{name:"Ivory",value:"#F5EBDD",role:"Text"},{name:"Jade",value:"#32665D",role:"Secondary"}],
    typography: [{role:"Display",recommendation:"Elegant high-contrast serif or geometric uppercase with expanded tracking."},{role:"Body",recommendation:"A calm, readable serif or sans serif that balances ornate display type."}],
    layout: "Use centered or symmetrical compositions, strong vertical axes, framed panels, stepped corners, and repeated geometric ornament.",
    iconography: "Use stylized fans, rays, chevrons, stepped lines, and symmetrical geometric marks. Keep ornament systematic rather than random.",
    components: "Use framed cards, fine metallic rules, geometric badges, and deliberate uppercase labels. Keep controls usable and avoid ornamental interference with focus.",
    implementation: "Combine CSS gradients, borders, pseudo-elements, and repeating geometric patterns. Keep contrast high and avoid relying on metallic color alone to communicate meaning."
  },
  {
    id: "de-stijl", name: "De Stijl", subtitle: "Pure relationships in color and form", period: "1917–1931",
    description: "An abstract visual language built from horizontal and vertical lines, rectangular planes, and a limited palette of primary colors.",
    history: "De Stijl began in the Netherlands in 1917 around the journal of the same name. Piet Mondrian and Theo van Doesburg were central figures, though they differed on aspects of the movement's principles.",
    principles: ["Horizontal and vertical structure", "Rectangular planes and clear boundaries", "Restricted primary-color palette", "Balance through proportion and relation"],
    palette: [{name:"Red",value:"#D52B1E",role:"Primary plane"},{name:"Blue",value:"#21468B",role:"Primary plane"},{name:"Yellow",value:"#F2C500",role:"Primary plane"},{name:"White",value:"#F4F2EC",role:"Canvas"}],
    typography: [{role:"Display",recommendation:"Bold sans serif with direct, unornamented letterforms."},{role:"Body",recommendation:"Neutral sans serif with strong alignment and compact hierarchy."}],
    layout: "Compose with orthogonal divisions, unequal rectangular areas, strong alignment, and a carefully balanced distribution of color.",
    iconography: "Use simple rectangles, horizontal and vertical rules, and square-based symbols.",
    components: "Use modular rectangular panels and crisp separators. Keep interaction affordances explicit and do not let color blocks obscure text.",
    implementation: "Use CSS Grid for unequal columns and rows, with named areas and a small set of primary color variables. Borders should define structure rather than decoration."
  }
];

export function getDesignStyle(id: string) {
  return designStyles.find((style) => style.id === id);
}
