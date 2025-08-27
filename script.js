// Global variables to store our data
let currentText = ''; // Stores the user's input text
let generatedLetters = []; // Array to store each letter's styling information
let canvasWidth = 600; // Default canvas width
let canvasHeight = 400; // Default canvas height

// P5.js setup function - runs once when page loads
function setup() {
    // Calculate responsive canvas size based on screen
    let container = document.querySelector('.canvas-container');
    let containerWidth = container.clientWidth - 40; // Subtract padding
    canvasWidth = min(containerWidth, 700); // Don't exceed 700px
    canvasHeight = max(300, canvasWidth * 0.57); // Maintain aspect ratio
    
    // Create canvas and attach it to our HTML container
    let canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('p5-container'); // Put canvas inside the p5-container div
    
    // Set canvas background color to white
    background(255);
    
    // P5.js setting - only draw when we call redraw()
    noLoop();
}

// P5.js draw function - runs every frame (but we turned off looping)
function draw() {
    // Clear the canvas with white background
    background(255);
    
    // Only draw if we have generated letters
    if (generatedLetters.length === 0) {
        // Show placeholder text when nothing is generated
        fill(150); // Gray color
        textAlign(CENTER, CENTER); // Center the text
        textSize(18);
        text('Enter text and click Generate!', width/2, height/2);
        return; // Exit early if no letters to draw
    }
    
    // Variables for positioning letters
    let x = 50; // Starting x position (left margin)
    let y = 80; // Starting y position (top margin)
    let lineHeight = 60; // Space between lines
    let maxWidth = width - 100; // Maximum width before wrapping (with margins)
    
    // Loop through each letter and draw it
    for (let i = 0; i < generatedLetters.length; i++) {
        let letter = generatedLetters[i]; // Get current letter data
        
        // Handle spaces - move x position by consistent spacing
        if (letter.char === ' ') {
            x += 20; // Consistent space width
            continue; // Skip to next letter
        }
        
        // Handle line breaks - move to next line
        if (letter.char === '\n' || x > maxWidth) {
            x = 50; // Reset to left margin
            y += lineHeight; // Move down one line
            
            // Skip if this was a manual line break
            if (letter.char === '\n') continue;
        }
        
        // Set up the styling for this letter
        push(); // Save current drawing settings
        
        // Move to letter position (no rotation applied)
        translate(x, y);
        
        // Set font properties
        fill(0); // Black text (0 = black in grayscale)
        textFont(letter.font); // Set font family
        textSize(letter.size); // Set font size
        textAlign(LEFT, BASELINE); // Align text consistently
        
        // Draw the letter
        text(letter.char, 0, 0);
        
        pop(); // Restore previous drawing settings
        
        // Move x position for next letter with consistent spacing
        // textWidth() calculates how wide this letter is, then add 20px spacing
        x += textWidth(letter.char) + 20;
    }
}

// Function that creates the ransom note styling
function generateRansomNote() {
    // Don't generate if no text entered
    if (currentText.trim() === '') return;
    
    // Clear previous generation
    generatedLetters = [];
    
    // Process each character in the input text
    for (let i = 0; i < currentText.length; i++) {
        let char = currentText[i]; // Get current character
        
        // Create styling data for this letter
        let letterData = {
            char: char, // The actual character
            font: random(availableFonts), // Pick random font from our array
            size: random(24, 48) // Random size between 24px and 48px
            // Removed: color (now always black)
            // Removed: rotation (now always straight)
            // Removed: spacing (now always 20px)
        };
        
        // Add this letter's data to our array
        generatedLetters.push(letterData);
    }
    
    // Trigger P5.js to redraw the canvas with new letters
    redraw();
}

// Handle window resizing to keep canvas responsive
function windowResized() {
    let container = document.querySelector('.canvas-container');
    let containerWidth = container.clientWidth - 40; // Account for padding
    let newWidth = min(containerWidth, 700); // Don't exceed 700px
    let newHeight = max(300, newWidth * 0.57); // Maintain aspect ratio
    
    // Resize the P5.js canvas
    resizeCanvas(newWidth, newHeight);
}

// Event Listeners - Handle user interactions
document.addEventListener('DOMContentLoaded', function() {
    // Get references to HTML elements
    const textInput = document.getElementById('textInput');
    const generateBtn = document.getElementById('generateBtn');
    
    // When Generate button is clicked
    generateBtn.addEventListener('click', function() {
        currentText = textInput.value; // Get text from input field
        generateRansomNote(); // Generate the ransom note
    });
    
    // Allow generating by pressing Enter key
    textInput.addEventListener('keypress', function(e) {
        // Check if Enter was pressed (but not Shift+Enter)
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Prevent default Enter behavior
            currentText = textInput.value; // Get text
            generateRansomNote(); // Generate the ransom note
        }
    });
});
