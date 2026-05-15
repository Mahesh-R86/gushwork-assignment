/* 
    Mangalam HDPE Pipes - Interactivity Logic
    Features: Sticky Header, Image Carousel, Image Zoom
*/

document.addEventListener('DOMContentLoaded', () => {
    initStickyHeader();
    initCarousel();
    initZoom();
    initFAQ();
    initAppsSlider();
    initProcessTabs();
});

/**
 * Manufacturing Process Tabs Functionality
 */
function initProcessTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    const title = document.getElementById('step-title');
    const desc = document.getElementById('step-desc');
    const bullets = document.getElementById('step-bullets');
    const image = document.getElementById('step-image');

    const processData = {
        raw: {
            title: "High-Grade Raw Material Selection",
            desc: "Vacuum sizing tanks ensure precise outer diameter while internal pressure maintains perfect roundness and wall thickness uniformity.",
            bullets: ["PE100 grade material", "Optimal molecular weight distribution"],
            img: "fisherman.jpg"
        },
        extrusion: {
            title: "Precision Extrusion Process",
            desc: "Advanced single-screw extruders melt and homogenize the HDPE material, pushing it through precision dies to form the pipe shape.",
            bullets: ["Automated temperature control", "High-torque extrusion technology"],
            img: "fisherman.jpg"
        },
        cooling: {
            title: "Multi-Stage Vacuum Cooling",
            desc: "Multiple vacuum tanks and spray cooling chambers rapidly lower the pipe temperature to stabilize its structure and dimensions.",
            bullets: ["Controlled cooling rates", "Dimensional stability"],
            img: "fisherman.jpg"
        },
        sizing: {
            title: "Vacuum Sizing Technology",
            desc: "Specially designed sizing sleeves use vacuum pressure to ensure the pipe maintains its exact outer diameter during the cooling process.",
            bullets: ["High precision sizing", "Surface finish optimization"],
            img: "fisherman.jpg"
        },
        qc: {
            title: "Rigorous Quality Control",
            desc: "In-line ultrasonic testing and manual inspections verify wall thickness, diameter, and surface quality throughout the production run.",
            bullets: ["Ultrasonic thickness measurement", "Pressure testing"],
            img: "fisherman.jpg"
        },
        marking: {
            title: "Automated Pipe Marking",
            desc: "Inkjet or thermal embossing systems apply permanent identification marks, including size, pressure rating, and production date.",
            bullets: ["Permanent traceability", "Clear product identification"],
            img: "fisherman.jpg"
        },
        cutting: {
            title: "Precision Cutting & Chamfering",
            desc: "High-speed planetary cutters or chipless cutters ensure clean, square ends for every pipe length produced.",
            bullets: ["Square cut ends", "Automated length control"],
            img: "fisherman.jpg"
        },
        packaging: {
            title: "Protective Packaging & Storage",
            desc: "Pipes are bundled or coiled according to specifications and stored in UV-protected areas ready for dispatch.",
            bullets: ["Secure bundling", "Safe handling procedures"],
            img: "fisherman.jpg"
        }
    };

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const step = tab.dataset.step;
            const data = processData[step];

            // Update Tabs
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update Content with transition
            const content = document.getElementById('process-content');
            content.style.opacity = '0';
            content.style.transform = 'translateY(10px)';

            setTimeout(() => {
                title.textContent = data.title;
                desc.textContent = data.desc;
                image.src = data.img;

                // Update Bullets
                bullets.innerHTML = '';
                data.bullets.forEach(bullet => {
                    const li = document.createElement('li');
                    li.textContent = bullet;
                    bullets.appendChild(li);
                });

                content.style.opacity = '1';
                content.style.transform = 'translateY(0)';
            }, 300);
        });
    });
}

/**
 * Applications Slider Functionality
 */
function initAppsSlider() {
    const slider = document.getElementById('apps-slider');
    const prevBtn = document.getElementById('app-prev');
    const nextBtn = document.getElementById('app-next');

    if (!slider || !prevBtn || !nextBtn) return;

    const scrollAmount = 430; // Card width + gap

    prevBtn.addEventListener('click', () => {
        slider.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    });

    nextBtn.addEventListener('click', () => {
        slider.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });
}

/**
 * FAQ Accordion Functionality
 */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Optional: Close other items
            faqItems.forEach(i => i.classList.remove('active'));

            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

/**
 * Sticky Header Functionality
 */
function initStickyHeader() {
    const stickyHeader = document.getElementById('sticky-header');
    const mainHeader = document.getElementById('main-header');

    // Threshold: when the bottom of the main header leaves the viewport
    const threshold = mainHeader.offsetTop + mainHeader.offsetHeight;

    window.addEventListener('scroll', () => {
        if (window.scrollY > threshold) {
            stickyHeader.classList.add('visible');
        } else {
            stickyHeader.classList.remove('visible');
        }
    }, { passive: true });
}

/**
 * Image Carousel Functionality
 */
function initCarousel() {
    const mainImg = document.getElementById('main-carousel-image');
    const thumbnails = document.querySelectorAll('.thumb');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    let currentIndex = 0;
    const images = Array.from(thumbnails).map(thumb => thumb.dataset.src);

    // Apply thumbnails background images
    thumbnails.forEach((thumb, index) => {
        thumb.style.backgroundImage = `url(${thumb.dataset.src})`;

        thumb.addEventListener('click', () => {
            updateCarousel(index);
        });
    });

    function updateCarousel(index) {
        // Range check
        if (index < 0) index = images.length - 1;
        if (index >= images.length) index = 0;

        currentIndex = index;

        // Update Main Image
        mainImg.style.opacity = '0';
        setTimeout(() => {
            mainImg.src = images[currentIndex];
            mainImg.style.opacity = '1';
            // Re-initialize zoom background for new image
            updateZoomBackground();
        }, 200);

        // Update Thumbnails
        thumbnails.forEach(t => t.classList.remove('active'));
        thumbnails[currentIndex].classList.add('active');
    }

    prevBtn.addEventListener('click', () => updateCarousel(currentIndex - 1));
    nextBtn.addEventListener('click', () => updateCarousel(currentIndex + 1));
}

/**
 * Image Zoom Functionality (Side-by-side Magnifier)
 */
function initZoom() {
    const container = document.getElementById('zoom-container');
    const img = document.getElementById('main-carousel-image');
    const lens = document.getElementById('zoom-lens');
    const result = document.getElementById('zoom-result');

    // Only enable zoom if not on touch device (optional)
    if (window.matchMedia("(pointer: coarse)").matches) return;

    container.addEventListener('mouseenter', showZoom);
    container.addEventListener('mouseleave', hideZoom);
    container.addEventListener('mousemove', moveLens);

    function showZoom() {
        // Don't show if window is too small (CSS handles this but JS extra check)
        if (window.innerWidth < 992) return;

        lens.style.display = 'block';
        result.style.display = 'block';
        updateZoomBackground();
    }

    function hideZoom() {
        lens.style.display = 'none';
        result.style.display = 'none';
    }

    function moveLens(e) {
        e.preventDefault();

        const rect = container.getBoundingClientRect();

        // Get mouse position relative to image container
        let x = e.pageX - rect.left - window.pageXOffset;
        let y = e.pageY - rect.top - window.pageYOffset;

        // Calculate lens position
        let lensX = x - (lens.offsetWidth / 2);
        let lensY = y - (lens.offsetHeight / 2);

        // Prevent lens from going out of bounds
        if (lensX < 0) lensX = 0;
        if (lensX > container.offsetWidth - lens.offsetWidth) lensX = container.offsetWidth - lens.offsetWidth;
        if (lensY < 0) lensY = 0;
        if (lensY > container.offsetHeight - lens.offsetHeight) lensY = container.offsetHeight - lens.offsetHeight;

        lens.style.left = lensX + 'px';
        lens.style.top = lensY + 'px';

        // Calculate background position for result
        // Ratio between result and lens
        const cx = result.offsetWidth / lens.offsetWidth;
        const cy = result.offsetHeight / lens.offsetHeight;

        result.style.backgroundPosition = `-${lensX * cx}px -${lensY * cy}px`;
        result.style.backgroundSize = `${container.offsetWidth * cx}px ${container.offsetHeight * cy}px`;
    }

    window.updateZoomBackground = function () {
        result.style.backgroundImage = `url(${img.src})`;
    };
}
