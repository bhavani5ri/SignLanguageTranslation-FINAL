// js/app.js — UI logic & state management

// ── State ────────────────────────────────────────────────────────
let currentPage = 1;
const HISTORY_PAGE_SIZE = 10;

// ── On Load ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initAuth();
  animateHeroOutput();
  highlightNavOnScroll();
});

// ── Auth state ───────────────────────────────────────────────────
function initAuth() {
  const user = api.getUser();
  const token = api.getToken();
  if (user && token) {
    setLoggedInUI(user);
    loadHistory();
  }
}

function setLoggedInUI(user) {
  document.getElementById('navAuth').style.display = 'none';
  document.getElementById('navUser').style.display = 'flex';
  document.getElementById('navUsername').textContent = user.name || user.email;
  document.getElementById('historyNavLink').style.display = '';
  document.getElementById('historyLoginPrompt').style.display = 'none';
  document.getElementById('historyList').style.display = 'flex';
}

function setLoggedOutUI() {
  document.getElementById('navAuth').style.display = 'flex';
  document.getElementById('navUser').style.display = 'none';
  document.getElementById('historyNavLink').style.display = 'none';
  document.getElementById('historyLoginPrompt').style.display = 'block';
  document.getElementById('historyList').style.display = 'none';
  document.getElementById('historyList').innerHTML = '';
  document.getElementById('historyEmpty').style.display = 'none';
  document.getElementById('historyPagination').innerHTML = '';
}

// ── Modal ────────────────────────────────────────────────────────
function showModal(type) {
  document.getElementById('modalOverlay').classList.add('open');
  document.getElementById('registerForm').style.display = type === 'register' ? 'block' : 'none';
  document.getElementById('loginForm').style.display = type === 'login' ? 'block' : 'none';
  document.getElementById('regError').textContent = '';
  document.getElementById('loginError').textContent = '';
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// ── Register ─────────────────────────────────────────────────────
async function register() {
  const name     = document.getElementById('regName').value.trim();
  const email    = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const errEl    = document.getElementById('regError');
  errEl.textContent = '';

  if (!name || !email || !password) {
    errEl.textContent = 'All fields are required.';
    return;
  }

  const btn = event.target;
  btn.disabled = true; btn.textContent = 'Creating account…';

  try {
    const { data } = await api.register(name, email, password);
    api.setToken(data.token);
    api.setUser(data.user);
    closeModal();
    setLoggedInUI(data.user);
    showToast('Account created! Welcome to SignBridge 🎉', 'success');
    loadHistory();
  } catch (err) {
    errEl.textContent = err.message;
  } finally {
    btn.disabled = false; btn.textContent = 'Create Account';
  }
}

// ── Login ────────────────────────────────────────────────────────
async function login() {
  const email    = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const errEl    = document.getElementById('loginError');
  errEl.textContent = '';

  if (!email || !password) {
    errEl.textContent = 'Email and password are required.';
    return;
  }

  const btn = event.target;
  btn.disabled = true; btn.textContent = 'Logging in…';

  try {
    const { data } = await api.login(email, password);
    api.setToken(data.token);
    api.setUser(data.user);
    closeModal();
    setLoggedInUI(data.user);
    showToast(`Welcome back, ${data.user.name}!`, 'success');
    loadHistory();
  } catch (err) {
    errEl.textContent = err.message;
  } finally {
    btn.disabled = false; btn.textContent = 'Login';
  }
}

// ── Logout ───────────────────────────────────────────────────────
function logout() {
  api.clearAuth();
  setLoggedOutUI();
  showToast('Logged out successfully.', 'success');
}

// ── Save Translation ─────────────────────────────────────────────
async function saveTranslation() {
  const token = api.getToken();
  if (!token) {
    showModal('login');
    return;
  }

  const text       = document.getElementById('translationTextarea').value.trim();
  const lang       = document.getElementById('sourceLang').value;
  const confidence = parseFloat(document.getElementById('confidenceSlider').value);
  const alertEl    = document.getElementById('translateAlert');
  alertEl.className = 'translate__alert';
  alertEl.style.display = 'none';

  if (!text) {
    alertEl.textContent = 'Please enter some translated text first.';
    alertEl.className = 'translate__alert error';
    return;
  }

  const btn = document.getElementById('saveBtn');
  btn.disabled = true; btn.innerHTML = '<span>Saving…</span>';

  try {
    await api.saveTranslation(text, lang, confidence);
    alertEl.textContent = '✓ Translation saved to your history!';
    alertEl.className = 'translate__alert success';
    document.getElementById('translationTextarea').value = '';
    currentPage = 1;
    loadHistory();
    showToast('Translation saved!', 'success');
  } catch (err) {
    alertEl.textContent = err.message;
    alertEl.className = 'translate__alert error';
  } finally {
    btn.disabled = false;
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17,21 17,13 7,13 7,21"/><polyline points="7,3 7,8 15,8"/></svg> Save Translation`;
  }
}

function clearTranslation() {
  document.getElementById('translationTextarea').value = '';
  const alertEl = document.getElementById('translateAlert');
  alertEl.className = 'translate__alert';
  alertEl.style.display = 'none';
}

// ── Text to Speech ───────────────────────────────────────────────
function speakText() {
  const text = document.getElementById('translationTextarea').value.trim();
  if (!text) { showToast('No text to speak!', 'error'); return; }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 0.9; utt.pitch = 1;
    window.speechSynthesis.speak(utt);
    showToast('Speaking…', 'success');
  } else {
    showToast('Text-to-speech not supported in this browser.', 'error');
  }
}

// ── History ──────────────────────────────────────────────────────
async function loadHistory() {
  if (!api.getToken()) return;

  const lang    = document.getElementById('historyLangFilter').value;
  const listEl  = document.getElementById('historyList');
  const emptyEl = document.getElementById('historyEmpty');
  const pagEl   = document.getElementById('historyPagination');

  listEl.innerHTML = '<div style="padding:2rem;color:var(--text-muted);text-align:center;">Loading…</div>';
  listEl.style.display = 'flex';
  emptyEl.style.display = 'none';
  pagEl.innerHTML = '';

  try {
    const { data } = await api.getHistory(currentPage, HISTORY_PAGE_SIZE, lang);
    const { translations, pagination } = data;

    listEl.innerHTML = '';

    if (!translations.length) {
      listEl.style.display = 'none';
      emptyEl.style.display = 'block';
      return;
    }

    translations.forEach((t, i) => {
      const item = document.createElement('div');
      item.className = 'history__item';
      item.style.animationDelay = `${i * 0.05}s`;
      item.innerHTML = `
        <div class="history__item-icon">🤟</div>
        <div class="history__item-body">
          <div class="history__item-text">${escapeHtml(t.translatedText)}</div>
          <div class="history__item-meta">
            <span class="history__item-lang">${t.sourceLanguage || 'ASL'}</span>
            <span class="history__item-time">${formatDate(t.timestamp)}</span>
            ${t.confidence != null ? `<span class="history__item-confidence">Conf: ${(t.confidence * 100).toFixed(0)}%</span>` : ''}
          </div>
        </div>
        <div class="history__item-actions">
          <button class="history__delete-btn" onclick="deleteTranslation('${t._id}')" title="Delete">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
          </button>
        </div>
      `;
      listEl.appendChild(item);
    });

    // Pagination
    if (pagination.totalPages > 1) {
      for (let p = 1; p <= pagination.totalPages; p++) {
        const btn = document.createElement('button');
        btn.className = `history__page-btn${p === currentPage ? ' active' : ''}`;
        btn.textContent = p;
        btn.onclick = () => { currentPage = p; loadHistory(); };
        pagEl.appendChild(btn);
      }
    }
  } catch (err) {
    listEl.innerHTML = `<div style="padding:2rem;color:var(--red);text-align:center;">${err.message}</div>`;
    if (err.message.includes('expired') || err.message.includes('token')) {
      api.clearAuth(); setLoggedOutUI();
    }
  }
}

async function deleteTranslation(id) {
  if (!confirm('Delete this translation?')) return;
  try {
    await api.deleteTranslation(id);
    showToast('Translation deleted.', 'success');
    loadHistory();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// ── Utilities ────────────────────────────────────────────────────
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  setTimeout(() => { toast.className = 'toast'; }, 3500);
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
         ' · ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

// ── Hero cycling text ─────────────────────────────────────────────
function animateHeroOutput() {
  const phrases = [
    'Hello, how are you?',
    'Nice to meet you.',
    'I need help.',
    'Thank you very much!',
    'Where is the bathroom?',
    'I love you.',
    'Please speak slowly.',
  ];
  let i = 0;
  const el = document.getElementById('heroOutput');
  if (!el) return;
  setInterval(() => {
    i = (i + 1) % phrases.length;
    el.style.opacity = '0';
    setTimeout(() => {
      el.textContent = phrases[i];
      el.style.transition = 'opacity 0.4s';
      el.style.opacity = '1';
    }, 300);
  }, 2800);
}

// ── Active nav on scroll ──────────────────────────────────────────
function highlightNavOnScroll() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav__link');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 100) current = s.id;
    });
    links.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === '#' + current);
    });
  }, { passive: true });
}
