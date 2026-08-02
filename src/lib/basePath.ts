// Alguns caminhos de asset (imagens brutas, manifest) não são reescritos
// automaticamente pelo basePath do Next quando exportado estaticamente
// (ex: deploy no GitHub Pages em /tamikuamar). Este helper prefixa
// manualmente esses caminhos; fica vazio nos outros deploys (ex: Vercel).
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function withBasePath(path: string): string {
  return `${BASE_PATH}${path}`;
}
