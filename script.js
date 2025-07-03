// Network Animation
class NetworkAnimation {
    constructor() {
        this.canvas = document.getElementById('networkCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.numberOfParticles = 80;
        this.connectDistance = 150;
        this.mousePosition = { x: 0, y: 0 };
        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));

        // Create particles
        for (let i = 0; i < this.numberOfParticles; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 2,
                speedY: (Math.random() - 0.5) * 2,
                hue: Math.random() * 30 + 200 // Blue to purple hues
            });
        }

        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mousePosition.x = e.clientX - rect.left;
        this.mousePosition.y = e.clientY - rect.top;
    }

    drawParticle(particle) {
        this.ctx.beginPath();
        const gradient = this.ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size
        );
        gradient.addColorStop(0, `hsla(${particle.hue}, 100%, 70%, 1)`);
        gradient.addColorStop(1, `hsla(${particle.hue}, 100%, 70%, 0)`);
        this.ctx.fillStyle = gradient;
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fill();
    }

    connectParticles() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.connectDistance) {
                    // Check distance to mouse
                    const mouseDistance = Math.sqrt(
                        Math.pow(this.mousePosition.x - this.particles[i].x, 2) +
                        Math.pow(this.mousePosition.y - this.particles[i].y, 2)
                    );

                    const opacity = 1 - (distance / this.connectDistance);
                    const mouseInfluence = mouseDistance < 150 ? 0.5 : 0;
                    
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `hsla(${this.particles[i].hue}, 100%, 70%, ${opacity + mouseInfluence})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    updateParticles() {
        for (let particle of this.particles) {
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.speedY *= -1;

            // Mouse interaction
            const dx = this.mousePosition.x - particle.x;
            const dy = this.mousePosition.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
                const angle = Math.atan2(dy, dx);
                const force = (150 - distance) / 150;
                particle.speedX -= Math.cos(angle) * force * 0.2;
                particle.speedY -= Math.sin(angle) * force * 0.2;
            }

            // Speed limit
            const speed = Math.sqrt(particle.speedX * particle.speedX + particle.speedY * particle.speedY);
            if (speed > 2) {
                particle.speedX *= 0.9;
                particle.speedY *= 0.9;
            }
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.updateParticles();
        this.connectParticles();
        
        for (let particle of this.particles) {
            this.drawParticle(particle);
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize network animation
window.addEventListener('load', () => {
    new NetworkAnimation();
});

// Existing typewriter code
const texts = [
    "Web Developer",
    "System Administrator",
    "AI Enthusiast"
];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingDelay = 200;

function type() {
    const currentText = texts[textIndex];
    const typewriter = document.getElementById('typewriter');

    if (isDeleting) {
        typewriter.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typewriter.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }

    if (!isDeleting && charIndex === currentText.length) {
        isDeleting = true;
        typingDelay = 2000;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        typingDelay = 200;
    }

    setTimeout(type, isDeleting ? 100 : typingDelay);
}

// Generate random floating shapes
const shapes = document.querySelectorAll('.shape');
shapes.forEach(shape => {
    const size = Math.random() * 100 + 50;
    shape.style.width = `${size}px`;
    shape.style.height = `${size}px`;
    shape.style.left = `${Math.random() * 100}%`;
    shape.style.animationDuration = `${Math.random() * 10 + 10}s`;
    shape.style.animationDelay = `${Math.random() * 5}s`;
});

// Animate statistics
const stats = document.querySelectorAll('.stat-number');
const animateStats = () => {
    stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const count = parseInt(stat.innerText);
        const increment = target / 50;

        if (count < target) {
            stat.innerText = Math.ceil(count + increment);
            setTimeout(animateStats, 40);
        } else {
            stat.innerText = target;
        }
    });
};

// Intersection Observer for stats animation
const statsSection = document.querySelector('.stats');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStats();
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

observer.observe(statsSection);

// Start the typewriter effect
window.onload = type;

// Company logos data
const companyLogos = [
    { name: "10Web AI", url: "https://10web.io/wp-content/uploads/2021/07/10web-logo-dark.svg" },
    { name: "Duda", url: "https://www.duda.co/wp-content/uploads/2022/06/duda-logo.svg" },
    { name: "Framer", url: "https://framerusercontent.com/images/tgELERqZ0nObn14bTi418qTbg.png" },
    { name: "Webflow", url: "https://assets-global.website-files.com/5e8801b4ee93ae69d93cd9f4/5e8801b4ee93ae5a5c3cd9f6_webflow-logo.svg" },
    { name: "Wix", url: "https://static.wixstatic.com/media/311dce_81eaf2bdc7f344b88a40b5f2e8750000~mv2.png" },
    { name: "Jasper", url: "https://assets-global.website-files.com/60e5f2de011b86acebc30db7/60e5f2de011b86e6abc31044_Jasper%20Logo.svg" },
    { name: "Copy.ai", url: "https://assets-global.website-files.com/628288c5cd3e8411b90a36a4/629a702e3c6a3d0c4c12f70e_copy-ai-logo.svg" },
    { name: "GitHub", url: "https://github.githubassets.com/images/modules/logos_page/GitHub-Logo.png" }
];

// Function to initialize logo carousel
function initializeLogoCarousel() {
    const track = document.getElementById('logoTrack');
    
    // Create original logos
    companyLogos.forEach(company => {
        const logoDiv = createLogoElement(company);
        track.appendChild(logoDiv);
    });
    
    // Clone logos for infinite scroll
    companyLogos.forEach(company => {
        const logoDiv = createLogoElement(company);
        track.appendChild(logoDiv.cloneNode(true));
    });

    // Start the animation
    track.style.animation = 'scroll 30s linear infinite';
}

// Helper function to create logo element
function createLogoElement(company) {
    const logoDiv = document.createElement('div');
    logoDiv.className = 'logo-item';
    
    const img = document.createElement('img');
    img.src = company.url;
    img.alt = company.name;
    img.loading = 'lazy';
    
    logoDiv.appendChild(img);
    return logoDiv;
}

// Update the DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    initializeTypewriter();
    initializeNetworkAnimation();
    initializeLogoCarousel();
    loadCompaniesData();
    populateToolsCategories();
    populateIndustryTrends();
});

// Load and display AI companies
async function displayCompanies() {
    try {
        const response = await fetch('ai_web_companies.json');
        const data = await response.json();
        const companies = data.ai_web_companies;
        
        const grid = document.getElementById('companiesGrid');
        
        companies.forEach(company => {
            const card = document.createElement('div');
            card.className = 'company-card glass-card';
            
            // Get the lowest price from pricing options
            const lowestPrice = Object.values(company.pricing)[0];
            
            card.innerHTML = `
                <h3>
                    <a href="${company.website}" target="_blank" rel="noopener noreferrer">
                        ${company.name}
                        <i class="fas fa-external-link-alt" style="font-size: 0.7em;"></i>
                    </a>
                </h3>
                <p class="description">${company.description}</p>
                <ul class="features">
                    ${company.ai_features.map(feature => `
                        <li>${feature}</li>
                    `).join('')}
                </ul>
                <div class="pricing">
                    Starting from <strong>${lowestPrice}</strong>
                </div>
                <div class="best-for">
                    Best for: ${company.best_for}
                </div>
            `;
            
            grid.appendChild(card);
        });

    } catch (error) {
        console.error('Error loading AI companies data:', error);
    }
}

// Function to populate AI tools categories
function populateToolsCategories() {
    const categories = [
        {
            name: "Website Builders",
            tools: ["10Web AI", "Duda", "Framer", "Webflow", "Wix"]
        },
        {
            name: "Content Generation",
            tools: ["Copy.ai", "Jasper", "Writesonic", "GPT-3", "Claude"]
        },
        {
            name: "Design Tools",
            tools: ["Midjourney", "DALL-E", "Canva", "Figma", "Adobe Firefly"]
        },
        {
            name: "Development Tools",
            tools: ["GitHub Copilot", "Amazon CodeWhisperer", "Tabnine", "Replit", "CodeGeeX"]
        }
    ];

    const container = document.getElementById('toolsCategories');
    categories.forEach(category => {
        const card = document.createElement('div');
        card.className = 'category-card glass-card';
        card.innerHTML = `
            <h3>${category.name}</h3>
            <ul>
                ${category.tools.map(tool => `<li>${tool}</li>`).join('')}
            </ul>
        `;
        container.appendChild(card);
    });
}

// Function to populate industry trends
function populateIndustryTrends() {
    const trends = [
        {
            title: "No-Code Revolution",
            points: [
                "Visual development platforms",
                "AI-powered automation",
                "Drag-and-drop interfaces"
            ]
        },
        {
            title: "AI Integration",
            points: [
                "Natural language processing",
                "Automated code generation",
                "Smart debugging tools"
            ]
        },
        {
            title: "Future of Web Dev",
            points: [
                "Serverless architecture",
                "Edge computing",
                "Web3 integration"
            ]
        }
    ];

    const container = document.getElementById('industryTrends');
    container.innerHTML = `
        <h3>Industry Trends</h3>
        <div class="trends-grid">
            ${trends.map(trend => `
                <div class="trend-item">
                    <h4>${trend.title}</h4>
                    <ul>
                        ${trend.points.map(point => `<li>${point}</li>`).join('')}
                    </ul>
                </div>
            `).join('')}
        </div>
    `;
} 