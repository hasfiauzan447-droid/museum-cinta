// ==================== INIT ====================
AOS.init({ duration: 800, easing: "ease-out-cubic", once: true });
const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);

// ==================== STATE ====================
let currentPage = 0;
const totalPages = 8; // Halaman 0 s/d 7
let isMusicOn = false;
let currentSong = 0; // 0: lagu utama, 1: lagu2, 2: lagu3

const bgm = $("#bgm");
const song2 = $("#song2");
const song3 = $("#song3");
const allSongs = [bgm, song2, song3];

// ==================== SPLASH → BUKU ====================
$("#btn-enter").addEventListener("click", () => {
    gsap.to("#splash", {
        opacity: 0,
        duration: 1.2,
        onComplete: () => {
            $("#splash").style.display = "none";
            $("#book-container").style.display = "block";
            if (!isMusicOn) {
                bgm.play().catch(() => {});
                isMusicOn = true;
                updateAllMusicUI();
            }
            showPage(0);
            massivePetals();
        }
    });
});

// ==================== NAVIGASI HALAMAN ====================
function showPage(index) {
    $$(".page").forEach(p => p.classList.remove("active"));
    const targetPage = $(`#page-${index}`);
    if (targetPage) targetPage.classList.add("active");
    currentPage = index;
    updateNavButtons();
    updateProgressBar();
    updatePageIndicator();
    updateDots();
}

function updateNavButtons() {
    $("#btn-prev").disabled = currentPage === 0;
    $("#btn-next").disabled = currentPage === totalPages - 1;
    if (currentPage === totalPages - 1) {
        $("#btn-next").textContent = "Selesai ✦";
    } else {
        $("#btn-next").innerHTML =
            'Selanjutnya <i class="fas fa-chevron-right"></i>';
    }
}

function updateProgressBar() {
    const progress = (currentPage / (totalPages - 1)) * 100;
    $("#progress-bar").style.width = progress + "%";
}

function updatePageIndicator() {
    $("#page-indicator").textContent = `Halaman ${
        currentPage + 1
    } dari ${totalPages}`;
}

// Buat dots
const navDots = $("#nav-dots");
for (let i = 0; i < totalPages; i++) {
    const dot = document.createElement("div");
    dot.className = "nav-dot";
    dot.addEventListener("click", () => showPage(i));
    navDots.appendChild(dot);
}
function updateDots() {
    $$(".nav-dot").forEach((d, i) =>
        d.classList.toggle("active", i === currentPage)
    );
}

$("#btn-prev").addEventListener("click", () => {
    if (currentPage > 0) showPage(currentPage - 1);
});
$("#btn-next").addEventListener("click", () => {
    if (currentPage < totalPages - 1) showPage(currentPage + 1);
});

// Restart
$("#btn-restart").addEventListener("click", () => {
    showPage(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
});

// ==================== MUSIK ====================
function updateAllMusicUI() {
    const icon = isMusicOn ? "fa-pause" : "fa-play";
    $("#btn-music-mini").innerHTML = `<i class="fas ${icon}"></i>`;
    const vizSpans = $$("#mini-viz span");
    vizSpans.forEach(
        s => (s.style.animationPlayState = isMusicOn ? "running" : "paused")
    );
    const bigVizSpans = $$("#big-viz span");
    bigVizSpans.forEach(
        s => (s.style.animationPlayState = isMusicOn ? "running" : "paused")
    );
    // Vinyl spin
    const vinyl = $("#vinyl-disc");
    if (isMusicOn) {
        vinyl.classList.add("playing");
    } else {
        vinyl.classList.remove("playing");
    }
}

$("#btn-music-mini").addEventListener("click", () => {
    if (isMusicOn) {
        allSongs[currentSong].pause();
    } else {
        allSongs[currentSong].play().catch(() => {});
    }
    isMusicOn = !isMusicOn;
    updateAllMusicUI();
});

function switchSong(index) {
    allSongs.forEach(s => {
        s.pause();
        s.currentTime = 0;
    });
    currentSong = index;
    if (isMusicOn) allSongs[currentSong].play().catch(() => {});
    updateAllMusicUI();
    updatePlaylistUI();
}

// ==================== PLAYLIST ====================
const playlistData = [
    { title: "Lagu Utama Kita", icon: "💗", file: "lagu.mp3" },
    { title: "Melodi Kenangan", icon: "🎵", file: "lagu2.mp3" },
    { title: "Simfoni Cinta", icon: "🎶", file: "lagu3.mp3" }
];
const playlistEl = $("#playlist");
playlistData.forEach((song, i) => {
    const div = document.createElement("div");
    div.className = "playlist-song";
    div.innerHTML = `<span>${song.icon}</span> ${song.title}`;
    div.addEventListener("click", () => switchSong(i));
    playlistEl.appendChild(div);
});
function updatePlaylistUI() {
    $$(".playlist-song").forEach((el, i) =>
        el.classList.toggle("active", i === currentSong)
    );
    $(
        "#now-playing"
    ).innerHTML = `<span>🎧 ${playlistData[currentSong].title}</span>`;
}
updatePlaylistUI();

// Klik vinyl untuk play/pause
$("#vinyl-disc").addEventListener("click", () => {
    if (isMusicOn) {
        allSongs[currentSong].pause();
    } else {
        allSongs[currentSong].play().catch(() => {});
    }
    isMusicOn = !isMusicOn;
    updateAllMusicUI();
});

// ==================== PETALS & HEARTS ====================
function createPetal() {
    const el = document.createElement("div");
    el.className = "petal";
    el.innerHTML = ["🌸", "💮", "🌷", "🩷", "🌺"][
        Math.floor(Math.random() * 5)
    ];
    el.style.cssText = `left:${Math.random() * 100}%;top:-30px;font-size:${
        Math.random() * 22 + 12
    }px;position:fixed;pointer-events:none;z-index:500;opacity:0.65;`;
    document.body.appendChild(el);
    gsap.to(el, {
        y: window.innerHeight + 60,
        x: (Math.random() - 0.5) * 160,
        rotation: Math.random() * 360,
        duration: Math.random() * 7 + 5,
        onComplete: () => el.remove()
    });
}
function massivePetals() {
    for (let i = 0; i < 45; i++) setTimeout(createPetal, i * 70);
}
setInterval(createPetal, 2200);

function createHeart() {
    const h = document.createElement("div");
    h.className = "heart-float";
    h.innerHTML = "❤️";
    h.style.cssText = `left:${Math.random() * 100}%;bottom:-20px;font-size:${
        Math.random() * 18 + 10
    }px;position:fixed;pointer-events:none;z-index:499;opacity:0.3;`;
    document.body.appendChild(h);
    gsap.to(h, {
        y: -window.innerHeight - 80,
        x: (Math.random() - 0.5) * 100,
        duration: Math.random() * 5 + 4,
        onComplete: () => h.remove()
    });
}
setInterval(createHeart, 3200);

// ==================== GALERI ====================
const gallery = $("#gallery-grid");
const captions = [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    ""
];
for (let i = 1; i <= 20; i++) {
    const frame = document.createElement("div");
    frame.className = "gallery-frame";
    frame.setAttribute("data-aos", "fade-up");
    frame.setAttribute("data-aos-delay", i * 30);
    frame.innerHTML = `<img src="foto${i}.jpg" onerror="this.src='https://picsum.photos/400/600?random=${i}'" alt="Foto ${i}"><div class="frame-caption">${
        captions[i - 1]
    }</div>`;
    frame.addEventListener("click", () =>
        openLightbox(`foto${i}.jpg`, captions[i - 1])
    );
    gallery.appendChild(frame);
}
function openLightbox(src, cap) {
    $("#lightbox").style.display = "flex";
    $("#lightbox-img").src = src;
    $("#lightbox-cap").textContent = cap;
}
$(".lightbox-close").addEventListener(
    "click",
    () => ($("#lightbox").style.display = "none")
);
$("#lightbox").addEventListener("click", e => {
    if (e.target === $("#lightbox")) $("#lightbox").style.display = "none";
});

// ==================== KENANGAN ====================
const memories = [
    {
        icon: "fa-hand-holding-heart",
        title: "Pertama Bertemu",
        desc: "Detik itu dunia terasa berhenti. Di antara banyaknya wajah, matamu yang pertama kutemukan."
    },
    {
        icon: "fa-comment-dots",
        title: "Obrolan Pertama",
        desc: "Percakapan ringan yang berubah jadi berjam-jam. Aku tahu, ada sesuatu yang berbeda."
    },
    {
        icon: "fa-face-laugh-beam",
        title: "Tawa Bersama",
        desc: "Lelucon receh yang hanya kita yang mengerti. Tawa yang jadi obat paling manjur."
    },
    {
        icon: "fa-calendar-heart",
        title: "Hari Paling Bahagia",
        desc: "Matahari lebih cerah, angin lebih lembut. Karena kamu ada di sisiku."
    },
    {
        icon: "fa-gem",
        title: "Momen Abadi",
        desc: "Kenangan yang akan selalu terpatri, tak lekang oleh waktu."
    },
    {
        icon: "fa-road",
        title: "Perjalanan Kita",
        desc: "Setiap langkah kecil yang kita tapaki bersama, adalah petualangan terindah."
    }
];
const kgrid = $("#kenangan-grid");
memories.forEach((m, i) => {
    const card = document.createElement("div");
    card.className = "memory-card";
    card.setAttribute("data-aos", "flip-up");
    card.setAttribute("data-aos-delay", i * 100);
    card.innerHTML = `<i class="fas ${m.icon}"></i><h3>${m.title}</h3>`;
    card.addEventListener("click", () => {
        $("#memory-title").textContent = m.title;
        $("#memory-desc").textContent = m.desc;
        $("#memory-popup").style.display = "flex";
        for (let j = 0; j < 10; j++) setTimeout(createHeart, j * 120);
    });
    kgrid.appendChild(card);
});
$(".popup-close").addEventListener(
    "click",
    () => ($("#memory-popup").style.display = "none")
);
$("#memory-popup").addEventListener("click", e => {
    if (e.target === $("#memory-popup"))
        $("#memory-popup").style.display = "none";
});

// ==================== SURAT ====================
let letterOpen = false;
$("#envelope").addEventListener("click", () => {
    if (letterOpen) return;
    letterOpen = true;
    gsap.to("#envelope", {
        scale: 0.9,
        opacity: 0,
        duration: 0.4,
        onComplete: () => {
            $("#envelope").style.display = "none";
            $("#paper").style.display = "block";
            new Typed("#typed-letter", {
                strings: [
                    "<br>Untukmu, cintaku...<br><br>Setiap pagi aku bersyukur, karena semesta memberiku hadiah terindah: kamu. Senyummu adalah cahaya yang menghangatkan hariku. Suaramu adalah melodi yang menenangkan jiwaku. Dalam setiap doaku, hanya namamu yang selalu terselip.<br><br>Selamanya milikmu,<br>— ❤️"
                ],
                typeSpeed: 30,
                showCursor: false
            });
        }
    });
});

// ==================== LANGIT HARAPAN (TOTAL REWRITE - RESPONSIVE) ====================
const sky = $("#starry-sky");
const wishList = $("#wish-list");
const defaultWishes = [
    "🌟 Selalu bersama",
    "💫 Bahagia dunia dan akhirat",
    "✨ Semua mimpi terwujud",
    "🌙 Hubungan yang selalu penuh kebaikan",
    "💖 Kesehatan dan keberkahan selalu"
];

// Bersihkan dulu
sky.innerHTML = "";

// Tambah bulan
const moonContainer = document.createElement("div");
moonContainer.className = "moon-container";
moonContainer.innerHTML = '<div class="moon-crescent"></div>';
sky.appendChild(moonContainer);

// Buat bintang-bintang (120 bintang)
for (let i = 0; i < 120; i++) {
    const star = document.createElement("div");
    const size = Math.random() * 3 + 1;
    const x = Math.random() * 92 + 4;
    const y = Math.random() * 85 + 5;

    star.className = "sky-star";
    star.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${x}%;
        top: ${y}%;
        opacity: ${0.35 + Math.random() * 0.65};
        animation: twinkleStar ${2 + Math.random() * 3}s infinite alternate;
        animation-delay: ${Math.random() * 3}s;
    `;

    const wishText =
        defaultWishes[Math.floor(Math.random() * defaultWishes.length)];

    star.addEventListener("click", e => {
        e.stopPropagation();
        showStarPopup(e.clientX, e.clientY, wishText);
        createSparkles(e.clientX, e.clientY, 6);
    });

    // Touch event untuk mobile
    star.addEventListener("touchend", e => {
        e.stopPropagation();
        e.preventDefault();
        const touch = e.changedTouches[0];
        showStarPopup(touch.clientX, touch.clientY, wishText);
        createSparkles(touch.clientX, touch.clientY, 6);
    });

    sky.appendChild(star);
}

// Tambah animasi twinkle di stylesheet
const twinkleStyle = document.createElement("style");
twinkleStyle.textContent = `
    @keyframes twinkleStar {
        0% { opacity: 0.3; }
        50% { opacity: 1; box-shadow: 0 0 6px #fff, 0 0 12px rgba(200,220,255,0.7); }
        100% { opacity: 0.4; }
    }
`;
document.head.appendChild(twinkleStyle);

// Bintang jatuh
function createShootingStar() {
    const star = document.createElement("div");
    star.className = "shooting-star";
    const startX = Math.random() * 70 + 10;
    const startY = Math.random() * 35;
    star.style.left = startX + "%";
    star.style.top = startY + "%";
    sky.appendChild(star);

    gsap.to(star, {
        x: -120,
        y: 180,
        opacity: 0,
        duration: 1 + Math.random() * 0.8,
        onComplete: () => star.remove()
    });
}
setInterval(createShootingStar, 3500);
createShootingStar();

// Popup bintang
function showStarPopup(x, y, text) {
    const popup = document.createElement("div");
    popup.className = "star-popup";
    popup.style.left = x + "px";
    popup.style.top = y + "px";
    popup.textContent = "💫 " + text;
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 2800);
}

// Sparkles
function createSparkles(x, y, count) {
    for (let i = 0; i < count; i++) {
        const spark = document.createElement("div");
        spark.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 3px;
            height: 3px;
            background: #FFE566;
            border-radius: 50%;
            z-index: 3000;
            pointer-events: none;
            box-shadow: 0 0 6px gold;
        `;
        document.body.appendChild(spark);
        const angle = (Math.PI * 2 * i) / count;
        const distance = 20 + Math.random() * 15;
        gsap.to(spark, {
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance,
            opacity: 0,
            duration: 0.5,
            onComplete: () => spark.remove()
        });
    }
}

// Tambah harapan
$("#btn-add-wish").addEventListener("click", addWish);
$("#wish-input").addEventListener("keypress", e => {
    if (e.key === "Enter") addWish();
});

function addWish() {
    const input = $("#wish-input");
    const text = input.value.trim();
    if (!text) return;

    const wishItem = document.createElement("div");
    wishItem.className = "wish-item";
    wishItem.innerHTML = "✨ " + text;
    wishList.prepend(wishItem);
    defaultWishes.push("✨ " + text);
    input.value = "";

    for (let i = 0; i < 3; i++) {
        setTimeout(createShootingStar, i * 150);
    }
}

// Tampilkan wish default
defaultWishes.forEach(w => {
    const wishItem = document.createElement("div");
    wishItem.className = "wish-item";
    wishItem.innerHTML = w;
    wishList.appendChild(wishItem);
});

// ==================== KOMPIDI PUTAR KENANGAN (CAROUSEL 3D) ====================
const carouselTrack = $("#carousel-track");
const carouselPopup = $("#carousel-popup");
const popupEmoji = $("#popup-emoji");
const popupTitle = $("#popup-card-title");
const popupDesc = $("#popup-card-desc");
const carouselIndicator = $("#carousel-indicator");

// Data kenangan awal
const memoryCards = [
    {
        emoji: "💖",
        title: "Pertama Bertemu",
        desc: "Detik itu, di antara banyaknya orang, aku melihatmu dan duniamu."
    },
    {
        emoji: "💬",
        title: "Obrolan Pertama",
        desc: "Pesan singkat yang berubah jadi percakapan panjang hingga dini hari."
    },
    {
        emoji: "😂",
        title: "Tawa Pertama",
        desc: "Lelucon receh yang bikin kita tertawa sampai lupa waktu."
    },
    {
        emoji: "🎂",
        title: "Ulang Tahun",
        desc: "Kue kecil, lilin, dan harapan yang kupanjatkan untukmu."
    },
    {
        emoji: "🌊",
        title: "List Liburan Bersama",
        desc: "Pantai, ombak, dan jejak kaki kita di pasir."
    },
    {
        emoji: "🌙",
        title: "Malam Berbintang",
        desc: "Berdua di bawah langit, menghitung bintang dan berbagi mimpi."
    },
    {
        emoji: "🎵",
        title: "Lagu Kita",
        desc: "Melodi yang selalu mengingatkanku pada senyummu."
    },
    {
        emoji: "💍",
        title: "Janji Selamanya",
        desc: "Saling berjanji untuk tetap bersama, apapun yang terjadi."
    }
];

let currentCardIndex = 0;
let isDragging = false;
let startX = 0;
let currentX = 0;

// Fungsi render kartu dalam formasi 3D
function renderCarousel() {
    carouselTrack.innerHTML = "";

    memoryCards.forEach((card, index) => {
        const cardEl = document.createElement("div");
        cardEl.className = "carousel-card";

        // Hitung posisi relatif terhadap kartu aktif
        let relativePos = index - currentCardIndex;

        // Wrap around untuk efek infinite
        if (relativePos > memoryCards.length / 2)
            relativePos -= memoryCards.length;
        if (relativePos < -memoryCards.length / 2)
            relativePos += memoryCards.length;

        // Transform 3D berdasarkan posisi
        const translateX = relativePos * 120;
        const translateZ = -Math.abs(relativePos) * 200;
        const rotateY = relativePos * -25;
        const opacity =
            relativePos === 0 ? 1 : 0.4 - Math.abs(relativePos) * 0.15;
        const scale =
            relativePos === 0 ? 1 : 0.75 - Math.abs(relativePos) * 0.08;
        const zIndex = 10 - Math.abs(relativePos);

        cardEl.style.cssText = `
            transform: translate(-50%, -50%) translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale});
            opacity: ${Math.max(0.1, opacity)};
            z-index: ${Math.max(1, zIndex)};
            pointer-events: ${Math.abs(relativePos) <= 2 ? "auto" : "none"};
        `;

        cardEl.innerHTML = `
            <div class="carousel-card-emoji">${card.emoji}</div>
            <div class="carousel-card-title">${card.title}</div>
            <div class="carousel-card-desc">${card.desc.substring(
                0,
                50
            )}...</div>
        `;

        // Klik untuk lihat detail
        cardEl.addEventListener("click", e => {
            if (Math.abs(relativePos) === 0) {
                openMemoryPopup(card);
            } else if (Math.abs(relativePos) === 1) {
                // Klik kartu samping = pindah ke kartu itu
                if (relativePos < 0) prevCard();
                else nextCard();
            }
        });

        // Touch events untuk swipe
        cardEl.addEventListener(
            "touchstart",
            e => {
                if (Math.abs(relativePos) === 0) {
                    isDragging = true;
                    startX = e.touches[0].clientX;
                    currentX = startX;
                }
            },
            { passive: true }
        );

        cardEl.addEventListener(
            "touchmove",
            e => {
                if (isDragging) {
                    currentX = e.touches[0].clientX;
                }
            },
            { passive: true }
        );

        cardEl.addEventListener("touchend", () => {
            if (isDragging) {
                const diff = currentX - startX;
                if (diff > 40) prevCard();
                else if (diff < -40) nextCard();
                isDragging = false;
            }
        });

        carouselTrack.appendChild(cardEl);
    });

    // Update indicator
    carouselIndicator.textContent = `${currentCardIndex + 1} / ${
        memoryCards.length
    }`;
}

// Fungsi navigasi
function nextCard() {
    currentCardIndex = (currentCardIndex + 1) % memoryCards.length;
    renderCarousel();
}

function prevCard() {
    currentCardIndex =
        (currentCardIndex - 1 + memoryCards.length) % memoryCards.length;
    renderCarousel();
}

// Fungsi buka popup detail
function openMemoryPopup(card) {
    popupEmoji.textContent = card.emoji;
    popupTitle.textContent = card.title;
    popupDesc.textContent = card.desc;
    carouselPopup.classList.add("show");

    // Bikin hati berjatuhan
    for (let i = 0; i < 8; i++) {
        setTimeout(createHeart, i * 100);
    }
}

// Fungsi tutup popup
function closeMemoryPopup() {
    carouselPopup.classList.remove("show");
}

// Event listeners
$("#btn-next-card").addEventListener("click", nextCard);
$("#btn-prev-card").addEventListener("click", prevCard);
$(".carousel-popup-close").addEventListener("click", closeMemoryPopup);
carouselPopup.addEventListener("click", e => {
    if (e.target === carouselPopup) closeMemoryPopup();
});

// Keyboard navigation
document.addEventListener("keydown", e => {
    // Cek apakah halaman carousel aktif
    const carouselPage = $("#page-5");
    if (carouselPage && carouselPage.classList.contains("active")) {
        if (e.key === "ArrowRight") nextCard();
        if (e.key === "ArrowLeft") prevCard();
        if (e.key === "Escape") closeMemoryPopup();
    }
});

// Tambah kenangan baru
$("#btn-add-memory").addEventListener("click", addMemory);
$("#carousel-input").addEventListener("keypress", e => {
    if (e.key === "Enter") addMemory();
});

function addMemory() {
    const input = $("#carousel-input");
    const text = input.value.trim();
    if (!text) return;

    const emojis = ["💝", "🌟", "🎀", "💫", "🌺", "🦋", "🎈", "💎", "🌈", "✨"];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    memoryCards.push({
        emoji: randomEmoji,
        title: text,
        desc: "Kenangan berharga yang baru saja ditambahkan ke komidi putar kita. ❤️"
    });

    currentCardIndex = memoryCards.length - 1;
    renderCarousel();
    input.value = "";
    input.focus();

    // Animasi kecil
    for (let i = 0; i < 5; i++) {
        setTimeout(createHeart, i * 80);
    }
}

// Render awal
renderCarousel();

// ==================== GLOW MOUSE ====================
document.addEventListener("mousemove", e => {
    let glow = document.querySelector(".mouse-glow");
    if (!glow) {
        glow = document.createElement("div");
        glow.className = "mouse-glow";
        glow.style.cssText =
            "position:fixed;width:350px;height:350px;background:radial-gradient(circle,rgba(255,182,193,0.1),transparent 70%);border-radius:50%;pointer-events:none;z-index:0;transform:translate(-50%,-50%);";
        document.body.appendChild(glow);
    }
    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";
});

// ==================== KUPU-KUPU ====================
for (let i = 0; i < 5; i++) {
    const b = document.createElement("div");
    b.innerHTML = "🦋";
    b.style.cssText = `position:fixed;font-size:20px;opacity:0.4;pointer-events:none;z-index:400;left:${
        Math.random() * 90
    }%;top:${Math.random() * 90}%;`;
    document.body.appendChild(b);
    gsap.to(b, {
        x: (Math.random() - 0.5) * 200,
        y: (Math.random() - 0.5) * 200,
        rotation: 360,
        duration: Math.random() * 10 + 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });
}

// ==================== INISIAL ====================
updateNavButtons();
updateDots();
updatePageIndicator();

console.log("🏛️✨ Museum Cinta — Buku Cerita siap dijelajahi!");
