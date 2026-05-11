CREATE TABLE facility (
    id BIGINT NOT NULL AUTO_INCREMENT,
    facility_key VARCHAR(64) NOT NULL,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    city VARCHAR(128) NOT NULL,
    region VARCHAR(128) NOT NULL,
    country VARCHAR(128) NOT NULL,
    description TEXT NOT NULL,
    yield_display VARCHAR(32) NOT NULL,
    occupancy_percent INT NOT NULL,
    total_beds INT NOT NULL,
    queue_count INT NOT NULL,
    queue_boost VARCHAR(64) NOT NULL,
    image_url VARCHAR(1024) NOT NULL,
    detail_href VARCHAR(255) NOT NULL,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    CONSTRAINT pk_facility PRIMARY KEY (id),
    CONSTRAINT uk_facility_key UNIQUE (facility_key)
);

CREATE TABLE facility_badge (
    id BIGINT NOT NULL AUTO_INCREMENT,
    facility_id BIGINT NOT NULL,
    label VARCHAR(128) NOT NULL,
    variant VARCHAR(32) NOT NULL,
    sort_order INT NOT NULL,
    CONSTRAINT pk_facility_badge PRIMARY KEY (id),
    CONSTRAINT fk_facility_badge_facility FOREIGN KEY (facility_id) REFERENCES facility (id)
);

CREATE TABLE facility_asset (
    id BIGINT NOT NULL AUTO_INCREMENT,
    facility_id BIGINT NOT NULL,
    serial VARCHAR(64) NOT NULL,
    location VARCHAR(255) NOT NULL,
    yield_display VARCHAR(32) NOT NULL,
    buy_price_display VARCHAR(64) NOT NULL,
    image_url VARCHAR(1024) NOT NULL,
    asset_type VARCHAR(128) NOT NULL,
    mode VARCHAR(64) NOT NULL,
    status VARCHAR(32) NOT NULL,
    mint_address VARCHAR(128) NULL,
    sort_order INT NOT NULL,
    CONSTRAINT pk_facility_asset PRIMARY KEY (id),
    CONSTRAINT fk_facility_asset_facility FOREIGN KEY (facility_id) REFERENCES facility (id)
);

CREATE TABLE facility_queue_status (
    id BIGINT NOT NULL AUTO_INCREMENT,
    facility_id BIGINT NOT NULL,
    p1_wait_days INT NOT NULL,
    p2_wait_days INT NOT NULL,
    p3_wait_days INT NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    CONSTRAINT pk_facility_queue_status PRIMARY KEY (id),
    CONSTRAINT uk_facility_queue_status_facility UNIQUE (facility_id),
    CONSTRAINT fk_facility_queue_status_facility FOREIGN KEY (facility_id) REFERENCES facility (id)
);

INSERT INTO facility (
    facility_key, name, location, city, region, country, description, yield_display,
    occupancy_percent, total_beds, queue_count, queue_boost, image_url, detail_href, created_at, updated_at
) VALUES
(
    'facility_foshan',
    'Foshan Leyi Care Center',
    'Foshan, Chancheng District',
    'Foshan',
    'Greater Bay Area',
    'China',
    'Flagship RWA elderly care facility integrated with CareChain.',
    '8.2%',
    94,
    320,
    142,
    '20 $CARE/Day',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDZpz9IugFANNkCrtJ4kYYbj60fZ43W5k0tKCtjPsK0fd8g-abMXW05gAiri-eSWOD_2_r6IGsKA3m-LidmT2Il0TU3FPFZSB4i-1-KcKPJS6tchAepEnGWrtTGJMvWBv52OYdD5DAo8vQRV1O59tCFN49dOyC__LJhR5Alu1mB2f980u9d4Yi-_KqjG9MswOTjklDJFXr35phNXEtv-AsOIiHsxuc0VhHfdkAfV1ANlaE2rRDe4gWfNN1RRfZxHn4mw8kE-sUf-bB_',
    '/facilities/facility_foshan',
    CURRENT_TIMESTAMP(6),
    CURRENT_TIMESTAMP(6)
),
(
    'facility_guangzhou',
    'Guangzhou Yuexiu Kangtai Court',
    'Guangzhou, Yuexiu District',
    'Guangzhou',
    'Greater Bay Area',
    'China',
    'Premium senior care facility in Guangzhou with comprehensive medical and wellness services.',
    '7.5%',
    88,
    450,
    89,
    '15 $CARE/Day',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAg1KE_t7YXRnW_fnCQ7moIublO3H8xKHTFGfP2Uhfc2avuXaY8g3Dm9m0qoJhJebUoNsswefU7awc5mGJLIy-27iU3-6DA1Y0T2rqP8wdnNQah1Fbt7clPjSzy9nY_imwE_OnyrHD4bJV3wFhX6ycxiQh6CJiMvCI57K8a25opcDNYb0CI87ASlXHaLRGuo-vR7NeplTcKeWriEBd9uzNTaS40tPVWO-aD_rWiTtwQ5ezWRMyTwqmI0GCFhh1XwT_A0YqIEi4LLa2K',
    '/facilities/facility_guangzhou',
    CURRENT_TIMESTAMP(6),
    CURRENT_TIMESTAMP(6)
),
(
    'facility_shenzhen',
    'Shenzhen Futian Evergreen Residence',
    'Shenzhen, Futian District',
    'Shenzhen',
    'Greater Bay Area',
    'China',
    'Elite wellness-focused senior living facility in Shenzhen.',
    '9.1%',
    98,
    180,
    215,
    '35 $CARE/Day',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDlizZlPSXbIeycQ66QVuNc4nPsVYn3A1iXlY05KOfu5G--FkkA_GF_v2GbamBzC4j3lLbBnGMwRtMOz3jusYK_5TYaDtunpiNJwzPWiN2BqhePbwxK1TzcY2q1FJbmQ-9dpmv-h6N-sfGPHS5gMAqBMs-JKB0FhYNKyI3FptHJT4oGfqI9FCcxfhOvPh9OqjlvUbjIPIhp6z8P_g0SyPkzU8qQ4tu7Jg9qlKxCVVK5iX03hL1432qvTFc6mGR3nOCTE4iGeqHGHa0b',
    '/facilities/facility_shenzhen',
    CURRENT_TIMESTAMP(6),
    CURRENT_TIMESTAMP(6)
);

INSERT INTO facility_badge (facility_id, label, variant, sort_order)
SELECT id, 'High Demand', 'tertiary', 1 FROM facility WHERE facility_key = 'facility_foshan';
INSERT INTO facility_badge (facility_id, label, variant, sort_order)
SELECT id, 'RWA Certified', 'default', 2 FROM facility WHERE facility_key = 'facility_foshan';
INSERT INTO facility_badge (facility_id, label, variant, sort_order)
SELECT id, 'Newly Listed', 'secondary', 1 FROM facility WHERE facility_key = 'facility_guangzhou';
INSERT INTO facility_badge (facility_id, label, variant, sort_order)
SELECT id, 'High Demand', 'tertiary', 1 FROM facility WHERE facility_key = 'facility_shenzhen';

INSERT INTO facility_asset (
    facility_id, serial, location, yield_display, buy_price_display, image_url,
    asset_type, mode, status, mint_address, sort_order
)
SELECT id, 'FSH-A301', 'Foshan, China', '7.2%', '$4,500 USDC',
       'https://lh3.googleusercontent.com/aida-public/AB6AXuBn1zUu4fxDftEO-CtwHgHB0SHRDMwvZ-LEwrCrb8FWuGfo21XBJRSTjwO1zao0VE2cBjVh6Vr-DHAB7NmC2m7UGi102HVKZK7T8EuJoUuIhdrJllPdBxgmywrtVBhueshEVCglsNtJwpwgY1NQT6-gTtGqi-vRb4qDCTXcq11QLmKtiGzaMu8Cp1zbkIThTDhx0TbzD88RsBrZQLvG7HJ6-I4fAIX6zyST6MDuLVubV3t59--ft1kh4-whvrp8b27eQ7ipfbSCPz1X',
       'Standard Bed', 'Yield Mode', 'ACTIVE', '', 1
FROM facility WHERE facility_key = 'facility_foshan';

INSERT INTO facility_asset (
    facility_id, serial, location, yield_display, buy_price_display, image_url,
    asset_type, mode, status, mint_address, sort_order
)
SELECT id, 'GZ-B102', 'Guangzhou, China', '6.8%', '$8,000 USDC',
       'https://lh3.googleusercontent.com/aida-public/AB6AXuBExhzYyOhm_5rK0qBX-e09yWbj8J6FViJjuBn5NBeMPmv83Gzz9hTMCGZMcz96YHyRx22UO4tCeJBjZSrLOSVqkSoIx1f54Pb82M5rY_uZwZU13nBf4G-o9MBmsjJ6HL1roiJDyarkftqOFT0Q-UI_aJGuqFVkGEtah2jj-8siJ-0nSC2RNUrEfFGrXPv-8Zpc_HdfedjpY7mEi9VJy4zaDiP8qVnzVKQDgjusr4PoxT2TZ0XmiEsClgZV13rluC0hGQOck9150M87',
       'Luxury Suite', 'Residence Mode', 'ON-CHAIN', '', 2
FROM facility WHERE facility_key = 'facility_foshan';

INSERT INTO facility_asset (
    facility_id, serial, location, yield_display, buy_price_display, image_url,
    asset_type, mode, status, mint_address, sort_order
)
SELECT id, 'SZ-C505', 'Shenzhen, China', '8.1%', '',
       'https://lh3.googleusercontent.com/aida-public/AB6AXuBomKHUA3qIO35Pv5TmRdP9U4NIAAKww1WolBdbshDKV8K8H3JDAzlAut11jMims6Pfw7AqYLv0LCMLnskeJkmz-y_i2eBwfKo8oMKrTRLaFMwZggfKDV98nnvTq2a91hAgh6RmtC6uh147BQ8AoZtLX3CYMuOH1HSnksimOUQytrQEG--LJawl23pWBajVFLgQsBxd-61umkprVnFifDEXjp2AShbytm9BDRg6q6vFTd8x0t3dkJXD5Ppf8F-tf0Xd93hA9uZ73Pu8',
       'Standard Bed', 'Yield Mode', 'PENDING', '', 3
FROM facility WHERE facility_key = 'facility_foshan';

INSERT INTO facility_queue_status (facility_id, p1_wait_days, p2_wait_days, p3_wait_days, updated_at)
SELECT id, 12, 45, 180, '2026-04-15 00:00:00' FROM facility WHERE facility_key = 'facility_foshan';
INSERT INTO facility_queue_status (facility_id, p1_wait_days, p2_wait_days, p3_wait_days, updated_at)
SELECT id, 10, 38, 120, '2026-04-15 00:00:00' FROM facility WHERE facility_key = 'facility_guangzhou';
INSERT INTO facility_queue_status (facility_id, p1_wait_days, p2_wait_days, p3_wait_days, updated_at)
SELECT id, 18, 60, 240, '2026-04-15 00:00:00' FROM facility WHERE facility_key = 'facility_shenzhen';
