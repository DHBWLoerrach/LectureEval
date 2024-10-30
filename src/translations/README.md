# Übersetzen in der VorlesungsBewertung

In der VorlesungsBewertungs App verwenden wir das `react-intl`-Framework für das Internationalisieren und Lokalisieren von Texten. In dieser README erklären wir die Grundlagen der Übersetzungen, den Prozess für neue Übersetzungen sowie die Nutzung der Übersetzungsfunktionen im Code.

## Grundlagen der Übersetzung

-   Alles rund ums Thema Übersetzungen befindet sich in diesem Ordner (`~/translations`)

-   In `translations.ts` definieren wir alle möglichen Übersetzungen. Dies ermöglicht uns, sie Typsicher im Code einzusetzen.

    -   Jeder übersetzbare Text benötigt einen eindeutigen Identifikator und eine defaultMessage (in unserer Standardsprache: Deutsch)
        ```js
        defineMessages({
            messageIdentifier: {
                defaultMessage: 'FooBar',
            },
        })
        ```

-   In `{sprache}.json` befinden sich die fertig Übersetzten Texte.<br /> **Diese Dateien sollten niemals direkt bearbeitet werden.** (Mehr dazu siehe unten)

## Prozess zum Hinzufügen neuer Übersetzungen

1. **Neue Texte hinzufügen:** Neue Übersetzungseinträge werden zunächst in translations.ts hinzugefügt und mit einer defaultMessage auf Deutsch versehen.

2. **Texte extrahieren:** Sobald alle neuen Übersetzungseinträge hinzugefügt wurden, führe den folgenden Befehl aus:

    ```
    npm run extract-messages
    ```

    Dieser Schritt erzeugt einen neuen Ordner `~/translations/extracted`, der JSON-Dateien pro Sprache enthält. Diese Dateien enthalten Objekte für jeden Identifikator mit defaultMessage und, falls der Text neu und die Datei nicht für die Sprache Deutsch ist, dem Attribut `needsTranslation: true`.

3. **Texte übersetzen:** Alle Texte, die mit `needsTranslation: true` markiert sind, **müssen** übersetzt werden. Die needsTranslation-Flags brauchen nicht entfernt oder angepasst werden.

4. **Übersetzungen kompilieren:** Sobald alle Texte übersetzt sind, kann der folgende Befehl ausgeführt werden:

    ```
    npm run compile-messages
    ```

    Dieser Befehl generiert die benötigten `{sparche}.json` Dateien im passenden Format für react-intl.

## Nutzung der übersetzten Texte

1. **Intl-Instanz des Providers nutzen:** Um Übersetzungen an einer bestimmten Stelle im Code zu nutzen, musst du über die `useIntl` hook auf die Intl-Instanz zugreifen:

    ```js
    const intl = useIntl()
    ```

2. **Nachricht formatieren:** Nutze `intl.formatMessage` und rufe den Übersetzungs-Identifikator auf.

    ```js
    intl.formatMessage(translations.welcomeMessage)
    ```

## Texte mit Parametern

Falls eine Übersetung einen Parameter enthält, wie z.B. `{name}`, kann dies bei der Übersetzung als Objekt übergeben werden.

### Definition der Übersetzung

```js
// translations.ts
defineMessages({
    messageIdentifier: {
        defaultMessage: 'Foo {name}',
    },
})

// SomeComponent.tsx
const intl = useIntl()

intl.formatMessage(translations.messageIdentifier, {
    name: 'Bar',
})
```

## Hinweis zu den Skripten

Die Skripte `extract-messages` und `compile-messages` befinden sich im scripts-Ordner und wurden durch uns für die VorlesungsBewertung entwickelt.
