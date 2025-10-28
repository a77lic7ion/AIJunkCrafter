export interface Material {
  name: string;
  description: string;
}

export interface MaterialCategory {
  category: string;
  items: Material[];
}

export const commonMaterials: MaterialCategory[] = [
  {
    category: "Essentials: Adhesives & Cutting",
    items: [
      { name: "Child-Safe Scissors", description: "A must-have for cutting paper, string, and other soft materials. Always use with supervision." },
      { name: "White Glue / PVA Glue", description: "Perfect for paper, cardboard, and fabric. Dries clear and is non-toxic." },
      { name: "Glue Sticks", description: "Less messy than liquid glue, great for younger kids and simple paper crafts." },
      { name: "Tape (Clear & Masking)", description: "For quick fixes and construction. Masking tape is paintable!" },
    ],
  },
  {
    category: "Surfaces & Structures",
    items: [
      { name: "Construction Paper", description: "Comes in a rainbow of colors. The foundation for countless projects." },
      { name: "Cardboard", description: "Recycle cereal boxes, shipping boxes, and paper towel tubes for building." },
      { name: "Paper Plates", description: "Can be turned into masks, animals, UFOs, and more." },
      { name: "Craft Sticks (Popsicle Sticks)", description: "Excellent for building structures, making puppets, and spreading glue." },
    ],
  },
  {
    category: "Color & Decoration",
    items: [
      { name: "Crayons", description: "Easy for little hands to grip and perfect for coloring large areas." },
      { name: "Washable Markers", description: "For bright, bold lines and details. The washable kind saves clothes!" },
      { name: "Washable Paint (Tempera)", description: "Great for painting, stamping, and finger painting. Cleans up easily with water." },
      { name: "Paintbrushes", description: "A variety of sizes allows for different effects, from broad strokes to fine details." },
      { name: "Stickers", description: "An easy and fun way to add personality and detail to any project." },
      { name: "Glitter", description: "For when your project needs a little extra sparkle and magic. Can be messy!" },
    ],
  },
  {
    category: "Crafty Extras & Embellishments",
    items: [
      { name: "Googly Eyes", description: "Instantly bring any character or creature to life. They come in all sizes!" },
      { name: "Pipe Cleaners (Chenille Stems)", description: "Bendable, fuzzy sticks for making sculptures, limbs, or decorations." },
      { name: "Yarn or String", description: "Useful for hanging projects, creating spiderwebs, or making hair for puppets." },
      { name: "Cotton Balls", description: "Perfect for clouds, sheep's wool, snow, or soft textures." },
      { name: "Ribbons & Fabric Scraps", description: "Add texture, color, and flair to creations." },
    ],
  },
];
