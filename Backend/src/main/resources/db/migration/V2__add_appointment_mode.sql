-- Adds support for in-person vs. telehealth appointments.
--
-- mode: "IN_PERSON" or "TELEHEALTH". Defaults existing rows to IN_PERSON
-- since that was the only kind of appointment the app supported before.
-- telehealth_link: set by the doctor after booking, only meaningful when
-- mode = 'TELEHEALTH'. NULL for in-person appointments and for telehealth
-- appointments where the doctor hasn't added a link yet.

ALTER TABLE appointments
    ADD COLUMN mode VARCHAR(20) NOT NULL DEFAULT 'IN_PERSON',
    ADD COLUMN telehealth_link VARCHAR(500) NULL;
