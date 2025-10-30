//＝＝＝＝＝＝＝＝＝カルーセル＝＝＝＝＝＝＝＝＝＝//**

const track = document.querySelector('.carousel_track');
const images = document.querySelectorAll('.carousel_track img');
const dots = document.querySelectorAll('.dot');

let imageWidth;

function updateImageWidth() {
  if (window.innerWidth <= 750) {
    imageWidth = 300; // SPサイズ
  } else {
    imageWidth = 430; // PCサイズ
  }
}

// 初期設定
updateImageWidth();

// ウィンドウリサイズ時も対応
window.addEventListener('resize', () => {
  updateImageWidth();
  updateCarousel(false); // スライド位置を再計算
});
const intervalTime = 3000;

let currentIndex = 1; // 複製込み配列のスタートは1（実画像の1枚目）
let autoSlideInterval;

// **1. 複製画像を前後に追加する処理**
function cloneImages() {
  const firstClone = images[0].cloneNode(true);
  const lastClone = images[images.length - 1].cloneNode(true);

  track.appendChild(firstClone);
  track.insertBefore(lastClone, images[0]);
}

cloneImages();

// **2. スライド位置を調整（初期位置は実画像の1枚目）**
track.style.transform = `translateX(${-imageWidth * currentIndex}px)`;

// **3. ドットは複製を除いた数で操作するため、ドット管理を再設定**
const realImagesCount = images.length; // 元画像枚数
// ここで dots も images.length に合わせて用意してると仮定

// **4. カルーセルの更新関数**
function updateCarousel(animate = true) {
  if (animate) {
    track.style.transition = 'transform 1.0s ease-in-out';
  } else {
    track.style.transition = 'none';
  }
  const offset = -imageWidth * currentIndex;
  track.style.transform = `translateX(${offset}px)`;
  updateDots();
}

// **5. ドットの更新は「実画像のindex」で行う**
function updateDots() {
  dots.forEach(dot => dot.classList.remove('active'));
  // currentIndexは1〜実画像枚数、だから-1して調整
  let dotIndex = currentIndex -1;
  if (dotIndex < 0) dotIndex = realImagesCount -1;
  if (dotIndex >= realImagesCount) dotIndex = 0;
  dots[dotIndex].classList.add('active');
}

// **6. 自動スライドを動かす**
function startAutoSlide() {
  autoSlideInterval = setInterval(() => {
    currentIndex++;
    updateCarousel();
  }, intervalTime);
}
startAutoSlide();

// **7. スライドの終わりにジャンプ処理（無限ループの肝）**
track.addEventListener('transitionend', () => {
  if (currentIndex === 0) {
    // 最初の複製に来た時 → 本物の最後の画像へジャンプ
    currentIndex = realImagesCount;
    updateCarousel(false);
  }
  if (currentIndex === realImagesCount + 1) {
    // 最後の複製に来た時 → 本物の最初の画像へジャンプ
    currentIndex = 1;
    updateCarousel(false);
  }
});

// **8. ドットをクリックしても移動できるように**
dots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    currentIndex = index +1; // 複製分のずれを調整
    updateCarousel();
    clearInterval(autoSlideInterval);
    startAutoSlide();
  });
});


//＝＝＝＝＝＝＝＝＝文字ふんわり＝＝＝＝＝＝＝＝＝＝//**
  const targets = document.querySelectorAll('.p_animation');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('isActive');
        // 1度だけ発火したい場合は停止
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.5 // 要素が50%表示されたら発火
  });

  targets.forEach((target) => {
    observer.observe(target);
  });
