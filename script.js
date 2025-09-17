// Three.js 3D Background Animation
function initThreeJS() {
    const container = document.getElementById('canvas-container');
    let mouseX = 0;
    let mouseY = 0;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

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


// Mobile Menu Toggle
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

menuBtn.addEventListener('click', function () {
    navLinks.classList.toggle('active');
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            navLinks.classList.remove('active');
        }
    });
});

// Scroll to Top
document.getElementById('scrollTop').addEventListener('click', function () {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

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
    let t_members=document.querySelectorAll('.team-members');
    for(member of t_members){
        member.classList.remove('active');
    }
    
    // Hide all team cards
    let t_cards=document.querySelectorAll('.team-card');
    for(card of t_cards){
        card.style.display ='none';
        console.dir(card);
    }
    
    // Show the selected team members section
    let ele=teamId + '-members'
    let teamSection = document.querySelector(`#${ele}`);
    if (teamSection) {
        teamSection.classList.add('active');
        console.dir(teamSection);
    }
}
// Event delegation for view and back buttons
let member_btns=document.querySelectorAll(".view-members-btn");
for(member_btn of member_btns){
    member_btn.addEventListener('click',(event)=>{
        let team=event.target.getAttribute('data-team');
        showTeamMembers(team);
        console.log(team);
    })
}
// Show all teams
function showAllTeams(){
    let t_members=document.querySelectorAll('.team-members');
    for(member of t_members){
        member.classList.remove('active');
    }
    let t_cards=document.querySelectorAll('.team-card');
    for(card of t_cards){
        card.style.display ='block';
        console.dir(card);
    }
}
let back_btns=document.querySelectorAll(".back-btn");
for(b_btn of back_btns){
    b_btn.addEventListener('click',showAllTeams);
}

