// 表單的瀏覽器端程式：切換身分、檢查欄位（與伺服器共用 validateLead）、送出、顯示結果
import { validateLead, type FieldError } from './lead-schema';

type RoleData = Record<
  string,
  {
    show: Record<string, boolean>;
    required: Record<string, boolean>;
    messageLabel: string;
  }
>;

declare global {
  interface Window {
    turnstile?: { reset: (el?: Element) => void };
  }
}

const ERROR_TEXT: Record<FieldError, string> = {
  required: 'fieldRequired',
  email: 'fieldEmail',
  url: 'fieldUrl',
  tooLong: 'fieldTooLong',
  consent: 'fieldConsent',
  invalid: 'fieldRequired',
};

export function initLeadForms() {
  document.querySelectorAll<HTMLFormElement>('form[data-lead-form]').forEach((form) => {
    if (form.dataset.ready) return;
    form.dataset.ready = '1';
    setupForm(form);
  });
}

function setupForm(form: HTMLFormElement) {
  const roles = JSON.parse(form.dataset.roles ?? '{}') as RoleData;
  const ui = JSON.parse(form.dataset.ui ?? '{}') as Record<string, string>;
  const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const submitText = submit.textContent ?? '';
  const formError = form.querySelector<HTMLElement>('[data-form-error]')!;

  const applyRole = (role: string) => {
    form.dataset.role = role;
    const rules = roles[role];
    if (!rules) return;
    form.querySelectorAll<HTMLButtonElement>('[data-role-button]').forEach((b) => {
      b.setAttribute('aria-pressed', String(b.dataset.roleButton === role));
    });
    for (const key of ['company', 'siteType', 'partnerType', 'module']) {
      const el = form.querySelector<HTMLElement>(`[data-field="${key}"]`);
      if (el && key in rules.show) el.hidden = !rules.show[key];
    }
    const companyLabel = form.querySelector('[data-field="company"] label > span');
    if (companyLabel)
      companyLabel.textContent = companyLabel.textContent!.replace(/ \*$/, '') + ' *';
    const msgLabel = form.querySelector('[data-message-label]');
    const msgSuffix = form.querySelector('[data-message-suffix]');
    if (msgLabel) msgLabel.textContent = rules.messageLabel;
    if (msgSuffix) msgSuffix.textContent = rules.required.message ? ' *' : ui.optional;
    clearErrors();
  };

  form.querySelectorAll<HTMLButtonElement>('[data-role-button]').forEach((b) => {
    b.addEventListener('click', () => applyRole(b.dataset.roleButton!));
  });

  const clearErrors = () => {
    formError.hidden = true;
    form.querySelectorAll<HTMLElement>('[data-error-for]').forEach((p) => {
      p.hidden = true;
      p.textContent = '';
    });
    form.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));
  };

  const showErrors = (errors: Record<string, FieldError>) => {
    let first: HTMLElement | null = null;
    for (const [key, code] of Object.entries(errors)) {
      const p = form.querySelector<HTMLElement>(`[data-error-for="${key}"]`);
      const field = form.querySelector<HTMLElement>(`[name="${key}"]`);
      if (p) {
        p.textContent = ui[ERROR_TEXT[code]] ?? ui.fieldRequired;
        p.hidden = false;
        p.id = `${form.dataset.variant}-${key}-error`;
      }
      if (field) {
        field.setAttribute('aria-invalid', 'true');
        if (p) field.setAttribute('aria-describedby', p.id);
        first ??= field;
      }
    }
    formError.textContent = ui.errorValidation;
    formError.hidden = false;
    // 游標移到畫面上第一個有錯的欄位（依版面順序）
    (form.querySelector<HTMLElement>('[aria-invalid="true"]') ?? first)?.focus();
  };

  const collect = () => {
    const fd = new FormData(form);
    const value = (k: string) => (typeof fd.get(k) === 'string' ? (fd.get(k) as string) : '');
    const params = new URLSearchParams(location.search);
    const optional = (k: string) => value(k) || undefined;
    return {
      variant: form.dataset.variant,
      role: form.dataset.role,
      locale: form.dataset.locale,
      name: value('name'),
      email: value('email'),
      phone: value('phone'),
      company: value('company'),
      website: value('website'),
      organization: value('organization'),
      message: value('message'),
      siteType: optional('siteType'),
      partnerType: optional('partnerType'),
      module: optional('module'),
      modules: fd.getAll('modules').map(String),
      jobRole: optional('jobRole'),
      consent: fd.get('consent') === 'on',
      sourcePage: location.pathname,
      utmSource: params.get('utm_source') ?? '',
      utmMedium: params.get('utm_medium') ?? '',
      utmCampaign: params.get('utm_campaign') ?? '',
      honeypot: value('honeypot'),
      turnstileToken: value('cf-turnstile-response'),
    };
  };

  const fail = (message: string) => {
    formError.textContent = message;
    formError.hidden = false;
    window.turnstile?.reset();
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();
    const payload = collect();
    const checked = validateLead(payload);
    if (!checked.ok) return showErrors(checked.errors);

    submit.disabled = true;
    submit.textContent = ui.sending;
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        leadCode?: string;
        checklistUrl?: string;
        fields?: Record<string, FieldError>;
      };
      if (res.ok && body.ok && body.leadCode) return showSuccess(body.leadCode, body.checklistUrl);
      if (body.error === 'validation' && body.fields) showErrors(body.fields);
      else if (body.error === 'turnstile') fail(ui.errorTurnstile);
      else if (body.error === 'rate_limit') fail(ui.errorRateLimit);
      else fail(ui.errorGeneric + (form.dataset.email ?? ''));
    } catch {
      fail(ui.errorGeneric + (form.dataset.email ?? ''));
    } finally {
      submit.disabled = false;
      submit.textContent = submitText;
    }
  });

  const showSuccess = (code: string, checklistUrl?: string) => {
    const success = form.querySelector<HTMLElement>('[data-success]')!;
    form.querySelector<HTMLElement>('[data-form-body]')!.hidden = true;
    success.querySelector('[data-lead-code]')!.textContent = code;
    const checklist = success.querySelector<HTMLElement>('[data-checklist]')!;
    if (checklistUrl && /^https:\/\//.test(checklistUrl)) {
      success.querySelector<HTMLAnchorElement>('[data-checklist-link]')!.href = checklistUrl;
      checklist.hidden = false;
    }
    success.hidden = false;
    success.focus();
  };
}
