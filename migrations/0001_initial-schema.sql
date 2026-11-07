-- Migration number: 0001 	 2026-11-07T18:14:01.144Z
PRAGMA foreign_keys = ON;

CREATE TABLE states (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  region_code TEXT NOT NULL,
  map_feature_id TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cities (
  id TEXT PRIMARY KEY,
  state_id TEXT NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  major_city TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (state_id) REFERENCES states(id) ON DELETE CASCADE,
  UNIQUE (state_id, slug)
);

CREATE TABLE venues (
  id TEXT PRIMARY KEY,
  state_id TEXT NOT NULL,
  city_id TEXT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  price_range TEXT,
  pick TEXT CHECK (pick IN ('sv', 'editor') OR pick IS NULL),
  published INTEGER NOT NULL DEFAULT 0 CHECK (published IN (0, 1)),
  verification_status TEXT NOT NULL DEFAULT 'draft'
    CHECK (verification_status IN ('draft', 'needs_verification', 'verified')),
  source_notes TEXT NOT NULL DEFAULT '',
  last_verified_at TEXT,
  address TEXT,
  latitude REAL,
  longitude REAL,
  phone TEXT,
  website_url TEXT,
  instagram_url TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (state_id) REFERENCES states(id) ON DELETE RESTRICT,
  FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE SET NULL,
  UNIQUE (state_id, slug)
);

CREATE TABLE venue_tags (
  venue_id TEXT NOT NULL,
  tag TEXT NOT NULL,
  PRIMARY KEY (venue_id, tag),
  FOREIGN KEY (venue_id) REFERENCES venues(id) ON DELETE CASCADE
);

CREATE TABLE venue_specialties (
  venue_id TEXT NOT NULL,
  specialty TEXT NOT NULL,
  PRIMARY KEY (venue_id, specialty),
  FOREIGN KEY (venue_id) REFERENCES venues(id) ON DELETE CASCADE
);

CREATE TABLE venue_hours (
  venue_id TEXT NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  opens_at TEXT,
  closes_at TEXT,
  closed INTEGER NOT NULL DEFAULT 0 CHECK (closed IN (0, 1)),
  PRIMARY KEY (venue_id, day_of_week),
  FOREIGN KEY (venue_id) REFERENCES venues(id) ON DELETE CASCADE
);

CREATE TABLE venue_images (
  id TEXT PRIMARY KEY,
  venue_id TEXT NOT NULL,
  object_key TEXT NOT NULL UNIQUE,
  image_type TEXT NOT NULL DEFAULT 'gallery'
    CHECK (image_type IN ('cover', 'gallery', 'menu', 'logo')),
  alt_text TEXT NOT NULL DEFAULT '',
  caption TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  approved INTEGER NOT NULL DEFAULT 0 CHECK (approved IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (venue_id) REFERENCES venues(id) ON DELETE CASCADE
);

CREATE INDEX idx_cities_state_id
  ON cities(state_id);

CREATE INDEX idx_venues_state_id
  ON venues(state_id);

CREATE INDEX idx_venues_city_id
  ON venues(city_id);

CREATE INDEX idx_venues_published
  ON venues(published);

CREATE INDEX idx_venues_verification_status
  ON venues(verification_status);

CREATE INDEX idx_venue_images_venue_id
  ON venue_images(venue_id);