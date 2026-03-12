# The Chronicle

An invitation-only character chronicle platform. Characters are created as gifts, allowing users to record who a character is and what they have lived through — from their initial sparked concept to their evolving history.

## Current Implementation (v1 Alpha)

### 1. Data Model

The Chronicle tracks characters and their ongoing history:

#### Characters
- **Core Identity**: Name, Label (archetype), and Definition (short bio).
- **Character Sheet**: A detailed markdown-based record of traits, history, and personality.
- **Notes**: A collection of notable facts, abilities, or observations.
- **Portrait**: A visual representation of the character.
- **Metadata**: Tracks the original **Author** (creator) and the current **Owner** (player).

#### Records
- **Lore**: Key story moments and permanent history.
- **Activity**: Training, growth, and character downtime.
- **Logs**: Item trades.

---

## 2. Platform Features

### Character Creation Wizard
A high-fidelity creation flow for authors to craft new legends:
- **Ideation**: Flesh out a character from a simple vibe or spark of an idea.
- **Refinement**: Edit identity, sheet details, and specific notes.
- **Portrait Generation**: Create a visual portrait from a description or upload a custom image.
- **Gifting**: Generate a unique "Gift Link" for characters with no owner yet.

### The Chronicle Sheet
A centralized view for character interaction:
- **Interactive Details**: Owners can edit any part of their character in-place.
- **Markdown Sheet**: A full-featured markdown editor for the main character sheet with live preview.
- **Note Management**: Manage individual traits and abilities with a simple list interface.
- **History Tabs**: Dedicated sections for Lore, Activity, and Logs (History recording system).

### Gifting & Claiming
- **Invitation Flow**: New characters are created without an owner. 
- **Gift Links**: Authors can share a link with the `?claim` parameter.
- **Claiming**: When a user visits a gift link, they can claim the character. Once claimed, they become the permanent owner with exclusive editing rights.

---

## 3. Security & Ownership

- **Author Rights**: The creator of a character maintains permission to view and delete the character, even after gifting it.
- **Owner Rights**: The player who claims a character has exclusive rights to edit its identity and history.

---

## 4. How to Use

1. **Sign In**: Access requires an invitation/account via Auth0.
2. **Create**: Use the "Create Character" wizard to spark a new concept.
3. **Gift**: Share the character page URL with `?claim` to a friend.
4. **See/Edit**: Once claimed, use the central sheet to edit the character.


## Roadmap

Right now the app has:
 - Assisted character creation (wizard).
 - View/claim character page with few options to edit it.

The next step is recording the character lore, activity and trade log. These must be displayed differently with lore records being focused on the narrative display of a character most memorable moments, titles, epic deeds and lore relevant interactions, activity is meant to record the spending of downtime points and the logs the spending of gold coins and treasure points.

This app platform is meant to focus solely on tracking the character sheets and records but in order to make the app interesting for users the following feature/functionalities are going to be developed here before they are moved to their own applications:
- A chat page to interact with the character (on hold).
- An Advenurer's Guild app (on hold).

The adventurer's guild app is meant to allow players to prepare and participate of RPG sessions in the adventurer's guiild model. The session made by the players should result in memories (lore records) for their characters, the goal of this app is to support similar apps, this is meant to be a platform for RPG characters but not the app where the RPG sistems and sessions are played/managed.

Todo:
 - [ ] Lore tab list records
 - [ ] Activity tab list records
 - [ ] Log tab list records

Lore records should have a title, an optional (AI generated) image and a markdown content.
Activity and log records should only be about the title, all of them should be timestamped (preferably using ISO).

Once we have records tracked we should then be able to add the records to a questline, the record should have an optional questline attribute to keep track of multi-mission questlines which will be useful to grouping history of records (lore, activity and log) of a character in a specific context.

All apps built for RPG gaming sessions should strive to focus the gaming sessions in questlines: e.g the adventurer's guild app should combine multiple missions/sessions into a single questline, but other apps such as the card arena (an app where players make card decks with their characters to play battle sessions) should also mark each sessions (e.g. dungeon crawl card session) into a questline in order to track the character notable doings, (level-up), gear, treasure, items, etc.

App ideas:

**Adventurer's Guild**

Narrators post missions with questlines and players can join them with their characters. The missions reward characters with experience, gold coins, downtime points and treasure points which can then be spent to level-up, buy gear, craft items as well as obtain rare items. The records get tracked by the questline which are recorded forever (as long as the app exists). The goal is to facilitate gameplay by allowing players to prepare for sessions and track their progress in a single place, with log and activity records being automated by the app interface (allowing to track purchases and downtime activity) but also allowing narrators to write down the inspiring moments of the session into the character's lore, keeping everything connected through the questline then displaying it all for everyone to see, generating images to tell the story players made together.

A key component of the Adventurer's Guild app would be the mission wizard to inspire/auxiliate narrators in the creation of missions for players, this shouldn't be an additional overhead, but a tool that really incentives narrators to create missions for players. Additionally, the possibility of creating the characters necessary for a one-shot questline/session is an interesting way to get players together, inspired narrators would be able to invite qualified players by gifting them with the characters in this platform which could later be kept for later sessions/one-shots/gameplays.


**Solo RPG / Aync sessions**

Because qualified narrator's aren't always available and people often want to power-play RPG instead of doing with battle-focused sessions/narrative, I've brainstormed this idea: an app that allows you to play a dungeon-crawl experience, which emulates a battle-focused session by following the formula:
- Encounter (A.I generated) > user input > A.I generated resolution creating pairs of encounters + resolution, both A.I generated but guided by the user input. An example is a simple dungeon crawl where a mission is created specifically describing a dungeon crawl experience with a goal, in this app the mission would start with participating players being presented with the first A.I. genreated encounter of the session, each player would then write their actions and the A.I. would receive those prompts to dictate the resolution of the encounter, no dice system, just A.I. whims to dictate the resolution of the encounter. This idea can be built on top of the Adventurer's Guild app with the only issue being that narrator's would probably not want the power players to leveling their characters in dungeon crawls just to get overpowered characters to play their actual in-person or online sessions.

**Grimoire RPG**
To make things even more dynamic it would be interesting to make an app where players can build decks to their characters to be used in the above described sessions where one or multiple players could play an async RPG session by going through the encounters described above but instead of having to write the actions of their characters, the player would only have to select the cards of their deck to be used in the encounter, the cards would describe the actions of the character and the A.I. would receive those prompts to dictate the resolution of the encounter. Basically the laziest way to play an RPG sessions with co-workers, distant friends, people who don't want to write their actions just read the encounter, select the cards, read the resolution and maybe text each other to talk about what happened in their "RPG" game. Players who are more heavily interested may build more focused decks to their characters and spend their creativity creating their own cards (wizard assisted) while players who just want to participate may use the decks created by other players or use the default decks provided by the app. The basic cards would be things like "Sword", "Dagger", "Armor", "Shield", "Spell: Fireball", stuff like that that represents the character equipment, powers, abilities, certain actions, etc...
