
grant select on table public.badges to anon, authenticated;
grant insert, update, delete on table public.badges to authenticated;
grant select on table public.user_badges to anon, authenticated;
grant insert, update, delete on table public.user_badges to authenticated;
revoke all on table public.void_role_feature_grants from anon, public;
grant select, insert, update, delete on table public.void_role_feature_grants to authenticated;

drop policy if exists badges_admin_insert on public.badges;
create policy badges_admin_insert on public.badges for insert to authenticated
with check (exists (select 1 from public.user_roles r where r.user_id = (select auth.uid()) and r.role = 'admin'));
drop policy if exists badges_admin_update on public.badges;
create policy badges_admin_update on public.badges for update to authenticated
using (exists (select 1 from public.user_roles r where r.user_id = (select auth.uid()) and r.role = 'admin'))
with check (exists (select 1 from public.user_roles r where r.user_id = (select auth.uid()) and r.role = 'admin'));
drop policy if exists badges_admin_delete on public.badges;
create policy badges_admin_delete on public.badges for delete to authenticated
using (exists (select 1 from public.user_roles r where r.user_id = (select auth.uid()) and r.role = 'admin'));

drop policy if exists user_badges_admin_select on public.user_badges;
create policy user_badges_admin_select on public.user_badges for select to authenticated
using (exists (select 1 from public.user_roles r where r.user_id = (select auth.uid()) and r.role = 'admin'));
drop policy if exists user_badges_admin_insert on public.user_badges;
create policy user_badges_admin_insert on public.user_badges for insert to authenticated
with check (awarded_by = (select auth.uid()) and exists (select 1 from public.user_roles r where r.user_id = (select auth.uid()) and r.role = 'admin'));
drop policy if exists user_badges_admin_delete on public.user_badges;
create policy user_badges_admin_delete on public.user_badges for delete to authenticated
using (exists (select 1 from public.user_roles r where r.user_id = (select auth.uid()) and r.role = 'admin'));

drop policy if exists void_role_features_admin_select on public.void_role_feature_grants;
create policy void_role_features_admin_select on public.void_role_feature_grants for select to authenticated
using (exists (select 1 from public.user_roles r where r.user_id = (select auth.uid()) and r.role = 'admin'));
drop policy if exists void_role_features_admin_insert on public.void_role_feature_grants;
create policy void_role_features_admin_insert on public.void_role_feature_grants for insert to authenticated
with check (exists (select 1 from public.user_roles r where r.user_id = (select auth.uid()) and r.role = 'admin') and (updated_by = (select auth.uid()) or updated_by is null));
drop policy if exists void_role_features_admin_update on public.void_role_feature_grants;
create policy void_role_features_admin_update on public.void_role_feature_grants for update to authenticated
using (exists (select 1 from public.user_roles r where r.user_id = (select auth.uid()) and r.role = 'admin'))
with check (exists (select 1 from public.user_roles r where r.user_id = (select auth.uid()) and r.role = 'admin') and (updated_by = (select auth.uid()) or updated_by is null));
drop policy if exists void_role_features_admin_delete on public.void_role_feature_grants;
create policy void_role_features_admin_delete on public.void_role_feature_grants for delete to authenticated
using (exists (select 1 from public.user_roles r where r.user_id = (select auth.uid()) and r.role = 'admin'));
