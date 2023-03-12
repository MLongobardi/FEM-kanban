# svelte-template

My own svelte project starter.

## How to use

Create a new repository on github and select svelte-template as the Repository template.
After it is created, copy the link from the green "<> Code" button in the repository, and run:

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY
```

This will create a YOUR-REPOSITORY folder with the code
then enter that folder and run:

```bash
npm install
```

And done, the project is ready.

## Notes
Created on: 4/3/2023
Last updated on: 10/3/2023

```bash
npm ls
#results:
├── @sveltejs/adapter-auto@2.0.0
├── @sveltejs/kit@1.11.0
├── autoprefixer@10.4.14
├── eslint-config-prettier@8.7.0
├── eslint-plugin-svelte3@4.0.0
├── eslint@8.35.0
├── gulp@4.0.2
├── postcss-load-config@4.0.1
├── postcss@8.4.21
├── prettier-plugin-svelte@2.9.0
├── prettier@2.8.4
├── sass@1.58.3
├── svelte-preprocess@5.0.1
├── svelte@3.56.0
└── vite@4.1.4
```

gulp had 6 high severity vulnerabilities, fixed with package.json overrides as per this video: https://www.youtube.com/watch?v=d5vfi-l4KWQ

I struggled to find a way to run both a gulp watch and vite dev at the same time.
This was the best way, but only works in bash (and npm run defaults to cmd on windows)

```bash
gulp & pid1="$!" ; vite dev --open ; kill $pid1
```

This works on cmd, but opens a (minimized) new terminal, and gulp's feedback is there

```bash
start /min gulp & vite dev --open & taskkill /FI "windowtitle eq gulp" 
```

In both cases, closing vite closes gulp too.

Actually, I think the bash one creates a .pid file, and that's not really desirable