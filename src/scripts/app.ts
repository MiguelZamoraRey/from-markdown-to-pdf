import { hasContent, normalizePastedText } from '../lib/content';
import { renderMarkdown } from '../lib/markdown';
import { computeImageWait, type ImageState } from '../lib/print';
import { THEME_STORAGE_KEY, nextTheme, resolveTheme, type Theme } from '../lib/theme';

const COALESCE_MS = 150;
const IMAGE_WAIT_LIMIT_MS = 3000;

function requireElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (element === null) {
    throw new Error(`No se encontró el elemento ${selector}`);
  }
  return element;
}

const editor = requireElement<HTMLTextAreaElement>('#editor');
const preview = requireElement<HTMLElement>('#preview');
const exportButton = requireElement<HTMLButtonElement>('#export');
const emptyNotice = requireElement<HTMLElement>('#preview-empty');
const themeToggle = requireElement<HTMLButtonElement>('#theme-toggle');
const themeToggleText = requireElement<HTMLElement>('#theme-toggle .theme-toggle__text');
const homeLink = requireElement<HTMLAnchorElement>('#home-link');

let pendingUpdate: number | undefined;

function updatePreview(): void {
  const value = editor.value;

  if (hasContent(value)) {
    preview.innerHTML = renderMarkdown(value);
    exportButton.disabled = false;
    emptyNotice.hidden = true;
  } else {
    preview.innerHTML = '';
    exportButton.disabled = true;
    emptyNotice.hidden = false;
  }
}

function scheduleUpdate(): void {
  if (pendingUpdate !== undefined) {
    window.clearTimeout(pendingUpdate);
  }
  pendingUpdate = window.setTimeout(() => {
    pendingUpdate = undefined;
    updatePreview();
  }, COALESCE_MS);
}

editor.addEventListener('input', scheduleUpdate);

// «Inicio» ya apunta a la pantalla principal: no navega ni descarta el documento (RF-2).
homeLink.addEventListener('click', (event) => {
  if (window.location.pathname === '/') {
    event.preventDefault();
  }
});

editor.addEventListener('paste', (event) => {
  const clipboard = event.clipboardData;
  if (clipboard === null) {
    return;
  }

  event.preventDefault();
  const text = normalizePastedText(clipboard.getData('text/plain'));
  editor.setRangeText(text, editor.selectionStart, editor.selectionEnd, 'end');
  scheduleUpdate();
});

// Sustituye una imagen por el indicador de no disponible (RF-23).
function markImageUnavailable(image: HTMLImageElement): void {
  const replacement = document.createElement('span');
  replacement.className = 'image-unavailable';
  replacement.textContent = 'Imagen no disponible';
  image.replaceWith(replacement);
}

preview.addEventListener(
  'error',
  (event) => {
    const target = event.target;
    if (!(target instanceof HTMLImageElement)) {
      return;
    }

    markImageUnavailable(target);
  },
  true,
);

// Espera a que las imágenes pendientes carguen o fallen, o al límite de 3 s (RF-33).
function waitForImages(images: HTMLImageElement[]): Promise<void> {
  const start = Date.now();

  return new Promise((resolve) => {
    const states = (): ImageState[] => images.map((image) => ({ complete: image.complete }));

    const cleanup = (): void => {
      window.clearTimeout(timer);
      for (const image of images) {
        image.removeEventListener('load', finish);
        image.removeEventListener('error', finish);
      }
    };

    const finish = (): void => {
      if (computeImageWait(states(), Date.now() - start, IMAGE_WAIT_LIMIT_MS).shouldWait) {
        return;
      }
      cleanup();
      resolve();
    };

    const timer = window.setTimeout(finish, IMAGE_WAIT_LIMIT_MS);

    for (const image of images) {
      image.addEventListener('load', finish);
      image.addEventListener('error', finish);
    }

    finish();
  });
}

let exportInProgress = false;

async function exportToPdf(): Promise<void> {
  // Ignora dobles disparos mientras se prepara la impresión (RF-27).
  if (exportInProgress || !hasContent(editor.value)) {
    return;
  }

  exportInProgress = true;
  exportButton.disabled = true;

  try {
    const pending = Array.from(preview.querySelectorAll<HTMLImageElement>('img')).filter(
      (image) => !image.complete,
    );

    if (pending.length > 0) {
      await waitForImages(pending);
    }

    // Al agotarse el límite, las que sigan sin cargar se tratan como no disponibles (RF-33, RF-23).
    for (const image of pending) {
      if (!image.complete) {
        markImageUnavailable(image);
      }
    }

    window.print();
  } finally {
    exportInProgress = false;
    exportButton.disabled = !hasContent(editor.value);
  }
}

exportButton.addEventListener('click', () => {
  void exportToPdf();
});

function currentTheme(): Theme {
  return resolveTheme(document.documentElement.dataset.theme ?? null);
}

function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  const isDark = theme === 'dark';
  themeToggle.setAttribute('aria-pressed', String(isDark));
  themeToggle.setAttribute(
    'aria-label',
    isDark
      ? 'Tema oscuro activo. Cambiar a tema claro.'
      : 'Tema claro activo. Cambiar a tema oscuro.',
  );
  themeToggleText.textContent = isDark ? 'Oscuro' : 'Claro';
}

// Alternar tema sin recargar y sin tocar el editor (RF-5); guardar preferencia (RF-6).
themeToggle.addEventListener('click', () => {
  const theme = nextTheme(currentTheme());
  applyTheme(theme);
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Almacenamiento no disponible: el tema se aplica igualmente (RF-7).
  }
});

applyTheme(currentTheme());

updatePreview();
