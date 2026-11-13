// 質問データと、各画像内のピンクボタンの座標（%）
const quizData = [
  {
    id: "exercise",
    image: "images/3.png",
    options: [
      { label: "よくする", value: "high", top: 43, left: 12.2, width: 29.8, height: 14 },
      { label: "あまりしない", value: "low", top: 43, left: 56.6, width: 31.2, height: 14 },
      { label: "ときどきする", value: "mid", top: 69.5, left: 12.2, width: 29.8, height: 13.5 },
      { label: "しない", value: "none", top: 69.5, left: 56.6, width: 31.2, height: 13.5 }
    ]
  },
  {
    id: "sleepHours",
    image: "images/4.png",
    options: [
      { label: "4時間未満", value: 3.5, top: 29.0, left: 0.2, width: 98.0, height: 8.6 },
      { label: "5時間", value: 5, top: 39.2, left: 0.2, width: 98.0, height: 8.6 },
      { label: "6時間", value: 6, top: 49.4, left: 0.2, width: 98.0, height: 8.6 },
      { label: "7時間", value: 7, top: 59.5, left: 0.2, width: 98.0, height: 8.6 },
      { label: "8時間", value: 8, top: 69.7, left: 0.2, width: 98.0, height: 8.6 },
      { label: "9時間", value: 9, top: 79.8, left: 0.2, width: 98.0, height: 8.6 },
      { label: "10時間以上", value: 10, top: 89.9, left: 0.2, width: 98.0, height: 8.6 }
    ]
  },
  {
    id: "stress",
    image: "images/5.png",
    options: [
      { label: "はい", value: "yes", top: 51.2, left: 10.2, width: 31.5, height: 21.0 },
      { label: "いいえ", value: "no", top: 51.2, left: 56.4, width: 32.3, height: 21.0 }
    ]
  },
  {
    id: "bath",
    image: "images/6.png",
    options: [
      { label: "寝る一時間前", value: "ideal", top: 51.2, left: 11.6, width: 31.5, height: 21.0 },
      { label: "それ以外", value: "other", top: 51.2, left: 59.8, width: 31.5, height: 21.0 }
    ]
  },
  {
    id: "roomTemp",
    image: "images/7.png",
    options: [
      { label: "暑い", value: "hot", top: 49.8, left: 10.0, width: 31.5, height: 21.2 },
      { label: "寒い", value: "cold", top: 49.8, left: 57.1, width: 31.5, height: 21.2 }
    ]
  },
  {
    id: "daySleepy",
    image: "images/8.png",
    options: [
      { label: "感じる", value: "yes", top: 46.5, left: 10.1, width: 31.5, height: 21.0 },
      { label: "感じない", value: "no", top: 46.5, left: 57.3, width: 31.5, height: 21.0 }
    ]
  }
];

let currentStep = -1;
const answers = {};

const bgImage = document.getElementById("bg-image");
const buttonsLayer = document.getElementById("buttons-layer");
const resultOverlay = document.getElementById("result-overlay");
const resultSubtitle = document.getElementById("result-subtitle");
const resultAdviceList = document.getElementById("result-advice-list");
const progressArea = document.getElementById("progress-area");
const progressText = document.getElementById("progress-text");

// 初期表示（タイトル画面）
function renderTitle() {
  currentStep = -1;
  bgImage.src = "images/2.png";
  resultOverlay.classList.add("hidden");
  progressArea.classList.add("hidden");
  buttonsLayer.innerHTML = "";

  const startBtn = document.createElement("button");
  startBtn.className = "hotspot-btn";
  startBtn.setAttribute("aria-label", "診断スタート");
  startBtn.style.top = "50%";
  startBtn.style.left = "32.3%";
  startBtn.style.width = "35.4%";
  startBtn.style.height = "17.8%";
  startBtn.onclick = () => renderQuestion(0);

  buttonsLayer.appendChild(startBtn);
}

// 質問画面の表示
function renderQuestion(index) {
  currentStep = index;
  const q = quizData[index];
  bgImage.src = q.image;
  resultOverlay.classList.add("hidden");
  progressArea.classList.remove("hidden");
  progressText.textContent = `質問 ${index + 1} / ${quizData.length}`;
  buttonsLayer.innerHTML = "";

  q.options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "hotspot-btn";
    btn.setAttribute("aria-label", opt.label);
    btn.style.top = `${opt.top}%`;
    btn.style.left = `${opt.left}%`;
    btn.style.width = `${opt.width}%`;
    btn.style.height = `${opt.height}%`;

    btn.onclick = () => {
      answers[q.id] = opt.value;
      if (index + 1 < quizData.length) {
        renderQuestion(index + 1);
      } else {
        renderResult();
      }
    };

    buttonsLayer.appendChild(btn);
  });
}

// 前の質問に戻る
function prevQuestion() {
  if (currentStep > 0) {
    renderQuestion(currentStep - 1);
  } else {
    renderTitle();
  }
}

// 診断結果の判定と個別アドバイスの生成
function renderResult() {
  buttonsLayer.innerHTML = "";
  progressArea.classList.add("hidden");
  resultOverlay.classList.remove("hidden");

  const hours = answers.sleepHours;
  const isSleepy = answers.daySleepy === "yes";
  const hasStress = answers.stress === "yes";
  const badBath = answers.bath === "other";
  const noExercise = answers.exercise === "low" || answers.exercise === "none";

  let badHabitCount = 0;
  if (hasStress) badHabitCount++;
  if (badBath) badHabitCount++;
  if (noExercise) badHabitCount++;

  // 1. 動物タイプの判定（images/9.png 〜 13.png に対応）
  let resultImage = "";
  let subtitle = "";

  if (hours <= 5) {
    resultImage = "images/9.png";
    subtitle = "圧倒的睡眠不足！体と脳がSOSを出しているかも？";
  } else if (hours >= 9) {
    resultImage = "images/10.png";
    subtitle = "睡眠時間はたっぷり！でも生活リズムが崩れ気味？";
  } else if (isSleepy && badHabitCount >= 2) {
    resultImage = "images/12.png";
    subtitle = "時間は寝ているのに疲れが取れない「隠れ睡眠負債」タイプ";
  } else if (!isSleepy && badHabitCount === 0 && (hours === 7 || hours === 8)) {
    resultImage = "images/11.png";
    subtitle = "理想的な睡眠マスター！今の生活リズムをキープしよう";
  } else {
    resultImage = "images/13.png";
    subtitle = "あと一歩で睡眠マスター！生活習慣を少し見直そう";
  }

  bgImage.src = resultImage;
  resultSubtitle.textContent = subtitle;

  // 2. 回答に合わせた個別アドバイスの作成（最大3つ選出）
  const advices = [];

  if (hours <= 5) {
    advices.push("まずは今より30分早く布団に入る習慣をつけて睡眠時間を確保しよう");
  } else if (hours >= 9) {
    advices.push("休日も平日と同じ時間に起きて太陽の光を浴び、体内時計を整えよう");
  }

  if (hasStress) {
    advices.push("ストレスをためないよう、寝る前に深呼吸や好きな音楽でリラックスしよう");
  }

  if (badBath) {
    advices.push("お風呂は寝る1時間前に入り、体温が下がるタイミングで布団に入ろう");
  }

  if (noExercise) {
    advices.push("夕方までに軽い運動やストレッチをして、心地よい疲れを作ろう");
  }

  if (answers.roomTemp === "hot") {
    advices.push("寝室が少し暑いようなので、涼しく快適な温度（25〜26℃目安）に調整しよう");
  } else if (answers.roomTemp === "cold") {
    advices.push("寝室が寒いと体が緊張するため、寝具や暖房で暖かい環境を作ろう");
  }

  if (isSleepy && advices.length < 3) {
    advices.push("日中の眠気対策に、昼休みは15〜20分以内の短い仮眠をとるのがおすすめ");
  }

  const fallbackAdvices = [
    "寝る直前のスマホや強い光を控え、脳を睡眠モードに切り替えよう",
    "毎日同じ時間に起きて朝日を浴びると、夜の寝つきがさらに良くなります",
    "今の良い生活習慣を続けつつ、体調に合わせて睡眠の質をキープしよう"
  ];

  for (const fb of fallbackAdvices) {
    if (advices.length >= 3) break;
    if (!advices.includes(fb)) {
      advices.push(fb);
    }
  }

  resultAdviceList.innerHTML = "";
  advices.slice(0, 3).forEach((text) => {
    const li = document.createElement("li");
    li.textContent = text;
    resultAdviceList.appendChild(li);
  });
}

function resetQuiz() {
  for (const key in answers) {
    delete answers[key];
  }
  renderTitle();
}

renderTitle();