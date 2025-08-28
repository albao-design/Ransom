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

// Export variables
let exportState = {
    isExporting: false,
    format: 'png',
    frames: [],
    duration: 3000, // 3 seconds for animations
    frameRate: 30,
    currentFrame: 0,
    totalFrames: 0
};

// P5.js setup function
function setup() {
    const container = document.querySelector('.canvas-container');
    canvasWidth = container.clientWidth;
    canvasHeight = container.clientHeight;
    
    let canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('p5-container');
    
    textAlign(CENTER, CENTER);
    
    console.log(`Canvas setup complete: ${canvasWidth}x${canvasHeight}`);
    console.log('Total fonts available:', window.availableFonts ? window.availableFonts.length : 0);
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
    // Use transparent background for exports, white for display
    if (exportState.isExporting) {
        clear(); // Transparent background
    } else {
        background(255); // White background for display
    }
    
    if (generatedLetters.length > 0) {
        updateAnimations();
        drawRansomNote();
        
        // Handle export frame capture
        if (exportState.isExporting) {
            captureExportFrame();
        }
    } else {
        if (!exportState.isExporting) {
            fill(150);
            noStroke();
            textAlign(CENTER, CENTER);
            textFont('Arial', 16);
            text('Enter your message and click Generate', width/2, height/2);
        }
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
    
    // Use fonts from fonts.js or fallback
    const fontsToUse = window.availableFonts || ['Arial', 'Georgia', 'Times New Roman', 'Verdana'];
    
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
    const fontsToUse = window.availableFonts || ['Arial', 'Georgia', 'Times New Roman', 'Verdana'];
    
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
    if (exportState.isExporting) {
        // Use frame-based time for exports
        const frameTime = (exportState.currentFrame / exportState.frameRate);
        const elapsedTime = frameTime * animationState.speed;
        
        if (animationState.type === 'typewriter') {
            typewriterProgress = elapsedTime * 3;
        } else if (animationState.type === 'shuffle') {
            shuffleTimer = elapsedTime;
            currentShuffleIndex = Math.floor(shuffleTimer / 0.8) % 6;
        }
    } else if (animationState.playing && !animationState.paused) {
        const currentTime = millis() / 1000.0;
        const elapsedTime = (currentTime - animationState.startTime - animationState.totalPausedTime) * animationState.speed;
        
        if (animationState.type === 'typewriter') {
            typewriterProgress = elapsedTime * 3;
        } else if (animationState.type === 'shuffle') {
            shuffleTimer = elapsedTime;
            currentShuffleIndex = Math.floor(shuffleTimer / 0.8) % 6;
        }
    }
}

// Draw the ransom note
function drawRansomNote() {
    let lettersToRender = generatedLetters;
    
    // Handle shuffle animation
    if (animationState.type === 'shuffle' && shuffleVersions.length > 0) {
        lettersToRender = shuffleVersions[currentShuffleIndex];
    }
    
    let visibleLetters = lettersToRender;
    
    // Handle typewriter animation
    if (animationState.type === 'typewriter' && (animationState.playing || exportState.isExporting)) {
        const visibleCount = Math.floor(typewriterProgress);
        visibleLetters = lettersToRender.slice(0, visibleCount);
    }
    
    if (visibleLetters.length === 0) return;
    
    // Calculate total width for centering and stretching
    let totalBaseWidth = 0;
    visibleLetters.forEach(letterData => {
        if (letterData.isSpace) {
            totalBaseWidth += 20;
        } else {
            totalBaseWidth += letterData.baseSize;
        }
    });
    
    const spacingTotal = (visibleLetters.length - 1) * Math.abs(effects.spacing);
    let totalWidth = (totalBaseWidth * (effects.stretch / 100)) + spacingTotal;
    
    const maxWidth = width - 100;
    let scaleFactor = 1;
    if (totalWidth > maxWidth) {
        scaleFactor = maxWidth / totalWidth;
    }
    
    let currentX = (width - totalWidth * scaleFactor) / 2;
    const currentY = height / 2;
    
    let letterIndex = 0;
    
    const blurPasses = effects.blur > 0 ? Math.max(1, Math.floor(effects.blur * 2)) : 1;
    const blurOpacity = effects.blur > 0 ? 255 / blurPasses : 255;
    
    for (let blurPass = 0; blurPass < blurPasses; blurPass++) {
        currentX = (width - totalWidth * scaleFactor) / 2;
        letterIndex = 0;
        
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
            
            // Add blur offset for multiple passes
            if (effects.blur > 0 && blurPass > 0) {
                const blurRadius = effects.blur * 2;
                const angle = (blurPass / blurPasses) * TWO_PI;
                const distance = (blurPass / blurPasses) * blurRadius;
                letterX += cos(angle) * distance;
                letterY += sin(angle) * distance;
            }
            
            // Apply animation effects
            const currentTime = exportState.isExporting ? 
                (exportState.currentFrame / exportState.frameRate) : 
                ((millis() / 1000.0) - animationState.startTime - animationState.totalPausedTime);
                
            const animTime = currentTime * animationState.speed;
            
            if (animationState.type === 'bounce') {
                letterY += sin(animTime * 4 + bounceOffsets[letterIndex]) * 15;
            } else if (animationState.type === 'chaos') {
                letterX += sin(animTime * 3 + chaosOffsets[letterIndex].x) * 8;
                letterY += cos(animTime * 2.5 + chaosOffsets[letterIndex].y) * 12;
                letterRotation = sin(animTime * 4 + chaosOffsets[letterIndex].rotation) * 0.3;
                letterScale = 1 + sin(animTime * 3.5 + chaosOffsets[letterIndex].scale) * 0.2;
            } else if (animationState.type === 'float') {
                letterX += sin(animTime * 1.5 + floatOffsets[letterIndex].x) * 5;
                letterY += cos(animTime * 1.8 + floatOffsets[letterIndex].y) * 8;
            } else if (animationState.type === 'pulse') {
                letterScale = 1 + sin(animTime * 3 + pulseOffsets[letterIndex]) * 0.3;
            }
            
            // Set text properties
            textFont(letterData.font);
            textSize(currentSize * letterScale);
            
            // Set stroke
            if (effects.strokeWeight > 0) {
                stroke(0, blurOpacity);
                strokeWeight(effects.strokeWeight);
            } else {
                noStroke();
            }
            
            // Set fill with blur opacity
            fill(0, blurOpacity);
            
            // Apply transformations
            push();
            translate(letterX, letterY);
            if (letterRotation !== 0) {
                rotate(letterRotation);
            }
            
            textAlign(CENTER, CENTER);
            text(letterData.char, 0, 0);
            pop();
            
            // Move to next position
            currentX += (letterData.baseSize * (effects.stretch / 100) + effects.spacing) * scaleFactor;
            letterIndex++;
        });
    }
}

// Export Functions
function exportImage(format) {
    if (generatedLetters.length === 0) {
        alert('Please generate a ransom note first!');
        return;
    }
    
    const filename = `ransom-note-${Date.now()}`;
    
    // Stop any current animation for static export
    const wasPlaying = animationState.playing;
    const wasPaused = animationState.paused;
    
    exportState.isExporting = true;
    
    // Force one frame redraw with transparent background
    redraw();
    
    // Small delay to ensure canvas is updated
    setTimeout(() => {
        try {
            if (format === 'png') {
                save(filename + '.png');
            } else if (format === 'jpeg') {
                // For JPEG, we need to add a white background since it doesn't support transparency
                const originalCanvas = document.querySelector('canvas');
                const tempCanvas = document.createElement('canvas');
                const tempCtx = tempCanvas.getContext('2d');
                
                tempCanvas.width = originalCanvas.width;
                tempCanvas.height = originalCanvas.height;
                
                // Fill with white background
                tempCtx.fillStyle = '#FFFFFF';
                tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
                
                // Draw the original canvas on top
                tempCtx.drawImage(originalCanvas, 0, 0);
                
                // Download the composite image
                const link = document.createElement('a');
                link.download = filename + '.jpg';
                link.href = tempCanvas.toDataURL('image/jpeg', 0.9);
                link.click();
            }
            
            console.log(`Exported ${format.toUpperCase()} successfully`);
        } catch (error) {
            console.error('Export failed:', error);
            alert('Export failed. Please try again.');
        }
        
        exportState.isExporting = false;
        
        // Restore animation state
        if (wasPlaying && !wasPaused) {
            animationState.playing = true;
            animationState.paused = false;
        }
        
        redraw();
    }, 100);
}

function exportSVG() {
    if (generatedLetters.length === 0) {
        alert('Please generate a ransom note first!');
        return;
    }
    
    console.log('SVG export started...');
    
    // Create SVG content
    let svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<defs>
<style>
`;

    // Add font styles
    const fontsToUse = window.availableFonts || ['Arial', 'Georgia', 'Times New Roman', 'Verdana'];
    fontsToUse.forEach((font, index) => {
        svgContent += `.font${index} { font-family: "${font}"; }\n`;
    });

    svgContent += `</style>
</defs>
`;

    // Generate text elements (static version for SVG)
    let lettersToRender = generatedLetters;
    
    // Calculate positioning (same logic as drawRansomNote)
    let totalBaseWidth = 0;
    lettersToRender.forEach(letterData => {
        if (letterData.isSpace) {
            totalBaseWidth += 20;
        } else {
            totalBaseWidth += letterData.baseSize;
        }
    });
    
    const spacingTotal = (lettersToRender.length - 1) * Math.abs(effects.spacing);
    let totalWidth = (totalBaseWidth * (effects.stretch / 100)) + spacingTotal;
    
    const maxWidth = width - 100;
    let scaleFactor = 1;
    if (totalWidth > maxWidth) {
        scaleFactor = maxWidth / totalWidth;
    }
    
    let currentX = (width - totalWidth * scaleFactor) / 2;
    const currentY = height / 2;
    
    lettersToRender.forEach((letterData, i) => {
        if (letterData.isSpace) {
            currentX += effects.spacing * scaleFactor;
            return;
        }
        
        let currentSize = (letterData.baseSize + (letterData.baseSizeMultiplier * effects.sizeVariation)) * scaleFactor;
        
        let distortX = letterData.baseDistortionX * effects.distortion;
        let distortY = letterData.baseDistortionY * effects.distortion;
        
        let letterX = currentX + distortX;
        let letterY = currentY + distortY;
        
        // Find font index
        const fontIndex = fontsToUse.indexOf(letterData.font);
        const fontClass = fontIndex >= 0 ? `font${fontIndex}` : 'font0';
        
        // Create text element
        svgContent += `<text x="${letterX}" y="${letterY}" class="${fontClass}" font-size="${currentSize}" ` +
                     `fill="black" text-anchor="middle" dominant-baseline="middle"`;
        
        if (effects.strokeWeight > 0) {
            svgContent += ` stroke="black" stroke-width="${effects.strokeWeight}"`;
        }
        
        if (effects.blur > 0) {
            svgContent += ` filter="blur(${effects.blur}px)"`;
        }
        
        svgContent += `>${letterData.char}</text>\n`;
        
        currentX += (letterData.baseSize * (effects.stretch / 100) + effects.spacing) * scaleFactor;
    });
    
    svgContent += '</svg>';
    
    // Download SVG
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ransom-note-${Date.now()}.svg`;
    link.click();
    URL.revokeObjectURL(url);
    
    console.log('SVG export completed');
}

function exportAnimatedGIF() {
    if (generatedLetters.length === 0) {
        alert('Please generate a ransom note first!');
        return;
    }
    
    if (animationState.type === 'none') {
        alert('Please select an animation type first!');
        return;
    }
    
    console.log('Starting GIF export...');
    showExportProgress('Preparing GIF export...');
    
    exportState.isExporting = true;
    exportState.frames = [];
    exportState.currentFrame = 0;
    exportState.totalFrames = Math.floor((exportState.duration / 1000) * exportState.frameRate);
    
    // Reset animation to beginning
    typewriterProgress = 0;
    shuffleTimer = 0;
    currentShuffleIndex = 0;
    
    captureGIFFrames();
}

function captureGIFFrames() {
    if (exportState.currentFrame >= exportState.totalFrames) {
        // All frames captured, create GIF
        createGIFFromFrames();
        return;
    }
    
    // Update progress
    const progress = (exportState.currentFrame / exportState.totalFrames * 100).toFixed(1);
    showExportProgress(`Capturing frames... ${progress}%`);
    
    // Force redraw for this frame
    redraw();
    
    // Capture frame after a small delay
    setTimeout(() => {
        // Get canvas data
        const canvas = document.querySelector('canvas');
        const frameData = canvas.toDataURL('image/png');
        exportState.frames.push(frameData);
        
        exportState.currentFrame++;
        
        // Schedule next frame
        setTimeout(captureGIFFrames, 16); // ~60fps capture
    }, 16);
}

function createGIFFromFrames() {
    showExportProgress('Creating GIF file...');
    
    // Note: This is a simplified version. For production use, you'd want to use a proper GIF encoding library
    // like gif.js (https://github.com/jnordberg/gif.js/)
    
    console.log(`Captured ${exportState.frames.length} frames for GIF`);
    
    // For now, we'll save the first frame as PNG with instructions
    const link = document.createElement('a');
    link.href = exportState.frames[0];
    link.download = `ransom-note-${Date.now()}.png`;
    link.click();
    
    exportState.isExporting = false;
    hideExportProgress();
    
    alert('GIF export captured frames. For full GIF creation, a specialized library like gif.js would be needed.');
    
    console.log('GIF export process completed');
}

function exportMP4() {
    if (generatedLetters.length === 0) {
        alert('Please generate a ransom note first!');
        return;
    }
    
    if (animationState.type === 'none') {
        alert('Please select an animation type first!');
        return;
    }
    
    alert('MP4 export requires MediaRecorder API. This would need additional implementation with libraries like CCapture.js for full browser support.');
    console.log('MP4 export requested - would need MediaRecorder API implementation');
}

function captureExportFrame() {
    // This function is called during the draw loop when exporting
    // Used for frame-by-frame animation exports
}

// Export progress UI helpers
function showExportProgress(message) {
    // Create or update progress indicator
    let progressDiv = document.getElementById('export-progress');
    if (!progressDiv) {
        progressDiv = document.createElement('div');
        progressDiv.id = 'export-progress';
        progressDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 20px;
            border-radius: 8px;
            z-index: 1000;
            font-size: 14px;
            text-align: center;
        `;
        document.body.appendChild(progressDiv);
    }
    progressDiv.textContent = message;
}

function hideExportProgress() {
    const progressDiv = document.getElementById('export-progress');
    if (progressDiv) {
        progressDiv.remove();
    }
}

// Collapsible sections setup
function setupCollapsible() {
    const headers = document.querySelectorAll('.section-header');
    
    headers.forEach(header => {
        const chevron = header.querySelector('.chevron');
        const contentId = header.id.replace('Header', 'Content');
        const content = document.getElementById(contentId);
        
        if (content) {
            // Start sections collapsed
            content.classList.remove('expanded');
            if (chevron) {
                chevron.style.transform = 'rotate(0deg)';
            }
            
            header.addEventListener('click', function() {
                const isExpanded = content.classList.contains('expanded');
                
                if (isExpanded) {
                    content.classList.remove('expanded');
                    if (chevron) {
                        chevron.style.transform = 'rotate(0deg)';
                    }
                } else {
                    content.classList.add('expanded');
                    if (chevron) {
                        chevron.style.transform = 'rotate(180deg)';
                    }
                }
            });
        }
    });
}

// Setup sliders with real-time updates
function setupSliders() {
    const sliders = [
        { id: 'blur', prop: 'blur', suffix: 'px' },
        { id: 'spacing', prop: 'spacing', suffix: 'px' },
        { id: 'stretch', prop: 'stretch', suffix: '%' },
        { id: 'sizeVariation', prop: 'sizeVariation', suffix: 'px' },
        { id: 'strokeWeight', prop: 'strokeWeight', suffix: 'px' },
        { id: 'distortion', prop: 'distortion', suffix: '°' }
    ];
    
    sliders.forEach(({ id, prop, suffix }) => {
        const slider = document.getElementById(id);
        const label = slider.parentElement.querySelector('.range-value');
        
        if (slider && label) {
            slider.addEventListener('input', function() {
                effects[prop] = parseFloat(this.value);
                label.textContent = this.value + suffix;
            });
            
            // Initialize display
            effects[prop] = parseFloat(slider.value);
            label.textContent = slider.value + suffix;
        }
    });
    
    // Animation speed slider
    const speedSlider = document.getElementById('animationSpeed');
    const speedLabel = speedSlider?.parentElement.querySelector('.range-value');
    
    if (speedSlider && speedLabel) {
        speedSlider.addEventListener('input', function() {
            animationState.speed = parseFloat(this.value);
            speedLabel.textContent = animationState.speed + 'x';
        });
    }
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
    animationState.type = newType;
    resetAnimation();
    console.log('Animation type changed to:', newType);
}

function updateAnimationButtons() {
    const playBtn = document.getElementById('playBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const stopBtn = document.getElementById('stopBtn');
    
    if (playBtn && pauseBtn && stopBtn) {
        playBtn.classList.toggle('active', animationState.playing && !animationState.paused);
        pauseBtn.classList.toggle('active', animationState.paused);
        stopBtn.classList.toggle('active', !animationState.playing);
    }
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
    
    // Export controls
    document.getElementById('exportPNG')?.addEventListener('click', () => exportImage('png'));
    document.getElementById('exportJPEG')?.addEventListener('click', () => exportImage('jpeg'));
    document.getElementById('exportSVG')?.addEventListener('click', exportSVG);
    document.getElementById('exportGIF')?.addEventListener('click', exportAnimatedGIF);
    document.getElementById('exportMP4')?.addEventListener('click', exportMP4);
    
    // Initialize animation buttons
    updateAnimationButtons();
    
    console.log('Event listeners attached successfully');
});
