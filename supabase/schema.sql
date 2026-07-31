-- Tamikuã Mar — esquema do banco de dados
-- Rode este script inteiro no SQL Editor do seu projeto Supabase (Dashboard > SQL Editor > New query).

create extension if not exists "pgcrypto";

create table if not exists stays (
  id uuid primary key default gen_random_uuid(),
  room_id text not null,
  guest_name text not null,
  adults int not null default 0,
  children int not null default 0,
  check_in_date date not null,
  check_out_date date not null,
  check_in_time text not null default '14:00',
  check_out_time text not null default '12:00',
  notes text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists task_completions (
  id text primary key,
  date date not null,
  room_id text not null,
  type text not null,
  completed boolean not null default false,
  completed_at timestamptz
);

create table if not exists schedules (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  type text not null,
  generated_message text not null,
  snapshot jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists settings (
  id int primary key default 1,
  pousada_name text not null default 'Tamikuã Mar',
  default_checkin_time text not null default '14:00',
  default_checkout_time text not null default '12:00',
  people_per_table int not null default 2,
  greeting_message text not null default 'Boa tarde, Tamikuã Mar! 🌅',
  closing_message text not null default 'Bom descanso a todos! 😴',
  constraint settings_singleton check (id = 1)
);

insert into settings (id) values (1)
on conflict (id) do nothing;

-- Segurança: como o app ainda não tem login, liberamos leitura/escrita
-- para a chave anônima (protegida apenas pela própria URL/chave do projeto).
alter table stays enable row level security;
alter table task_completions enable row level security;
alter table schedules enable row level security;
alter table settings enable row level security;

drop policy if exists "public access" on stays;
create policy "public access" on stays for all using (true) with check (true);

drop policy if exists "public access" on task_completions;
create policy "public access" on task_completions for all using (true) with check (true);

drop policy if exists "public access" on schedules;
create policy "public access" on schedules for all using (true) with check (true);

drop policy if exists "public access" on settings;
create policy "public access" on settings for all using (true) with check (true);

-- Ativa sincronização em tempo real (necessário para atualizar todos os
-- aparelhos automaticamente quando algo muda).
alter publication supabase_realtime add table stays;
alter publication supabase_realtime add table task_completions;
alter publication supabase_realtime add table schedules;
alter publication supabase_realtime add table settings;
