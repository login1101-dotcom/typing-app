// ▼ URLパラメータからファイル取得
const params = new URLSearchParams(window.location.search);
const file = params.get("file");

// ▼ 問題リスト
let problems = [];
let index = 0;
let romaPos = 0;

// ▼ 表示更新
function show() {
  const p = problems[index];
  document.getElementById("questionHira").textContent = p.hira;
  document.getElementById("questionRoma").textContent = p.roman.slice(romaPos);
}

// ▼ キー送信（iframe）
function send(key, down){
  const kb = document.getElementById("kb").contentWindow;
  kb.postMessage({key, down}, "*");
}

// ▼ fetchで問題読み込み
async function loadProblems() {
  const res = await fetch(file);
  const text = await res.text();
  const lines = text.trim().split("\n");

  problems = lines.map(line => {
    const [hira, roman] = line.split(",");
    return { hira, roman };
  });

  show();
}

// ▼ keydown
document.addEventListener("keydown", e => {
  const key = e.key;

  if (["Tab","CapsLock","/"].includes(key)) e.preventDefault();

  send(key, true);

  const p = problems[index];
  if (key === p.roman[romaPos]) {
    romaPos++;
    if (romaPos >= p.roman.length) {
      index = (index + 1) % problems.length;
      romaPos = 0;
    }
    show();
  }
});

// ▼ keyup
document.addEventListener("keyup", e => {
  const key = e.key;
  if (["Tab","CapsLock","/"].includes(key)) e.preventDefault();
  send(key, false);
});

// ▼ 読込開始
loadProblems();
