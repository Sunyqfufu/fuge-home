-- 福哥的家：仅升级“可编辑收纳地图”
-- 如果 items 表已经建好，请执行本文件，而不是完整 schema.sql。

create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  household_code text not null default 'fuge-home',
  name text not null,
  parent_name text,
  level text not null default 'space' check (level in ('space', 'place')),
  created_at timestamptz not null default now()
);
alter table public.locations enable row level security;
drop policy if exists "家庭成员可查看共享地图" on public.locations;
drop policy if exists "家庭成员可新增共享地图" on public.locations;
drop policy if exists "家庭成员可修改共享地图" on public.locations;
drop policy if exists "家庭成员可删除共享地图" on public.locations;
create policy "家庭成员可查看共享地图" on public.locations for select to anon using (household_code = 'fuge-home');
create policy "家庭成员可新增共享地图" on public.locations for insert to anon with check (household_code = 'fuge-home');
create policy "家庭成员可修改共享地图" on public.locations for update to anon using (household_code = 'fuge-home') with check (household_code = 'fuge-home');
create policy "家庭成员可删除共享地图" on public.locations for delete to anon using (household_code = 'fuge-home');
insert into public.locations (household_code, name, parent_name, level)
select 'fuge-home', seed.name, seed.parent_name, seed.level
from (values
  ('客厅', null, 'space'), ('厨房', null, 'space'), ('阳台', null, 'space'), ('书房', null, 'space'), ('玄关', null, 'space'),
  ('电视柜', '客厅', 'place'), ('茶几收纳格', '客厅', 'place'), ('冰箱', '厨房', 'place'), ('水槽下柜', '厨房', 'place'),
  ('调料抽屉', '厨房', 'place'), ('洗衣柜', '阳台', 'place'), ('清洁杂物柜', '阳台', 'place'),
  ('书桌抽屉', '书房', 'place'), ('工具箱', '书房', 'place'), ('玄关柜', '玄关', 'place'), ('鞋柜', '玄关', 'place')
) as seed(name, parent_name, level)
where not exists (select 1 from public.locations where household_code = 'fuge-home');
