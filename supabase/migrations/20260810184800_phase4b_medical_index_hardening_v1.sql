-- LG Nexus V1
-- Phase 4B performance hardening after Supabase advisor review.

create index if not exists medical_treatments_responsible_profile_idx on public.medical_treatments(responsible_profile_id);
create index if not exists medical_treatments_created_by_idx on public.medical_treatments(created_by);
create index if not exists medical_treatments_completed_by_idx on public.medical_treatments(completed_by);

create index if not exists medical_diagnosis_catalog_created_by_idx on public.medical_diagnosis_catalog(created_by);
create index if not exists medical_patient_diagnoses_diagnosed_by_idx on public.medical_patient_diagnoses(diagnosed_by);
create index if not exists medical_patient_diagnoses_resolved_by_idx on public.medical_patient_diagnoses(resolved_by);
create index if not exists medical_patient_allergies_recorded_by_idx on public.medical_patient_allergies(recorded_by);
create index if not exists medical_patient_allergies_inactivated_by_idx on public.medical_patient_allergies(inactivated_by);
create index if not exists medical_clinical_history_actor_profile_idx on public.medical_clinical_entry_history(actor_profile_id);
