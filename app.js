let novels = [];
let showingBookmarks = false;

// JSONを読み込む
fetch('novels.json')
  .then(res => res.json())
  .then(data => {
    novels = data;
    renderList();
  });

// 小説リストを表示
function renderList() {
  const list = document.getElementById("novelList");
  const query = document.getElementById("search").value.trim().toLowerCase();
  list.innerHTML = "";

  const filtered = novels.filter(novel => {
    return !showingBookmarks || getBookmarks().includes(novel.url);
  }).filter(novel => {
    return novel.title.toLowerCase().includes(query);
  });

  filtered.forEach(novel => {
    const div = document.createElement("div");
    div.className = "novel";
    div.innerHTML = `
      <strong>${novel.title}</strong> by ${novel.author}
      <span class="bookmark" onclick="toggleBookmark('${novel.url}')">
        ${getBookmarks().includes(novel.url) ? "★" : "☆"}
      </span>
      <div>${novel.summary}</div>
      <a href="${novel.url}" target="_blank">読む</a>
      <button onclick="downloadNovel('${novel.title}', '${novel.url}')">URLを保存</button>
    `;
    list.appendChild(div);
  });
}

// ブックマークを表示
function showBookmarks() {
  showingBookmarks = !showingBookmarks;
  renderList();
}

// ブックマークを取得/切り替え
function getBookmarks() {
  return JSON.parse(localStorage.getItem("bookmarks") || "[]");
}

function toggleBookmark(url) {
  const bookmarks = getBookmarks();
  const index = bookmarks.indexOf(url);
  if (index >= 0) bookmarks.splice(index, 1);
  else bookmarks.push(url);
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  renderList();
}

// ダウンロードボタン処理（URLだけ保存）
function downloadNovel(title, url) {
  const text = `タイトル: ${title}\nURL: ${url}`;
  const blob = new Blob([text], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = title + ".txt";
  a.click();
}