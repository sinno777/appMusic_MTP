const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const cd = $('.cd')
const heading = $('.header-title h2')
const cd_thumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const control = $('.control')
const pauseIcon = $('.controlBtn-pause')
const playIcon = $('.controlBtn-play')
const progress = $('#progress');
const progressBar = $(".progress_bar");
const timeSongTotal = $('.time_music-end');
const timeSongCurrent = $('.time_music-start');
const repeatBtn = $('.btn-repeat');
const prevBtn = $('.btn-prev');
const nextBtn = $('.btn-next');
const randomBtn = $('.btn-random');
const list_music = $('.list_music')


const app = {
    currentIndex: 0,
    isPlayBool: false,
    isHoldProgressBar: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: 'Nơi này có anh (Sinoo&Naiz)',
            singer: 'SƠN TÙNG M-TP',
            path: './assets/music/noiNayCoAnh.mp3',
            image: './assets/img/song6.jpg',

        },
        {
            name: 'Có ai hẹn hò cùng em chưa',
            singer: 'Quân AP',
            path: './assets/music/coaihenhocungemchua.mp3',
            image: './assets/img/song1.jpg',

        },
        {
            name: 'Khác biệt',
            singer: 'Khắc Việt',
            path: './assets/music/KhacBiet.mp3',
            image: './assets/img/song2.jpg',

        },
        {
            name: 'Chia tay là giải pháp',
            singer: 'Ngô Quyền Linh - Cover',
            path: './assets/music/ChiaTayLaGiaiPhap.mp3',
            image: './assets/img/song3.jpg',

        },
        {
            name: 'Suýt nữa thì',
            singer: 'Andiez',
            path: './assets/music/SuytNuaThi.mp3',
            image: './assets/img/song4.jpg',

        },
        {
            name: 'Thế giới trong em',
            singer: 'Hương Ly',
            path: './assets/music/TheGioiTrongEm.mp3',
            image: './assets/img/song5.jpg',

        },
    ],
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },
    render: function () {
        const html = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
            <div class="thumb" style="background: url('${song.image}') center center / cover">
            </div>
            <div class="body">
                <h3 class="title ${index === this.currentIndex ? 'neonTextTitle' : ''}">${song.name}</h3>
                <p class="author  ${index === this.currentIndex ? 'neonTextAuthor' : ''}">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>
            `
        })
        list_music.innerHTML = html.join('')
    },
    scrollToActiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            })
        }, 300);
    },
    loadCurrentSong: function () {
        heading.innerText = this.currentSong.name
        cd_thumb.style.background = `url('${this.currentSong.image}') center center / cover`
        audio.src = this.currentSong.path
    },
    nextSong: function () {
        this.currentIndex++
        (this.currentIndex >= this.songs.length) && (this.currentIndex = 0)
        this.loadCurrentSong()
    },
    prevSong: function () {
        this.currentIndex--
        (this.currentIndex < 0) && (this.currentIndex = this.songs.length - 1)
        this.loadCurrentSong()
    },
    playRandomSong: function () {
        let indexRand
        do {
            indexRand = Math.floor(Math.random() * this.songs.length)
        } while (indexRand === this.currentIndex);
        this.currentIndex = indexRand
        this.loadCurrentSong();

    },
    handleEvents: function () {
        const _this = this
        // None set handles Scroll for this app
        /*
        const cdWidth = cd.offsetWidth
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newWidth = cdWidth - scrollTop
            if (newWidth >= 190) {
                cd.style.width = 0
                return
            }
            cd.style.width = newWidth + 'px'
            console.log(newWidth)
        }
        */

        // play music

        pauseIcon.style.display = 'none'

        playBtn.onclick = function () {
            if (_this.isPlayBool) {
                audio.play()
                pauseIcon.style.display = 'block'
                playIcon.style.display = 'none'
            } else {
                audio.pause()
                playIcon.style.display = 'block'
                pauseIcon.style.display = 'none'
            }
            _this.isPlayBool = !_this.isPlayBool
        }

        // progress for music
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = (audio.currentTime / audio.duration) * 100;
                progress.style.width = progressPercent + "%";
                //set durationTime và currentTime cho bài hát
                timeSongCurrent.textContent = _this.getMinutesSong(
                    progress.style.width
                );
                timeSongTotal.textContent = _this.setMinutesSong();
            }
        }

        progressBar.onmousedown = function (e) {
            const seekTime = (e.offsetX / this.offsetWidth) * audio.duration;
            audio.currentTime = seekTime;
            _this.isHoldProgressBar = true;
        }
        progressBar.onmouseup = function (e) {
            if (_this.isHoldProgressBar) {
                const seekTime = (e.offsetX / this.offsetWidth) * audio.duration;
                audio.currentTime = seekTime;
            }
        }

        nextBtn.onclick = function () {
            if (_this.isRandom)
                _this.playRandomSong()
            else
                _this.nextSong()
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
            pauseIcon.style.display = 'block'
            playIcon.style.display = 'none'
        }
        prevBtn.onclick = function () {
            if (_this.isRandom)
                _this.playRandomSong()
            else
                _this.prevSong()
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
            pauseIcon.style.display = 'block'
            playIcon.style.display = 'none'
        }
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)
        }
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }
        audio.onended = function () {
            if (_this.isRepeat)
                audio.play()
            else {
                nextBtn.click()
            }
        }

        list_music.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.option')) {
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                    pauseIcon.style.display = 'block'
                    playIcon.style.display = 'none'
                }
            }
        }
    },
    setMinutesSong() {
        const time = audio.duration;
        const minutes = Math.floor(time / 60)
            .toString()
            .padStart(2, "0");
        const seconds = Math.floor(time - 60 * minutes)
            .toString()
            .padStart(2, "0");
        return (finalTime = minutes + ":" + seconds);
    },
    getMinutesSong() {
        const time = audio.currentTime;
        const minutes = Math.floor(time / 60)
            .toString()
            .padStart(2, "0");
        const seconds = Math.floor(time - 60 * minutes)
            .toString()
            .padStart(2, "0");
        return (finalTime = minutes + ":" + seconds);
    },

    start: function () {
        this.defineProperties()
        this.handleEvents()
        this.loadCurrentSong()
        this.render()
    }
}

app.start()