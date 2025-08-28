// Global variables to store our data and settings
let currentText = '';
let generatedLetters = [];
let canvasWidth = 800;
let canvasHeight = 600;

// Effect settings - controlled by user sliders
let effects = {
    blur: 0,
    spacing: 20,
    stretch: 100,
    sizeVariation: 24,
    strokeWeight: 0,
    distortion: 0
};

// Animation system
let animationState = {
    type: 'none',
    playing: false,
    paused: false,
    speed: 1,
    startTime: 0,
    pauseTime: 0,
    totalPausedTime: 0
};

// Animation-specific variables
let typewriterProgress = 0;
let bounceOffsets = [];
let chaosOffsets = [];
let floatOffsets = [];
let pulseOffsets = [];

// Shuffle animation variables
let shuffleVersions = [];
let currentShuffleIndex = 0;
let shuffleTimer = 0;

// Font array
const availableFonts = [
    'Anton', 'Bebas Neue', 'Fredoka One', 'Righteous', 'Oswald', 'Fjalla One',
    'Alfa Slab One', 'Bungee', 'Bangers', 'Black Ops One', 'Bungee Shade',
    'Monoton', 'Wallpoet', 'Squada One', 'Audiowide', 'Orbitron', 'Russo One',
    'Teko', 'Exo 2', 'Rajdhani', 'Saira Condensed', 'Chakra Petch', 'Staatliches',
    'Passion One', 'Luckiest Guy', 'Bowlby One', 'Bowlby One SC', 'Ultra',
    'Modak', 'Rammetto One', 'Shrikhand', 'Faster One', 'Megrim', 'Iceberg',
    'Jura', 'Michroma', 'Electrolize', 'Aldrich', 'Wire One',
    'Syncopate', 'Allerta', 'Advent Pro', 'Exo', 'Share Tech Mono', 'Gruppo',
    'Stalinist One', 'Yellowtail', 'Lalezar', 'Bungee Inline',
    'Montserrat', 'Open Sans', 'Roboto', 'Lato', 'Source Sans Pro', 'Nunito',
    'Raleway', 'Ubuntu', 'Poppins', 'Inter', 'Fira Sans', 'Work Sans',
    'Barlow', 'Rubik', 'DM Sans', 'Manrope', 'Red Hat Display', 'Outfit',
    'Plus Jakarta Sans', 'Space Grotesk', 'Archivo', 'Assistant', 'Heebo',
    'Karla', 'Oxygen', 'PT Sans', 'Quicksand', 'Titillium Web', 'IBM Plex Sans',
    'Asap', 'Cabin', 'Hind', 'Varela Round', 'Prompt', 'Kanit',
    'Playfair Display', 'Cormorant Garamond', 'Crimson Text', 'Libre Baskerville',
    'Lora', 'Merriweather', 'Source Serif Pro', 'Spectral', 'Vollkorn',
    'Cardo', 'Gentium Plus', 'Neuton', 'Old Standard TT', 'PT Serif',
    'Bitter', 'Domine', 'Noticia Text', 'Tinos', 'Gelasio', 'IBM Plex Serif',
    'Abril Fatface', 'Crete Round', 'Arvo', 'Rokkitt', 'Slabo 27px',
    'Alegreya', 'Crimson Pro', 'Literata', 'Zilla Slab', 'Roboto Slab',
    'Caveat', 'Dancing Script', 'Pacifico', 'Lobster', 'Great Vibes', 'Satisfy',
    'Kaushan Script', 'Amatic SC', 'Indie Flower', 'Permanent Marker',
    'Shadows Into Light', 'Homemade Apple', 'Covered By Your Grace', 'Kalam',
    'Patrick Hand', 'Architects Daughter', 'Coming Soon', 'Gloria Hallelujah',
    'Handlee', 'Reenie Beanie', 'Rock Salt', 'Schoolbell', 'Walter Turncoat',
    'Fira Code', 'JetBrains Mono', 'Space Mono', 'IBM Plex Mono', 'Source Code Pro',
    'Roboto Mono', 'Ubuntu Mono', 'PT Mono', 'Cousins', 'Anonymous Pro',
    'Inconsolata', 'Noto Sans Mono', 'Overpass Mono', 'Red Hat Mono'
];

// Load Google Fonts
function loadGoogleFonts() {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=' + availableFonts.map(font => 
        font.replace(/ /g, '+')
    ).join('&family=') + '&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
}

// P5.js setup function
function setup() {
    const container = document.querySelector('.canvas-container');
    canvasWidth = container.clientWidth;
    canvasHeight = container.clientHeight;
    
    let canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('p5-container');
    
    textAlign(CENTER, CENTER);
    loadGoogleFonts();
    
    console.log(`Canvas setup complete: ${canvasWidth}x${canvasHeight}`);
    console.log('Total fonts available:', availableFonts.length);
}

// Handle window resize
function windowResized() {
    const container = document.querySelector('.canvas-container');
    canvasWidth = container.clientWidth;
    canvasHeight = container.clientHeight;
    resizeCanvas(canvasWidth, canvasHeight);
}

// P5.js draw function
function draw() {
    background(255);
    
    if (generatedLetters.length > 0) {
        updateAnimations();
        drawRansomNote();
    } else {
        fill(150);
        noStroke();
        textAlign(CENTER, CENTER);
        textFont('Arial', 16);
        text('Enter your message and click Generate', width/2, height/2);
    }
}

// Generate ransom note
function generateRansomNote() {
    if (!currentText || currentText.trim() === '') {
        console.log('No text to generate');
        return;
    }
    
    console.log('Generating ransom note for:', currentText);
    generatedLetters = [];
    
    for (let i = 0; i < currentText.length; i++) {
        const char = currentText[i];
        
        if (char === ' ') {
            generatedLetters.push({
                char: ' ',
                isSpace: true
            });
            continue;
        }
        
        if (char.trim() === '') {
            generatedLetters.push({
                char: char,
                isSpace: true
            });
            continue;
        }
        
        const randomFont = availableFonts[Math.floor(Math.random() * availableFonts.length)];
        
        const letterData = {
            char: char,
            isSpace: false,
            font: randomFont,
            baseSize: 30 + Math.random() * 20,
            baseSizeMultiplier: 0.7 + Math.random() * 0.6,
            baseDistortionX: (Math.random() - 0.5) * 2,
            baseDistortionY: (Math.random() - 0.5) * 2,
        };
        
        generatedLetters.push(letterData);
    }
    
    initializeAnimationArrays();
    generateShuffleVersions();
    resetAnimation();
    
    console.log(`Generated ${generatedLetters.length} characters with varied fonts`);
}

// Generate 6 different shuffle versions
function generateShuffleVersions() {
    shuffleVersions = [];
    
    for (let v = 0; v < 6; v++) {
        const version = [];
        
        for (let i = 0; i < currentText.length; i++) {
            const char = currentText[i];
            
            if (char === ' ' || char.trim() === '') {
                version.push({
                    char: char,
                    isSpace: true
                });
                continue;
            }
            
            const randomFont = availableFonts[Math.floor(Math.random() * availableFonts.length)];
            
            const letterData = {
                char: char,
                isSpace: false,
                font: randomFont,
                baseSize: 30 + Math.random() * 20,
                baseSizeMultiplier: 0.7 + Math.random() * 0.6,
                baseDistortionX: (Math.random() - 0.5) * 2,
                baseDistortionY: (Math.random() - 0.5) * 2,
            };
            
            version.push(letterData);
        }
        
        shuffleVersions.push(version);
    }
    
    currentShuffleIndex = 0;
    shuffleTimer = 0;
}

// Initialize animation arrays
function initializeAnimationArrays() {
    const letterCount = generatedLetters.filter(l => !l.isSpace).length;
    
    bounceOffsets = [];
    chaosOffsets = [];
    floatOffsets = [];
    pulseOffsets = [];
    
    for (let i = 0; i < letterCount; i++) {
        bounceOffsets[i] = Math.random() * TWO_PI;
        chaosOffsets[i] = {
            x: Math.random() * TWO_PI,
            y: Math.random() * TWO_PI,
            rotation: Math.random() * TWO_PI,
            scale: Math.random() * TWO_PI
        };
        floatOffsets[i] = {
            x: Math.random() * TWO_PI,
            y: Math.random() * TWO_PI
        };
        pulseOffsets[i] = Math.random() * TWO_PI;
    }
}

// Update animations
function updateAnimations() {
    if (!animationState.playing || animationState.paused) return;
    
    const currentTime = millis() / 1000.0;
    const elapsedTime = (currentTime - animationState.startTime - animationState.totalPausedTime) * animationState.speed;
    
    if (animationState.type === 'typewriter') {
        typewriterProgress = elapsedTime * 3; // 3 characters per second
    } else if (animationState.type === 'shuffle') {
        shuffleTimer = elapsedTime;
        // Change version every 0.8 seconds
        currentShuffleIndex = Math.floor(shuffleTimer / 0.8) % 6;
    }
}

// Draw the ransom note with improved blur support
function drawRansomNote() {
    let lettersToRender = generatedLetters;
    
    // Handle shuffle animation
    if (animationState.type === 'shuffle' && shuffleVersions.length > 0) {
        lettersToRender = shuffleVersions[currentShuffleIndex];
    }
    
    let visibleLetters = lettersToRender;
    
    // Handle typewriter animation
    if (animationState.type === 'typewriter' && animationState.playing && !animationState.paused) {
        const visibleCount = Math.floor(typewriterProgress);
        visibleLetters = lettersToRender.slice(0, visibleCount);
    }
    
    if (visibleLetters.length === 0) return;
    
    // Calculate total width for centering and stretching
    let totalBaseWidth = 0;
    visibleLetters.forEach(letterData => {
        if (letterData.isSpace) {
            totalBaseWidth += 20; // Base space width
        } else {
            totalBaseWidth += letterData.baseSize;
        }
    });
    
    // Add base spacing
    const spacingTotal = (visibleLetters.length - 1) * Math.abs(effects.spacing);
    let totalWidth = (totalBaseWidth * (effects.stretch / 100)) + spacingTotal;
    
    // Scale to fit canvas width with padding
    const maxWidth = width - 100;
    let scaleFactor = 1;
    if (totalWidth > maxWidth) {
        scaleFactor = maxWidth / totalWidth;
    }
    
    let currentX = (width - totalWidth * scaleFactor) / 2;
    const currentY = height / 2;
    
    let letterIndex = 0;
    
    visibleLetters.forEach((letterData, i) => {
        if (letterData.isSpace) {
            currentX += effects.spacing * scaleFactor;
            return;
        }
        
        let currentSize = (letterData.baseSize + (letterData.baseSizeMultiplier * effects.sizeVariation)) * scaleFactor;
        
        let distortX = letterData.baseDistortionX * effects.distortion;
        let distortY = letterData.baseDistortionY * effects.distortion;
        
        let letterX = currentX + distortX;
        let letterY = currentY + distortY;
        let letterRotation = 0;
        let letterScale = 1;
        
        // Apply animation effects
        const time = millis() / 1000.0 * animationState.speed;
        
        if (animationState.playing && !animationState.paused && animationState.type !== 'shuffle') {
            switch (animationState.type) {
                case 'bounce':
                    letterY += sin(time * 3 + bounceOffsets[letterIndex]) * 30;
                    break;
                    
                case 'chaos':
                    letterX += sin(time * 2 + chaosOffsets[letterIndex].x) * 20;
                    letterY += cos(time * 2 + chaosOffsets[letterIndex].y) * 20;
                    letterRotation = sin(time * 1.5 + chaosOffsets[letterIndex].rotation) * 0.3;
                    letterScale = 1 + sin(time * 2.5 + chaosOffsets[letterIndex].scale) * 0.2;
                    break;
                    
                case 'float':
                    letterX += sin(time * 1.2 + floatOffsets[letterIndex].x) * 10;
                    letterY += cos(time * 0.8 + floatOffsets[letterIndex].y) * 15;
                    break;
                    
                case 'pulse':
                    letterScale = 1 + sin(time * 4 + pulseOffsets[letterIndex]) * 0.3;
                    break;
            }
        }
        
        push();
        
        // Improved blur implementation for mobile
        if (effects.blur > 0) {
            // Use CSS filter for better mobile compatibility
            drawingContext.save();
            drawingContext.filter = `blur(${effects.blur}px)`;
        }
        
        translate(letterX, letterY);
        rotate(letterRotation);
        scale(letterScale);
        scale(effects.stretch / 100, 1);
        
        try {
            textFont(letterData.font, currentSize);
        } catch (e) {
            textFont('Arial', currentSize);
        }
        
        textAlign(CENTER, CENTER);
        
        if (effects.strokeWeight > 0) {
            noFill();
            stroke(0);
            strokeWeight(effects.strokeWeight);
            strokeJoin(ROUND);
            strokeCap(ROUND);
        } else {
            fill(0);
            noStroke();
        }
        
        text(letterData.char, 0, 0);
        
        if (effects.blur > 0) {
            drawingContext.restore();
        }
        
        pop();
        
        currentX += (letterData.baseSize * (effects.stretch / 100) * scaleFactor) + (effects.spacing * scaleFactor);
        letterIndex++;
    });
}

// Animation control functions
function playAnimation() {
    if (animationState.type === 'none') return;
    
    if (animationState.paused) {
        animationState.totalPausedTime += millis() / 1000.0 - animationState.pauseTime;
        animationState.paused = false;
    } else {
        animationState.startTime = millis() / 1000.0;
        animationState.totalPausedTime = 0;
        
        if (animationState.type === 'typewriter') {
            typewriterProgress = 0;
        } else if (animationState.type === 'shuffle') {
            shuffleTimer = 0;
            currentShuffleIndex = 0;
        }
    }
    
    animationState.playing = true;
    updateAnimationButtons();
}

function pauseAnimation() {
    if (animationState.playing && !animationState.paused) {
        animationState.paused = true;
        animationState.pauseTime = millis() / 1000.0;
    }
    updateAnimationButtons();
}

function stopAnimation() {
    animationState.playing = false;
    animationState.paused = false;
    animationState.totalPausedTime = 0;
    typewriterProgress = 0;
    shuffleTimer = 0;
    currentShuffleIndex = 0;
    updateAnimationButtons();
}

function resetAnimation() {
    stopAnimation();
    if (animationState.type === 'typewriter') {
        typewriterProgress = 0;
    } else if (animationState.type === 'shuffle') {
        shuffleTimer = 0;
        currentShuffleIndex = 0;
    }
}

function changeAnimationType(newType) {
    const oldType = animationState.type;
    animationState.type = newType;
    
    if (oldType !== newType) {
        resetAnimation();
        if (newType === 'shuffle' && currentText) {
            generateShuffleVersions();
        }
    }
}

function updateAnimationButtons() {
    const playBtn = document.getElementById('playBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const stopBtn = document.getElementById('stopBtn');
    
    // Remove active class from all buttons
    [playBtn, pauseBtn, stopBtn].forEach(btn => btn.classList.remove('active'));
    
    if (animationState.playing && !animationState.paused) {
        playBtn.classList.add('active');
    } else if (animationState.paused) {
        pauseBtn.classList.add('active');
    } else {
        stopBtn.classList.add('active');
    }
}

// Setup collapsible sections
function setupCollapsible() {
    const sections = document.querySelectorAll('.collapsible-section');
    
    sections.forEach(section => {
        const header = section.querySelector('.section-header');
        const content = section.querySelector('.section-content');
        const chevron = header.querySelector('.chevron');
        
        // Start closed - use the CSS classes instead of inline styles
        content.classList.remove('expanded');
        chevron.classList.remove('rotated');
        
        header.addEventListener('click', function() {
            const isOpen = content.classList.contains('expanded');
            
            if (isOpen) {
                // Close the section
                content.classList.remove('expanded');
                chevron.classList.remove('rotated');
            } else {
                // Open the section
                content.classList.add('expanded');
                chevron.classList.add('rotated');
            }
        });
    });
}


// Setup slider controls
function setupSliders() {
    const sliders = [
        { id: 'blur', property: 'blur', suffix: 'px' },
        { id: 'spacing', property: 'spacing', suffix: 'px' },
        { id: 'stretch', property: 'stretch', suffix: '%' },
        { id: 'sizeVariation', property: 'sizeVariation', suffix: 'px' },
        { id: 'strokeWeight', property: 'strokeWeight', suffix: 'px' },
        { id: 'distortion', property: 'distortion', suffix: '°' }
    ];
    
    sliders.forEach(slider => {
        const element = document.getElementById(slider.id);
        const valueSpan = element.parentElement.querySelector('.range-value');
        
        element.addEventListener('input', function() {
            const value = parseFloat(this.value);
            effects[slider.property] = value;
            valueSpan.textContent = value + slider.suffix;
        });
        
        // Initialize display
        valueSpan.textContent = effects[slider.property] + slider.suffix;
    });
    
    // Animation speed slider
    const speedSlider = document.getElementById('animationSpeed');
    const speedValue = speedSlider.parentElement.querySelector('.range-value');
    
    speedSlider.addEventListener('input', function() {
        const value = parseFloat(this.value);
        animationState.speed = value;
        speedValue.textContent = value + 'x';
    });
    
    speedValue.textContent = animationState.speed + 'x';
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing ransom note generator...');
    
    // Get DOM elements
    const textInput = document.getElementById('textInput');
    const generateBtn = document.getElementById('generateBtn');
    
    // Setup collapsible sections (start closed)
    setupCollapsible();
    
    // Setup sliders
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
    
    // Animation controls
    document.getElementById('playBtn').addEventListener('click', playAnimation);
    document.getElementById('pauseBtn').addEventListener('click', pauseAnimation);
    document.getElementById('stopBtn').addEventListener('click', stopAnimation);
    
    // Animation type selector
    document.getElementById('animationType').addEventListener('change', function() {
        changeAnimationType(this.value);
    });
    
    // Initialize animation buttons
    updateAnimationButtons();
    
    console.log('Event listeners attached successfully');
});
