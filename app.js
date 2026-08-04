        const canvas = document.getElementById('galaxyCanvas');
        const ctx = canvas.getContext('2d');

        let width, height;
        let baseHue = Math.random() * 360; 

        
        const particleCount = 2500; 
        const armsCount = 4;
        const galaxyParticles = [];

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        
        class Star {
            constructor() {
                this.reset();
            }

            reset() {
                
                const armIndex = Math.floor(Math.random() * armsCount);
                const armAngle = (armIndex / armsCount) * Math.PI * 2;
                
                
                const maxRadius = Math.min(width, height) * 0.45;
                this.distance = Math.pow(Math.random(), 2.5) * maxRadius;

                
                const spiralFactor = 1.8; 
                this.angle = armAngle + (this.distance * (spiralFactor / maxRadius) * Math.PI * 2);
                
                
                const scatter = (Math.random() - 0.5) * (30 / (this.distance + 5)); 
                this.angle += scatter;

                this.size = Math.random() * 1.8 + 0.3;
                this.orbitSpeed = (Math.random() * 0.01 + 0.005) * (100 / (this.distance + 30)); // Inner stars rotate faster
                
                // Randomize slightly the internal hue variation per star
                this.hueOffset = Math.random() * 40 - 20;
            }

            update() {
                this.angle += this.orbitSpeed; // Rotate the star around core
            }

            draw() {
                 
                const x = width / 2 + Math.cos(this.angle) * this.distance;
                const y = height / 2 + Math.sin(this.angle) * this.distance;

                
                let starHue = (baseHue + this.hueOffset) % 360;
                let saturation = 100;
                let lightness = Math.min(100, 50 + (25 / (this.distance * 0.05 + 1))); 

                // Core particles blend into glowing white
                if (this.distance < 35) {
                    lightness = 95;
                    saturation = 20;
                }

                
                ctx.beginPath();
                ctx.fillStyle = `hsla(${starHue}, ${saturation}%, ${lightness}%, ${Math.random() * 0.3 + 0.7})`;
                ctx.arc(x, y, this.size, 0, Math.PI * 2);
                ctx.fill();

                // Decorative gas haze layer for larger outer particles
                if (this.size > 1.5 && this.distance > 40) {
                    ctx.beginPath();
                    ctx.fillStyle = `hsla(${starHue}, ${saturation}%, ${lightness}%, 0.03)`;
                    ctx.arc(x, y, this.size * 6, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }

        
        function initGalaxy() {
            for (let i = 0; i < particleCount; i++) {
                galaxyParticles.push(new Star());
            }
        }

        

        function updateColors(deltaTime) {
            // Speed factor: 20 degrees per second roughly transitions to entirely new color blocks every second
            baseHue = (baseHue + deltaTime * 25) % 360;
        }

        let lastTime = 0;
        
        
        function animate(timestamp) {
            if (!lastTime) lastTime = timestamp;
            const deltaTime = (timestamp - lastTime) / 1000;
            lastTime = timestamp;

            
            ctx.fillStyle = 'rgba(2, 2, 8, 0.12)';
            ctx.fillRect(0, 0, width, height);

            
            updateColors(deltaTime);

            
            const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, 80);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
            gradient.addColorStop(0.2, `hsla(${baseHue}, 100%, 70%, 0.3)`);
            gradient.addColorStop(1, 'rgba(2, 2, 8, 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            
            galaxyParticles.forEach(star => {
                star.update();
                star.draw();
            });

            requestAnimationFrame(animate);
        }

        
        initGalaxy();
        requestAnimationFrame(animate);
