// Comprehensive Google Fonts collection
const serifFonts = [
    'Playfair Display', 'Cormorant Garamond', 'Crimson Text', 'Libre Baskerville',
    'Lora', 'Merriweather', 'Source Serif Pro', 'Spectral', 'Vollkorn',
    'Cardo', 'Gentium Plus', 'Neuton', 'Old Standard TT', 'PT Serif',
    'Bitter', 'Domine', 'Noticia Text', 'Tinos', 'Gelasio', 'IBM Plex Serif'
];

const sansSerifFonts = [
    'Montserrat', 'Open Sans', 'Roboto', 'Lato', 'Source Sans Pro', 'Nunito',
    'Raleway', 'Ubuntu', 'Poppins', 'Inter', 'Fira Sans', 'Work Sans',
    'Barlow', 'Rubik', 'DM Sans', 'Manrope', 'Red Hat Display', 'Outfit',
    'Plus Jakarta Sans', 'Space Grotesk', 'Archivo', 'Assistant', 'Heebo',
    'Karla', 'Oxygen', 'PT Sans', 'Quicksand', 'Titillium Web'
];

const displayFonts = [
    'Anton', 'Bebas Neue', 'Fredoka One', 'Righteous', 'Oswald', 'Fjalla One',
    'Alfa Slab One', 'Bungee', 'Comfortaa', 'Pacifico', 'Lobster', 'Dancing Script',
    'Great Vibes', 'Satisfy', 'Kaushan Script', 'Amatic SC', 'Bangers',
    'Creepster', 'Eater', 'Nosifer', 'Butcherman', 'Chela One', 'Griffy'
];

const handwritingFonts = [
    'Caveat', 'Indie Flower', 'Permanent Marker', 'Shadows Into Light',
    'Homemade Apple', 'Covered By Your Grace', 'Kalam', 'Patrick Hand',
    'Architects Daughter', 'Coming Soon', 'Gloria Hallelujah', 'Handlee',
    'Reenie Beanie', 'Rock Salt', 'Schoolbell', 'Walter Turncoat'
];

const monospaceFonts = [
    'Roboto Mono', 'Source Code Pro', 'Fira Code', 'JetBrains Mono',
    'IBM Plex Mono', 'Inconsolata', 'Space Mono', 'Ubuntu Mono',
    'Courier Prime', 'Overpass Mono', 'PT Mono', 'Share Tech Mono'
];

const decorativeFonts = [
    'Orbitron', 'Black Ops One', 'Bungee Shade', 'Monoton', 'Stalinist One',
    'Wallpoet', 'Squada One', 'Audiowide', 'Iceberg', 'Jura', 'Michroma',
    'Russo One', 'Teko', 'Exo 2', 'Rajdhani', 'Saira Condensed',
    'Chakra Petch', 'Electrolize', 'Gugi', 'Hanalei Fill', 'Seymour One'
];

const vintageFonts = [
    'Fredericka the Great', 'Abril Fatface', 'Bungee Inline', 'Fascinate',
    'Rye', 'Salsa', 'Slackey', 'Smokum', 'Supermercado One', 'Trade Winds',
    'Vast Shadow', 'Vampiro One', 'Butcherman'
];

// Combined font array for the ransom note generator
const availableFonts = [
    ...serifFonts,
    ...sansSerifFonts,
    ...displayFonts,
    ...handwritingFonts,
    ...monospaceFonts,
    ...decorativeFonts,
    ...vintageFonts
];

// Load Google Fonts function
function loadGoogleFonts() {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=' + 
                availableFonts.map(font => font.replace(/ /g, '+')).join('&family=') + 
                '&display=swap';
    link.rel = 'stylesheet';
    
    link.onload = function() {
        console.log('Google Fonts loaded successfully');
    };
    
    document.head.appendChild(link);
}

// Export for use in other files
window.availableFonts = availableFonts;
window.loadGoogleFonts = loadGoogleFonts;

// Auto-load fonts when DOM is ready
document.addEventListener('DOMContentLoaded', loadGoogleFonts);
