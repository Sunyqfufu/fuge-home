-- 福哥的家：多人共享物品库（V1）
-- 在 Supabase Dashboard → SQL Editor → New query 中完整粘贴并点击 Run。

create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  household_code text not null default 'fuge-home',
  name text not null,
  category text not null default '其他',
  location text not null,
  quantity text not null default '1 件',
  expiry text,
  status text not null default '未开封',
  icon text not null default '📦',
  note text,
  created_at timestamptz not null default now()
);

alter table public.items enable row level security;

create policy "家庭成员可查看共享物品"
on public.items for select to anon using (household_code = 'fuge-home');

create policy "家庭成员可新增共享物品"
on public.items for insert to anon with check (household_code = 'fuge-home');

create policy "家庭成员可删除共享物品"
on public.items for delete to anon using (household_code = 'fuge-home');
