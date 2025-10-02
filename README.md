# 9 Kings Save Editor

A *(mostly complete) (unofficial)* save game editor for the game 9 Kings by Sad Socket.

Given its sandbox nature, consider the use of this app to be cheating.

**Disclaimer #1:** There's little to no validation on the inputs you set, so it's possible to put the game in a state the devs weren't expecting for.

**Disclaimer #2:** The game does track global stats (win counts, units killed, coins spent, card placement counts), so expect those to get messed up depending on your level of usage.

## Usage

Once launched, use the 'Open save file' button (top-right) and select your save game:

  `%USERPROFILE%\AppData\LocalLow\SadSocket\9Kings\GameSnapshot.json`

Here's an example of what you'll see after loading it:

<img width="1920" height="945" alt="application" src="https://github.com/user-attachments/assets/f3ea07fe-f7af-40b2-9177-a9235bc51268" />


You can...

- Click waves to edit their event, set which king to fight, and set the blessing
- Toggle which kings you can fight against (specifically, the ones used for 'random' waves) and which you're playing as
- Set currency (top left), lives, RNG seed, chaos level ("Details" panel)
- Click occupied plots to see/set their stats
- Use the construction tools to progressively add/remove plot status (occupied -> open <-> locked <-> hole)
- Add/remove cards in hand
- Set the variables controlled by perk/decrees ("Policy vars" panel)

Important: Only make changes while in the main menu (or with the game closed). The app live syncs to your game, which updates the save file during gameplay and when you exit.

## Notes

- You need a save file to start using the UI, which means you have to play until Y3
- Waves are progressively added as you play, so currently you'll only be able to edit a handful at a time
  - The UI is designed to support > 33 waves, but hasn't been stress tested (looking at you people who are playing 1k wave runs...)
- If building from source: to support the auto-save, you need to use a chromium browser; others are supported, but you'll need to manually save the file

## Missing / TODO

- Setting trap data isn't yet implemented (currently WIP)
- Since the wave structure is known, it should be possible to dynamically add that information
- The game save file stores the effects of all perks and decrees together; currently their effects aren't mapped out
- Only numerical or boolean policy variables are included (not list/object types, e.g., additional cards to add after losing a life or boosts from war horns)
- The UI isn't intended for anything but 1080p screens; mostly affects visibility of the battle field
- Need validation for anything game-breaking; known issues:
  - Enabling all kings and then entering a diplomacy-war event leaves no options to choose from, requiring a force quit to get out of it

## Contributing

Feel free to post issues. Feel even more free to make pull requests with any type of changes :)

### Building

**Prerequisites:**
- [Node.js](https://nodejs.org/) (v16 or higher)
- npm (comes with Node.js)

**Build from source:**

1. Clone the repository and install dependencies:
   ```bash
   git clone https://github.com/t-wolfeadam/9-Kings-Save-Editor.git
   cd 9-Kings-Save-Editor
   npm install
   ```

2. Build and create distributable packages:
   - **Windows:** `npm run build:win` (creates installer and portable .exe)
   - **macOS:** `npm run build:mac` (creates .dmg)
   - **Linux:** `npm run build:linux` (creates AppImage, snap, deb)

**Development:**
- `npm run dev` - Start development server with hot reload
- `npm run start` - Preview built app without packaging

Built files will be in the `dist/` directory.

