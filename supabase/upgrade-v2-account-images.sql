-- 福哥的家 V2：账号、头像、物品图片和保质期。
-- 在 Supabase → SQL Editor 中执行一次。

alter table public.items add column if not exists image_url text;
alter table public.items add column if not exists expiry date;

-- 公开读取、可上传的物品照片空间。V1 的共享链接模式下，任何拿到链接的家庭成员可上传图片。
insert into storage.buckets (id, name, public)
values ('fuge-images', 'fuge-images', true)
on conflict (id) do update set public = true;

drop policy if exists "家庭成员可查看物品图片" on storage.objects;
drop policy if exists "家庭成员可上传物品图片" on storage.objects;
create policy "家庭成员可查看物品图片" on storage.objects for select to anon using (bucket_id = 'fuge-images');
create policy "家庭成员可上传物品图片" on storage.objects for insert to anon with check (bucket_id = 'fuge-images');

-- 登录后可保存自己的头像。头像数据仅本人可读写。
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_data text,
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
drop policy if exists "用户可查看自己的资料" on public.profiles;
drop policy if exists "用户可新增自己的资料" on public.profiles;
drop policy if exists "用户可修改自己的资料" on public.profiles;
create policy "用户可查看自己的资料" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "用户可新增自己的资料" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "用户可修改自己的资料" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
