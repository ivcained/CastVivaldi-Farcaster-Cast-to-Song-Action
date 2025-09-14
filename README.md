CasttVivaldi has been archived and the project lives on as [@audify] (https://farcaster.xyz/audify) on farcaster. 
# 🐬 CastVivaldi - Turn Any Cast Into a Song with this Cast Action | Bot

HOW DOES IT WORK?

1: Phase 1 we generate using SUNO: https://suno.com/ 
   Phase 2 we generate using decentralized compute. 

2: Use the SUNO AI API: [https://github.com/gcui-art/suno-api/]
 

Cast Vivaldi is a cast action that allows users to transform any text-based cast on the Farcaster into a music track. Users can initiate this process by tapping the Vivaldi Cast Action button on any cast. The system, managed by the bot `@castvivaldi`, will first provide an estimated time for the music generation. Once the music track is ready, a second reply will be sent containing the generated song.

The concept leverages the Farcaster network, a decentralized social network, and integrates with music generation algorithms to create unique audio content based on user input. As per the context provided, the feature undergoing continuous development and improvements.

Notes:

https://www.npmjs.com/package/capture-website to capture screenshot of the cast, audio is stitched using ffmpeg (working on that)
1


https://github.com/ivcained/CastVivaldi-Farcaster-Cast-to-Song-Action/assets/86070833/c9ec9e61-f6b6-4cac-a4fe-b383a376abf9


https://github.com/ivcained/CastVivaldi-Farcaster-Cast-to-Song-Action/assets/86070833/e6d32bb4-8a52-4b72-8713-b1f370721b04



https://github.com/ivcained/CastVivaldi-Farcaster-Cast-to-Song-Action/assets/86070833/1f499aa7-14b5-4939-8145-752895faa43d



https://github.com/ivcained/CastVivaldi-Farcaster-Cast-to-Song-Action/assets/86070833/388ee33b-3296-4014-86da-f79693e42e08



https://github.com/ivcained/CastVivaldi-Farcaster-Cast-to-Song-Action/assets/86070833/a0833f60-6f48-4e9f-a577-e3e931b650fa




<<<<<<< HEAD
WIP.
    
=======
## How to Turn Any Cast into a Song:

Tap the Vivaldi Cast Action button on any cast.
[@castvivaldi](https://warpcast.com/castvivaldi) will reply with the estimate time for generation.<br>
A second reply will be sent with the Song Genenrated from the Cast.

Noete: This is a WIP and features are being added frequently.

>>>>>>> ac66db8ac9a448844c92a79ab738ea629fc1511c
HUGE Thanks to the most authentic, patient, Genius (Over 9000) @YosephKS for your Mentorship. I will write more later as I'm working on getting this ready soon.




## Using Airstack: 

A Farcaster [Cast Actions](https://warpcast.com/~/add-cast-action?actionType=post&name=GM&icon=sun&postUrl=https%3A%2F%2Fgm-fc.vercel.app%2Fapi%2Fgm) starter template built with [Airstack Frog Recipes](https://docs.airstack.xyz/airstack-docs-and-faqs/frames/airstack-frog-recipes-and-middleware).

## Prerequisites

- [Airstack API key](https://docs.airstack.xyz/airstack-docs-and-faqs/get-started/get-api-key)
- [Vercel KV DB](https://vercel.com/docs/storage/vercel-kv/quickstart#create-a-kv-database)

## Deployment

First, install all the dependencies:

```sh
npm i
```

Build your project:

```sh
npm run build
```

And setup your project by deploying on Vercel:

```sh
npm run deploy
```

Once you have your project setup, you can go to https://vercel.com to create a [Vercel KV](https://vercel.com/docs/storage/vercel-kv/quickstart#create-a-kv-database) instance under your project.

Then, also add the [Airstack API key](https://docs.airstack.xyz/airstack-docs-and-faqs/get-started/get-api-key) to your project's environment variable:

```
AIRSTACK_API_KEY=xxx
```

Access the GM cast actions from the `https://<VERCEL-SUBDOMAIN>.vercel.app/api/gm` endpoint.
