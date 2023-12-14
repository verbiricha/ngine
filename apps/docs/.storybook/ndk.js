import NDK from "@nostr-dev-kit/ndk"
import NDKCacheAdapterDexie from "@nostr-dev-kit/ndk-cache-dexie";

const cacheAdapter = new NDKCacheAdapterDexie({ dbName: "storybook" });
const ndk = new NDK({
  explicitRelayUrls: ["wss://nos.lol", "wss://relay.nostr.band"],
  outboxRelayUrls: ["wss://purplepag.es"],
  enableOutboxModel: true,
  cacheAdapter,
})

let isConnected = false;

if (!isConnected) {
  ndk.connect().then(function(){
    isConnected = true;
  });
}

export default ndk
