import { Frog, validateFramesMessage } from "@airstack/frog";
import { hexStringToBytes, Metadata, makeCastAdd } from "@farcaster/hub-nodejs";
import { devtools } from "@airstack/frog/dev";
import { serveStatic } from "@airstack/frog/serve-static";
import { handle } from "@airstack/frog/vercel";
import { config } from "dotenv";
import fetch from "node-fetch";

config();
const ADD_URL =
  "https://warpcast.com/~/add-cast-action?actionType=post&name=CastVivaldi&icon=unmute&postUrl=https%3A%2F%2Fcastvivaldi.xyz%2F";

const ACCOUNT_PRIVATE_KEY: string = process.env.ACCOUNT_PRIVATE_KEY; // Your account key's private key
const FID = 490410; // Your fid
const ed25519Signer = new NobleEd25519Signer(ACCOUNT_PRIVATE_KEY);
const dataOptions = {
  fid: FID,
  network: FC_NETWORK,
};
const FC_NETWORK = FarcasterNetwork.MAINNET;

export const app = new Frog({
  apiKey: process.env.AIRSTACK_API_KEY as string,
  basePath: "/api",
  browserLocation: ADD_URL,
});

// Cast action handler
app.hono.post("/action", async (c) => {
  const body = await c.req.json();
  // validate the cast action
  const { isValid, message } = await validateFramesMessage(body);
  const interactorFid = message?.data?.fid;
  const castFid = message?.data.frameActionBody.castId?.id;
  // get cast hash
  const hash = hexStringToBytes(base64FromBytes(castFid?.hash as Uint8Array));
  if (isValid && castFid) {
    // generate music based on the text in the cast
    const text = body.data.text; // Send the text in the cast - Test here is killing me.
    const response = await fetch(process.env.AUDIO_GEN_API, {
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
      }), // send the text as the body of the request
    });
    const musicData = await response.json(); // get the response data
    // create the cast informing initiation reply under the thread
    const castReplyResult = await makeCastAdd(
      {
        text: "Generating Song from Cast",
        embeds: [{ url: musicData.url }], // add music URL here
        embedsDeprecated: [],
        mentions: [interactorFid],
        mentionsPositions: [], // need to add FID mentions position
        parentCastId: {
          fid: castFid?.id,
          hash,
        },
      },
      dataOptions,
      ed25519Signer
    );

    // create the cast reply under the thread
    const castReplyResult = await makeCastAdd(
      {
        text: "Here's your Song!   ",
        embeds: [
          { url: "#song/3b3ebc12-fc09-4d69-ac21-efd13423e534" }, //test
        ], // add audio URL here
        embedsDeprecated: [],
        mentions: [interactorFid], // need to add FID mentions position
        mentionsPositions: [19], // need to add FID mentions position
        parentCastId: {
          fid: castFid?.id,
          hash,
        },
      },
      dataOptions,
      ed25519Signer
    );
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
    return c.json({ message: "Success" });
  } else {
    return c.json({ message: "Unauthorized" }, 401);
  }
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
