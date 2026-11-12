import { readStore, writeStore } from './studio-data.js';

const panel = document.querySelector('[data-account-panel]');
const encoder = new TextEncoder();
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const accountsKey = 'accounts';
const titles = { login: 'Đăng nhập', register: 'Tạo tài khoản', reset: 'Đặt lại mật khẩu' };

function list(key) {
  const data = readStore(key, []);
  return Array.isArray(data) ? data.filter(item => item && typeof item === 'object') : [];
}

const normalizeEmail = value => value.trim().toLowerCase();
const toHex = bytes => Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
const randomHex = length => toHex(crypto.getRandomValues(new Uint8Array(length)));
const save = (key, data) => {
  if (!writeStore(key, data)) throw new Error('Không lưu được. Hãy kiểm tra quyền lưu trữ của trình duyệt.');
};

async function passwordHash(password, salt) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({
    name: 'PBKDF2', salt: encoder.encode(salt), iterations: 600000, hash: 'SHA-256'
  }, key, 256);
  return toHex(new Uint8Array(bits));
}

async function newPassword(password) {
  const salt = randomHex(16);
  return { salt, hash: await passwordHash(password, salt) };
}

async function recoveryHash(code) {
  const normalized = code.trim().replace(/[\s-]/g, '').toLowerCase();
  return toHex(new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(normalized))));
}

async function newRecovery() {
  const code = randomHex(16).match(/.{8}/g).join('-').toUpperCase();
  return { code, recovery: await recoveryHash(code) };
}

function activeAccount() {
  const session = readStore('user', null);
  return session?.accountId ? list(accountsKey).find(account => account.id === session.accountId) : null;
}

function signIn(account) {
  save('user', { accountId: account.id, name: account.name, email: account.email });
}

function updateAccount(account) {
  save(accountsKey, list(accountsKey).map(existing => existing.id === account.id ? account : existing));
}

function passwordField(name, label, autocomplete = 'new-password') {
  return `<div class="account-password-field">
    <label for="account-${name}">${label}</label>
    <span class="z-password">
      <input id="account-${name}" name="${name}" type="password" required minlength="8" maxlength="128" autocomplete="${autocomplete}">
      <button type="button" data-toggle-password="${name}" aria-label="Hiện ${label.toLowerCase()}" aria-pressed="false">Hiện</button>
    </span>
  </div>`;
}

const createPassword = () => passwordField('password', 'Mật khẩu mới') + passwordField('confirmation', 'Xác nhận mật khẩu');
const status = '<p class="account-status" role="status"></p>';
const submit = label => `<button class="account-primary" type="submit">${label}</button>`;
const emailField = '<label>Email<input name="email" type="email" required maxlength="120" autocomplete="email"></label>';
const nameField = '<label>Họ và tên<input name="name" required minlength="2" maxlength="80" autocomplete="name"></label>';

function focusTitle() {
  panel.querySelector('h2')?.focus({ preventScroll: true });
}

function renderAuth(mode = 'login', { email = '', name = '', message = '', focus = false } = {}) {
  const register = mode === 'register';
  const reset = mode === 'reset';
  panel.innerHTML = `
    <div class="account-tabs" role="group" aria-label="Truy cập tài khoản">
      <button type="button" data-auth="login" aria-pressed="${mode === 'login'}">Đăng nhập</button>
      <button type="button" data-auth="register" aria-pressed="${register}">Đăng ký</button>
    </div>
    <h2 id="account-panel-title" tabindex="-1">${titles[mode]}</h2>
    ${reset ? '<p class="account-help">Nhập email và mã đã lưu khi tạo tài khoản. Mã mới sẽ hiện sau khi đặt lại mật khẩu.</p>' : ''}
    ${message ? '<p class="account-help" data-auth-message></p>' : ''}
    <form class="z-form account-form" data-form="${mode}">
      ${register ? nameField : ''}
      ${emailField}
      ${reset ? '<label>Mã khôi phục<input name="recovery" required maxlength="48" autocomplete="off" spellcheck="false"></label>' : ''}
      ${mode === 'login' ? passwordField('password', 'Mật khẩu', 'current-password') : createPassword()}
      ${mode === 'login' ? '' : '<p class="account-help">Dùng từ 8 ký tự trở lên.</p>'}
      <div class="account-form-actions">
        ${submit(titles[mode])}
        ${mode === 'login' ? '<button class="account-text-button" type="button" data-auth="reset">Quên mật khẩu?</button>' : ''}
      </div>
      ${status}
    </form>`;
  panel.querySelector('[name=email]').value = email;
  if (register) panel.querySelector('[name=name]').value = name;
  if (message) panel.querySelector('[data-auth-message]').textContent = message;
  if (focus) focusTitle();
}

function renderProfile(account, { code = '', message = '', focus = false } = {}) {
  panel.innerHTML = `
    <div class="account-profile-header">
      <h2 id="account-panel-title" tabindex="-1">Hồ sơ cá nhân</h2>
      <button class="account-text-button" type="button" data-logout>Đăng xuất</button>
    </div>
    <dl class="account-profile">
      <div><dt>Họ và tên</dt><dd data-profile-name></dd></div>
      <div><dt>Email</dt><dd data-profile-email></dd></div>
    </dl>
    <p class="account-status" role="status" data-profile-status></p>
    ${code ? `<div class="account-recovery">
      <label for="account-recovery-code">Mã khôi phục của bạn</label>
      <input id="account-recovery-code" value="${code}" readonly spellcheck="false">
      <p class="account-help">Lưu mã này ở nơi riêng tư. Mã chỉ hiện tại đây và dùng được một lần.</p>
      <button class="account-text-button" type="button" data-copy-code>Sao chép mã</button>
    </div>` : ''}
    <details>
      <summary>Chỉnh sửa hồ sơ</summary>
      <form class="z-form account-form" data-form="profile">
        ${nameField}
        ${emailField}
        ${submit('Lưu hồ sơ')}
        ${status}
      </form>
    </details>
    <details>
      <summary>Đổi mật khẩu</summary>
      <form class="z-form account-form" data-form="password">
        ${passwordField('current', 'Mật khẩu hiện tại', 'current-password')}
        ${createPassword()}
        <p class="account-help">Dùng từ 8 ký tự trở lên. Sau khi đổi, hãy lưu mã khôi phục mới.</p>
        ${submit('Đổi mật khẩu')}
        ${status}
      </form>
    </details>`;
  panel.querySelector('[data-profile-name]').textContent = account.name;
  panel.querySelector('[data-profile-email]').textContent = account.email;
  panel.querySelector('[data-profile-status]').textContent = message;
  panel.querySelector('[name=name]').value = account.name;
  panel.querySelector('[name=email]').value = account.email;
  if (focus) focusTitle();
}

function renderInitial() {
  const account = activeAccount();
  if (account) {
    renderProfile(account);
    return;
  }
  const previous = readStore('user', null);
  const legacy = previous?.email && !previous.accountId;
  const registered = legacy && list(accountsKey).some(item => item.email === normalizeEmail(previous.email));
  renderAuth(legacy && !registered ? 'register' : 'login', {
    email: legacy ? previous.email : '',
    name: legacy ? previous.name : '',
    message: legacy && !registered ? 'Hồ sơ cũ cần tạo mật khẩu để đăng nhập.' : ''
  });
}

function confirmPassword(data) {
  if (data.password.length < 8) throw new Error('Mật khẩu cần từ 8 ký tự trở lên.');
  if (data.password !== data.confirmation) throw new Error('Hai mật khẩu chưa khớp.');
}

async function handleForm(mode, data) {
  const email = data.email ? normalizeEmail(data.email) : '';
  const name = data.name?.trim();
  const accounts = list(accountsKey);
  const matched = accounts.find(account => account.email === email);

  if (mode === 'login') {
    if (!matched || await passwordHash(data.password, matched.salt) !== matched.hash) {
      throw new Error('Email hoặc mật khẩu chưa đúng.');
    }
    signIn(matched);
    renderProfile(matched, { focus: true });
    return;
  }

  if (mode === 'register') {
    if (name.length < 2) throw new Error('Họ và tên cần ít nhất 2 ký tự.');
    if (matched) throw new Error('Email này đã có tài khoản. Hãy đăng nhập hoặc đặt lại mật khẩu.');
    confirmPassword(data);
    const credentials = await newPassword(data.password);
    const { code, recovery } = await newRecovery();
    const account = { id: randomHex(16), name, email, ...credentials, recovery };
    save(accountsKey, [...accounts, account]);
    signIn(account);
    renderProfile(account, { code, message: 'Đã tạo tài khoản.', focus: true });
    return;
  }

  if (mode === 'reset') {
    confirmPassword(data);
    if (!matched || await recoveryHash(data.recovery) !== matched.recovery) {
      throw new Error('Email hoặc mã khôi phục chưa đúng.');
    }
    const credentials = await newPassword(data.password);
    const { code, recovery } = await newRecovery();
    const account = { ...matched, ...credentials, recovery };
    updateAccount(account);
    signIn(account);
    renderProfile(account, { code, message: 'Đã đặt lại mật khẩu.', focus: true });
    return;
  }

  const account = activeAccount();
  if (!account) throw new Error('Phiên đăng nhập đã kết thúc. Hãy tải lại trang và đăng nhập.');

  if (mode === 'profile') {
    if (name.length < 2) throw new Error('Họ và tên cần ít nhất 2 ký tự.');
    if (matched && matched.id !== account.id) throw new Error('Email này đã được dùng cho tài khoản khác.');
    const updated = { ...account, name, email };
    updateAccount(updated);
    signIn(updated);
    const code = panel.querySelector('#account-recovery-code')?.value;
    renderProfile(updated, { code, message: 'Đã lưu hồ sơ.', focus: true });
    return;
  }

  confirmPassword(data);
  if (await passwordHash(data.current, account.salt) !== account.hash) {
    throw new Error('Mật khẩu hiện tại chưa đúng.');
  }
  const credentials = await newPassword(data.password);
  const { code, recovery } = await newRecovery();
  const updated = { ...account, ...credentials, recovery };
  updateAccount(updated);
  renderProfile(updated, { code, message: 'Đã đổi mật khẩu.', focus: true });
}

let busy = false;

panel.addEventListener('submit', async event => {
  event.preventDefault();
  if (busy) return;
  const form = event.target;
  const data = Object.fromEntries(new FormData(form));
  const feedback = form.querySelector('[role=status]');
  const controls = [...form.elements].filter(control => !control.disabled);
  busy = true;
  controls.forEach(control => { control.disabled = true; });
  feedback.classList.remove('is-error');
  feedback.textContent = 'Đang xử lý…';
  try {
    if (!globalThis.crypto?.subtle) throw new Error('Hãy mở trang bằng localhost hoặc HTTPS để sử dụng mật khẩu.');
    const run = () => handleForm(form.dataset.form, data);
    if (navigator.locks) await navigator.locks.request('zephyron-accounts', run);
    else await run();
  } catch (error) {
    feedback.classList.add('is-error');
    feedback.textContent = error.message;
  } finally {
    controls.forEach(control => { control.disabled = false; });
    busy = false;
  }
});

panel.addEventListener('click', async event => {
  const button = event.target.closest('button');
  if (!button || busy) return;

  if (button.dataset.auth) {
    const email = panel.querySelector('[name=email]')?.value ?? '';
    renderAuth(button.dataset.auth, { email, focus: true });
  } else if (button.dataset.togglePassword) {
    const input = button.form.elements[button.dataset.togglePassword];
    const showing = input.type === 'password';
    input.type = showing ? 'text' : 'password';
    button.textContent = showing ? 'Ẩn' : 'Hiện';
    button.setAttribute('aria-label', button.textContent + ' ' + input.labels[0].textContent.toLowerCase());
    button.setAttribute('aria-pressed', String(showing));
  } else if (button.hasAttribute('data-logout')) {
    if (writeStore('user', null)) renderAuth('login', { message: 'Đã đăng xuất.', focus: true });
    else panel.querySelector('[data-profile-status]').textContent = 'Không đăng xuất được. Hãy kiểm tra quyền lưu trữ.';
  } else if (button.hasAttribute('data-copy-code')) {
    const field = panel.querySelector('#account-recovery-code');
    try {
      await navigator.clipboard.writeText(field.value);
      panel.querySelector('[data-profile-status]').textContent = 'Đã sao chép mã khôi phục.';
    } catch {
      field.focus();
      field.select();
    }
  }
});

function updateCounts() {
  document.querySelector('[data-saved-count]').textContent = list('saved').length + ' bản phối';
  document.querySelector('[data-favorite-count]').textContent = list('dreamCars').length + ' cấu hình yêu thích';
}

window.addEventListener('pageshow', event => {
  updateCounts();
  if (event.persisted && !panel.querySelector('[data-copy-code]')) renderInitial();
});
window.addEventListener('storage', event => {
  updateCounts();
  if (event.key === 'zuzong.user' && !busy) renderInitial();
});

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    if (!reduceMotion.matches) entry.target.classList.add('account-revealed');
    observer.disconnect();
  }, { threshold: 0.15 });
  observer.observe(document.querySelector('[data-account-reveal]'));
}

renderInitial();
updateCounts();
