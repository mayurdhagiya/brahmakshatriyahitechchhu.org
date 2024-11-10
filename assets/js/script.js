const header = document.querySelector(".header"),
    sections = document.querySelectorAll("section[id]"),
    skillsContainer = document.querySelector(".skills__items"),
    eduContainer = document.querySelector("#edu.timeline__items"),
    expContainer = document.querySelector("#exp.timeline__items"),
    services = document.querySelectorAll(".service"),
    formInputs = document.querySelectorAll(".form__input"),
    scrollUpBtn = document.querySelector(".scroll-up"),
    colorThemeBtn = document.querySelector(".color-theme"),
    mobileLinksContainer = document.querySelector(".header__links-mobile"),
    mobileLinks = document.querySelectorAll(".header__link-mobile a"),
    contactForm = document.getElementById("contact-form"),
    statusBox = document.querySelector(".form__status-box p");

/* ============== Header ============== */
function changeHeaderBg() {
    const scrollY = window.scrollY;
    header.style.transition = "all var(--default-duration) ease";
    if (scrollY > 50) {
        header.style.background = "var(--body-bg)";
        header.style.height = "calc(var(--header-height) - 15px)";
        header.style.boxShadow = "0 0 5px var(--black-100-alpha-20)";
    } else {
        header.style.background = "transparent";
        header.style.height = "var(--header-height)";
        header.style.boxShadow = "";
    }
}

let lastScrollY;
function hideMobNavbar() {
    const scrollY = window.scrollY;
    if (scrollY > lastScrollY) {
        mobileLinksContainer.classList.add("hide");
    } else if (scrollY < lastScrollY) {
        mobileLinksContainer.classList.remove("hide");
    }
    lastScrollY = scrollY;
}
/* ============== Skills Section ============== */
// Skills & Tools
let skills = [
    {
        skillTitle: "Frontend Developer",
        skillText: "More than 3 years",
        icon: "ri-code-s-slash-fill",
        tools: [
            { toolName: "HTML", toolValue: 90 },
            { toolName: "CSS", toolValue: 90 },
            { toolName: "JavaScript", toolValue: 75 },
            { toolName: "React", toolValue: 70 },
        ],
    },
    {
        skillTitle: "Backend Developer",
        skillText: "More than 2 years",
        icon: "ri-server-fill",
        tools: [
            { toolName: "PHP", toolValue: 65 },
            { toolName: "NodeJS", toolValue: 75 },
            { toolName: "Express", toolValue: 70 },
        ],
    },
    {
        skillTitle: "UI\\UX Design",
        skillText: "More than 2 years",
        icon: "ri-pen-nib-fill",
        tools: [
            { toolName: "Figma", toolValue: 80 },
            { toolName: "Adobe XD", toolValue: 75 },
        ],
    },
    {
        skillTitle: "Data Science",
        skillText: "More than 3 years",
        icon: "ri-bubble-chart-fill",
        tools: [
            { toolName: "Python", toolValue: 80 },
            { toolName: "Numpy", toolValue: 70 },
            { toolName: "Pandas", toolValue: 75 },
            { toolName: "PyTorch", toolValue: 65 },
        ],
    },
];

function skillComponent({ skillTitle, skillText, icon, tools }) {
    return `
    <div class="skill accordion collapsed">
        <div class="skill__header accordion__header d-flex align-center justify-between">
            <div class="group d-flex align-center c-gap-1">
                <i class="${icon} subtitle-lg"></i>
                <div class="group">
                    <p class="skill__title body-md">${skillTitle}</p>
                    <p class="skill__text body-es">${skillText}</p>
                </div>
            </div>
            <i class="ri-arrow-down-s-line subtitle-es arrow"></i>
        </div>
        <div class="skill__body accordion__content">
        ${tools
            .map((tool) => {
                const { toolName, toolValue } = tool;
                return `<div class="skill__tool">
                        <div class="group d-flex justify-between">
                            <p class="skill__tool-name body-sm">${toolName}</p>
                            <p class="skill__tool-value body-es">${toolValue}%</p>
                        </div>
                        <div class="skill__tool-progressbar">
                            <span class="skill__tool-progressbarvalue" style="width: ${toolValue}%"></span>
                        </div>
                    </div>`;
            })
            .join("")}
            
        </div>
    </div>`;
}

function renderSkills() {
    skills.map((skill) => {
        skillsContainer.innerHTML += skillComponent(skill);
    });
    const accordions = document.querySelectorAll(".accordion");

    const toggleAccordion = (accordion) => {
        const accordionContent = accordion.querySelector(".accordion__content");
        let accordionContentHeight = accordionContent.scrollHeight;
        if (accordion.classList.contains("extended")) {
            accordion.classList.replace("extended", "collapsed");
            accordionContent.style.height = "0px";
        } else if (accordion.classList.contains("collapsed")) {
            accordion.classList.replace("collapsed", "extended");
            accordionContent.style.height = `${accordionContentHeight}px`;
        }
    };

    accordions.forEach((accordion) => {
        const accordionBtn = accordion.querySelector(".accordion__header");
        accordionBtn.addEventListener("click", () => {
            const extendedAccordion = document.querySelector(".accordion.extended");
            toggleAccordion(accordion);
            if (extendedAccordion && !extendedAccordion.classList.contains("collapsed")) {
                toggleAccordion(extendedAccordion);
            }
        });
    });
}
// Education & Experience
let educations = [
    {
        type: "education",
        title: "Data Science & Artificial Intelligence",
        position: "Jordan, University",
        date: {
            startDate: "Oct 10, 2014",
            endDate: "2018",
        },
        desc: "Lorem Ipsum Commodo Dolor Sit Amet, Consectetur Adipisicing Elit, Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua. Ut Enim Ad Minim Veniam",
    },
    {
        type: "education",
        title: "Web Development",
        position: "Self tut",
        date: {
            startDate: "Jun 15, 2017",
            endDate: "present",
        },
        desc: "Lorem Ipsum Commodo Dolor Sit Amet, Consectetur Adipisicing Elit, Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua. Ut Enim Ad Minim Veniam",
    },
    {
        type: "education",
        title: "Web Design",
        position: "Self tut",
        date: {
            startDate: "Dec 10, 2019",
            endDate: "present",
        },
        desc: "Lorem Ipsum Commodo Dolor Sit Amet, Consectetur Adipisicing Elit, Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua. Ut Enim Ad Minim Veniam",
    },
    {
        type: "experience",
        title: "Cloud Computing",
        position: "Jordan, Microsoft",
        date: {
            startDate: "Mar 10, 2018",
            endDate: "2021",
        },
        desc: "Lorem Ipsum Commodo Dolor Sit Amet, Consectetur Adipisicing Elit, Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua. Ut Enim Ad Minim Veniam",
    },
    {
        type: "experience",
        title: "Freelancing Web Development",
        position: "Jordan, Home",
        date: {
            startDate: "Mar 15, 2021 ",
            endDate: "present",
        },
        desc: "Lorem Ipsum Commodo Dolor Sit Amet, Consectetur Adipisicing Elit, Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua. Ut Enim Ad Minim Veniam",
    },
];

function timelineComponent({ title, position, date, desc }) {
    return `
    <div class="timeline__item">
        <div class="timeline__marker"></div>
        <div class="timeline__content d-flex f-column">
            <p class="timeline__date body-es">${date.startDate} - ${date.endDate}</p>
            <p class="timeline__major body-md">
                ${title}
                <span class="body-es">- ${position}</span>
            </p>
            <p class="timeline__desc body-es">
                ${desc}
            </p>
        </div>
    </div>`;
}

function renderEducations() {
    educations.map((edu) => {
        if (edu.type === "education") {
            eduContainer.innerHTML += timelineComponent(edu);
        } else if (edu.type === "experience") {
            expContainer.innerHTML += timelineComponent(edu);
        }
    });
    sr.reveal(".timeline__item", { interval: 50, distance: "40px" });
}

/* ============== Services Section ============== */
services.forEach((service) => {
    const moreBtn = service.querySelector(".service__more"),
        bottomSheet = service.querySelector(".service__btmsheet"),
        dragIcon = service.querySelector(".service__btmsheet-dragicon");

    let isDragging = false,
        startY,
        startTranslateY;

    function showBottomSheet() {
        bottomSheet.style.transition = "transform 300ms ease";
        updateTranslateY(-bottomSheet.offsetHeight);
    }

    function hideBottomSheet() {
        updateTranslateY(0);
    }

    function updateTranslateY(value) {
        bottomSheet.style.transform = `translateY(${value}px)`;
    }

    function dragStart(e) {
        isDragging = true;
        startY = e.pageY || e.touches?.[0].pageY;
        startTranslateY = parseFloat(getComputedStyle(bottomSheet).transform.split(", ")[5]);
    }

    function dragging(e) {
        if (!isDragging) return;
        const deltaY = (e.pageY || e.touches?.[0].pageY) - startY;
        const newTranslateY = Math.max(-bottomSheet.offsetHeight, startTranslateY + deltaY);

        if (navigator.maxTouchPoints > 0) {
            document.body.style.overflow = "hidden";
        }

        bottomSheet.style.transition = "";
        updateTranslateY(newTranslateY);
    }

    function dragStop() {
        if (!isDragging) return;
        isDragging = false;
        let endTranslateY = -parseFloat(getComputedStyle(bottomSheet).transform.split(", ")[5]);

        if (navigator.maxTouchPoints > 0) {
            document.body.style.overflow = "visible";
        }

        bottomSheet.style.transition = "transform 300ms ease";
        endTranslateY >= bottomSheet.offsetHeight * 0.75
            ? updateTranslateY(-bottomSheet.offsetHeight)
            : endTranslateY <= bottomSheet.offsetHeight * 0.25
            ? hideBottomSheet()
            : updateTranslateY(-bottomSheet.offsetHeight / 2);
    }

    moreBtn.addEventListener("click", showBottomSheet);
    dragIcon.addEventListener("mousedown", dragStart);
    service.addEventListener("mousemove", dragging);
    document.addEventListener("mouseup", dragStop);

    dragIcon.addEventListener("touchstart", dragStart);
    service.addEventListener("touchmove", dragging);
    document.addEventListener("touchend", dragStop);
});

/* ============== Testimonials Section ============== */
const testimonialsSwiper = new Swiper(".testimonials__slider", {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    allowTouchMove: true,
    navigation: {
        nextEl: ".testimonials__btn-right",
        prevEl: ".testimonials__btn-left",
    },
    pagination: {
        el: ".testimonials__slider-pagination",
        clickable: true,
    },
    breakpoints: {
        768: {
            allowTouchMove: false,
        },
    },
});

/* ============== Contact Section ============== */
formInputs.forEach((input) => {
    input.addEventListener("focus", () => {
        let targetLabel = document.querySelector(`.form__label[for=${input.id}]`);
        targetLabel.classList.add("focus");
    });
    input.addEventListener("blur", () => {
        let targetLabel = document.querySelector(`.form__label[for=${input.id}]`);
        if (input.value.length === 0) targetLabel.classList.remove("focus");
    });
});

/* ============== Active Scroll ============== */
function activeScroll() {
    const scrollY = window.scrollY;
    sections.forEach((section) => {
        const sectionTop = section.offsetTop - 16,
            sectionHeight = section.offsetHeight,
            link = document.querySelector(`.header__link a[href='#${section.id}'`);
        if (scrollY >= sectionTop && scrollY <= sectionHeight + sectionTop) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
    mobileLinks.forEach((link) => {
        let hashLink = /#([^#]*)/g.exec(link.href)[1];
        const section = document.querySelector(`section[id='${hashLink}']`),
            sectionTop = section.offsetTop - 16,
            sectionHeight = section.offsetHeight;
        if (scrollY >= sectionTop && scrollY <= sectionHeight + sectionTop) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
}
/* ============== ScrollUp Button ============== */
function showScrollUpBtn() {
    if (window.scrollY > 300) {
        scrollUpBtn.classList.add("show");
    } else {
        scrollUpBtn.classList.remove("show");
    }
}

scrollUpBtn.addEventListener("click", () => window.scrollTo({ behavior: "smooth", top: 0, left: 0 }));

/* ============== Dark / Light Theme ============== */

colorThemeBtn.addEventListener("click", () => {
    theme.toggleTheme();
});

function changeThemeBtnIcon() {
    if (theme.currentTheme === "dark") {
        colorThemeBtn.querySelector("i").classList.replace("ri-moon-fill", "ri-sun-fill");
    } else if (theme.currentTheme === "light") {
        colorThemeBtn.querySelector("i").classList.replace("ri-sun-fill", "ri-moon-fill");
    }
}

theme.onLoad(changeThemeBtnIcon);
theme.onToggle(changeThemeBtnIcon);

/* ============== Send Email By EmailJS ============== */
const serviceID = "service_njzq2u9",
    templateID = "template_1ky86eh",
    templateParams = contactForm,
    publicKey = "WZYm8Nt6Cdz518S74";

function sendEmail(e) {
    e.preventDefault();
    // Syntax: (serviceID, templateID, templateParams, publicKey)
    emailjs.sendForm(serviceID, templateID, templateParams, publicKey).then(
        (response) => {
            console.log(response.status, response.text);
            statusBox.textContent = "The message was sent successfully ✅";
            setTimeout(() => {
                statusBox.textContent = "";
            }, 7000);
            contactForm.reset();
        },
        (error) => {
            console.log(error);
            statusBox.textContent = "The message wasn't sent successfully ❌";
        }
    );
}

contactForm.addEventListener("submit", sendEmail);

/* ============== scrollRevealJS ============== */
const sr = ScrollReveal({ origin: "top", distance: "100px", duration: 2000, delay: 300 });
sr.reveal(".home__left-side", { origin: "left" });
sr.reveal(".home__right-side", { origin: "right" });
sr.reveal(".section__title", { origin: "top", distance: "20px" });
sr.reveal(".about__left-side", { origin: "left" });
sr.reveal(".about__right-side", { origin: "right" });
sr.reveal(".skills__subtitle", { origin: "left" });
sr.reveal(".skills__items", { distance: "40px" });
sr.reveal(".timeline__title", { distance: "20px" });
sr.reveal(".timeline__items", { distance: "5px" });
sr.reveal(".project", { interval: 50 });
sr.reveal(".service", { interval: 50 });
sr.reveal(".cta__content");
sr.reveal(".testimonials__content");
sr.reveal(".contact__info-item", { interval: 50, origin: "left" });
sr.reveal(".form", { origin: "right" });

window.addEventListener("scroll", () => {
    changeHeaderBg();
    hideMobNavbar();
    showScrollUpBtn();
    activeScroll();
});

window.addEventListener("load", () => {
    renderSkills();
    renderEducations();
    activeScroll();
});
