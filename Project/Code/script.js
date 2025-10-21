// Three.js 3D Background Animation
function initThreeJS() {
    const container = document.getElementById('canvas-container');
    let mouseX = 0;
    let mouseY = 0;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

// Projects slider controls
document.addEventListener('DOMContentLoaded', function () {
    const slider = document.querySelector('.projects-slider');
    if (!slider) return;
    const track = slider.querySelector('.projects-grid');
    const prevBtn = slider.querySelector('.proj-nav.prev');
    const nextBtn = slider.querySelector('.proj-nav.next');
    if (!track || !prevBtn || !nextBtn) return;

    function getScrollAmount() {
        const firstCard = track.querySelector('.project-card');
        if (firstCard) {
            const style = window.getComputedStyle(track);
            const gap = parseInt(style.columnGap || style.gap || '30', 10) || 30;
            return firstCard.getBoundingClientRect().width + gap;
        }
        return 320; // fallback
    }

    prevBtn.addEventListener('click', () => {
        track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', () => {
        track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    });
});

    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;

    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 20;
        colorArray[i] = Math.random();
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    // Particle material
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
    });

    // Create particle system
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Create wireframe cubes
    const group = new THREE.Group();
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshBasicMaterial({
        color: 0x64ffda,
        wireframe: true,
        transparent: true,
        opacity: 0.5
    });

    // Add multiple cubes
    for (let i = 0; i < 10; i++) {
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.x = (Math.random() - 0.5) * 15;
        cube.position.y = (Math.random() - 0.5) * 15;
        cube.position.z = (Math.random() - 0.5) * 15;
        cube.rotation.x = Math.random() * Math.PI;
        cube.rotation.y = Math.random() * Math.PI;
        cube.scale.multiplyScalar(Math.random() + 0.5);
        group.add(cube);
    }

    scene.add(group);

    camera.position.z = 5;

    // Mouse move event
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        // Rotate particles and cubes
        particlesMesh.rotation.x += 0.0005;
        particlesMesh.rotation.y += 0.0005;

        group.rotation.x += 0.003;
        group.rotation.y += 0.002;

        // Move camera based on mouse position
        camera.position.x += (mouseX * 2 - camera.position.x) * 0.02;
        camera.position.y += (mouseY * 2 - camera.position.y) * 0.02;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Initialize 3D background
initThreeJS();

// Sticky Header
window.addEventListener('scroll', function () {
    const header = document.getElementById('header');
    const scrollTop = document.getElementById('scrollTop');

    if (window.scrollY > 50) {
        header.classList.add('sticky');
    } else {
        header.classList.remove('sticky');
    }

    if (window.scrollY > 500) {
        scrollTop.classList.add('active');
    } else {
        scrollTop.classList.remove('active');
    }
});
let slideIndex = 0;
showSlides(slideIndex);

function changeSlide(n) {
    showSlides(slideIndex += n);
}

function showSlides(n) {
    const slides = document.getElementsByClassName("slide");
    if (n >= slides.length) { slideIndex = 0 }
    if (n < 0) { slideIndex = slides.length - 1 }

    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    slides[slideIndex].style.display = "block";
}

// Auto slide every 3 seconds
setInterval(() => { changeSlide(1); }, 3000);


// Mobile Menu Toggle with accessibility and no-scroll
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');
const navAnchors = document.querySelectorAll('.nav-links a');

if (menuBtn && navLinks) {
    menuBtn.setAttribute('aria-label', 'Toggle navigation menu');
    menuBtn.setAttribute('aria-expanded', 'false');

    menuBtn.addEventListener('click', function () {
        const isOpen = navLinks.classList.toggle('active');
        menuBtn.setAttribute('aria-expanded', String(isOpen));
        document.body.classList.toggle('no-scroll', isOpen);
    });

    // Helper to close the menu (used by multiple handlers)
    function closeMenu() {
        navLinks.classList.remove('active');
        menuBtn.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('no-scroll');
    }

    // Close menu on any nav link click
    // For non-hash links (e.g., gallery.html), force navigation after a short delay to avoid mobile quirks
    navAnchors.forEach(a => {
        a.addEventListener('click', (e) => {
            // Avoid outside-click listener closing before we process
            e.stopPropagation();
            const href = a.getAttribute('href') || '';
            closeMenu();
            if (href && !href.startsWith('#')) {
                // Ensure navigation happens on mobile browsers that might cancel default
                e.preventDefault();
                setTimeout(() => { window.location.assign(href); }, 50);
            }
        });
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
        const isOpen = navLinks.classList.contains('active');
        if (!isOpen) return;
        const clickInsideMenu = navLinks.contains(e.target);
        const clickOnButton = menuBtn.contains(e.target);
        if (!clickInsideMenu && !clickOnButton) {
            navLinks.classList.remove('active');
            menuBtn.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('no-scroll');
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            menuBtn.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('no-scroll');
        }
    });
}

// Smooth Scrolling (only for valid in-page targets)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (!targetId || targetId === '#') return; // let default for '#'

        const targetElement = document.querySelector(targetId);
        if (!targetElement) return; // not on this page; let default behavior

        e.preventDefault();
        window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
        });

        // Close mobile menu if open
        if (navLinks) navLinks.classList.remove('active');
        document.body.classList.remove('no-scroll');
    });
});

// Scroll to Top
document.getElementById('scrollTop').addEventListener('click', function () {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Teams mobile slider controls
(function(){
    const teamsContainer = document.querySelector('#teams .teams-container');
    const prevBtn = document.querySelector('#teams .team-nav.prev');
    const nextBtn = document.querySelector('#teams .team-nav.next');
    if (!teamsContainer || !prevBtn || !nextBtn) return;

    function getScrollAmount(){
        // Scroll by one card width or container width minus padding
        const card = teamsContainer.querySelector('.team-card');
        const cardWidth = card ? card.getBoundingClientRect().width : 300;
        const containerWidth = teamsContainer.getBoundingClientRect().width;
        // Choose the larger to advance meaningfully on small screens
        return Math.max(cardWidth, containerWidth * 0.9);
    }

    prevBtn.addEventListener('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        teamsContainer.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        teamsContainer.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    });
})();

// Event Items Animation on Scroll
const eventItems = document.querySelectorAll('.event-item');

function checkScroll() {
    eventItems.forEach(item => {
        const position = item.getBoundingClientRect();

        // If the item is visible in the viewport
        if (position.top < window.innerHeight - 100) {
            item.classList.add('visible');
        }
    });
}

// Initial check and then on scroll
checkScroll();
window.addEventListener('scroll', checkScroll);

// Team Members Functionality
// Show selected team members
function showTeamMembers(teamId) {
    // Hide all team members sections
    let t_members = document.querySelectorAll('.team-members');
    for (member of t_members) {
        member.classList.remove('active');
    }

    // Hide all team cards
    let t_cards = document.querySelectorAll('.team-card');
    for (card of t_cards) {
        card.style.display = 'none';
        console.dir(card);
    }

    // Show the selected team members section
    let ele = teamId + '-members'
    let teamSection = document.querySelector(`#${ele}`);
    if (teamSection) {
        teamSection.classList.add('active');
        console.dir(teamSection);
    }
}
// Event delegation for view and back buttons
let member_btns = document.querySelectorAll(".view-members-btn");
for (member_btn of member_btns) {
    member_btn.addEventListener('click', (event) => {
        let team = event.target.getAttribute('data-team');
        showTeamMembers(team);
        console.log(team);
    })
}
// Show all teams
function showAllTeams() {
    let t_members = document.querySelectorAll('.team-members');
    for (member of t_members) {
        member.classList.remove('active');
    }
    let t_cards = document.querySelectorAll('.team-card');
    for (card of t_cards) {
        // Restore flex display so the card layout matches CSS (.team-card { display:flex })
        card.style.display = 'flex';
        console.dir(card);
    }
}
let back_btns = document.querySelectorAll(".back-btn");
for (b_btn of back_btns) {
    b_btn.addEventListener('click', showAllTeams);
}

(function () {
    emailjs.init("6xdZjUsTe2qxcBeS3");
})();

let generatedOTP = null;

// Step 1: Generate OTP & Send Email (only if contact form exists)
const sendOtpBtn = document.getElementById("send-otp-btn");
if (sendOtpBtn) sendOtpBtn.addEventListener("click", function () {
    const emailInput = document.getElementById("email").value.trim();

    // Allow only @nitm.ac.in emails
    if (!emailInput.endsWith("@nitm.ac.in")) {
        alert("Please use your official college email (@nitm.ac.in) to continue.");
        return; // Stop execution, don’t send OTP
    }

    if (!emailInput) {
        alert("Enter a valid email first.");
        return;
    }

    generatedOTP = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

    // Send OTP email using EmailJS template
    emailjs.send("service_21w1kho", "template_l6ofpds", {
        to_email: emailInput,
        otp: generatedOTP
    }).then(() => {
        alert("OTP sent to your email!");
        document.getElementById("otp-section").style.display = "block";
    }, (err) => {
        console.error("Failed to send OTP", err);
        alert("Error sending OTP. Try again.");
    });
});

// Step 2: Handle Form Submit (only if contact form exists)
const contactForm = document.getElementById("contact-form");
if (contactForm) contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const userOTP = document.getElementById("otp").value;

    if (parseInt(userOTP) === generatedOTP) {
        emailjs.sendForm("service_21w1kho", "template_x3503ao", "#contact-form", { from_name: document.getElementById("name").value, from_subject: document.getElementById("subject").value, from_email: document.getElementById("email").value, message: document.getElementById("message").value })
            .then(() => {
                alert("Message sent successfully!");
                this.reset();
                document.getElementById("otp-section").style.display = "none";
                document.getElementById("submit-btn").disabled = true;
            }, (error) => {
                console.error("FAILED...", error);
                alert("Failed to send message.");
            });
    } else {
        alert("Invalid OTP. Try again.");
    }
});

// Enable submit button only after OTP entered (if inputs exist)
const otpInput = document.getElementById("otp");
const submitBtn = document.getElementById("submit-btn");
if (otpInput && submitBtn) {
    otpInput.addEventListener("input", function () {
        submitBtn.disabled = this.value.length < 6;
    });
}
// Mini Maze Runner Game (appears at bottom of the site)
window.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('mazeCanvas');
    const resetBtn = document.getElementById('mazeReset');
    const statusEl = document.getElementById('mazeStatus');
    if (!canvas || !canvas.getContext) return; // Only run if section exists

    const ctx = canvas.getContext('2d');
    const size = 15; // Use an odd grid size for proper maze carving (walls between cells)
    const cell = canvas.width / size; // 360/15 = 24px per cell

    // Maze data (0: path, 1: wall). We'll generate it dynamically.
    let maze = [];
    const start = { x: 1, y: 1 };
    const goal = { x: size - 2, y: size - 2 };
    let player = { x: start.x, y: start.y };
    let won = false;

    function drawCell(x, y, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x * cell, y * cell, cell, cell);
    }

    // Draw a simple robot icon centered at (px, py)
    function drawRobot(px, py) {
        const s = cell; // base size reference
        const bodyW = s * 0.45;
        const bodyH = s * 0.38;
        const headW = s * 0.28;
        const headH = s * 0.2;

        // Glow shadow
        ctx.shadowColor = 'rgba(100,255,218,0.25)';
        ctx.shadowBlur = 8;

        // Body
        ctx.fillStyle = '#64ffda';
        ctx.strokeStyle = 'rgba(10,25,47,0.9)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(px - bodyW / 2, py - bodyH / 2, bodyW, bodyH, 4);
        ctx.fill();
        ctx.stroke();

        // Head
        ctx.beginPath();
        ctx.roundRect(px - headW / 2, py - bodyH / 2 - headH - 2, headW, headH, 3);
        ctx.fill();
        ctx.stroke();

        // Eyes
        ctx.fillStyle = '#0a192f';
        const eyeR = s * 0.03;
        ctx.beginPath();
        ctx.arc(px - headW * 0.2, py - bodyH / 2 - headH / 2 - 2, eyeR, 0, Math.PI * 2);
        ctx.arc(px + headW * 0.2, py - bodyH / 2 - headH / 2 - 2, eyeR, 0, Math.PI * 2);
        ctx.fill();

        // Antenna
        ctx.strokeStyle = '#64ffda';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(px, py - bodyH / 2 - headH - 2);
        ctx.lineTo(px, py - bodyH / 2 - headH - 2 - s * 0.12);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(px, py - bodyH / 2 - headH - 2 - s * 0.12, s * 0.03, 0, Math.PI * 2);
        ctx.fillStyle = '#64ffda';
        ctx.fill();

        // Arms
        ctx.fillStyle = '#64ffda';
        ctx.beginPath();
        ctx.roundRect(px - bodyW / 2 - s * 0.12, py - bodyH * 0.15, s * 0.12, s * 0.12, 3);
        ctx.roundRect(px + bodyW / 2, py - bodyH * 0.15, s * 0.12, s * 0.12, 3);
        ctx.fill();

        // Feet
        ctx.beginPath();
        ctx.roundRect(px - bodyW * 0.35, py + bodyH / 2 - s * 0.05, s * 0.16, s * 0.1, 3);
        ctx.roundRect(px + bodyW * 0.19, py + bodyH / 2 - s * 0.05, s * 0.16, s * 0.1, 3);
        ctx.fill();

        // Reset shadow
        ctx.shadowBlur = 0;
    }

    function drawGrid() {
        // Background
        ctx.fillStyle = '#0b1a33';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Walls
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                if (maze[y][x] === 1) {
                    // Subtle wall effect
                    drawCell(x, y, '#0e2344');
                    ctx.strokeStyle = 'rgba(100, 255, 218, 0.15)';
                    ctx.strokeRect(x * cell + 0.5, y * cell + 0.5, cell - 1, cell - 1);
                }
            }
        }

        // Goal (glow)
        const gx = goal.x * cell + cell / 2;
        const gy = goal.y * cell + cell / 2;
        const grad = ctx.createRadialGradient(gx, gy, 4, gx, gy, 16);
        grad.addColorStop(0, 'rgba(100,255,218,0.9)');
        grad.addColorStop(1, 'rgba(100,255,218,0.05)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(gx, gy, cell * 0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();

        // Player (Robot icon)
        const px = player.x * cell + cell / 2;
        const py = player.y * cell + cell / 2;
        drawRobot(px, py);
    }

    function atGoal() {
        return player.x === goal.x && player.y === goal.y;
    }

    function setStatus(msg) {
        if (statusEl) statusEl.textContent = msg;
    }

    function tryMove(dx, dy) {
        if (won) return;
        const nx = player.x + dx;
        const ny = player.y + dy;
        if (maze[ny] && maze[ny][nx] === 0) {
            player.x = nx;
            player.y = ny;
            drawGrid();
            if (atGoal()) {
                won = true;
                setStatus('Goal reached! Great job!');
            }
        }
    }

    // Randomized DFS Maze Generator
    function generateMaze(n) {
        // Initialize with walls
        const grid = Array.from({ length: n }, () => Array(n).fill(1));

        // Carve starting from (1,1)
        function carve(x, y) {
            grid[y][x] = 0; // current cell becomes a passage
            const dirs = [
                [0, -2], // up
                [0, 2],  // down
                [-2, 0], // left
                [2, 0],  // right
            ];
            // Shuffle directions
            for (let i = dirs.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [dirs[i], dirs[j]] = [dirs[j], dirs[i]];
            }
            for (const [dx, dy] of dirs) {
                const nx = x + dx;
                const ny = y + dy;
                if (ny > 0 && ny < n - 1 && nx > 0 && nx < n - 1 && grid[ny][nx] === 1) {
                    // knock down the wall between (x,y) and (nx,ny)
                    grid[y + dy / 2][x + dx / 2] = 0;
                    carve(nx, ny);
                }
            }
        }

        // Start carving from start cell (must be odd indices)
        carve(1, 1);

        // Ensure start and goal are open
        grid[start.y][start.x] = 0;
        grid[goal.y][goal.x] = 0;

        // Optionally open at least one neighbor near goal to avoid isolation
        const near = [
            [goal.x - 1, goal.y],
            [goal.x, goal.y - 1],
        ];
        near.forEach(([x, y]) => { if (grid[y][x] === 1) grid[y][x] = 0; });

        return grid;
    }

    function handleKey(e) {
        switch (e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                e.preventDefault();
                tryMove(0, -1); break;
            case 'ArrowDown':
            case 's':
            case 'S':
                e.preventDefault();
                tryMove(0, 1); break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                e.preventDefault();
                tryMove(-1, 0); break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                e.preventDefault();
                tryMove(1, 0); break;
            default: break;
        }
    }

    function resetGame() {
        // Regenerate a fresh maze each reset
        maze = generateMaze(size);
        player = { x: start.x, y: start.y };
        won = false;
        setStatus('');
        drawGrid();
    }

    // Initial generation and draw
    maze = generateMaze(size);
    drawGrid();

    // Focus on click to ensure arrow keys work
    canvas.addEventListener('click', () => canvas.focus());
    canvas.addEventListener('keydown', handleKey);
    if (resetBtn) resetBtn.addEventListener('click', resetGame);

    // On-screen button controls (mobile-friendly)
    const btnUp = document.getElementById('mazeUp');
    const btnDown = document.getElementById('mazeDown');
    const btnLeft = document.getElementById('mazeLeft');
    const btnRight = document.getElementById('mazeRight');
    if (btnUp) btnUp.addEventListener('click', () => tryMove(0, -1));
    if (btnDown) btnDown.addEventListener('click', () => tryMove(0, 1));
    if (btnLeft) btnLeft.addEventListener('click', () => tryMove(-1, 0));
    if (btnRight) btnRight.addEventListener('click', () => tryMove(1, 0));

    // Swipe gesture controls for touch devices
    let touchStartX = 0, touchStartY = 0;
    let touchEndX = 0, touchEndY = 0;
    const threshold = 20; // minimal swipe distance in px

    function handleSwipe() {
        const dx = touchEndX - touchStartX;
        const dy = touchEndY - touchStartY;
        if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) return; // ignore short swipes
        if (Math.abs(dx) > Math.abs(dy)) {
            // horizontal swipe
            if (dx > 0) tryMove(1, 0); else tryMove(-1, 0);
        } else {
            // vertical swipe
            if (dy > 0) tryMove(0, 1); else tryMove(0, -1);
        }
    }

    canvas.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches.length > 0) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }
        // Prevent scrolling while interacting with the canvas
        e.preventDefault();
    }, { passive: false });

    canvas.addEventListener('touchend', (e) => {
        if (e.changedTouches && e.changedTouches.length > 0) {
            touchEndX = e.changedTouches[0].clientX;
            touchEndY = e.changedTouches[0].clientY;
            handleSwipe();
        }
        e.preventDefault();
    }, { passive: false });
});

