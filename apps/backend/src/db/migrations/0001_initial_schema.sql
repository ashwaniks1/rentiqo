create table if not exists schema_migrations (
  migration_id text primary key,
  applied_at timestamptz not null default now()
);

create table if not exists users (
  user_id text primary key,
  email text not null unique,
  password text not null,
  role text not null check (role in ('consumer', 'agent', 'admin'))
);

create table if not exists user_preferences (
  user_id text primary key references users(user_id) on delete cascade,
  notifications jsonb not null default '{"push": true, "email": true}'::jsonb,
  search jsonb not null default '{}'::jsonb
);

create table if not exists sessions (
  session_id text primary key,
  user_id text not null references users(user_id) on delete cascade,
  access_token text not null unique,
  refresh_token text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists listings (
  listing_id text primary key,
  price numeric not null,
  beds integer not null,
  baths integer not null,
  city text not null,
  state text not null,
  status text not null,
  description text,
  media_urls jsonb not null default '[]'::jsonb,
  price_history jsonb not null default '[]'::jsonb,
  agent_id text not null,
  property_type text not null,
  listing_status text not null,
  history jsonb not null default '[]'::jsonb
);

create table if not exists saved_homes (
  user_id text not null references users(user_id) on delete cascade,
  listing_id text not null references listings(listing_id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, listing_id)
);

create table if not exists saved_searches (
  saved_search_id text primary key,
  user_id text not null references users(user_id) on delete cascade,
  query_fingerprint text not null,
  channels jsonb not null default '{"push": true, "email": true}'::jsonb,
  criteria jsonb not null default '{}'::jsonb
);

create table if not exists leads (
  lead_id text primary key,
  listing_id text not null references listings(listing_id) on delete cascade,
  user_id text not null references users(user_id) on delete cascade,
  agent_id text not null,
  lead_type text not null check (lead_type in ('contact_request', 'tour_request')),
  message text,
  preferred_windows jsonb not null default '[]'::jsonb,
  status text not null check (status in ('new', 'acknowledged', 'in_progress', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists moderation_cases (
  case_id text primary key,
  target_type text not null check (target_type in ('listing', 'user', 'agent')),
  target_id text not null,
  reason_code text not null,
  severity text not null check (severity in ('low', 'medium', 'high')),
  status text not null check (status in ('open', 'reviewing', 'resolved')),
  action_taken text,
  resolution_notes text,
  reason_for_action text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists audit_events (
  audit_event_id text primary key,
  actor_id text not null,
  action text not null,
  target_type text not null,
  target_id text not null,
  details jsonb,
  timestamp timestamptz not null default now()
);

create table if not exists agent_profiles (
  agent_id text primary key references users(user_id) on delete cascade,
  service_areas jsonb not null default '[]'::jsonb,
  is_verified boolean not null default false
);

insert into users (user_id, email, password, role)
values
  ('user-0001', 'buyer@rentiqo.dev', 'password123', 'consumer'),
  ('agent-0001', 'agent@rentiqo.dev', 'password123', 'agent'),
  ('admin-0001', 'admin@rentiqo.dev', 'password123', 'admin')
on conflict (user_id) do nothing;

insert into user_preferences (user_id, notifications, search)
values
  ('user-0001', '{"push": true, "email": true}'::jsonb, '{}'::jsonb),
  ('agent-0001', '{"push": true, "email": true}'::jsonb, '{}'::jsonb),
  ('admin-0001', '{"push": true, "email": true}'::jsonb, '{}'::jsonb)
on conflict (user_id) do nothing;

insert into agent_profiles (agent_id, service_areas, is_verified)
values ('agent-0001', '["Austin","Round Rock"]'::jsonb, true)
on conflict (agent_id) do nothing;

insert into listings (
  listing_id, price, beds, baths, city, state, status, description, media_urls, price_history,
  agent_id, property_type, listing_status, history
)
values
  (
    'listing-1001', 475000, 3, 2, 'Austin', 'TX', 'active',
    'Updated ranch-style home in north Austin.',
    '["https://cdn.rentiqo.dev/listings/1001/photo-1.jpg"]'::jsonb,
    '[{"timestamp":"2026-05-01T00:00:00.000Z","price":490000},{"timestamp":"2026-05-12T00:00:00.000Z","price":475000}]'::jsonb,
    'agent-0001', 'single_family', 'active',
    '[{"timestamp":"2026-05-01T00:00:00.000Z","price":490000,"eventType":"listed"},{"timestamp":"2026-05-12T00:00:00.000Z","price":475000,"eventType":"price_change"}]'::jsonb
  ),
  (
    'listing-1002', 520000, 4, 3, 'Austin', 'TX', 'active',
    'Two-story home near schools and transit.',
    '["https://cdn.rentiqo.dev/listings/1002/photo-1.jpg"]'::jsonb,
    '[{"timestamp":"2026-05-05T00:00:00.000Z","price":520000}]'::jsonb,
    'agent-0001', 'single_family', 'active',
    '[{"timestamp":"2026-05-05T00:00:00.000Z","price":520000,"eventType":"listed"}]'::jsonb
  )
on conflict (listing_id) do nothing;
