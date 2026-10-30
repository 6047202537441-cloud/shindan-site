// 質問データ（質問文、選択肢、加算するスコア）
const questions = [
  {
    text: "夜、布団に入ってから眠りにつくまでにどのくらいかかりますか？",
    options: [
      { label: "15分未満", score: 0 },
      { label: "15分〜30分程度", score: 1 },
      { label: "30分〜1時間以上", score: 2 }
    ]
  },
  {
    text: "朝起きたとき、スッキリ感はありますか？",
    options: [
      { label: "スッキリ起きられる", score: 0 },
      { label: "たまに身体が重い", score: 1 },
      { label: "いつも疲れが残っている", score: 2 }
    ]
  },
  {
    text: "日中（授業中や午後に）強い眠気を感じますか？",
    options: [
      { label: "あまり感じない", score: 0 },
      { label: "たまに強い眠気がある", score: 1 },
      { label: "毎日激しい眠気がある", score: 2 }
    ]
  }
];

// 結果タイプデータ（Canva画像のファイル名を指定）
const results = {
  good: {
    title: "快眠すやすやタイプ",
    image: "images/result-good.gif", // Canvaで制作したGIF画像
    detail: "素晴らしい睡眠リズムです！論文データでも推奨されている「良好な入眠と質の高い休養」が得られています。"
  },
  caution: {
    title: "ちょっとお疲れタイプ",
    image: "images/result-caution.gif",
    detail: "少し睡眠不足や質の低下が見られます。寝る直前のスマホ操作を控え、温かい飲み物を飲んでリラックスしましょう。"
  },
  warning: {
    title: "睡眠 SOSタイプ",
    image: "images/result-warning.gif",
    detail: "睡眠の質が大きく低下している可能性があります。アンケート結果でも多くの生徒が悩んでいたポイントです。まずは就寝時間を15分早めてみましょう。"
  }
};

let currentQuestionIndex = 0;
let totalScore = 0;

// 画面切り替え処理
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
}

// 診断開始
function startQuiz() {
  currentQuestionIndex = 0;
  totalScore = 0;
  showScreen('quiz-screen');
  displayQuestion();
}

// 質問の表示
function displayQuestion() {
  const currentQ = questions[currentQuestionIndex];
  document.getElementById('progress').innerText = `質問 ${currentQuestionIndex + 1} / ${questions.length}`;
  document.getElementById('question-text').innerText = currentQ.text;
  
  const container = document.getElementById('options-container');
  container.innerHTML = '';

  currentQ.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerText = opt.label;
    btn.onclick = () => handleAnswer(opt.score);
    container.appendChild(btn);
  });
}

// 回答選択時の処理
function handleAnswer(score) {
  totalScore += score;
  currentQuestionIndex++;

  if (currentQuestionIndex < questions.length) {
    displayQuestion();
  } else {
    showResult();
  }
}

// 結果の表示
function showResult() {
  showScreen('result-screen');
  
  let resultData;
  if (totalScore <= 1) {
    resultData = results.good;
  } else if (totalScore <= 3) {
    resultData = results.caution;
  } else {
    resultData = results.warning;
  }

  document.getElementById('result-title').innerText = resultData.title;
  document.getElementById('result-image').src = resultData.image;
  document.getElementById('result-detail').innerText = resultData.detail;
}

// リセット
function resetQuiz() {
  showScreen('start-screen');
}