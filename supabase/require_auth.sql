-- Tamikuã Mar — exige login para ler/escrever nos dados
-- IMPORTANTE: só rode este script DEPOIS de confirmar que o login está
-- funcionando no site (com o usuário criado em Authentication > Users).
-- Antes disso, os dados ficam liberados para qualquer um com a chave
-- pública do projeto; depois de rodar, só quem estiver logado consegue
-- ler ou alterar qualquer coisa.

drop policy if exists "public access" on stays;
create policy "authenticated access" on stays
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "public access" on task_completions;
create policy "authenticated access" on task_completions
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "public access" on schedules;
create policy "authenticated access" on schedules
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "public access" on settings;
create policy "authenticated access" on settings
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
