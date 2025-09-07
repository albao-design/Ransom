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

// P5.js setup function
function setup() {
    const container = document.querySelector('.canvas-container');
    canvasWidth = container.clientWidth;
    canvasHeight = container.clientHeight;
    
    let canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('p5-container');
    
    textAlign(CENTER, CENTER);
    
    console.log(`Canvas setup complete: ${canvasWidth}x${canvasHeight}`);
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
    
    // Ensure fonts are available
    const fontsToUse = window.availableFonts || ['Arial', 'Times', 'Helvetica'];
    
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
        
        const randomFont = fontsToUse[Math.floor(Math.random() * fontsToUse.length)];
        
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
    const fontsToUse = window.availableFonts || ['Arial', 'Times', 'Helvetica'];
    
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
            
            const randomFont = fontsToUse[Math.floor(Math.random() * fontsToUse.length)];
            
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
    
    // Draw each letter
    visibleLetters.forEach(letterData => {
        if (letterData.isSpace) {
            currentX += 20 * scaleFactor;
            return;
        }
        
        push();
        
        translate(currentX + (letterData.baseSize * (effects.stretch / 100) * scaleFactor) / 2, currentY);
        
        // Apply animation offsets
        if (animationState.playing && !animationState.paused) {
            applyAnimationOffset(letterIndex);
        }
        
        // Apply distortion
        if (effects.distortion > 0) {
            rotate(radians(letterData.baseDistortionX * effects.distortion));
        }
        
        // Set font and size
        textFont(letterData.font);
        const finalSize = (letterData.baseSize + effects.sizeVariation * letterData.baseSizeMultiplier) * (effects.stretch / 100) * scaleFactor;
        textSize(finalSize);
        
        // Apply blur if needed
        if (effects.blur > 0) {
            drawingContext.save();
            drawingContext.filter = `blur(${effects.blur}px)`;
        }
        
        // Set stroke and fill
        if (effects.strokeWeight > 0) {
            stroke(0);
            strokeWeight(effects.strokeWeight);
            fill(255);
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

// Apply animation offsets based on animation type
function applyAnimationOffset(letterIndex) {
    switch (animationState.type) {
        case 'bounce':
            if (bounceOffsets[letterIndex]) {
                translate(0, bounceOffsets[letterIndex]);
            }
            break;
        case 'chaos':
            if (chaosOffsets[letterIndex]) {
                translate(chaosOffsets[letterIndex].x, chaosOffsets[letterIndex].y);
            }
            break;
        case 'float':
            if (floatOffsets[letterIndex]) {
                translate(0, floatOffsets[letterIndex]);
            }
            break;
        case 'pulse':
            if (pulseOffsets[letterIndex]) {
                scale(pulseOffsets[letterIndex]);
            }
            break;
    }
}

// Initialize animation arrays
function initializeAnimationArrays() {
    const letterCount = generatedLetters.filter(l => !l.isSpace).length;
    
    bounceOffsets = new Array(letterCount).fill(0);
    chaosOffsets = new Array(letterCount).fill({ x: 0, y: 0 });
    floatOffsets = new Array(letterCount).fill(0);
    pulseOffsets = new Array(letterCount).fill(1);
}

// Update animations
function updateAnimations() {
    if (!animationState.playing || animationState.paused) return;
    
    const currentTime = millis();
    const elapsedTime = (currentTime - animationState.startTime - animationState.totalPausedTime) * animationState.speed;
    
    switch (animationState.type) {
        case 'bounce':
            updateBounceAnimation(elapsedTime);
            break;
        case 'chaos':
            updateChaosAnimation(elapsedTime);
            break;
        case 'float':
            updateFloatAnimation(elapsedTime);
            break;
        case 'pulse':
            updatePulseAnimation(elapsedTime);
            break;
        case 'typewriter':
            updateTypewriterAnimation(elapsedTime);
            break;
        case 'shuffle':
            updateShuffleAnimation(elapsedTime);
            break;
    }
}

// Animation update functions
function updateBounceAnimation(elapsedTime) {
    for (let i = 0; i < bounceOffsets.length; i++) {
        bounceOffsets[i] = sin((elapsedTime * 0.01) + (i * 0.5)) * 20;
    }
}

function updateChaosAnimation(elapsedTime) {
    for (let i = 0; i < chaosOffsets.length; i++) {
        chaosOffsets[i] = {
            x: sin((elapsedTime * 0.008) + (i * 0.3)) * 15,
            y: cos((elapsedTime * 0.01) + (i * 0.7)) * 15
        };
    }
}

function updateFloatAnimation(elapsedTime) {
    for (let i = 0; i < floatOffsets.length; i++) {
        floatOffsets[i] = sin((elapsedTime * 0.005) + (i * 0.8)) * 10;
    }
}

function updatePulseAnimation(elapsedTime) {
    for (let i = 0; i < pulseOffsets.length; i++) {
        pulseOffsets[i] = 1 + sin((elapsedTime * 0.01) + (i * 0.4)) * 0.2;
    }
}

function updateTypewriterAnimation(elapsedTime) {
    const speed = 50; // characters per second
    typewriterProgress = min((elapsedTime / 1000) * speed, generatedLetters.length);
    
    if (typewriterProgress >= generatedLetters.length) {
        stopAnimation();
    }
}

function updateShuffleAnimation(elapsedTime) {
    shuffleTimer += deltaTime;
    
    if (shuffleTimer > 200) { // Change every 200ms
        currentShuffleIndex = (currentShuffleIndex + 1) % shuffleVersions.length;
        shuffleTimer = 0;
    }
}

// Animation controls
function playAnimation() {
    if (generatedLetters.length === 0) return;
    
    if (animationState.paused) {
        // Resume from pause
        animationState.totalPausedTime += millis() - animationState.pauseTime;
        animationState.paused = false;
    } else {
        // Start new animation
        animationState.startTime = millis();
        animationState.totalPausedTime = 0;
        
        // Reset animation-specific variables
        if (animationState.type === 'typewriter') {
            typewriterProgress = 0;
        }
        if (animationState.type === 'shuffle') {
            currentShuffleIndex = 0;
            shuffleTimer = 0;
        }
    }
    
    animationState.playing = true;
    updateAnimationButtons();
}

function pauseAnimation() {
    if (animationState.playing && !animationState.paused) {
        animationState.paused = true;
        animationState.pauseTime = millis();
        updateAnimationButtons();
    }
}

function stopAnimation() {
    animationState.playing = false;
    animationState.paused = false;
    animationState.startTime = 0;
    animationState.totalPausedTime = 0;
    
    // Reset animation variables
    typewriterProgress = 0;
    currentShuffleIndex = 0;
    shuffleTimer = 0;
    initializeAnimationArrays();
    
    updateAnimationButtons();
}

function changeAnimationType(newType) {
    const wasPlaying = animationState.playing && !animationState.paused;
    stopAnimation();
    animationState.type = newType;
    
    if (wasPlaying && newType !== 'none') {
        playAnimation();
    }
}

function updateAnimationButtons() {
    const playBtn = document.getElementById('playBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const stopBtn = document.getElementById('stopBtn');
    
    if (!playBtn || !pauseBtn || !stopBtn) return;
    
    // Update button states
    playBtn.classList.toggle('active', animationState.playing && !animationState.paused);
    pauseBtn.classList.toggle('active', animationState.paused);
    
    // Enable/disable buttons based on state
    playBtn.disabled = animationState.playing && !animationState.paused;
    pauseBtn.disabled = !animationState.playing;
    stopBtn.disabled = !animationState.playing && !animationState.paused;
}

function resetAnimation() {
    stopAnimation();
    initializeAnimationArrays();
}

// Setup collapsible sections
function setupCollapsible() {
    const headers = document.querySelectorAll('.section-header');
    
    headers.forEach(header => {
        header.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const chevron = this.querySelector('.chevron');
            
            // Toggle expanded class
            content.classList.toggle('expanded');
            header.classList.toggle('expanded');
            
            // Rotate chevron
            if (content.classList.contains('expanded')) {
                chevron.style.transform = 'rotate(180deg)';
            } else {
                chevron.style.transform = 'rotate(0deg)';
            }
        });
    });
}

// Setup sliders
function setupSliders() {
    const sliders = [
        { id: 'blur', property: 'blur', suffix: 'px' },
        { id: 'spacing', property: 'spacing', suffix: 'px' },
        { id: 'stretch', property: 'stretch', suffix: '%' },
        { id: 'sizeVariation', property: 'sizeVariation', suffix: 'px' },
        { id: 'strokeWeight', property: 'strokeWeight', suffix: 'px' },
        { id: 'distortion', property: 'distortion', suffix: '°' }
    ];
    
    sliders.forEach(({ id, property, suffix }) => {
        const slider = document.getElementById(id);
        const valueSpan = slider.parentElement.querySelector('.range-value');
        
        if (!slider || !valueSpan) return;
        
        // Set initial value
        valueSpan.textContent = slider.value + suffix;
        
        slider.addEventListener('input', function() {
            effects[property] = parseFloat(this.value);
            valueSpan.textContent = this.value + suffix;
        });
    });
    
    // Animation speed slider
    const speedSlider = document.getElementById('animationSpeed');
    if (speedSlider) {
        const speedValue = speedSlider.parentElement.querySelector('.range-value');
        
        speedSlider.addEventListener('input', function() {
            animationState.speed = parseFloat(this.value);
            if (speedValue) {
                speedValue.textContent = this.value + 'x';
            }
        });
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing ransom note generator...');
    
    // Get DOM elements
    const textInput = document.getElementById('textInput');
    const generateBtn = document.getElementById('generateBtn');
    
    if (!textInput || !generateBtn) {
        console.error('Required DOM elements not found');
        return;
    }
    
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
    const playBtn = document.getElementById('playBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const stopBtn = document.getElementById('stopBtn');
    const animationType = document.getElementById('animationType');
    
    if (playBtn) playBtn.addEventListener('click', playAnimation);
    if (pauseBtn) pauseBtn.addEventListener('click', pauseAnimation);
    if (stopBtn) stopBtn.addEventListener('click', stopAnimation);
    if (animationType) {
        animationType.addEventListener('change', function() {
            changeAnimationType(this.value);
        });
    }
    
    // Initialize animation buttons
    updateAnimationButtons();
    
    console.log('Event listeners attached successfully');
});
