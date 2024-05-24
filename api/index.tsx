import { Frog, validateFramesMessage } from "@airstack/frog";
import {
  NobleEd25519Signer,
  hexStringToBytes,
  Metadata,
  makeCastAdd,
  FarcasterNetwork,
  getSSLHubRpcClient,
} from "@farcaster/hub-nodejs";
//import { devtools } from "@airstack/frog/dev";
import { serveStatic } from "@airstack/frog/serve-static";
import { handle } from "@airstack/frog/vercel";
import { config } from "dotenv";
//import fetch from "node-fetch";

// Audio Gen interface definitions
interface musicData {
  id: string;
  title: string;
  //image_url: string;
  lyric: string;
  audio_url: string;
  //video_url: string;
  created_at: string;
  model_name: string;
  status: string;
  gpt_description_prompt: string;
  prompt: string;
  type: string;
  tags: string;
}

config();
const ADD_URL =
  "https://warpcast.com/~/add-cast-action?actionType=post&name=CastVivaldi&icon=unmute&postUrl=https%3A%2F%2Fcastvivaldi.xyz%2Fapi%2F";
//const ACCOUNT_PRIVATE_KEY: string = process.env.ACCOUNT_PRIVATE_KEY; // Your account key's private key
const ACCOUNT_PRIVATE_KEY = process.env.ACCOUNT_PRIVATE_KEY as string; // Account Priv Key
const FID = 490410; // Account FID
let uint8ArrayPrivateKey = new Uint8Array(
  Buffer.from(ACCOUNT_PRIVATE_KEY, "hex")
);
const ed25519Signer = new NobleEd25519Signer(uint8ArrayPrivateKey);
const FC_NETWORK = FarcasterNetwork.MAINNET;
const dataOptions = {
  fid: FID,
  network: FC_NETWORK,
};

export const app = new Frog({
  apiKey: process.env.AIRSTACK_API_KEY as string,
  basePath: "/api",
  browserLocation: ADD_URL,
});

// function for base64
function base64FromBytes(arr: Uint8Array) {
  return Buffer.from(arr).toString("base64");
}

// Cast action handler
app.hono.post("/api", async (c) => {
  const body = await c.req.json();

  // validate the cast action
  const { isValid, message } = await validateFramesMessage(body);
  const interactorFid = message?.data?.fid;
  const castFid = message?.data.frameActionBody.castId?.fid;
  //const castId = message?.data.frameActionBody.castId;
  //const fid = castId?.fid;
  //const id = castId?.id;
  // Get cast hash
  //const hash = hexStringToBytes(base64FromBytes(castFid?.hash as Uint8Array));
  //const hash = hexStringToBytes(
  // base64FromBytes(message?.data.frameActionBody.castId?.hash as Uint8Array)
  // )._unsafeUnwrap();

  const hash = hexStringToBytes(
    (castFid as { hash?: string }).hash || ""
  )._unsafeUnwrap(); //codequen q8 0 7B Q8_0 gguf thank you

  if (isValid && castFid) {
    // generate music based on the text in the cast
    const text = body.data.text; // Send the text in the cast - Test here is killing me.
    const response = await fetch(process.env.AUDIO_GEN_API as string, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: text,
        tags: "rock, pop",
        title: "Cast Vivaldi",
        make_instrumental: false,
        wait_audio: true,
      }), // sent the text as the body of the request
    });
    const musicDataArray = (await response.json()) as musicData[];
    const musicData = musicDataArray[0];

    //const musicData = await response.json(); // get the response data
    // create the cast informing initiation reply under the thread
    const castReplyResult = await makeCastAdd(
      {
        text: "Generating Song...",
        embeds: [{ url: musicData.audio_url }], // add music URL here
        embedsDeprecated: [],
        mentions: [191554],
        mentionsPositions: [], // need to add FID mentions position
        parentCastId: {
          fid: castFid,
          hash: hash, // hash
        },
      },
      dataOptions,
      ed25519Signer
    );

    // create the cast reply under the thread
    await makeCastAdd(
      {
        text: "Here's your Song!   ",
        embeds: [
          { url: "audio_url" }, // audio URL here
        ],
        embedsDeprecated: [],
        mentions: [191554], // need to add FID mentions position
        mentionsPositions: [19], // need to add FID mentions position
        parentCastId: {
          fid: castFid,
          hash,
        },
      },
      dataOptions,
      ed25519Signer
    );
    // Create a client instance

    const client = getSSLHubRpcClient("https://hubs-grpc.airstack.xyz");

    client.$.waitForReady(Date.now() + 5000, async (e) => {
      if (e) {
        console.error(`Failed to connect to the gRPC server:`, e);
        process.exit(1);
      } else {
        const metadata = new Metadata();
        // Provide API key here
        metadata.add("x-airstack-hubs", process.env.AIRSTACK_API_KEY as string);
        if (castReplyResult.isOk()) {
          // broadcast the cast throughout the Farcaster network
          const castAddMessage = castReplyResult.value;
          const submitResult = await client.submitMessage(
            castAddMessage,
            metadata
          );
          if (submitResult.isOk()) {
            console.log(`Reply posted successfully`);
            console.log(Buffer.from(submitResult.value.hash).toString("hex"));
          }
        } else {
          const error = castReplyResult.error;
          // Handle the error case
          console.error(`Error posting reply: ${error}`);
        }
        // After everything, close the RPC connection
        client.close();
      }
    });
    // This will be the message appearing in the cast action toast, customizable
    return c.json({ message: "Yay, Success" });
  } else {
    return c.json({ message: "Uh Oh .. Unauthorized" }, 401);
  }
});

//devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
