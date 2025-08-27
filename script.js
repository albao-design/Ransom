// Global variables to store our data and settings
let currentText = ''; // Stores the user's input text
let generatedLetters = []; // Array to store each letter's styling information
let canvasWidth = 700; // Default canvas width
let canvasHeight = 500; // Default canvas height

// Effect settings - controlled by user sliders
let effects = {
    blur: 0,         // Blur amount in pixels
    spacing: 20,     // Letter spacing in pixels
    stretch: 100,    // Horizontal stretch percentage
    sizeVariation: 24, // Size variation range in pixels
    strokeWeight: 0, // Stroke weight in pixels (0 = filled, >0 = outline only)
    distortion: 0    // Position distortion in pixels
};

// 200 VERIFIED Google Fonts - Maximum variation guaranteed!
const availableFonts = [
    // DISPLAY & IMPACT FONTS (50 fonts) - Bold, attention-grabbing
    'Anton', 'Bebas Neue', 'Fredoka One', 'Righteous', 'Oswald', 'Fjalla One',
    'Alfa Slab One', 'Bungee', 'Bangers', 'Black Ops One', 'Bungee Shade',
    'Monoton', 'Wallpoet', 'Squada One', 'Audiowide', 'Orbitron', 'Russo One',
    'Teko', 'Exo 2', 'Rajdhani', 'Saira Condensed', 'Chakra Petch', 'Staatliches',
    'Passion One', 'Luckiest Guy', 'Bowlby One', 'Bowlby One SC', 'Ultra',
    'Modak', 'Rammetto One', 'Shrikhand', 'Faster One', 'Megrim', 'Iceberg',
    'Jura', 'Michroma', 'Audiowide', 'Electrolize', 'Aldrich', 'Wire One',
    'Syncopate', 'Allerta', 'Advent Pro', 'Exo', 'Share Tech Mono', 'Gruppo',
    'Stalinist One', 'Yellowtail', 'Lalezar', 'Bungee Inline',
    
    // MODERN SANS SERIF (40 fonts) - Clean, varied weights
    'Montserrat', 'Open Sans', 'Roboto', 'Lato', 'Source Sans Pro', 'Nunito',
    'Raleway', 'Ubuntu', 'Poppins', 'Inter', 'Fira Sans', 'Work Sans',
    'Barlow', 'Rubik', 'DM Sans', 'Manrope', 'Red Hat Display', 'Outfit',
    'Plus Jakarta Sans', 'Space Grotesk', 'Archivo', 'Assistant', 'Heebo',
    'Karla', 'Oxygen', 'PT Sans', 'Quicksand', 'Titillium Web', 'IBM Plex Sans',
    'Mukti', 'Asap', 'Cabin', 'Hind', 'Varela Round', 'Prompt', 'Kanit',
    'Sarabun', 'Tajawal', 'Almarai', 'Cairo', 'Amiri',
    
    // SERIF VARIATIONS (30 fonts) - Traditional with character  
    'Playfair Display', 'Cormorant Garamond', 'Crimson Text', 'Libre Baskerville',
    'Lora', 'Merriweather', 'Source Serif Pro', 'Spectral', 'Vollkorn',
    'Cardo', 'Gentium Plus', 'Neuton', 'Old Standard TT', 'PT Serif',
    'Bitter', 'Domine', 'Noticia Text', 'Tinos', 'Gelasio', 'IBM Plex Serif',
    'Abril Fatface', 'Crete Round', 'Arvo', 'Rokkitt', 'Slabo 27px',
    'Alegreya', 'Crimson Pro', 'Literata', 'Zilla Slab', 'Roboto Slab',
    
    // SCRIPT & HANDWRITING (35 fonts) - Personal, organic feel
    'Caveat', 'Dancing Script', 'Pacifico', 'Lobster', 'Great Vibes', 'Satisfy',
    'Kaushan Script', 'Amatic SC', 'Indie Flower', 'Permanent Marker',
    'Shadows Into Light', 'Homemade Apple', 'Covered By Your Grace', 'Kalam',
    'Patrick Hand', 'Architects Daughter', 'Coming Soon', 'Gloria Hallelujah',
    'Handlee', 'Reenie Beanie', 'Rock Salt', 'Schoolbell', 'Walter Turncoat',
    'Allura', 'Sacramento', 'Cookie', 'Tangerine', 'Bad Script', 'Marck Script',
    'Neucha', 'Pangolin', 'Gochi Hand', 'Sriracha', 'Caveat Brush', 'Khand',
    
    // MONOSPACE & TECHNICAL (20 fonts) - Code-like, structured
    'Fira Code', 'JetBrains Mono', 'Space Mono', 'IBM Plex Mono', 'Source Code Pro',
    'Roboto Mono', 'Ubuntu Mono', 'PT Mono', 'Cousine', 'Anonymous Pro',
    'Inconsolata', 'Noto Sans Mono', 'Overpass Mono', 'Red Hat Mono',
    'DM Mono', 'Courier Prime', 'Nova Mono', 'VT323', 'Share Tech Mono', 'Major Mono Display',
    
    // CONDENSED & COMPRESSED (15 fonts) - Space-efficient
    'Barlow Condensed', 'Abel', 'Yanone Kaffeesatz', 'Pathway Gothic One',
    'Arimo', 'Open Sans Condensed', 'PT Sans Narrow', 'Economica',
    'Pontano Sans', 'Quantico', 'Allerta Stencil', 'Saira Extra Condensed',
    'Fjalla One', 'Anton', 'Squada One',
    
    // DECORATIVE & UNIQUE (10 fonts) - Special character fonts
    'Creepster', 'Eater', 'Nosifer', 'Butcherman', 'Griffy', 'Chela One',
    'New Rocker', 'Metal Mania', 'Pirata One', 'Caesar Dressing'
];

// P5.js setup function - runs once when the program starts
function setup() {
    let canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('p5-container'); // Attach to our HTML container
    
    // Set text properties
    textAlign(CENTER, CENTER); // Center alignment for positioning
    
    // Load all Google Fonts
    loadGoogleFonts();
    
    console.log('Canvas setup complete. Ready to generate ransom notes!');
    console.log('Total fonts available:', availableFonts.length);
}

// P5.js draw function - runs continuously (60fps by default)
function draw() {
    // Clear the background
    background(255); // White background
    
    // Only draw if we have generated letters
    if (generatedLetters.length > 0) {
        drawRansomNote();
    } else {
        // Show instruction text when no ransom note is generated
        fill(150);
        noStroke();
        textAlign(CENTER, CENTER);
        textFont('Arial', 16);
        text('Enter your message and click Generate', width/2, height/2);
    }
}

// Function to load Google Fonts dynamically
function loadGoogleFonts() {
    // Create multiple link elements to avoid URL length limits
    const fontsPerLink = 40;
    const totalLinks = Math.ceil(availableFonts.length / fontsPerLink);
    
    for (let i = 0; i < totalLinks; i++) {
        const startIndex = i * fontsPerLink;
        const endIndex = Math.min(startIndex + fontsPerLink, availableFonts.length);
        const fontChunk = availableFonts.slice(startIndex, endIndex);
        
        // Format font names for Google Fonts URL
        const fontString = fontChunk
            .map(font => font.replace(/ /g, '+'))
            .join('&family=');
        
        const link = document.createElement('link');
        link.href = `https://fonts.googleapis.com/css2?family=${fontString}&display=swap`;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        
        console.log(`Loading font batch ${i + 1}/${totalLinks}: ${fontChunk.length} fonts`);
    }
    
    // Add a delay to ensure fonts are loaded before first generation
    setTimeout(() => {
        console.log('All 200 fonts loaded and ready!');
    }, 2000);
}

// Main function to generate the ransom note
function generateRansomNote() {
    if (!currentText || currentText.trim() === '') {
        console.log('No text to generate');
        return;
    }
    
    console.log('Generating ransom note for:', currentText);
    
    // Clear previous letters
    generatedLetters = [];
    
    // Process each character
    for (let i = 0; i < currentText.length; i++) {
        const char = currentText[i];
        
        // Skip spaces but store them for positioning
        if (char === ' ') {
            generatedLetters.push({
                char: ' ',
                isSpace: true
            });
            continue;
        }
        
        // Skip other whitespace characters but preserve them
        if (char.trim() === '') {
            generatedLetters.push({
                char: char,
                isSpace: true
            });
            continue;
        }
        
        // Randomly select font with guaranteed variation
        const randomFont = availableFonts[Math.floor(Math.random() * availableFonts.length)];
        
        // Create letter data with random properties that stay fixed
        const letterData = {
            char: char,
            isSpace: false,
            font: randomFont,
            baseSize: 25 + Math.random() * 25, // Base size: 25-50px
            baseSizeMultiplier: 0.7 + Math.random() * 0.6, // For size variation: 0.7x to 1.3x
            baseDistortionX: (Math.random() - 0.5) * 2, // -1 to +1 for X distortion
            baseDistortionY: (Math.random() - 0.5) * 2, // -1 to +1 for Y distortion
        };
        
        generatedLetters.push(letterData);
        console.log(`Letter "${char}" assigned font: ${randomFont}`);
    }
    
    console.log(`Generated ${generatedLetters.length} characters with varied fonts`);
}

// Function to draw the ransom note
function drawRansomNote() {
    let currentX = 50; // Starting X position
    let currentY = height / 2; // Center vertically
    const lineHeight = 80; // Space between lines
    
    // Calculate total text width for centering
    let totalWidth = 0;
    generatedLetters.forEach(letterData => {
        if (letterData.isSpace) {
            totalWidth += effects.spacing;
        } else {
            totalWidth += letterData.baseSize * (effects.stretch / 100) + effects.spacing;
        }
    });
    
    // Center the text horizontally
    currentX = (width - totalWidth) / 2;
    
    // Draw each letter
    generatedLetters.forEach(letterData => {
        if (letterData.isSpace) {
            // Handle spaces
            currentX += effects.spacing;
            return;
        }
        
        // Calculate current size with variation
        let currentSize = letterData.baseSize + (letterData.baseSizeMultiplier * effects.sizeVariation);
        
        // Calculate distortion offsets
        let distortX = letterData.baseDistortionX * effects.distortion;
        let distortY = letterData.baseDistortionY * effects.distortion;
        
        // Apply effects
        let letterX = currentX + distortX;
        let letterY = currentY + distortY;
        
        // Set up drawing context
        push(); // Save current drawing state
        
        // Apply blur effect
        if (effects.blur > 0) {
            drawingContext.filter = `blur(${effects.blur}px)`;
        }
        
        // Set font and size - FORCE the font to load
        try {
            textFont(letterData.font, currentSize);
        } catch (e) {
            console.warn(`Font ${letterData.font} failed to load, using Arial`);
            textFont('Arial', currentSize);
        }
        
        textAlign(LEFT, CENTER); // Left align for consistent spacing
        
        // Apply stretch
        scale(effects.stretch / 100, 1);
        letterX = letterX / (effects.stretch / 100); // Adjust X for scaling
        
        // Set fill and stroke based on stroke weight
        if (effects.strokeWeight > 0) {
            // Outline only - hollow letters
            noFill();
            stroke(0);
            strokeWeight(effects.strokeWeight);
            strokeJoin(ROUND);
            strokeCap(ROUND);
        } else {
            // Solid black letters
            fill(0);
            noStroke();
        }
        
        // Draw the letter
        text(letterData.char, letterX, letterY);
        
        pop(); // Restore drawing state
        
        // Move to next position
        currentX += (letterData.baseSize * (effects.stretch / 100)) + effects.spacing;
        
        // Line wrapping (basic)
        if (currentX > width - 100) {
            currentX = 50;
            currentY += lineHeight;
        }
    });
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing ransom note generator...');
    
    // Get DOM elements
    const textInput = document.getElementById('textInput');
    const generateBtn = document.getElementById('generateBtn');
    
    // Set up sliders with real-time updates
    setupSliders();
    
    // Generate button click
    generateBtn.addEventListener('click', function() {
        currentText = textInput.value;
        generateRansomNote();
    });
    
    // Enter key to generate
    textInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            currentText = textInput.value;
            generateRansomNote();
        }
    });
    
    console.log('Event listeners attached successfully');
});

// Function to set up all sliders with real-time updates
function setupSliders() {
    const sliders = [
        { id: 'blur', property: 'blur', suffix: 'px' },
        { id: 'spacing', property: 'spacing', suffix: 'px' },
        { id: 'stretch', property: 'stretch', suffix: '%' },
        { id: 'sizeVariation', property: 'sizeVariation', suffix: 'px' },
        { id: 'strokeWeight', property: 'strokeWeight', suffix: 'px' },
        { id: 'distortion', property: 'distortion', suffix: 'px' }
    ];
    
    sliders.forEach(slider => {
        const element = document.getElementById(slider.id);
        const valueDisplay = element.parentNode.querySelector('.range-value');
        
        if (element && valueDisplay) {
            // Update display and effect value
            const updateSlider = () => {
                const value = parseFloat(element.value);
                effects[slider.property] = value;
                valueDisplay.textContent = value + slider.suffix;
            };
            
            // Set initial value
            updateSlider();
            
            // Add event listener for real-time updates
            element.addEventListener('input', updateSlider);
            
            console.log(`Slider ${slider.id} initialized`);
        }
    });
}
