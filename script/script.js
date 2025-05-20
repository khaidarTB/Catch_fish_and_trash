document.addEventListener('DOMContentLoaded', function() {
    // Elemen game
    const startMenu = document.getElementById('start-menu');
    const howToPlayMenu = document.getElementById('how-to-play-menu');
    const soundSettingsMenu = document.getElementById('sound-settings-menu');
    const leaderboardMenu = document.getElementById('leaderboard-menu');
    const pauseMenu = document.getElementById('pause-menu');
    const gameContainer = document.querySelector('.game-container');
    const sea = document.querySelector('.sea');
    const sky = document.querySelector('.sky');
    const weatherOverlay = document.querySelector('.weather-overlay');
    const fishingRod = document.querySelector('.fishing-rod');
    const fishingLine = document.querySelector('.fishing-line');
    const hook = document.querySelector('.hook');
    const seaweedContainer = document.querySelector('.seaweed-container');
    const fisherman = document.querySelector('.fisherman');
    
    // Elemen UI
    const scoreElement = document.getElementById('score');
    const fishCaughtElement = document.getElementById('fish-caught');
    const trashCaughtElement = document.getElementById('trash-caught');
    const timeLeftElement = document.getElementById('time-left');
    const instruction = document.querySelector('.instruction');
    const comboCounter = document.querySelector('.combo-counter');
    const comboCountElement = document.getElementById('combo-count');
    const achievementNotification = document.querySelector('.achievement-notification');
    
    // Elemen modal
    const fishModal = document.getElementById('fish-modal');
    const closeBtn = document.querySelector('.close');
    const continueBtn = document.getElementById('continue-btn');
    const fishNameElement = document.getElementById('fish-name');
    const fishImageElement = document.getElementById('fish-modal-image');
    const fishDescriptionElement = document.getElementById('fish-description');
    const gameOverModal = document.getElementById('game-over-modal');
    const finalScoreElement = document.getElementById('final-score');
    const finalFishElement = document.getElementById('final-fish');
    const finalTrashElement = document.getElementById('final-trash');
    
    // Tombol menu
    const startGameBtn = document.getElementById('start-game-btn');
    const howToPlayBtn = document.getElementById('how-to-play-btn');
    const soundSettingsBtn = document.getElementById('sound-settings-btn');
    const leaderboardBtn = document.getElementById('leaderboard-btn');
    const backToMenuBtn = document.getElementById('back-to-menu-btn');
    const backToMenuBtn2 = document.getElementById('back-to-menu-btn-2');
    const backToMenuBtn3 = document.getElementById('back-to-menu-btn-3');
    const backToMenuBtn4 = document.getElementById('back-to-menu-btn-4');
    const pauseBtn = document.getElementById('pause-btn');
    const resumeBtn = document.getElementById('resume-btn');
    const restartBtn = document.getElementById('restart-btn');
    const menuBtn = document.getElementById('menu-btn');
    const playAgainBtn = document.getElementById('play-again-btn');
    
    // Elemen tambahan untuk upgrade
    const leaderboardContainer = document.createElement('div');
    leaderboardContainer.id = 'leaderboard';
    leaderboardContainer.classList.add('leaderboard');
    gameContainer.appendChild(leaderboardContainer);
    
    // Variabel status permainan
    let score = 0;
    let fishCaught = 0;
    let trashCaught = 0;
    let isFishing = false;
    let caughtItem = null;
    let gameActive = false;
    let timeLeft = 120;
    let gameTimer;
    let gameObjects = [];
    let hookLowered = false;
    let powerUpActive = null;
    let powerUpTimeout = null;
    let dayNightCycle = 'day';
    let comboCount = 0;
    let lastCatchTime = 0;
    let weatherState = 'clear';
    let lastFrameTime = 0;
    let accumulatedTime = 0;
    let isPaused = false;
    let rodPositionX = 50;
    
    // Posisi awal alat pancing di dekat fisherman
    const rodHeight = -1;
    const rodEndX = 364;
    fishingRod.style.top = `${rodHeight}px`;
    fishingRod.style.right = `${rodEndX}px`;
    fishingRod.style.left = '150px';
    updateLineAndHook(rodHeight, rodEndX, rodHeight + 124);
    
    // Daftar ikan dan informasinya
    const fishTypes = [
        {
            name: 'Ikan Badut',
            image: 'Asset-game/Fish/ClownFish.png',
            description: 'Ikan badut (Clownfish) hidup bersama anemon laut. Mereka memiliki warna oranye dengan garis putih. Ikan ini terkenal karena film "Finding Nemo"!',
            points: 10,
            speed: 1.5,
            movementPattern: 'wave',
            depth: 'middle'
        },
        {
            name: 'Ikan Salmon',
            image: 'Asset-game/Fish/Salmon.webp',
            description: 'Ikan salmon merupakan salah satu spesies ikan yang dikenal memiliki siklus hidup yang sangat unik dan menantang. Salmon memiliki kemampuan luar biasa untuk bermigrasi.',
            points: 15,
            speed: 1.2,
            movementPattern: 'glide',
            depth: 'bottom'
        },
        {
            name: 'Ikan Bandeng',
            image: 'Asset-game/Fish/bandeng.png',
            description: 'Ikan bandeng adalah spesies berkelompok yang memiliki mulut kecil tanpa gigi dan sirip ekor besar bercabang dalam. Mata ditutupi lapisan tebal jaringan agar-agar.',
            points: 20,
            speed: 2.0,
            movementPattern: 'straight',
            depth: 'middle'
        },
        {
            name: 'Ikan Tuna',
            image: 'Asset-game/Fish/Tuna.webp',
            description: 'Ikan tuna adalah perenang cepat yang dapat menempuh jarak jauh. Mereka sangat penting untuk ekosistem laut dan makanan manusia.',
            points: 15,
            speed: 1.8,
            movementPattern: 'straight',
            depth: 'top'
        },
        {
            name: 'Bintang Laut',
            image: 'Asset-game/Fish/StarFish.png',
            description: 'Bintang laut tidak benar-benar ikan! Mereka adalah hewan laut yang dapat menumbuhkan kembali bagian tubuhnya yang hilang.',
            points: 10,
            speed: 0.5,
            movementPattern: 'zigzag',
            depth: 'bottom'
        }
    ];
    
    // Daftar sampah
    const trashTypes = [
        {
            name: 'Botol Plastik',
            image: 'Asset-game/Trash/PlasticCup.png',
            points: 5,
            floatLevel: 'top'
        },
        {
            name: 'Kantong Plastik',
            image: 'Asset-game/Trash/PlasticBags.png',
            points: 5,
            floatLevel: 'middle'
        },
        {
            name: 'Kaleng',
            image: 'Asset-game/Trash/Can_of_Soda.webp',
            points: 5,
            floatLevel: 'middle'
        },
        {
            name: 'Botol Kaca',
            image: 'Asset-game/Trash/GlassBottle.png',
            points: 8,
            floatLevel: 'middle'
        },
        {
            name: 'Sedotan Plastik',
            image: 'Asset-game/Trash/Straw.png',
            points: 3,
            floatLevel: 'top'
        }
    ];
    
    // Daftar power-up
    const powerUps = [
        {
            name: 'Kecepatan Kail',
            image: 'Asset-game/PowerUps/FastHook.png',
            effect: 'fastHook',
            duration: 10000,
            description: 'Kail bergerak 2x lebih cepat selama 10 detik!'
        },
        {
            name: 'Poin Ganda',
            image: 'Asset-game/PowerUps/DoublePoints.png',
            effect: 'doublePoints',
            duration: 10000,
            description: 'Poin yang diperoleh digandakan selama 10 detik!'
        }
    ];
    
    // Efek suara
    const sounds = {
        cast: new Audio('Asset-game/Sounds/cast.mp3'),
        catch: new Audio('Asset-game/Sounds/catch.mp3'),
        powerUp: new Audio('Asset-game/Sounds/powerup.mp3'),
        background: new Audio('Asset-game/Sounds/ocean-ambiance.mp3'),
        combo: new Audio('Asset-game/Sounds/combo.mp3'),
        achievement: new Audio('Asset-game/Sounds/achievement.mp3')
    };
    sounds.background.loop = true;
    sounds.background.volume = 0.3;
    sounds.cast.volume = 1.0;
    sounds.catch.volume = 1.0;
    sounds.powerUp.volume = 1.0;
    sounds.combo.volume = 1.0;
    sounds.achievement.volume = 1.0;
    
    // Text-to-Speech setup
    const synth = window.speechSynthesis;
    let voices = [];
    
    function loadVoices() {
        voices = synth.getVoices();
        voices = voices.filter(voice => voice.lang.includes('id-ID'));
        if (voices.length === 0) {
            voices = synth.getVoices();
        }
    }
    
    loadVoices();
    if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = loadVoices;
    }
    
    function speakText(text) {
        if (!synth || !text) return;
        synth.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        const selectedVoice = voices.find(voice => voice.lang.includes('id-ID')) || voices[0];
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }
        utterance.lang = 'id-ID';
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        synth.speak(utterance);
    }
    
    // Pengaturan suara
    const bgmVolumeSlider = document.getElementById('bgm-volume');
    const sfxVolumeSlider = document.getElementById('sfx-volume');
    
    bgmVolumeSlider.addEventListener('input', () => {
        sounds.background.volume = bgmVolumeSlider.value;
        localStorage.setItem('bgmVolume', bgmVolumeSlider.value);
    });
    
    sfxVolumeSlider.addEventListener('input', () => {
        sounds.cast.volume = sfxVolumeSlider.value;
        sounds.catch.volume = sfxVolumeSlider.value;
        sounds.powerUp.volume = sfxVolumeSlider.value;
        sounds.combo.volume = sfxVolumeSlider.value;
        sounds.achievement.volume = sfxVolumeSlider.value;
        localStorage.setItem('sfxVolume', sfxVolumeSlider.value);
    });
    
    // Memuat pengaturan suara dari localStorage
    const savedBgmVolume = localStorage.getItem('bgmVolume') || 0.3;
    const savedSfxVolume = localStorage.getItem('sfxVolume') || 1.0;
    bgmVolumeSlider.value = savedBgmVolume;
    sfxVolumeSlider.value = savedSfxVolume;
    sounds.background.volume = savedBgmVolume;
    sounds.cast.volume = savedSfxVolume;
    sounds.catch.volume = savedSfxVolume;
    sounds.powerUp.volume = savedSfxVolume;
    sounds.combo.volume = savedSfxVolume;
    sounds.achievement.volume = savedSfxVolume;
    
    // Sistem pencapaian
    const achievements = [
        { id: 'fish_10', name: 'Pemancing Pemula', description: 'Tangkap 10 ikan', condition: () => fishCaught >= 10, rewarded: false },
        { id: 'trash_10', name: 'Pembersih Laut', description: 'Kumpulkan 10 sampah', condition: () => trashCaught >= 10, rewarded: false },
        { id: 'score_100', name: 'Skor Tinggi', description: 'Dapatkan 100 poin', condition: () => score >= 100, rewarded: false },
        { id: 'combo_5', name: 'Master Combo', description: 'Dapatkan 5x combo', condition: () => comboCount >= 5, rewarded: false }
    ];
    
    function checkAchievements() {
        achievements.forEach(achievement => {
            if (!achievement.rewarded && achievement.condition()) {
                achievement.rewarded = true;
                showAchievement(achievement.name, achievement.description);
                sounds.achievement.play();
                score += 50;
                updateScore();
            }
        });
    }
    
    function showAchievement(name, description) {
        achievementNotification.textContent = `Pencapaian: ${name}! ${description}`;
        achievementNotification.classList.remove('hidden');
        setTimeout(() => {
            achievementNotification.classList.add('hidden');
        }, 4000);
    }
    
    // Leaderboard
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    
    function updateLeaderboard() {
        leaderboard.sort((a, b) => b.score - a.score);
        leaderboard = leaderboard.slice(0, 5);
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
        leaderboardContainer.innerHTML = `
            <h3>Leaderboard</h3>
            <ol>
                ${leaderboard.map((entry, index) => `
                    <li>
                        ${entry.name}: ${entry.score}
                        <button class="delete-btn" data-index="${index}" title="Hapus entri">🗑️</button>
                    </li>
                `).join('')}
            </ol>
        `;
        const leaderboardContent = document.getElementById('leaderboard-content');
        if (leaderboard.length === 0) {
            leaderboardContent.innerHTML = '<p>Belum ada skor yang tercatat.</p>';
        } else {
            leaderboardContent.innerHTML = `
                <ol>
                    ${leaderboard.map((entry, index) => `
                        <li>
                            ${entry.name}: ${entry.score}
                            <button class="delete-btn" data-index="${index}" title="Hapus entri">🗑️</button>
                        </li>
                    `).join('')}
                </ol>
            `;
        }
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.removeEventListener('click', deleteLeaderboardEntry);
            button.addEventListener('click', deleteLeaderboardEntry);
        });
    }
    
    function deleteLeaderboardEntry(event) {
        const index = parseInt(event.target.getAttribute('data-index'));
        const entry = leaderboard[index];
        if (confirm(`Apakah Anda yakin ingin menghapus ${entry.name} dengan skor ${entry.score} dari leaderboard?`)) {
            leaderboard.splice(index, 1);
            localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
            updateLeaderboard();
            speakText(`Entri ${entry.name} telah dihapus dari leaderboard.`);
        }
    }
    
    // Event listeners untuk menu dengan TTS
    startGameBtn.addEventListener('click', () => {
        speakText(startGameBtn.textContent);
        startGame();
    });
    howToPlayBtn.addEventListener('click', () => {
        speakText(howToPlayBtn.textContent);
        showHowToPlay();
    });
    soundSettingsBtn.addEventListener('click', () => {
        speakText(soundSettingsBtn.textContent);
        showSoundSettings();
    });
    leaderboardBtn.addEventListener('click', () => {
        speakText(leaderboardBtn.textContent);
        showLeaderboard();
    });
    backToMenuBtn.addEventListener('click', () => {
        speakText(backToMenuBtn.textContent);
        showMainMenu();
    });
    backToMenuBtn2.addEventListener('click', () => {
        speakText(backToMenuBtn2.textContent);
        showMainMenu();
    });
    backToMenuBtn3.addEventListener('click', () => {
        speakText(backToMenuBtn3.textContent);
        showMainMenu();
    });
    backToMenuBtn4.addEventListener('click', () => {
        speakText(backToMenuBtn4.textContent);
        showMainMenu();
    });
    pauseBtn.addEventListener('click', () => {
        speakText('Jeda');
        pauseGame();
    });
    resumeBtn.addEventListener('click', () => {
        speakText(resumeBtn.textContent);
        resumeGame();
    });
    restartBtn.addEventListener('click', () => {
        speakText(restartBtn.textContent);
        restartGame();
    });
    menuBtn.addEventListener('click', () => {
        speakText(menuBtn.textContent);
        showMainMenu();
    });
    playAgainBtn.addEventListener('click', () => {
        speakText(playAgainBtn.textContent);
        restartGame();
    });
    
    // Event listeners untuk game
    gameContainer.addEventListener('click', toggleFishing);
    gameContainer.addEventListener('mousemove', moveHookWithCursor);
    closeBtn.addEventListener('click', () => {
        speakText('Tutup');
        closeModal();
    });
    continueBtn.addEventListener('click', () => {
        speakText(continueBtn.textContent);
        closeModal();
    });
    
    // TTS untuk instruction text
    instruction.addEventListener('click', () => {
        speakText(instruction.textContent);
    });
    
    // Inisialisasi rumput laut, karang, dan burung camar
    createSeagull();
    
    // Fungsi untuk menampilkan menu utama
    function showMainMenu() {
        if (gameActive) {
            stopGame();
        }
        gameContainer.classList.add('hidden');
        howToPlayMenu.classList.add('hidden');
        soundSettingsMenu.classList.add('hidden');
        leaderboardMenu.classList.add('hidden');
        pauseMenu.classList.add('hidden');
        gameOverModal.style.display = 'none';
        fishModal.style.display = 'none';
        startMenu.classList.remove('hidden');
        sounds.background.pause();
        updateLeaderboard();
    }
    
    // Fungsi untuk menampilkan cara bermain
    function showHowToPlay() {
        startMenu.classList.add('hidden');
        howToPlayMenu.classList.remove('hidden');
    }
    
    // Fungsi untuk menampilkan pengaturan suara
    function showSoundSettings() {
        startMenu.classList.add('hidden');
        soundSettingsMenu.classList.remove('hidden');
    }
    
    // Fungsi untuk menampilkan leaderboard
    function showLeaderboard() {
        startMenu.classList.add('hidden');
        leaderboardMenu.classList.remove('hidden');
        updateLeaderboard();
        speakText('Leaderboard. Berikut adalah skor tertinggi.');
    }
    
    // Fungsi untuk memulai permainan
    function startGame() {
        startMenu.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        score = 0;
        fishCaught = 0;
        trashCaught = 0;
        comboCount = 0;
        lastCatchTime = 0;
        timeLeft = 120;
        hookLowered = false;
        powerUpActive = null;
        isPaused = false;
        achievements.forEach(ach => ach.rewarded = false);
        if (powerUpTimeout) clearTimeout(powerUpTimeout);
        updateScore();
        updateCombo();
        updateTimer();
        clearGameObjects();
        gameActive = true;
        dayNightCycle = 'day';
        weatherState = 'clear';
        sea.classList.remove('night');
        sky.classList.remove('night');
        weatherOverlay.classList.remove('rain');
        sounds.background.play();
        gameTimer = setInterval(updateGame, 1000);
        lastFrameTime = performance.now();
        requestAnimationFrame(gameLoop);
        createMovingFish();
        createMovingTrash();
        createBubbles();
        createPowerUps();
        createSeaweed();
        createCoral();
    }
    
    // Game loop untuk animasi
    function gameLoop(currentTime) {
        if (!gameActive) return;
        const deltaTime = (currentTime - lastFrameTime) / 1000;
        accumulatedTime += deltaTime;
        const fixedTimeStep = 1 / 60;
        
        while (accumulatedTime >= fixedTimeStep) {
            updateGameObjects(fixedTimeStep);
            accumulatedTime -= fixedTimeStep;
        }
        
        lastFrameTime = currentTime;
        requestAnimationFrame(gameLoop);
    }
    
    // Update game objects dengan fixed time step
    function updateGameObjects(deltaTime) {
        gameObjects.forEach(obj => {
            if (obj.type === 'fish') moveFish(obj, deltaTime);
            else if (obj.type === 'trash') moveTrash(obj, deltaTime);
            else if (obj.type === 'powerUp') movePowerUp(obj, deltaTime);
        });
    }
    
    // Update game setiap detik
    function updateGame() {
        if (!gameActive || isPaused) return;
        timeLeft--;
        updateTimer();
        updateDayNightCycle();
        updateWeather();
        if (timeLeft <= 0) {
            endGame();
        }
    }
    
    // Fungsi untuk mengakhiri permainan
    function endGame() {
        gameActive = false;
        clearInterval(gameTimer);
        clearGameObjects();
        finalScoreElement.textContent = score;
        finalFishElement.textContent = fishCaught;
        finalTrashElement.textContent = trashCaught;
        gameOverModal.style.display = 'block';
        const playerName = prompt('Masukkan nama Anda untuk leaderboard:') || 'Pemain';
        leaderboard.push({ name: playerName, score: score });
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
        updateLeaderboard();
        const gameOverText = `Permainan selesai! Skor akhir: ${score}. Ikan tertangkap: ${fishCaught}. Sampah tertangkap: ${trashCaught}.`;
        speakText(gameOverText);
        sounds.background.pause();
    }
    
    // Fungsi untuk menjeda permainan
    function pauseGame() {
        if (!gameActive) return;
        gameActive = true;
        isPaused = true;
        clearInterval(gameTimer);
        pauseMenu.classList.remove('hidden');
        sounds.background.pause();
    }
    
    // Fungsi untuk melanjutkan permainan
    function resumeGame() {
        pauseMenu.classList.add('hidden');
        isPaused = false;
        sounds.background.play();
        gameTimer = setInterval(updateGame, 1000);
        lastFrameTime = performance.now();
        requestAnimationFrame(gameLoop);
    }
    
    // Fungsi untuk memulai ulang permainan
    function restartGame() {
        pauseMenu.classList.add('hidden');
        gameOverModal.style.display = 'none';
        startGame();
    }
    
    // Fungsi untuk menghentikan permainan
    function stopGame() {
        gameActive = false;
        isPaused = true;
        clearInterval(gameTimer);
        clearGameObjects();
        sounds.background.pause();
    }
    
    // Fungsi untuk memperbarui posisi tali dan kail
    function updateLineAndHook(rodY, hookX, hookY) {
        // Adjust the starting point to align with the rod's end
        const rodStartX = rodEndX; // Use rodEndX as the starting x-coordinate
        const rodStartY = rodY + 124; // Adjusted to align with rod's tip
        // Adjust hook coordinates to account for its center
        const adjustedHookX = hookX;
        const adjustedHookY = hookY;
        const deltaX = adjustedHookX - rodStartX;
        const deltaY = adjustedHookY - rodStartY;
        const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
        
        fishingLine.style.top = `${rodStartY}px`;
        fishingLine.style.left = `${rodStartX}px`;
        fishingLine.style.width = `${length}px`;
        fishingLine.style.transform = `rotate(${angle}deg)`; // Origin at the start of the line
        
        hook.style.top = `${hookY - 12}px`; // Center the hook vertically
        hook.style.left = `${hookX - 12}px`; // Center the hook horizontally
    }
    
    // Fungsi untuk menurunkan/menaikkan kail
    function toggleFishing(event) {
        if (!gameActive || isFishing || isPaused) return;
        isFishing = true;
        sounds.cast.play();
        instruction.textContent = hookLowered ? 'Menarik kail...' : 'Menurunkan kail...';
        speakText(instruction.textContent);
        
        const startTime = performance.now();
        const animationDuration = powerUpActive === 'fastHook' ? 500 : 1000;
        const startY = hookLowered ? parseInt(hook.style.top) + 12 : rodHeight + 250;
        const targetY = hookLowered ? rodHeight + 124 : window.innerHeight * 0.5;
        const startX = parseInt(hook.style.left) + 12 || rodEndX;
        
        function animate(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / animationDuration, 1);
            const easedProgress = easeInOutQuad(progress);
            
            const newY = startY + (targetY - startY) * easedProgress;
            updateLineAndHook(rodHeight, startX, newY);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                hookLowered = !hookLowered;
                isFishing = false;
                instruction.textContent = hookLowered ? 'Geser kursor untuk memancing!' : 'Klik untuk memancing!';
                speakText(instruction.textContent);
                if (hookLowered) {
                    checkForCatch();
                }
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    // Easing function untuk animasi lebih halus
    function easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }
    
    // Fungsi untuk menggerakkan kail sesuai kursor
    function moveHookWithCursor(event) {
        if (!gameActive || !hookLowered || isFishing || isPaused) return;
        
        const rect = gameContainer.getBoundingClientRect();
        const cursorX = event.clientX - rect.left;
        const cursorY = event.clientY - rect.top;
        
        const minX = 0;
        const maxX = window.innerWidth;
        const minY = rodHeight + 124;
        const maxY = window.innerHeight;
        
        const hookX = Math.max(minX, Math.min(maxX, cursorX));
        const hookY = Math.max(minY, Math.min(maxY, cursorY));
        
        updateLineAndHook(rodHeight, hookX, hookY);
        checkForCatch();
    }
    
    // Fungsi untuk memeriksa tangkapan
    function checkForCatch() {
        for (let i = gameObjects.length - 1; i >= 0; i--) {
            const obj = gameObjects[i];
            if (!obj.element || obj.caught) continue;
            
            const objRect = obj.element.getBoundingClientRect();
            const hookRect = hook.getBoundingClientRect();
            
            const distance = Math.sqrt(
                Math.pow((objRect.left + objRect.width/2) - (hookRect.left + hookRect.width/2), 2) +
                Math.pow((objRect.top + objRect.height/2) - (hookRect.top + hookRect.height/2), 2)
            );
            
            if (distance < 30) {
                obj.caught = true;
                caughtItem = obj;
                
                createRipple(hookRect.left, hookRect.top);
                createParticles(hookRect.left, hookRect.top);
                
                if (obj.type === 'fish') {
                    obj.element.classList.add('glow');
                } else if (obj.type === 'powerUp') {
                    applyPowerUp(obj.data);
                }
                
                sounds.catch.play();
                
                const originalLeft = parseInt(obj.element.style.left);
                const originalTop = parseInt(obj.element.style.top);
                const targetLeft = parseInt(hook.style.left);
                const targetTop = parseInt(hook.style.top);
                
                function animateCatch(timestamp) {
                    const progress = Math.min((performance.now() - timestamp) / 500, 1);
                    const easedProgress = easeInOutQuad(progress);
                    obj.element.style.left = `${originalLeft + (targetLeft - originalLeft) * easedProgress}px`;
                    obj.element.style.top = `${originalTop + (targetTop - originalTop) * easedProgress}px`;
                    
                    if (progress < 1) {
                        requestAnimationFrame(() => animateCatch(timestamp));
                    } else {
                        pullBack();
                    }
                }
                
                animateCatch(performance.now());
                break;
            }
        }
    }
    
    // Fungsi untuk membuat efek riak air
    function createRipple(x, y) {
        const ripple = document.createElement('div');
        ripple.classList.add('ripple');
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        sea.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }
    
    // Fungsi untuk membuat efek partikel
    function createParticles(x, y) {
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.setProperty('--angle', `${Math.random() * 360}deg`);
            sea.appendChild(particle);
            setTimeout(() => particle.remove(), 500);
        }
    }
    
    // Fungsi untuk menarik kembali kail
    function pullBack() {
        instruction.textContent = 'Menarik kail...';
        speakText(instruction.textContent);
        
        const startTime = performance.now();
        const startY = parseInt(hook.style.top) + 12;
        const targetY = rodHeight + 124;
        const startX = parseInt(hook.style.left) + 12;
        const animationDuration = powerUpActive === 'fastHook' ? 750 : 1500; // Increased duration for smoother animation
        
        function animate(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / animationDuration, 1);
            const easedProgress = easeInOutQuad(progress);
            
            const newY = startY + (targetY - startY) * easedProgress;
            updateLineAndHook(rodHeight, startX, newY);
            
            if (caughtItem && caughtItem.element) {
                caughtItem.element.style.top = `${newY + 10}px`;
                caughtItem.element.style.left = `${startX + 5}px`;
                // Add slight rotation for visual effect
                caughtItem.element.style.transform = `rotate(${Math.sin(easedProgress * Math.PI) * 10}deg)`;
            }
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                if (caughtItem && caughtItem.element) {
                    caughtItem.element.style.transform = ''; // Reset transform
                }
                hookLowered = false;
                finishFishing();
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    // Fungsi untuk menyelesaikan memancing
    function finishFishing() {
        isFishing = false;
        instruction.textContent = 'Klik untuk memancing!';
        speakText(instruction.textContent);
        
        if (caughtItem) {
            if (caughtItem.element) {
                caughtItem.element.classList.remove('glow');
                caughtItem.element.remove();
            }
            const index = gameObjects.indexOf(caughtItem);
            if (index > -1) {
                gameObjects.splice(index, 1);
            }
            
            const currentTime = performance.now();
            if (currentTime - lastCatchTime < 5000) {
                comboCount++;
                sounds.combo.play();
            } else {
                comboCount = 1;
            }
            lastCatchTime = currentTime;
            updateCombo();
            
            let points = caughtItem.data.points;
            if (powerUpActive === 'doublePoints') points *= 2;
            if (comboCount >= 2) points += Math.floor(points * (comboCount * 0.1));
            
            if (caughtItem.type === 'fish') {
                fishCaught++;
                score += points;
                fishNameElement.textContent = caughtItem.data.name;
                fishImageElement.src = caughtItem.data.image;
                fishDescriptionElement.textContent = caughtItem.data.description;
                fishModal.style.display = 'block'; // Show modal after pull-back animation
                speakText(caughtItem.data.description);
            } else if (caughtItem.type === 'trash') {
                trashCaught++;
                score += points;
                const trashText = 'Selamat! Anda telah mengambil sampah dan membantu membersihkan laut!';
                speakText(trashText);
                setTimeout(() => {
                    const pointsText = `Anda mendapatkan ${points} poin!`;
                    speakText(pointsText);
                }, 1000);
                alert(trashText);
            }
            
            updateScore();
            checkAchievements();
            caughtItem = null;
        }
    }
    
    // Fungsi untuk memperbarui combo
    function updateCombo() {
        if (comboCount >= 2) {
            comboCountElement.textContent = comboCount;
            comboCounter.classList.remove('hidden');
            comboCounter.classList.add('combo-pulse');
            setTimeout(() => comboCounter.classList.remove('combo-pulse'), 400);
        } else {
            comboCounter.classList.add('hidden');
        }
    }
    
    // Fungsi untuk menerapkan power-up
    function applyPowerUp(powerUpData) {
        powerUpActive = powerUpData.effect;
        instruction.textContent = powerUpData.description;
        speakText(powerUpData.description);
        sounds.powerUp.play();
        powerUpTimeout = setTimeout(() => {
            powerUpActive = null;
            instruction.textContent = 'Klik untuk memancing!';
            speakText(instruction.textContent);
        }, powerUpData.duration);
    }
    
    // Fungsi untuk menutup modal
    function closeModal() {
        fishModal.style.display = 'none';
    }
    
    // Fungsi untuk membuat ikan bergerak
    function createMovingFish() {
        if (!gameActive) return;
        const interval = Math.random() * 3000 + 2000;
        setTimeout(() => {
            if (!gameActive) return;
            const fishData = fishTypes[Math.floor(Math.random() * fishTypes.length)];
            const fish = document.createElement('div');
            fish.classList.add('fish');
            fish.style.backgroundImage = `url(${fishData.image})`;
            const size = Math.floor(Math.random() * 20) + 30;
            fish.style.width = `${size}px`;
            fish.style.height = `${size}px`;
            const direction = Math.random() > 0.5 ? 'right' : 'left';
            fish.style.transform = direction === 'left' ? 'scaleX(-1)' : '';
            const startX = direction === 'right' ? -size : sea.offsetWidth;
            let startY;
            switch (fishData.depth) {
                case 'top': startY = Math.random() * (sea.offsetHeight * 0.3) + 50; break;
                case 'middle': startY = Math.random() * (sea.offsetHeight * 0.3) + (sea.offsetHeight * 0.3); break;
                case 'bottom': startY = Math.random() * (sea.offsetHeight * 0.3) + (sea.offsetHeight * 0.6); break;
                default: startY = Math.random() * (sea.offsetHeight - size - 20) + 50;
            }
            fish.style.left = `${startX}px`;
            fish.style.top = `${startY}px`;
            sea.appendChild(fish);
            const fishObj = {
                element: fish,
                type: 'fish',
                data: fishData,
                direction: direction,
                speed: dayNightCycle === 'night' ? fishData.speed * 0.7 : fishData.speed,
                pattern: fishData.movementPattern,
                startY: startY,
                amplitude: Math.random() * 30 + 10,
                frequency: Math.random() * 0.05 + 0.01,
                caught: false,
                time: 0
            };
            gameObjects.push(fishObj);
            createMovingFish();
        }, interval);
    }
    
    // Fungsi untuk menggerakkan ikan
    function moveFish(fishObj, deltaTime) {
        if (!gameActive || !fishObj.element || fishObj.caught) return;
        let currentX = parseFloat(fishObj.element.style.left);
        let currentY = parseFloat(fishObj.element.style.top);
        fishObj.time += deltaTime;
        const moveX = (fishObj.direction === 'right' ? fishObj.speed : -fishObj.speed) * deltaTime * 60;
        let moveY = 0;
        switch (fishObj.pattern) {
            case 'wave':
                moveY = Math.sin(fishObj.time * fishObj.frequency * Math.PI * 2) * fishObj.amplitude * 0.05;
                break;
            case 'zigzag':
                if (Math.random() < 0.05 * deltaTime * 60) moveY = (Math.random() - 0.5) * 2;
                break;
            case 'glide':
                if (Math.random() < 0.02 * deltaTime * 60) moveY = (Math.random() - 0.5) * 0.5;
                break;
        }
        currentX += moveX;
        currentY += moveY;
        currentY = Math.max(50, Math.min(window.innerHeight - parseInt(fishObj.element.style.height) - 20, currentY));
        fishObj.element.style.left = `${currentX}px`;
        fishObj.element.style.top = `${currentY}px`;
        const fishWidth = parseInt(fishObj.element.style.width);
        if ((fishObj.direction === 'right' && currentX > sea.offsetWidth) ||
            (fishObj.direction === 'left' && currentX < -fishWidth)) {
            fishObj.element.remove();
            const index = gameObjects.indexOf(fishObj);
            if (index > -1) {
                gameObjects.splice(index, 1);
            }
        }
    }
    
    // Fungsi untuk membuat sampah bergerak
    function createMovingTrash() {
        if (!gameActive) return;
        const interval = Math.random() * 4000 + 3000;
        setTimeout(() => {
            if (!gameActive) return;
            const trashData = trashTypes[Math.floor(Math.random() * trashTypes.length)];
            const trash = document.createElement('div');
            trash.classList.add('trash');
            trash.style.backgroundImage = `url(${trashData.image})`;
            const size = Math.floor(Math.random() * 20) + 30;
            trash.style.width = `${size}px`;
            trash.style.height = `${size}px`;
            const direction = Math.random() > 0.5 ? 'right' : 'left';
            const startX = direction === 'right' ? -size : sea.offsetWidth;
            let startY;
            switch (trashData.floatLevel) {
                case 'top': startY = Math.random() * (sea.offsetHeight * 0.2) + 50; break;
                case 'middle': startY = Math.random() * (sea.offsetHeight * 0.4) + (sea.offsetHeight * 0.2); break;
                default: startY = Math.random() * (sea.offsetHeight - size - 20) + 50;
            }
            trash.style.left = `${startX}px`;
            trash.style.top = `${startY}px`;
            sea.appendChild(trash);
            const trashObj = {
                element: trash,
                type: 'trash',
                data: trashData,
                direction: direction,
                speed: 0.8,
                caught: false
            };
            gameObjects.push(trashObj);
            createMovingTrash();
        }, interval);
    }
    
    // Fungsi untuk menggerakkan sampah
    function moveTrash(trashObj, deltaTime) {
        if (!gameActive || !trashObj.element || trashObj.caught) return;
        let currentX = parseFloat(trashObj.element.style.left);
        const moveX = (trashObj.direction === 'right' ? trashObj.speed : -trashObj.speed) * deltaTime * 60;
        currentX += moveX;
        trashObj.element.style.left = `${currentX}px`;
        const trashWidth = parseInt(trashObj.element.style.width);
        if ((trashObj.direction === 'right' && currentX > sea.offsetWidth) ||
            (trashObj.direction === 'left' && currentX < -trashWidth)) {
            trashObj.element.remove();
            const index = gameObjects.indexOf(trashObj);
            if (index > -1) {
                gameObjects.splice(index, 1);
            }
        }
    }
    
    // Fungsi untuk membuat power-up
    function createPowerUps() {
        if (!gameActive) return;
        const interval = Math.random() * 15000 + 10000;
        setTimeout(() => {
            if (!gameActive) return;
            const powerUpData = powerUps[Math.floor(Math.random() * powerUps.length)];
            const powerUp = document.createElement('div');
            powerUp.classList.add('power-up');
            powerUp.style.backgroundImage = `url(${powerUpData.image})`;
            const size = 40;
            powerUp.style.width = `${size}px`;
            powerUp.style.height = `${size}px`;
            const startX = Math.random() * (sea.offsetWidth - size);
            const startY = Math.random() * (sea.offsetHeight - size - 50) + 50;
            powerUp.style.left = `${startX}px`;
            powerUp.style.top = `${startY}px`;
            sea.appendChild(powerUp);
            const powerUpObj = {
                element: powerUp,
                type: 'powerUp',
                data: powerUpData,
                speed: 0.5,
                caught: false
            };
            gameObjects.push(powerUpObj);
            createPowerUps();
        }, interval);
    }
    
    // Fungsi untuk menggerakkan power-up
    function movePowerUp(powerUpObj, deltaTime) {
        if (!gameActive || !powerUpObj.element || powerUpObj.caught) return;
        let currentY = parseFloat(powerUpObj.element.style.top);
        currentY -= powerUpObj.speed * deltaTime * 60;
        powerUpObj.element.style.top = `${currentY}px`;
        if (currentY < 50) {
            powerUpObj.element.remove();
            const index = gameObjects.indexOf(powerUpObj);
            if (index > -1) {
                gameObjects.splice(index, 1);
            }
        }
    }
    
    // Fungsi untuk membuat gelembung
    function createBubbles() {
        if (!gameActive) return;
        const interval = Math.random() * 2000 + 1000;
        setTimeout(() => {
            if (!gameActive) return;
            const bubble = document.createElement('div');
            bubble.classList.add('bubble');
            const size = Math.random() * 20 + 10;
            bubble.style.width = `${size}px`;
            bubble.style.height = `${size}px`;
            bubble.style.left = `${Math.random() * sea.offsetWidth}px`;
            bubble.style.top = `${sea.offsetHeight}px`;
            sea.appendChild(bubble);
            const duration = Math.random() * 3000 + 2000;
            bubble.style.transition = `top ${duration}ms linear, opacity ${duration}ms linear`;
            bubble.style.top = '50px';
            bubble.style.opacity = '0';
            setTimeout(() => bubble.remove(), duration);
            createBubbles();
        }, interval);
    }
    
    // Fungsi untuk membuat karang
    function createCoral() {
        const numCorals = Math.floor(sea.offsetWidth / 150);
        for (let i = 0; i < numCorals; i++) {
            const coral = document.createElement('div');
            coral.classList.add('coral');
            const height = 200;
            const width = 200;
            coral.style.height = `${height}px`;
            coral.style.width = `${width}px`;
            coral.style.left = `${(i * 150) + (Math.random() * 100)}px`;
            coral.style.bottom = '-100';
            coral.style.animationDelay = `${Math.random() * 3}s`;
            seaweedContainer.appendChild(coral);
        }
    }
    
    // Fungsi untuk membuat rumput laut
    function createSeaweed() {
        const numSeaweeds = Math.floor(sea.offsetWidth / 100);
        for (let i = 0; i < numSeaweeds; i++) {
            const seaweed = document.createElement('div');
            seaweed.classList.add('seaweed');
            const height = 200;
            seaweed.style.height = `${height}px`;
            seaweed.style.width = '200px';
            seaweed.style.left = `${(i * 150) + (Math.random() * 50)}px`;
            seaweed.style.bottom = '-100';
            seaweed.style.animationDelay = `${Math.random() * 2}s`;
            seaweedContainer.appendChild(seaweed);
        }
    }
    
    // Fungsi untuk membuat burung camar
    function createSeagull() {
        const seagull = document.createElement('div');
        seagull.classList.add('seagull');
        sky.appendChild(seagull);
    }
    
    // Fungsi untuk memperbarui skor
    function updateScore() {
        scoreElement.textContent = score;
        fishCaughtElement.textContent = fishCaught;
        trashCaughtElement.textContent = trashCaught;
        scoreElement.parentElement.classList.add('score-pulse');
        setTimeout(() => scoreElement.parentElement.classList.remove('score-pulse'), 400);
    }
    
    // Fungsi untuk memperbarui timer
    function updateTimer() {
        timeLeftElement.textContent = timeLeft;
        if (timeLeft <= 10) {
            timeLeftElement.parentElement.classList.add('time-warning');
        } else {
            timeLeftElement.parentElement.classList.remove('time-warning');
        }
    }
    
    // Fungsi untuk memperbarui siklus siang-malam
    function updateDayNightCycle() {
        const cycleDuration = 30;
        const cycleProgress = timeLeft % cycleDuration;
        if (cycleProgress === 0) {
            dayNightCycle = dayNightCycle === 'day' ? 'night' : 'day';
            sea.classList.toggle('night');
            sky.classList.toggle('night');
            const sun = document.querySelector('.sun');
            if (sun) sun.classList.toggle('night');
            speakText(dayNightCycle === 'day' ? 'Sekarang siang hari.' : 'Sekarang malam hari.');
            gameObjects.forEach(obj => {
                if (obj.type === 'fish') {
                    obj.speed = dayNightCycle === 'night' ? obj.data.speed * 0.7 : obj.data.speed;
                }
            });
        }
    }
    
    // Fungsi untuk memperbarui cuaca
    function updateWeather() {
        const weatherChangeInterval = 20;
        if (timeLeft % weatherChangeInterval === 0) {
            const randomWeather = Math.random();
            weatherState = randomWeather < 0.3 ? 'rain' : 'clear';
            weatherOverlay.classList.toggle('rain', weatherState === 'rain');
            speakText(weatherState === 'rain' ? 'Hujan mulai turun!' : 'Cuaca kembali cerah.');
        }
    }
    
    // Fungsi untuk membersihkan semua objek permainan
    function clearGameObjects() {
        gameObjects.forEach(obj => {
            if (obj.element) obj.element.remove();
        });
        gameObjects = [];
        const ripples = document.querySelectorAll('.ripple');
        ripples.forEach(ripple => ripple.remove());
        const particles = document.querySelectorAll('.particle');
        particles.forEach(particle => particle.remove());
        const bubbles = document.querySelectorAll('.bubble');
        bubbles.forEach(bubble => bubble.remove());
        const corals = document.querySelectorAll('.coral');
        corals.forEach(coral => coral.remove());
    }
    
    // Event listener untuk resize window
    window.addEventListener('resize', () => {
        const newRodHeight = -1;
        fishingRod.style.top = `${newRodHeight}px`;
        fisherman.style.top = `${newRodHeight - 50}px`;
        if (!hookLowered) {
            updateLineAndHook(newRodHeight, rodEndX, newRodHeight + 70);
        }
    });
    
    // Inisialisasi permainan
    showMainMenu();
});