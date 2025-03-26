# Eigene Supabase Instanz aufsetzen

## Aktuelles Schema exportieren

Der Owner der produktiven Supabase-Instanz muss das aktuelle Schema mit dem Terminal-Befehl `pg_dump` exportieren:

`pg_dump --dbname="<SUPABASE_CONNECTION_STRING>" -n public --schema-only -F c -f schema.dump`

Dadurch wird nur das Schema inklusive Tabelle, Funktionen, Triggers und Policies exportiert &mdash; die Dateninhalte der Tabellen sind nicht enthalten.

## Schema in Supabase importieren

In Supabase ein neues Projekt erstellen und die eben erstellte Datei `schema.dump` mit dem Terminal-Befehl `pg_restore` importieren:

`pg_restore --dbname="<TARGET_SUPABASE_CONNECTION_STRING>"  --no-owner --no-privileges -n public schema.dump`

Nun sollte das Schema in der neuen Instanz vorhanden sein, allerdings ohne Dateninhalte.

## Benötigte Daten eintragen

Folgende Änderungen müssen in Supabase vorgenommen werden:

Unter `Authentication -> Users` müssen drei Benutzer eingetragen werden.
Dazu den Button `Add user -> Create new user` drücken und drei Benutzer
mit E-Mail und Passwort anlegen (`Auto Confirm User` muss aktiviert sein):

- Admin: z.B. admin@example.com
- Lecturer/Dozent: z.B. lecturer@example.com
- Student: z.B. student@example.com

Im `Table Editor` von Supabase müssen nun folgende Einträge vorgenommen werden:

- in `roles` die Rollen `Admin`, `Lecturer` und `Student` mit `Insert > Insert row` erstellen
- in `user_roles` den Benutzern die passenden Rollen mit `Insert > Insert row` und `Select record` auswählen und zuweisen (diese haben wir eben in der Tabelle `roles` definiert)
- in `locations` den Standort `DHBW Lörrach` mit passendem Datenschutztext erstellen (letzterer kann auch später angepasst werden)
- in `user_locations` den Benutzern den Standort `DHBW Lörrach` zuweisen (dieser ist in der Tabelle `locations` definiert)
- den Lecturer/Dozenten in der Tabelle `lecturers` eintragen
- den Studenten in der Tabelle `students` eintragen
- in `question_types` benötigen wir Einträge mit folgenden Werten für `title`:
  - `Sterne-Bewertung`
  - `Freitext`
  - `Schwierigkeit`
  - `Gesamtbewertung`
- in `semesters` folgende Einträge erstellen:
  - `1. Semester`
  - `2. Semester`
  - usw.
  - `6. Semester`
