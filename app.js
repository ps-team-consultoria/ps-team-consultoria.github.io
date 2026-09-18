'use strict';
// Confirmed business number in international format, digits only.
const BUSINESS_WHATSAPP = '5511985695389';
const INJURY_OPTIONS = {
  'Nenhuma lesão informada': ['Não se aplica'],
  'Ombro': ['Tendinopatia do manguito rotador', 'Impacto subacromial', 'Bursite no ombro', 'Luxação ou instabilidade'],
  'Cotovelo e punho': ['Epicondilite lateral', 'Epicondilite medial', 'Tendinopatia no punho', 'Síndrome do túnel do carpo'],
  'Coluna': ['Hérnia de disco', 'Lombalgia', 'Ciatalgia', 'Escoliose ou desvio postural doloroso'],
  'Quadril': ['Bursite trocantérica', 'Impacto femoroacetabular', 'Tendinopatia dos glúteos', 'Dor tipo síndrome do piriforme'],
  'Joelho': ['Osgood-Schlatter', 'Condromalácia ou dor patelofemoral', 'Tendinopatia patelar', 'Lesão meniscal'],
  'Tornozelo e pé': ['Entorse de tornozelo', 'Fascite plantar', 'Tendinopatia de Aquiles', 'Canelite'],
  'Peitoral e costas': ['Distensão muscular', 'Contratura ou dor muscular recorrente', 'Tendinopatia na inserção', 'Dor durante puxadas, remadas ou empurradas'],
  'Coxa, glúteos e panturrilha': ['Distensão muscular', 'Tendinopatia proximal', 'Cãibra ou dor recorrente', 'Limitação de mobilidade'],
  'Outro diagnóstico': ['Tenho diagnóstico específico', 'Sinto dor, mas não tenho diagnóstico', 'Estou em tratamento', 'Prefiro explicar no campo livre']
};
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#nav');
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
  nav.classList.remove('is-open');
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  nav.classList.toggle('is-open', open);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
document.addEventListener('click', event => { if (!event.target.closest('.header')) closeMenu(); });
window.matchMedia('(min-width: 621px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
document.querySelector('#year').textContent = String(new Date().getFullYear());

const dialog = document.querySelector('#summary-dialog');
const summaryText = document.querySelector('#summary-text');
const copyStatus = document.querySelector('#copy-status');
const form = document.querySelector('#interest-form');
const injuryRegion = document.querySelector('#injury-region');
const injuryType = document.querySelector('#injury-type');
const injuryDetails = document.querySelector('#injury-details');
const detailsCount = document.querySelector('#details-count');
const whatsappLink = document.querySelector('#whatsapp-link');
let previousFocus;

function fillInjuryOptions(region) {
  injuryType.innerHTML = '';
  INJURY_OPTIONS[region].forEach(option => {
    const item = document.createElement('option');
    item.value = option;
    item.textContent = option;
    injuryType.append(item);
  });
}

function updateDetailsCount() {
  detailsCount.textContent = String(injuryDetails.value.length);
}

fillInjuryOptions(injuryRegion.value);
updateDetailsCount();
injuryRegion.addEventListener('change', () => fillInjuryOptions(injuryRegion.value));
injuryDetails.addEventListener('input', updateDetailsCount);

form.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(form);
  const goal = data.get('goal');
  const weight = data.get('weight');
  const height = data.get('height');
  const frequency = data.get('frequency');
  const region = data.get('injuryRegion');
  const injury = data.get('injuryType');
  const details = String(data.get('injuryDetails') || '').trim();
  const injurySummary = region === 'Nenhuma lesão informada'
    ? 'Nenhuma lesão informada.'
    : `${region} — ${injury}.${details ? `\nDetalhes: ${details}` : ''}`;
  summaryText.value = `Olá, P.S. TEAM! Tenho interesse na consultoria online.\n\nObjetivo principal: ${goal}.\nPeso atual: ${weight}.\nAltura: ${height}.\nFrequência desejada: ${frequency}.\nLesão, dor ou limitação: ${injurySummary}\nPlano de interesse: R$85,00 por 40 dias de acompanhamento.\n\nGostaria de saber como começar!`;
  copyStatus.textContent = '';
  const validNumber = /^\d{10,15}$/.test(BUSINESS_WHATSAPP);
  if (validNumber) whatsappLink.href = `https://wa.me/${BUSINESS_WHATSAPP}?text=${encodeURIComponent(summaryText.value)}`;
  previousFocus = document.activeElement;
  dialog.showModal();
  document.querySelector('#close-dialog').focus();
});
document.querySelector('#close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target === dialog) {
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  }
});
dialog.addEventListener('close', () => { previousFocus?.focus({ preventScroll: true }); });
document.querySelector('#copy-summary').addEventListener('click', async () => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(summaryText.value);
    } else {
      summaryText.focus(); summaryText.select();
      if (!document.execCommand('copy')) throw new Error('Clipboard unavailable');
    }
    copyStatus.textContent = 'Resumo copiado! Você decide quando e para quem enviar.';
  } catch {
    summaryText.focus(); summaryText.select();
    copyStatus.textContent = 'Selecione e copie o texto acima usando a opção Copiar do seu aparelho.';
  }
});
