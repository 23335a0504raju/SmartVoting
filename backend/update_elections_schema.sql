-- Add missing columns to elections table
alter table elections add column if not exists code text unique; -- e.g. ELEC2024
alter table elections add column if not exists serial_number text; -- e.g. SN001
alter table elections add column if not exists voting_time integer default 15; -- seconds
