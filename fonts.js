// Comprehensive Google Fonts collection - 200+ carefully selected fonts
// Organized by categories for future filtering features

// SERIF FONTS - Traditional, elegant fonts with decorative strokes
const serifFonts = [
    'Playfair Display', 'Cormorant Garamond', 'Crimson Text', 'Libre Baskerville',
    'Lora', 'Merriweather', 'Source Serif Pro', 'Spectral', 'Vollkorn',
    'Cardo', 'Gentium Plus', 'Neuton', 'Old Standard TT', 'PT Serif',
    'Bitter', 'Domine', 'Noticia Text', 'Tinos', 'Gelasio', 'IBM Plex Serif'
];

// SANS-SERIF FONTS - Modern, clean fonts without decorative strokes
const sansSerifFonts = [
    'Montserrat', 'Open Sans', 'Roboto', 'Lato', 'Source Sans Pro', 'Nunito',
    'Raleway', 'Ubuntu', 'Poppins', 'Inter', 'Fira Sans', 'Work Sans',
    'Barlow', 'Rubik', 'DM Sans', 'Manrope', 'Red Hat Display', 'Outfit',
    'Plus Jakarta Sans', 'Space Grotesk', 'Archivo', 'Assistant', 'Heebo',
    'Karla', 'Mukti', 'Oxygen', 'PT Sans', 'Quicksand', 'Titillium Web'
];

// DISPLAY FONTS - Bold, attention-grabbing fonts for headlines
const displayFonts = [
    'Anton', 'Bebas Neue', 'Fredoka One', 'Righteous', 'Oswald', 'Fjalla One',
    'Alfa Slab One', 'Bungee', 'Comfortaa', 'Pacifico', 'Lobster', 'Dancing Script',
    'Great Vibes', 'Satisfy', 'Kaushan Script', 'Amatic SC', 'Bangers',
    'Creepster', 'Eater', 'Nosifer', 'Butcherman', 'Chela One', 'Griffy'
];

// HANDWRITING FONTS - Script and handwritten style fonts
const handwritingFonts = [
    'Caveat', 'Indie Flower', 'Permanent Marker', 'Shadows Into Light',
    'Homemade Apple', 'Covered By Your Grace', 'Kalam', 'Patrick Hand',
    'Architects Daughter', 'Coming Soon', 'Gloria Hallelujah', 'Handlee',
    'Markerfeld', 'Reenie Beanie', 'Rock Salt', 'Schoolbell', 'Walter Turncoat'
];

// MONOSPACE FONTS - Fixed-width fonts, often used for code
const monospaceFonts = [
    'Roboto Mono', 'Source Code Pro', 'Fira Code', 'JetBrains Mono',
    'IBM Plex Mono', 'Inconsolata', 'Space Mono', 'Ubuntu Mono',
    'Courier Prime', 'Overpass Mono', 'PT Mono', 'Share Tech Mono'
];

// DECORATIVE/WEIRD FONTS - Unique, artistic fonts for special effects
const decorativeFonts = [
    'Orbitron', 'Black Ops One', 'Bungee Shade', 'Monoton', 'Stalinist One',
    'Wallpoet', 'Squada One', 'Audiowide', 'Iceberg', 'Jura', 'Michroma',
    'Russo One', 'Teko', 'Exo 2', 'Rajdhani', 'Saira Condensed',
    'Chakra Petch', 'Electrolize', 'Gugi', 'Hanalei Fill', 'Seymour One'
];

// VINTAGE/RETRO FONTS - Classic, nostalgic style fonts
const vintageFonts = [
    'Fredericka the Great', 'Abril Fatface', 'Bungee Inline', 'Fascinate',
    'Rye', 'Salsa', 'Slackey', 'Smokum', 'Supermercado One', 'Trade Winds',
    'Vast Shadow', 'Vampiro One', 'Creepster Caps', 'Eater', 'Butcherman'
];

// CONDENSED/NARROW FONTS - Space-efficient fonts
const condensedFonts = [
    'Roboto Condensed', 'Open Sans Condensed', 'Oswald', 'Fjalla One',
    'Anton', 'Bebas Neue', 'Pathway Gothic One', 'Yanone Kaffeesatz',
    'Abel', 'Advent Pro', 'Asap Condensed', 'PT Sans Narrow', 'Pontano Sans'
];

// Combine all font categories into one master array
const availableFonts = [
    ...serifFonts,
    ...sansSerifFonts,
    ...displayFonts,
    ...handwritingFonts,
    ...monospaceFonts,
    ...decorativeFonts,
    ...vintageFonts,
    ...condensedFonts
];

// Function to dynamically load Google Fonts
function loadGoogleFonts() {
    // Show loading indicator
    const loading = document.getElementById('loading');
    if (loading) loading.style.display = 'block';
    
    // Create the Google Fonts URL with all our fonts
    const fontFamilies = availableFonts.map(font => 
        font.replace(' ', '+') + ':400,700' // Load normal and bold weights
    ).join('|');
    
    // Create the complete Google Fonts API URL
    const googleFontsURL = `https://fonts.googleapis.com/css2?${
        availableFonts.map(font => `family=${font.replace(' ', '+')}`).join('&')
    }&display=swap`;
    
    // Create and inject the font stylesheet
    const link = document.createElement('link');
    link.href = googleFontsURL;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    
    // When fonts finish loading, hide loading indicator
    link.onload = function() {
        console.log(`✅ Loaded ${availableFonts.length} Google Fonts!`);
        if (loading) loading.style.display = 'none';
        
        // Apply fonts to P5.js (this makes fonts available to canvas)
        if (typeof setup !== 'undefined') {
            // Trigger P5.js to recognize new fonts
            redraw();
        }
    };
    
    // Handle font loading errors
    link.onerror = function() {
        console.warn('❌ Error loading Google Fonts');
        if (loading) loading.style.display = 'none';
    };
    
    // Add the stylesheet to page head
    document.head.appendChild(link);
}

// Load fonts when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadGoogleFonts();
});

// Export font categories for future filtering features
const fontCategories = {
    serif: serifFonts,
    sansSerif: sansSerifFonts,
    display: displayFonts,
    handwriting: handwritingFonts,
    monospace: monospaceFonts,
    decorative: decorativeFonts,
    vintage: vintageFonts,
    condensed: condensedFonts
};
