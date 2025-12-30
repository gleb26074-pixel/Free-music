// Музыкальный плеер
class MusicPlayer {
    constructor() {
        this.isPlaying = false;
        this.currentTime = 0;
        this.duration = 225; // 3:45 в секундах
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupAudio();
        this.updateProgress();
    }

    setupEventListeners() {
        // Кнопка воспроизведения
        const playBtn = document.querySelector('.play-btn');
        playBtn.addEventListener('click', () => this.togglePlay());

        // Кнопки управления
        document.querySelector('.fa-step-backward').parentElement.addEventListener('click', () => this.prevTrack());
        document.querySelector('.fa-step-forward').parentElement.addEventListener('click', () => this.nextTrack());

        // Прогресс бар
        const progressBar = document.querySelector('.progress-bar');
        progressBar.addEventListener('click', (e) => this.seek(e));

        // Лайк
        const likeBtn = document.querySelector('.fa-heart').parentElement;
        likeBtn.addEventListener('click', (e) => {
            e.currentTarget.innerHTML = '<i class="fas fa-heart"></i>';
            e.currentTarget.style.color = '#ff2c2c';
        });

        // Клики по трекам
        document.querySelectorAll('.track-item').forEach(item => {
            item.addEventListener('click', () => {
                const title = item.querySelector('h4').textContent;
                const artist = item.querySelector('p').textContent;
                this.playTrack(title, artist);
            });
        });

        // Клики по плейлистам
        document.querySelectorAll('.playlist-card').forEach(card => {
            card.addEventListener('click', () => {
                const title = card.querySelector('h4').textContent;
                alert(`Открываем плейлист: ${title}`);
            });
        });
    }

    setupAudio() {
        // В реальном приложении здесь будет Web Audio API
        this.audio = {
            play: () => console.log('Playing...'),
            pause: () => console.log('Paused...')
        };
    }

    togglePlay() {
        this.isPlaying = !this.isPlaying;
        const playBtn = document.querySelector('.play-btn i');
        
        if (this.isPlaying) {
            playBtn.className = 'fas fa-pause';
            this.startProgress();
            console.log('Воспроизведение начато');
        } else {
            playBtn.className = 'fas fa-play';
            this.stopProgress();
            console.log('Воспроизведение приостановлено');
        }
    }

    playTrack(title, artist) {
        const playerTitle = document.querySelector('.player-info h4');
        const playerArtist = document.querySelector('.player-info p');
        
        playerTitle.textContent = title;
        playerArtist.textContent = artist;
        
        if (!this.isPlaying) {
            this.togglePlay();
        }
        
        console.log(`Сейчас играет: ${title} - ${artist}`);
    }

    prevTrack() {
        console.log('Предыдущий трек');
        this.currentTime = 0;
        this.updateProgress();
    }

    nextTrack() {
        console.log('Следующий трек');
        this.currentTime = 0;
        this.updateProgress();
    }

    seek(e) {
        const progressBar = e.currentTarget;
        const rect = progressBar.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / progressBar.offsetWidth;
        
        this.currentTime = this.duration * pos;
        this.updateProgress();
    }

    startProgress() {
        this.progressInterval = setInterval(() => {
            if (this.currentTime < this.duration) {
                this.currentTime++;
                this.updateProgress();
            } else {
                this.nextTrack();
            }
        }, 1000);
    }

    stopProgress() {
        clearInterval(this.progressInterval);
    }

    updateProgress() {
        const progressFill = document.querySelector('.progress-fill');
        const currentTimeEl = document.querySelector('.time-display span:first-child');
        const durationEl = document.querySelector('.time-display span:last-child');
        
        const progress = (this.currentTime / this.duration) * 100;
        progressFill.style.width = `${progress}%`;
        
        currentTimeEl.textContent = this.formatTime(this.currentTime);
        durationEl.textContent = this.formatTime(this.duration);
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}

// PWA функционал
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(err => {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    const player = new MusicPlayer();
    
    // Симулируем загрузку данных
    console.log('Яндекс Музыка iOS загружена!');
    
    // Добавляем эффект загрузки
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s';
        document.body.style.opacity = '1';
    }, 100);
    
    // Обновляем время
    const updateTime = () => {
        const time = new Date().toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
        });
        const timeElement = document.querySelector('.hero-card p');
        if (timeElement && timeElement.textContent.includes('Доброе')) {
            const hour = new Date().getHours();
            let greeting = 'Доброе утро';
            if (hour >= 12 && hour < 18) greeting = 'Добрый день';
            else if (hour >= 18) greeting = 'Добрый вечер';
            else if (hour >= 0 && hour < 6) greeting = 'Доброй ночи';
            
            document.querySelector('.hero-card h2').textContent = greeting;
        }
    };
    
    updateTime();
    setInterval(updateTime, 60000);
});
