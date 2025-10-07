-- public."profiles"
create table public.profiles (
  id uuid not null,
  email text null,
  created_at timestamp without time zone not null default CURRENT_TIMESTAMP,
  updated_at timestamp without time zone not null default CURRENT_TIMESTAMP,
  constraint profiles_pkey primary key (id)
) TABLESPACE pg_default;
