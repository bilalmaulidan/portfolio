const hasGsap = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";

const sceneLinks = document.querySelectorAll("[data-scene-link]");
const scenes = document.querySelectorAll("[data-scene]");
const cursorGlow = document.querySelector(".cursor-glow");

function setActiveScene(sceneName) {
  sceneLinks.forEach((link) => {
    link.classList.toggle("is-active", link.dataset.sceneLink === sceneName);
  });
}

if (cursorGlow) {
  window.addEventListener("pointermove", (event) => {
    cursorGlow.style.transform = `translate(${event.clientX}px, ${event.clientY}px) translate(-50%, -50%)`;
  });
}

if (hasGsap) {
  gsap.registerPlugin(ScrollTrigger);

  gsap.to(".cloud-a", {
    x: 70,
    y: 18,
    duration: 7,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });

  gsap.to(".cloud-b", {
    x: -84,
    y: -12,
    duration: 9,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });

  gsap.to(".cloud-c", {
    x: 46,
    y: 20,
    duration: 6.5,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });

 gsap.to(".floating-house", {
  y: -24,
  rotation: 2,
  duration: 3.6,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut"
});

  gsap.to(".ground-hint span", {
    y: 18,
    opacity: 0.25,
    duration: 1.2,
    repeat: -1,
    ease: "power1.inOut"
  });

  gsap.utils.toArray(".scene-copy").forEach((copy) => {
    gsap.from(copy, {
      scrollTrigger: {
        trigger: copy,
        start: "top 78%",
        toggleActions: "play none none reverse"
      },
      y: 42,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    });
  });

  gsap.from(".house-wrap", {
    scrollTrigger: {
      trigger: ".scene-about",
      start: "top 62%",
      end: "bottom top",
      scrub: 1
    },
    y: 70,
    rotation: -2,
    ease: "none"
  });

  gsap.from(".project-card", {
    scrollTrigger: {
      trigger: ".project-grid",
      start: "top 78%",
      toggleActions: "play none none reverse"
    },
    y: 54,
    opacity: 0,
    stagger: 0.13,
    duration: 0.75,
    ease: "back.out(1.25)"
  });

  gsap.to(".path-river", {
    scrollTrigger: {
      trigger: ".scene-projects",
      start: "top bottom",
      end: "bottom top",
      scrub: 1
    },
    x: -90,
    rotation: 4,
    ease: "none"
  });

  gsap.from(".mailbox-scene", {
    scrollTrigger: {
      trigger: ".scene-contact",
      start: "top 70%",
      toggleActions: "play none none reverse"
    },
    y: 58,
    opacity: 0,
    duration: 0.8,
    ease: "back.out(1.2)"
  });

  gsap.to(".letter-one", {
    y: -18,
    rotation: -18,
    duration: 2.8,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });

  gsap.to(".letter-two", {
    y: 16,
    rotation: 20,
    duration: 3.2,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });

  scenes.forEach((scene) => {
    ScrollTrigger.create({
      trigger: scene,
      start: "top center",
      end: "bottom center",
      onEnter: () => setActiveScene(scene.dataset.scene),
      onEnterBack: () => setActiveScene(scene.dataset.scene)
    });
  });
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActiveScene(entry.target.dataset.scene);
      }
    });
  }, { threshold: 0.45 });

  scenes.forEach((scene) => observer.observe(scene));
}

//PARALLAX//

window.addEventListener("scroll", () => {

  const scrollY = window.scrollY;

  const cloudA =
    document.querySelector(".cloud-a");

  const cloudC =
    document.querySelector(".cloud-c");

  const house =
    document.querySelector(".floating-house");

  cloudA.style.transform =
    `translateY(${scrollY * 0.5}px)`;

  cloudC.style.transform =
    `translateY(${scrollY * 0.8}px)`;

  house.style.transform =
    `translate(-50%, ${scrollY * 1.2}px)`;

});